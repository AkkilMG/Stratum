import type { Locale } from "@/lib/i18n/config";

const translatedContent: Record<Locale, string[] | "all"> = {
  en: "all",
  es: [],
  ru: [],
  hi: [],
  fr: [],
  de: [],
};

export function isContentTranslated(locale: Locale, slug: string): boolean {
  const entry = translatedContent[locale];
  if (entry === "all") return true;
  return entry.includes(slug);
}
