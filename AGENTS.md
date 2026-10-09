# Redactoria repository rules

## Mission

Redactoria is an experimental multi-site editorial and knowledge engine.

Current implementation: **Redactoria EDU / Astro pilot**.

Optimize work for, in order:

1. correctness,
2. traceability,
3. maintainability,
4. testability,
5. information value.

Do not optimize for the maximum number of generated articles. A valid editorial
result can be that no change is worth publishing.

## Required project reading

Before a significant architectural change, read:

- `docs/index.md`
- `docs/architecture/overview.md`
- `docs/adr/`
- `docs/roadmap/ROADMAP.md`

When working on an experimental idea, also read `docs/futureboard/`. Futureboard is
not a set of requirements.

For bounded milestone work, create or update an execution plan under
`docs/plans/active/`, then move it to `docs/plans/completed/` with a recorded result.

## System boundaries

The invariant is:

```text
SOURCE != LAB != ENGINE != CONTENT != WEBSITE
```

- **SOURCE** — read-only external corpus. Never modify it.
- **LAB** — experimental work: inventory, research, drafts, decisions, and reports.
  LAB content is not published automatically.
- **ENGINE** — future automation and orchestration logic.
- **CONTENT** — reviewed material accepted for the site.
- **WEBSITE** — Astro publication layer.

Do not cross these boundaries without an explicit architectural decision. Never
move a draft from LAB to CONTENT merely because an automated process produced it.

## Coding-agent scope discipline

This `AGENTS.md` defines how Codex and other coding agents work on the repository.
It does not define or implement Redactoria runtime agents.
It is the sole main instruction file for coding agents; the project does not use
`CLAUDE.md`.

The coding agent must:

- implement only the active milestone,
- keep changes small and verifiable,
- preserve source provenance and Git history,
- use `null`, `unknown`, or `needs-review` instead of inventing missing data,
- document major architectural decisions in `docs/adr/`,
- update Project Brain documents when their recorded state changes,
- run `npm run test`, `npm run check`, and `npm run build` after implementation.

The coding agent must not:

- implement future milestones merely because they are documented,
- treat Futureboard ideas as accepted work,
- add a backend, database, or message queue without an accepted need,
- turn Astro into an SPA,
- build a multi-agent system before its milestone,
- perform automatic merge or publication.

Prefer one verified increment over many speculative changes.

## Runtime agent-modules

Redactoria runtime agents live under:

```text
engine/agents/<agent-name>/
```

Cartographer 0.1 is implemented as the first module, invoked manually. Its contract
and boundaries are described in `docs/architecture/cartographer.md` and ADR 0003.
Researcher 0.1 is the second independent module, documented in
`docs/architecture/researcher.md`. It reads a human-approved scope and produces a
cited Research Packet in LAB. Other runtime agents, Dispatcher, scheduling, and
the full Engine remain future work.

Each directory represents one independent agent-module, not a category of helper
functions. An agent-module must define:

- responsibility,
- input contract,
- output contract,
- policies,
- allowed tools,
- validation,
- tests.

An agent is not merely a prompt. Shared services, repositories, adapters, policies,
and orchestration belong outside `engine/agents/`.

Runtime agents must not invoke arbitrary other agents. The future Engine/Dispatcher
owns orchestration. The intended default is:

```text
one scheduled run = one job = one agent branch

WAKE
  ↓
READ STATE
  ↓
SELECT JOB
  ↓
RUN AGENT
  ↓
VALIDATE
  ↓
SAVE
  ↓
STOP
```

No runtime agent or Engine structure should be created before its accepted
milestone.

## Testing rules

- Tests are part of the architecture, not a final publishing step.
- Test project-owned behavior, contracts, policies, preprocessing, postprocessing,
  state transitions, and failure handling.
- Do not test Astro itself.
- Prefer pure functions with explicit inputs and expected outputs.
- Deterministic boundaries around future non-deterministic AI behavior must be
  schema- and policy-tested.
- Legacy ingestion must satisfy: same source → same inventory.
- Do not add browser E2E tooling until a real browser interaction requires it.

Required quality sequence:

```text
implementation
      ↓
npm run test
      ↓
npm run check
      ↓
npm run build
      ↓
documentation consistency
```

Do not report a milestone complete if a required quality command fails without a
clear explanation.

## Astro development

When starting the development server, use background mode:

```text
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Consult the current official Astro documentation before related framework changes:

- <https://docs.astro.build/en/guides/routing/>
- <https://docs.astro.build/en/basics/astro-components/>
- <https://docs.astro.build/en/guides/framework-components/>
- <https://docs.astro.build/en/guides/content-collections/>
- <https://docs.astro.build/en/guides/styling/>
- <https://docs.astro.build/en/guides/testing/>
