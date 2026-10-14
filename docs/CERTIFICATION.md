# Certification and trust

This document explains how Stratum earns the user's trust at install time on each
platform, and the **free** options used to get there. Arkynox has no registered
company yet and no budget for certificates, so every path below is free and
open-source-friendly.

The guiding rule: **every artifact is built in public CI, attested with SLSA
provenance, listed in an SBOM, and hashed.** Even where a platform will not let
us remove the "unknown publisher" prompt for free, users can verify exactly what
they downloaded against the public build. See [SUPPLY-CHAIN.md](SUPPLY-CHAIN.md).

## Platform summary

| Platform | Trust signal | Cost | Status |
| --- | --- | --- | --- |
| Windows | SignPath Foundation TBD signing | free (OSS) | workflow ready, pending approval |
| Windows | Certum Open Source Code Signing | free (OSS) | alternative, apply manually |
| Windows | Azure Trusted Signing | paid / eligibility-gated | **not used** |
| Windows | Microsoft Store | registration fee | **not used** |
| macOS | Ad-hoc self-signed | free | wired, inactive |
| macOS | Apple Developer ID + notarization | $99/yr | **not used** |
| Linux | GPG-signed packages / repo | free | planned |

## Windows

Windows shows a SmartScreen warning for any unsigned code. Two free programs can
sign for open-source projects:

### Option A — SignPath Foundation (recommended)

The [SignPath Foundation](https://signpath.org/) signs open-source projects for
free. Requirements are an OSI-approved license and an active project. Stratum's
Apache-2.0 option satisfies the license requirement.

1. Apply at <https://signpath.org/apply> with the repository URL.
2. Once approved, create a SignPath **project** and an **artifact
   configuration** for the NSIS/MSI installers.
3. Add these repository secrets (Settings → Secrets and variables → Actions):
   - `SIGNPATH_API_TOKEN`
   - `SIGNPATH_ORGANIZATION_ID`
4. Add these repository variables:
   - `SIGNPATH_ENABLED` = `true`
   - `SIGNPATH_PROJECT_SLUG`
   - `SIGNPATH_SIGNING_POLICY_SLUG`
   - `SIGNPATH_ARTIFACT_CONFIG_SLUG`
5. Push a `v*` tag. [`signpath.yml`](../.github/workflows/signpath.yml) builds the
   installers, submits them for signing and re-attaches the signed files.

Choose **either** SignPath **or** the PFX path in `release.yml` for Windows, not
both.

### Option B — Certum Open Source Code Signing

[Certum](https://www.certum.eu/) issues a free code-signing certificate to
open-source developers. The certificate is a normal `.pfx`, so it slots straight
into the existing plumbing:

1. Obtain the certificate and export it as a `.pfx`.
2. base64-encode it and store `WINDOWS_CERTIFICATE` /
   `WINDOWS_CERTIFICATE_PASSWORD` as secrets.
3. Tag a release; `release.yml` signs through
   [`scripts/sign-windows.ps1`](../scripts/sign-windows.ps1).

Note that free certificates typically carry an individual, not organization,
subject, so the publisher shown may be a person rather than "Arkynox".

## macOS

Notarization requires a paid Apple Developer account, so Stratum ships ad-hoc
self-signed. This is fine for a local-first tool distributed via Homebrew and the
website; users confirm the app once.

- Entitlements and config: `src-tauri/Entitlements.plist`,
  `src-tauri/tauri.macos.conf.json`.
- Build with `npm run tauri build -- --config src-tauri/tauri.macos.conf.json`.
- Homebrew users install with `--no-quarantine`; everyone else right-clicks →
  **Open** the first time.

When a Developer ID is available later, set `bundle.macOS.signingIdentity` and add
the `APPLE_ID` / `APPLE_PASSWORD` / `APPLE_TEAM_ID` secrets, then drop
`--no-quarantine`.

## Linux

Linux packages are not signed by a central authority. Trust comes from the
distribution channel (Flathub, Snap Store, AUR) plus the release checksums and
attestations. Every Flathub/Snap build is done on the store's own builders from
the public source, which is itself a strong signal.

## Verifying a download

Every release publishes an SBOM and SLSA provenance. To verify an installer
against the public build:

```bash
gh attestation verify ./Stratum_0.1.0_x64-setup.exe --repo AkkilMG/Stratum
```

Compare the SHA-256 with the release page, and inspect `stratum-<os>.spdx.json`
for the exact dependency list. Details in [SUPPLY-CHAIN.md](SUPPLY-CHAIN.md).

## OpenSSF

The repository runs the [OpenSSF Scorecard](../.github/workflows/scorecard.yml)
weekly and publishes the result to the
[public dashboard](https://securityscorecards.dev/viewer/?uri=github.com/AkkilMG/Stratum).
Maintaining a high score (pinned actions, branch protection on `main`, no
dangerous workflow triggers, minimal token permissions) is itself a trust signal
that upstream projects and enterprise evaluators look at.

Applying for the [OpenSSF Best Practices badge](https://www.bestpractices.dev/)
is free and recommended; it is a checklist-based assessment of the project's
process.
