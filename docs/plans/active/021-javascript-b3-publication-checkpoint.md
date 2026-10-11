# 021 — JavaScript B3 publication checkpoint

Status: ACTIVE · HUMAN-AUTHORIZED PUBLICATION · 2026-10-11

## Objective

Publish exactly three approved B3 candidates — `javascript-if-else`,
`javascript-arrays` and `javascript-dom` — through separate human decisions and the
existing deterministic Promotion Gate, then verify the complete five-article system,
push `master`, verify Cloudflare production and stop.

## Sequence

1. Preserve and classify the existing working tree, including the homepage copy edit
   and the uncommitted Knowledge Gap 0.1/0.2 review artifacts.
2. Verify all three pending JavaScript lifecycle records before publication.
3. For each topic in order, create one hash-bound human publication decision, run
   the Promotion Gate and run post-promotion `verify:article`. Stop on any failure.
4. Add only natural, reviewed internal links without changing technical meaning;
   record every post-promotion CONTENT change through append-only lineage and a new
   review if such a change is necessary.
5. Verify website utilities, Pagefind and sitemap from the production build.
6. Run all five lifecycle checks, `npm run test`, `npm run check`, `npm run build`
   and `git diff --check`; verify protected artifacts and publication lineage.
7. Update bounded Project Brain state, complete this plan and create logical commits.
8. Push `origin/master`, verify the real Cloudflare production routes and stop.

## Boundaries

No SOURCE mutation, candidate regeneration, reviewed-Markdown rewrite, automatic
publication policy, new website component, learning-path UI, future runtime agent,
rank #5–#10 work, PHP-foundation content or new experiment. Promotion approval is
limited to the three named exact candidates. Dream Cycle and Agentic Circus remain
`FROZEN / CONCEPT`.

## Authorized external effects

After the complete local quality gate passes, commits and `git push origin master`
are explicitly authorized. Cloudflare production is then verified read-only. Any
failed promotion or gate stops subsequent publication/deployment work.

## Local result before Git

- All three pending JavaScript lifecycle verifications passed before decisions.
- Three separate schema-v3 human decisions bind the exact candidate JSON, Markdown,
  final Critic PASS and target slug.
- Promotion order was if/else → Arrays → DOM; every gate returned
  `PROMOTED_PUBLIC`, followed immediately by `verify:article` PASS.
- Candidate bodies and historical flags remain unchanged. Promotion added front
  matter and removed only the exact approved technical LAB note.
- Three natural navigation additions have one replayable append-only
  `CONTENT_LINEAGE_RECORD` each; all three lifecycle checks remain PASS afterward.
- Production build: 15 generated pages; Pagefind 14 pages / 1801 words; sitemap
  15 public URLs with no LAB, candidate or internal-doc path.
- All five lifecycle checks: PASS with complete publication semantics.
- `npm run test`: PASS, 333/333 tests in 25 files. One historical pending-candidate
  assertion was updated to validate the new published JavaScript lineage.
- `npm run check`: PASS, 137 files with zero errors, warnings or hints.
- `npm run build`: PASS, 15 generated pages; Pagefind 14 pages / 1801 words.
- Local browser: all three articles at 320 px and 1440 px have no page overflow;
  reading time, metadata, code blocks, Copy/Copied and back-to-top pass. Their three
  or four H2 sections correctly remain below the existing five-section TOC threshold.
  Real Pagefind queries return each JavaScript article.
- Git push and Cloudflare production verification remain pending.
