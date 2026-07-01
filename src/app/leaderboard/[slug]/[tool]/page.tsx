import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import type { Finding, Row, Severity } from "@/lib/leaderboard/types";
import { CAPFRAME_GITHUB } from "@/lib/version";
import {
  Footer,
  Header,
  SeverityChip,
  StatusBar,
  formatDate,
  slugifyHandle,
  sortFindingsBySeverity,
} from "../../_components";

type Params = { slug: string; tool: string };

/** Tool slug — mirror server slug rules so URLs are consistent. */
function slugifyTool(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}

interface ToolCard {
  toolName: string;
  toolSlug: string;
  findings: Finding[];
  row: Row;
}

async function allCards(): Promise<ToolCard[]> {
  const board = await loadLeaderboard();
  const out: ToolCard[] = [];
  for (const row of board.rows) {
    if (!row.findings?.length) continue;
    // Group findings by `tool` attribution. Findings without a tool
    // are server-level (R6, schema-level) and don't get tool pages.
    const byTool = new Map<string, Finding[]>();
    for (const f of row.findings) {
      if (!f.tool) continue;
      const list = byTool.get(f.tool) ?? [];
      list.push(f);
      byTool.set(f.tool, list);
    }
    for (const [toolName, findings] of byTool) {
      out.push({
        toolName,
        toolSlug: slugifyTool(toolName),
        findings,
        row,
      });
    }
  }
  return out;
}

export async function generateStaticParams(): Promise<Params[]> {
  const cards = await allCards();
  return cards.map((c) => ({
    slug: slugifyHandle(c.row.handle),
    tool: c.toolSlug,
  }));
}

