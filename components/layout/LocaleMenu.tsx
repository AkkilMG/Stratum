import { type Locale, locales, localeNames } from "@/lib/i18n/config";
import { Check, Globe2, Languages } from "@/components/ui/icons";
import { withBasePath } from "@/lib/util";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

function stripLocale(p: string, current: Locale, base: string) {
  let path = p.startsWith(base) ? p.slice(base.length) || "/" : p;
  const pref = `/${current}`;
  if (path === pref || path.startsWith(`${pref}/`)) {
    path = path.slice(pref.length) || "/";
  }
  return path;
}

export function LocaleMenu() {
  const { locale, messages } = useI18n();
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pathWithout = stripLocale(pathname, locale, base);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-transparent px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Languages size={16} />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <Globe2 size={14} className="text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 z-40 mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-lg shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
              role="listbox"
            >
              {locales.map((l) => {
                const href = withBasePath(`/${l}${pathWithout}`.replace(/\/+/g, "/"));
                const active = l === locale;
                return (
                  <Link
                    key={l}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-primary-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="truncate">{localeNames[l]}</span>
                    {active && <Check size={14} className="text-primary" />}
                  </Link>
                );
              })}
              <p className="mt-1 px-2 py-1 text-xs text-muted-foreground">{messages.header.language}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
