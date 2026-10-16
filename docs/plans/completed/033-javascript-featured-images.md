# 033 — JavaScript featured images

Status: COMPLETED · 2026-10-16

## Objective

Generate and assign three article-specific illustrations to the published
JavaScript if/else, Arrays and DOM articles. Keep the existing Redactoria
editorial illustration language while reducing the character scale toward the
balanced proportions of `default-img.webp`.

## Human authorization

The human explicitly requested generation and integration of:

- `warunki-w-javascript.webp`: a smaller over-the-shoulder character facing a
  monitor with a front-visible wireframe and branching visual motif;
- `tablice-w-javascript.webp`: a smaller female character using a drawer motif
  related to, but compositionally distinct from, the PHP Arrays illustration;
- `dom-w-javascript.webp`: a smaller character with a modular page/DOM motif.

The illustrations are decorative and lightly navigational. They do not need to
teach the complete article content or contain code and labels.

## Execution

```text
record bounded plan
→ generate three independent illustrations with shared style constraints
→ inspect each result and iterate only for a concrete defect
→ normalize accepted sources to opaque sRGB WebP, 1600×900
→ add files under src/assets
→ add featuredImage / featuredAlt metadata only
→ append hash-bound CONTENT lineage records
→ verify the three article lifecycles
→ npm run test → npm run check → npm run build
→ inspect generated hero and thumbnail output
→ record result and move this plan to completed
```

## Generation constraints

- Shared style references: `default-img.webp`, `instrukcje-sterujace.webp` and
  `tablice-php.webp`.
- Wide 16:9 composition; main subject kept inside a thumbnail-safe central area.
- Character scale approximately 25–30% of the canvas; the conceptual object or
  interface remains the main visual mass.
- Warm off-white background, black hand-drawn outlines, restrained orange accent,
  light beige/gray supporting tones.
- No readable text, code, logos, trademarks or watermark.
- One generated source per article; no automatic publication or deployment.

## Boundaries

- WEBSITE assets and metadata-only changes to the three already published CONTENT
  entries.
- Article bodies, technical meaning, immutable candidates, reviews, promotion
  audits, SOURCE and historical LAB artifacts remain unchanged.
- The unavailable local API path is not implemented in this milestone. The
  built-in image generation path is used instead; an API proof of work requires a
  separately configured key and experiment.
- No Engine agent-module, dispatcher, database, Git push or Cloudflare deployment.

## Verification

1. Visually inspect every generated source for subject, style, composition,
   malformed anatomy, stray text and thumbnail readability.
2. Verify final files are exactly 1600×900 opaque sRGB WebP.
3. Run `verify:article` for all three affected lifecycles.
4. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
5. Confirm generated article/listing HTML references the three distinct optimized
   images and their descriptive alternative text.

## Result

- Built-in `imagegen` produced three independent opaque 1672×941 PNG sources. The
  planned API proof-of-work path was not used because the local environment had
  neither `OPENAI_API_KEY` nor the Python `openai` package; no API client or key
  handling was added to the repository.
- Visual review accepted all three first results. Characters are secondary to the
  monitor, horizontal organizer and modular page respectively; no readable text,
  watermark, malformed anatomy or unsafe crop required regeneration.
- The accepted sources were center-normalized to opaque sRGB WebP, exactly
  1600×900: conditions 67,702 bytes, Arrays 89,064 bytes and DOM 77,852 bytes.
  Full prompts, references and SHA-256 hashes are recorded in
  `lab/reports/javascript-featured-images.md`.
- The three published entries received only `featuredImage` / `featuredAlt`
  metadata. Their bodies and technical meaning are byte-identical.
- `lab/decisions/javascript-featured-images.json` binds the explicit human scope;
  three append-only `METADATA_ONLY` records replay to current CONTENT. All three
  affected `verify:article` runs PASS and retain an effective valid review.
- The integration regression expectation now reflects the fourth JavaScript
  if/else post-promotion lineage record.
- `npm run test`: PASS — 360/360 in 28 files.
- `npm run check`: PASS — 167 files, zero errors, warnings or hints.
- `npm run build`: PASS — 23 pages; Pagefind indexed 22 pages / 2308 words. Astro
  optimized the new images to approximately 51 KB, 66 KB and 58 KB.
- Browser review at 1440 px and 320 px: all hero images loaded at 16:9 with the
  expected alt text, all listing thumbnails use the matching source, no horizontal
  overflow and no console errors or warnings.
- No SOURCE, immutable candidate/review, Engine agent, Git push or deployment
  action occurred. The pre-existing `docs/humanization.md` worktree change was
  preserved untouched by this milestone.
