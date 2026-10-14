# 030 — B5 publication checkpoint

Status: COMPLETED · 2026-10-14

## Objective

Publish exactly the three human-authorized, immutable B5 candidates in order:

1. Git locally,
2. curl / HTTP,
3. Python fundamentals.

Then verify all supported article lifecycles, the static website, search, sitemap,
Git checkpoint and Cloudflare production deployment.

## Authorization

The human explicitly authorized public production for only these three exact
Critic-PASS candidates on 2026-10-14. Each publication decision independently
binds its candidate JSON, article Markdown and final Critic review hashes.

This authorization also permitted the final quality gate, publication commits,
push to `origin/master` and production verification. It did not authorize another
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

The registry gained only three explicit B5 lifecycle entries. Candidate bodies
were not regenerated. All new articles use the established Astro-managed Featured
Image fallback; no individual artwork was added.

## Result

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
  overflow. Search returns public B5 content and no internal LAB/docs paths.
- Publication commit `9f99ebf` and Project Brain checkpoint `a17c9be` were pushed
  to `origin/master` after the pre-publication checkpoint.
- Cloudflare Pages check for `a17c9be` completed with success, deployment
  `1d9da92c-ca41-4ec5-90f8-a774d833aab3`. Direct production browser checks passed
  for homepage, listing, all three B5 routes, search and the 23-URL sitemap, with
  no console errors.
- Unrelated user-owned Futureboard edits remained untouched and outside commits.

STOP: no next content batch or experiment was started.
