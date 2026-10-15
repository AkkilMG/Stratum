import Link from "next/link";
import { AlertCircle } from "@/components/ui/icons";
import { withBasePath } from "@/lib/util";

export function NotTranslated({
  locale,
  path,
  messages,
}: {
  locale: string;
  path: string;
  messages: any;
}) {
  return (
    <div className="mb-6 rounded-xl border border-border bg-[color-mix(in_srgb,var(--warning)_12%,var(--muted))] p-4">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-warning" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{messages.common.notTranslated}</p>
          <p className="text-sm text-muted-foreground">{messages.common.notTranslatedBody}</p>
          <p className="pt-1">
            <Link
              href={withBasePath(`/en/${path}`)}
              className="text-sm font-medium text-primary hover:underline"
            >
              View this page in English →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
