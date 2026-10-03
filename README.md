# Stratum — local-first asset vault (Tauri 2 · Rust + React/TS)

**Stratum is a product of [Arkynox](https://arkynox.com). Developed by Akkil M G ([@AkkilMG](https://github.com/AkkilMG)).**
© 2026 Arkynox. All rights reserved. See `LICENSE.txt`.

Prerequisites: Rust stable, Node 18+, Git (+ optional Git LFS), Tauri v2 OS deps (https://tauri.app/start/prerequisites/).
Optional AI: `ollama pull llava:7b && ollama pull nomic-embed-text`.

```
npm install
npm run tauri icon path/to/square-logo.png   # generates src-tauri/icons (once)
npm run tauri dev
npm run tauri build
```
Open a folder: Stratum runs `git init`, indexes files, builds thumbnails, auto-commits on change, tags images with LLaVA
and stores embeddings in `<vault>/.stratum/index.db`. Without Ollama everything works except semantic search (keyword fallback).

Drag files or folders into the window to import them (copied to `Imported/`, then indexed and versioned automatically).
SVG vector maps and PSD files get real thumbnails and AI tags. Use Git LFS for large binaries.

## Where should assets live?
- **This PC only**: simplest and fastest.
- **This PC + NAS (recommended for teams)**: a local working copy for speed, plus a shared bare Git repository on the NAS (or any SSH/HTTPS Git server over LAN/VPN/WAN). Offline-safe; syncs in the background.
- **Join**: clone an existing studio vault from the NAS.
The index database and thumbnails always stay on the local machine (never on a network share). Folders on network drives are detected automatically and use polling plus a local git directory.
Git LFS is opt-in: a plain NAS folder can't serve LFS objects.

## Build installers
Tauri builds installers for the OS it runs on, so build each platform on its own OS (or let CI do both).

**Windows** (.exe setup + .msi), from the project root on Windows:
```
npm install
npm run icons
npm run tauri build
```
Output: `src-tauri\target\release\bundle\nsis\*.exe` and `...\msi\*.msi`.

**Linux** (.deb, .rpm, .AppImage), on Ubuntu/Debian (or WSL with the project inside the Linux filesystem):
```
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf libssl-dev libgtk-3-dev build-essential curl
npm install && npm run icons && npm run tauri build
```
Output: `src-tauri/target/release/bundle/{deb,rpm,appimage}/`.

**Both at once:** push the project to GitHub and push a tag (`git tag v0.1.0 && git push --tags`) or run the
"build-installers" workflow manually. Installers appear as a draft release and as downloadable artifacts.

### Linux packages from a Windows PC (Docker)
```
docker build -f Dockerfile.linux -t stratum-linux .
docker run --rm -v "%cd%\dist-linux:/out" stratum-linux      # PowerShell: -v "${PWD}\dist-linux:/out"
```
The `.deb`, `.rpm` and `.AppImage` appear in `dist-linux\`. Install on Ubuntu/Debian with `sudo apt install ./Stratum_0.1.0_amd64.deb`.

## Legal, policies and licenses
- `LICENSE.txt` / `legal/EULA.md`: Stratum End User License Agreement (shown in the NSIS installer and in the app).
- `legal/PRIVACY.md`: privacy policy. Users must accept both before first use, and again whenever `POLICY_VERSION` in `src/legal.ts` changes (bump it and the "Version" lines in the documents together). Acceptance is recorded in `acceptance.json` in the app data folder.
- `THIRD_PARTY_NOTICES.txt` and `src/licenses.json`: every shipped open-source dependency with its license files. Regenerate with `npm run licenses` (needs `cargo` and `npm install`). It runs automatically before every `tauri build`, so installers always carry the full list for their own platform.
- Note: resvg/usvg and a few related crates are MPL-2.0 (unmodified). Git, Ollama and AI models are used but not bundled (see `legal/EXTERNAL.md`).
- The legal text is a working draft. Have a qualified lawyer review the EULA and privacy policy (governing law, liability caps, commercial terms) before distributing commercially.

## Branding
- `src-tauri/icons/` and `app-icon.png`: the Stratum app icon (rounded dark tile), generated for Windows (.ico), macOS (.icns) and Linux (PNG). Regenerate after changing `app-icon.png` with `npm run icons`.
- `src/assets/`: logos used inside the app. The Stratum mark (small, transparent) and tile (large), Arkynox Studio logo in a light version (PNG) and a dark version (SVG). The app switches between them with the theme.
- `src-tauri/installer/`: branded artwork for the NSIS and MSI installers.
- `branding/`: clean transparent versions of the logos for marketing and docs (SVG and PNG), including the Arkynox Tech logo.
- Splash screen: `src/Splash.tsx` (Arkynox first, then Stratum, about 3 seconds, skips on click or key, waits for the last space to open).

## Languages
English (default), Spanish, Russian, Hindi, French and German, in a formal register. The user picks a language on the very first screen, before any policy is shown, and can change it any time in Settings; the whole app updates instantly.
- Dictionaries: `src/locales/*.ts`. `en.ts` is the source; the other files are type-checked against it, so a missing key fails the build. Keep `{placeholders}` identical.
- The Summary tab of the policy gate is translated. The full License Agreement and Privacy Policy stay in English, which is the legally binding text (stated in the app).
- Backend errors are sent as codes (`E:nas_down`) and translated in the UI.
- Adding a language: copy `en.ts`, translate, then register it in `src/i18n.tsx` (`LANGS`, `D`).

## Contact
Support, bugs, vulnerabilities, feedback, feature requests and policy questions: support@arkynox.com. General: hello@arkynox.com. Website: https://arkynox.com
