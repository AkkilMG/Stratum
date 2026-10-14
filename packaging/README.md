# Packaging

Distribution manifests for Stratum. These are **templates**: the repository URL,
version and file hashes must be refreshed for every release. The version in the
files here tracks `tauri.conf.json` (`0.1.0`).

Artifact names produced by `npm run tauri build` (Tauri v2, product name `Stratum`):

| Platform | File |
| --- | --- |
| Windows | `Stratum_<version>_x64-setup.exe`, `Stratum_<version>_x64_en-US.msi` |
| macOS | `Stratum_<version>_x64.dmg`, `Stratum_<version>_aarch64.dmg` |
| Linux | `Stratum_<version>_amd64.AppImage`, `Stratum_<version>_amd64.deb`, `Stratum-<version>-1.x86_64.rpm` |

Release assets live at
`https://github.com/AkkilMG/Stratum/releases/download/v<version>/<file>`.

## Contents

| Folder | Target | Where it is published |
| --- | --- | --- |
| `winget/` | Windows (winget) | PR to [microsoft/winget-pkgs](https://github.com/microsoft/winget-pkgs) |
| `scoop/` | Windows (Scoop) | A Scoop bucket repository |
| `chocolatey/` | Windows (Chocolatey) | Push to [community.chocolatey.org](https://community.chocolatey.org) |
| `homebrew/` | macOS (Homebrew Cask) | PR to [Homebrew/homebrew-cask](https://github.com/Homebrew/homebrew-cask) |
| `flatpak/` | Linux (Flatpak) | [Flathub](https://flathub.org) |
| `snap/` | Linux (Snap) | [Snap Store](https://snapcraft.io) |
| `aur/` | Arch Linux (AUR) | Push to [aur.archlinux.org](https://aur.archlinux.org) |
| `msix/` | Windows (MSIX) | Microsoft Store / sideloading |

## Per release

1. Build and publish the release (`release.yml` on a `v*` tag). Signed artifacts
   carry the `git attestation verify` / `gh attestation verify` provenance.
2. Compute the SHA-256 of each artifact and replace the `__SHA256_*__` markers.
3. Bump `version` in each manifest.
4. Submit via the channel listed above.

`scripts/gen-package-manifests.mjs` automates steps 2–3 for winget, Scoop,
Chocolatey and Homebrew from a directory of release artifacts.

## Notes

- **Flatpak / Snap** build from source using the freedesktop/GNOME runtimes and
  require the Rust, Node and WebKitGTK build inputs; validate them in a clean
  container before submitting. The AppImage and `.deb` remain the primary Linux
  downloads.
- **Homebrew**: Stratum for macOS is currently self-signed (not notarized). Users
  install with `brew install --cask --no-quarantine stratum`. See
  `docs/CERTIFICATION.md`.
- **winget / Chocolatey** prefer the NSIS `-setup.exe`; winget can instead use the
  MSI. Pick one installer type and keep it consistent between releases.
