export function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.7rem] items-center justify-center rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.75rem] font-medium text-foreground shadow-[0_1.5px_0_var(--border)]">
      {children}
    </kbd>
  );
}

export function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      {keys.map((k, i) => (
        <span key={`${k}-${i}`} className="inline-flex items-center gap-1">
          <Key>{k}</Key>
          {i < keys.length - 1 && <span className="text-muted-foreground">+</span>}
        </span>
      ))}
    </span>
  );
}
