# 028 — Featured Image 0.1

Status: COMPLETED · 2026-10-13

## Authorized scope

Add one shared featured-image fallback to the existing Astro publication layer:

1. Extend the article content schema with optional `featuredImage` and
   `featuredAlt` fields.
2. Render a 16:9 featured image below the article header.
3. Render the same image as a 16:9 thumbnail in the shared article card.
4. Keep existing Markdown entries unchanged; missing fields use the supplied
   `src/assets/default-img.webp` file and the article title as alt text.

## Boundaries

- WEBSITE and the backward-compatible CONTENT schema only.
- No article-body edits, bulk front-matter migration, plugin, dependency or layout
  redesign.
- No SOURCE, LAB, ENGINE, publication decision, Git push or deployment action.
- Keep the supplied image in `src/assets`, following Astro's recommendation for
  imported local images; do not create a duplicate under `public/`.

## Verification

1. Unit-test image and alt fallback resolution.
2. Run `npm run test`, `npm run check` and `npm run build`.
3. Inspect generated article/listing HTML for shared fallback output.
4. Smoke-check desktop and mobile layout, including horizontal overflow.
5. Record the result and move this plan to `docs/plans/completed/`.

## Result

- The shared component resolves `featuredImage` / `featuredAlt` once for both
  placements. Missing image metadata uses the imported local asset; missing alt
  text uses the article title and retains a final generic fallback.
- `ArticleLayout` renders the hero below title, description and metadata.
  `ArticleCard` renders the same source above each card's metadata.
- Existing article Markdown stayed unchanged. Future entries can opt into their own
  image URL and alt text through the two optional schema fields.
- The production build emits one optimized fallback asset. Generated listing HTML
  contains nine thumbnails using that source, and article HTML contains the hero
  with the article title as alt text.
- Browser smoke at 1440 px and 320 px confirmed `16 / 9`, `object-fit: cover`, loaded
  images and no horizontal overflow. Console: zero errors and zero warnings.
- Quality: `npm run test` PASS — 352/352 in 28 files; `npm run check` PASS —
  155 files, zero diagnostics; `npm run build` PASS — 19 static pages, one optimized
  image and an 18-page Pagefind index.
- The featured-image implementation itself did not edit article bodies. No SOURCE,
  LAB, ENGINE, dependency, Git or deployment action occurred in that increment.

### Listing-order follow-up — 2026-10-13

- At human request, the card order is now metadata → title → linked thumbnail →
  description. The single-article hero order is unchanged.

### Reader-copy follow-up — 2026-10-13

- At human request, all eight technical articles now describe the audience as
  beginners and people at an intermediate level.
- Internal B3/B4 authorization and interaction-metadata notes were removed from
  the six public article bodies that exposed them. Historical LAB artifacts remain
  unchanged as traceability evidence.
- The eight public changes have append-only, replayable CONTENT-lineage records
  bound to the exact human authorization; all eight article lifecycle checks pass.
