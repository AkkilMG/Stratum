import type { Messages } from "./types";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { ru } from "./messages/ru";
import { hi } from "./messages/hi";
import { fr } from "./messages/fr";
import { de } from "./messages/de";
import { type Locale, defaultLocale } from "./config";

export const messages: Record<Locale, Messages> = {
  en,
  es,
  ru,
  hi,
  fr,
  de,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[defaultLocale];
}

export type { Messages };
