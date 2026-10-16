import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "Error codes",
    description: "What Stratum's E: and M: error codes mean, and how to resolve them.",
    slug: "reference/error-codes",
    sectionId: "reference",
    toc: [
      { id: "format", label: "Code format" },
      { id: "environment", label: "E: — environment" },
      { id: "ops", label: "M: — operations" },
      { id: "reporting", label: "Reporting a problem" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          When something goes wrong, Stratum shows a short code you can look up or quote in a bug
          report. Codes come in two families.
        </Lead>

        <H2 id="format">Code format</H2>
        <ul>
          <li>
            <code>E:…</code> — an <strong>environment</strong> problem: something missing or
            misconfigured on the machine (Git, a path, permissions).
          </li>
          <li>
            <code>M:…</code> — a <strong>managed operation</strong> problem: Stratum tried an action
            (sync, import, restore) and it didn't complete.
          </li>
        </ul>

        <H2 id="environment">E: — environment</H2>
        <Table
          head={["Code", "Meaning", "Fix"]}
          rows={[
            ["E:GIT_NOT_FOUND", "The git command-line tool isn't on PATH.", "Install Git and restart Stratum."],
            ["E:GIT_TOO_OLD", "Git is below the minimum supported version.", "Update Git to a current release."],
            ["E:PATH_UNREACHABLE", "A folder or share can't be reached.", "Reconnect the drive / remap the NAS path."],
            ["E:PERMISSION_DENIED", "Stratum can't read or write a path.", "Check folder permissions or pick another folder."],
            ["E:NOT_A_REPO", "The folder isn't a Stratum space and couldn't be initialised.", "Choose an empty or writable folder, then retry."],
          ]}
        />

        <H2 id="ops">M: — operations</H2>
        <Table
          head={["Code", "Meaning", "Fix"]}
          rows={[
            ["M:SYNC_FAILED", "A push or pull didn't complete.", "Check connectivity to the remote and try Sync now."],
            ["M:PUSH_REJECTED", "The remote had newer changes.", "Sync again — Stratum will pull, then push."],
            ["M:CLONE_FAILED", "Joining a studio space failed.", "Verify the remote URL and that you have read access."],
            ["M:IMPORT_FAILED", "A file couldn't be copied into the space.", "Check free space and permissions, then retry."],
            ["M:RESTORE_FAILED", "Writing an old version back failed.", "Ensure the file isn't locked by another app."],
            ["M:INDEX_FAILED", "The index or thumbnails couldn't be rebuilt.", "Try Settings → This space → Rebuild index."],
            ["M:MODEL_DOWNLOAD_FAILED", "An Ollama model didn't download.", "Check that Ollama is running, then retry the download."],
          ]}
        />
        <Admonition type="tip">
          Most <code>M:</code> errors are transient and succeed on a retry once the underlying cause
          (network, file lock, running service) is resolved.
        </Admonition>

        <H2 id="reporting">Reporting a problem</H2>
        <p>
          If a code persists, open an issue on GitHub with the code and what you were doing. Include
          the Stratum version from <strong>Settings → Help &amp; about</strong>. See also{" "}
          <DocLink href="/troubleshooting/faq">Troubleshooting &amp; FAQ</DocLink>.
        </p>
        <Admonition type="note">
          Error messages never contain asset contents. Stratum doesn't upload logs anywhere — you
          decide what to share.
        </Admonition>
      </>
    );
  }
);
