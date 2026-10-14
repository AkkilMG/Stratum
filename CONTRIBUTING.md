# Contributing to Stratum

First off, thank you for taking the time to contribute. Stratum is free and open source, and it gets better with every person who helps — code, documentation, translations, bug reports and ideas all count. You do not need to be part of any team.

This guide explains how to set up the project, make changes, and submit them.

## Code of conduct

By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please be kind and respectful.

## Ways to contribute

- **Report a bug** using the [bug report template](https://github.com/AkkilMG/Stratum/issues/new/choose).
- **Request a feature** using the [feature request template](https://github.com/AkkilMG/Stratum/issues/new/choose).
- **Report a security issue** privately — see [SECURITY.md](SECURITY.md).
- **Improve the code or docs** by opening a pull request.
- **Translate** the app (see below).
- **Improve this guide or the README.**

## Development setup

**Prerequisites**

- [Rust](https://rustup.rs/) (stable)
- Node.js 20.19+ (see `.nvmrc`)
- Git
- [Tauri v2 system dependencies](https://tauri.app/start/prerequisites/) for your OS

```bash
git clone https://github.com/AkkilMG/Stratum.git
cd Stratum
npm install
npm run tauri dev
```

The optional local AI features use [Ollama](https://ollama.com):

```bash
ollama pull llava:7b
ollama pull nomic-embed-text
```

Without Ollama the app works normally; semantic search falls back to keyword search.

## Project layout

```
src/                React + TypeScript frontend
  components/       UI (common, onboarding, settings, legal)
  i18n/locales/     translations (en is the source of truth)
  services/         Tauri command bridge
src-tauri/          Rust backend (Tauri)
  src/              commands, indexing, git, AI
legal/              license, privacy and external-software documents
docs/               architecture and build documentation
scripts/            build helpers (license gathering)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## Checks before you submit

Run these and make sure they pass:

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run build       # production frontend build
cargo clippy --manifest-path src-tauri/Cargo.toml
```

If you changed dependencies, or are preparing a release, regenerate the license bundle:

```bash
npm run licenses
```

## Pull requests

1. Fork the repository and create a branch from `main` (`git checkout -b fix/short-description`).
2. Keep the change focused. Small, single-purpose PRs are easier to review.
3. Update documentation and the `CHANGELOG.md` `Unreleased` section when relevant.
4. Fill in the pull request template.
5. Make sure CI is green.

**Commit messages:** a short imperative subject line (for example `Fix NAS reconnect on sleep`), with more detail in the body if needed.

## Code style

- TypeScript/React for the frontend, Rust for the backend.
- We use ESLint and Prettier. Run `npm run format` before committing, or let the CI guide you.
- Match the existing style of the file you are editing.
- No comments unless they explain something non-obvious.

## Translations

English (`src/i18n/locales/en.ts`) is the source of truth. The other locale files are type-checked against it, so **every key must exist in every language**, or the build fails.

- Keep `{placeholders}` identical to English.
- Do not translate product names (Stratum, Arkynox).
- To add a language: copy `en.ts`, translate it, then register it in `src/i18n/index.tsx` (`LANGS`, `D`).

See [docs/TRANSLATING.md](docs/TRANSLATING.md) for the full guide.

## Licensing of contributions

By submitting a contribution you agree that it is licensed under the [Stratum Community License](LICENSE.txt), and you confirm you have the right to submit it. You keep the copyright in your own contribution.

## Questions

Open an issue or write to contact@arkynox.com. Thanks for helping make Stratum better!
