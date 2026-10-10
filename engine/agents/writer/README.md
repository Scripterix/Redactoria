# Writer 0.1

Independent runtime agent: approved editorial decision + accepted Research Packet +
runtime evidence + one or two source bodies + Cartographer outline → one validated
DRAFT → STOP.

Input/output schemas: contract.ts. Policies: policies.ts. Stable prompt: prompt.md.
Validation verifies approvals/hashes/provenance/targets, evidence IDs, supplied PHP
scope and coverage; it does not prove semantic truth. Shared mechanisms live in core.
The module has only a LanguageModel port; no filesystem, shell, research or agents.
The manual CLI saves structured article.json and its exact Markdown projection only
under LAB/drafts. Request/response hashes expose recorded import vs live inference.
New snippets require separate trusted execution, not a fabricated runtime claim.
The B2 single-source variant additionally records 2–4 interaction opportunities as
unimplemented metadata; Writer does not build an Interaction Layer.

