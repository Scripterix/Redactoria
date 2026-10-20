# Plan 043 — Golden pedagogy rule, History of IT article and B6 images

Status: **ACTIVE — PARTIAL EXECUTION** · 2026-10-19

## Objective

Prepare one bounded editorial increment that:

1. makes `docs/pedagogy-principle.md` the explicit golden rule for Redactoria EDU;
2. processes the human-supplied history article through a truthful `HUMAN_WRITTEN`
   route and introduces **Historia IT** in the existing topic model;
3. replaces the shared fallback image for the three B6 foundation articles with
   three distinct, reviewed illustrations.

This plan does not itself approve the new article for publication, authorize image
generation, or authorize Git push/deployment.

## Inputs and interpretation

- Canonical pedagogy input: `docs/pedagogy-principle.md`.
- Human article input:
  `jak_powstaly_pierwsze_jezyki_programowania_redactoria_v2.md`.
- The phrase “three articles from 16 October” is interpreted as the B6 foundation
  set:
  - `content/articles/podstawy-php.md`;
  - `content/articles/podstawy-javascript.md`;
  - `content/articles/funkcje-javascript.md`.
- `content/articles/google-ai-search-2026.md`, although also dated 2026-10-16, is
  a separate manual publication and is outside this image batch.
- The repository currently models public groupings as `topics`, not a separate
  category layer. Therefore **Historia IT** should initially be represented by
  `content/topics/historia-it.yaml` and the article's `topic: historia-it` reference.
  No second taxonomy or schema migration is justified by one article.

## Workstream A — establish the golden pedagogy rule

1. Treat the new principle as a durable policy companion to `docs/pedagogy.md`,
   not as a Futureboard hypothesis.
2. Link it from `docs/index.md` and `docs/pedagogy.md`; update `docs/STATUS.md` and
   the roadmap only where their recorded current state changes.
3. Preserve the core distinction:

   ```text
   remove chaos and missing context
   !=
   remove thinking, attempts, errors and correction
   ```

4. Translate the principle into a short, reviewable pedagogical check for this
   article: the learner gets the model and the next step, but is not handed every
   inference or exercise result.
5. Do not add an Engine agent, automatic rewrite rule, learner database, manifest,
   or Code Navigator implementation in this milestone.

## Workstream B — verify the human History of IT article in LAB

1. Copy the supplied input into a LAB-owned draft/provenance area without silently
   changing its meaning. Record that the operator selected the `HUMAN_WRITTEN`
   route. Do not invoke Writer merely to make the text look Engine-generated.
2. Create an article-specific input note with `KNOWS`, `DOES_NOT_KNOW`,
   `LEARNING_GOAL`, `LIKELY_CONFUSIONS`, and `PREREQUISITES`.
3. Verify factual claims against primary or strong institutional sources. At
   minimum check:
   - the distinction between switching circuits, machine instructions and stored
     programs;
   - Kathleen Booth and early assembly-language chronology;
   - Manchester Baby date, program and instruction count;
   - transistor chronology and the timing of transistorized computers;
   - punched media, IBM's 1971 diskette use and the non-linear coexistence of
     storage media;
   - FORTRAN project dates, IBM 704, team attribution and compiler claims;
   - fixed-form FORTRAN `PRINT` / `FORMAT` syntax and rendered whitespace;
   - dates and scope statements in the later-language comparison table;
   - the claim that Fortran remains developed and used.
4. Normalize the bibliography into the article `sources` metadata while keeping
   readable body references only where they add teaching value. Record access
   dates and use `unknown` / `needs-review` instead of filling gaps by inference.
5. Run a pedagogy review using the golden rule. Prefer prompts to predict or trace
   a state before revealing an answer where that improves learning, but do not
   mechanically turn a historical narrative into a coding tutorial.
6. Run one Critic-style review of the exact verified draft. Any factual or
   pedagogical body change must be visible as a proposed human edit; no automatic
   revision loop.
7. Produce a hash-bound LAB candidate only after factual and pedagogical blockers
   are closed. Stop for a human publication decision.

## Workstream C — add Historia IT through the existing content model

After the candidate passes review and the human separately approves publication:

1. add `content/topics/historia-it.yaml` with a Polish name, description, unique
   order and `published` status;
2. adapt the approved article to the complete article schema with truthful human
   authorship/provenance, `topic: historia-it`, review state and source metadata;
3. keep the current static Astro routes: `/tematy/historia-it/` and the article
   route should be generated without an SPA or a new category subsystem;
4. use the existing manual promotion boundary or a narrowly documented manual
   import if the current gate cannot truthfully represent `HUMAN_WRITTEN` input;
   do not broaden the Promotion Gate speculatively;
