import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Asset kinds & extensions",
    description: "Supported file types by category.",
    slug: "reference/asset-kinds",
    sectionId: "reference",
    toc: [
      { id: "image", label: "Image" },
      { id: "vector", label: "Vector" },
      { id: "source", label: "Source" },
      { id: "model", label: "Model" },
      { id: "audio", label: "Audio" },
      { id: "other", label: "Other" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Stratum classifies assets by kind to power filters and thumbnails.</Lead>
        <H2 id="image">Image</H2>
        <p><code>png, jpg, jpeg, webp, gif, bmp, tga</code></p>

        <H2 id="vector">Vector</H2>
        <p><code>svg</code></p>

        <H2 id="source">Source</H2>
        <p><code>psd, ai, fig, xcf, kra</code></p>

        <H2 id="model">Model</H2>
        <p><code>fbx, obj, glb, gltf, blend</code></p>

        <H2 id="audio">Audio</H2>
        <p><code>wav, mp3, ogg, flac</code></p>

        <H2 id="other">Other</H2>
        <p>Any other files are tracked as Other (with basic metadata and history).</p>
      </>
    );
  }
);

