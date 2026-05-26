import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CAPFRAME_GITHUB, CAPFRAME_VERSION } from "@/lib/version";
import { getAllSlugs, getPostBySlug } from "@/lib/blog/posts";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <StatusBar />
      <Header />
      <main className="px-6 sm:px-10 lg:px-16">
        <article className="max-w-[760px] mx-auto pt-14 sm:pt-20 pb-24">
          <Link
            href="/blog"
            className="mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-fg-3)] hover:text-[var(--color-accent-3)] transition-colors"
          >
            ← All posts
          </Link>

          <header className="mt-7 mb-10">
            <div className="flex items-baseline gap-3 mb-3 mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-3)]">
              <time dateTime={post.date}>{post.date}</time>
              {post.tags?.slice(0, 3).map((t) => (
                <span key={t} className="text-[var(--color-accent-3)]">
                  · {t}
                </span>
              ))}
            </div>
            <h1 className="text-[clamp(2rem,4.5vw,2.9rem)] font-semibold tracking-[-0.025em] leading-[1.08]">
              {post.title}
            </h1>
            <p className="mt-5 text-[1.05rem] leading-[1.6] text-[var(--color-fg-2)]">
              {post.description}
            </p>
          </header>

          <div
            className="prose-post"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <footer className="mt-16 pt-8 border-t border-[var(--color-line)] text-[13px] text-[var(--color-fg-3)] flex items-baseline justify-between gap-4 flex-wrap">
            <Link
              href="/blog"
              className="mono uppercase tracking-[0.14em] hover:text-[var(--color-accent-3)]"
            >
              ← All posts
            </Link>
            <a
              href={CAPFRAME_GITHUB}
              className="mono uppercase tracking-[0.14em] hover:text-[var(--color-accent-3)]"
            >
              github.com/capframe ↗
            </a>
          </footer>
        </article>
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
        <Link href="/blog" className="md:hidden mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-accent-3)]">
          ← Blog
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