async function findCard(
  slug: string,
  tool: string,
): Promise<ToolCard | null> {
  const cards = await allCards();
  return (
    cards.find(
      (c) => slugifyHandle(c.row.handle) === slug && c.toolSlug === tool,
    ) ?? null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, tool } = await params;
  const card = await findCard(slug, tool);
  if (!card) return { title: "Tool not found" };
  const serverName =
    card.row.name ?? card.row.handle.split(/[/:]/).pop() ?? card.row.handle;
  const worst = card.findings.reduce((acc: Severity, f) => {
    const order: Severity[] = ["info", "low", "medium", "high", "critical"];
    return order.indexOf(f.severity) > order.indexOf(acc) ? f.severity : acc;
  }, "info");
  const description = `Security findings for the \`${card.toolName}\` MCP tool on ${serverName}. ${card.findings.length} finding${card.findings.length === 1 ? "" : "s"} (worst: ${worst}). Source: ${card.row.source}.`;
  return {
    title: `${card.toolName} · ${serverName} · MCP security report`,
    description,
    alternates: { canonical: `/leaderboard/${slug}/${tool}` },
    openGraph: {
      title: `${card.toolName} · ${serverName} · capframe`,
      description,
      type: "article",
    },
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, tool } = await params;
  const card = await findCard(slug, tool);
  if (!card) notFound();

  const serverName =
    card.row.name ?? card.row.handle.split(/[/:]/).pop() ?? card.row.handle;
  const sorted = sortFindingsBySeverity(card.findings);
  const counts = sorted.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] ?? 0) + 1;
      return acc;
    },
    {} as Record<Severity, number>,
  );

  return (
    <>
      <StatusBar />
      <Header activePage="leaderboard" />
      <main className="px-6 sm:px-10 lg:px-16">
        <section className="max-w-[860px] mx-auto pt-10 sm:pt-14 pb-24">
          {/* Breadcrumb */}
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-3)] mb-6 flex flex-wrap items-center gap-2">
            <Link
              href="/leaderboard"
              className="hover:text-[var(--color-fg)]"
            >
              ← leaderboard
            </Link>
            <span className="opacity-50">/</span>
            <Link
              href={`/leaderboard/${slug}`}
              className="hover:text-[var(--color-fg)]"
            >
              {serverName}
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-[var(--color-fg-3)]">
              tool · {card.toolName}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § tool
            </span>
            <span className="label">{card.row.source}</span>
            <Link
              href={`/leaderboard/${slug}`}
              className="label hover:text-[var(--color-fg)]"
            >
              {serverName}
            </Link>
          </div>
          <h1 className="font-mono text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-[-0.02em] leading-[1.1] break-words">
            {card.toolName}
          </h1>
          <p className="mt-3 mono text-[12.5px] text-[var(--color-fg-3)] break-all">
            on {card.row.handle}
          </p>

          {/* Severity row */}
          <div className="mt-8 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-4">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-3">
              Severity
            </p>
            <div className="flex flex-wrap gap-3 mono text-[13px] tabular-nums">
              {(
                ["critical", "high", "medium", "low", "info"] as Severity[]
              ).map((s) => (
                <SeverityCount key={s} severity={s} n={counts[s] ?? 0} />
              ))}
            </div>
          </div>

          {/* Findings */}
          <div className="mt-10">
            <h2 className="text-[1.4rem] font-semibold tracking-[-0.02em] mb-3">
              {card.findings.length} finding
              {card.findings.length === 1 ? "" : "s"} on this tool
            </h2>
            <ol className="space-y-4">
              {sorted.map((f) => (
                <li
                  key={f.id}
                  className="rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/30 p-4"
                >
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <SeverityChip severity={f.severity} />
                    <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-accent-3)]">
                      {f.category.replace(/_/g, " ")}
                    </span>
                    <span className="mono text-[10.5px] text-[var(--color-fg-3)]">
                      {f.id}
                    </span>
                  </div>
                  <p className="mt-2 text-[var(--color-fg)] font-medium text-[1.02rem]">
                    {f.title}
                  </p>
                  {f.description && (
                    <p className="mt-2 text-[0.93rem] text-[var(--color-fg-2)] leading-snug">
                      {f.description}
                    </p>
                  )}
                  {f.remediation && (
                    <p className="mt-3 text-[0.9rem] text-[var(--color-fg-2)]">
                      <span className="text-[var(--color-accent-3)] mono text-[10px] uppercase tracking-[0.14em]">
                        fix:
                      </span>{" "}
                      {f.remediation}
                    </p>
                  )}
                  {(f.mappings?.owasp_llm?.length ||
                    f.mappings?.nist_rmf?.length ||
                    f.mappings?.mitre_atlas?.length ||
                    f.cast_category?.length) && (
                    <div className="mt-3 flex flex-wrap gap-2 mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
                      {f.mappings?.owasp_llm?.map((m) => (
                        <MappingChip key={`owasp-${m}`}>OWASP {m}</MappingChip>
                      ))}
                      {f.mappings?.nist_rmf?.map((m) => (
                        <MappingChip key={`nist-${m}`}>NIST {m}</MappingChip>
                      ))}
                      {f.mappings?.mitre_atlas?.map((m) => (
                        <MappingChip key={`atlas-${m}`}>ATLAS {m}</MappingChip>
                      ))}
                      {f.cast_category?.map((c) => (
                        <MappingChip key={`cast-${c}`} tone="cast">
                          {c}
                        </MappingChip>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* How this was scored / parent context */}
          <div className="mt-12 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-5 text-[0.92rem] text-[var(--color-fg-2)]">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-2">
              About this tool
            </p>
            <p>
              <code className="mono text-[var(--color-fg)]">
                {card.toolName}
              </code>{" "}
              is one of {card.row.tool_count ?? "—"} tools exposed by{" "}
              <Link
                href={`/leaderboard/${slug}`}
                className="underline decoration-[var(--color-accent-3)] underline-offset-2 hover:text-[var(--color-accent)]"
              >
                {serverName}
              </Link>
              . The server scored{" "}
              <span className="text-[var(--color-fg)]">
                {card.row.score}/100
              </span>{" "}
              overall against the capframe rule engine (source:{" "}
              <span className="text-[var(--color-fg)]">{card.row.source}</span>
              ). Last scanned {formatDate(card.row.last_scanned)}.
            </p>
            <p className="mt-3">
              The findings above are emitted by the public{" "}
              <Link
                href={`${CAPFRAME_GITHUB}/blob/main/schemas/findings.v1.json`}
                className="underline decoration-[var(--color-accent-3)] underline-offset-2 hover:text-[var(--color-accent)]"
              >
                capframe.findings.v1 schema
              </Link>
              . Disagree with one?{" "}
              <Link
                href={`${CAPFRAME_GITHUB}/issues/new?title=leaderboard%3A%20${encodeURIComponent(card.row.handle)}%20tool%20${encodeURIComponent(card.toolName)}%20rescore`}
                className="underline decoration-[var(--color-accent-3)] underline-offset-2 hover:text-[var(--color-accent)]"
              >
                Open an issue
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SeverityCount({ severity, n }: { severity: Severity; n: number }) {
  const color = {
    critical: "text-red-400",
    high: "text-amber-300",
    medium: "text-[var(--color-accent-3)]",
    low: "text-[var(--color-fg-3)]",
    info: "text-[var(--color-fg-3)]",
  }[severity];
  const labelColor = n === 0 ? "text-[var(--color-fg-3)]/60" : color;
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={`mono text-[10.5px] uppercase tracking-[0.14em] ${labelColor}`}
      >
        {severity}
      </span>
      <span className={`mono text-[15px] tabular-nums ${color}`}>{n}</span>
    </div>
  );
}

function MappingChip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "cast";
}) {
  return (
    <span
      className={
        tone === "cast"
          ? "px-1.5 py-0.5 rounded border border-[var(--color-accent-3)]/40 text-[var(--color-accent-3)]"
          : "px-1.5 py-0.5 rounded border border-[var(--color-line)] text-[var(--color-fg-3)]"
      }
    >
      {children}
    </span>
  );
}
