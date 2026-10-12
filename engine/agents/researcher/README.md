# Researcher 0.1

Independent runtime agent-module: verifies one or two approved source articles against an
explicit, authority-classified evidence snapshot and produces a Research Packet.
It does not write an article, execute the MERGE decision or publish.

- `contract.ts`: strict, versioned input/output, documents, probes and findings.
- `policies.ts`: allowed operations, configurable limits and document host policy.
- `prompt.md`: stable responsibility; input material is data, not instructions.
- `agent.ts`: all approved complete reads, one model request, validation and STOP.
- `validation.ts`: approval, hashes, targets, citations, question coverage and references.
- `report.ts`: deterministic human projection of the structured packet.
- `__tests__/`: fake/recorded model; no live HTTP, PHP or inference in tests.

The module only receives a bounded read port and provider-neutral `LanguageModel`.
Document capture and controlled PHP execution are explicit pilot preparation scripts,
outside the runtime module. The manual CLI receives a separate, narrowed LAB writer.
Cartographer artifact schemas are reused as data contracts; its agent is never called.

Input: either a human-approved MERGE with exactly two matching targets or the bounded
B2 single-source decision plus its explicit human task authorization and validated
research acceptance. In both cases the unchanged focused map, selected inventory,
full bodies, questions, captured documents and optional recorded probes are hash-bound.
Output action is only `RESEARCH_PACKET`; recommendations are not publication actions.
New schema-v3 evidence bundles use the seven-level Source Authority Ladder: standards,
official project/runtime docs, MDN, implementation/platform docs, compatibility
data, educational sources and real-world problem reports. Tier, class and evidence
role are host-validated. Stack Overflow is supplementary problem evidence only and
cannot independently verify a technical claim. Historical schema-v1/v2 bundles and
packets remain valid.

Verified findings require known document/excerpt IDs. Article critiques
require exact article evidence. Unknown facts remain needs-review.

See [operation and evidence contract](../../../docs/architecture/researcher.md).
