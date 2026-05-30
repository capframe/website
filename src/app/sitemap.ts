import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import { slugifyHandle } from "@/app/leaderboard/_components";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts();
  const board = await loadLeaderboard();
  const lastScanned = new Date(board.generated_at);

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
    ...board.rows.map((row) => ({
      url: `https://capframe.ai/leaderboard/${slugifyHandle(row.handle)}`,
      lastModified: new Date(row.last_scanned ?? lastScanned),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `https://capframe.ai/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
