import type { Metadata } from "next";
import Link from "next/link";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import type {
  Finding,
  Row,
  Severity,
  SeverityCounts,
} from "@/lib/leaderboard/types";
import { CAPFRAME_GITHUB, CAPFRAME_VERSION } from "@/lib/version";

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
      <Header />
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

  // Servers with no findings render as a plain non-clickable row.
  if (!hasDetails) {
    return (
      <div className="grid grid-cols-[1fr_5.5rem_3.5rem_5.5rem] sm:grid-cols-[2.5rem_1fr_5.5rem_3.5rem_5.5rem_4.5rem_5rem] gap-3 px-4 py-3 items-center rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/20">
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
      </div>
    );
  }

  // Servers with findings render as a <details> so the row is
  // expandable to show every finding. No JS — uses native disclosure.
  return (
    <details
      className="group rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/30 hover:border-[var(--color-line-hover)] transition-colors"
      id={`server-${slugifyHandle(row.handle)}`}
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
      </div>
    </details>
  );
}

function FindingsList({ findings }: { findings: Finding[] }) {
  // Sort by severity desc so the most important ones are at the top.
  const order: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };
  const sorted = [...findings].sort(
    (a, b) => order[a.severity] - order[b.severity],
  );
  return (
    <ol className="mt-3 space-y-2.5">
      {sorted.map((f) => (
        <li
          key={f.id}
          className="grid grid-cols-[5rem_1fr] gap-3 items-baseline"
        >
          <SeverityChip severity={f.severity} />
          <div className="text-[0.92rem] text-[var(--color-fg-2)] leading-snug">
            <span className="text-[var(--color-fg)] font-medium">
              {f.title}
            </span>
            {f.tool && (
              <span className="mono text-[11px] text-[var(--color-fg-3)] ml-2">
                · {f.tool}
              </span>
            )}
            {f.category && (
              <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-accent-3)] ml-2">
                {f.category.replace(/_/g, " ")}
              </span>
            )}
            {f.description && (
              <p className="mt-1 text-[0.88rem] text-[var(--color-fg-3)]">
                {f.description}
              </p>
            )}
            {f.remediation && (
              <p className="mt-1.5 text-[0.85rem] text-[var(--color-fg-3)]">
                <span className="text-[var(--color-accent-3)] mono text-[10px] uppercase tracking-[0.14em]">
                  fix:
                </span>{" "}
                {f.remediation}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function SeverityChip({ severity }: { severity: Severity }) {
  const color = {
    critical: "text-red-400 border-red-400/40 bg-red-400/5",
    high: "text-amber-300 border-amber-300/40 bg-amber-300/5",
    medium: "text-[var(--color-accent-3)] border-[var(--color-accent-3)]/40",
    low: "text-[var(--color-fg-3)] border-[var(--color-fg-3)]/40",
    info: "text-[var(--color-fg-3)] border-[var(--color-fg-3)]/40",
  }[severity];
  return (
    <span
      className={`mono text-[10px] uppercase tracking-[0.14em] inline-block px-2 py-0.5 rounded border text-center ${color}`}
    >
      {severity}
    </span>
  );
}

function slugifyHandle(handle: string): string {
  return handle.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
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

function ScoreBadge({ score, max }: { score: number; max: number }) {
  const tier = scoreTier(score, max);
  const colorClass = {
    A: "text-[var(--color-accent)] border-[var(--color-accent)]/40",
    B: "text-[var(--color-accent-3)] border-[var(--color-accent-3)]/40",
    C: "text-amber-300 border-amber-300/40",
    D: "text-red-400 border-red-400/40",
  }[tier];
  return (
    <span
      className={`mono text-[12px] tabular-nums tracking-[0.05em] inline-flex items-baseline gap-1 px-2 py-1 rounded border ${colorClass}`}
    >
      <span className="text-[10px] uppercase opacity-60">{tier}</span>
      {score}
    </span>
  );
}

function scoreTier(score: number, max: number): "A" | "B" | "C" | "D" {
  const pct = (score / max) * 100;
  if (pct >= 95) return "A";
  if (pct >= 80) return "B";
  if (pct >= 50) return "C";
  return "D";
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

function FindingsCell({ counts }: { counts: SeverityCounts }) {
  const total =
    counts.critical + counts.high + counts.medium + counts.low + counts.info;
  if (total === 0) {
    return (
      <span className="mono text-[11px] text-[var(--color-fg-3)]">
        — clean —
      </span>
    );
  }
  return (
    <div className="inline-flex items-baseline gap-2 mono text-[11px] tabular-nums">
      {counts.critical > 0 && (
        <span className="text-red-400">{counts.critical}C</span>
      )}
      {counts.high > 0 && (
        <span className="text-amber-300">{counts.high}H</span>
      )}
      {counts.medium > 0 && (
        <span className="text-[var(--color-accent-3)]">{counts.medium}M</span>
      )}
      {counts.low > 0 && (
        <span className="text-[var(--color-fg-3)]">{counts.low}L</span>
      )}
    </div>
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

function formatDate(iso: string): string {
  // Render YYYY-MM-DD regardless of locale so the SSR output is
  // deterministic and the cron-published timestamp shows cleanly.
  return iso.slice(0, 10);
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Reused chrome                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

function StatusBar() {
  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-bg-2)]/60 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg-2)]/40">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-2.5 flex items-center justify-between mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--color-fg-3)]">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-2">
            <span className="pulse" /> {CAPFRAME_VERSION} · live
          </span>
          <span className="hidden sm:inline">MIT</span>
          <span className="hidden sm:inline">Rust 1.78+</span>
          <span className="hidden md:inline">MCP-native</span>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-bg)]/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="mono text-[13px] tracking-[0.18em]">
          CAPFRAME
        </Link>
        <nav className="flex items-center gap-6 mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
          <Link href="/blog" className="hover:text-[var(--color-fg)]">
            Blog
          </Link>
          <Link
            href="/leaderboard"
            className="text-[var(--color-fg)]"
            aria-current="page"
          >
            Leaderboard
          </Link>
          <Link
            href={CAPFRAME_GITHUB}
            className="hover:text-[var(--color-fg)]"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-16">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 text-[var(--color-fg-3)] mono text-[11px] tracking-[0.14em] uppercase">
        <p>
          Capframe · open source · MIT · {new Date().getFullYear()} ·{" "}
          <Link href={CAPFRAME_GITHUB} className="hover:text-[var(--color-fg)]">
            {CAPFRAME_GITHUB.replace("https://", "")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
