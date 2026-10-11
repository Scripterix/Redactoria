# Redactoria Project Brain

This directory is the entry point to the project's durable technical and product
memory. It records what exists, what has been decided, what is being executed, and
which ideas are still exploratory.

- [Project Status](STATUS.md) — quick current state, approved PHP MERGE, important
  file map and the next-session boundary.
- [Architecture](architecture/overview.md) — current system boundaries, data flow,
  and implementation status.
- [Legacy inventory](architecture/inventory.md) — scanner usage, versioned metadata
  contract, determinism, and source preservation.
- [Cartographer 0.1](architecture/cartographer.md) — runtime agent contract, model
  import, two passes, focused two-article MERGE plans, evidence, budgets, and manual CLI.
- [Researcher 0.1](architecture/researcher.md) — approved scope, official documentation
  evidence, code review, Research Packet, recorded replay and manual research-only CLI.
- [PHP Research Packet](../lab/research/php-arrays/research.md) — approved first pilot
  with historical limitations and future Writer instructions; not publication approval.
- [PHP runtime verification](../lab/research/php-arrays/runtime-verification.md) —
  actual PHP 8.4.26 / 8.5.11 PASS, provenance and mandatory null-offset addendum.
- [Research approval](../lab/decisions/php-arrays-research-approval.json) — human
  decision bound to original packet/evidence and new runtime supplement.
- [Writer / Critic 0.1](architecture/writer-critic.md) — separate runtime contracts,
  manual CLI, hash-bound draft/review, evidence and no automatic revision/publication.
- [PHP arrays draft](../lab/drafts/php-arrays/article.md) and
  [Critic review](../lab/reviews/php-arrays/critic-review.md) — human-authorized targeted
  correction, full second-pass PASS; original generation/REVISE preserved for audit.
- [First publication candidate](../lab/candidates/php-arrays/article.md) and
  [metadata/audit](../lab/candidates/php-arrays/README.md) — exact reviewed copy,
  2559 prose words, PHP 8.4–8.5; preserved historical M5 state, no regeneration.
- [Promotion Gate](../engine/promotion/README.md),
  [local human approval](../lab/decisions/php-arrays-publication.json) and
  [execution record](../lab/reports/tablice-w-php-promotion.json) — exact candidate
  → CONTENT for the original local-only gate; historical artifacts preserved.
- [Local website review](plans/completed/008-local-promotion-website-review.md) —
  URLs, responsive review, quality results and the next human gate.
- [Website utilities](plans/completed/009-reading-time-and-website-utilities.md) —
  reading time, official sitemap XML, HTML map, back-to-top and progressive code copy.
- [Search/public checkpoint](plans/completed/010-pagefind-search-public-checkpoint.md) —
  Pagefind, approved public note cleanup and current human-authorized Git/Cloudflare gate.
- [B1 pilot selection](../lab/reports/pilot-selection-b1.md) and
  [structured ranking](../lab/cartography/pilot-selection/ranking.json) — fresh ten
  candidates, eight criteria and full shortlist reads; its selection-only boundary
  was followed later by separately authorized B2 rank #1.
- [B2 PHP control flow candidate](../lab/candidates/php-control-flow/article.md),
  [final Critic PASS](../lab/reviews/php-control-flow/critic-review.md) and
  [pilot comparison](../lab/reports/php-control-flow-b2-comparison.md) — rank #1
  completed in LAB; the immutable candidate state remains pending/false.
- [B2 public-production decision](../lab/decisions/php-control-flow-publication.json)
  and [promotion audit](../lab/reports/instrukcje-sterujace-php-promotion.json) —
  separate human approval and deterministic exact promotion to CONTENT.
- [B2 publication checkpoint](plans/completed/013-php-control-flow-publication.md) —
  full gate, Git push and direct Cloudflare production verification complete. STOP
  before rank #2.
- [B3 five-sample comparison](../lab/reports/b3-five-sample-comparison.md) and
  [completed plan](plans/completed/014-b3-three-js-pipeline-samples.md) — ranks
  #2–#4 processed as three isolated JavaScript jobs to exact schema-v3 LAB
  candidates. Node/Chromium evidence passed; immutable candidate flags remain
  pending/false while later plan 021 provides separate publication authority.
- [Pipeline Review 0.1](../lab/reports/pipeline-review-0.1.md) and
  [structured evidence](../lab/reports/pipeline-review-0.1.json) — normalized
  review of five frozen samples, eight ranked rationalizations and explicit metric
  limits. Evidence/status only; no Knowledge Gap, implementation or publication.
- [verify:article Contract Spike 0.1](../lab/reports/verify-article-contract-spike.md)
  and [structured result](../lab/reports/verify-article-contract-spike.json) —
  27 common and four conditional read-only checks, seven negative classes and one
  detected PHP Arrays post-promotion CONTENT-lineage mismatch. No operator CLI.
- [CONTENT Lineage Contract Spike 0.1](../lab/reports/content-lineage-contract-spike.md),
  [structured result](../lab/reports/content-lineage-contract-spike.json) and
  [PHP Arrays backfill](../lab/reports/tablice-w-php-content-lineage.json) — strict
  deterministic replay closes the detected mismatch without changing CONTENT or
  historical evidence. The later plan 018 separately authorized CLI integration;
  durable lineage write policy remains a future decision.
- [Operator command reference](../commands.md) — production read-only
  `verify:article` usage, JSON mode and exit codes. The implemented verifier checks
  all five known article lifecycles without invoking agents or writing artifacts.
- [Knowledge Gap 0.1 report](../lab/reports/knowledge-gap-0.1.md) and
  [structured diagnosis](../lab/knowledge-gaps/knowledge-gap-0.1.json) — status-aware
  PUBLIC/PENDING/SOURCE snapshot, qualitative TOP 10, acquisition origins and three
  hypothetical prerequisite paths. LAB only; no article or publication action.
- [Knowledge Gap 0.2 ablation report](../lab/reports/knowledge-gap-0.2.md),
  [blind Run A](../lab/knowledge-gaps/knowledge-gap-0.2-run-a.json) and
  [Strategic Memory Run B](../lab/knowledge-gaps/knowledge-gap-0.2-run-b.json) —
  frozen blind discovery followed by a controlled strategy pass. Nine of ten gaps
  overlap; strategy helps sequencing but introduces measurable anchoring.
- [JavaScript B3 publication checkpoint](plans/completed/021-javascript-b3-publication-checkpoint.md)
  — three separately approved schema-v3 candidates promoted to CONTENT with exact
  audits and append-only navigation lineage; Git/Cloudflare production verified.
- [Architecture Decision Records](adr/README.md) — accepted architectural
  decisions and their consequences.
- [Roadmap](roadmap/ROADMAP.md) — committed work organized as DONE, NOW, NEXT, and
  LATER.
- [Futureboard](futureboard/README.md) — hypotheses and ideas that are not project
  requirements until accepted.
- [Changelog](changelog/CHANGELOG.md) — meaningful user-facing, architectural, and
  documentation changes.
- [Execution Plans](plans/) — active and completed plans for bounded milestones.
- [LAB](../lab/README.md) — experimental editorial workspace; its contents are not
  published automatically.
- [AGENTS.md](../AGENTS.md) — repository working rules for Codex and other coding
  agents, distinct from Redactoria runtime agents.

Start with STATUS for a session handoff and this index before any significant architectural change.
