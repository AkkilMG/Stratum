import { AlertTriangle, CircleAlert, Info, Lightbulb, Rocket, ShieldCheck } from "@/components/ui/icons";

export type AdmonitionType = "tip" | "note" | "warning" | "danger" | "success";

const config: Record<
  AdmonitionType,
  { icon: React.ElementType; label: string; color: string; tint: string }
> = {
  tip: {
    icon: Lightbulb,
    label: "Tip",
    color: "var(--tip)",
    tint: "color-mix(in srgb, var(--tip) 12%, transparent)",
  },
  note: {
    icon: Info,
    label: "Note",
    color: "var(--note)",
    tint: "color-mix(in srgb, var(--note) 12%, transparent)",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    color: "var(--warning)",
    tint: "color-mix(in srgb, var(--warning) 14%, transparent)",
  },
  danger: {
    icon: CircleAlert,
    label: "Danger",
    color: "var(--danger)",
    tint: "color-mix(in srgb, var(--danger) 12%, transparent)",
  },
  success: {
    icon: Rocket,
    label: "Success",
    color: "var(--tip)",
    tint: "color-mix(in srgb, var(--tip) 12%, transparent)",
  },
};

export function Admonition({
  type = "note",
  title,
  children,
}: {
  type?: AdmonitionType;
  title?: string;
  children: React.ReactNode;
}) {
  const c = config[type];
  const Icon = c.icon;

  return (
    <aside
      className="my-6 flex gap-3 rounded-xl border border-border px-4 py-3.5"
      style={{ background: c.tint, borderColor: `color-mix(in srgb, ${c.color} 35%, var(--border))` }}
    >
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
        style={{ color: c.color }}
        aria-hidden
      >
        <Icon size={17} />
      </span>
      <div className="min-w-0 text-[0.94rem] leading-relaxed">
        <p className="mb-1 font-semibold" style={{ color: c.color }}>
          {title ?? c.label}
        </p>
        <div className="[&>p]:my-0 [&>p]:text-[inherit]">{children}</div>
      </div>
    </aside>
  );
}
