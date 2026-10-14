// Collects every shipped dependency (npm production + Rust normal deps for this OS) with its real license files.
// Outputs src/licenses.json (in-app viewer) and THIRD_PARTY_NOTICES.txt (shipped with installers). Run: npm run licenses
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const sh = (c, o = {}) => execSync(c, { encoding: "utf8", maxBuffer: 1e9, stdio: ["ignore", "pipe", "ignore"], ...o });
const CARGO = process.env.CARGO || "cargo", RUSTC = process.env.RUSTC || "rustc";
const texts = {}, pkgs = [], seen = new Set();
const keep = (t) => { const h = crypto.createHash("sha1").update(t).digest("hex").slice(0, 12); texts[h] = t; return h; };
const files = (dir) => { try { return fs.readdirSync(dir).filter((f) => /^(licen[cs]e|copying|notice|unlicense)/i.test(f) && fs.statSync(path.join(dir, f)).isFile()); } catch { return []; } };
const ids = (expr) => [...new Set(String(expr || "").replace(/[()]/g, " ").split(/\s+(?:OR|AND|WITH)\s+|\s*\/\s*/i).map((s) => s.trim()).filter(Boolean))];
const add = (e, n, v, l, r, dir) => {
  const k = `${e}:${n}@${v}`; if (seen.has(k)) return; seen.add(k);
  const f = files(dir).map((x) => { try { return keep(fs.readFileSync(path.join(dir, x), "utf8")); } catch { return null; } }).filter(Boolean);
  pkgs.push({ n, v, l: l || "UNKNOWN", r: (r || "").replace(/^git\+/, "").replace(/\.git$/, ""), e, f, d: dir });
};

// npm: production tree only (what actually ends up in the app bundle)
try {
  const lines = sh("npm ls --omit=dev --all --parseable").split(/\r?\n/).filter(Boolean).slice(1);
  for (const dir of lines) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
      const lic = typeof j.license === "string" ? j.license : j.license?.type || (j.licenses || []).map((x) => x.type).join(" OR ");
      const repo = typeof j.repository === "string" ? j.repository : j.repository?.url || j.homepage;
      add("npm", j.name, j.version, lic, repo, dir);
    } catch {}
  }
} catch (e) { console.warn("npm scan skipped:", e.message); }

// Rust: normal (shipped) dependencies for the host platform
try {
  const host = sh(`${RUSTC} -vV`).match(/host: (.+)/)[1].trim();
  const m = JSON.parse(sh(`${CARGO} metadata --format-version 1 --manifest-path src-tauri/Cargo.toml --filter-platform ${host}`));
  const byId = new Map(m.packages.map((p) => [p.id, p])), nodes = new Map(m.resolve.nodes.map((n) => [n.id, n]));
  const todo = [m.resolve.root], done = new Set();
  while (todo.length) {
    const id = todo.pop(); if (done.has(id)) continue; done.add(id);
    for (const d of nodes.get(id)?.deps ?? []) if (d.dep_kinds.some((k) => k.kind === null)) todo.push(d.pkg);
  }
  for (const id of done) {
    if (id === m.resolve.root) continue;
    const p = byId.get(id), dir = path.dirname(p.manifest_path);
    add("rust", p.name, p.version, p.license || (p.license_file ? `See ${p.license_file}` : ""), p.repository || p.homepage, dir);
  }
} catch (e) { console.warn("cargo scan skipped:", e.message.split("\n")[0]); }

// Fall back to the canonical SPDX text for packages that ship no license file
const need = [...new Set(pkgs.filter((p) => !p.f.length).flatMap((p) => ids(p.l)))];
for (const id of need) {
  try {
    const r = await fetch(`https://raw.githubusercontent.com/spdx/license-list-data/main/text/${id}.txt`);
    if (r.ok) { const h = keep(await r.text()); for (const p of pkgs) if (!p.f.length && ids(p.l).includes(id)) p.f.push(h); }
  } catch {}
}

pkgs.sort((a, b) => a.n.localeCompare(b.n) || a.v.localeCompare(b.v));
const out = pkgs.map(({ d: _d, ...p }) => p);
fs.writeFileSync("src/licenses.json", JSON.stringify({ generated: new Date().toISOString(), packages: out, texts }));
let n = `STRATUM THIRD-PARTY NOTICES\nStratum is free and open source software, a product of Arkynox (https://arkynox.com), developed by Akkil M G (https://github.com/AkkilMG).\nRepository: https://github.com/AkkilMG/Stratum  ·  License: Apache-2.0 OR Stratum Community License (see LICENSING.md)\nStratum includes the open-source components below. Each remains under its own license.\nGenerated ${new Date().toISOString()}\n`;
for (const p of out) {
  n += `\n${"=".repeat(78)}\n${p.n} ${p.v}  [${p.e}]\nLicense: ${p.l}\n${p.r ? "Source: " + p.r + "\n" : ""}\n`;
  n += p.f.length ? p.f.map((h) => texts[h].trim()).join("\n\n---\n\n") : "(License text not found in package. See the source link above.)";
  n += "\n";
}
fs.writeFileSync("THIRD_PARTY_NOTICES.txt", n);
const by = {}; out.forEach((p) => (by[p.l] = (by[p.l] || 0) + 1));
console.log(`${out.length} packages`, Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 14));
