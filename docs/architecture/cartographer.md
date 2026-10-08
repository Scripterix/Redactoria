# Cartographer 0.1 contract and operation

## Responsibility and boundaries

`engine/agents/cartographer/` is one runtime agent-module. It owns interpretation
of the existing corpus, not article writing, publication, final editorial decisions,
or orchestration of other agents. Shared code stays under `core/`, `adapters/`, and
`validation/`. `orchestration/` only documents the reserved boundary; no Dispatcher
or queue exists.

## Input and two passes

The [canonical schemas](../../engine/agents/cartographer/contract.ts) validate
schema-1 inventory and limits. Duplicate source IDs/paths, unsupported schemas,
unsafe paths, and malformed input are rejected before model work.

1. Pass A: metadata only. Return tentative domains/clusters, confidence, uncertainties,
   and reasoned deep-read requests.
2. Validate requested IDs, uniqueness, parse status, and the read budget.
3. Read selected bodies only. Verify original-byte SHA-256 against inventory;
   exclude front matter, decode UTF-8, normalize CRLF in memory, and cap provided text.
4. Pass B: inventory, coarse plan, and selected bodies. Return refined structured
   interpretation. Validate before serialization or final LAB writes.

Default limits are configuration in `policies.ts`: 8 reads, 18,000 UTF-16 code units
per body, and 1 MiB per selected source file. `maxDeepReads` and `maxBodyCharacters`
are CLI-configurable; explicit safety ceilings are 25 reads / 100,000 characters /
10 MiB. A zero-read run is supported. Truncation is recorded, never hidden.

Source bytes remain unchanged. Source text and metadata are untrusted input, not
instructions. The injected reader rejects path escapes and external links.

## Output and grounding

`CartographerResult` contains `schemaVersion`, computed `corpusOverview`, hierarchical
`domains`, `clusters`, `gaps`, `candidates`, `observations`, `uncertainties`,
`limitations`, and `analysisContext` (inventory hash, model provenance, limits,
selected-source hashes, supplied lengths, and truncation).

Corpus counts come from code, not a model assertion. Unmapped articles are explicitly
listed. Parent-domain membership must include child membership; cycles, duplicate IDs,
unknown references and clusters outside their domain are rejected.

Every major claim has a separate interpretation and nonempty evidence with `sourceId`,
exact `sourcePath`, `field`, and exact `value`. Strings match source metadata exactly;
lists use compact JSON; numbers use decimal text; null uses the string `null`.
Body quotes must occur verbatim in a body actually supplied to Pass B. Domain/cluster
evidence must refer to members. Each candidate's targeted article requires evidence.

Actions are only KEEP, UPDATE, MERGE, SPLIT, ARCHIVE, REVIEW, NEW_CONTENT. MERGE means
a proposed editorial content consolidation, not Git merge. ARCHIVE never authorizes
source deletion. NEW_CONTENT has a proposed title and known domain, no invented post
ID. Existing-article actions require existing source targets. All confidence values
are finite in [0, 1]; priority is low/medium/high.

These checks prove structure, references and citation fidelity, not semantic entailment,
technical correctness, or calibrated confidence. A title-only gap must remain a
hypothesis; dates alone do not establish technical obsolescence. Human review is required.

