import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "Keyboard & shortcuts",
    description: "Command palette, search, navigation and library shortcuts in Stratum.",
    slug: "guide/shortcuts",
    sectionId: "guide",
    toc: [
      { id: "palette", label: "Command palette" },
      { id: "global", label: "Global shortcuts" },
      { id: "library", label: "Library shortcuts" },
      { id: "help", label: "Shortcut help" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum is keyboard-friendly. The command palette puts every action one keystroke away.
        </Lead>

        <Screenshot name="palette" caption="The command palette, filtered as you type." />

        <H2 id="palette">Command palette</H2>
        <p>
          Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> anywhere to open the palette. Type to
          filter actions, use <kbd>↑</kbd>/<kbd>↓</kbd> to move, <kbd>Enter</kbd> to run, and{" "}
          <kbd>Esc</kbd> to close.
        </p>
        <Table
          head={["Palette action", "Does"]}
          rows={[
            ["Sync now", "Push and pull with the studio remote immediately."],
            ["Change remote…", "Connect or switch the shared location."],
            ["Go to Library / History / Settings", "Jump between top-level views."],
            ["Replay the tour", "Restart the guided tour."],
            ["Add files…", "Import files with a dialog."],
            ["About Stratum", "Show version information."],
          ]}
        />

        <H2 id="global">Global shortcuts</H2>
        <Table
          head={["Keys", "Action"]}
          rows={[
            ["Ctrl / ⌘ + K", "Open command palette / search"],
            ["/", "Focus search (from the library)"],
            ["?", "Open shortcut help"],
            ["Esc", "Close the current dialog or drawer"],
          ]}
        />

        <H2 id="library">Library shortcuts</H2>
        <Table
          head={["Keys", "Action"]}
          rows={[
            ["Ctrl / ⌘ + click", "Add or remove an asset from the selection"],
            ["Shift + click", "Select a contiguous range"],
            ["Enter", "Open the focused asset"],
            ["Arrow keys", "Move focus through the grid"],
          ]}
        />

        <H2 id="help">Shortcut help</H2>
        <p>
          Press <kbd>?</kbd> for an in-app cheat sheet, or reopen it from{" "}
          <DocLink href="/reference/shortcuts-table">the full shortcut reference</DocLink>. The cheat sheet reads
          your keyboard layout, so <kbd>⌘</kbd> appears on macOS and <kbd>Ctrl</kbd> elsewhere.
        </p>
        <Admonition type="tip">
          If a shortcut doesn't seem to work, check that a text field isn't focused — single-key
          shortcuts like <kbd>/</kbd> and <kbd>?</kbd> are ignored while typing.
        </Admonition>
      </>
    );
  }
);
