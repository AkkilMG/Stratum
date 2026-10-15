"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Camera, ImageOff } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/context";
import { withBasePath } from "@/lib/util";

export function Screenshot({
  name,
  caption,
  alt,
  ratio = "16 / 9",
}: {
  name: string;
  caption?: string;
  alt?: string;
  ratio?: string;
}) {
  const { messages } = useI18n();
  const [failed, setFailed] = useState(false);
  const src = withBasePath(`/screenshots/${name}.png`);

  return (
    <figure className="my-6">
      <div
        className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-[0_10px_40px_-24px_rgba(0,0,0,0.6)]"
        style={{ aspectRatio: ratio }}
      >
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <div className="mx-auto flex min-w-0 max-w-[52%] items-center gap-1.5 rounded-md border border-border bg-[color-mix(in_srgb,var(--background)_60%,transparent)] px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-tip" />
            <span className="truncate font-mono text-[0.68rem] text-muted-foreground">
              stratum · {name}
            </span>
          </div>
        </div>

        <div className="relative" style={{ height: "calc(100% - 34px)" }}>
          {!failed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? caption ?? name}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              onError={() => setFailed(true)}
              loading="lazy"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-[color-mix(in_srgb,var(--primary)_8%,var(--muted))]"
            >
              <div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--primary)_25%,transparent)] to-transparent"
                style={{ animation: "shimmer 2.4s linear infinite" }}
              />
              <div className="grid-fade absolute inset-0 opacity-40" />
              <motion.div
                whileHover={{ rotate: -6, scale: 1.05 }}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-primary"
              >
                <Camera size={22} />
              </motion.div>
              <span className="relative text-sm font-medium text-foreground">
                {messages.common.capture}
              </span>
              <span className="relative max-w-[80%] text-center font-mono text-[0.72rem] text-muted-foreground">
                {messages.common.captureHint.replace("{name}", name)}
              </span>
              <ImageOff size={14} className="absolute bottom-2.5 right-3 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
