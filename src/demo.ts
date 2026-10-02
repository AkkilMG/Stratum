import type { Asset, Commit, Stats } from "./types";
const now = () => Date.now() / 1000;
const hue = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const art = (seed: string, v = 0) => {
  const h = hue(seed); let s = "";
  for (let i = 0; i < 9; i++) s += `<ellipse cx='${100 + (i % 3) * 7 + v * 14}' cy='${100 + (i % 2) * 6}' rx='${14 + i * 10}' ry='${10 + i * 8}' fill='none' stroke='hsl(${h},60%,${30 + i * 5}%)' stroke-width='2.4' transform='rotate(${i * 9 + v * 28} 100 100)'/>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='hsl(${h},45%,93%)'/>${s}</svg>`);
};
const A = (name: string, kind: string, mb: number, age: number, tags: string): Asset => ({ path: name, name, kind, size: mb * 1e6, mtime: now() - age, tags, tagged: true });
const DEMO: Asset[] = [
  A("desert_sector_map.svg", "Vector", 3.2, 600, "desert, sand dunes, sector map, orange, top-down"),
  A("ocean_loop_map.svg", "Vector", 5.8, 4000, "ocean, waves, looping map, blue, coastline"),
  A("hud_mockup_v3.psd", "Source", 148, 9000, "ui mockup, hud, health bar, dark, sci-fi"),
  A("hero_portrait.png", "Image", 12.4, 20000, "character, portrait, armor, concept art"),
  A("jungle_river_sector.svg", "Vector", 4.1, 40000, "jungle, river, green, sector map"),
  A("main_menu_ui.fig", "Source", 22, 90000, "menu, buttons, ui mockup, flat"),
  A("tank_model.fbx", "Model", 310, 150000, "vehicle, tank, military, 3d model"),
  A("ruins_texture.png", "Image", 18.6, 300000, "ruins, stone, tileable texture, grey"),
];
const SYN: Record<string, string[]> = { water: ["ocean", "river", "waves"], sand: ["desert"], dunes: ["desert"], sea: ["ocean"], red: ["orange"], menu: ["ui"], hud: ["ui"], vehicle: ["tank"] };
const ago = ["2 hours ago", "yesterday", "3 days ago", "last week"];
const hist = (n: string): Commit[] => ago.map((w, i) => ({ hash: ["a1b2c3d", "e4f5a6b", "7c8d9e0", "1f2a3b4"][i], author: "You", when: w, msg: i === 0 ? `Update ${n}` : i === 3 ? `Add ${n}` : `Update ${n}` }));
export async function demoCall(cmd: string, a?: Record<string, unknown>): Promise<unknown> {
  const by: Record<string, number> = {}; DEMO.forEach((x) => (by[x.kind] = (by[x.kind] ?? 0) + x.size));
  switch (cmd) {
    case "stats": return { assets: DEMO.length, bytes: DEMO.reduce((s, x) => s + x.size, 0), tagged: DEMO.length, commits: 24, by_kind: Object.entries(by).sort((x, y) => y[1] - x[1]), ollama: true, lfs: true, remote: "\\\\nas\\studio\\assets.git", ahead: 0, network: false } as Stats;
    case "list_assets": return DEMO;
    case "thumb": return DEMO.find((x) => x.path === a?.path)?.kind === "Model" ? null : art(String(a?.path));
    case "version_preview": return art(String(a?.path), 1);
    case "history": return hist(String(a?.path));
    case "activity": return DEMO.slice(0, 6).map((x, i) => ({ hash: "a1b2c" + i, author: i % 2 ? "Maya" : "You", when: ago[i % 4], msg: `Update ${x.name}` }));
    case "get_remote": return "\\\\nas\\studio\\assets.git";
    case "import_files": return 3;
    case "sync": return "Synced with the studio NAS";
    case "search": {
      const ws = String(a?.query ?? "").toLowerCase().split(/\s+/).filter(Boolean).flatMap((w) => [w, ...(SYN[w] ?? [])]);
      return DEMO.filter((x) => ws.some((w) => (x.name + " " + x.tags).toLowerCase().includes(w)));
    }
    default: return undefined;
  }
}
