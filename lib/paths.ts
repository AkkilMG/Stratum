import { withBasePath } from "./util";

export function buildLocaleHref(locale: string, path: string): string {
  return withBasePath(`/${locale}${path}`);
}

export function withBaseHref(path: string): string {
  return withBasePath(path);
}
