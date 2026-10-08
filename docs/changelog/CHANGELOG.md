# Changelog

## Unreleased

### Added

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
