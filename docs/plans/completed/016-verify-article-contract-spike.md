# Plan 016 — verify:article contract spike 0.1

Status: COMPLETE — 2026-10-11

## Goal

Test whether one read-only deterministic verification contract can validate the
five frozen PHP/JavaScript pipeline samples without regenerating artifacts,
invoking agents or turning the prototype into an operator CLI.

## Scope and boundaries

- Define exactly `PASS`, `FAIL` and `NOT_APPLICABLE` check semantics plus a
  deterministic overall result.
- Cover SOURCE, cartography, research, runtime/execution, Writer/draft, Critic,
  candidate and conditional publication integrity.
- Use real references and hashes for the five frozen samples; do not copy large
  historical payloads.
- Use temporary copies or in-memory overrides for negative tests; never mutate
  historical evidence.
- Keep the prototype read-only, offline, deterministic, no-agent, no-model and
  no-publication.
- Do not add the final `npm run verify:article` command, Article Manifest,
  Knowledge Gap, content, agents, UI, commit, push or deployment.

## Work

1. Snapshot protected SOURCE, CONTENT, candidate, review and promotion-audit hashes.
2. Map schema-v1/v2/v3 compatibility and publication-specific differences.
3. Add a strict verification-result contract and read-only library prototype.
4. Define five repository-backed frozen fixtures.
5. Add positive and negative deterministic tests for the requested failure classes.
6. Execute all five fixtures and write the spike report plus structured results.
7. Correct Futureboard `FROZEN != REJECTED` semantics and update only
   `verify:article` evidence/status from the spike.
8. Run test, check, build, diff and protected-state integrity gates.
9. Record the result, move this plan to completed and STOP.

## Result

The spike defines 27 checks common to all five samples and four conditional
publication checks. PHP Control Flow and the three pending JavaScript candidates
return OVERALL PASS. PHP Arrays returns OVERALL FAIL only for current CONTENT
integrity: its original promotion audit hash predates a later human-authorized
presentation cleanup, and no structured post-promotion audit binds the resulting
bytes. The mismatch was reported, not hidden or repaired.

Seven requested negative mutation classes are detected using in-memory copies.
The prototype remains read-only and no operator CLI/package command was added.
Production CLI implementation is conditionally recommended only after a separate
hash-bound lineage contract for authorized CONTENT changes after promotion.

Final quality: 301/301 tests PASS; Astro check covers 131 files with zero
diagnostics; build produces 11 pages and a 10-page/1586-word Pagefind index.
Protected SOURCE, CONTENT, candidates, reviews and promotion audits remain
unchanged by the spike. No agent, model, network, Promotion Gate, publication,
commit, push or deployment action occurred.
