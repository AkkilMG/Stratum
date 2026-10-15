import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-static";
import { locales } from "@/lib/i18n/config";
import { nav } from "@/lib/nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteConfig.url}/${locale}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    });

    for (const section of nav) {
      for (const item of section.items) {
        entries.push({
          url: `${siteConfig.url}/${locale}/${item.slug}/`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}
