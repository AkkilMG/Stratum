import type { Locale } from "@/lib/i18n/config";

import whatIsStratum from "@/content/en/introduction/what-is-stratum";
import concepts from "@/content/en/introduction/concepts";
import installation from "@/content/en/getting-started/installation";
import firstLaunch from "@/content/en/getting-started/first-launch";
import spaces from "@/content/en/guide/spaces";
import importing from "@/content/en/guide/importing";
import library from "@/content/en/guide/library";
import assetDetails from "@/content/en/guide/asset-details";
import tags from "@/content/en/guide/tags";
import search from "@/content/en/guide/search";
import activitySync from "@/content/en/guide/activity-sync";
import studioSync from "@/content/en/guide/studio-sync";
import localAi from "@/content/en/guide/local-ai";
import settings from "@/content/en/guide/settings";
import shortcuts from "@/content/en/guide/shortcuts";
import tour from "@/content/en/guide/tour";
import assetKinds from "@/content/en/reference/asset-kinds";
import shortcutsTable from "@/content/en/reference/shortcuts-table";
import errorCodes from "@/content/en/reference/error-codes";
import dataLocation from "@/content/en/reference/data-location";
import faq from "@/content/en/troubleshooting/faq";
import building from "@/content/en/building/overview";
import changelog from "@/content/en/changelog/overview";

export interface DocPageMeta {
  title: string;
  description: string;
  toc?: Array<{ id: string; label: string }>;
  slug: string;
  sectionId: string;
}

export interface DocPage {
  meta: DocPageMeta;
  Body: React.FC;
}

const enRegistry: Record<string, DocPage> = {
  "introduction/what-is-stratum": whatIsStratum,
  "introduction/concepts": concepts,
  "getting-started/installation": installation,
  "getting-started/first-launch": firstLaunch,
  "guide/spaces": spaces,
  "guide/importing": importing,
  "guide/library": library,
  "guide/asset-details": assetDetails,
  "guide/tags": tags,
  "guide/search": search,
  "guide/activity-sync": activitySync,
  "guide/studio-sync": studioSync,
  "guide/local-ai": localAi,
  "guide/settings": settings,
  "guide/shortcuts": shortcuts,
  "guide/tour": tour,
  "reference/asset-kinds": assetKinds,
  "reference/shortcuts-table": shortcutsTable,
  "reference/error-codes": errorCodes,
  "reference/data-location": dataLocation,
  "troubleshooting/faq": faq,
  "building/overview": building,
  "changelog/overview": changelog,
};

export const registry: Record<Locale, Record<string, DocPage>> = {
  en: enRegistry,
  es: enRegistry,
  ru: enRegistry,
  hi: enRegistry,
  fr: enRegistry,
  de: enRegistry,
};

export function getDocPage(locale: Locale, slug: string): DocPage | undefined {
  const key = slug.replace(/^\/+|\/+$/g, "");
  if (!key) return enRegistry["introduction/what-is-stratum"];
  return registry[locale]?.[key] ?? registry.en[key];
}

export function getAllSlugs(locale: Locale): string[] {
  return Object.keys(registry[locale]);
}

export function getPageMeta(locale: Locale, slug: string): DocPageMeta | undefined {
  return getDocPage(locale, slug)?.meta;
}
