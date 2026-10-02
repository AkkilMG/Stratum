# Stratum — local-first asset vault (Tauri 2 · Rust + React/TS)

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
