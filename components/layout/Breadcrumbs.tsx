import Link from "next/link";
import { ChevronRight } from "@/components/ui/icons";
import { withBasePath } from "@/lib/util";

export function Breadcrumbs({
  locale,
  home,
  section,
  sectionHref,
  title,
}: {
  locale: string;
  home: string;
  section?: string;
  sectionHref?: string;
  title?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      <Link href={withBasePath(`/${locale}`)} className="transition-colors hover:text-foreground">
        {home}
      </Link>
      {section && (
        <>
          <ChevronRight size={12} className="text-muted-foreground/60" />
          {sectionHref ? (
            <Link href={withBasePath(sectionHref)} className="transition-colors hover:text-foreground">
              {section}
            </Link>
          ) : (
            <span>{section}</span>
          )}
        </>
      )}
      {title && (
        <>
          <ChevronRight size={12} className="text-muted-foreground/60" />
          <span className="font-medium text-foreground">{title}</span>
        </>
      )}
    </nav>
  );
}