Schemas are validated locally with Zod and exported to JSON Schema for model requests
using its [documented conversion](https://zod.dev/json-schema).

## Model adapter: explicit session import

The provider-neutral [LanguageModel](../../engine/core/language-model.ts) receives
phase, instructions, context, and JSON Schema, and returns `unknown`. The agent owns
validation. It does not know OpenAI, Claude, Gemini, or their SDKs.

For this first run the user selected **analysis in the current Codex session, explicitly
imported as model output**. `RecordedLanguageModel` reads two structured answers with
provenance. It performs no live inference, API call, subprocess agent invocation, or
silent deterministic imitation of AI. Tests use `FakeLanguageModel` only.

Each answer must match SHA-256 of the entire canonical request (phase, prompt, context,
and JSON Schema). Missing answers or changed inventory/prompt/limits/selected bodies
fail closed. Re-importing unchanged answers is deterministic replay, not a new inference.
The descriptive model label does not pretend to expose an unavailable provider model ID.

### Repeat the accepted first analysis

```sh
npm run cartographer
```

Default responses: `lab/cartography/session-responses.json`. An explicit file may be used:

```sh
npm run cartographer -- --responses path/to/session-responses.json
```

### Produce new session analysis

```sh
npm run cartographer -- --prepare inventory
# Analyze lab/cartography/requests/pass-a.json in the chosen model session.
# Record its requestHash and coarse response in the responses file; deep-read may be null.
npm run cartographer -- --prepare deep-read --responses path/to/session-responses.json
# Analyze lab/cartography/requests/pass-b.json; add its hash and refined response.
npm run cartographer -- --responses path/to/session-responses.json
```

Responses file shape:

```json
{
  "schemaVersion": 1,
  "provenance": {
    "mode": "imported-session-analysis",
    "model": "Descriptive session model label",
    "description": "Who produced this analysis and from which supplied inputs"
  },
  "inventory": { "requestHash": "<64 lowercase hex characters>", "response": {} },
  "deep-read": { "requestHash": "<64 lowercase hex characters>", "response": {} }
}
```

The placeholders above are explanatory, not valid model output. Response schemas
are included in the prepared request JSON. `deep-read: null` permits preparing Pass B,
but never completing a run.

Options: `--inventory file`, `--source directory`, `--max-deep-reads N`,
`--max-body-characters N`, `--responses file`, `--prepare inventory|deep-read|merge`,
repeated `--focus source-path`, `--task merge`, `--help`.
Defaults use project LAB and `../temp-ogwo/posts`; no machine-specific paths are coded.
No credentials are needed for import; a future live adapter would implement the same
port without changing the agent contract.

## Focused MERGE branch

This is a bounded branch of the same Cartographer module, not another agent or
the start of a rewriting pipeline. The CLI accepts exactly two distinct inventory
source paths, preserving their order as first/second, and only `--task merge`.
It selects those records before validating or preparing model context. Other
inventory metadata and the previous corpus cartography are not analyzed again.

```sh
npm run cartographer -- --focus 1324-post-61-tablice-w-php-czesc-1.md --focus 1356-post-62-php-tablice-czesc-ii.md --task merge
```

Both selected bodies must be read in full, with original-byte hashes checked.
An insufficient read budget, truncation, ambiguous/missing target, or unsupported
task fails closed. Increase `--max-body-characters` explicitly if required; there
is no silent truncated focused analysis. One `focused-merge` model request receives
only these two metadata records and bodies, not Pass A/B for the entire corpus.

The [focused contract](../../engine/agents/cartographer/focused-merge.ts) defines
the model analysis and computed result: literal task MERGE, two targets, recommendation,
confidence, reason/evidence, shared topics, unique material for first/second,
duplicates, conflicts, logical order, uncertain passages, keep/remove/research
findings, proposed title and ordered structure, limitations, request hash and provenance.
The filename stem is supplied by the result and constrained to a safe `*-merge` name;
neither target filename nor PHP-specific logic is hardcoded in the agent.

Every finding requires evidence and confidence in [0, 1]. All citations must match
selected metadata or exact supplied body fragments. Shared topics cite both targets;
unique material cites the corresponding target. Outline sections have contiguous
order, purpose, known source IDs with matching evidence, and a research marker.
Structural validation does not certify PHP behavior, security, or example execution.

To prepare a different focused session analysis, use the same focus/task arguments
with `--prepare merge`. It writes `lab/cartography/requests/focused-merge.json`.
Analyze that request in the model session, then import the response with this shape:

```json
{
  "schemaVersion": 1,
  "provenance": {
    "mode": "imported-session-analysis",
    "model": "Descriptive session model label",
    "description": "Analysis of exactly two supplied full articles"
  },
  "focused-merge": { "requestHash": "<64 lowercase hex characters>", "response": {} }
}
```

The placeholders are explanatory. The default focused responses file is
`lab/cartography/focused-merge-session-responses.json`; `--responses file.json`
overrides it. A focused response cannot substitute an inventory/deep-read answer.
Changing focus order, text, prompt, schema or limits invalidates its request hash.
Re-running unchanged recorded answers is deterministic replay, not new inference.

The accepted PHP pair was fully analyzed in this Codex session without an external
model API or PHP research/execution: 10,906 + 4,548 supplied characters, MERGE
recommended with confidence 0.96, and a 15-section outline. Version-sensitive and
security-sensitive issues remain research needs rather than claims of proven obsolescence.

Focused outputs are JSON-first and separate from the original corpus artifacts:

- `lab/cartography/php-arrays-merge.json`: validated merge plan, not a final article.
- `lab/reports/php-arrays-merge.md`: human report rendered from that JSON.
- `lab/decisions/php-arrays-merge-proposal.json`: conditional proposal only when
  merging is recommended, with literal `status: proposed` / `action: MERGE`.
  It binds the analysis hash and source hashes; it never approves or executes a merge.

Human approval, research and writing are separate future operations. Before review,
check that any proposal still matches the current analysis/source hashes; a run that
does not recommend merging does not delete earlier decisions. No Researcher or Writer
is invoked, and no `content/articles/php-arrays.md` is created.

At session closeout the user approved the PHP proposal in the existing decision
file, retaining its evidence, targets and analysis provenance. Human approval adds
`approvedBy`, `approvedAt` and `nextStep: research`; it does not change the model
output contract, which remains proposed-only. The LAB writer rejects an entire
artifact batch if it would replace an existing approved decision. Verify this
approved run read-only; a write-mode replay is intentionally blocked before writes.
The current human state is summarized in [STATUS](../STATUS.md).

## Artifacts and publication

- `lab/cartography/knowledge-map.json`: full validated result.
- `lab/cartography/editorial-candidates.json`: versioned candidate projection with
  inventory hash and model provenance.
- `lab/reports/cartographer-001.md`: rendered from validated data, with all required
  coverage/gap/review sections and TOP 5 NEXT ACTIONS.
- `lab/cartography/requests/pass-a.json`, `pass-b.json`, and `session-responses.json`:
  audit inputs and session answers. These may contain selected corpus excerpts and
  source links; review before sharing. They are not served by Astro.

Canonical JSON sorts object keys, preserves semantic array order, and has stable
UTF-8/LF output. Recommendation display order is priority, confidence, then ID;
this is simple ordering, not a scoring engine. Same structured answers produce the
same JSON and report. A different model interpretation may legitimately differ.

All paths are restricted to project `lab/cartography/`, `lab/reports/`, or
`lab/decisions/` (focused proposed decisions); existing
filesystem links are resolved and escapes into SOURCE, CONTENT or other paths are
blocked before writes. Staged rename avoids modifying an existing hard-linked input.
Each artifact replacement is atomic, not a multi-file filesystem transaction.
There is no automatic SOURCE/CONTENT modification, publication, Git operation,
scheduled task, or other runtime agent.
