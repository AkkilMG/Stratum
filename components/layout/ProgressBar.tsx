"use client";

import { useSyncExternalStore } from "react";
import { motion, useScroll, useSpring } from "motion/react";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getSnapshot() {
  return window.scrollY > 80;
}

function getServerSnapshot() {
  return false;
}

export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.8 });
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!visible) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[2px]">
      <motion.div
        style={{ scaleX, originX: 0 }}
        className="h-full bg-gradient-to-r from-primary via-accent to-primary"
      />
    </div>
  );
}
