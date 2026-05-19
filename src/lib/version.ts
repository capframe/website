/**
 * Single source of truth for the currently-marketed Capframe release.
 * Bump in lockstep with `crates/capframe-cli` Cargo.toml in the capframe repo.
 */

export const CAPFRAME_VERSION = "v0.2.0";

/** Bare-numeric form, e.g. for sitemap or schema headers. */
export const CAPFRAME_VERSION_BARE = CAPFRAME_VERSION.replace(/^v/, "");

/** Canonical GitHub repo URL (used in nav, CTAs, footer). */
export const CAPFRAME_GITHUB = "https://github.com/capframe/capframe";

/** Canonical install one-liner — must match install.sh path. */
export const CAPFRAME_INSTALL = "curl -fsSL capframe.ai/install | sh";
