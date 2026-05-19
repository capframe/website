import type { Metadata } from "next";
import Link from "next/link";
import { marked } from "marked";
import { CAPFRAME_GITHUB, CAPFRAME_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Release notes for Capframe — the dispatcher CLI, the findings schema, and the install pipeline. Each entry links to its GitHub Release.",
  alternates: { canonical: "/changelog" },
};

// ISR — refetch the CHANGELOG.md from GitHub every hour. Cheap, and keeps
// the page in sync without a redeploy when the source file updates.
export const revalidate = 3600;

const CHANGELOG_URL =
  "https://raw.githubusercontent.com/capframe/capframe/main/CHANGELOG.md";

async function fetchChangelog(): Promise<string> {
  const res = await fetch(CHANGELOG_URL, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`fetch CHANGELOG.md: ${res.status}`);
  }
  return res.text();
}

export default async function ChangelogPage() {
  let body: string;
  try {
    const md = await fetchChangelog();
    body = await marked.parse(md, { gfm: true, breaks: false });
  } catch (e) {
    body = `<p class="error">Could not load CHANGELOG.md from GitHub (${
      e instanceof Error ? e.message : "unknown error"
    }). <a href="${CAPFRAME_GITHUB}/blob/main/CHANGELOG.md">View on GitHub →</a></p>`;
  }

  return (
    <>
      <StatusBar />
      <Header />
      <main className="px-6 sm:px-10 lg:px-16">
        <section className="max-w-[800px] mx-auto pt-16 sm:pt-24 pb-24">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § log
            </span>
            <span className="label">Release notes</span>
          </div>
          <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            Changelog.
          </h1>
          <p className="mt-6 text-[1.02rem] text-[var(--color-fg-2)] max-w-[36rem]">
            Every shipped version of Capframe, plus the install-pipeline and
            release-tooling changes that ride along.{" "}
            <a
              href={`${CAPFRAME_GITHUB}/releases`}
              className="text-[var(--color-accent-3)] hover:text-[var(--color-accent)] underline decoration-[var(--color-line-2)] underline-offset-[4px]"
            >
              GitHub Releases →
            </a>
          </p>
          <article
            className="prose-changelog mt-12"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          <p className="mt-16 text-[12.5px] text-[var(--color-fg-3)] mono tracking-wide">
            ↻ Rebuilds hourly from{" "}
            <a
              href={`${CAPFRAME_GITHUB}/blob/main/CHANGELOG.md`}
              className="underline decoration-[var(--color-line-2)] underline-offset-[4px] hover:text-[var(--color-accent-3)]"
            >
              CHANGELOG.md
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Reused chrome (matches src/app/page.tsx)                                    */
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
        <div className="hidden sm:flex items-center gap-5">
          <span>OWASP LLM</span>
          <span className="text-[var(--color-fg-4)]">·</span>
          <span>NIST AI RMF</span>
          <span className="text-[var(--color-fg-4)]">·</span>
          <span>MITRE ATLAS</span>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/70 border-b border-[var(--color-line)]/80">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded border border-[var(--color-accent)]/50 flex items-center justify-center font-mono text-[14px] text-[var(--color-accent)] group-hover:shadow-[0_0_16px_rgba(0,245,160,0.4)] transition-shadow">
            C
          </span>
          <span className="mono text-[13px] tracking-[0.16em] uppercase">
            capframe
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-fg-2)]">
          <Link href="/#modules" className="hover:text-fg transition-colors">
            Modules
          </Link>
          <Link href="/#compliance" className="hover:text-fg transition-colors">
            Compliance
          </Link>
          <Link href="/#install" className="hover:text-fg transition-colors">
            Install
          </Link>
          <Link href="/changelog" className="hover:text-fg transition-colors text-[var(--color-accent-3)]">
            Changelog
          </Link>
          <a href={CAPFRAME_GITHUB} className="hover:text-fg transition-colors">
            GitHub ↗
          </a>
        </nav>
        <Link
          href="/#install"
          className="md:hidden mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-accent)]"
        >
          Install ↗
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--color-line-2)] bg-[var(--color-bg-2)]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 text-center mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-fg-3)]">
        <span className="text-fg font-medium">Capframe</span>
        <span className="mx-2 text-[var(--color-fg-4)]">·</span>
        <span>{CAPFRAME_VERSION}</span>
        <span className="mx-2 text-[var(--color-fg-4)]">·</span>
        <span className="text-[var(--color-accent)]">find. bind. guard.</span>
      </div>
    </footer>
  );
}
