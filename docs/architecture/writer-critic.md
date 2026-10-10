# Writer 0.1 / Critic 0.1

## Separate runtime boundaries

Writer and Critic are distinct modules under engine/agents, each with input/output,
policies, stable prompt, validation, report and tests. Shared approved-input/hash/I/O
mechanisms live in engine/core. Neither module receives filesystem, shell, web,
publication or another agent's execution capability. No Dispatcher or recursive loop.

Approved MERGE + approved research + mandatory addenda + two full sources + outline
→ one Writer DRAFT → LAB → STOP.
Exact validated draft + approved research/addenda + actual example evidence
→ one Critic REVIEW → LAB → STOP.

Manual preparation does not call a model. Execution uses provider-neutral
LanguageModel and explicit RecordedLanguageModel imports bound to exact requests.
The pilot used two separate roles in the same Codex session/model context; this is
functional independence, not a claim of independent providers or model diversity.

## Inputs and provenance

Topic configuration is LAB/drafts/<topic>/input.json. It supplies decision, research
approval, packet, runtime references, audience, supported PHP scope and coverage.
The agents contain no PHP arrays filenames or article-specific editorial logic.
The first workflow supports a two-source approved MERGE and PHP 8.4–8.5 scope.

The CLI checks canonical LAB paths and file budgets, selects only the two approved
inventory records and performs complete hash-checked source reads. Other corpus
bodies are never supplied. Shared editorialBasis checks approval status/human,
all 11 approved evidence artifact byte hashes, target identity, research/source
provenance, Cartographer linkage, both actual target runs and required addenda.
The original Research Packet is historical: its limitations are resolved by the
separately approved supplements, never rewritten or silently ignored.

Evidence is a known finding ID or an explicitly approved addendum ID. Source claims
do not override research. Input text is data, not tool instructions. Trusted snapshots
are not cryptographic attestations; validators check shape, hashes and references,
not automatic semantic truth.

## Writer contract

WriterInputSchema is a strict EditorialInputSchema: config, bounded immutable
artifact contents and exactly two complete source bodies. WriterAnalysisSchema
allows only DRAFT, supplied PHP scope, ordered unique sections with coverage/evidence,
structured standalone code examples, expected output/diagnostics and limitations.

DraftSchema binds schemaVersion 1 / status draft, topic/audience, all approved refs,
unchanged source targets/artifact hashes, prose word count, exact article SHA-256,
writer input/request hashes, model identity and one-call count. Those provenance
fields are assembled by code, not invented by the model. Article JSON is primary;
Markdown is its deterministic projection. Code cannot be hidden in prose fences.

Coverage validation checks references/declared coverage, not whether the prose
actually teaches each item well: that is Critic/human work. New examples are not
labelled executed just because earlier controlled research probes ran successfully.

## Critic contract

CriticInputSchema requires a valid matching DraftSchema + exact rendered Markdown,
canonical draft ref, approved editorial input and nullable execution evidence.
The latter binds exact code/draft hashes, actual approved runtime identity, captured
stdout/stderr/exit code, each example and aggregate PASS/FAIL. A PASS review with
examples requires genuine passing execution evidence supplied by trusted preparation.

CriticAnalysisSchema allows only REVIEW and PASS/REVISE/BLOCK, all ten unique
criteria, issues with exact section/quote, severity, status, confidence and changes.
Factual/code/security/version/alignment issues require approved evidence.
Unknown evidence/locations/verdicts, unsupported actions and contradictory severity
are rejected. Needs-research is explicit, never an invented factual answer.

Blocking issue → BLOCK; required or needs-research issue → REVISE; optional-only
or no issues → PASS. Non-PASS criteria need grounded issues. Required changes and
optional improvements are derived separately. CriticReviewSchema binds exact
draft metadata/article hashes and critic input/request/model provenance.
PASS means ready for human review, not approval or publication.

## Manual commands

- npm run writer -- --topic php-arrays --prepare
- npm run writer -- --topic php-arrays
- npm run critic -- --draft lab/drafts/php-arrays/article.md --prepare
- npm run critic -- --draft lab/drafts/php-arrays/article.md

Optional --responses accepts a reviewed LAB recording. Preparation writes request
only. Default execution imports the matching response, never makes HTTP/API calls,
refreshes research or invokes another agent. Changed prompt/input/output requires
a new explicit import, not silently reused interpretation.

