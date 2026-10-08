# Execution Plan 003: Cartographer 0.1

## Goal

Implement the first runtime agent-module and create a grounded knowledge map,
gaps, and editorial proposals for the accepted 83-article inventory.

## Context

Milestone 1 is accepted. SOURCE and CONTENT remain read-only. The user chose an
analysis produced in this Codex session and explicitly imported by the manual CLI,
not a hidden API call or a mock labelled as live inference.

## Scope

One agent-module, input/output validation, evidence checks, selective reading,
configurable budgets, a provider-neutral LanguageModel boundary, an imported-session
adapter, manual preparation/import CLI, JSON-first LAB artifacts, and tests.
No Dispatcher, other agents, scheduling, publication, or article rewriting.

## Files affected

Created:

- `engine/agents/cartographer/{agent.ts,contract.ts,policies.ts,prompt.md,report.ts,README.md}`
- `engine/agents/cartographer/__tests__/{helpers.ts,contract.test.ts,agent.test.ts,io.test.ts}`
- `engine/core/{language-model.ts,serialization.ts,source-reader.ts,lab-writer.ts}`
- `engine/adapters/recorded-language-model.ts`, `engine/validation/cartographer.ts`,
  and `engine/orchestration/README.md`
- `scripts/cartographer.ts`
- `docs/architecture/cartographer.md`, `docs/adr/0003-runtime-agent-contract.md`,
  and this completed plan
- `lab/cartography/{knowledge-map.json,editorial-candidates.json,session-responses.json}`
- `lab/cartography/requests/{pass-a.json,pass-b.json}`
- `lab/reports/cartographer-001.md`

Modified:

- `package.json`, `package-lock.json`, `vitest.config.ts`, `AGENTS.md`, `README.md`
- `lab/README.md`
- `docs/index.md`, `docs/architecture/overview.md`, `docs/roadmap/ROADMAP.md`,
  `docs/changelog/CHANGELOG.md`, `docs/adr/README.md`, `docs/plans/active/README.md`

## Implementation

1. Verify the existing test/check/build baseline and read accepted architecture.
2. Define schemas, policy limits, source-grounded evidence, and minimal model port.
3. Implement two passes and bounded, hash-checked source reads.
4. Implement safe LAB-only writes and stable JSON/report postprocessing.
5. Add fake-model tests for contract, evidence, policies, limits, and I/O boundaries.
6. Prepare Pass A; analyze real inventory in this session and record provenance.
7. Prepare Pass B; read only selected texts and record the refined analysis.
8. Execute the CLI against those recorded responses, verify all quality gates and
   SOURCE/CONTENT hashes, update Project Brain, and complete this plan.

## Tests

Reject invalid actions, confidence, absent/forged evidence, unknown references,
cycles, and invalid targets. Verify fake-model integration, read limits, stale
source/request detection, stable artifacts, path/link guards, and unchanged inputs.

## Risks

Metadata cannot establish complete curricular coverage or technical obsolescence.
Inventory and source text are untrusted data, not instructions. Imported analysis
must be bound to exact request contexts and clearly distinguished from live API
inference. Confidence is declarative, not a calibrated probability.

## Result

Completed on 2026-10-08. Ready for Milestone 2 acceptance. No next milestone has
been started.

### Contract, adapter and policies

Cartographer is one runtime agent-module with explicit Zod input/output schemas,
separate prompt/policies/tests, hierarchical knowledge domains, and grounded
editorial proposals. Its only injected capabilities are LanguageModel and bounded
SourceReader. Validation rejects forbidden actions, absent/forged evidence,
confidence outside [0,1], unknown references, domain cycles, invalid targets, and
oversized deep-read plans. The writer resolves filesystem links and confines
artifacts to LAB; atomic rename prevents modifying hard-linked inputs.

The first real-corpus analysis was authored in this Codex session as requested.
`RecordedLanguageModel` imports its structured responses; it is not live API
inference and does not call another coding/runtime agent. Both requests and
responses are retained. Tests use a fake model only.

Request hashes:

```text
Pass A: 6a4f78b8334e6e161ed10fc6c7cfc4d10be386691f24a0409aa8fc7f10decf9d
Pass B: b2e7eb337ca2b724316ca59e2af64fc2ce2d6e445a68af4ed948f4f45feb61b4
```

### Real corpus result

- Source revision: `a3d96180ebe619dd01cb77479bee095c3ee9a58e`.
- Metadata analyzed: **83 articles** (82 parse OK, 1 metadata review, 0 parse errors).
- Mapped: **83**; unmapped: **0**. Domain membership may overlap.
- Deep reads: **8/8**, totaling **46,663 UTF-16 code units**; no body was truncated.
- Selected source IDs: `1324`, `1356`, `path:143-post-4-angular-podstawy-praktyka.md`,
  `981`, `281`, `2070`, `1770`, `1799`.
- Domains: **4 root / 20 total**. Roots: programming/developer workshop,
  WWW construction/design/visibility, AI applications, and project diary/IT development.
- Clusters: **23**; reasoned gap proposals: **6**; editorial candidates: **16**.
- Gaps concern TypeScript prerequisites, a JS async/API bridge, a working Signals
  example, safer PHP exercises, custom React hooks, and testable calculator exercises.
  Title-only gaps remain hypotheses, not claims of proven corpus-wide absence.

TOP 5 proposed actions (not executed):

1. MERGE the complementary PHP arrays parts (`1324`, `1356`) into a coherent module
   or clearly linked lessons, subject to code and editorial review.
2. REVIEW the Signals outline (`1770`) before treating it as practical coverage.
3. REVIEW Angular introductions, missing metadata, roles, and version context
   (`path:143-post-4-angular-podstawy-praktyka.md`, `981`).
4. UPDATE the React Hooks article (`1799`) for scope and copying residue.
5. NEW_CONTENT: a small TypeScript-before-Angular module, after checking reuse options.

### Quality gates and immutability

- Pre-flight: all three existing test/check/build commands passed.
- Final `npm run test`: **7 files / 67 passing tests** (30 existing + 37 new).
- Final `npm run check`: **43 files, 0 errors, 0 warnings, 0 hints**.
- Final `npm run build`: **6 static routes generated successfully**.
- Final `npm run cartographer`: **passed**, structured analysis validated before
  JSON and report writes.
- Repeated final replay: all three artifact SHA-256 hashes were identical.
- SOURCE mutation check: **83/83 original hashes unchanged; 0 additions/deletions**.
- CONTENT mutation check: **2/2 original hashes unchanged; 0 additions/deletions**.
- The external source repository worktree remained clean. Inventory and the
  Milestone 1 corpus summary were not changed.

Final artifact SHA-256:

```text
knowledge-map.json
AC5EA4586E93039C06C821CCBBF065A58705E9283263B80C5562B18FCC172126

editorial-candidates.json
AA27896C97041D19D782342C3CF37817E7758202C82F20B2CCB839DDC9E6D774

cartographer-001.md
B1C03084F97040B85766132FE615668033C289D9790B37D1ED4FFF8F28A8553D
```

### ADR and handoff

ADR 0003 formalizes the provider-neutral model boundary, validated structured
outputs, evidence and capability rules introduced by this milestone, building on
ADR 0001 without rewriting it. Architecture status, roadmap, changelog, Project
Brain index, and CLI instructions are updated. Futureboard remains unchanged.

Next recommended step: review the TOP 5 and select a bounded Milestone 3. The PHP
arrays series is a concrete first EDU-content pilot candidate. No rewriting,
CONTENT edit, publishing, Git merge, commit/push, Dispatcher, job queue, scheduler,
or additional runtime agent was implemented or invoked.
