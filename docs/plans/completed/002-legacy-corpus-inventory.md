# Execution Plan 002: Legacy Corpus Inventory

## Goal

Inventory the complete legacy Markdown corpus deterministically and generate a data
quality summary while preserving every source byte.

## Context

Milestone 0.5 provides a verified Astro site, LAB, Project Brain, Vitest, and type
checking. The next input is the external `Scripterix/temp-ogwo` repository.

## Scope

Read-only source checkout, minimal fixtures, parser, explicit InventoryRecord
contract, CLI scanner, inventory serialization, summary, and automated verification.
No editorial classification, modernization, Cartographer, Engine, or publishing.

## Files affected

- `scripts/legacy/` and `tests/`
- `AGENTS.md`, `package.json`, `package-lock.json`, `tsconfig.json`, and `README.md`
- `lab/inventory/inventory.json` and `lab/reports/corpus-summary.md`
- LAB README, Project Brain index, architecture overview and inventory contract,
  roadmap, changelog, active plans index, and this execution plan

## Implementation

1. Verify baseline with test, check, and build.
2. Connect the sibling source checkout and record its revision.
3. Create minimal fixtures before implementing the parser.
4. Define a versioned inventory, parse metadata, hash original bytes, and sort paths.
5. Test parser errors, missing data, BOM, Unicode, slugs, identity, and hashes.
6. Test scanner determinism, CLI output, and source immutability.
7. Scan the real corpus twice and compare outputs and source hashes.
8. Generate the summary and run all quality gates.
9. Update Project Brain, record evidence, and complete the plan.

## Tests

Unit parser and summary tests; fixture integration and CLI tests; byte-identical
repeat runs; source hash comparison; `npm run test`, `npm run check`, `npm run build`.

## Risks

Dates without timezone must not be silently converted. Source strings, including
encoded slugs, must be preserved. YAML errors must produce records instead of
aborting the corpus. Write targets must remain outside the source directory.

## Result

Completed on 2026-10-08. Implementation is ready for Milestone 1 acceptance;
Milestone 2 has not been started.

### Source and corpus

- External repository: `https://github.com/Scripterix/temp-ogwo`.
- Revision: `a3d96180ebe619dd01cb77479bee095c3ee9a58e`.
- Relative source directory: `../temp-ogwo/posts`.
- Files scanned: **83**; parsed OK: **82**; needs-review: **1**; parse errors: **0**.
- Inventory schema: **1**; all 83 records remain editorially `unreviewed`.
- All 83 source files contain a UTF-8 BOM; hashes include the original BOM bytes.
- `143-post-4-angular-podstawy-praktyka.md` requires review because it lacks
  `post_id`, slug, URL, author, and tags, and uses a scalar category. Its category is
  retained as one array entry and its ID falls back to the relative path. The
  source was not repaired.
- Source date range: `2024-10-08 15:28:57` to `2025-09-29 16:17:32`.
- Body token counts: minimum 0, median 651, mean 871.02, maximum 5631.
- No exact duplicate titles, slugs, or original-byte hashes were found.

### Verification

- Baseline test, check, and build passed before implementation.
- Seven minimal fixtures cover valid metadata, BOM, Polish Unicode, encoded slugs,
  missing author, missing date, and malformed front matter.
- `npm run test`: **4 files / 30 tests passed** (3 existing and 27 scanner tests).
- `npm run check`: **28 files / 0 errors / 0 warnings / 0 hints**.
- `npm run build`: **six static routes generated successfully**.
- `npm run inventory -- ../temp-ogwo/posts`: **passed twice** on the real corpus.
- Determinism: inventory and summary hashes were identical between consecutive
  final runs.
- Source preservation: all source-file SHA-256 hashes matched before/after the
  final runs; **0 source changes**. The external repository's worktree stayed clean.
- Automated tests also verified byte-identical CLI output, fixture source hashes,
  recursive ordering, controlled parse errors, and blocked writes both directly
  inside SOURCE and through a filesystem link into SOURCE.

Final artifact SHA-256 values:

```text
inventory.json
5C21F3BACC28A11A75BD7450902334E5EB2F9A0AEB18466F57C8B6A0128586C6

corpus-summary.md
ADB1E1A86C5B84681592B7BD8A6D578B9373A5DABA4E224F9007B77AB2706204
```

### Architecture and handoff

The scanner is a standalone deterministic tool under `scripts/legacy/`, not a
runtime agent. It writes only LAB artifacts; CONTENT and WEBSITE are unchanged.
The implementation follows ADR 0001 and ADR 0002, so no new ADR was necessary.
The inventory contract, architecture status, roadmap, and changelog were updated.

Next recommended step: accept Milestone 1 and define Milestone 2 — Cartographer
0.1 using this inventory. No Engine, Cartographer, scheduling, AI analysis, automatic
publication, commit, or push was performed.
