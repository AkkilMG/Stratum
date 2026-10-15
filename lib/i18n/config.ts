export const locales = ["en", "es", "ru", "hi", "fr", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ru: "Русский",
  hi: "हिन्दी",
  fr: "Français",
  de: "Deutsch",
};

export const localeFlags: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  ru: "RU",
  hi: "HI",
  fr: "FR",
  de: "DE",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const htmlLang: Record<Locale, string> = {
  en: "en",
  es: "es",
  ru: "ru",
  hi: "hi",
  fr: "fr",
  de: "de",
};
