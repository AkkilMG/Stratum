"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Tabs({
  tabs,
  initial = 0,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  initial?: number;
}) {
  const [active, setActive] = useState(initial);
  const current = tabs[active];

  return (
    <div className="my-5">
      <div
        role="tablist"
        className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-border bg-muted p-1"
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
              i === active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {i === active && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3"
          role="tabpanel"
        >
          {current.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
