import type { Metadata } from "next";
import Link from "next/link";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import { loadMostRecentSnapshot } from "@/lib/leaderboard/history";
import type { Leaderboard, Row } from "@/lib/leaderboard/types";
import {
  Footer,
  Header,
  ScoreBadge,
  StatusBar,
  formatDate,
  scoreTier,
  slugifyHandle,
} from "../_components";

export const metadata: Metadata = {
  title: "Biggest movers · MCP security leaderboard",
  description:
    "Which MCP servers improved or regressed since the last scan. Daily diff of capframe.ai/leaderboard, showing the biggest score changes, new entries, and any servers that dropped out of the corpus.",
  alternates: { canonical: "/leaderboard/movers" },
};

interface Mover {
  current: Row;
  previous: Row;
  delta: number;
}

interface Diff {
  movers: Mover[]; // ranked by abs(delta) desc, then by handle
  added: Row[]; // present in current, missing in previous
  removed: Row[]; // present in previous, missing in current
  unchanged: number;
}

function diff(current: Leaderboard, previous: Leaderboard): Diff {
  const prevMap = new Map(previous.rows.map((r) => [r.handle, r]));
  const currMap = new Map(current.rows.map((r) => [r.handle, r]));

  const movers: Mover[] = [];
  const added: Row[] = [];
  let unchanged = 0;
  for (const r of current.rows) {
    const prior = prevMap.get(r.handle);
    if (!prior) {
      added.push(r);
      continue;
    }
    const delta = r.score - prior.score;
    if (delta === 0) {
      unchanged++;
      continue;
    }
    movers.push({ current: r, previous: prior, delta });
  }
  const removed = previous.rows.filter((r) => !currMap.has(r.handle));

  movers.sort(
    (a, b) =>
      Math.abs(b.delta) - Math.abs(a.delta) ||
      a.current.handle.localeCompare(b.current.handle),
  );

  return { movers, added, removed, unchanged };
}

