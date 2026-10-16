# 034 — Markdown, calculator and API featured images

Status: COMPLETED · 2026-10-16

## Objective

Generate and assign three article-specific illustrations to the published Markdown,
JavaScript calculator and API/HTTP/JSON articles. Continue the accepted soft-comic
language of the JavaScript DOM illustration: small active characters, a dominant
technical motif and restrained cute floral details.

## Human authorization

The human approved generation and integration of the proposed concepts:

- `markdown-podstawy.webp`: a young woman transforming raw Markdown cards into a
  rendered page;
- `kalkulator-w-javascript.webp`: a young person operating a calculator-like
  validation machine;
- `api-http-json.webp`: a young woman moving and checking data parcels between a
  client and server through an HTTP connection.

## Execution

```text
generate three independent illustrations with the accepted DOM image as style reference
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

- Reference: `src/assets/dom-w-javascript.webp`, used for style and proportions,
  not as an edit target.
- Wide 16:9 composition; main motif remains legible at article-card scale.
- Character scale approximately 20–27% of the canvas.
- Soft editorial comic, warm off-white background, dark hand-drawn outlines,
  restrained orange/yellow/blue accents and small floral details.
- No readable text, code, logos, trademarks or watermark.
- One generated source per article; no automatic publication or deployment.

## Boundaries

- WEBSITE assets and metadata-only changes to the three already published CONTENT
  entries.
- Article bodies, technical meaning, immutable candidates, reviews, promotion
  audits, SOURCE and historical LAB artifacts remain unchanged.
- No Engine agent-module, dispatcher, database, Git push or Cloudflare deployment.

## Verification

1. Visually inspect every source for subject, style, composition, malformed
   anatomy, stray text and thumbnail readability.
2. Verify final files are exactly 1600×900 opaque sRGB WebP.
3. Run `verify:article` for all three affected lifecycles.
4. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
5. Confirm article and listing output use the distinct images and descriptive alt
   text at desktop and mobile widths.

## Result

- Built-in ImageGen produced three independent opaque 1672×941 PNG sources using
  `dom-w-javascript.webp` as a style/proportion reference only. All three first
  results passed visual review; no regeneration was required.
- Accepted sources were center-normalized to opaque sRGB WebP, exactly 1600×900:
  Markdown 99,648 bytes, calculator 103,034 bytes and API 113,694 bytes. Exact
  prompts, source filenames and SHA-256 hashes are recorded in
  `lab/reports/next-featured-images.md`.
- The three published entries received only `featuredImage` / `featuredAlt`
  metadata. Article bodies and technical meaning remain byte-identical.
- `lab/decisions/next-featured-images.json` binds the explicit human scope; three
  append-only `METADATA_ONLY` records replay to current CONTENT. All three affected
  `verify:article` runs PASS with an effective valid review.
- `npm run test`: PASS — 360/360 in 28 files.
- `npm run check`: PASS — 168 files, zero errors, warnings or hints.
- `npm run build`: PASS — 23 pages; Pagefind indexed 22 pages / 2331 words. Astro
  optimized the new images to approximately 71 KB, 76 KB and 80 KB.
- Browser review at 1440 px and 320 px: all hero images loaded at 16:9 with exact
  alt text, all listing thumbnails use the matching source, no horizontal overflow
  and no console errors or warnings.
- No SOURCE, immutable candidate/review, Engine agent, Git push or deployment
  action occurred. Pre-existing worktree changes were preserved.
