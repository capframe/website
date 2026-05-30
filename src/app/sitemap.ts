import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import { slugifyHandle, slugifyTool } from "@/app/leaderboard/_components";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts();
  const board = await loadLeaderboard();
  const lastScanned = new Date(board.generated_at);

  // Per-tool entries: one URL per (server, tool-with-findings).
  const toolUrls: MetadataRoute.Sitemap = [];
  for (const row of board.rows) {
    if (!row.findings?.length) continue;
    const seen = new Set<string>();
    for (const f of row.findings) {
      if (!f.tool || seen.has(f.tool)) continue;
      seen.add(f.tool);
      toolUrls.push({
        url: `https://capframe.ai/leaderboard/${slugifyHandle(row.handle)}/${slugifyTool(f.tool)}`,
        lastModified: new Date(row.last_scanned ?? lastScanned),
        changeFrequency: "daily" as const,
        priority: 0.5,
      });
    }
  }

  return [
    {
      url: "https://capframe.ai",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://capframe.ai/changelog",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://capframe.ai/blog",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://capframe.ai/leaderboard",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://capframe.ai/quickstart",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: "https://capframe.ai/docs/findings-v1",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://capframe.ai/leaderboard/movers",
      lastModified: lastScanned,
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...board.rows.map((row) => ({
      url: `https://capframe.ai/leaderboard/${slugifyHandle(row.handle)}`,
      lastModified: new Date(row.last_scanned ?? lastScanned),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...toolUrls,
    ...posts.map((p) => ({
      url: `https://capframe.ai/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
