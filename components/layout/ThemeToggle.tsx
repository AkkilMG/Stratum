"use client";

import { Moon, Sun, Monitor, Check } from "@/components/ui/icons";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useI18n } from "@/lib/i18n/context";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { messages } = useI18n();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);

  const options = [
    { key: "light", label: messages.header.light, icon: Sun },
    { key: "dark", label: messages.header.dark, icon: Moon },
    { key: "system", label: messages.header.system, icon: Monitor },
  ] as const;

  const resolved = (theme ?? "system") === "system" ? resolvedTheme : theme;
  const Trigger = resolved === "light" ? Sun : Moon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={messages.header.theme}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        {mounted ? <Trigger size={16} /> : <Monitor size={16} />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 z-40 mt-2 w-40 rounded-xl border border-border bg-card p-1 shadow-lg shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
              role="menu"
            >
              {options.map((o) => {
                const Icon = o.icon;
                const active = (theme ?? "system") === o.key;
                return (
                  <button
                    key={o.key}
                    onClick={() => {
                      setTheme(o.key);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-primary-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    role="menuitem"
                  >
                    <Icon size={15} />
                    <span>{o.label}</span>
                    {active && <Check size={14} className="ml-auto text-primary" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
