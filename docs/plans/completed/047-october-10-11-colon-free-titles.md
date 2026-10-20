# Plan 047 — Colon-free titles for the 10 and 11 October articles

Status: **COMPLETED** · 2026-10-19

## Objective

Remove the colon construction from all four article titles published on 10 and
11 October by making a small grammatical adjustment that preserves their meaning.

## Human authorization

The user explicitly requested colon-free versions of the 10 and 11 October titles
with light grammatical changes.

## Boundaries

- Change only the front-matter title, matching Markdown H1 and `updated` date.
- Preserve slugs, URLs, descriptions, prose, code, sources and technical meaning.
- Preserve immutable candidates, reviews and promotion audits.
- Append exact, hash-bound CONTENT lineage for every changed article.
- Do not modify unrelated active plan 043 work.
- No Git commit, push or deployment.

## Verification

1. Replay and validate all four affected CONTENT lineages.
2. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
3. Confirm the four local routes and article listing show the revised titles.

## Result

- All four 10/11 October titles now use one grammatical phrase without a colon.
- Slugs, URLs, descriptions, article prose, code and sources remain unchanged.
- Exact front-matter, updated-date and H1 changes were appended to each affected
  article's existing, hash-bound CONTENT lineage. All four `verify:article`
  checks pass.
- Two assertions were updated to reflect the authorized PHP H1 and the additional
  JavaScript lineage records exposed by this title-only change.
- `npm run test`: PASS — 368/368 tests in 29 files.
- `npm run check`: PASS — 181 files, zero errors, warnings or hints.
- `npm run build`: PASS — 29 pages; Pagefind indexed 28 pages / 3395 words.
- Localhost checks confirmed colon-free matching document titles, H1 headings and
  listing titles for all four routes. `git diff --check` reported no whitespace
  errors.
- No unrelated active-plan work, immutable artifact, Git commit, push or
  deployment was changed.
