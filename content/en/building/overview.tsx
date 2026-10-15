import { definePage } from "@/lib/content/types";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Building from source",
    description: "Build Stratum from source code.",
    slug: "building/overview",
    sectionId: "building",
    toc: [
      { id: "prereq", label: "Prerequisites" },
      { id: "steps", label: "Steps" },
      { id: "docker", label: "Docker (Linux builds)" },
      { id: "contrib", label: "Contributing" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Develop and build Stratum locally.</Lead>
        <H2 id="prereq">Prerequisites</H2>
        <ul>
          <li>Node.js 20.19+</li>
          <li>Rust (stable)</li>
          <li>Git</li>
        </ul>

        <H2 id="steps">Steps</H2>
        <CodeBlock
          code={`git clone https://github.com/AkkilMG/Stratum.git
cd Stratum
npm install
npm run tauri dev
npm run tauri build`}
          lang="shell"
        />

        <H2 id="docker">Docker (Linux builds)</H2>
        <p><code>Dockerfile.linux</code> is provided for cross-building Linux packages from Windows.</p>

        <H2 id="contrib">Contributing</H2>
        <p>See <code>CONTRIBUTING.md</code> in the repo. Follow existing code style and conventions.</p>
      </>
    );
  }
);