Writer CLI capability writes only LAB/drafts/<slug>/*.json|md; Critic only
LAB/reviews/<slug>/*.json|md. Shared canonical-path staging blocks SOURCE/CONTENT
junctions and traversal, preserves approved decisions and does not publish.

## Initial PHP pilot result (historical)

Exactly one Writer run and one Critic run; no automatic revision. Draft: 16 sections,
2506 prose words excluding fenced code/output, all 22 required areas.
Article SHA-256: f154a1208ff6b9f5022da5cb97b17382ac75e7803b0f41e58e7bffcef874d616.
Writer request: c6dd70d5bf4de93690360654df4861bd9a4067db489fe809136748b05de1f6c3.
Critic request: 3984c198a337ddd5ae126c95f54439c41aaa46d203934424cc8d8c187f954c87.

A manual trusted execution step ran the 17 self-authored standalone blocks,
not SOURCE Markdown. Exact official portable executables matched the previously
approved hashes: PHP 8.4.26 and 8.5.11. CLI -n, E_ALL, display errors to stderr;
17/17 per version PASS, expected stdout, exit code 0 and no stderr. Results are in
LAB/drafts/php-arrays/code-execution.json. This is not complete branch/application,
exercise-solution, cross-OS/SAPI or every-patch testing. No generic executor/CI added.

Critic: REVISE. One required precision change in #aggregation: narrow
“Wynik to jedna wartość, a nie tablica” to this example's sum 15, rather than an
overbroad result-type claim. Two optional clarity improvements concern the first
fn callback and labels for removal states. No code/security failures reported.
The draft was deliberately left unchanged at that gate. The archived original
generation is article-001.json/md; the initial REVISE request/response/review are
the *-001 files. The later human direction is recorded below.

## Authorized correction and first publication candidate

The human accepted the required correction and authorized one additional full
Critic review, with candidate preparation conditional on PASS. Three prose-only
changes were applied: scope reduce to sum 15 in this example, explain the first fn
expression and label the four removal-output states. No full Writer generation.
The revised draft contains 2559 prose words; original Writer execution, approved
refs, section evidence, coverage and all 17 complete example objects are unchanged.

revision.json records human authorization, exact before/after quotes, parent/current
hashes and runtime reuse. Original code-execution-001.json stays byte-identical;
current code-execution.json changes only articleHash, retaining the actual original
executedAt and run records. Identical code/outputs/diagnostics need no artificial
new PHP cases. No new runtime execution was claimed.

The separately prepared new full Critic second pass returned **PASS**, zero required
changes. Request hash:
13daadc9d6fe9f2cbb3339b463bfb3360992a059183398190f290b728626138e.
Revised article SHA-256:
713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068.

Milestone 5 copied that exact Markdown to LAB/candidates/php-arrays/article.md with
no generation/transformation. Candidate JSON includes the complete reviewedDraft,
draft/review/revision hashes, original Writer and second Critic provenance, strict
JSON Schema and readyForHumanPublicationDecision=true. Publication state remains
pending / approvedForPublication=false / published=false. This is a controlled LAB
copy with validation, not a new Publisher or automatic promotion framework.

Final gates: 174 tests / 13 files, clean 80-file check, six-page build; 8 negative
candidate checks rejected unreviewed/forged/published states. All 114 required
upstream hashes unchanged; 193 extended hashes unchanged. The sole test-fixture
adjustment pins the original REVISE scenario to its archived generation/capture/
response instead of mutable current editorial state. Runtime agent code is unchanged.
Next: **AWAIT HUMAN PUBLICATION DECISION**. No CONTENT, deploy, commit/push or new ADR.

## Quality and architecture

174 offline tests / 13 files PASS; check 80 files, zero diagnostics; six-page build.
All 114 existing protected hashes unchanged: 83 SOURCE files, two CONTENT files,
Cartographer/inventory/reports, approved MERGE, original research and research
approval/runtime supplements. Tests run no external PHP/network/LLM API and do not
need the external corpus checkout; captured request data supplies fixture bodies.

ADR 0003 already covers these runtime contracts and tool/model boundaries; no new
durable architecture decision or ADR. Publisher/Dispatcher remain unstarted.

## B2 — single-source PHP control flow

The separately authorized B2 pilot reused the same Writer/Critic contracts with one
approved source and the bounded research-acceptance contract. Writer produced one
1663-word, 13-section draft and four unimplemented interaction opportunities. All
16 standalone examples passed on PHP 8.4.26 and 8.5.11.

The first full Critic returned REVISE for one clarity boundary: `!== 0` in the shown
guard is exact for the assigned `int 0`, not every numeric zero such as `float 0.0`.
One required prose replacement was applied without code changes, new Writer calls or
new PHP executions. The original draft, execution and review artifacts are archived.
The full second Critic request is bound to revised article hash
`2a44143b3a355375fead8fe24b2c08c40ed2f1f6df1a7fcb13aa942f3d2f8f8b`
and returned PASS with no issues.

`npm run candidate -- --topic php-control-flow` is a deterministic, fail-closed LAB
candidate gate outside `engine/agents/`. It validates the exact draft, Critic PASS,
runtime evidence and revision hashes and refuses to overwrite an existing candidate.
Schema v2 records `sourceDecision`, not a false MERGE label. The exact Markdown and
metadata remain pending/false in LAB; no promotion or publication capability is added.

