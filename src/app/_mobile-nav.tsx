"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "./_nav-links";

/**
 * Hamburger + drawer for < lg. Previously the entire nav collapsed to a single
 * "Install" link on mobile, so phone visitors (e.g. from the CAST launch) had
 * no way to reach the leaderboard, audit, pricing, etc. Renders NAV_LINKS —
 * the same source the desktop bar uses.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 -mr-1 rounded text-[var(--color-fg-2)] hover:text-[var(--color-fg)] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>

      {open && (
        <>
          {/* click-away backdrop below the header */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="fixed inset-x-0 bottom-0 top-14 z-30 bg-[var(--color-bg)]/50 cursor-default"
          />
          <nav className="absolute left-0 right-0 top-14 z-40 border-b border-[var(--color-line)]/80 bg-[var(--color-bg)]/95 backdrop-blur">
            <ul className="max-w-[1440px] mx-auto px-6 sm:px-10 py-1 flex flex-col mono text-[13px] tracking-[0.12em] uppercase">
              {NAV_LINKS.map((l) => {
                const cls = `block py-3.5 transition-colors ${
                  l.accent
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-fg-2)] hover:text-[var(--color-fg)]"
                }`;
                return (
                  <li key={l.label} className="border-t border-[var(--color-line)]/40 first:border-t-0">
                    {l.href.startsWith("#") || l.external ? (
                      <a href={l.href} onClick={close} className={cls}>
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} onClick={close} className={cls}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
