# Screenshot capture guide

The wiki renders an animated placeholder frame for any screenshot that is missing,
so the site is always presentable. To replace a placeholder with a real image,
drop a PNG into `public/screenshots/` using the exact file name listed below.

No code changes are required — the `<Screenshot name="..." />` component already
points at `/screenshots/<name>.png`.

## Required files

| File name            | Where it appears                          | What to capture                                                        |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `home.png`           | Introduction → What is Stratum            | Home screen with recent spaces / quick actions.                        |
| `wizard.png`         | Getting started → First launch            | Setup wizard (create new / open existing / join studio).               |
| `library.png`        | Guide → Browsing the library              | Library grid view with a few thumbnails and the filter bar visible.    |
| `detail.png`         | Guide → Asset details & versions          | Asset detail drawer: preview, metadata, tags, version history.         |
| `search.png`         | Guide → Search                            | Search results for a natural-language query.                           |
| `activity.png`       | Guide → Activity & Sync                   | Activity timeline plus remote / sync controls.                         |
| `tags.png`           | Guide → Tags                              | Tag editor with both manual and AI-generated tags.                     |
| `settings.png`       | Guide → Settings                          | Settings panel (profile, language, appearance).                        |
| `tour.png`           | Guide → Guided tour                       | A step of the 60-second guided tour overlay.                           |

## Specifications

- **Format:** PNG (24-bit, no transparency needed).
- **Aspect ratio:** 16:9 (e.g. `1920×1080`). The frame enforces `16 / 9`.
- **Width:** 1600–1920 px recommended. Keep files under ~600 KB each.
- **Theme:** Capture in **dark mode** for consistency with the docs default.
- **Content:** Use a demo space. Avoid real client or unreleased studio assets.
- **Window chrome:** Not needed — the site draws its own title bar around the image.

## Recommended capture flow

1. Launch Stratum (`npm run tauri dev`) and open or create a demo space.
2. Load a handful of sample assets so the library and thumbnails look populated.
3. Set the window to a 16:9 size, or capture then crop to 16:9.
4. On Windows use `Win` + `Shift` + `S`; on macOS use `Cmd` + `Shift` + `4`.
5. Save directly into `public/screenshots/` with the exact names above.
6. Run `npm run build` (or `npm run dev`) and confirm the placeholder is replaced.

## Adding a new screenshot

1. Place the PNG in `public/screenshots/<name>.png`.
2. Reference it in content with `<Screenshot name="<name>" caption="..." />`.
3. Add the entry to the table above so future contributors know what it shows.
