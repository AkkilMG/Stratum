# Building Stratum

Tauri builds installers for the OS it runs on, so build each platform on its own OS (or let CI do it). Before you start, see the [Tauri prerequisites](https://tauri.app/start/prerequisites/) and make sure Rust (stable) and Node.js 20.19+ (see `.nvmrc`) are installed.

Generate the app icons once (and again after changing `app-icon.png`):

```bash
npm run icons
```

## Windows

From the project root on Windows:

```powershell
npm install
npm run icons
npm run tauri build
```

Output:

- `src-tauri\target\release\bundle\nsis\*.exe`
- `src-tauri\target\release\bundle\msi\*.msi`

## Linux

On Ubuntu/Debian (or WSL with the project inside the Linux filesystem):

```bash
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf libssl-dev libgtk-3-dev build-essential curl
npm install && npm run icons && npm run tauri build
```

Output: `src-tauri/target/release/bundle/{deb,rpm,appimage}/`.

### Linux packages from a Windows PC (Docker)

```bash
docker build -f Dockerfile.linux -t stratum-linux .
docker run --rm -v "%cd%\dist-linux:/out" stratum-linux      # PowerShell: -v "${PWD}\dist-linux:/out"
```

The `.deb`, `.rpm` and `.AppImage` appear in `dist-linux\`. Install on Ubuntu/Debian with:

```bash
sudo apt install ./Stratum_0.1.0_amd64.deb
```

## macOS

On macOS with Xcode command line tools installed:

```bash
npm install && npm run icons && npm run tauri build
```

Output: `src-tauri/target/release/bundle/dmg/` and `.../macos/`.

## All platforms at once (CI)

Push a tag (`git tag v0.1.0 && git push --tags`) or run the **build-installers** workflow manually from the Actions tab. Installers appear as a draft release and as downloadable artifacts. The workflow uses only the built-in `GITHUB_TOKEN`; no extra secrets are required.

## Windows code signing

Windows installers are signed with Authenticode so users do not see a SmartScreen "unknown publisher" warning. Signing is driven by [`scripts/sign-windows.ps1`](../scripts/sign-windows.ps1), wired in through `bundle.windows.signCommand` in `src-tauri/tauri.conf.json`.

It is **optional**: if `WINDOWS_CERTIFICATE` is not set, the script does nothing and the build produces an unsigned installer, so contributors can build locally without a certificate.

To sign, provide an OV/EV certificate as a base64-encoded `.pfx` through environment variables:

| Variable | Meaning |
| --- | --- |
| `WINDOWS_CERTIFICATE` | base64 of the `.pfx` file (required to sign) |
| `WINDOWS_CERTIFICATE_PASSWORD` | password for the `.pfx`, if any |
| `WINDOWS_TIMESTAMP_URL` | RFC 3161 timestamp server (default `http://timestamp.digicert.com`) |
| `TAURI_WINDOWS_SIGNTOOL_PATH` | explicit path to `signtool.exe` (optional) |

In CI, add `WINDOWS_CERTIFICATE` and `WINDOWS_CERTIFICATE_PASSWORD` as repository secrets (Settings → Secrets and variables → Actions). The release workflow passes them through automatically. `signtool.exe` is found via `PATH`, then the installed Windows SDK.

To encode a certificate on Windows:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("certificate.pfx")) | Set-Clipboard
```

## macOS code signing (optional)

Stratum for macOS currently ships **self-signed (ad-hoc)**, not notarized, because notarization requires a paid Apple Developer account. The configuration is wired but inactive and lives in [`src-tauri/tauri.macos.conf.json`](../src-tauri/tauri.macos.conf.json) together with [`src-tauri/Entitlements.plist`](../src-tauri/Entitlements.plist).

To produce a self-signed build:

```bash
npm run tauri build -- --config src-tauri/tauri.macos.conf.json
```

Users of a self-signed build may need to right-click → **Open** the first time, or install the Homebrew cask with `--no-quarantine`. If you later obtain a Developer ID certificate, set `bundle.macOS.signingIdentity` to its name and add the notarization variables (`APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`) as secrets; see [docs/CERTIFICATION.md](CERTIFICATION.md).

## Auto-updates (signing key)

Installed builds check the GitHub Releases `latest.json` feed and install signed updates in place. Update artifacts are created only when the release build enables `createUpdaterArtifacts` (via `--config src-tauri/tauri.release.conf.json`) **and** the private signing key is present.

Generate a key pair once:

```bash
npm run tauri signer generate -- -w ~/.tauri/stratum.key
```

This prints a public key. Paste it into `plugins.updater.pubkey` in `src-tauri/tauri.conf.json`, and store the private key as the repository secret `TAURI_SIGNING_PRIVATE_KEY` (plus `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` if you set one). **Never commit the private key.**

| Secret | Meaning |
| --- | --- |
| `TAURI_SIGNING_PRIVATE_KEY` | the private key, or its base64 contents |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | the key password, if any |

The updater works for the NSIS installer (Windows), the `.app` bundle (macOS) and the AppImage (Linux). Debian, RPM and MSI packages are not updated in place; users update those through their package manager. See [docs/DISTRIBUTION.md](DISTRIBUTION.md).

## License bundle

Before packaging, the build runs `npm run licenses`, which writes `src/licenses.json` (in-app viewer) and `THIRD_PARTY_NOTICES.txt` (shipped with installers). It needs both `cargo` and a completed `npm install`. Run it manually any time dependencies change:

```bash
npm run licenses
```
