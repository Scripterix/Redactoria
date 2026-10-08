# Execution Plan 001: Project Brain and testing foundation

## Goal

Create durable project memory, repository-level rules for coding agents, and a
minimal testing foundation before connecting the legacy source corpus.

## Context

Milestone 0 established the Redactoria EDU Astro pilot, Content Collections,
static routes, LAB, and ADR 0001–0002. The repository needed a single knowledge
entry point and repeatable quality commands before deterministic ingestion begins.

## Scope

- Add the Project Brain index, architecture overview, ADR index, roadmap,
  Futureboard, and changelog.
- Replace the starter `AGENTS.md` with repository-specific working rules while
  preserving the Astro development guidance.
- Add Vitest and `astro check` support.
- Extract and test only meaningful pure content-selection logic already used by
  the site.
- Reserve a fixtures location for the next milestone without copying production
  legacy posts.

Out of scope: source connection, Inventory Scanner, corpus report, Cartographer,
Engine, runtime agents, Dispatcher, scheduled tasks, and React Islands.

## Files affected

- `AGENTS.md`
- `package.json` and `package-lock.json`
- `vitest.config.ts`
- `src/lib/content.ts`
- `tests/`
- `docs/`

## Implementation steps

1. Created the Project Brain documentation structure.
2. Defined repository-level coding-agent rules.
3. Installed the minimal test and type-check dependencies.
4. Extracted pure functions from existing content-query behavior.
5. Added focused unit tests and documented the future fixture contract.
6. Ran `npm run test`, `npm run check`, and `npm run build`.
7. Verified documentation status and internal references.

## Tests

- Published content is selected while draft content is excluded.
- Articles are sorted newest-first without mutating the input.
- Articles are selected by topic ID.
- Astro diagnostics pass.
- Static production build passes.

## Risks

- Refactoring content queries only to make them testable could introduce needless
  complexity. The resulting helpers remain small and are used directly by the site.
- Planned architecture could be mistaken for implemented behavior. Project Brain
  labels current, next, planned, and future elements explicitly.
- Future fixture names could be mistaken for finished scanner tests. The fixture
  README states that implementation belongs to the next milestone.

## Result

Completed on 2026-10-08.

- Project Brain and repository working rules are in place.
- Vitest 5.0.3 runs three focused unit tests; all pass.
- `astro check` reports 0 errors, 0 warnings, and 0 hints.
- `astro build` generates all six static routes successfully.
- Existing ADR 0001 and ADR 0002 remain unchanged.
- No legacy source connection, scanner, Engine, runtime agent, or React Island was
  implemented.
