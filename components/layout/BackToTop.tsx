"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "@/components/ui/icons";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/lib/i18n/context";

function subscribe(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function BackToTop() {
  const { messages } = useI18n();
  const visible = useSyncExternalStore(
    subscribe,
    () => window.scrollY > 600,
    () => false
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={messages.common.backToTop}
          className="fixed bottom-6 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-primary shadow-lg shadow-[0_12px_40px_-20px_rgba(0,0,0,0.7)] transition-colors hover:bg-muted"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
