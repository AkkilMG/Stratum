import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Local AI",
    description: "Enable Ollama, run the system check, download models, and use vision tagging + embeddings.",
    slug: "guide/local-ai",
    sectionId: "guide",
    toc: [
      { id: "why", label: "What the AI does" },
      { id: "ollama", label: "Installing Ollama" },
      { id: "check", label: "The system check" },
      { id: "models", label: "Downloading models" },
      { id: "privacy", label: "Privacy" },
      { id: "disable", label: "Turning it off" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum's intelligence is optional and fully local. Install Ollama, pull two models, and
          you get image tagging and search-by-meaning — with nothing leaving your machine.
        </Lead>

        <Screenshot name="ai" caption="The Local AI panel with the system check and model downloads." />

        <H2 id="why">What the AI does</H2>
        <Table
          head={["Capability", "Model", "Effect"]}
          rows={[
            ["Vision tagging", "llava:7b", "Looks at image assets and proposes descriptive tags."],
            ["Semantic search", "nomic-embed-text", "Embeds assets so search can match by meaning."],
          ]}
        />
        <p>
          Neither is required. Without AI, Stratum versions, browses, tags and searches by keyword
          exactly as before.
        </p>

        <H2 id="ollama">Installing Ollama</H2>
        <p>
          Download and install Ollama from{" "}
          <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">
            ollama.com
          </a>
          . Once it's running, Stratum can detect it. You don't need to keep a terminal open — Ollama
          runs as a background service.
        </p>

        <H2 id="check">The system check</H2>
        <p>
          Open <strong>Settings → Local AI</strong> and press <strong>Re-check</strong>. Stratum
          reports on each dependency:
        </p>
        <Table
          head={["Item", "Required", "Meaning"]}
          rows={[
            ["Git", "Yes", "Core versioning — must be present."],
            ["Ollama", "No", "Enables local AI when running."],
            ["llava:7b", "No", "Vision tagging model."],
            ["nomic-embed-text", "No", "Embeddings model for semantic search."],
          ]}
        />
        <Admonition type="tip">
          Green means ready. If a model is missing, the row offers a <strong>Download model</strong>{" "}
          button that pulls it for you.
        </Admonition>

        <H2 id="models">Downloading models</H2>
        <p>You can pull the models from inside Stratum, or from a terminal:</p>
        <CodeBlock
          code={`ollama pull llava:7b
ollama pull nomic-embed-text`}
        />
        <Admonition type="note">
          <code>llava:7b</code> is a few gigabytes. The download is a one-time cost and stays on your
          machine for offline use afterwards.
        </Admonition>

        <H2 id="privacy">Privacy</H2>
        <p>
          Every request goes to your own Ollama instance on <code>localhost</code>. Stratum sends
          nothing to Arkynox or any third party — not images, not queries, not usage data.
        </p>

        <H2 id="disable">Turning it off</H2>
        <p>
          Disable local AI any time in Settings. Existing tags and versions stay; you simply lose
          vision tagging and semantic search until you re-enable it. Keyword search keeps working
          throughout.
        </p>
      </>
    );
  }
);
