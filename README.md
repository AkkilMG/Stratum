# Stratum

**Local-first, versioned, searchable asset vault for game studios.**

Stratum keeps every version of every texture, map, model and source file, finds assets by what they *look* like, and works fully offline. Nothing is uploaded to anyone's cloud.

Stratum is **free and open source — and it will stay that way.** The full source code is public and everyone is welcome to contribute, report bugs, request features and improve the documentation.

[![CI](https://github.com/AkkilMG/Stratum/actions/workflows/ci.yml/badge.svg)](https://github.com/AkkilMG/Stratum/actions/workflows/ci.yml)
[![License: Stratum Community](https://img.shields.io/badge/license-Stratum%20Community-2b50ff.svg)](LICENSE.txt)
![Platforms](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-98a3b3)
[![Made with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-24C8DB.svg)](https://tauri.app)

Repository: <https://github.com/AkkilMG/Stratum> · Website: <https://arkynox.com>

---

## Why Stratum

Game studios generate thousands of assets. They get renamed, overwritten, lost and duplicated across drives. Stratum gives a studio one place to keep them:

- **Every save is a version.** Files are versioned automatically in the background. No commits, no commands to learn.
- **Search by meaning, not filenames.** Describe what you want ("red desert sector map") and find it, even if nothing is named that.
- **Works offline.** Your working copy lives on your machine. Sync with a NAS or Git server when it is reachable.
- **Your data stays yours.** No accounts, no telemetry, no cloud. Local AI only.
- **Real previews.** Images, SVG vector maps and PSD files get thumbnails; the local AI suggests tags.

## Features

- Local-first asset vault with automatic background versioning (Git under the hood).
- Visual grid and list views with previews for images, SVG maps and PSDs.
- Keyword search plus semantic search using local embeddings.
- Optional local AI tagging and search via [Ollama](https://ollama.com) (nothing leaves your machine).
- Team sync through a shared bare Git repository on a NAS, LAN, VPN or WAN.
- Conflict-safe: concurrent edits are kept side by side, never overwritten.
- Six languages: English, Spanish, Russian, Hindi, French, German.
- Available for Windows, macOS and Linux.

## Screenshots

> Add screenshots to `docs/` and link them here. Brand assets live in [`branding/`](branding/).

## Install

Prebuilt installers are published on the [releases page](https://github.com/AkkilMG/Stratum/releases).

| Platform | Package |
| --- | --- |
| Windows | `.exe` setup (NSIS) or `.msi` |
| Linux | `.deb`, `.rpm` or `.AppImage` |
| macOS | `.dmg` (build from source — see below) |

## Build from source

**Prerequisites:** Rust (stable), Node.js 18+ (20 recommended), Git, and the [Tauri v2 system dependencies](https://tauri.app/start/prerequisites/) for your OS.
Optional local AI: `ollama pull llava:7b && ollama pull nomic-embed-text`.

```bash
git clone https://github.com/AkkilMG/Stratum.git
cd Stratum
npm install
npm run tauri dev      # run in development
npm run tauri build    # build installers for your OS
```

Tauri builds installers for the OS it runs on. See [`docs/BUILDING.md`](docs/BUILDING.md) for platform notes and Linux packages via Docker, and the [build-installers workflow](.github/workflows/release.yml) for CI.

## How it works

Open a folder and Stratum runs `git init`, indexes the files, builds thumbnails, auto-commits on change, tags images with LLaVA and stores embeddings in `<vault>/.stratum/index.db`. Without Ollama everything works except semantic search (keyword fallback).

Drag files or folders into the window to import them (copied to `Imported/`, then indexed and versioned automatically). See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full picture.

### Where should assets live?

- **This PC only** — simplest and fastest.
- **This PC + NAS (recommended for teams)** — a fast local working copy plus a shared bare Git repository on the NAS (or any SSH/HTTPS Git server over LAN/VPN/WAN). Offline-safe; syncs in the background.
- **Join** — clone an existing studio vault.

The index database and thumbnails always stay on the local machine. Network drives are detected automatically and use polling plus a local git directory.

## Contributing

All contributions are welcome — code, documentation, translations, bug reports and feature ideas. You do not need to be part of any team to help.

- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) to get started.
- Please follow our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Report security issues privately as described in [`SECURITY.md`](SECURITY.md).
- Browse [good first issues](https://github.com/AkkilMG/Stratum/labels/good%20first%20issue) if you are new.

When you modify Stratum, please clearly mark your version as a modification of Stratum and link back to this repository.

## License

Stratum is released under the **Stratum Community License**. In short: free to use, study, modify and share; not for resale; and forks must be honest about being modifications of Stratum. See [`LICENSE.txt`](LICENSE.txt) for the exact terms and [`TRADEMARK.md`](TRADEMARK.md) for brand usage.

Stratum includes open-source components under their own licenses. See [`THIRD_PARTY_NOTICES.txt`](THIRD_PARTY_NOTICES.txt) or the in-app **Licenses** screen.

## Credits

Stratum is a product of [Arkynox](https://arkynox.com), developed by [Akkil M G (@AkkilMG)](https://github.com/AkkilMG).
