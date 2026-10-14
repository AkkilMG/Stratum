# Supply chain

How Stratum's releases are built, what proves they are trustworthy, and how to
verify them. The goal is that anyone can confirm a downloaded installer was built
from this public repository, by this workflow, and contains the dependencies it
claims.

## What is produced

On every `v*` tag, [`release.yml`](../.github/workflows/release.yml) builds on
Windows, Linux and macOS and attaches to the draft release:

- the installers (NSIS/MSI, `.dmg`, `.deb`/`.rpm`/`.AppImage`),
- updater artifacts and `latest.json` (when the updater signing key is set),
- a Software Bill of Materials per OS: `stratum-<os>.spdx.json`,
- **SLSA build provenance** attestations for each installer,
- **SBOM** attestations for each installer.

## Software Bill of Materials (SBOM)

SBOMs are generated with [Syft](https://github.com/anchore/syft) through
[`anchore/sbom-action`](https://github.com/anchore/sbom-action), covering the npm
production tree and the Rust dependency graph for the host platform. Exclusions
(build output, `node_modules`, `.git`, image assets) are defined in
[`.github/syft.yaml`](../.github/syft.yaml).

The in-app **Licenses** screen and `THIRD_PARTY_NOTICES.txt` are generated
separately from the same dependency data by `npm run licenses`
([`scripts/gen-licenses.mjs`](../scripts/gen-licenses.mjs)); the SBOM is the
machine-readable companion.

## SLSA provenance and attestations

GitHub's artifact attestations provide SLSA Build Level 3 provenance: a signed
statement that records the repository, commit, workflow and the exact file
digests. Two attestations are attached to each installer:

- `actions/attest-build-provenance` — how and from what it was built,
- `actions/attest-sbom` — the SBOM it corresponds to.

They use the workflow's OIDC identity (`id-token: write`) and the GitHub
attestations API (`attestations: write`), and require no third-party service or
account.

### Verifying a download

```bash
gh attestation verify ./Stratum_0.1.0_x64-setup.exe --repo AkkilMG/Stratum
```

For the SBOM association:

```bash
gh attestation verify ./Stratum_0.1.0_x64-setup.exe \
  --repo AkkilMG/Stratum \
  --predicate-type https://in-toto.io/attestation/spdx
```

A successful verification means the binary was produced by the tagged commit in
this repository, not merely uploaded by someone with access to the release page.

## Dependency and vulnerability scanning

| Workflow | Tool | Scope |
| --- | --- | --- |
| [`security.yml`](../.github/workflows/security.yml) | `cargo audit`, `npm audit` | known-vulnerable dependencies |
| [`codeql.yml`](../.github/workflows/codeql.yml) | CodeQL | static analysis |
| [`scorecard.yml`](../.github/workflows/scorecard.yml) | OpenSSF Scorecard | repository and workflow hygiene |

These run on every change, on a weekly schedule, and on `workflow_dispatch`.
[`dependabot.yml`](../.github/dependabot.yml) keeps the GitHub Actions, npm and
Cargo dependency sets current.

## OpenSSF Scorecard

The score is published to the
[OpenSSF dashboard](https://securityscorecards.dev/viewer/?uri=github.com/AkkilMG/Stratum)
and to GitHub code scanning. Keeping it high means:

- GitHub Actions are **pinned** to commit SHAs (except first-party/short tags
  where safe) and granted minimal `permissions`,
- `main` is protected (reviews required, no force-push),
- branch protection is configured and monitored,
- security policy and disclosure process are present.

## Repository hygiene

- [`SECURITY.md`](../SECURITY.md) documents how to report vulnerabilities
  privately.
- [`CODEOWNERS`](../.github/CODEOWNERS) sets review ownership.
- The default `GITHUB_TOKEN` is read-only; each workflow grants only what it
  needs.
- No secrets are committed; signing keys live only in repository secrets.
