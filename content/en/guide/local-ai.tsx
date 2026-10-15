import { definePage } from "@/lib/content/types";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Local AI",
    description: "System check, model downloads, tagging, and embeddings.",
    slug: "guide/local-ai",
    sectionId: "guide",
    toc: [
      { id: "requirements", label: "Requirements" },
      { id: "check", label: "System check" },
      { id: "models", label: "Download models" },
      { id: "tagging", label: "Tagging" },
      { id: "search", label: "Semantic search" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Use local models with Ollama. No data leaves your machine.</Lead>
        <H2 id="requirements">Requirements</H2>
        <p>Install <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer">Ollama</a>.</p>

        <H2 id="check">System check</H2>
        <p>Stratum checks for Ollama, <code>llava:7b</code>, and <code>nomic-embed-text</code> in Settings.</p>

        <H2 id="models">Download models</H2>
        <CodeBlock code={`ollama pull llava:7b
ollama pull nomic-embed-text`} lang="shell" />

        <H2 id="tagging">Tagging</H2>
        <p>Image assets can be auto-tagged via LLaVA.</p>

        <H2 id="search">Semantic search</H2>
        <p>Embeddings power semantic search; if unavailable, keyword fallback is used.</p>
      </>
    );
  }
);

