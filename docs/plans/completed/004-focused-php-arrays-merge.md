# Execution Plan 004: Focused PHP arrays merge analysis

## Goal

Read exactly the two selected PHP arrays articles in full and propose a grounded
merge plan and article outline, without modifying SOURCE/CONTENT or writing an article.

## Context

Cartographer 0.1 and a hash-bound RecordedLanguageModel already exist. This task is
a focused continuation inside the same agent, not a new agent or a full-corpus run.
The user explicitly authorizes a MERGE analysis and a proposed (never approved) LAB
decision, with no external model API calls.

## Scope

Minimal repeated `--focus` and `--task merge` CLI extension, focused contract and
evidence validation, exactly two full body reads, request/session import, stable
JSON and report, conditional proposed decision, tests and Project Brain updates.
No Researcher, Writer, publication, source fixes, or CONTENT edits.

## Files created

- `engine/agents/cartographer/focused-merge.ts`: focused schemas, selected inventory,
  two full reads, one model request and exact evidence validation.
- `engine/agents/cartographer/focused-merge-report.ts`: JSON-first artifacts, human
  report and a proposed-only, hash-bound decision.
- `engine/agents/cartographer/__tests__/focused-merge.test.ts`: deterministic tests.
- `lab/cartography/requests/focused-merge.json`: audit request with exactly two bodies.
- `lab/cartography/focused-merge-session-responses.json`: labelled session analysis.
- `lab/cartography/php-arrays-merge.json`: validated MERGE plan.
- `lab/reports/php-arrays-merge.md`: comparison, findings and proposed article outline.
- `lab/decisions/php-arrays-merge-proposal.json`: status proposed, action MERGE.
- `docs/plans/completed/004-focused-php-arrays-merge.md`: this execution record.

## Files modified

- `scripts/cartographer.ts`: repeated focus arguments, MERGE-only selection,
  focused preparation/import/run and context-appropriate errors.
- `engine/core/language-model.ts`: focused-merge phase on the existing model port.
- `engine/adapters/recorded-language-model.ts`: isolated, hash-bound focused response.
- `engine/validation/cartographer.ts`: reusable exact-evidence assertion; existing
  corpus validation retains its behavior.
- `engine/core/lab-writer.ts`: LAB decisions allowlist with the same path protections.
- `engine/agents/cartographer/README.md`, `README.md`, `lab/README.md`:
  focused usage and proposed-only boundaries.
- `docs/architecture/cartographer.md`, `docs/architecture/overview.md`:
  focused contract, flow, full-read guarantees and import/replay limitations.
- `docs/roadmap/ROADMAP.md`, `docs/changelog/CHANGELOG.md`, `docs/index.md`:
  actual implementation status and human-review next step.
- `docs/plans/active/README.md`: no active plan after completion.

## Implementation

1. Verify baseline and record selected SOURCE, CONTENT and existing LAB hashes.
2. Define focused MERGE schema, selection/order, full-read and evidence guarantees.
3. Extend existing CLI and recorded adapter without changing normal corpus runs.
4. Test exactly-two scope, action/confidence/evidence/outline, and filesystem boundaries.
5. Prepare the focused request, analyze both complete texts in this session, import
   the answer, and generate only the specified LAB artifacts plus audit records.
6. Run quality gates, compare hashes and stable replay, update Project Brain and
   move this plan to completed.

## Tests

Fake/recorded model integration; unsupported tasks; invalid or missing targets;
only two source reads; no truncation; forged evidence; confidence bounds; required
outline; proposed-only decision; no SOURCE/CONTENT writes; stable postprocessing.

## Risks

Citation validation does not prove PHP example correctness. Version-sensitive,
security-sensitive and ambiguous snippets must remain marked as research needs;
no external research or code execution is implied by the merge recommendation.
The two parts are complementary, not necessarily duplicate articles.

## Result

Completed on 2026-10-08, without starting the next milestone.

### Scope and actual analysis

Exactly two targets, in supplied order:

1. `1324-post-61-tablice-w-php-czesc-1.md` (source_id 1324): 10,906 supplied characters;
   source SHA-256 `45a70e243361632e60992e1ef1ba91d7cdd073306b552b7bd4a148250b786d90`.
2. `1356-post-62-php-tablice-czesc-ii.md` (source_id 1356): 4,548 supplied characters;
   source SHA-256 `845bd2e7b8d36e669688e4638c6e7c2f8ee7403aece887c423921d9282afcc5c`.

Both full bodies (15,454 UTF-16 code units total) were read without truncation.
No renewed corpus-wide analysis, scanner run or original knowledge-map replacement.
Only selected metadata and bodies were provided to one focused model request.
The real analysis was authored in this Codex session, imported with explicit
provenance and replayed by RecordedLanguageModel; no external model API was called.
The descriptive model label does not invent an unavailable model identifier.

