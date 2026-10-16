# Plan 037 — Foundation publication checkpoint

Status: **COMPLETED** · 2026-10-16

## Scope

Publish exactly these three immutable B6 LAB candidates, in order:

1. `php-language-foundation` → `podstawy-php`
2. `javascript-language-foundation` → `podstawy-javascript`
3. `javascript-functions-callbacks` → `funkcje-javascript`

The human publication authorization is the attached 2026-10-16 publication-run
instruction. It authorizes one separate public-production decision and Promotion
Gate run per exact candidate, then the scoped Git/Cloudflare checkpoint after a
complete local PASS.

## Boundaries

- Do not rerun Cartographer, Researcher, Writer or Critic unless deterministic
  validation finds a real blocker.
- Keep immutable candidates pending/false; separate decisions are the authority.
- Do not modify SOURCE.
- Do not modify unrelated existing CONTENT or uncommitted user work.
- Extend the explicit `verify:article` registry only for the three new lifecycles.
- Do not implement Futureboard, Humanizer, new automation or an Article Manifest.

## Execution

1. Pre-flight exact candidate/review/source hashes and inspect the working tree.
2. Perform the bounded beginner-clarity sanity check; STOP on a real blocker.
3. Create three separate hash-bound human public-production decisions.
4. Add the three explicit verifier lifecycle entries and tests.
5. Promote in the approved order; verify each lifecycle immediately and STOP on FAIL.
6. Run all registered lifecycle checks, repository quality commands and local
   website checks (listing, images, sitemap, Pagefind, no LAB leak and mobile overflow).
7. Record effort, audit results and the publication checkpoint in Project Brain.
8. Commit only scoped publication changes, push `master`, then verify the final
   Cloudflare deployment and public URLs.

## Result

All three exact candidates were promoted in the approved order: `podstawy-php`,
`podstawy-javascript` and `funkcje-javascript`. Their separate hash-bound human
decisions, promotion audits and current CONTENT records pass `verify:article`.

The end-of-day checkpoint passed: `npm run test` (368/368), `npm run check` (177
files, no diagnostics), `npm run build` (27 routes, 26 Pagefind pages) and
`git diff --check` (no whitespace errors; CRLF notices only). Git push and
production-route verification are recorded by the separate end-of-day closure
plan 042.
