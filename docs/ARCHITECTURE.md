# Architecture

Stratum is a [Tauri 2](https://tauri.app) desktop application: a web frontend rendered in a native webview, plus a Rust backend that does the real work. There is no server and no telemetry.

```
┌───────────────────────────────────────────────┐
│  Frontend (React + TypeScript, src/)           │
│  UI, i18n, state; calls the backend over Tauri │
│  commands and listens for events               │
└───────────────┬───────────────────────────────┘
                │ invoke("command", payload)
                │ listen("vault-changed" | "busy" | "sync-state")
┌───────────────▼───────────────────────────────┐
│  Backend (Rust, src-tauri/src/)                │
│  Git versioning · file indexing · thumbnails   │
│  SQLite index · Ollama client · NAS sync       │
└───────────────────────────────────────────────┘
```

## Frontend (`src/`)

- `App.tsx` — the main shell: navigation, library, overview, history, settings, the command palette and the tour.
- `components/`
  - `common/` — shared UI (modal, combobox, icons, `ExtLink`, credits, error boundary).
  - `onboarding/` — splash screen, language picker, first-run wizard and the guided tour.
  - `settings/` — the Settings page and the About dialog.
  - `legal/` — the policy gate and the License, Privacy, Community and third-party license viewer.
- `i18n/` — translation context and locale dictionaries. `en.ts` is the source of truth.
- `services/api.ts` — a thin typed wrapper over Tauri's `invoke`, plus the built-in demo mode.
- `styles/styles.css` — all styling.
- `config/legal.ts` — the policy version, app identity and the legal document texts.

## Backend (`src-tauri/src/`)

- Runs `git` as a child process for versioning; large binaries can use Git LFS if enabled.
- Watches the vault for changes and commits automatically.
- Builds thumbnails for images, SVG vector maps and PSD files.
- Stores a search index and embeddings in `<vault>/.stratum/index.db` (SQLite via `rusqlite`).
- Talks to a local [Ollama](https://ollama.com) server at `localhost:11434` for image tagging and embeddings. Nothing leaves the machine. If Ollama is absent, keyword search is used.
- Syncs with a configured Git remote (NAS folder, or an `ssh://` / `https://` server).

## Data and storage

- **Your assets** stay in the folder you choose, versioned in its hidden `.git` directory.
- **The index and thumbnails** live in the local application data folder (never on a network share). They can be deleted and will be rebuilt.
- **Preferences** (name, language, theme, recent spaces) are stored in the app's local settings.
- **Policy acceptance** (version, date, name) is recorded in `acceptance.json` in the app data folder.

## Error handling

Backend errors are returned to the frontend as codes of the form `E:code[:detail]` and translated in the UI. Strings intended for the user are returned as `M:code[:n]`.

## Security model

Stratum runs entirely on the user's machine. It makes network connections only to destinations the user sets up (Ollama on localhost, and the Git remote they configure). See [`../SECURITY.md`](../SECURITY.md) and [`../legal/PRIVACY.md`](../legal/PRIVACY.md).
