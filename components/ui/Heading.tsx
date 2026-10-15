import { Link2 } from "@/components/ui/icons";

function Anchor({ id, children, level }: { id: string; children: React.ReactNode; level: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className={`group relative scroll-mt-24 ${
        level === 2
          ? "mt-11 mb-4 text-[1.5rem] font-semibold tracking-tight first:mt-0"
          : "mt-8 mb-3 text-[1.15rem] font-semibold tracking-tight"
      }`}
    >
      <a
        href={`#${id}`}
        className="absolute -left-6 top-0 flex h-full items-center text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
        aria-label={`Link to this section`}
      >
        <Link2 size={level === 2 ? 18 : 15} />
      </a>
      <span className="text-foreground">{children}</span>
    </Tag>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <Anchor id={id} level={2}>{children}</Anchor>;
}

export function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return <Anchor id={id} level={3}>{children}</Anchor>;
}

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
