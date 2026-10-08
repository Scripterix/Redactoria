# Cartographer 0.1

The first Redactoria runtime agent-module. It maps existing knowledge and proposes
editorial opportunities; it does not write articles or execute its proposals.

- Responsibility: domains, hierarchy, clusters, grounded gaps, candidates, uncertainty.
- Input: schema-1 inventory and explicit limits (`contract.ts`).
- Output: validated `CartographerResult`, schema version 1 (`contract.ts`).
- Focused branch: exactly two complete articles, MERGE-only analysis and grounded
  outline (`focused-merge.ts`), with JSON-derived report and proposed-only decision
  (`focused-merge-report.ts`). No repeated full-corpus analysis or article writing.
- Policies: read inventory/selected SOURCE; analysis and LAB output only (`policies.ts`).
- Prompt: stable role and evidence instructions (`prompt.md`); context supplied by code.
- Tools: one injected `LanguageModel` and bounded `SourceReader`; no publication,
  Git, source writes, content writes, network browsing, or other agent invocation.
- Validation: shape, references, hierarchy, actions, targets, confidence and exact
  source evidence (`engine/validation/cartographer.ts`).
- Tests: fake model and deterministic boundaries under `__tests__/`.

`agent.ts` owns the two-pass workflow; `focused-merge.ts` owns the selected-pair branch.
Neither imports a provider or filesystem
writer. Shared mechanisms are outside `agents/`. The manual CLI writes to LAB only
after both analysis validation and filesystem destination checks succeed.

See the [full contract and CLI procedure](../../../docs/architecture/cartographer.md)
and [ADR 0003](../../../docs/adr/0003-runtime-agent-contract.md).
