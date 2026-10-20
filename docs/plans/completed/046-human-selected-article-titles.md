# Plan 046 — Human-selected article titles

Status: **COMPLETED** · 2026-10-19

## Objective

Apply the exact title choices marked in red by the human after the review of plans
044 and 045.

## Selected changes

- `funkcje-javascript` → `Jak działają funkcje w JavaScript`
- `podstawy-pythona` → `Python od podstaw`
- `api-http-json` → `Jak pobierać dane z API przez fetch`
- `kalkulator-w-javascript` → `Jak napisać prosty kalkulator w JavaScript`
- `markdown-podstawy` → `Składnia Markdown na prostych przykładach`

The selected current titles for PHP, JavaScript foundations, Google AI Search and
Git remain unchanged. The unmarked curl row remains unchanged.

## Boundaries

- Change only the front-matter title and matching Markdown H1.
- Preserve slugs, URLs, descriptions, prose, code, sources and technical meaning.
- Preserve immutable candidates, reviews and promotion audits.
- Append exact, hash-bound CONTENT lineage for every changed article.
- Do not modify unrelated active plan 043 work.
- No Git commit, push or deployment.

## Verification

1. Replay and validate all five affected CONTENT lineages.
2. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
3. Confirm the five local routes and article listing show the selected titles.

## Result

- The five proposed titles marked in red were applied exactly. The four current
  titles marked in red and the unmarked curl title remain unchanged.
- Slugs, URLs, descriptions, article prose, code and sources remain unchanged.
- Exact front-matter and H1 changes were appended to each affected article's
  existing, hash-bound CONTENT lineage. All five `verify:article` checks pass.
- `npm run test`: PASS — 368/368 tests in 29 files.
- `npm run check`: PASS — 180 files, zero errors, warnings or hints.
- `npm run build`: PASS — 29 pages; Pagefind indexed 28 pages / 3396 words.
- Localhost checks confirmed matching document titles, H1 headings and listing
  titles for all ten reviewed routes. `git diff --check` reported no whitespace
  errors.
- No unrelated active-plan work, immutable artifact, Git commit, push or
  deployment was changed.
