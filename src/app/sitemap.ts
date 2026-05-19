import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
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
  ];
}
