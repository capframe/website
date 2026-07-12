import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getAllPosts, getPostBySlug, getAllSlugs } from "./posts";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Frontmatter contract: validated directly against the raw files so a missing
 * field is caught even though the loader falls back to the slug for a missing
 * title. Every post the site ships must satisfy this.
 */
describe("blog frontmatter", () => {
  it("declares a non-empty title, description, and ISO date on every post", async () => {
    const files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);

      expect(typeof data.title, `${file}: title must be a string`).toBe("string");
      expect((data.title as string).trim().length, `${file}: title is empty`).toBeGreaterThan(0);

      expect(typeof data.description, `${file}: description must be a string`).toBe("string");
      expect((data.description as string).trim().length, `${file}: description is empty`).toBeGreaterThan(0);

      expect(typeof data.date, `${file}: date must be a string`).toBe("string");
      expect(ISO_DATE.test(data.date as string), `${file}: date "${data.date}" is not YYYY-MM-DD`).toBe(true);
      expect(Number.isNaN(Date.parse(data.date as string)), `${file}: date "${data.date}" is unparseable`).toBe(false);

      if (data.tags !== undefined) {
        expect(Array.isArray(data.tags), `${file}: tags must be an array`).toBe(true);
      }
    }
  });
});

/** Loader behaviour the index and per-post routes depend on. */
describe("blog loader", () => {
  it("loads at least one post", async () => {
    const posts = await getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it("sorts posts newest-first", async () => {
    const dates = (await getAllPosts()).map((p) => p.date);
    const expected = [...dates].sort((a, b) => b.localeCompare(a));
    expect(dates).toEqual(expected);
  });

  it("renders non-empty HTML for every post", async () => {
    for (const post of await getAllPosts()) {
      expect(post.html.trim().length, `${post.slug}: rendered empty HTML`).toBeGreaterThan(0);
    }
  });

  it("has unique slugs", async () => {
    const slugs = await getAllSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolves a known slug and returns null for a missing one", async () => {
    const slugs = await getAllSlugs();
    const known = await getPostBySlug(slugs[0]);
    expect(known?.slug).toBe(slugs[0]);
    expect(await getPostBySlug("this-slug-does-not-exist-404")).toBeNull();
  });
});
