<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./branding/stratum-wordmark-dark.svg">
    <img alt="Stratum" src="./branding/stratum-wordmark.svg" width="440">
  </picture>

  <p><b>Local-first, versioned, searchable asset vault for game studios.</b></p>

  <p>
    <a href="https://github.com/AkkilMG/Stratum/actions/workflows/ci.yml"><img src="https://github.com/AkkilMG/Stratum/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
    <a href="https://securityscorecards.dev/viewer/?uri=github.com/AkkilMG/Stratum"><img src="https://api.securityscorecards.dev/projects/github.com/AkkilMG/Stratum/badge" alt="OpenSSF Scorecard"></a>
    <a href="LICENSING.md"><img src="https://img.shields.io/badge/license-Apache--2.0%20OR%20Stratum%20Community-2b50ff.svg" alt="License: Apache-2.0 OR Stratum Community"></a>
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-98a3b3" alt="Platforms: Windows, macOS, Linux">
    <a href="https://tauri.app"><img src="https://img.shields.io/badge/built%20with-Tauri%202-24C8DB.svg" alt="Built with Tauri 2"></a>
  </p>

  <p>
    <a href="https://github.com/AkkilMG/Stratum/releases"><b>Download</b></a> ·
    <a href="docs/BUILDING.md"><b>Build from source</b></a> ·
    <a href="docs/ARCHITECTURE.md"><b>How it works</b></a> ·
    <a href="CONTRIBUTING.md"><b>Contribute</b></a>
  </p>
</div>

---

## What is Stratum

Stratum keeps every version of every texture, map, model and source file, finds
assets by what they *look* like, and works fully offline. Nothing is uploaded to anyone's
cloud.

Stratum is **free and open source — and it will stay that way.** The full source code is
public, and everyone is welcome to contribute, report bugs, request features and improve
the documentation.

## Why Stratum

Game studios generate thousands of assets. They get renamed, overwritten, lost and
duplicated across drives. Stratum gives a studio one place to keep them:

| The usual mess | With Stratum |
| --- | --- |
| Files get renamed or overwritten, and nobody knows which copy is current | Every save is a version — automatic, in the background, no commits to remember |
| You know what an asset looks like but not what it is called | Search by meaning: "red desert sector map" finds it even if nothing is named that |
| Work stops the moment the network does | Fully offline; sync with a NAS or Git server whenever it is reachable |
| "Cloud" means accounts, telemetry and someone else's disk | No accounts, no telemetry, no cloud. Local AI only |
| PSDs and vector maps get opened just to check them | Real previews: images, SVG maps and PSDs get thumbnails, and local AI suggests tags |

## Features

- Local-first asset vault with automatic background versioning (Git under the hood).
- Visual grid and list views with previews for images, SVG maps and PSDs.
- Keyword search plus semantic search using local embeddings.
- Optional local AI tagging and search via [Ollama](https://ollama.com) (nothing leaves your
  machine).
- Team sync through a shared bare Git repository on a NAS, LAN, VPN or WAN.
- Conflict-safe: concurrent edits are kept side by side, never overwritten.
- Six languages: English, Spanish, Russian, Hindi, French, German.
- Available for Windows, macOS and Linux.

## Install

