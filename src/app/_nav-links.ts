import { CAPFRAME_GITHUB as GH } from "@/lib/version";

export type NavLink = {
  label: string;
  href: string;
  /** Green accent (the Audit / money CTA). */
  accent?: boolean;
  /** External link (opens the GitHub repo). */
  external?: boolean;
};

/**
 * Single source of truth for the primary nav — rendered by both the desktop
 * bar (server Header) and the mobile drawer (client MobileNav) so they can't
 * drift. Leaderboard + CAST are the two highest-value destinations and were
 * previously unreachable from the top of the page.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Modules", href: "#modules" },
  { label: "Compliance", href: "#compliance" },
  { label: "Install", href: "#install" },
  { label: "Audit", href: "#audit", accent: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "CAST", href: "/cast" },
  { label: "Changelog", href: "/changelog" },
  { label: "Blog", href: "/blog" },
  { label: "GitHub ↗", href: GH, external: true },
];
