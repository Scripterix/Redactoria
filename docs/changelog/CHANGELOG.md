# Changelog

## Unreleased

### Added

- Research Packet approval gate: actual PHP 8.4.26 / 8.5.11 portable CLI verification,
  12 fixed probes and 60 assertions per version, archive/executable/code provenance,
  expected diagnostics, JSON evidence and derived runtime report in LAB.
- Eight offline runtime-evidence regression tests; no external runtime/API in tests
  and no general CI system or global PHP installation.
- Separate human-approved research decision with packet/evidence hashes and
  `nextStep: writer`; no automatic start of Writer/Critic.
- Scoped LF checkout attributes for LAB JSON/Markdown and controlled PHP probes,
  preserving byte-hash provenance across Windows checkouts.
- Mandatory PHP 8.5 null-offset deprecation addendum grounded in actual probes and
  official migration documentation; initial 8.5 58/60 failure retained for audit.
- Researcher 0.1 runtime module: strict approved-only input, versioned Research Packet,
  prompt/policies, grounded documentation/article evidence, confidence and references.
- Manual Researcher CLI, exact request hashes and explicit recorded-session import;
  narrowed LAB/research writer and deterministic JSON-derived report.
- PHP arrays research: 34 official documents, 13 questions, 9 controlled local PHP
  8.2.4 probes, 25 facts, 4 corrections, 3 security notes and 8 code findings.
- Two explicit needs-review items: target runtime 8.4/8.5 execution and completeness
  of final standalone examples/form skeleton. No article or application handler.
- Researcher fake/recorded-model contract, evidence, replay and filesystem tests;
  explicit bounded pilot capture scripts, separate from model interpretation.
- Redactoria EDU static Astro pilot.
- Validated `articles` and `topics` Content Collections.
- Static article, topic, homepage, and project routes.
- Separate LAB workspace.
- Native pilot article used to verify the publication path.
- Project Brain with architecture, roadmap, Futureboard, changelog, and execution plans.
- Repository-level rules distinguishing coding agents from future runtime agents.
- Vitest unit-test foundation and Astro/TypeScript diagnostics.
- Read-only legacy corpus scanner with stable source identity and original-byte SHA-256.
- Versioned inventory and deterministic corpus data-quality summary in LAB.
- Seven minimal legacy fixtures and parser, summary, integration, CLI, and immutability tests.
- Cartographer 0.1 runtime agent-module with structured input/output, prompt, policies,
  evidence validation, configurable read budgets, and fake-model tests.
- Provider-neutral LanguageModel and explicit, hash-bound session-analysis import.
- Manual Cartographer CLI with request preparation, JSON-first LAB results and human report.
- First real 83-article cartography: 8 selected reads, 4 root domains / 20 total,
  23 clusters, 6 proposed gaps, and 16 editorial proposals.
- Focused Cartographer CLI (`--focus` twice / `--task merge`) with exactly two full
  source reads, strict MERGE schema, grounded evidence and ordered article outline.
- Focused recorded-model request preparation/import without external API calls.
- PHP arrays merge plan, JSON-derived human report and hash-bound decision with
  `status: proposed`; 15 proposed sections, no final article or approval.
- Focused tests for selection, actions, confidence, evidence, outline, full-read
  limits, replay, proposed decisions and SOURCE/CONTENT filesystem boundaries.
- `docs/STATUS.md`: quick milestone state, approved PHP MERGE, important file map
  and explicitly future research/writing/publication pipeline.

### Changed

- Target-runtime research question resolved by actual 8.4/8.5 execution; original
  Research Packet and its 8.2.4 evidence retained byte-identically. Future final
  Writer examples/form handler still require their own output validation.
- Shared recorded model port accepts a minimal `research` phase without providers,
  API keys or inference HTTP layer; existing Cartographer replay stays compatible.
- LAB writer permits research artifacts; Researcher capability restricts writes to
  its own research subtree. Approved MERGE and Cartographer artifacts are preserved.
- Replaced the Astro starter presentation with the Redactoria EDU interface.
- Renamed the package from the temporary `asto` name to `redactoria`.
- Made `AGENTS.md` the sole main instruction file for coding agents.
- Extended the LAB writer to accept proposed focused decisions alongside maps/reports,
  preserving canonical-path validation and SOURCE/CONTENT protection.
- Human-approved PHP Arrays MERGE: `status: approved`, `approvedBy: human`, approval
  timestamp and `nextStep: research`, with original targets/evidence/confidence/provenance retained.
- Roadmap marks the focused experiment DONE and Researcher 0.1 NEXT, not started.

### Fixed

- Cartographer LAB writes cannot overwrite an existing approved human decision;
  the entire batch is rejected before writes, with a regression test.

### Architecture

- Separated Website, LAB, future Engine, content, and source responsibilities.
- Established static generation as the default and React as Islands-only.
- Established Git history and human review as publication safeguards.
- Established tests as a required architectural quality gate.
- Formalized runtime agent tool/policy boundaries and validated model outputs in ADR 0003.

### Documentation

- Approval gate plan 006 and Project Brain: Milestone 3 DONE, packet APPROVED,
  PHP 8.4/8.5 PASS, Milestone 4 Writer/Critic NEXT and not started.
- Approval quality gate: 123 passing tests, clean 61-file diagnostics, six-page
  build and all 107 protected file hashes unchanged, including original research.
- Researcher operation/evidence documentation, pilot audit guide, execution plan 005,
  updated Project Brain and ADR 0003 evidence clarification (no duplicate ADR).
- Milestone 3 quality gate: 115 passing tests, clean 58-file diagnostics, six-page
  build, validated Researcher pilot, identical replay and 100 protected file hashes.
- Added ADR 0001 for system boundaries and future runtime agent-modules.
- Added ADR 0002 for local validated content collections.
- Replaced the starter README with project-specific guidance.
- Added the Project Brain index and milestone execution record.
- Documented the inventory contract, source checkout, CLI, and reproducibility evidence.
- Completed Milestone 1 execution plan with 83-source corpus results, 30 passing
  tests, successful check/build, artifact hashes, and verified source preservation.
- Added Cartographer operation/contract documentation and recorded model provenance,
  exact requests, limitations, and proposed TOP 5 next actions.
- Documented the bounded focused-MERGE branch; existing ADR 0003 remains sufficient.
- Completed focused execution plan 004: 83 passing tests, clean diagnostics,
  successful six-page build, stable replay and verified SOURCE/CONTENT/previous LAB hashes.
- Session closeout records human approval without changing ADRs, executing MERGE,
  creating an article or starting Researcher/Writer.
- Closeout quality gate: 84 passing tests, 0 diagnostics, six-page static build
  and read-only verification of the approved, provenance-preserving PHP MERGE.