Request SHA-256:
`6e6d1d410a37dfd42e1981073bd0f212552450eb83296c54694d82fc098ba1c4`.

MERGE recommended, confidence 0.96 (declared confidence, not a probability).
Findings: 3 shared topics, 5 unique-to-first groups, 3 unique-to-second groups,
3 duplication findings, 3 inconsistencies, 3 ordering findings, 4 uncertain passages,
5 keep recommendations, 5 remove/reduce recommendations, 5 research needs and
15 grounded outline sections.

The first text supplies fundamentals, keys, nested arrays, mutation/iteration and
practical data examples. The second adds extract, sorting, combining arrays,
map/filter/reduce and value counts. These are complementary, not two identical articles.
Certain editorial issues include the Post #60/61 cross-reference mismatch and the
reduce example placed under the count_values heading. PHP version behavior, keys,
null checks, extract/input risks and executable examples require later research;
none was silently treated as externally verified.

The decision has literal `status: proposed` / `action: MERGE`, matching source
hashes and analysis hash. No human approval was inferred.

### Quality gates and reproducibility

Commands all succeeded:

```sh
npm run test
npm run check
npm run build
npm run cartographer -- --focus 1324-post-61-tablice-w-php-czesc-1.md --focus 1356-post-62-php-tablice-czesc-ii.md --task merge
```

- Tests: 83 passed in 8 files, with fake/recorded models only.
- Check: 46 files, 0 errors, 0 warnings, 0 hints.
- Build: 6 static pages, success.
- Focused CLI: 2 full targets, valid structured output, 3 LAB artifacts, success.
- Repeat focused CLI: identical hashes for all 3 output files.
- Documentation: 27 Markdown files checked for local links, no broken links.
- `git diff --check`: success (only pre-existing LF/CRLF notices).

Artifact SHA-256:

| Artifact | SHA-256 |
| --- | --- |
| `lab/cartography/php-arrays-merge.json` | `d3dc07359e5fe69055c4d0610b382f13a715e6f2bef7c053ec9ab51a7c6f0a23` |
| `lab/reports/php-arrays-merge.md` | `f5cc3db47cf3f2d0a68f58f894d876f3b1708e40b7df76961782a6e77a2cc715` |
| `lab/decisions/php-arrays-merge-proposal.json` | `1d93770f007cf9c5a4fccda541f082214bbd15e2f70425f92390f91e98d23507` |

### Boundary and architecture checks

The preflight snapshot of 14 protected files remains byte-identical: both selected
SOURCE articles, all existing CONTENT files, inventory and previous cartography/reports
including their placeholders. SOURCE checkout `git status --short` remains empty.
CONTENT still contains only the original 2 files; `content/articles/php-arrays.md`
does not exist. Integration tests also cover LAB/decisions redirect into CONTENT
and preserve actual fixture source/content bytes on rejection.

Only Cartographer exists under `engine/agents/`. No Researcher, Writer, Dispatcher,
job queue, scheduling or publication was implemented or invoked. ADR 0003 already
covers the contract and boundaries, so no new ADR or revision was needed.
Unrelated pre-existing worktree changes were preserved; no commit or push was performed.

### Handoff

Review the [human merge plan](../../../lab/reports/php-arrays-merge.md) and
[proposed decision](../../../lab/decisions/php-arrays-merge-proposal.json), then decide
whether to accept the outline and authorize a separately scoped research/editing step.
The proposal is not approval; do not start another runtime agent automatically.

## Follow-up: human approval and session closeout (2026-10-08)

The user subsequently approved MERGE for these exact two targets. The existing
decision now has `status: approved`, `approvedBy: human`, `approvedAt` and
`nextStep: research`. All original targets, evidence, confidence, source hashes,
analysis hash/reference and existing identifiers/provenance were retained.
The artifact hashes above document the original proposed run; approval intentionally
changes the decision file only, not the Cartographer analysis or report.

Plan 004 stays completed. [STATUS](../../STATUS.md), Roadmap and Project Brain now
record Milestone 2/focused run DONE and Milestone 3 — Researcher 0.1 NEXT.
No Researcher plan/module, article, execution of MERGE or publication was created.
The LAB writer now refuses to replace approved human decisions, with a regression
test. Approval verification is read-only, so replay cannot downgrade it to proposed.

Closeout verification: 84 tests in 8 files passed; check examined 46 files with
0 errors/warnings/hints; build generated 6 static pages. Read-only focused replay
matched the existing analysis/report and the original proposal fields while validating
the human approval. Of 13 protected closeout paths (including SOURCE, CONTENT and
ADRs), only the explicitly approved decision changed; its current SHA-256 is
`7ca8e47a26954b32d2e145f396472f16d6dc90b0371ae5c12ce9e0c37cdb8622`.
All 28 Markdown files had valid local links; the project-file credential-pattern
scan reported no findings. The verified foundation is prepared for the user-requested
commit/push to `Scripterix/Redactoria` on the actual local `master` branch.
