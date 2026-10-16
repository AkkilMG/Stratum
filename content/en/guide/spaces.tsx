import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "Spaces",
    description: "Create a new space, open a folder, join a studio space, and switch between them.",
    slug: "guide/spaces",
    sectionId: "guide",
    toc: [
      { id: "create", label: "Create a new space" },
      { id: "open", label: "Open an existing folder" },
      { id: "join", label: "Join a studio space" },
      { id: "recent", label: "Recent spaces" },
      { id: "switch", label: "Switching & forgetting" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          A space is a folder that Stratum manages. You can keep as many spaces as you like and
          switch between them at any time.
        </Lead>

        <Screenshot name="home" caption="The home screen lists your spaces and quick actions." />

        <H2 id="create">Create a new space</H2>
        <ol>
          <li>From the home screen, choose <strong>Create new space</strong>.</li>
          <li>Give the space a name (you can use your project name).</li>
          <li>Pick an empty folder, or a folder of existing assets you want to bring under version control.</li>
          <li>Confirm and let Stratum index the folder. Large folders are scanned in the background.</li>
        </ol>
        <Admonition type="note">
          Creating a space initialises a hidden Git repository inside the folder. Your files are not
          moved or converted — they stay exactly where they are.
        </Admonition>

        <H2 id="open">Open an existing folder</H2>
        <p>
          Use <strong>Open a folder</strong> to point Stratum at a folder you already have — for
          example a space on an external drive. If the folder is not yet a Stratum space, Stratum
          offers to turn it into one.
        </p>

        <H2 id="join">Join a studio space</H2>
        <p>
          If a teammate has published a space to a NAS or Git server, choose{" "}
          <strong>Join a studio space</strong> and enter the remote location. Stratum clones it into a
          folder you choose and connects it for background sync.
        </p>
        <Admonition type="tip">
          You need read access to the shared location. For NAS paths, make sure the drive is mapped
          or the UNC path is reachable. See <DocLink href="/guide/studio-sync">Studio / NAS hub</DocLink>.
        </Admonition>

        <H2 id="recent">Recent spaces</H2>
        <p>
          Every space you open is remembered. The home screen shows a list with its path, asset
          count and sync state (Local only, Synced, Waiting, etc.), so you can get back in one click.
        </p>

        <H2 id="switch">Switching &amp; forgetting</H2>
        <Table
          head={["Action", "Where", "Effect"]}
          rows={[
            ["Switch space", "Vault chip (bottom of sidebar) → Switch space", "Opens another space without losing the current one."],
            ["Forget a space", "Home → recent space → forget", "Removes it from the recent list only; files are untouched."],
            ["Open a folder manually", "Home → Open a folder", "Adds a space that isn't in the recent list."],
          ]}
        />
        <Admonition type="warning">
          <strong>Forget</strong> never deletes files. To remove a space permanently, delete its
          folder yourself after forgetting it.
        </Admonition>
      </>
    );
  }
);
