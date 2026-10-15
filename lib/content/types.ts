import type { DocPage, DocPageMeta } from "./registry";

export function definePage(meta: DocPageMeta, Body: React.FC<any>): DocPage {
  return { meta, Body };
}

export type { DocPage, DocPageMeta };
