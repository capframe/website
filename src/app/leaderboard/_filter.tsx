"use client";

// Client-side filter + sort + search controls for /leaderboard.
// The page server-renders the full list (good for SEO); this component
// hydrates with the same rows and lets readers narrow the view
// without a round-trip. Pure DOM, no router state.

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Leaderboard, Row, ServerSource } from "@/lib/leaderboard/types";
import sampleData from "@/lib/leaderboard/sample.json";
import {
  FindingsCell,
  FindingsList,
  ScoreBadge,
  formatDate,
  scoreTier,
  slugifyHandle,
} from "./_components";

type SortKey = "score" | "tools" | "name" | "last_scan";
type SortDir = "asc" | "desc";
type Tier = "A" | "B" | "C" | "D";

const ALL_SOURCES: ServerSource[] = ["registry", "sandbox", "http", "file"];
const ALL_TIERS: Tier[] = ["A", "B", "C", "D"];

const _board = sampleData as Leaderboard;

export function FilterableTable({ rows = _board.rows }: { rows?: Row[] }) {
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState<Set<ServerSource>>(
    () => new Set(ALL_SOURCES),
  );
  const [tiers, setTiers] = useState<Set<Tier>>(() => new Set(ALL_TIERS));
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  // CAST is an opt-in facet: empty = no CAST filter (all servers show), matching
  // the default view. Selecting categories narrows to servers that carry them.
  const [casts, setCasts] = useState<Set<string>>(() => new Set());

  // Only surface CAST chips for categories that actually appear in the data.
  const presentCasts = useMemo(() => {
    const s = new Set<string>();
    for (const r of rows)
      for (const f of r.findings ?? [])
        for (const c of f.cast_category ?? []) s.add(c);
    return [...s].sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      if (!sources.has(r.source)) return false;
      if (!tiers.has(scoreTier(r.score, 100))) return false;
      if (casts.size > 0) {
        const hit = (r.findings ?? []).some((f) =>
          (f.cast_category ?? []).some((c) => casts.has(c)),
        );
        if (!hit) return false;
      }
      if (q) {
        const hay = `${r.name ?? ""} ${r.handle}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const cmp = (a: Row, b: Row): number => {
      switch (sortKey) {
        case "score":
          return a.score - b.score;
        case "tools":
          return (a.tool_count ?? 0) - (b.tool_count ?? 0);
        case "name":
          return (a.name ?? a.handle).localeCompare(b.name ?? b.handle);
        case "last_scan":
          return a.last_scanned.localeCompare(b.last_scanned);
      }
    };
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => cmp(a, b) * dir);
  }, [rows, query, sources, tiers, casts, sortKey, sortDir]);

  const toggleSource = (s: ServerSource) => {
    setSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };
  const toggleTier = (t: Tier) => {
    setTiers((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };
  const toggleCast = (c: string) => {
    setCasts((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };
  const reset = () => {
    setQuery("");
    setSources(new Set(ALL_SOURCES));
    setTiers(new Set(ALL_TIERS));
    setCasts(new Set());
    setSortKey("score");
    setSortDir("desc");
  };

  return (
    <>
      <div className="mt-12 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/30 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or handle…"
            className="flex-1 px-3 py-2 rounded-md border border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-fg)] text-[0.95rem] placeholder:text-[var(--color-fg-3)] focus:outline-none focus:border-[var(--color-accent-3)]"
            aria-label="Filter servers"
          />
          <div className="flex items-center gap-2 mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
            <label htmlFor="sort-by">Sort</label>
            <select
              id="sort-by"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-2 py-1.5 rounded border border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-fg)]"
            >
              <option value="score">Score</option>
              <option value="tools">Tools</option>
              <option value="name">Name</option>
              <option value="last_scan">Last scan</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              className="px-2 py-1.5 rounded border border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-fg)] hover:border-[var(--color-line-hover)]"
              aria-label="Toggle sort direction"
            >
              {sortDir === "desc" ? "↓ desc" : "↑ asc"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)] mr-1">
            Source
          </span>
          {ALL_SOURCES.map((s) => (
            <Chip
              key={s}
              active={sources.has(s)}
              onClick={() => toggleSource(s)}
              label={s}
            />
          ))}
          <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)] ml-3 mr-1">
            Tier
          </span>
          {ALL_TIERS.map((t) => (
            <Chip
              key={t}
              active={tiers.has(t)}
              onClick={() => toggleTier(t)}
              label={t}
              tier={t}
            />
          ))}
          <button
            type="button"
            onClick={reset}
            className="ml-auto mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)] hover:text-[var(--color-fg)]"
          >
            reset
          </button>
        </div>

        {presentCasts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)] mr-1">
              CAST
            </span>
            {presentCasts.map((c) => (
              <Chip
                key={c}
                active={casts.has(c)}
                onClick={() => toggleCast(c)}
                label={c}
                cast
              />
            ))}
            {casts.size > 0 && (
              <button
                type="button"
                onClick={() => setCasts(new Set())}
                className="mono text-[10px] tracking-[0.1em] text-[var(--color-accent-3)] hover:text-[var(--color-fg)] ml-1"
              >
                clear
              </button>
            )}
          </div>
        )}

        <div className="mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
          {filtered.length} of {rows.length} servers
        </div>
      </div>

      <div className="mt-6 space-y-1.5">
        <div className="hidden sm:grid grid-cols-[2.5rem_1fr_5.5rem_3.5rem_5.5rem_4.5rem_5rem] gap-3 px-4 py-3 mono uppercase tracking-[0.14em] text-[10.5px] text-[var(--color-fg-3)] border-b border-[var(--color-line)]">
          <span>#</span>
          <span>Server</span>
          <span className="text-right">Score</span>
          <span className="text-right">Tools</span>
          <span className="text-right">Findings</span>
          <span className="text-right hidden md:inline">Source</span>
          <span className="text-right hidden lg:inline">Last scan</span>
        </div>
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
            no servers match those filters
          </div>
        ) : (
          filtered.map((row, i) => (
            <ServerRow key={row.handle} row={row} index={i + 1} />
          ))
        )}
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
  tier,
  cast,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tier?: Tier;
  cast?: boolean;
}) {
  const tierColor: Record<Tier, string> = {
    A: "text-[var(--color-accent)] border-[var(--color-accent)]/50",
    B: "text-[var(--color-accent-3)] border-[var(--color-accent-3)]/50",
    C: "text-amber-300 border-amber-300/50",
    D: "text-red-400 border-red-400/50",
  };
  // CAST is opt-in: inactive chips stay neutral (no strike-through) so the row
  // reads as "click to add", not "click to exclude" like Source/Tier.
  const base = cast
    ? active
      ? "text-[var(--color-accent-3)] border-[var(--color-accent-3)]/60 bg-[var(--color-bg-2)]"
      : "text-[var(--color-fg-3)] border-[var(--color-line)] hover:border-[var(--color-line-hover)]"
    : active
      ? tier
        ? tierColor[tier]
        : "text-[var(--color-fg)] border-[var(--color-accent-3)]/60 bg-[var(--color-bg-2)]"
      : "text-[var(--color-fg-3)] border-[var(--color-line)] hover:border-[var(--color-line-hover)] line-through opacity-60";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`mono text-[10.5px] uppercase tracking-[0.14em] px-2.5 py-1 rounded border ${base}`}
    >
      {label}
    </button>
  );
}

function ServerRow({ row, index }: { row: Row; index: number }) {
  const hasDetails = (row.findings?.length ?? 0) > 0;
  const slug = slugifyHandle(row.handle);
  const detailHref = `/leaderboard/${slug}`;

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
        <FindingsList findings={row.findings ?? []} serverSlug={slug} />
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

