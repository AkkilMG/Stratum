import eula from "../legal/EULA.md?raw";
import privacy from "../legal/PRIVACY.md?raw";
import external from "../legal/EXTERNAL.md?raw";
export const POLICY_VERSION = "2026-10-03.2";
export const APP = { name: "Stratum", owner: "Arkynox", site: "https://arkynox.com", developer: "Akkil M G", github: "https://github.com/AkkilMG", support: "support@arkynox.com", hello: "hello@arkynox.com", year: 2026 };
export const DOCS = { eula, privacy, external };
export type Acceptance = { v: string; at: string };
export const getAcceptance = (): Acceptance | null => { try { return JSON.parse(localStorage.getItem("legal") || "null"); } catch { return null; } };
