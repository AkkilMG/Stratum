"use client";

import { usePathname } from "next/navigation";
import { type Locale, locales } from "@/lib/i18n/config";
import { withBasePath } from "@/lib/util";

export function useAlternateLocales(locale: Locale) {
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
  const withoutLocale = clean.startsWith(`/${locale}/`) || clean === `/${locale}`
    ? clean.replace(`/${locale}`, "") || "/"
    : clean;

  return locales.map((l) => {
    const href = withBasePath(`/${l}${withoutLocale}`.replace(/\/+/g, "/"));
    return { hreflang: l, href };
  });
}
