import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts();

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
    ...posts.map((p) => ({
      url: `https://capframe.ai/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
