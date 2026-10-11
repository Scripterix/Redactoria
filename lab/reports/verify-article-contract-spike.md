# Redactoria — verify:article Contract Spike 0.1

Status: **COMPLETE WITH ONE DETECTED INCONSISTENCY**
Date: 2026-10-11
Scope: read-only deterministic validation of five frozen pipeline samples.

## Result

The contract prototype works across candidate schema v1, v2 and v3, PHP/Node/browser
execution evidence and pending/published states. It defines 27 checks common to all
five samples plus four conditional publication checks.

Four fixtures return `OVERALL PASS`. PHP Arrays returns `OVERALL FAIL` because its
current CONTENT bytes no longer match the `contentHash` recorded by the original
Promotion Gate audit. The later content change is known and human-authorized — plan
010 removed two obsolete LAB/draft presentation notes — but there is no structured,
hash-bound post-promotion audit that links the current bytes to that decision.

The spike does not reinterpret or hide this mismatch. No historical artifact was
changed to make the fixture pass.

## Contract semantics

- `PASS`: the check applies and its requirement is satisfied.
- `FAIL`: the check applies but evidence is missing, invalid or inconsistent.
- `NOT_APPLICABLE`: the check does not sensibly apply; it is neutral.

The overall rule is deterministic:

```text
any applicable FAIL                       → OVERALL FAIL
all applicable checks PASS + zero/more N/A → OVERALL PASS
```

Missing required data is `FAIL`, never `NOT_APPLICABLE`. The result schema is
implemented in `engine/validation/article-verification-contract.ts`. It validates
the exact check tree, counts and final result; there is no `UNKNOWN` status.

## Check inventory

| Area | Common checks | Count |
| --- | --- | ---: |
| SOURCE | exists, reference, hash, protection | 4 |
| CARTOGRAPHY | decision, scope/provenance, authorization | 3 |
| RESEARCH | packet, approval/validation, evidence, hashes | 4 |
| RUNTIME | evidence, example binding, environment, results | 4 |
| WRITER | draft, hash, lineage/revision | 3 |
| CRITIC | final review, verdict, reviewed hash, unresolved changes | 4 |
| CANDIDATE | exists, schema, integrity, reviewed version, publication flags | 5 |
| **Common total** | applies to 5/5 | **27** |
| PUBLICATION | decision, human approval, promotion audit, CONTENT integrity | **4 conditional** |

PHP differences are represented by recorded PHP 8.4/8.5 runs. Pure JavaScript uses
Node evidence. DOM uses controlled-browser evidence. The same four runtime contract
questions apply; their data shapes remain type-specific.

## Five frozen fixtures

| Fixture | SOURCE | Cartography | Research | Runtime | Writer | Critic | Candidate | Publication | Counts P/F/N/A | OVERALL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PHP Arrays | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **FAIL** | 30/1/0 | **FAIL** |
| PHP Control Flow | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | 31/0/0 | **PASS** |
| JavaScript if/else | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | 27/0/4 | **PASS** |
| JavaScript Arrays | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | 27/0/4 | **PASS** |
| JavaScript DOM | PASS | PASS | PASS | PASS | PASS | PASS | PASS | N/A | 27/0/4 | **PASS** |

### PHP Arrays failure

```text
publication.contentIntegrity: FAIL
promotion audit contentHash:
  3b2435699eee3cad7f9ded0cbfd6bbef269717b0e28ad9cba7f2a19ff529d19e
current CONTENT SHA-256:
  c4111bad6f943f9b19568f0b4474935f3fa510a02fa0f577c9a05031af742b38
```

The publication decision, explicit human approval and Promotion Gate audit bindings
still pass. Only the assertion that current CONTENT equals the promoted bytes fails.
The existing regression test proves the later cleanup is the expected removal of
two notes, but a test is not a structured lineage/audit artifact.

## `NOT_APPLICABLE`

Exactly four checks are `NOT_APPLICABLE` for each pending JavaScript candidate:

1. publication decision,
2. human publication approval,
3. Promotion Gate audit,
4. CONTENT integrity.

Their candidate-level `pending/false` flags are still required and pass. Thus
non-publication never blocks `OVERALL PASS`, while a false publication flag is a
real `FAIL`.

No runtime check is N/A in these five fixtures because every article required and
contains execution evidence. A future non-executable article would need an explicit
policy saying execution is not required before runtime checks could be N/A.

## Negative fixtures

Negative tests use in-memory copies of loaded snapshots. They never modify real
SOURCE, LAB or CONTENT.

| Mutation | Detection | Result |
| --- | --- | --- |
| Changed SOURCE bytes/hash | `source.hash` | detected |
| Critic verdict other than PASS | `critic.verdict` | detected |
| Candidate article hash mismatch | `candidate.integrity` | detected |
| Markdown changed after review | `candidate.reviewedVersion` | detected |
| Missing required runtime evidence | `runtime.evidence` | detected |
| False publication flag | `candidate.schema`, `candidate.publicationFlags` | detected |
| Publication decision bound to another candidate | `publication.decision` | detected |

All seven requested negative classes are detected deterministically.

## Prototype boundary

The prototype consists of:

- a strict Zod result contract,
- a scoped read-only snapshot loader,
- a pure verifier over the loaded snapshot,
- five repository-backed fixture definitions,
- positive and negative Vitest coverage.

The loader rejects traversal, restricts reads to `lab/`, `content/` and the external
SOURCE root, applies file-size limits and performs no writes. The verifier performs
no model calls, agent invocation, regeneration, approval, publication, Git action or
network request. No `npm run verify:article` operator command was added.

## CLI readiness

Recommendation: **CONDITIONAL — NOT YET**.

The 27-check common core is stable enough to become the basis of a future CLI, and
the negative tests show that failures are meaningful. However, building the operator
CLI now would codify an unresolved publication-lineage ambiguity. First define a
small, explicit rule and artifact for human-authorized CONTENT changes after
Promotion Gate — for example a new hash-bound presentation-change audit that names
the parent content hash, allowed transform and resulting content hash.

That decision belongs to a separate reviewed increment. This spike does not create
the artifact, modify CONTENT or repair the historical audit.

## Most important finding

Candidate integrity and publication integrity are different timelines. Immutable
LAB candidates can remain perfectly valid while later authorized CONTENT changes
make the original Promotion Gate hash insufficient to describe the current public
file. A production verifier therefore needs an explicit post-promotion lineage
contract, not an exception or hardcoded PASS.

Structured summary: [`verify-article-contract-spike.json`](verify-article-contract-spike.json).
