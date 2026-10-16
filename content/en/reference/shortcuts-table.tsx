import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Keyboard shortcuts",
    description: "The complete keyboard shortcut reference for Stratum.",
    slug: "reference/shortcuts-table",
    sectionId: "reference",
    toc: [
      { id: "global", label: "Global" },
      { id: "palette", label: "Command palette" },
      { id: "library", label: "Library" },
      { id: "dialogs", label: "Dialogs & drawers" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Every shortcut in one place. On macOS, <kbd>⌘</kbd> replaces <kbd>Ctrl</kbd>.
        </Lead>

        <H2 id="global">Global</H2>
        <Table
          head={["Keys", "Action"]}
          rows={[
            ["Ctrl / ⌘ + K", "Open the command palette / search"],
            ["Ctrl / ⌘ + S", "Sync now"],
            ["/", "Focus search (from the library)"],
            ["?", "Open shortcut help"],
            ["Ctrl / ⌘ + ,", "Open Settings"],
            ["Esc", "Close the active dialog or drawer"],
          ]}
        />

        <H2 id="palette">Command palette</H2>
        <Table
          head={["Keys", "Action"]}
          rows={[
            ["↑ / ↓", "Move through results"],
            ["Enter", "Run the highlighted action"],
            ["Tab", "Cycle through result groups"],
            ["Esc", "Close the palette"],
          ]}
        />

        <H2 id="library">Library</H2>
        <Table
          head={["Keys", "Action"]}
          rows={[
            ["Click", "Select an asset"],
            ["Ctrl / ⌘ + click", "Toggle an asset in the selection"],
            ["Shift + click", "Select a range"],
            ["Ctrl / ⌘ + A", "Select all visible assets"],
            ["Enter", "Open the focused asset"],
            ["Arrow keys", "Move focus through the grid"],
            ["Delete", "Remove the selection from the space (with confirmation)"],
          ]}
        />

        <H2 id="dialogs">Dialogs &amp; drawers</H2>
        <Table
          head={["Keys", "Action"]}
          rows={[
            ["Esc", "Close the drawer or dialog"],
            ["Enter", "Confirm the primary action"],
            ["Tab / Shift + Tab", "Move between fields"],
          ]}
        />
        <Admonition type="note">
          Single-key shortcuts (<kbd>/</kbd>, <kbd>?</kbd>) are ignored while a text field is focused,
          so you can type freely in search and tag inputs.
        </Admonition>
      </>
    );
  }
);
