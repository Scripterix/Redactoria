# Plan 013 — PHP Control Flow: publication checkpoint

Status: active

## Goal

Publish the exact reviewed `php-control-flow` B2 candidate through a formal,
fail-closed Promotion Gate, verify the resulting public site locally and in
Cloudflare Pages, and record the end-of-day checkpoint.

## Boundaries

- The approved source is `lab/candidates/php-control-flow/` only.
- The reviewed article hash is
  `2a44143b3a355375fead8fe24b2c08c40ed2f1f6df1a7fcb13aa942f3d2f8f8b`.
- The final Critic verdict must remain `PASS`.
- Promotion may create only the approved CONTENT article and its audit report.
- No partial promotion is allowed when any decision, hash, review, or destination
  check fails.
- A public-only technical LAB/draft note may be removed as an explicit,
  deterministic presentation cleanup; editorial prose must otherwise remain
  unchanged.
- No B3, Humanizer, Knowledge Gap, Interaction Layer, or redesign work.

## Work

1. Extend the formal Promotion Gate to accept the schema-v2 candidate without
   weakening the historical PHP Arrays schema-v1 path.
2. Record a human publication decision binding the candidate, final Critic
   review, reviewed hash, destination slug, and public metadata.
3. Run the gate atomically and stop on any failure.
4. Verify candidate-to-CONTENT fidelity and the approved public-note cleanup.
5. Run `npm run test`, `npm run check`, and `npm run build`.
6. Verify routes, navigation, metadata, reading time, TOC, code copy,
   back-to-top, Pagefind, and sitemap in the production build.
7. Update Project Brain documents and move this plan to completed with the
   recorded result.
8. Review the complete worktree, commit, and push `master` only after all local
   checks pass.
9. Verify the deployed Cloudflare Pages site, including both PHP articles,
   search, and sitemap, then stop.

## Result

Pending.
