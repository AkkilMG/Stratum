# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-15

The first public release of Stratum. This release is free and open source under the [Stratum Community License](LICENSE.txt).

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

- Installers for Windows (NSIS `.exe` and `.msi`), Linux (`.deb`, `.rpm`, `.AppImage`) and macOS (`.dmg`), with Docker-based Linux builds.
- Free and open source under the Stratum Community License (source-available: free to use, study, modify and share; no resale or rebranding; modifications must be marked as a modification of Stratum).
- In-app Community section with links to the source code, contributing guide and issue tracker.
- Continuous integration, issue and pull request templates, and Dependabot updates.
- Project documentation: README, contributing guide, code of conduct, security policy, support, roadmap, architecture, building and development guides.

### Changed

- Stratum is now free and open source under the Stratum Community License.
- About and Settings now link to the source repository and contribution channels.

### Security and privacy

- No accounts, no telemetry and no cloud. Your files, tags and usage data stay on your own machines.
- The index database and thumbnails always stay on the local machine.

[Unreleased]: https://github.com/AkkilMG/Stratum/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AkkilMG/Stratum/releases/tag/v0.1.0
