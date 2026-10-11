# 017 — CONTENT lineage contract spike 0.1

Status: COMPLETED — READ-ONLY PROTOTYPE PASS · 2026-10-11

## Authorized scope

The user authorized the bounded, read-only CONTENT Lineage Contract Spike 0.1.
This milestone could add a deterministic contract, validator, unit fixtures, a LAB
report and a separate evidence-backed historical backfill for PHP Arrays. It could
not edit SOURCE, existing candidates, reviews, promotion audits or CONTENT.

No operator CLI, automatic repair, publication, orchestration, Knowledge Graph,
Article Manifest, Dream Cycle or Agentic Circus was authorized.

## Plan executed

1. Defined closed change/review enums and a strict hash-bound lineage record.
2. Implemented pure deterministic replay and ordered-chain validation.
3. Reconstructed the original PHP Arrays promoted bytes from its frozen candidate
   and decision and proved the historical promotion-audit hash.
4. Added an append-only two-record historical backfill without rewriting any prior
   artifact: metadata-only then exact technical cleanup.
5. Added six positive scenarios and all nine requested negative classes.
6. Recorded the result in LAB and added a separate evidence-backed Futureboard
   candidate while preserving Dream/Agentic status.

## Result

PHP Arrays validates as:

```text
3b2435… original promoted CONTENT
  → METADATA_ONLY / REVIEW_STILL_VALID
117d4b… deterministic logical intermediate
  → TECHNICAL_CLEANUP / REVIEW_STILL_VALID
c4111b… current CONTENT
```

The metadata step changes only `updated` and byline. The cleanup removes exactly
two previously authorized workflow notes. No claim, example, citation or evidence
statement changed, so the Critic PASS remains valid. The missing structured record
is represented by a new separate LAB backfill, not an edited promotion audit.

The future `verify:article` integration is designed in the report but deliberately
not implemented. Durable write policy remains a separate decision.

## Quality and integrity

- `npm run test`: 317/317 tests PASS in 24 files.
- `npm run check`: 134 files, zero diagnostics.
- `npm run build`: 11 static pages; Pagefind indexed 10 pages / 1586 words.
- `git diff --check`: PASS apart from existing Windows line-ending notices.
- New JSON reports parse and the strict real-fixture replay passes.
- SOURCE, CONTENT, candidates, reviews and historical promotion audits were read
  only. No protected tracked target appears in the diff; only the new separate
  backfill was added under LAB reports.

## Outputs

- `engine/validation/content-lineage-contract.ts`
- `engine/validation/content-lineage.ts`
- `tests/unit/content-lineage.test.ts`
- `lab/reports/content-lineage-contract-spike.md`
- `lab/reports/content-lineage-contract-spike.json`
- `lab/reports/tablice-w-php-content-lineage.json`

## Stop boundary

STOP. No final operator CLI, repair, CONTENT change, publication, Git commit/push,
deployment or future agent layer was performed.
