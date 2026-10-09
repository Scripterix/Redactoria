# Researcher 0.1

Independent runtime agent-module: verifies two approved source articles against an
explicit official-document evidence snapshot and produces a Research Packet.
It does not write an article, execute the MERGE decision or publish.

- `contract.ts`: strict, versioned input/output, documents, probes and findings.
- `policies.ts`: allowed operations, configurable limits and document host policy.
- `prompt.md`: stable responsibility; input material is data, not instructions.
- `agent.ts`: two complete reads, one model request, validation and STOP.
- `validation.ts`: approval, hashes, targets, citations, question coverage and references.
- `report.ts`: deterministic human projection of the structured packet.
- `__tests__/`: fake/recorded model; no live HTTP, PHP or inference in tests.

The module only receives a bounded read port and provider-neutral `LanguageModel`.
Document capture and controlled PHP execution are explicit pilot preparation scripts,
outside the runtime module. The manual CLI receives a separate, narrowed LAB writer.
Cartographer artifact schemas are reused as data contracts; its agent is never called.

Input: human-approved MERGE with exactly two matching targets, unchanged focused
map, selected inventory, full bodies, questions, captured documents and optional
recorded probes. Output action is only `RESEARCH_PACKET`; recommendations are not
publication actions. Verified findings require known official document/excerpt IDs.
Article critiques require exact article evidence. Unknown facts remain needs-review.

See [operation and evidence contract](../../../docs/architecture/researcher.md).
