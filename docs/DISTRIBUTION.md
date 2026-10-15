# Distribution

Where Stratum is published, how to build each package, and how to refresh it for
a new release. All channels are free of charge.

## Primary downloads

| Platform | Artifact | Channel |
| --- | --- | --- |
| Windows | NSIS `-setup.exe` | GitHub Releases, winget, Scoop, Chocolatey |
| macOS | `.dmg` | GitHub Releases, Homebrew Cask |
| Linux | `.AppImage`, `.deb`, `.rpm` | GitHub Releases, AUR; Flathub and Snap planned |

The single source of releases is
[GitHub Releases](https://github.com/AkkilMG/Stratum/releases), produced by
[`release.yml`](../.github/workflows/release.yml) on a `v*` tag. Every other
channel either points at those assets or repackages them.

## Updating a release

1. Bump the version in `package.json`, `src-tauri/Cargo.toml` and
   `src-tauri/tauri.conf.json` (keep them equal).
2. Commit, then tag and push:
   ```bash
   git tag v0.2.0 && git push origin v0.2.0
   ```
3. Wait for the **release** workflow to finish. It creates a **draft** release with
   installers, updater artifacts, `latest.json`, SBOMs and attestations.
4. Review the draft, then publish it.
5. Refresh the package-manager manifests:
   ```bash
   node scripts/gen-package-manifests.mjs --version 0.2.0 --artifacts ./downloaded-assets
   ```
   (`--artifacts` is optional; without it the manifests keep placeholder hashes.)
6. Submit the updated manifests (below).

`latest.json` must exist on the **latest published** release for installed apps
to see the update. Because the updater endpoint is
`releases/latest/download/latest.json`, publish the draft once the artifacts look
right.

## winget

Manifests live in [`packaging/winget/`](../packaging/winget). Fork
[microsoft/winget-pkgs](https://github.com/microsoft/winget-pkgs), copy the three
files to `manifests/a/Arkynox/Stratum/<version>/`, and open a PR. Validate first:

```powershell
winget validate --manifest packaging\winget
```

## Scoop

[`packaging/scoop/stratum.json`](../packaging/scoop/stratum.json) targets a Scoop
bucket. To publish, create or use a bucket repository (for example
`AkkilMG/scoop-bucket`), commit the manifest, and users install with:

```powershell
scoop bucket add arkynox https://github.com/AkkilMG/scoop-bucket
scoop install arkynox/stratum
```

## Chocolatey

[`packaging/chocolatey/`](../packaging/chocolatey) holds the `.nuspec` and install
script. Package and push:

```powershell
choco pack packaging\chocolatey\stratum.nuspec
choco push stratum.0.2.0.nupkg --source https://push.chocolatey.org/
```

A Chocolatey community package is moderated; automate it with
[`chocolatey-community/chocolatey-packages`](https://github.com/chocolatey-community/chocolatey-packages)
conventions.

## Homebrew

[`packaging/homebrew/stratum.rb`](../packaging/homebrew/stratum.rb) is a cask.
Users can install from a tap immediately:

```bash
brew tap AkkilMG/stratum https://github.com/AkkilMG/Stratum
brew install --cask --no-quarantine stratum
```

To land it in the main `homebrew-cask` repository, open a PR with the cask in
`Casks/s/stratum.rb`. `--no-quarantine` is needed only while the app is
self-signed; remove it once notarized. The `livecheck` block tracks GitHub
releases automatically.

## Flatpak

[`packaging/flatpak/`](../packaging/flatpak) contains the manifest, AppStream
metainfo and desktop entry. Build and test locally (see the header of the
manifest), then submit to [Flathub](https://github.com/flathub/flathub):

```bash
git clone --branch=new-pr git@github.com:<you>/flathub.git
cd flathub && git checkout -b stratum
# add the manifest and metainfo, commit, push, open a PR against new-pr
```

The GNOME runtime provides WebKitGTK; the manifest bundles `git` because the app
invokes it at runtime. Replace `__SHA256_DEB__` and `__SHA256_GIT_TARBALL__`
before submitting.

## Snap

[`packaging/snap/snapcraft.yaml`](../packaging/snap/snapcraft.yaml) builds from
source using the `gnome` extension.

```bash
snapcraft
snapcraft upload --release=stable stratum_0.2.0_amd64.snap
```

Register the `stratum` name on the Snap Store first. The Snap build can also be
wired to the store's GitHub builder for automatic publishing.

## AUR

[`packaging/aur/PKGBUILD`](../packaging/aur/PKGBUILD) installs the published
`.deb`. Update `pkgver` and hashes, regenerate `.SRCINFO`, and push:

```bash
updpkgsums && makepkg --printsrcinfo > .SRCINFO
git clone ssh://aur@aur.archlinux.org/stratum-bin.git
```

## MSIX

[`packaging/msix/AppxManifest.xml`](../packaging/msix/AppxManifest.xml) is for
sideloading or a future Microsoft Store listing. The `Publisher` must match the
signing certificate, and the referenced `Assets\*.png` images must be supplied.
Microsoft Store distribution has a one-time registration fee and is **not** part
of the free plan; MSIX remains useful for self-signed internal distribution.

## Checksums, SBOM and attestations

Each release also publishes `stratum-<os>.spdx.json` and GitHub attestations for
the installers. See [SUPPLY-CHAIN.md](SUPPLY-CHAIN.md) for how users verify a
download.
