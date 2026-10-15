import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "FAQ",
    description: "Common questions about Stratum.",
    slug: "troubleshooting/faq",
    sectionId: "troubleshooting",
    toc: [
      { id: "offline", label: "Does it work offline?" },
      { id: "lockin", label: "Vendor lock-in?" },
      { id: "ai", label: "Is AI required?" },
      { id: "git", label: "Why Git?" },
      { id: "net", label: "Network shares/NAS?" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Quick answers to common questions.</Lead>
        <H2 id="offline">Does it work offline?</H2>
        <p>Yes — fully offline. AI features require Ollama running locally.</p>

        <H2 id="lockin">Vendor lock-in?</H2>
        <p>Your folder stays plain. Stratum uses Git under the hood, so you can always access history with standard git tools.</p>

        <H2 id="ai">Is AI required?</H2>
        <p>No. Semantic search falls back to keyword search if Ollama/models are unavailable.</p>

        <H2 id="git">Why Git?</H2>
        <p>Git provides robust versioning, history, and sync semantics without inventing a custom VCS.</p>

        <H2 id="net">Network shares/NAS?</H2>
        <p>Works for studio sync. Index/thumbnails are kept in local app-data to avoid I/O issues.</p>
      </>
    );
  }
);

