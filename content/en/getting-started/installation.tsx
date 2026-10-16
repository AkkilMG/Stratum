import { definePage } from "@/lib/content/types";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Admonition } from "@/components/ui/Admonition";
import { H2, Lead } from "@/components/ui/Heading";
import { Tabs } from "@/components/ui/Tabs";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "Installation",
    description: "Install the Stratum desktop app on Windows, macOS, or Linux.",
    slug: "getting-started/installation",
    sectionId: "getting-started",
    toc: [
      { id: "requirements", label: "Requirements" },
      { id: "download", label: "Download" },
      { id: "windows", label: "Windows" },
      { id: "macos", label: "macOS" },
      { id: "linux", label: "Linux" },
      { id: "models", label: "Optional Ollama models" },
      { id: "verify", label: "Verify the install" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Prebuilt installers are published on GitHub Releases for Windows, macOS and Linux. Pick
          your platform below and you are a few clicks away from your first space.
        </Lead>

        <H2 id="requirements">Requirements</H2>
        <Table
          head={["Component", "Required?", "Notes"]}
          rows={[
            ["Git", "Yes", "Stratum shells out to the git CLI for all versioning."],
            ["Ollama", "No", "Enables local AI tagging + semantic search; keyword search works without it."],
          ]}
        />
        <Admonition type="warning">
          Stratum needs Git installed and on your <code>PATH</code>. On first launch the setup wizard
          checks for it and tells you if something is missing.
        </Admonition>

        <H2 id="download">Download</H2>
        <p>
          Grab the latest installer from the{" "}
          <a
            href="https://github.com/AkkilMG/Stratum/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stratum Releases page
          </a>
          . Pick the file that matches your operating system:
        </p>
        <Table
          head={["Platform", "Files"]}
          rows={[
            ["Windows", ".exe (NSIS installer) or .msi"],
            ["macOS", ".dmg or .app.tar.gz"],
            ["Linux", ".AppImage, .deb or .rpm"],
          ]}
        />

        <H2 id="windows">Windows</H2>
        <ol>
          <li>Download <code>Stratum_x.y.z_x64-setup.exe</code> (or the <code>.msi</code>).</li>
          <li>Run the installer and follow the prompts.</li>
          <li>Launch Stratum from the Start menu.</li>
        </ol>
        <p>
          If SmartScreen warns about an unknown publisher, choose <em>More info → Run anyway</em>.
          Stratum is unsigned by default; checksums and a software bill of materials are attached to
          each release.
        </p>

        <H2 id="macos">macOS</H2>
        <ol>
          <li>Download the <code>.dmg</code> for your chip (Apple silicon or Intel).</li>
          <li>Open the disk image and drag <strong>Stratum</strong> into <strong>Applications</strong>.</li>
          <li>
            The first launch may be blocked by Gatekeeper. Right-click the app and choose{" "}
            <em>Open</em>, then confirm.
          </li>
        </ol>

        <H2 id="linux">Linux</H2>
        <Tabs
          tabs={[
            {
              label: "AppImage",
              content: (
                <CodeBlock
                  lang="shell"
                  code={`chmod +x Stratum_x.y.z_amd64.AppImage
./Stratum_x.y.z_amd64.AppImage`}
                />
              ),
            },
            {
              label: "Debian / Ubuntu",
              content: <CodeBlock lang="shell" code={`sudo apt install ./Stratum_x.y.z_amd64.deb`} />,
            },
            {
              label: "Fedora / RHEL",
              content: <CodeBlock lang="shell" code={`sudo dnf install ./Stratum-x.y.z-1.x86_64.rpm`} />,
            },
          ]}
        />
        <Admonition type="note">
          The <code>.deb</code> and <code>.rpm</code> packages declare a dependency on <code>git</code>{" "}
          where appropriate. On minimal systems, install Git first.
        </Admonition>

        <H2 id="models">Optional Ollama models</H2>
        <p>
          To enable AI tagging and semantic search, install{" "}
          <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">
            Ollama
          </a>{" "}
          and pull the two models. You can also do this from inside Stratum (Settings → Local AI).
        </p>
        <CodeBlock
          code={`ollama pull llava:7b
ollama pull nomic-embed-text`}
        />
        <Admonition type="tip">
          Both models run locally and never send your assets anywhere. They are optional — Stratum is
          fully usable without them.
        </Admonition>

        <H2 id="verify">Verify the install</H2>
        <p>
          Launch Stratum and continue to <DocLink href="/getting-started/first-launch">First launch</DocLink>.
          The setup wizard&apos;s system-check step confirms that Git (and optionally Ollama) are
          detected correctly.
        </p>
        <Admonition type="note">
          Want to build Stratum yourself or contribute? See the{" "}
          <DocLink href="/building/overview">For developers</DocLink> section for the full toolchain,
          build steps and contribution guide.
        </Admonition>
      </>
    );
  }
);
