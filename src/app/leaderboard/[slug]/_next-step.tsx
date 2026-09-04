"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useState } from "react";

/**
 * The next-step block on a per-server report, instrumented.
 *
 * The page view is already counted by Vercel Analytics; what was missing is
 * whether anyone does anything once they arrive. These events answer three
 * questions the score alone can't:
 *
 *   1. Does a bad score drive more intent than a clean one? Every event carries
 *      `variant` and `score`, so the funnel can be split by result rather than
 *      averaged into a number that describes nobody.
 *   2. Do people want to self-serve or be sold to? `quickstart` vs `audit`.
 *   3. Does anyone actually intend to run it? `install_copy` is the strongest
 *      signal on the page — copying the command is a decision, not a scroll.
 *
 * `slug` is included so a single high-intent server can be traced back to a
 * real maintainer instead of disappearing into an aggregate.
 */

const INSTALL = `curl -fsSL capframe.ai/install | sh
capframe find ./your-mcp-config.json --out findings.json`;

export function NextStep({
  slug,
  score,
  findingsCount,
}: {
  slug: string;
  score: number;
  findingsCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const clean = findingsCount === 0;

  // Kept flat and primitive — Vercel Analytics only accepts string/number/boolean.
  const props = {
    slug,
    score,
    findings: findingsCount,
    variant: clean ? "clean" : "findings",
  };

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      track("lb_install_copy", props);
    } catch {
      // Clipboard is blocked in some embedded/insecure contexts. The command is
      // selectable either way, so fail quietly rather than throwing at a reader.
    }
  }

  return (
    <div className="mt-10 rounded-md border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.03] p-6">
      <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)] mb-3">
        {clean ? "Go deeper" : "Reproduce this"}
      </p>
      <p className="text-[0.95rem] text-[var(--color-fg-2)] leading-[1.7]">
        {clean ? (
          <>
            Nothing here needs fixing — this surface is clean against R1–R7. The
            limit is what the rules can see: a public scan reads the tool
            surface, not the implementation behind it. Everything below is
            optional.
          </>
        ) : (
          <>
            Every finding above comes from a public, deterministic rule engine —
            no LLM in the decision path, same input always the same output. You
            can run it against this server yourself and get byte-identical
            results:
          </>
        )}
      </p>

      <div className="relative mt-4">
        <pre className="p-3 pr-20 rounded border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 overflow-x-auto mono text-[12px] text-[var(--color-fg)]">
          {INSTALL}
        </pre>
        <button
          type="button"
          onClick={copyInstall}
          aria-label="Copy the install and scan commands"
          className="absolute top-2 right-2 mono text-[10px] uppercase tracking-[0.14em] px-2 py-1 rounded border border-[var(--color-line-2)] text-[var(--color-fg-3)] hover:text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 transition-colors"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <p className="mt-4 text-[0.92rem] text-[var(--color-fg-2)] leading-[1.7]">
        <Link
          href="/quickstart"
          onClick={() => track("lb_cta_quickstart", props)}
          className="text-[var(--color-accent-3)] hover:text-[var(--color-accent)] underline decoration-[var(--color-accent-3)] underline-offset-2"
        >
          Five-step quickstart
        </Link>{" "}
        if you want the whole Find → Bind → Guard loop. If you&apos;d rather
        have someone read your real tool definitions rather than the advertised
        surface — including the ones this public scan can&apos;t reach —
        that&apos;s the{" "}
        <Link
          href="/#audit"
          onClick={() => track("lb_cta_audit", props)}
          className="text-[var(--color-accent-3)] hover:text-[var(--color-accent)] underline decoration-[var(--color-accent-3)] underline-offset-2"
        >
          Agent Security Audit
        </Link>
        .
      </p>
    </div>
  );
}
