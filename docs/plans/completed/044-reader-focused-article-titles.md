# Plan 044 — Reader-focused titles for the latest four articles

Status: **COMPLETED** · 2026-10-19

## Objective

Replace the formulaic, colon-separated titles of the four articles published on
2026-10-16 with short, natural titles that name a familiar topic or a concrete
reader task.

## Human authorization

The user explicitly requested simpler titles without colons for the latest four
articles and identified the PHP and JavaScript foundation titles as examples.
This authorizes title-only editorial changes to:

- `podstawy-php`;
- `podstawy-javascript`;
- `funkcje-javascript`;
- `google-ai-search-2026`.

## Boundaries

- Preserve slugs, URLs, descriptions, article prose, code, sources and technical
  meaning.
- Do not rewrite immutable LAB candidates, drafts, reviews or promotion audits.
- Record the post-publication title changes and exact hashes in append-only LAB
  evidence.
- Do not change the unrelated active plan 043 work or its uncommitted files.
- No Git commit, push or deployment.

## Verification

1. Confirm each front-matter title and each existing Markdown H1 use the same new
   title and contain no colon.
2. Replay and validate B6 CONTENT lineage for the three foundation articles.
3. Verify the manual Google article's before/after hashes and exact replacements.
4. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
5. Check the four local routes and the article listing.

## Result

- The four titles now use plain reader-facing phrases without colons. Slugs,
  descriptions, sources, article prose and code remain unchanged.
- The three B6 foundation articles have append-only, hash-bound CONTENT lineage;
  each `verify:article` lifecycle check passes.
- The manually imported Google article has a separate exact before/after title
  record because it does not use the Promotion Gate lifecycle bundle.
- `npm run test`: PASS — 368/368 tests in 29 files.
- `npm run check`: PASS — 178 files, zero errors, warnings or hints.
- `npm run build`: PASS — 29 pages; Pagefind indexed 28 pages / 3399 words.
- Local route checks confirmed matching document titles and H1 headings for all
  four articles. `git diff --check` reported no whitespace errors.
- No unrelated active-plan work, immutable LAB artifact, Git commit, push or
  deployment was changed.
