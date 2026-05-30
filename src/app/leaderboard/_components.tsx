// Shared building blocks for the leaderboard surface — used by the
// index `/leaderboard` table and the per-server `/leaderboard/[slug]`
// detail pages. Files prefixed with `_` are not routed by Next.js, so
// this stays a plain TS module that the routes import.

import Link from "next/link";
import type { Finding, Severity, SeverityCounts } from "@/lib/leaderboard/types";
import { CAPFRAME_GITHUB, CAPFRAME_VERSION } from "@/lib/version";

/** Slug a tool name for use in /leaderboard/[slug]/[tool] URLs. */
export function slugifyTool(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Chrome                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export function StatusBar() {
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

export function Header({ activePage }: { activePage?: "blog" | "leaderboard" }) {
  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-bg)]/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="mono text-[13px] tracking-[0.18em]">
          CAPFRAME
        </Link>
        <nav className="flex items-center gap-6 mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
          <Link
            href="/blog"
            className={
              activePage === "blog"
                ? "text-[var(--color-fg)]"
                : "hover:text-[var(--color-fg)]"
            }
          >
            Blog
          </Link>
          <Link
            href="/leaderboard"
            className={
              activePage === "leaderboard"
                ? "text-[var(--color-fg)]"
                : "hover:text-[var(--color-fg)]"
            }
            aria-current={activePage === "leaderboard" ? "page" : undefined}
          >
            Leaderboard
          </Link>
          <Link href={CAPFRAME_GITHUB} className="hover:text-[var(--color-fg)]">
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
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

/* ────────────────────────────────────────────────────────────────────────── */
/* Utils                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

/** Stable URL slug for a `<registry>:<name>@<version>` handle. Must match
 *  `slugifyHandle` here in every consumer so anchors / routes don't drift. */
export function slugifyHandle(handle: string): string {
  return handle.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}

/** Render YYYY-MM-DD regardless of locale so SSR output is deterministic. */
export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

/** Sort findings by severity desc (Critical first). */
export function sortFindingsBySeverity(findings: Finding[]): Finding[] {
  const order: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };
  return [...findings].sort((a, b) => order[a.severity] - order[b.severity]);
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Badges                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export type ScoreTier = "A" | "B" | "C" | "D";

export function scoreTier(score: number, max: number): ScoreTier {
  const pct = (score / max) * 100;
  if (pct >= 95) return "A";
  if (pct >= 80) return "B";
  if (pct >= 50) return "C";
  return "D";
}

export function ScoreBadge({ score, max }: { score: number; max: number }) {
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

export function SeverityChip({ severity }: { severity: Severity }) {
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

export function FindingsCell({ counts }: { counts: SeverityCounts }) {
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

/* ────────────────────────────────────────────────────────────────────────── */
/* Findings list (sortable, reused by index + detail)                          */
/* ────────────────────────────────────────────────────────────────────────── */

export function FindingsList({
  findings,
  serverSlug,
}: {
  findings: Finding[];
  /** When set, tool names link to /leaderboard/[serverSlug]/[toolSlug]. */
  serverSlug?: string;
}) {
  const sorted = sortFindingsBySeverity(findings);
  return (
    <ol className="mt-3 space-y-2.5">
      {sorted.map((f) => (
        <li
          key={f.id}
          className="grid grid-cols-[5rem_1fr] gap-3 items-baseline"
        >
          <SeverityChip severity={f.severity} />
          <div className="text-[0.92rem] text-[var(--color-fg-2)] leading-snug">
            <span className="text-[var(--color-fg)] font-medium">{f.title}</span>
            {f.tool &&
              (serverSlug ? (
                <Link
                  href={`/leaderboard/${serverSlug}/${slugifyTool(f.tool)}`}
                  className="mono text-[11px] text-[var(--color-accent-3)] ml-2 hover:text-[var(--color-accent)] underline-offset-2"
                >
                  · {f.tool}
                </Link>
              ) : (
                <span className="mono text-[11px] text-[var(--color-fg-3)] ml-2">
                  · {f.tool}
                </span>
              ))}
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
