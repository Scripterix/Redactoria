# 020 — Knowledge Gap 0.2 blind discovery and ablation

Status: COMPLETED · HUMAN REVIEW GATE · 2026-10-11

## Objective

Test from scratch whether the current Redactoria EDU structure reveals missing
knowledge without using Knowledge Gap 0.1, earlier expected-gap prompts, Futureboard
hypotheses or strategic priorities.

## Sequence

1. Preserve and inventory the current working tree.
2. Run A: use only PUBLIC, PENDING, SOURCE inventory/bounded deep reads, the current
   Knowledge Map and prerequisite relations from existing materials.
3. Serialize and freeze Run A before reading Strategic Memory.
4. Run B: add only clearly classified historical/strategic documents; never use
   them as proof that content exists.
5. Compare overlap, additions, removals and priority movement.
6. Recommend exactly one next content action without executing it.
7. Run all five article verifications and test → check → build → diff check.
8. Leave all 0.2 outputs uncommitted and stop.

## Outputs

- `lab/knowledge-gaps/knowledge-gap-0.2-run-a.json`
- `lab/knowledge-gaps/knowledge-gap-0.2-run-b.json`
- `lab/reports/knowledge-gap-0.2.md`
- bounded plan/status consistency updates

## Result

Run A inspected all 83 inventory records and 12 bounded SOURCE bodies, then produced
a blind TOP 10 using only PUBLIC, PENDING, SOURCE evidence, the current Knowledge Map
and explicit prerequisite relations. It was serialized and frozen before any
Strategic Memory read; its SHA-256 is
`98542ccd4bafc59a466a3180f8149822dad3c67bb8355789611bb3bc92bfacef`.

Run B reused the same factual evidence and added checkpoint-only strategic documents.
The runs share 9/10 gaps and an unchanged TOP 4. Strategy raised API, Git and Python,
while historical B1 selection introduced a low-confidence, metadata-only Markdown
hypothesis and displaced independently derived small-program testing. No shared gap
received higher confidence because Strategic Memory is not independent factual
evidence.

The experiment answered **YES**: the current structure is sufficient for blind gap
discovery. Strategic Memory helps sequence already grounded work, but can anchor the
ranking toward the historical acquisition queue. Exactly one next content action was
recommended: create a new PHP language-foundation article after separate human
authorization. The recommendation was not executed.

## Boundaries preserved

Knowledge Gap 0.1 and Futureboard were not used in either run. No article, candidate,
publication, B3 promotion, rank #5–#10 execution, runtime-agent invocation, commit,
push or deployment occurred. SOURCE, CONTENT, candidates, reviews, decisions, audits,
the verifier implementation and the pre-existing homepage edit remained unchanged.
All 0.2 outputs remain uncommitted for human review.

## Final verification

Recorded after the LAB outputs:

- five `verify:article` lifecycle checks: PASS; both PHP publications and all three
  pending JavaScript candidates retain their correct publication semantics.
- `npm run test`: PASS, 330/330 tests in 25 files.
- `npm run check`: PASS, 137 files with zero errors, warnings or hints.
- `npm run build`: PASS, 11 static pages and Pagefind 10 pages / 1582 words.
- `git diff --check`: PASS.
- Run A file SHA-256 matches the frozen hash recorded in the report.
