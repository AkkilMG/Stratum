"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 12,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "0px 0px -80px 0px", once: true });
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Aurora({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden rounded-2xl ${className}`}>
      <div className="absolute inset-x-0 top-[-20%] h-[60%] animate-aurora opacity-60 blur-[120px]">
        <span className="block h-full bg-[radial-gradient(circle,rgba(139,125,255,0.9),transparent_70%)]" />
      </div>
      <div className="absolute inset-x-0 bottom-[-30%] h-[50%] animate-aurora opacity-40 blur-[140px]" style={{ animationDelay: "-4s" }}>
        <span className="block h-full bg-[radial-gradient(circle,rgba(45,212,191,0.8),transparent_70%)]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,125,255,0.14),transparent_60%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SlideIndicator() {
  return (
    <span className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-primary transition-transform duration-200" />
  );
}
