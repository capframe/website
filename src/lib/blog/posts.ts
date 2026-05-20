/**
 * Filesystem-backed blog posts.
 *
 * Posts live as Markdown files in `src/content/blog/<slug>.md` with YAML
 * frontmatter. At build time we read the directory, parse each file via
 * gray-matter, and expose a typed Post[] for both the index route and the
 * per-post route.
 */

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export type Post = {
  /** URL slug (filename without .md). */
  slug: string;
  /** Display title from frontmatter. */
  title: string;
  /** ISO-format date string from frontmatter. */
  date: string;
  /** One-line description from frontmatter (used in lists + meta). */
  description: string;
  /** Optional comma-separated tag list. */
  tags?: string[];
  /** Raw Markdown body (post content excluding frontmatter). */
  markdown: string;
  /** Rendered HTML body. */
  html: string;
};

async function readPostFile(slug: string): Promise<Post> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = await marked.parse(content, { gfm: true, breaks: false });
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    markdown: content,
    html,
  };
}

/** Returns posts sorted newest-first. */
export async function getAllPosts(): Promise<Post[]> {
  const entries = await fs.readdir(BLOG_DIR);
  const slugs = entries
    .filter((e) => e.endsWith(".md"))
    .map((e) => e.replace(/\.md$/, ""));
  const posts = await Promise.all(slugs.map(readPostFile));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await readPostFile(slug);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_DIR);
  return entries.filter((e) => e.endsWith(".md")).map((e) => e.replace(/\.md$/, ""));
}
