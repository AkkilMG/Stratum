import { definePage } from "@/lib/content/types";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Admonition } from "@/components/ui/Admonition";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Installation",
    description: "Install Stratum on Windows, macOS, or Linux.",
    slug: "getting-started/installation",
    sectionId: "getting-started",
    toc: [
      { id: "requirements", label: "Requirements" },
      { id: "download", label: "Download" },
      { id: "windows", label: "Windows" },
      { id: "linux", label: "Linux" },
      { id: "macos", label: "macOS" },
      { id: "build", label: "Build from source" },
      { id: "models", label: "Optional Ollama models" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Prebuilt installers are available on GitHub Releases. Build from source is also supported.</Lead>

        <H2 id="requirements">Requirements</H2>
        <ul>
          <li><strong>Git</strong> — required (Stratum shells out to git).</li>
          <li><strong>Ollama</strong> — optional (local AI tagging + semantic search; keyword fallback works without it).</li>
          <li><strong>Node.js 20.19+</strong> and <strong>Rust (stable)</strong> — only if building from source.</li>
        </ul>

        <H2 id="download">Download</H2>
        <p>
          Download from the <a href="https://github.com/AkkilMG/Stratum/releases" target="_blank" rel="noopener noreferrer">Stratum Releases</a> page.
        </p>

        <H2 id="windows">Windows</H2>
        <ul>
          <li><code>.exe</code> (NSIS) or <code>.msi</code></li>
        </ul>

        <H2 id="linux">Linux</H2>
        <ul>
          <li><code>.AppImage</code>, <code>.deb</code>, <code>.rpm</code></li>
        </ul>
        <Admonition type="note">Some distros may require libgit2/git dependencies. The .deb/.rpm specify git as a dependency where appropriate.</Admonition>

        <H2 id="macos">macOS</H2>
        <ul>
          <li><code>.dmg</code> or <code>.app.tar.gz</code></li>
        </ul>

        <H2 id="build">Build from source</H2>
        <CodeBlock
          code={`git clone https://github.com/AkkilMG/Stratum.git
cd Stratum
npm install
npm run tauri dev      # development
npm run tauri build    # build installers`}
          lang="shell"
        />

        <H2 id="models">Optional Ollama models</H2>
        <CodeBlock
          code={`ollama pull llava:7b
ollama pull nomic-embed-text`}
          lang="shell"
        />
        <Admonition type="tip">Both models are used locally; they never leave your machine.</Admonition>
      </>
    );
  }
);

