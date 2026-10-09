# Execution Plan 006: Research Packet approval gate

## Goal and scope

Record the user's explicit Research Packet approval only after actual PHP 8.4 and
8.5 verification. Commit/push Milestone 3 plus the gate to the existing origin,
without force push. Do not start Writer/Critic/Publisher/Dispatcher or write SOURCE
or CONTENT. The original packet, evidence, requests/responses and MERGE decision
remain immutable historical results; add a separate verification supplement and
formal research approval referencing their hashes.

## Execution

1. Snapshot protected SOURCE, CONTENT, Cartographer/inventory/report artifacts,
   approved MERGE and existing research results. Inspect available runtimes.
2. Use genuine PHP 8.4/8.5 CLI builds. If not already installed, fetch official
   portable Windows archives into a uniquely named temporary directory and verify
   their published SHA-256 before extraction/execution. Never change XAMPP/PATH,
   install global services or add binaries to Git. Record exact versions and origin.
3. Run the existing fixed owned probes plus a small version-sensitive supplement
   (especially array_key_exists null argument). Compare outputs and expected
   diagnostics through deterministic assertions; never simulate execution results.
4. Save separate runtime-verification JSON/report in LAB. Only after both runtimes
   pass, record status approved / approvedBy human / nextStep writer in a new LAB
   decision, retaining hashes/evidence/provenance of all original artifacts.
5. Update STATUS, ROADMAP and CHANGELOG, distinguishing historical packet limits
   from newly completed runtime verification. Final standalone Writer examples do
   not yet exist and are not falsely claimed tested.
6. Run test/check/build, verify protected hashes, inspect git status/diff, explicitly
   stage Milestone 3 and gate files, commit and push to the existing Redactoria
   origin without force. Stop for a separately authorized Milestone 4.

## Quality and completion

Both actual target runtimes pass all probe assertions. Missing versions/failures are
recorded honestly and do not produce a false approved runtime gate. Original
Researcher artifacts and all protected inputs are byte-identical. Deterministic
validation tests do not download PHP or execute live runtimes. All required npm
commands pass; commit and remote push are confirmed. No general CI platform.

## Result

Completed 2026-10-09. Genuine official Windows x64 NTS portable PHP 8.4.26 and
8.5.11 archives were SHA-256 checked before extraction/execution. Runtime files
stay in a uniquely named temporary directory outside Git; no XAMPP/PATH changes.
Actual `-n` CLI executions: PASS, 12 controlled probes / 60 assertions per version,
covering every requested array operation, key order, mutations and diagnostics.

PHP 8.5 initially failed 2 diagnostic expectations (58/60): null array offsets are
deprecated too, not only null array_key_exists arguments. The actual initial run
is preserved; official migration documentation was captured separately before
correcting expectations and rerunning real PHP. Required erratum accompanies the
approved packet; no original observation or Research Packet was rewritten.

New LAB artifacts: runtime verification JSON/derived report, initial run,
official-source supplement and `php-arrays-research-approval.json`. The latter
records `approved`, `approvedBy: human`, `nextStep: writer`, original evidence and
provenance, 11 artifact hashes and the mandatory addendum. Only `target-runtime`
is resolved; future Writer-authored final examples/form handler are not claimed
executed. Original packet SHA-256 remains
`3437fb991ebd1707c0ca04092a2143ade10704dd1168749eff694d3b4d0a3a42`.

Quality gate: 123 tests / 10 files PASS, including eight offline runtime evidence
tests; check 61 files with 0 errors/warnings/hints; build six static pages PASS.
All 107 protected hashes unchanged, SOURCE 83 files with clean source checkout,
CONTENT two files, Cartographer/inventory/reports, approved MERGE and the seven
original Researcher artifacts unchanged. All 11 approval evidence hashes match.
Scoped Git LF attributes preserve byte-level LAB/probe hashes across checkouts.

Project Brain and operation documentation updated; no new ADR or architecture.
Milestone 3 plus this gate are the explicit commit/push handoff. The commit ID and
confirmed remote result are reported in Git history and the final closeout, not
embedded circularly in this commit's contents. No force push. Milestone 4 is NEXT,
not started; no Writer, Critic, Publisher or Dispatcher implementation.
