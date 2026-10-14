import eula from "../../legal/EULA.md?raw";
import privacy from "../../legal/PRIVACY.md?raw";
import external from "../../legal/EXTERNAL.md?raw";
import openSource from "../../legal/OPEN_SOURCE.md?raw";
export const POLICY_VERSION = "2026-10-15.1";
export const APP = { name: "Stratum", owner: "Arkynox", site: "https://arkynox.com", developer: "Akkil M G", github: "https://github.com/AkkilMG", support: "support@arkynox.com", hello: "contact@arkynox.com", year: 2026,
  repo: "https://github.com/AkkilMG/Stratum", issues: "https://github.com/AkkilMG/Stratum/issues",
  issuesNew: "https://github.com/AkkilMG/Stratum/issues/new", contributing: "https://github.com/AkkilMG/Stratum/blob/main/CONTRIBUTING.md", security: "https://github.com/AkkilMG/Stratum/blob/main/SECURITY.md", license: "https://github.com/AkkilMG/Stratum/blob/main/LICENSE.txt" };
export const DOCS = { eula, privacy, external, openSource };
export type Acceptance = { v: string; at: number };
/** `at` is epoch milliseconds: dateOf() feeds it straight to `new Date`, which reads bare numbers as ms. */
export const getAcceptance = (): Acceptance | null => { try { const a = JSON.parse(localStorage.getItem("legal") || "null"); return a && typeof a.v === "string" ? a : null; } catch { return null; } };
export const saveAcceptance = (): Acceptance => { const a: Acceptance = { v: POLICY_VERSION, at: Date.now() }; try { localStorage.setItem("legal", JSON.stringify(a)); } catch {} return a; };
