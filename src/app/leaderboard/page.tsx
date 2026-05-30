import type { Metadata } from "next";
import Link from "next/link";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import type { Row, SeverityCounts } from "@/lib/leaderboard/types";
import { CAPFRAME_GITHUB, CAPFRAME_VERSION } from "@/lib/version";
import {
  FindingsCell,
  FindingsList,
  Footer,
  Header,
  ScoreBadge,
  StatusBar,
  formatDate,
  slugifyHandle,
} from "./_components";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Public security leaderboard for the MCP server ecosystem. Every server is graded against deterministic capframe.findings.v1 rules — score 100 is a clean surface, 0 is unbounded authority.",
  alternates: { canonical: "/leaderboard" },
};

export default async function LeaderboardPage() {
  const board = await loadLeaderboard();
  const generatedDate = formatDate(board.generated_at);

  return (
    <>
      <StatusBar />
      <Header activePage="leaderboard" />
      <main className="px-6 sm:px-10 lg:px-16">
        <section className="max-w-[1100px] mx-auto pt-16 sm:pt-24 pb-24">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § leaderboard
            </span>
            <span className="label">capframe.leaderboard.v1</span>
          </div>
          <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            The MCP security leaderboard.
          </h1>
          <p className="mt-6 text-[1.02rem] text-[var(--color-fg-2)] max-w-[44rem]">
            Every published MCP server, graded against the deterministic
            capframe rule engine. Score{" "}
            <span className="text-[var(--color-accent)] font-medium">100</span>{" "}
            is a clean surface; every Critical finding takes{" "}
            <span className="text-[var(--color-accent-3)]">10 points</span>.
            High <span className="text-[var(--color-accent-3)]">4</span>, Medium{" "}
            <span className="text-[var(--color-accent-3)]">2</span>, Low{" "}
            <span className="text-[var(--color-accent-3)]">1</span>. No black
            boxes — the formula is public, the rules are{" "}
            <Link
              href={`${CAPFRAME_GITHUB}/blob/main/schemas/findings.v1.json`}
              className="underline decoration-[var(--color-accent-3)] underline-offset-2 hover:text-[var(--color-accent)]"
            >
              open-source
            </Link>
            .
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
            <Stat label="Servers scanned" value={String(board.total_scanned)} />
            <Stat label="Generated" value={generatedDate} />
            <Stat label="Scanner" value={`mcp-recon ${CAPFRAME_VERSION}`} />
            <Stat label="Schema" value="findings.v2" />
          </div>

          <Table rows={board.rows} />

          <div className="mt-12 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-5 text-[0.92rem] text-[var(--color-fg-2)]">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-2">
              How to read this
            </p>
            <p>
              The leaderboard is rebuilt daily from a corpus of npm and PyPI
              MCP packages. Servers with{" "}
              <span className="text-[var(--color-fg)]">live HTTP endpoints</span>{" "}
              are graded against every rule (R1–R7); servers reached via{" "}
              <span className="text-[var(--color-fg)]">static manifest</span>{" "}
              are graded against the name/description rules (R3, R5, R6, R7)
              with parameter-schema rules deferred until a sandbox producer ships.
            </p>
            <p className="mt-3">
              Want your server included or rescored?{" "}
              <Link
                href={`${CAPFRAME_GITHUB}/issues/new?title=leaderboard%3A%20rescore%20request`}
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

/* ────────────────────────────────────────────────────────────────────────── */
/* Table                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

function Table({ rows }: { rows: Row[] }) {
  return (
    <div className="mt-12 space-y-1.5">
      <div className="hidden sm:grid grid-cols-[2.5rem_1fr_5.5rem_3.5rem_5.5rem_4.5rem_5rem] gap-3 px-4 py-3 mono uppercase tracking-[0.14em] text-[10.5px] text-[var(--color-fg-3)] border-b border-[var(--color-line)]">
        <span>#</span>
        <span>Server</span>
        <span className="text-right">Score</span>
        <span className="text-right">Tools</span>
        <span className="text-right">Findings</span>
        <span className="text-right hidden md:inline">Source</span>
        <span className="text-right hidden lg:inline">Last scan</span>
      </div>
      {rows.map((row, i) => (
        <ServerRow key={row.handle} row={row} index={i + 1} />
      ))}
    </div>
  );
}

function ServerRow({ row, index }: { row: Row; index: number }) {
  const hasDetails = (row.findings?.length ?? 0) > 0;
  const slug = slugifyHandle(row.handle);
  const detailHref = `/leaderboard/${slug}`;

  // Servers with no findings render as a row linking to the detail page.
  if (!hasDetails) {
    return (
      <Link
        href={detailHref}
        className="grid grid-cols-[1fr_5.5rem_3.5rem_5.5rem] sm:grid-cols-[2.5rem_1fr_5.5rem_3.5rem_5.5rem_4.5rem_5rem] gap-3 px-4 py-3 items-center rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/20 hover:border-[var(--color-line-hover)] transition-colors"
      >
        <span className="hidden sm:inline mono text-[11px] text-[var(--color-fg-3)] tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <ServerCell row={row} />
        <span className="text-right">
          <ScoreBadge score={row.score} max={100} />
        </span>
        <span className="text-right">
          <ToolsCell count={row.tool_count} />
        </span>
        <span className="text-right">
          <FindingsCell counts={row.counts} />
        </span>
        <span className="text-right hidden md:inline mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
          {row.source}
        </span>
        <span className="text-right hidden lg:inline mono text-[11px] text-[var(--color-fg-3)] tabular-nums">
          {formatDate(row.last_scanned)}
        </span>
      </Link>
    );
  }

  // Servers with findings render as <details> for inline expand + a
  // "view all" link inside that jumps to the per-server detail page.
  return (
    <details
      className="group rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/30 hover:border-[var(--color-line-hover)] transition-colors"
      id={`server-${slug}`}
    >
      <summary className="grid grid-cols-[1fr_5.5rem_3.5rem_5.5rem] sm:grid-cols-[2.5rem_1fr_5.5rem_3.5rem_5.5rem_4.5rem_5rem] gap-3 px-4 py-3 items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="hidden sm:inline mono text-[11px] text-[var(--color-fg-3)] tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <ServerCell row={row} expandable />
        <span className="text-right">
          <ScoreBadge score={row.score} max={100} />
        </span>
        <span className="text-right">
          <ToolsCell count={row.tool_count} />
        </span>
        <span className="text-right">
          <FindingsCell counts={row.counts} />
        </span>
        <span className="text-right hidden md:inline mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
          {row.source}
        </span>
        <span className="text-right hidden lg:inline mono text-[11px] text-[var(--color-fg-3)] tabular-nums">
          {formatDate(row.last_scanned)}
        </span>
      </summary>
      <div className="px-4 pb-4 pt-1 border-t border-[var(--color-line)] mt-2">
        <FindingsList findings={row.findings ?? []} />
        <Link
          href={detailHref}
          className="inline-flex items-center gap-2 mt-4 mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-accent-3)] hover:text-[var(--color-accent)]"
        >
          Open full report
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </details>
  );
}

function ServerCell({ row, expandable }: { row: Row; expandable?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-[var(--color-fg)] flex items-center gap-2">
        {row.name ?? row.handle}
        {expandable && (
          <span
            className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-3)] group-open:text-[var(--color-accent)]"
            aria-hidden="true"
          >
            <span className="group-open:hidden">▸ details</span>
            <span className="hidden group-open:inline">▾ hide</span>
          </span>
        )}
      </span>
      <span className="mono text-[11px] text-[var(--color-fg-3)] truncate">
        {row.handle}
      </span>
    </div>
  );
}

function ToolsCell({ count }: { count?: number }) {
  if (count === undefined) {
    return (
      <span className="mono text-[11px] text-[var(--color-fg-3)]">—</span>
    );
  }
  // Tier color shows producer maturity at a glance: 20+ tools = README
  // was fully parsed; 5-19 = good extraction; 0-4 = sparse / fallback.
  const color =
    count >= 20
      ? "text-[var(--color-accent)]"
      : count >= 5
        ? "text-[var(--color-accent-3)]"
        : "text-[var(--color-fg-3)]";
  return (
    <span className={`mono text-[12px] tabular-nums ${color}`}>{count}</span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--color-line)] rounded-md p-3 bg-[var(--color-bg-2)]/30">
      <div className="text-[var(--color-fg-3)]">{label}</div>
      <div className="mt-1 text-[var(--color-fg)] text-[13px] tracking-[0.06em] truncate">
        {value}
      </div>
    </div>
  );
}
