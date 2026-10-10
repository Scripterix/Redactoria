# Redactoria roadmap

The roadmap contains work accepted for delivery. Exploratory ideas remain in the
[Futureboard](../futureboard/README.md) until they are explicitly promoted.

## DONE

- Astro 7 static publishing foundation.
- Shared `BaseLayout`, Header, Footer, and per-page SEO metadata.
- Validated `articles` and `topics` Content Collections.
- Homepage, article, topic, and project routes.
- Content components and one native test article.
- Separate LAB workspace with explicit publication boundaries.
- ADR 0001: Website, LAB, and future Engine separation.
- ADR 0002: local validated content model.
- Project Brain with architecture, roadmap, Futureboard, changelog, and execution plans.
- Repository-level `AGENTS.md` working rules.
- Vitest and Astro/TypeScript checking foundation.
- Read-only local connection to `temp-ogwo/posts`.
- Deterministic Inventory Scanner with parser and CLI tests.
- Reproducible `inventory.json` covering the full source corpus.
- Deterministic `corpus-summary.md` and verified source immutability.
- Scanner fixtures for BOM, Unicode, missing metadata, malformed front matter, and
  encoded slugs.
- Milestone 1 accepted; read-only legacy inventory is the Cartographer input.
- Cartographer 0.1: first runtime agent-module with formal schemas and policies.
- Two-pass analysis, bounded selective reads, exact evidence checks, and manual CLI.
- Explicitly labelled session-model import and audited first 83-article cartography.
- Structured knowledge map, editorial candidates, and human report with TOP 5 actions.
- ADR 0003: runtime contract, provider-neutral model port, validation and tool boundaries.
- Focused Cartographer MERGE branch: exactly two full reads, validated comparison
  and outline, recorded-session replay, and proposed-only decision.
- PHP arrays pair analyzed without corpus re-analysis: merge plan and 15-section
  outline in LAB; SOURCE and CONTENT unchanged.
- Milestone 2 completed and accepted at session closeout.
- Focused PHP experiment completed; human MERGE approval recorded with confidence
  0.96, preserved evidence/source hashes and `nextStep: research`.
- Session status/file map in `docs/STATUS.md`; plan 004 remains completed.
- Milestone 3 — Researcher 0.1: independent agent, approved-only scope, strict
  evidence contracts, manual CLI and narrowed research-only LAB writer.
- PHP Research Packet: 34 primary documents, two full source reads, 9 controlled
  PHP 8.2.4 probes, 25 facts, 4 corrections and 2 explicitly unresolved questions.
- Hash-bound recorded-session research import/replay; no production LLM API.
- Research Packet approved by human, with a separate hash-bound decision and
  `nextStep: writer`; original evidence/provenance and packet remain unchanged.
- Actual PHP 8.4.26 and 8.5.11 approval verification: PASS, 12 controlled probes and
  60 assertions each. Official portable archives verified by published SHA-256.
- Required PHP 8.5 null-offset deprecation addendum; initial 58/60 result and official
  migration evidence preserved separately. Target-runtime question resolved.
- Milestone 4 — Writer 0.1 / Critic 0.1: separate runtime modules, strict approvals,
  exact draft/evidence/provenance validation, manual CLIs and narrow LAB writers.
- One PHP arrays draft: 16 sections, 2506 prose words, all 22 required areas.
- All 17 new standalone examples executed on PHP 8.4.26 and 8.5.11: 34/34 PASS.
- One Critic review: REVISE, one required precision change and two optional clarity
  improvements saved without rewriting or starting another agent.
- Human-authorized targeted correction: reduce wording scoped to the shown sum 15,
  fn explanation and removal-state labels applied as prose only; original provenance retained.
- One new full Critic second pass: PASS, no required changes. All 17 examples and
  their actual PHP captures unchanged; no new Writer generation or PHP cases.
- Milestone 5 — First Publication Candidate: exact PASS-reviewed Markdown and strict
  hash-bound metadata/schema in LAB. The historical artifact remains unchanged.
- Human-approved local publication through a deterministic Promotion Gate CLI:
  candidate/review hashes, MERGE/Research approval, shared schema, safe writes and audit.
- Website refinement: expanded Start/About, five-column responsive footer, homepage
  three-column placeholder section, contextual links, long-article TOC/code/tables.
- Local build: 10 static pages, 2 articles and 2 topics; 40 responsive route checks.
- Website micro-increment: deterministic build-time article reading estimate with
  tested prose/code treatment; current CONTENT bylines corrected to `Scripterix`.
- Plan 009 append: official `@astrojs/sitemap` XML for all public routes, static HTML
  map, no-JS back-to-top and per-block progressive `Copy code` with no framework.
- Search 0.1: official pinned Pagefind CLI after Astro build, nine public indexed
  pages, lightweight lazy UI; approved public article note cleanup.
- Public checkpoint `56cc7a7`: full current gate, push master, Cloudflare success
  and direct public search/route/article-utility verification.

## NOW

- Milestone 4 Writer/Critic DONE; final Critic verdict PASS after an authorized correction.
- Milestone 5 Publication Candidate DONE; original artifact in LAB is preserved.
- Separate human approval: local-publication-test; exact PHP Arrays promoted to CONTENT.
- PUBLIC CHECKPOINT VERIFIED — local gate/preview PASS, commit/push and Cloudflare
  public verification complete. Plan 010 completed; STOP before B1.
- Milestone 3 DONE; Research Packet APPROVED; research and draft PHP verification PASS.
- PHP MERGE remains approved; SOURCE unchanged, CONTENT modified only in authorized local scope.
- One original Writer run + two separately authorized Critic passes. No automatic loop.
- Plan 009 website utilities DONE; icons and educational media remain exploratory Futureboard items.

## NEXT

- Separate B1: select/rank ten candidates using the new educational/testability/cost
  criteria. Historical Cartographer TOP 10 is not this ranking; no article generation.
- Separate B2: rank #1 only, then assess the pipeline before subsequent batches.

## LATER

- First article modernization pipeline.
- React Knowledge Navigator, when the content base justifies it.
- Single-Step Agent Loop.
- Dispatcher and job state.
- Further runtime agent-modules.
- Publisher Agent, after writing/critique and a separate publication decision.
- Production LLM API after the explicit session-import pilot.
- Domain Packs.
- Multi-site Engine.
- PostgreSQL, only after a demonstrated persistence need.
- Scheduled tasks, only after the manual and single-step workflows are proven.