Prebuilt installers are published on the
[releases page](https://github.com/AkkilMG/Stratum/releases).

| Platform | Package |
| --- | --- |
| Windows | `.exe` setup (NSIS) or `.msi` |
| Linux | `.deb`, `.rpm` or `.AppImage` |
| macOS | `.dmg` (build from source — see below) |

CI also commits fresh builds into [`release/`](release/) whenever the
[build-installers workflow](.github/workflows/build-installers.yml) runs, so the newest
artifacts are always browsable straight from the repository.

## Build from source

**Prerequisites:** Rust (stable), Node.js 20.19+ (see `.nvmrc`), Git, and the
[Tauri v2 system dependencies](https://tauri.app/start/prerequisites/) for your OS.
Optional local AI: `ollama pull llava:7b && ollama pull nomic-embed-text`.

```bash
git clone https://github.com/AkkilMG/Stratum.git
cd Stratum
npm install
npm run tauri dev      # run in development
npm run tauri build    # build installers for your OS
```

Tauri builds installers for the OS it runs on. See [`docs/BUILDING.md`](docs/BUILDING.md)
for platform notes and Linux packages via Docker. CI can build every platform for you: run
the [build-installers workflow](.github/workflows/build-installers.yml) to build all
platforms and commit the installers into `release/`, or the
[release workflow](.github/workflows/release.yml) to publish a tagged release.

## How it works

Open a folder and Stratum runs `git init`, indexes the files, builds thumbnails,
auto-commits on change, tags images with LLaVA and stores embeddings in
`<vault>/.stratum/index.db`. Without Ollama everything works except semantic search
(keyword fallback).

Drag files or folders into the window to import them (copied to `Imported/`, then indexed
and versioned automatically). See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the
full picture.

### Where should assets live?

- **This PC only** — simplest and fastest.
- **This PC + NAS (recommended for teams)** — a fast local working copy plus a shared bare
  Git repository on the NAS (or any SSH/HTTPS Git server over LAN/VPN/WAN). Offline-safe;
  syncs in the background.
- **Join** — clone an existing studio vault.

The index database and thumbnails always stay on the local machine. Network drives are
detected automatically and use polling plus a local git directory.

## Trust, signing and verification

Installers are built in public CI and published on
[GitHub Releases](https://github.com/AkkilMG/Stratum/releases). Every release ships a
Software Bill of Materials and SLSA build-provenance attestations that anyone can verify:

```bash
gh attestation verify ./Stratum_0.1.0_x64-setup.exe --repo AkkilMG/Stratum
```

Stratum is **free and open source at $0 cost**, so it uses free trust paths: SignPath
Foundation for Windows (once approved), ad-hoc signing for macOS, and store builders for
Linux. Installed builds update themselves from the signed release feed.

- [`docs/CERTIFICATION.md`](docs/CERTIFICATION.md) — how trust is established on each
  platform.
- [`docs/DISTRIBUTION.md`](docs/DISTRIBUTION.md) — packaging, stores and package managers.
- [`docs/SUPPLY-CHAIN.md`](docs/SUPPLY-CHAIN.md) — SBOM, SBOM/provenance attestations and
  verification.
- [`packaging/`](packaging/) — manifests for winget, Scoop, Chocolatey, Homebrew, Flatpak,
  Snap, AUR and MSIX.

## Documentation

| Document | Covers |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the vault, index and sync layers fit together |
| [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | Development setup, code layout and conventions |
| [`docs/BUILDING.md`](docs/BUILDING.md) | Platform build notes and Linux packages via Docker |
| [`docs/FAQ.md`](docs/FAQ.md) | The questions people ask first |
| [`docs/DISTRIBUTION.md`](docs/DISTRIBUTION.md) | Packaging, stores and package managers |
| [`docs/CERTIFICATION.md`](docs/CERTIFICATION.md) | Platform trust and signing |
| [`docs/SUPPLY-CHAIN.md`](docs/SUPPLY-CHAIN.md) | SBOM, provenance and verification |
| [`docs/TRANSLATING.md`](docs/TRANSLATING.md) | Adding or fixing a translation |
| [`CHANGELOG.md`](CHANGELOG.md) | What has shipped, per release |
| [`ROADMAP.md`](ROADMAP.md) | Where the project is heading |
| [`SUPPORT.md`](SUPPORT.md) | How to get help |

## Roadmap and status

Stratum is at **v0.1.0** — usable every day, still moving fast. See
[`ROADMAP.md`](ROADMAP.md) for what comes next and [`CHANGELOG.md`](CHANGELOG.md) for what
has already shipped.

## Contributing

All contributions are welcome — code, documentation, translations, bug reports and feature
ideas. You do not need to be part of any team to help.

- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) to get started.
- Please follow our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Report security issues privately as described in [`SECURITY.md`](SECURITY.md).
- Improve the docs in [`docs/`](docs/), starting with [`docs/FAQ.md`](docs/FAQ.md) and
  [`docs/TRANSLATING.md`](docs/TRANSLATING.md).
- Browse [good first issues](https://github.com/AkkilMG/Stratum/labels/good%20first%20issue)
  if you are new.

When you modify Stratum, please clearly mark your version as a modification of Stratum and
link back to this repository.

## License

Stratum is **dual-licensed** — you may use it under the **Stratum Community License** *or*
the **Apache License 2.0**, at your choice. In short: free to use, study, modify and share.
The Community License adds a no-resale clause and asks forks to stay honest about being
modifications of Stratum; **Apache-2.0** is the permissive, OSI-approved alternative (with a
patent grant) for anyone who needs it.

See [`LICENSING.md`](LICENSING.md) for how to choose, [`LICENSE.txt`](LICENSE.txt) for the
Community License, [`LICENSE-APACHE.txt`](LICENSE-APACHE.txt) for Apache-2.0, and
[`TRADEMARK.md`](TRADEMARK.md) for brand usage.

Stratum includes open-source components under their own licenses. See
[`THIRD_PARTY_NOTICES.txt`](THIRD_PARTY_NOTICES.txt) or the in-app **Licenses** screen.

## Credits

Stratum is a product of [Arkynox](https://arkynox.com), developed by
[Akkil M G (@AkkilMG)](https://github.com/AkkilMG).

Built on [Tauri 2](https://tauri.app) and [Ollama](https://ollama.com), versioned with plain
`git`.

---

<p align="center">
  <a href="https://github.com/AkkilMG/Stratum">Repository</a> ·
  <a href="https://arkynox.com">Website</a>
</p>
