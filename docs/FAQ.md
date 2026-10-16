# Frequently asked questions

## Is Stratum free?

Yes. Stratum is free and open source, and it is intended to stay free forever. See the [Stratum Community License](../LICENSE.txt).

## Is it really open source?

The full source code is public at <https://github.com/AkkilMG/Stratum> and you can use, study, modify and share it. The Stratum Community License adds a few conditions on top of that freedom: you may not resell the Software itself or rebrand it as another product, and modifications must be clearly marked as a modification of Stratum. Because of those conditions it is a **source-available community license** rather than an OSI-approved license.

## Can I use Stratum in a commercial game studio?

Yes. You can use Stratum for commercial work at no cost. You just cannot resell Stratum itself.

## Can I fork and modify Stratum?

Yes. Keep the attribution, mark your version as a modification of Stratum with a link back to the original, and do not pass it off as the official Stratum. See the [License](../LICENSE.txt) and [Trademark policy](../TRADEMARK.md).

## Does Stratum send my data anywhere?

No. Stratum has no accounts, no telemetry and no cloud. Your files stay on your machine, your NAS or your own Git server. Local AI (Ollama) runs on your computer. See the [Privacy Policy](../legal/PRIVACY.md).

## Do I need a NAS?

No. "This PC only" is the simplest setup. A NAS (or any Git server) is optional and useful for teams.

## Do I need to install Git myself?

No. Stratum needs Git, but you do not have to go looking for it. The Windows setup offers
to download and install Git for you, and if it is still missing when you first open the app,
Stratum offers to install it then. You can also install Git (and optional Git LFS) at any
time from **Settings**. If you already have Git installed, Stratum uses it. On macOS and
Linux the app installs Git through your package manager (for example `brew`, `apt` or `dnf`)
with your permission.

## Do I need to install Ollama?

No. Ollama powers automatic image tags and semantic search. Without it, everything else works and search falls back to keywords. You can install it later from the Windows setup or from **Settings** whenever you want on-device AI.

## Is my version history a backup?

No. Version history lives with your files and can be lost with the same disk. Keep independent backups. See the License.

## How do I report a bug or request a feature?

Use [GitHub Issues](https://github.com/AkkilMG/Stratum/issues/new/choose). For security issues, please follow [SECURITY.md](../SECURITY.md) and report privately.

## Something is wrong with sync. What do I check first?

Make sure the NAS or server is reachable and the remote URL is correct (a folder path, or an `ssh://` / `https://` address). Offline changes queue up and sync when the connection returns. If two people edit the same file, both versions are kept — look for a `(conflict from teammate)` copy.
