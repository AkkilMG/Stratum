# Development

This guide covers running and working on Stratum locally. For packaging see [BUILDING.md](BUILDING.md), and for how the pieces fit together see [ARCHITECTURE.md](ARCHITECTURE.md).

## Prerequisites

- [Rust](https://rustup.rs/) (stable)
- Node.js 18+ (20 recommended)
- Git
- [Tauri v2 system dependencies](https://tauri.app/start/prerequisites/)

## Get started

```bash
git clone https://github.com/AkkilMG/Stratum.git
cd Stratum
npm install
npm run tauri dev
```

This starts the Vite dev server and launches the Tauri window with hot reload for the frontend. Rust changes trigger a rebuild.

## Optional: local AI

Install [Ollama](https://ollama.com) and pull the models used for tagging and semantic search:

```bash
ollama pull llava:7b
ollama pull nomic-embed-text
```

Keep Ollama running. Stratum detects it automatically. Without it, everything still works except semantic search (keyword search is used instead).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Frontend dev server only (no Tauri window). |
| `npm run tauri dev` | Full app in development. |
| `npm run build` | Type-check and build the frontend to `dist/`. |
| `npm run typecheck` | TypeScript check, no emit. |
| `npm run lint` / `npm run lint:fix` | ESLint. |
| `npm run format` / `npm run format:check` | Prettier. |
| `cargo clippy --manifest-path src-tauri/Cargo.toml` | Rust lints. |
| `npm run licenses` | Regenerate the license bundle. |

## Translations

See [CONTRIBUTING.md](../CONTRIBUTING.md#translations). In short: `src/i18n/locales/en.ts` is the source of truth, and all six locale files must contain every key.

## Tips

- The app supports a built-in demo vault (sample assets) via the guided tour, which is handy for UI work without a real vault.
- Use `?` in the app to see keyboard shortcuts, and `Ctrl/Cmd+K` for the command palette.
- Compare against `main` before opening a PR: `git fetch origin && git diff origin/main`.
