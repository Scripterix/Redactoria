# 035 — Python, Git and curl featured images

Status: COMPLETED · 2026-10-16

## Objective

Freeze the expanded soft-comic visual frame established by the Markdown,
calculator and API illustrations, then generate and assign three article-specific
illustrations to the published Python fundamentals, local Git and curl/HTTP
articles.

## Human authorization

The human explicitly selected the latest three-image set as the new visual
reference: greater detail, stronger comic storytelling and an expanded but closed
palette. New images must remain inside that frame and must not introduce further
colors or a new rendering language.

The human authorized generation and replacement of the shared fallback for:

- `podstawy-pythona.webp`;
- `git-lokalnie.webp`;
- `curl-http.webp`.

## Execution

```text
record the closed visual frame
→ generate three independent illustrations using the latest set as references
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

## Boundaries

- WEBSITE assets, a Project Brain visual-frame document and metadata-only changes
  to three already published CONTENT entries.
- Article bodies, technical meaning, immutable candidates, reviews, promotion
  audits, SOURCE and historical LAB artifacts remain unchanged.
- No recoloring of earlier illustrations in this increment.
- No Engine agent-module, automatic generator, Git push or deployment.

## Verification

1. Inspect every source for visual-frame compliance, subject, composition,
   malformed anatomy, stray text and thumbnail readability.
2. Verify final files are exactly 1600×900 opaque sRGB WebP.
3. Run `verify:article` for all three affected lifecycles.
4. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
5. Confirm article and listing output use distinct images and descriptive alt text
   at desktop and mobile widths.

## Result

- The human-selected closed visual frame is recorded in
  `docs/featured-image-visual-frame.md`. It fixes the permitted seven color
  families, charcoal linework, soft-comic rendering, small character scale,
  story-world density and thumbnail-safe composition.
- Built-in ImageGen produced all three distinct scenes using the Markdown,
  calculator and API images as style references only. Python's first result had an
  extra snake head; one targeted edit corrected only the snake anatomy. Git and
  curl were accepted on their first generated result.
- Accepted sources were center-normalized to opaque sRGB WebP, exactly 1600×900:
  Python 138,902 bytes, local Git 138,766 bytes and curl 169,854 bytes. Exact
  prompts, source filenames and SHA-256 hashes are recorded in
  `lab/reports/b5-featured-images.md`.
- The three published entries received only `featuredImage` / `featuredAlt`
  metadata. Article bodies and technical meaning remain byte-identical.
- B5 had no prior per-article CONTENT-lineage bundle. The new append-only bundles
  are bound to `lab/decisions/b5-featured-images.json`; all three replay from their
  immutable promotions and retain a valid technical review.
- All affected `verify:article` runs PASS. `npm run test`: PASS — 360/360 in 28
  files. `npm run check`: PASS — 169 files, zero errors, warnings or hints.
- `npm run build`: PASS — 23 pages; Pagefind indexed 22 pages / 2350 words. Astro
  optimized the new images to approximately 101 KB, 101 KB and 124 KB.
- Browser review at 1440 px and 320 px: all hero images loaded at 16:9 with exact
  alt text, all listing thumbnails use the matching source, no horizontal overflow
  and no console errors or warnings.
- No SOURCE, immutable candidate/review, earlier illustration, Engine agent, Git
  push or deployment action occurred. Pre-existing worktree changes were preserved.
