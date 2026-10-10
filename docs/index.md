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
  separate human approval and deterministic exact promotion to CONTENT; plan 013
  tracks Git/Cloudflare closeout. STOP before rank #2.
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
