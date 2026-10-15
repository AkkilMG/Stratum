# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-15

The first public release of Stratum. This release is free and open source, dual-licensed under the [Stratum Community License](LICENSE.txt) or the [Apache License 2.0](LICENSE-APACHE.txt).

### Added

**Asset vault**

- Local-first asset vault for game studios. Open an existing folder, create a new space, or join a teammate's space.
- Automatic background versioning with Git. Every change is saved as a version with no commits or commands to learn.
- File-watcher change detection with automatic commits, plus a 10-second polling fallback so network drives and NAS shares stay indexed.
- Drag-and-drop import anywhere in the window (files are copied into `Imported/` and picked up automatically) and an "Add files…" dialog.
- SQLite index stored at `<vault>/.stratum/index.db`, with assets classified by kind: image, vector, 3D model, source file, audio and other.
- Thumbnail generation for raster images, SVG vector maps (resvg) and PSD files (psd), with size guards for very large files.

**Find and organize**

- Library with visual grid and list layouts, sort by recent, name or largest, and filters by file type and tag.
- Keyword search, with an automatic keyword fallback when the local AI is offline.
- Optional local AI through [Ollama](https://ollama.com): LLaVA (`llava:7b`) suggests tags, and `nomic-embed-text` powers search by meaning (cosine similarity with keyword boost). Nothing leaves your machine.
- In-app download of the recommended Ollama models and a system check for Git, Git LFS, Ollama, the vision model and the embedding model.
- Editable tags: AI-suggested tags can be added or removed, and search follows. Tags sync with teammates through `.stratum-tags.json`.

**Versioning and sync**

- Per-asset version history with author and relative time, plus a side-by-side preview of any older version.
- Restore any version as a new version, so going back never destroys anything.
- Activity timeline (the last 60 changes) and a dedicated Studio sync view.
- Team sync through a shared bare Git repository on a NAS, LAN, VPN or WAN: create the shared repository, join by cloning it, or point an existing space at a remote.
- Manual "Sync now" plus background sync every 120 seconds, and offline-safe queueing: work continues when the NAS is unreachable and syncs when it returns.
- Conflict-safe merges: if two people edit the same file, your version stays in place and the teammate's version is saved next to it as “(conflict from teammate)”. Nothing is overwritten.
- Optional Git LFS support for servers that provide it (Gitea, GitLab, GitHub).
- Storage and sync stats: asset count, storage used and bytes by type, tagged count, versions saved, ahead/behind status, and automatic network-drive detection with a local "safe mode".

**Experience**

- First-run setup: language picker, splash screen, and a guided wizard for your name, storage mode (this PC, this PC + studio NAS, or join), folder and NAS pickers, optional Git LFS, a system check and a progress log while the space is created.
- Interactive 60-second tour that runs against a safe sample demo space (nothing real is touched), with a "Practice" space.
- Home screen to create, open, join, revisit or forget spaces, and to replay the tour.
- Command palette (Ctrl+K) and keyboard shortcuts for search, quick actions and navigation.
- Settings for profile name, language, appearance (system, light or dark), space details, local AI status, support and feedback, diagnostics copying, and replaying the tour.
- Licenses and legal: a first-run acceptance gate, a plain-language summary, the license agreement, the privacy policy, a searchable browser of bundled open-source licenses, external software notices, and policy versioning with recorded acceptance.
- About dialog, an error boundary that protects your files and history, and contextual notices for network drives, missing NAS and offline local AI.
- Six languages: English, Spanish, Russian, Hindi, French and German.

**Distribution and project**

- Installers for Windows (NSIS `.exe` and `.msi`), Linux (`.deb`, `.rpm`, `.AppImage`) and macOS (`.dmg`), with Docker-based Linux builds. Requires Node.js 20.19+ to build from source.
- Free and open source, dual-licensed under the [Stratum Community License](LICENSE.txt) or the OSI-approved [Apache License 2.0](LICENSE-APACHE.txt). Use it under either, at your choice; the Community License adds a no-resale clause and asks forks to stay honest about being modifications of Stratum. See [LICENSING.md](LICENSING.md).
- Signed, in-app auto-updates: installed builds check the signed release feed and install new versions without reinstalling.
- Supply-chain security: OpenSSF Scorecard, CodeQL static analysis, weekly `cargo audit` and `npm audit`, a per-platform SPDX Software Bill of Materials (generated with Syft), and SLSA build-provenance and SBOM attestations that anyone can verify with `gh attestation verify`. See [SUPPLY-CHAIN.md](docs/SUPPLY-CHAIN.md).
- Free code-signing paths: Windows through [`scripts/sign-windows.ps1`](scripts/sign-windows.ps1) (PFX certificate) or the optional SignPath Foundation workflow, and macOS ad-hoc self-signed with hardened-runtime entitlements (config wired, inactive until a Developer ID is available). See [CERTIFICATION.md](docs/CERTIFICATION.md).
- Package-manager manifests for winget, Scoop, Chocolatey, Homebrew, Flatpak, Snap, AUR and MSIX in [`packaging/`](packaging/), with a generator script to refresh versions and hashes. See [DISTRIBUTION.md](docs/DISTRIBUTION.md).
- In-app Community section with links to the source code, contributing guide and issue tracker.
- Continuous integration, issue and pull request templates, and Dependabot updates.
- Project documentation: README, contributing guide, code of conduct, security policy, support, roadmap, architecture, building, development, translating, FAQ, certification, distribution and supply-chain guides.

### Changed

- Stratum is now free and open source, dual-licensed under the Stratum Community License or Apache-2.0 (SPDX: `Apache-2.0 OR LicenseRef-Stratum-Community-1.0`). The Apache-2.0 option is the OSI-approved alternative for registries and policies that require it.
- Bundle identifier is now `com.arkynox.stratum`.
- Toolchain and dependencies advanced to current major versions: React 19, Vite 8, ESLint 10, TypeScript 6, Tauri 2.12, ureq 3, resvg 0.48, rusqlite 0.40, notify 8, base64 0.23 and windows-sys 0.61.
- CI/CD GitHub Actions updated to current major versions (checkout, setup-node and upload-artifact v7; CodeQL v4; Tauri Action v1; SignPath v3; attest actions v4; Scorecard v2.5).
- About and Settings now link to the source repository and contribution channels.

### Fixed

- Windows code signing now resolves the signing script path correctly during `tauri build`.
- React 19 compatibility: replaced the removed global `JSX` namespace with `React.JSX`.

### Security and privacy

- No accounts, no telemetry and no cloud. Your files, tags and usage data stay on your own machines.
- The index database and thumbnails always stay on the local machine.
- Backend errors are reduced to stable, translatable codes, so file paths, host names and credentials never reach the interface.
- Bounded time budgets for SVG and PSD thumbnail rendering and for local-AI requests, plus automatic pruning of the thumbnail cache, so a malformed or oversized asset cannot exhaust local resources.
- The WebView is hardened against the browser context menu, reload/print/devtools accelerators and image drag-out.

[Unreleased]: https://github.com/AkkilMG/Stratum/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AkkilMG/Stratum/releases/tag/v0.1.0