export default async function MoversPage() {
  const current = await loadLeaderboard();
  const prev = await loadMostRecentSnapshot();

  return (
    <>
      <StatusBar />
      <Header activePage="leaderboard" />
      <main className="px-6 sm:px-10 lg:px-16">
        <section className="max-w-[1100px] mx-auto pt-12 sm:pt-16 pb-24">
          {/* Breadcrumb */}
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-3)] mb-6">
            <Link
              href="/leaderboard"
              className="hover:text-[var(--color-fg)]"
            >
              ← leaderboard
            </Link>
            <span className="mx-3 opacity-50">/</span>
            <span className="text-[var(--color-fg-3)]">movers</span>
          </div>

          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § movers
            </span>
            <span className="label">capframe.leaderboard.v1</span>
          </div>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            Biggest movers.
          </h1>
          <p className="mt-4 text-[1rem] text-[var(--color-fg-2)] max-w-[44rem]">
            What changed on the MCP security leaderboard since the previous
            scan. Score deltas mean the same rule engine read the same servers
            and arrived at a different conclusion — usually because the server
            shipped, or our classifier did.
          </p>

          {/* Comparison metadata */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
            <Stat label="Current" value={formatDate(current.generated_at)} />
            <Stat
              label="Previous"
              value={
                prev ? formatDate(prev.board.generated_at) : "— first scan —"
              }
            />
            <Stat
              label="Comparison"
              value={
                prev
                  ? `${diff(current, prev.board).movers.length} moved`
                  : "no diff yet"
              }
            />
          </div>

          {prev ? (
            <MoversBody current={current} previous={prev.board} />
          ) : (
            <EmptyState />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function MoversBody({
  current,
  previous,
}: {
  current: Leaderboard;
  previous: Leaderboard;
}) {
  const { movers, added, removed, unchanged } = diff(current, previous);
  const risers = movers.filter((m) => m.delta > 0).slice(0, 15);
  const fallers = movers.filter((m) => m.delta < 0).slice(0, 15);

  return (
    <>
      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <MoverList
          title="Risers"
          subtitle="Improved score since last scan"
          accent="text-[var(--color-accent)]"
          movers={risers}
          empty="No improvements since the last scan."
        />
        <MoverList
          title="Fallers"
          subtitle="Worse score since last scan"
          accent="text-red-400"
          movers={fallers}
          empty="No regressions since the last scan."
        />
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        <RowList
          title={`Added (${added.length})`}
          subtitle="New on the leaderboard this run"
          accent="text-[var(--color-accent)]"
          rows={added}
          empty="None added this run."
        />
        <RowList
          title={`Removed (${removed.length})`}
          subtitle="Dropped out of the corpus this run"
          accent="text-[var(--color-fg-3)]"
          rows={removed}
          empty="None removed this run."
        />
      </div>

      <div className="mt-12 mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-3)]">
        {unchanged} unchanged · {movers.length} moved · {added.length} added ·{" "}
        {removed.length} removed
      </div>
    </>
  );
}

function MoverList({
  title,
  subtitle,
  accent,
  movers,
  empty,
}: {
  title: string;
  subtitle: string;
  accent: string;
  movers: Mover[];
  empty: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-2">
        <h2 className={`text-[1.3rem] font-semibold tracking-[-0.02em] ${accent}`}>
          {title}
        </h2>
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
          {subtitle}
        </span>
      </div>
      {movers.length === 0 ? (
        <p className="text-[0.92rem] text-[var(--color-fg-3)]">{empty}</p>
      ) : (
        <ol className="space-y-1.5">
          {movers.map((m) => (
            <li key={m.current.handle}>
              <Link
                href={`/leaderboard/${slugifyHandle(m.current.handle)}`}
                className="grid grid-cols-[1fr_auto_auto] gap-3 items-center rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/30 hover:border-[var(--color-line-hover)] px-3 py-2 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-medium text-[var(--color-fg)] truncate">
                    {m.current.name ?? m.current.handle}
                  </div>
                  <div className="mono text-[11px] text-[var(--color-fg-3)] truncate">
                    {m.current.handle}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mono text-[12px] text-[var(--color-fg-3)] tabular-nums">
                    {m.previous.score} →
                  </span>
                  <ScoreBadge score={m.current.score} max={100} />
                </div>
                <span
                  className={`mono text-[13px] tabular-nums px-2 py-0.5 rounded border ${
                    m.delta > 0
                      ? "text-[var(--color-accent)] border-[var(--color-accent)]/40"
                      : "text-red-400 border-red-400/40"
                  }`}
                >
                  {m.delta > 0 ? "+" : ""}
                  {m.delta}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function RowList({
  title,
  subtitle,
  accent,
  rows,
  empty,
}: {
  title: string;
  subtitle: string;
  accent: string;
  rows: Row[];
  empty: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-2">
        <h2 className={`text-[1.15rem] font-semibold tracking-[-0.02em] ${accent}`}>
          {title}
        </h2>
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
          {subtitle}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="text-[0.92rem] text-[var(--color-fg-3)]">{empty}</p>
      ) : (
        <ol className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.handle}>
              <Link
                href={`/leaderboard/${slugifyHandle(r.handle)}`}
                className="grid grid-cols-[1fr_auto] gap-3 items-center rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/30 hover:border-[var(--color-line-hover)] px-3 py-2 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-medium text-[var(--color-fg)] truncate">
                    {r.name ?? r.handle}
                  </div>
                  <div className="mono text-[11px] text-[var(--color-fg-3)] truncate">
                    {r.handle}
                  </div>
                </div>
                <ScoreBadge score={r.score} max={100} />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-8 text-center">
      <p className="mono text-[12px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-3">
        First scan
      </p>
      <p className="text-[var(--color-fg)] text-[1.05rem] mb-2">
        No previous snapshot to diff against yet.
      </p>
      <p className="text-[var(--color-fg-3)] text-[0.95rem]">
        The cron archives the leaderboard once a day at 07:00 UTC. Come
        back tomorrow to see what moved.
      </p>
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
