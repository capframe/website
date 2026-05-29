import type { Metadata } from "next";
import Link from "next/link";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import type { Row, SeverityCounts } from "@/lib/leaderboard/types";
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
    <div className="mt-12 overflow-x-auto rounded-md border border-[var(--color-line)]">
      <table className="w-full border-collapse text-[0.92rem]">
        <thead>
          <tr className="border-b border-[var(--color-line)] bg-[var(--color-bg-2)]/60 mono uppercase tracking-[0.14em] text-[10.5px] text-[var(--color-fg-3)]">
            <th className="text-left py-3 px-4">#</th>
            <th className="text-left py-3 px-4">Server</th>
            <th className="text-right py-3 px-4">Score</th>
            <th className="text-right py-3 px-4 hidden sm:table-cell">
              Findings
            </th>
            <th className="text-right py-3 px-4 hidden md:table-cell">
              Source
            </th>
            <th className="text-right py-3 px-4 hidden lg:table-cell">
              Last scan
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.handle}
              className="border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-bg-2)]/30 transition-colors"
            >
              <td className="py-3 px-4 mono text-[11px] text-[var(--color-fg-3)] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </td>
              <td className="py-3 px-4">
                <ServerCell row={row} />
              </td>
              <td className="py-3 px-4 text-right">
                <ScoreBadge score={row.score} max={100} />
              </td>
              <td className="py-3 px-4 text-right hidden sm:table-cell">
                <FindingsCell counts={row.counts} />
              </td>
              <td className="py-3 px-4 text-right hidden md:table-cell mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
                {row.source}
              </td>
              <td className="py-3 px-4 text-right hidden lg:table-cell mono text-[11px] text-[var(--color-fg-3)] tabular-nums">
                {formatDate(row.last_scanned)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServerCell({ row }: { row: Row }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-[var(--color-fg)]">
        {row.name ?? row.handle}
      </span>
      <span className="mono text-[11px] text-[var(--color-fg-3)]">
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
