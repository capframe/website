import type { Metadata } from "next";
import Link from "next/link";
import { CAPFRAME_GITHUB, CAPFRAME_VERSION } from "@/lib/version";
import { getAllPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Long-form notes on AI agent security, capability-token design, and the findings.v1 schema.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <>
      <StatusBar />
      <Header />
      <main className="px-6 sm:px-10 lg:px-16">
        <section className="max-w-[800px] mx-auto pt-16 sm:pt-24 pb-24">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="mono text-[12px] text-[var(--color-accent)]">§ blog</span>
            <span className="label">Notes from the build</span>
          </div>
          <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            Blog.
          </h1>
          <p className="mt-6 text-[1.02rem] text-[var(--color-fg-2)] max-w-[36rem]">
            Long-form notes on AI agent security, capability tokens, the
            <code className="mx-1 text-[var(--color-accent-3)]">findings.v1</code>
            schema, and decisions we&rsquo;ve made building Capframe.
          </p>

          <ul className="mt-14 divide-y divide-[var(--color-line)]">
            {posts.map((p) => (
              <li key={p.slug} className="py-7">
                <Link
                  href={`/blog/${p.slug}`}
                  className="group block"
                >
                  <div className="flex items-baseline gap-3 mb-2 mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
                    <time dateTime={p.date}>{p.date}</time>
                    {p.tags && p.tags.length > 0 && (
                      <span className="hidden sm:inline">·</span>
                    )}
                    {p.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="text-[var(--color-accent-3)]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-[1.45rem] font-semibold tracking-[-0.015em] text-fg group-hover:text-[var(--color-accent)] transition-colors">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-[0.95rem] leading-[1.65] text-[var(--color-fg-2)]">
                    {p.description}
                  </p>
                  <span className="inline-block mt-3 mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-accent-3)] group-hover:text-[var(--color-accent)]">
                    Read →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {posts.length === 0 && (
            <p className="mt-12 text-[var(--color-fg-3)]">No posts yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
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
          <span className="mono text-[13px] tracking-[0.16em] uppercase">capframe</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-fg-2)]">
          <Link href="/#modules" className="hover:text-fg transition-colors">Modules</Link>
          <Link href="/#install" className="hover:text-fg transition-colors">Install</Link>
          <Link href="/changelog" className="hover:text-fg transition-colors">Changelog</Link>
          <Link href="/blog" className="hover:text-fg transition-colors text-[var(--color-accent-3)]">Blog</Link>
          <a href={CAPFRAME_GITHUB} className="hover:text-fg transition-colors">GitHub ↗</a>
        </nav>
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
