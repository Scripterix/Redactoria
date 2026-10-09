# Execution Plan 005: Researcher 0.1

## Goal

Implement one independent Researcher runtime agent and produce a cited Research
Packet for the two PHP arrays articles covered by the human-approved MERGE decision.
Do not write an article, execute MERGE, publish, or start another runtime agent.

## Scope and boundaries

SOURCE != LAB != ENGINE != CONTENT != WEBSITE. Read exactly the approved pair in
full; validate the decision and its linkage to focused Cartographer results before
model work. Shared I/O/model mechanisms stay outside agent directories. No provider
API, crawler platform, scheduler, Dispatcher, Writer, Critic or Publisher.

## Contract

Input: approved MERGE decision with two targets, focused map, selected inventory,
both full source bodies, explicit research questions and a separately verified
document evidence bundle. Output: versioned Research Packet with findings, article
evidence, official-document references, confidence, needs-review states, code review,
recommendations, source register, limitations and Writer handoff instructions.
Only a research-packet action is allowed; no publication or human approval action.

## Sources and evidence

Use current official php.net manual, support lifecycle and migration references.
Browse/read each cited page; record real URL, document title, retrieval date, bounded
excerpts and provenance/hash separately from the session model interpretation.
The model is not a PHP source. Quotes must match supplied evidence; every factual
finding needs an existing official source. Original-article corrections cite exact
selected-source fragments. Mark unconfirmed matters needs-review, never guess.

## Implementation

1. Read required Project Brain and pilot artifacts; snapshot SOURCE, CONTENT,
   approved decision and all existing Cartographer outputs.
2. Verify official sources and inspect available local PHP runtime. If code probes
   are useful, run only controlled, self-authored data-operation probes, not arbitrary
   imported article code; distinguish documented behavior from actual execution.
3. Add minimal Researcher module, strict schemas/policies/prompt/validation/tests;
   reuse the bounded source reader, stable serialization and recorded model port.
4. Add manual CLI with explicit decision input, research evidence/session import,
   request hash, validated JSON-first LAB output and derived Markdown.
5. Author/import the real session analysis from verified documentation and run
   the pilot. Preserve original approved decision and Cartographer artifacts.
6. Run quality gates and deterministic replay/immutability checks; update Project
   Brain, assess ADR need, move this plan to completed and stop for human review.

## Tests and validation

Approved-only decision, exactly two matching targets, source/body identity hashes,
strict shape/action, missing/forged evidence, unknown source/target references,
confidence bounds, explicit unresolved findings, non-orphan source register,
valid code evidence, stable serialization, fake/recorded model, replay hash binding,
SOURCE/CONTENT write rejection and LAB-only writer destinations.

## LAB artifacts

- `lab/research/php-arrays/research.json`: validated Research Packet.
- `lab/research/php-arrays/research.md`: human report and Writer handoff.
- Evidence, request and recorded-session response audit artifacts beside the packet.
- Optional controlled PHP probe fixture/results, with actual runtime recorded.

No duplicated report under lab/reports and no changes to existing Cartographer data.

## Quality gate and done criteria

`npm run test`, `npm run check`, `npm run build`, manual Researcher pilot and
deterministic replay must pass. All protected input hashes must match. Required
research questions and report sections must be covered or explicitly unresolved.
Documentation must distinguish DONE from unstarted Writer/Critic/publication work.
No commit or push is requested in this milestone.

## Result

Completed 2026-10-09. Researcher is implemented as the second independent runtime
agent-module. Exactly two approved sources (10,906 and 4,548 body characters) were
read in full. No other corpus bodies were analyzed.

Evidence: 34 official php.net documents captured by HTTPS GET with HTTP 200, exact
short anchors, hashes and retrieval timestamps; user notes excluded. Thirteen
questions cover all five focused Cartographer research findings. Nine controlled,
owned PHP data probes ran on local PHP 8.2.4, never SOURCE. Proposed editorial scope
is PHP 8.4–8.5; those runtimes were not installed or executed.

The validated packet has 25 facts, 4 corrections, 1 dated framing note, 3 ambiguities,
3 security notes, 8 code findings and 2 explicit needs-review items (target-runtime
execution and final standalone snippet/form completeness). Writer handoff contains
instructions only. No new article, source merge or publication.

Manual CLI uses RecordedLanguageModel with an explicitly labelled current-session
interpretation. Documentation evidence is separate from this response. No production
LLM API, provider adapters or keys. Shared model port adds only the research phase;
the Researcher module gets no write/shell/other-agent capabilities. CLI writes only
the research subtree of LAB after complete packet/reference validation.

Quality gate:

- `npm run test`: PASS, 115 tests / 9 files (31 new Researcher tests).
- `npm run check`: PASS, 58 files, 0 errors/warnings/hints.
- `npm run build`: PASS, 6 static pages.
- `npm run researcher -- --decision lab/decisions/php-arrays-merge-proposal.json`: PASS.
- Replay: identical JSON/Markdown bytes without external fetch or inference.
- Protected SHA-256 snapshot: all 100 files unchanged. SOURCE still 83 files and a
  clean checkout; CONTENT still 2 files. Approved decision and all previous
  inventory/Cartographer artifacts unchanged.

Audit hashes:

- Input: `514dc218b2f848833bd75aa7e191df50c368f6d659ee9e7f3bf1162f46ff0b75`.
- Request: `9fe6e26a5da722bccc0a74afc43ead40525932cb1342330deb19fde1f844fa64`.
- Packet: `3437fb991ebd1707c0ca04092a2143ade10704dd1168749eff694d3b4d0a3a42`.
- Report: `8e0f0d64eba3545d43762f9635e3ac570e228d843d67184ee4142518097bf5f6`.

Created: Researcher module (agent, contract, policies, prompt, validation, report,
README and tests), research-only writer, manual CLI, explicit pilot capture/probe
scripts, architecture guide and seven LAB packet/audit files.
Updated: package script, shared model/recorded adapter/LAB writer, AGENTS/README,
LAB guide and required Project Brain documents. Existing ADR 0003 was clarified for
independent evidence and execution-vs-document-review; no duplicate ADR was added.

Next: human review of the Research Packet and explicit scope for remaining runtime
verification/future writing. Writer, Critic, Publisher, Dispatcher and scheduling
were not started. No commit or push performed.
