import type { Metadata } from "next";
import Link from "next/link";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import { CAPFRAME_GITHUB, CAPFRAME_VERSION } from "@/lib/version";
import { Footer, Header, StatusBar, formatDate } from "./_components";
import { FilterableTable } from "./_filter";

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

          <div className="mt-8 flex items-center gap-3 mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
            <Link
              href="/leaderboard/movers"
              className="rounded border border-[var(--color-line)] hover:border-[var(--color-line-hover)] bg-[var(--color-bg-2)]/30 hover:text-[var(--color-fg)] px-3 py-1.5"
            >
              § biggest movers →
            </Link>
            <span>diff vs. previous scan</span>
          </div>

          <FilterableTable rows={board.rows} />

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
