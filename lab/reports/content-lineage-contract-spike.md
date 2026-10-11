# CONTENT Lineage Contract Spike 0.1

Date: 2026-10-11
Result: **PASS — deterministic contract and PHP Arrays backfill validated**
Scope: read-only experiment; no CONTENT, SOURCE, candidate, review or historical
promotion-audit mutation; no operator CLI.

## Question and answer

Can Redactoria distinguish an exact promoted artifact from later authorized
CONTENT changes without treating every hash difference as corruption or silently
trusting a prose explanation?

Yes. A strict lineage record can bind every post-promotion transition to its
previous/new SHA-256, closed change type, exact deterministic operation, human
authorization evidence, original candidate and promotion audit. Validation replays
the operations from the promoted bytes; declarations alone are insufficient.

The spike separates three histories:

```text
candidate lineage   = reviewed LAB candidate and Critic evidence
publication lineage = candidate → first promoted CONTENT and promotion audit
post-promotion      = ordered, authorized CONTENT version transitions
```

It does not rewrite one history to imitate another.

## Contract

The closed change types are:

- `TECHNICAL_CLEANUP`
- `METADATA_ONLY`
- `LINK_FIX`
- `TYPO_FIX`
- `PRESENTATION_ONLY`
- `CONTENT_CHANGE`

Review impact is independently explicit:

- `REVIEW_STILL_VALID`
- `REVIEW_RECHECK_REQUIRED`
- `REVIEW_INVALIDATED`

Every record includes `articleId`, previous/new content hashes, change type,
reason, human authorization plus its evidence hash, timestamp, source candidate
hash, promotion-audit reference, review impact, replayable transformation and
notes. Unknown enum values and extra fields fail the strict schema.

Deterministic classification rules:

| Change | Permitted proof | Default review effect |
| --- | --- | --- |
| exact promoted | zero post-promotion records and equal bytes | still valid |
| technical cleanup | exact, unique body removals | still valid when no claim/evidence changes |
| metadata only | exact replacements confined to front matter; body byte-identical | still valid |
| link fix | exact URL replacements | navigation may remain valid; citation/evidence requires recheck |
| typo fix | exact body replacements plus explicit meaning-unchanged attestation | still valid |
| presentation only | one closed normalization mode | still valid |
| content change | exact body replacements declared meaning-changing | preceding review invalidated |

A replacement Critic PASS can restore validity only when its own artifact hash and
reviewed CONTENT hash are supplied and verified. This spike does not generate such
a review.

## PHP Arrays real fixture

The original promoted bytes were reconstructed with the existing deterministic
promotion renderer from the frozen candidate and publication decision. Their hash
is exactly the historical promotion-audit `contentHash`:

```text
candidate JSON  b2c91233ed119451850ba018802fb10b6d0ecc9a747788ff8e30b2f2421f62e2
candidate body  713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068
promoted B      3b2435699eee3cad7f9ded0cbfd6bbef269717b0e28ad9cba7f2a19ff529d19e
metadata step   117d4bb40a436354584cd9c91eb38ce98a6d2dd50f23cf4c1215548e2ab2617b
current C       c4111bad6f943f9b19568f0b4474935f3fa510a02fa0f577c9a05031af742b38
```

One historical Git checkpoint contained both later changes, so the separate
backfill records two logical, replayable transitions at the same known commit
timestamp rather than inventing an unobserved order or time:

1. `METADATA_ONLY`: `updated` 2026-10-09 → 2026-10-10 and author name
   `Redactoria` → `Scripterix`; authorized and documented by completed plan 009.
2. `TECHNICAL_CLEANUP`: removal of exactly two obsolete LAB/draft reader notes;
   authorized and documented by completed plan 010 and already protected by the
   public-article regression test.

The Critic PASS remains valid. The metadata transition leaves the body byte-identical.
The cleanup removes only two workflow-status notes; plan 010 explicitly preserved
the substantive Critic-PASS text, examples and limitations. Deterministic replay
reaches current CONTENT exactly, with no additional byte difference. No claim,
code example, source citation or evidence statement changed.

The missing structured history is repaired only by the new separate
`tablice-w-php-content-lineage.json`. The original promotion audit, candidate,
review and CONTENT are not edited.

## Test matrix

Six positive scenarios pass: exact promoted content, technical cleanup,
metadata-only, meaning-preserving typo, presentation-only normalization and the
real two-step PHP Arrays chain.

Nine negative scenarios fail as required:

1. missing previous hash,
2. broken chain,
3. unknown change type,
4. missing authorization evidence,
5. body drift falsely labelled metadata-only,
6. content change without re-review,
7. wrong source candidate,
8. current CONTENT not at the chain end,
9. tampered intermediate version even when adjacent declared hash fields agree.

## Proposed `verify:article` interface

The future verifier should keep the original publication checks and add an optional
read-only lineage input:

```ts
publication.contentIntegrity =
  currentHash === promotionAudit.contentHash
    ? PASS
    : validateContentLineage({
        initialContent: reconstructedPromotion,
        currentContent,
        records: lineage.records,
        expectedCandidateHash: promotionAudit.candidateHash,
        expectedPromotionAuditRef,
        evidence
      }).overall
```

No topic-specific PASS exception is acceptable. Missing lineage remains FAIL.
This is an interface proposal, not an implemented CLI or integration.

## Backfill and future policy recommendation

Historical backfill should be permitted only when all intermediate bytes are
deterministically reconstructible, every authorization is preserved in an
existing hash-bound artifact, and replay reaches current CONTENT exactly. Unknown
data must remain `unknown` or `needs-review`; it must not be inferred. Backfill is
always a new append-only record and never an edit of a promotion audit.

For future post-promotion changes, require the lineage record and authorization
evidence in the same reviewed change as CONTENT. `CONTENT_CHANGE` must invalidate
the old review and cannot return to a publishable-valid state without a new Critic
PASS bound to the changed hash. This is a recommendation for a future accepted
policy/ADR, not an authorization to change publication behavior now.

## Remaining uncertainty

- Link fixes need more real fixtures to decide whether navigation, citation and
  evidence subtypes are sufficient.
- The exact durable storage location and atomic write protocol for future records
  remain undecided.
- Integration between this validator and the proposed operator CLI is not built or
  authorized.
- The backfilled logical order is reproducible but was not separately committed;
  both transitions share the one known checkpoint timestamp.

## Quality and integrity

- `npm run test`: 317/317 tests PASS in 24 files.
- `npm run check`: 134 files, zero errors, warnings or hints.
- `npm run build`: 11 static pages; Pagefind indexed 10 pages / 1586 words.
- `git diff --check`: PASS (only the repository's existing Windows line-ending
  notices were printed).
- Both new JSON documents parse; the strict backfill schema and real replay pass.
- The full frozen-fixture suite re-read SOURCE, candidates, reviews, audits and
  CONTENT from disk. No protected target is present in the tracked diff; this
  milestone added only the separate lineage/backfill evidence in LAB.

## Stop

No final `verify:article` command, publication, repair command, agent orchestration,
Article Manifest, Knowledge Graph, Dream Cycle or Agentic Circus was implemented.