5. verify topic listing, article listing, search, sitemap, source rendering, table
   overflow, fixed-form code whitespace and one visible H1.

The article remains in LAB if publication is not separately approved. Creating the
topic file and writing into CONTENT are part of the same later publication gate so
the public topic cannot exist empty by accident.

## Workstream D — create three B6 featured-image replacements

1. Use the accepted `docs/featured-image-visual-frame.md` 0.2 frame and the latest
   approved illustrations as style references. Prepare a distinct visual brief for
   each article before generation:
   - PHP foundations: server-side input → PHP processing → visible output;
   - JavaScript foundations: values and variables changing an observable program
     state;
   - JavaScript functions: input → reusable function → returned result, with the
     callback idea secondary rather than visually overloaded.
2. Keep the closed palette, charcoal linework, soft-comic density, small-character
   scale and 16:9 thumbnail-safe composition. Avoid logos, UI screenshots,
   decorative source code and generated text.
3. Generate three independent candidates. Inspect technical meaning, anatomy,
   stray text, crop safety and distinction from existing images; iterate only for
   a concrete defect.
4. Normalize accepted assets to opaque sRGB WebP, exactly 1600×900, under
   `src/assets/`. Record prompts, source files, dimensions and SHA-256 hashes in a
   LAB report and bind the change to an explicit human image decision.
5. Add only `featuredImage` and descriptive `featuredAlt` metadata to the three
   published articles. Their bodies, immutable candidates, reviews, promotions and
   technical meaning must remain unchanged.
6. Append CONTENT-lineage records for the metadata-only changes and run
   `verify:article` for all three lifecycles.

## Required verification

Run the repository quality sequence after implementation:

```text
npm run test
npm run check
npm run build
git diff --check
```

Then perform focused rendered checks:

1. new Historia IT topic and article at desktop and 320 px;
2. fixed-form FORTRAN spacing, tables, source links and table of contents;
3. all three B6 hero images and listing thumbnails at desktop and 320 px;
4. distinct assets, exact alt text, no horizontal overflow and no browser errors;
5. Pagefind and sitemap include the history article only if publication was
   approved and performed.

## Boundaries and stop conditions

- SOURCE remains read-only.
- The supplied root-level files and existing uncommitted Futureboard/LAB edits are
  user work and must be preserved.
- No automatic LAB → CONTENT transition.
- No generic `HUMAN_WRITTEN` automation, new runtime agent, Dispatcher, database,
  queue, SPA conversion, Git push or deployment.
- Stop after the verified LAB candidate for a human publication decision.
- Image generation and image assignment require explicit execution approval; they
  are not implied by approval of this plan.
- If **Historia IT** is intended as a taxonomy independent of the existing topic
  model, stop and make that product/architecture decision before schema changes.

## Completion evidence

Move this plan to `docs/plans/completed/` only when the result section records:

- where the golden rule is linked and how the pedagogical check was applied;
- article provenance, evidence register, review verdict and candidate hash;
- the human decision governing any CONTENT/topic write;
- image decision, prompts, hashes and lineage records;
- exact quality-command results and rendered-route checks;
- whether Git/deployment remained untouched.

## Progress — 2026-10-19 foundation images

- The human approved generation and assignment of two B6 foundation images:
  JavaScript **Pierwsze kliknięcie** and PHP **Warsztat podstaw PHP**.
- Built-in ImageGen candidates were corrected once because the initial characters
  were too large. Accepted characters remain secondary to the dominant machines.
- Accepted opaque sRGB assets are exactly 1600×900 WebP:
  `src/assets/podstawy-javascript.webp` and `src/assets/podstawy-php.webp`.
- Only `featuredImage` and `featuredAlt` metadata was added to the two published
  articles. Their bodies and technical meaning remain unchanged.
- The human authorization, prompts, normalization details and hashes are recorded
  in `lab/decisions/b6-foundations-featured-images.json` and
  `lab/reports/b6-foundations-featured-images.md`.
- Both append-only CONTENT-lineage bundles validate with effective review `VALID`;
  both focused `verify:article` runs pass.
- `npm run test`: PASS — 368/368 tests. `npm run check`: PASS — 182 files and
  zero diagnostics. `npm run build`: PASS — 29 pages; both images optimized.
- Browser checks at 1440 px and 320 px confirm the correct hero and thumbnail,
  exact alt text, 16:9 rendering, no horizontal overflow and no console warnings
  or errors.
- The third planned B6 image for `funkcje-javascript` remains pending and the plan
  stays active. No image-procedure Skill, Git push or deployment was performed.
