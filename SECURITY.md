# Security Policy

We take the security of Stratum seriously. Thank you for helping keep Stratum and its users safe.

## Supported versions

Stratum is pre-1.0 and under active development. Security fixes are provided for the latest released version only.

| Version | Supported |
| --- | --- |
| Latest release | ✅ |
| Older releases | ❌ |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Report them privately by email to **support@arkynox.com**, with the subject line `Stratum security`.

Please include:

- a description of the issue and its impact;
- steps to reproduce it;
- the affected version and platform (Windows/macOS/Linux);
- any proof-of-concept, logs or screenshots that help.

If you prefer, you can also use [GitHub's private vulnerability reporting](https://github.com/AkkilMG/Stratum/security/advisories/new) on this repository.

## What to expect

- We will acknowledge your report as soon as we can.
- We will investigate and keep you updated on the progress.
- We will credit you in the release notes if you wish.
- Please give us reasonable time to fix the issue before any public disclosure.

## Scope

Stratum is a local-first desktop application. Useful things to look at include:

- the Tauri command surface (the Rust backend in `src-tauri/src/`);
- how local files, paths and the vault are handled;
- the local HTTP calls to Ollama;
- the Git and NAS sync paths.

Because Stratum does not run a server and collects no telemetry, there is no hosted service in scope. Vulnerabilities in third-party dependencies should be reported upstream, though we are happy to help coordinate.

## Safe harbor

We will not pursue legal action against researchers who make a good-faith effort to follow this policy, avoid privacy violations and service disruption, and give us reasonable time to respond before disclosure.
