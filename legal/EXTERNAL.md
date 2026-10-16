## Software Stratum works with but does not include

These tools are not bundled with Stratum. Stratum runs them on your computer if they are installed, and they remain under their own licenses.

Stratum can also download and install some of them for you, always with your consent and never silently: the Windows setup offers to install Git (and optional Ollama) during installation, and the app offers to install Git, Git LFS or Ollama from its first-run check or from **Settings**. Downloads come from each project's official source (the Git for Windows, Git LFS and Ollama release pages), and each installer is checked for a valid code-signing signature where the platform provides one before it is run. Unattended/silent installs skip this and leave it to the app.

- Git (GPL-2.0-only): Stratum starts the git program as a separate process. It is not linked into or distributed with Stratum.
- Git LFS (MIT): optional, only used if you enable it for a server that supports it.
- Ollama (MIT): optional local AI runtime that you install yourself.
- AI models you choose to download, such as LLaVA and nomic-embed-text: each model has its own license and terms. Review them before use, especially for commercial projects.

## Operating system components

- Windows builds use Microsoft Edge WebView2, licensed under Microsoft's terms.
- Linux builds use WebKitGTK, licensed under LGPL-2.1 and related licenses, loaded from your system.

## SQLite

Stratum includes SQLite through the rusqlite and libsqlite3-sys packages. SQLite is in the public domain.

## Weak-copyleft components (MPL-2.0)

Stratum includes unmodified MPL-2.0 components, including resvg, usvg and related crates. Under MPL-2.0, their source code remains available from their authors, linked in the package list. Stratum's own code is not covered by the MPL.
