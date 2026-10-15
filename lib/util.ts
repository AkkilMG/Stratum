export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!path) return base || "/";
  if (path.startsWith("http")) return path;
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!normalizedBase) return normalizedPath;
  return `${normalizedBase}${normalizedPath}`;
}

export function localeHref(locale: string, path: string): string {
  const base = withBasePath(`/${locale}${path}`.replace(/\/+/g, "/"));
  return base.endsWith("/") && base !== "/" ? base : base;
}
