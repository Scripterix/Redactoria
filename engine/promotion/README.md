# Promotion Gate — manual, deterministic, local only

This is an Engine tool, **not** Publisher or a runtime agent. It has no model port,
network calls, git commands, scheduling or agent invocation. Website rendering does
not import LAB or Engine.

```sh
npm run promote -- --candidate lab/candidates/<topic>/article.json --decision lab/decisions/<approval>.json
```

The separate human decision must explicitly approve `local-publication-test`, bind
the candidate JSON bytes, exact Markdown body and Critic review by SHA-256, and
specify schema-valid CONTENT metadata/destination. `remotePublicationApproved`
must be false. The immutable M5 candidate remains pending as a historical artifact;
the new decision is the authority, not a rewrite of that artifact.

Before any write, the gate revalidates the candidate contract, exact current
draft/review/revision, Critic PASS (including actual code execution evidence),
human-approved MERGE and Research packet/addenda, all approved artifact hashes,
the shared Content Collection schema, existing published topic, safe destination
and slug collision across all existing article statuses. Missing/changed evidence,
invalid flags, symlinks/junctions and existing destinations/audits stop the run.

The only transformation is YAML front matter. The Markdown body is byte-identical,
including historical draft notes. A presentation notice explains those notes in
the local preview; promotion never edits prose or regenerates examples.

Writes are exclusive: one `content/articles/<slug>.md` plus JSON/Markdown audit
under `lab/reports/<slug>-promotion`. All validation completes first. Write failure
rolls back only files exclusively created by that operation. Repeated promotion
stops rather than replacing content or audit. The structured record preserves both
source identities, research/draft/review/revision provenance, approval references
and hashes. The unchanged Content Collection's singular `origin.source_id` records
the primary source; the complete two-source lineage remains in the LAB audit.

`status: published` in CONTENT means visible to the local Astro collection; it does
not authorize commit/push or public deployment. Stop for human visual review.

Offline tests: `tests/integration/promotion.test.ts`. Run `npm run test`,
`npm run check`, `npm run build`; then `npm run dev -- --background`.
Manage the server with `npm run astro -- dev status|logs|stop`.

ADR impact: implements the explicit, reviewed boundary crossing already required
by ADR 0001 and the schema of ADR 0002. Runtime agents retain ADR 0003's LAB-only
policies. No new runtime-agent or orchestration decision and no new ADR.
