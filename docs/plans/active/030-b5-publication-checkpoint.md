# 030 — B5 publication checkpoint

Status: ACTIVE · 2026-10-14

## Objective

Publish exactly the three human-authorized, immutable B5 candidates in order:

1. Git locally,
2. curl / HTTP,
3. Python fundamentals.

Then verify all supported article lifecycles, the static website, search, sitemap,
Git checkpoint and Cloudflare production deployment.

## Authorization

The human explicitly authorized public production for only these three exact
Critic-PASS candidates on 2026-10-14. Each publication decision must independently
bind its candidate JSON, article Markdown and final Critic review hashes.

This authorization also permits the final quality gate, publication commits, push
to `origin/master` and production verification. It does not authorize another
content batch, new experiments, Futureboard rationalization or runtime agents.

## Execution

```text
checkpoint completed B5 candidate work
→ Git decision → Promotion Gate → verify:article
→ curl decision → Promotion Gate → verify:article
→ Python topic + decision → Promotion Gate → verify:article
→ all-lifecycle verification → test → check → build → diff check
→ browser/search/sitemap smoke → commit/push → Cloudflare verification → STOP
```

Minimal registry additions are allowed only for these three explicit lifecycles.
The exact candidate bodies must not be regenerated. All new articles use the
established Astro-managed Featured Image fallback; no individual artwork is added.

## Done criteria

- Three separate human publication decisions and three Promotion Gate audits.
- Three exact CONTENT articles and one minimal published Python topic if required.
- Every supported public lifecycle returns `OVERALL PASS`.
- `npm run test`, `npm run check`, `npm run build` and `git diff --check` PASS.
- Homepage, listing, three routes, fallback images, mobile overflow, search and
  sitemap pass smoke verification.
- Publication commits pushed to `origin/master`; Cloudflare production final HEAD
  and public routes verified.
- Unrelated user-owned Futureboard changes remain untouched and outside commits.

## Result

Local publication complete:

- Checkpoint `cd03a35` preserves Featured Image 0.1, reader-copy cleanup and exact
  B5 candidate evidence before publication.
- Separate decisions bind each candidate JSON, article body and final Critic review.
- Promotion Gate: `PROMOTED_PUBLIC` for `git-lokalnie`, `curl-http` and
  `podstawy-pythona`; each immediate 32-check verification PASS.
- All eleven registered public lifecycles PASS.
- `npm run test`: 359/359 PASS. `npm run check`: 163 files, zero diagnostics.
- `npm run build`: 23 pages; Pagefind 22 pages / 2235 words; sitemap 23 URLs.
- Browser smoke: homepage, listing, three articles, search and sitemap return 200;
  fallback heroes/thumbnails have correct order, alt, 16:9 cover and no 320 px
  overflow. Search returns Git and no internal LAB/docs paths.
- Publication commit: `9f99ebf` (`feat: publish B5 pilot articles`).

Pending: push and direct Cloudflare production verification for final HEAD.
