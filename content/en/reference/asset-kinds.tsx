import { definePage } from "@/lib/content/types";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Asset kinds & extensions",
    description: "How Stratum classifies files, which extensions map to each kind, and preview support.",
    slug: "reference/asset-kinds",
    sectionId: "reference",
    toc: [
      { id: "kinds", label: "The kinds" },
      { id: "extensions", label: "Extension map" },
      { id: "previews", label: "Preview support" },
      { id: "unknown", label: "Unknown files" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum assigns every asset a <em>kind</em> based on its extension. The kind drives icons,
          previews and library filters.
        </Lead>

        <H2 id="kinds">The kinds</H2>
        <Table
          head={["Kind", "Purpose"]}
          rows={[
            ["Image", "Raster artwork and photos."],
            ["Vector", "Scalable vector graphics."],
            ["Source", "Editable working files from DCC and design tools."],
            ["Model", "3D meshes and scenes."],
            ["Audio", "Sound effects, music and voice."],
            ["Other", "Anything that doesn't match a known kind."],
          ]}
        />

        <H2 id="extensions">Extension map</H2>
        <Table
          head={["Kind", "Extensions"]}
          rows={[
            ["Image", "png, jpg, jpeg, gif, webp, bmp, tif, tiff, exr, hdr, tga, dds"],
            ["Vector", "svg"],
            ["Source", "psd, psb, ai, xcf, blend, ma, mb, c4d, max, fig, sketch, aes"],
            ["Model", "fbx, obj, glb, gltf, usd, usda, usdc, usdz, stl, dae, 3ds"],
            ["Audio", "wav, mp3, ogg, oga, flac, aac, m4a, aiff"],
            ["Other", "everything else"],
          ]}
        />
        <Admonition type="note">
          The list is matched case-insensitively, so <code>PNG</code> and <code>png</code> classify
          the same way.
        </Admonition>

        <H2 id="previews">Preview support</H2>
        <Table
          head={["Kind", "In the library", "In the detail drawer"]}
          rows={[
            ["Image", "Full thumbnail", "Large preview"],
            ["Vector", "Rendered thumbnail", "Large preview"],
            ["Source", "Kind icon", "Embedded preview where the format exposes one"],
            ["Model", "Kind icon", "Kind icon + metadata"],
            ["Audio", "Waveform icon", "Waveform icon"],
            ["Other", "Generic icon", "Generic icon"],
          ]}
        />

        <H2 id="unknown">Unknown files</H2>
        <p>
          Files with unrecognised extensions are still versioned, indexed and searchable — they're
          just shown with a generic icon and classified as <strong>Other</strong>. Nothing is ever
          skipped because Stratum didn't recognise it.
        </p>
        <Admonition type="tip">
          If a file type you use often shows as <em>Other</em>, it's still fully tracked. Kind is a
          convenience for filtering, not a limit on what Stratum stores.
        </Admonition>
      </>
    );
  }
);
