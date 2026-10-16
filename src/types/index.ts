export type Asset = { path: string; name: string; kind: string; size: number; mtime: number; tags: string; tagged: boolean };
export type Stats = { assets: number; bytes: number; tagged: number; commits: number; by_kind: [string, number][]; ollama: boolean; lfs: boolean; remote: string; ahead: number; network: boolean };
export type Commit = { hash: string; author: string; when: string; msg: string };
export type Cfg = { name: string; mode: "local" | "hub" | "join"; local: string; nas: string; lfs: boolean };
export type Check = { git: boolean; lfs: boolean; ollama: boolean; vision: boolean; embed: boolean; os?: string };
export type Ask = { title: string; body: string; label: string; run: () => Promise<void> | void };
