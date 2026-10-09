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

## NOW

- Milestone 3 — Researcher 0.1 DONE; Research Packet APPROVED; PHP 8.4/8.5 PASS.
- PHP MERGE remains approved; no source merge, final article or publication performed.
- Approval gate closed; no further runtime agent started.

## NEXT

- Milestone 4 — Writer/Critic, not started; wait for an explicit start instruction.
- Use the approved packet plus mandatory runtime addendum, including PHP 8.5 null
  offset caution. Validate future final standalone examples and form skeleton when
  they exist; runtime gate tests controlled examples, not a yet-unwritten article.

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
