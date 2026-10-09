# Researcher 0.1

## Responsibility and boundaries

`engine/agents/researcher/` is the second independent runtime agent-module.
It verifies material before future writing, not a helper collection or a prompt-only
agent. SOURCE != LAB != ENGINE != CONTENT != WEBSITE; AI proposes, human decides.

```text
human-approved MERGE + unchanged focused map + selected inventory
           ↓
two full SOURCE bodies + official evidence snapshot + questions
           ↓
one Researcher model request → validation → LAB Research Packet → STOP
```

No runtime agent calls another agent. Importing Cartographer artifact schemas does
not invoke Cartographer. There is no Dispatcher, queue, scheduling, live inference,
Writer, Critic or Publisher. The module cannot access filesystem writes or shell
execution. The CLI has only a narrowed `research/<safe-slug>/*.json|md` LAB writer;
canonical paths block junction/symlink escapes into SOURCE or CONTENT.

## Input and structured output

Input requires `approvedBy: human`, `status: approved`, `action: MERGE`,
`nextStep: research`, exactly two unique targets, their unchanged source hashes,
and an analysis hash matching the focused map. Full bodies are bounded but never
silently truncated. Excluded corpus bodies/metadata are not sent to the model.

`ResearchPacket` schema version 1 includes the topic/targets/environment, verified
facts, outdated/incorrect/ambiguous claims, security notes, code review, actionable
recommendations, question answers, source register, explicit unresolved questions,
limitations and Writer handoff instructions. Confidence is declared certainty,
not a statistical probability. It must be finite and within 0–1.

All factual findings marked verified require an official document reference.
Article corrections/security/code findings also require exact selected-source
evidence. Document and excerpt IDs must exist in the independently captured input.
The register is built by code, not invented by the model: only used documents and
used excerpt IDs enter it. References in recommendations/handoff/questions are
validated. Unknown/unverified code cannot be labelled executed or handed off as
verified code. Probes record actual PHP version, exact code SHA-256, output and
diagnostics; captured code hashes are checked on input.

## Evidence is not interpretation

The pilot uses an explicit 34-page php.net manifest, not a crawler. The capture
script checks HTTPS/HTTP 200, disallows redirects, locates official content and
excludes user-contributed notes. Short exact anchors and locators, real URLs/titles,
retrieval timestamps and original response hashes are kept in `sources.json`.
The Researcher input additionally validates document hosts, budgets and unique IDs.

Model interpretation is separately imported in `session-responses.json`, tied to
the full `request.json` including prompt, schema, full bodies and evidence snapshot.
The default CLI is offline recorded replay; it never silently refreshes documentation
or executes a new inference. This does not make interpretation infallible: validators
check shape/provenance/reference fidelity, not automatic semantic truth. Evidence
capture is a trusted preparation step; it is not independently signed attestation.
Future refresh requires source review and a new request/response pair.

## Manual CLI

```sh
npm run researcher -- --decision lab/decisions/php-arrays-merge-proposal.json
```

The topic/output slug comes from the approved focused map, not hardcoded PHP
filenames in the agent. Default evidence/response files are under that topic's
`lab/research/` directory. Optional flags: `--sources`, `--responses`, `--inventory`,
`--source`. `--decision` is mandatory; the CLI never infers human approval.

To prepare a new explicit import after reviewed evidence changes:

```sh
npm run researcher -- --decision lab/decisions/php-arrays-merge-proposal.json --prepare
```

It saves a hash-bound request but does not fabricate a model response. Model output
remains `unknown` until agent-owned validation. `LanguageModel` and
`RecordedLanguageModel` add only the `research` phase; no provider/API keys/SDK.

## PHP pilot and audit files

- `lab/research/php-arrays/research.json`: validated system contract.
- `lab/research/php-arrays/research.md`: JSON-derived human report, not another article.
- `sources.json`: 34 official documents, 13 research questions, local probe evidence.
- `probes.json`: 9 controlled probes, run on installed PHP 8.2.4 only.
- `request.json`: exact model input plus input/request hashes.
- `session-responses.json`: explicitly labelled current-session interpretation.

The accepted editorial baseline is PHP 8.4–8.5. The original packet records **8.2.4**
only and retains that historical limitation. The subsequent approval gate executed
genuine PHP **8.4.26** and **8.5.11**: 12 fixed probes / 60 assertions each, PASS.
Separate `runtime-verification.json|md` preserves versions, official archive hashes,
actual code/output/diagnostics and assertions without rewriting the Research Packet.
Controlled probes reproduce data operations only, never execute SOURCE Markdown,
process HTTP requests or install PHP. Ordered PHP array behavior is retained through
explicit keyOrder/pair arrays; stable JSON object-key order is not PHP iteration order.

Explicit refresh commands (not needed for replay, invalidates recorded hashes):

```sh
node --experimental-strip-types scripts/research/capture-php-probes.ts C:/xampp/php/php.exe
node --experimental-strip-types scripts/research/capture-php-arrays.ts --refresh
```

The first accepts an existing local executable and runs only the fixed owned probe
file. The second refreshes the explicitly listed official documents and requires
existing probe results. Neither is invoked by the Researcher module or tests.

The bounded approval verification tool is also explicit, not part of replay:

```sh
node --experimental-strip-types scripts/research/verify-php-arrays.ts --php84 <absolute-php84.exe> --php85 <absolute-php85.exe> --archive84 <absolute-official-84.zip> --archive85 <absolute-official-85.zip>
```

It requires the exact verified official builds recorded in `TARGET_RUNTIMES`, runs
only owned probe files with `-n`, and writes the LAB runtime supplement. A new run
changes execution timestamps/hashes, so its evidence must be reviewed separately;
the existing human approval does not silently approve changed artifacts.

PHP 8.5 null array offsets also emit E_DEPRECATED. This mandatory Writer erratum
is grounded in the probes and `runtime-source-supplement.json`; the first 8.5 run
(58/60 FAIL before correcting expected diagnostics) is retained separately.
`lab/decisions/php-arrays-research-approval.json` binds human approval to the unchanged
packet and verification evidence. Tests replay validation only, without live PHP.

## Quality and next boundary

Tests cover approved-only scope, exact targets/hashes, evidence, actions, confidence,
unresolved claims, code references, source register, replay, deterministic artifacts
and SOURCE/CONTENT write protection. No external calls in tests.

The PHP packet contains 25 verified facts, 4 corrections, 1 dated framing note,
3 ambiguities, 3 security notes and 8 code findings. Its historical unresolved items
are not rewritten: the separate supplement resolves target-runtime execution;
future final standalone Writer snippets/form handler do not yet exist and require
later validation. Research Packet is approved by human with `nextStep: writer`,
including the required runtime addendum. Milestone 4 is NEXT, not started; neither
this decision nor MERGE approval authorizes publication.
ADR 0003 covers the agent contract; its evidence section is clarified, not duplicated
in a new milestone-specific ADR.
