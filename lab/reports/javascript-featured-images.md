# JavaScript Featured Images — generation record

Date: 2026-10-16

## Scope and mode

Three independent illustrations were generated with the built-in `imagegen` path
after the explicitly discussed API proof-of-work path was found unavailable in the
local environment (`OPENAI_API_KEY` and the Python `openai` package were absent).
No custom API client, runtime agent or publication automation was introduced.

Shared references:

- `src/assets/default-img.webp` — overall editorial style and balanced scale;
- `src/assets/instrukcje-sterujace.webp` — line quality and palette only;
- `src/assets/tablice-php.webp` — line quality, palette and drawer family motif.

The references were style inputs, not edit targets. Each generated source was an
opaque 1672×941 PNG. Accepted results were center-normalized without content edits
to opaque sRGB WebP, 1600×900, quality 88.

## Final prompts

### JavaScript if/else

```text
Use case: stylized-concept
Asset type: editorial article hero and listing thumbnail for a Polish JavaScript if/else article
Input images: Image 1 is the shared Redactoria visual-style reference; Image 2 is a style reference for line quality and palette only, not a scene to copy
Primary request: create a new wide editorial illustration of one person seen from behind in a three-quarter over-the-shoulder view, studying a desktop monitor whose screen remains clearly visible to the viewer; on the monitor is a simple low-fidelity browser wireframe with one central input-like card and a few branching decision paths, with one selected branch in orange
Scene/backdrop: warm off-white paper-like background with generous open margins
Subject: the character is secondary and small, approximately 25 to 30 percent of the canvas; the monitor and wireframe are the dominant visual mass, approximately 55 to 60 percent
Style/medium: clean hand-drawn editorial line illustration, slightly imperfect expressive black ink outlines, flat warm colors, restrained detail; match the reference palette and visual weight without copying their characters or composition
Composition/framing: wide 16:9 composition; small character in the near foreground, monitor fully readable as a shape; keep all important elements inside the central thumbnail-safe area
Color palette: warm off-white, black, restrained burnt orange accent, small amounts of beige and soft gray
Constraints: decorative and lightly navigational rather than a technical diagram; opaque background; plausible anatomy; no readable text; no code; no letters or numbers; no logos; no trademarks; no watermark
Avoid: oversized person, photorealism, dense infographic, exact duplication of the PHP control-flow illustration, extra characters, clutter
```

References: `default-img.webp`, `instrukcje-sterujace.webp`.

### JavaScript Arrays

```text
Use case: stylized-concept
Asset type: editorial article hero and listing thumbnail for a Polish JavaScript Arrays article
Input images: Image 1 is the shared Redactoria visual-style reference; Image 2 is the PHP Arrays illustration used only as a family resemblance reference for palette, line quality, and the drawer metaphor, not as a composition to copy
Primary request: create a new wide editorial illustration of one young woman organizing simple cards with circles, triangles, and image-like shapes into a modern horizontal drawer organizer; a neat original row of cards remains visibly intact on the tabletop while copied cards are being arranged into open drawers in a new order
Scene/backdrop: warm off-white paper-like background with generous open margins
Subject: the woman is secondary and small, approximately 25 to 30 percent of the canvas; the horizontal organizer, open drawers, and two clearly separate card groups are the dominant visual motif
Style/medium: clean hand-drawn editorial line illustration, slightly imperfect expressive black ink outlines, flat warm colors, restrained detail; match the references without copying the PHP character, cabinet, pose, or exact layout
Composition/framing: wide 16:9 composition; show the woman in a natural three-quarter pose beside the organizer; keep the original row and rearranged copies visually distinct; keep all important elements inside the central thumbnail-safe area
Color palette: warm off-white, black, restrained burnt orange accent, small amounts of beige and soft gray
Constraints: decorative and lightly navigational rather than a technical diagram; opaque background; plausible anatomy and hands; no readable text; no code; no letters or numbers; no logos; no trademarks; no watermark
Avoid: oversized person, photorealism, a tall cabinet identical to the PHP illustration, too many drawers, extra characters, clutter
```

References: `default-img.webp`, `tablice-php.webp`.

### JavaScript DOM

```text
Use case: stylized-concept
Asset type: editorial article hero and listing thumbnail for a Polish JavaScript DOM article
Input images: Image 1 is the shared Redactoria visual-style reference; Images 2 and 3 are style references for line quality, palette, and editorial simplicity only, not scenes to copy
Primary request: create a new wide editorial illustration of one small person assembling a large browser page from floating modular sections; the browser frame contains simplified blocks suggesting a header, navigation, content card, button, and footer, with thin branching connector lines behind the modules like a subtle DOM tree; the person holds or adjusts one orange selected module and a small cursor-like click spark appears nearby
Scene/backdrop: warm off-white paper-like background with generous open margins
Subject: the character is secondary and small, approximately 25 to 30 percent of the canvas; the modular browser page is the dominant visual mass, approximately 55 to 60 percent
Style/medium: clean hand-drawn editorial line illustration, slightly imperfect expressive black ink outlines, flat warm colors, restrained detail; match the reference palette and visual weight without copying their characters or compositions
Composition/framing: wide 16:9 composition; person in a natural standing or leaning pose beside the large modular browser frame; clearly separated floating page sections; keep all important elements inside the central thumbnail-safe area
Color palette: warm off-white, black, restrained burnt orange accent, small amounts of beige and soft gray
Constraints: decorative and lightly navigational rather than an exact technical diagram; opaque background; plausible anatomy and hands; no readable text; no code; no letters or numbers; no labels; no logos; no trademarks; no watermark
Avoid: oversized person, photorealism, dense flowchart, literal tree plant, extra characters, clutter, exact duplication of either reference scene
```

References: `default-img.webp`, `instrukcje-sterujace.webp`, `tablice-php.webp`.

## Accepted outputs

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/assets/warunki-w-javascript.webp` | 67,702 | `431d5df1ed03c8b01f4c9677b68450ae17e701673128ef035dc548531a1076a5` |
| `src/assets/tablice-w-javascript.webp` | 89,064 | `8559b7ccbea49da1357bfbec0c91f011265a67ae438e2ba88dc2b9aa57c2342f` |
| `src/assets/dom-w-javascript.webp` | 77,852 | `fec35079d79aa2a6287876195bbcdb21dfebf185b74c4cdb2b6f7d8e8c38a134` |

Visual review: all three use a smaller secondary character, preserve the shared
palette and line language, keep the conceptual motif dominant, contain no readable
text or watermark, and remain legible at article-card scale.
