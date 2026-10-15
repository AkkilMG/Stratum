"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import type { Messages } from "./types";
import { getMessages } from "./messages";

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({ locale, messages: getMessages(locale) }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
