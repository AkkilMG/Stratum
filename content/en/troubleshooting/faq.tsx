import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "FAQ & troubleshooting",
    description: "Common questions and fixes for Stratum: offline, sync, AI, performance and more.",
    slug: "troubleshooting/faq",
    sectionId: "troubleshooting",
    toc: [
      { id: "general", label: "General" },
      { id: "sync", label: "Sync & NAS" },
      { id: "ai", label: "Local AI" },
      { id: "files", label: "Files & versions" },
      { id: "fixes", label: "Quick fixes" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Short answers to the questions teams ask most, plus fixes for the problems that come up in
          practice.
        </Lead>

        <H2 id="general">General</H2>
        <H3 id="need-account">Do I need an account or internet connection?</H3>
        <p>
          No. Stratum is local-first. There is no Stratum account and no upload. Everything works
          offline; only team sync needs a reachable NAS or Git server.
        </p>
        <H3 id="locked">Is my data locked into a proprietary format?</H3>
        <p>
          No. A space is an ordinary folder plus a standard Git repository. You can open the files
          and the history with any Git tool.
        </p>
        <H3 id="platforms">Which platforms are supported?</H3>
        <p>Windows, macOS and Linux. See <DocLink href="/getting-started/installation">Installation</DocLink>.</p>

        <H2 id="sync">Sync &amp; NAS</H2>
        <H3 id="sync-waiting">Sync says "Waiting" — what's wrong?</H3>
        <p>
          The remote is unreachable right now — the NAS is off, the drive unmapped, or you're
          offline. Stratum retries automatically; use <strong>Sync now</strong> once the path is back.
        </p>
        <H3 id="nas-paths">Can I use a mapped drive and a UNC path?</H3>
        <p>Yes. Both work. Everyone on the team should point at the same remote URL.</p>
        <H3 id="same-structure">Do teammates need the same folder structure?</H3>
        <p>
          No. Each person clones into a folder of their choosing. The structure <em>inside</em> the
          space is what's shared.
        </p>

        <H2 id="ai">Local AI</H2>
        <H3 id="install-ollama">Do I have to install Ollama?</H3>
        <p>
          No. It's optional. Without it you still get versioning, browsing, tags and keyword search.
        </p>
        <H3 id="semantic">Search doesn't understand meaning — why?</H3>
        <p>
          Semantic search needs the <code>nomic-embed-text</code> embeddings model. Install it in
          Settings → Local AI, then give newly imported assets a moment to embed.
        </p>
        <H3 id="ai-uploads">Does AI upload my assets?</H3>
        <p>
          Never. Requests go to your own Ollama instance on <code>localhost</code>. See{" "}
          <DocLink href="/guide/local-ai">Local AI</DocLink>.
        </p>

        <H2 id="files">Files &amp; versions</H2>
        <H3 id="overwritten">I overwrote a file. Can I get the old one back?</H3>
        <p>
          Yes. Open the asset and pick the earlier version in the history, then{" "}
          <strong>Restore</strong>. History is never lost.
        </p>
        <H3 id="renamed">Why was my imported file renamed?</H3>
        <p>
          A file with the same name already existed, so Stratum kept both by adding a numeric suffix.
          See <DocLink href="/guide/importing">Importing assets</DocLink>.
        </p>
        <H3 id="lfs">Will big PSDs and textures bloat the repository?</H3>
        <p>
          Enable Git LFS when creating the studio hub so large binaries are stored efficiently. Even
          without LFS, everything still versions correctly.
        </p>

        <H2 id="fixes">Quick fixes</H2>
        <ul>
          <li>
            <strong>"Git not found" (E:GIT_NOT_FOUND).</strong> Install Git, ensure it's on PATH,
            restart Stratum.
          </li>
          <li>
            <strong>Thumbnails look stale.</strong> Open the asset to regenerate, or run{" "}
            <em>Rebuild index</em> in Settings.
          </li>
          <li>
            <strong>Library feels slow on a huge space.</strong> Let the first index finish, then use
            kind and date filters to narrow the view.
          </li>
          <li>
            <strong>Restore fails (M:RESTORE_FAILED).</strong> Close the app that has the file open,
            then retry.
          </li>
        </ul>
        <CodeBlock
          lang="shell"
          filename="verify git & ollama"
          code={`git --version
ollama --version
ollama list`}
        />
        <Admonition type="note">
          Still stuck? See <DocLink href="/reference/error-codes">Error codes</DocLink> for what each code means,
          then open an issue on GitHub.
        </Admonition>
      </>
    );
  }
);
