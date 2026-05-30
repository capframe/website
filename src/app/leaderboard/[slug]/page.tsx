import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import type { Row } from "@/lib/leaderboard/types";
import { CAPFRAME_GITHUB } from "@/lib/version";
import {
  FindingsList,
  Footer,
  Header,
  ScoreBadge,
  StatusBar,
  formatDate,
  scoreTier,
  slugifyHandle,
  sortFindingsBySeverity,
} from "../_components";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const board = await loadLeaderboard();
  return board.rows.map((row) => ({ slug: slugifyHandle(row.handle) }));
}

async function findRow(slug: string): Promise<Row | null> {
  const board = await loadLeaderboard();
  return board.rows.find((r) => slugifyHandle(r.handle) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await findRow(slug);
  if (!row) {
    return { title: "Server not found" };
  }
  const name = row.name ?? row.handle.split(/[/:]/).pop() ?? row.handle;
  const tier = scoreTier(row.score, 100);
  const findingsCount =
    row.counts.critical +
    row.counts.high +
    row.counts.medium +
    row.counts.low +
    row.counts.info;
  const description =
    findingsCount === 0
      ? `MCP security report for ${name} (${row.handle}). Score ${row.score}/100 (${tier}) — clean surface against the capframe rule engine.`
      : `MCP security report for ${name} (${row.handle}). Score ${row.score}/100 (${tier}) — ${findingsCount} finding${findingsCount === 1 ? "" : "s"} (${row.counts.critical}C / ${row.counts.high}H / ${row.counts.medium}M / ${row.counts.low}L). Source: ${row.source}.`;
  return {
    title: `${name} · MCP security report`,
    description,
    alternates: { canonical: `/leaderboard/${slug}` },
    openGraph: {
      title: `${name} · ${row.score}/100 · capframe leaderboard`,
      description,
      type: "article",
    },
  };
}

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const row = await findRow(slug);
  if (!row) {
    notFound();
  }

  const name = row.name ?? row.handle.split(/[/:]/).pop() ?? row.handle;
  const findings = row.findings ?? [];
  const findingsCount =
    row.counts.critical +
    row.counts.high +
    row.counts.medium +
    row.counts.low +
    row.counts.info;
  const board = await loadLeaderboard();
  const rank =
    board.rows.findIndex((r) => slugifyHandle(r.handle) === slug) + 1;
  const sortedFindings = sortFindingsBySeverity(findings);
  const worst = sortedFindings[0];

  return (
    <>
      <StatusBar />
      <Header activePage="leaderboard" />
      <main className="px-6 sm:px-10 lg:px-16">
        <section className="max-w-[920px] mx-auto pt-12 sm:pt-16 pb-24">
          {/* Breadcrumb */}
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-3)] mb-6">
            <Link
              href="/leaderboard"
              className="hover:text-[var(--color-fg)]"
            >
              ← leaderboard
            </Link>
            <span className="mx-3 opacity-50">/</span>
            <span className="text-[var(--color-fg-3)]">
              rank #{String(rank).padStart(2, "0")}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-baseline gap-3 mb-3">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § server
            </span>
            <span className="label">{row.source}</span>
            <span className="label">findings.v2</span>
          </div>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            {name}
          </h1>
          <p className="mt-3 mono text-[13px] text-[var(--color-fg-3)] break-all">
            {row.handle}
          </p>
          {row.repo_url && (
            <p className="mt-2 mono text-[11px] uppercase tracking-[0.14em]">
              <Link
                href={row.repo_url}
                className="text-[var(--color-accent-3)] hover:text-[var(--color-accent)] underline-offset-2"
              >
                {row.repo_url.replace(/^https?:\/\//, "")}
              </Link>
            </p>
          )}

          {/* Score panel */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Score">
              <ScoreBadge score={row.score} max={100} />
            </Stat>
            <Stat label="Findings">
              <span className="mono text-[14px] tabular-nums">
                {findingsCount === 0 ? "— clean —" : findingsCount}
              </span>
            </Stat>
            <Stat label="Tools">
              <span className="mono text-[14px] tabular-nums">
                {row.tool_count ?? "—"}
              </span>
            </Stat>
            <Stat label="Last scan">
              <span className="mono text-[13px] tabular-nums">
                {formatDate(row.last_scanned)}
              </span>
            </Stat>
          </div>

          {/* Severity breakdown */}
          {findingsCount > 0 && (
            <div className="mt-6 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-5">
              <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-3">
                Severity breakdown
              </p>
              <div className="flex flex-wrap gap-4 mono text-[13px] tabular-nums">
                <SeverityStat
                  label="Critical"
                  value={row.counts.critical}
                  color="text-red-400"
                />
                <SeverityStat
                  label="High"
                  value={row.counts.high}
                  color="text-amber-300"
                />
                <SeverityStat
                  label="Medium"
                  value={row.counts.medium}
                  color="text-[var(--color-accent-3)]"
                />
                <SeverityStat
                  label="Low"
                  value={row.counts.low}
                  color="text-[var(--color-fg-3)]"
                />
                <SeverityStat
                  label="Info"
                  value={row.counts.info}
                  color="text-[var(--color-fg-3)]"
                />
              </div>
            </div>
          )}

          {/* Worst finding callout (helps the page tell its own story) */}
          {worst && (
            <div className="mt-6 rounded-md border border-red-400/30 bg-red-400/[0.03] p-5">
              <p className="mono text-[11px] uppercase tracking-[0.18em] text-red-300/80 mb-2">
                Worst finding
              </p>
              <p className="text-[var(--color-fg)] font-medium text-[1.02rem]">
                {worst.title}
              </p>
              {worst.tool && (
                <p className="mt-1 mono text-[11px] text-[var(--color-fg-3)]">
                  · {worst.tool}
                </p>
              )}
              {worst.description && (
                <p className="mt-2 text-[0.93rem] text-[var(--color-fg-2)]">
                  {worst.description}
                </p>
              )}
              {worst.remediation && (
                <p className="mt-3 text-[0.9rem] text-[var(--color-fg-2)]">
                  <span className="text-[var(--color-accent-3)] mono text-[10px] uppercase tracking-[0.14em]">
                    fix:
                  </span>{" "}
                  {worst.remediation}
                </p>
              )}
            </div>
          )}

          {/* All findings */}
          <div className="mt-10">
            <h2 className="text-[1.4rem] font-semibold tracking-[-0.02em] mb-2">
              {findingsCount === 0
                ? "No findings"
                : `All ${findingsCount} finding${findingsCount === 1 ? "" : "s"}`}
            </h2>
            {findingsCount === 0 ? (
              <p className="text-[var(--color-fg-2)] text-[0.95rem]">
                The classifier found no rule violations on this server's
                advertised tool surface against the public capframe rules
                (R1–R7). A clean score means the surface looks tight to the
                rule engine — it does <em>not</em> mean the implementation is
                audited.
              </p>
            ) : (
              <FindingsList findings={findings} />
            )}
          </div>

          {/* How this was scored */}
          <div className="mt-12 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-5 text-[0.92rem] text-[var(--color-fg-2)]">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-2">
              How this was scored
            </p>
            <p>
              Source <span className="text-[var(--color-fg)]">{row.source}</span>{" "}
              — {sourceBlurb(row.source)}. Findings are emitted by{" "}
              <Link
                href={`${CAPFRAME_GITHUB}/blob/main/schemas/findings.v1.json`}
                className="underline decoration-[var(--color-accent-3)] underline-offset-2 hover:text-[var(--color-accent)]"
              >
                the public capframe.findings.v1 schema
              </Link>
              . Score = 100 − (10·Critical + 4·High + 2·Medium + 1·Low),
              clamped to [0, 100].
            </p>
            <p className="mt-3">
              Disagree with a finding?{" "}
              <Link
                href={`${CAPFRAME_GITHUB}/issues/new?title=leaderboard%3A%20${encodeURIComponent(row.handle)}%20rescore%20request&body=${encodeURIComponent("Server: " + row.handle + "\nWhat's wrong:\n")}`}
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

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--color-line)] rounded-md p-3 bg-[var(--color-bg-2)]/30">
      <div className="mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SeverityStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
        {label}
      </span>
      <span className={`mono text-[15px] tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

function sourceBlurb(source: Row["source"]): string {
  switch (source) {
    case "sandbox":
      return "live tools/list captured in an ephemeral Docker container (parameter schemas included → R1/R2/R4 fire)";
    case "registry":
      return "tool surface extracted from the package's README + manifest (R3/R5/R6/R7 fire; schema-dependent rules deferred)";
    case "http":
      return "live HTTP MCP endpoint, classified against every rule";
    case "file":
      return "hand-authored inventory, not produced by a registry walk";
    default:
      return "";
  }
}
