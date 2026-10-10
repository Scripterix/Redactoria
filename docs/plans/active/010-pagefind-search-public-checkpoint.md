# 010 — Pagefind Search 0.1 and public checkpoint

Status: ACTIVE — LOCAL GATE PASS, REMOTE CHECKPOINT NEXT · 2026-10-10

## Authorized scope

Add static public WEBSITE search; remove only obsolete reader-facing LAB/draft
notes from the promoted PHP article; correct stale Project Brain status entries.
Preserve existing M4/M5 and website work, SOURCE and all historical LAB artifacts.
The human explicitly authorizes commit and `git push origin master` in this task
after tests, check, build, real Pagefind search and production preview all pass.
Stop after deployment verification. B1 selection and further article work are separate.

## Plan

1. Use pinned official Pagefind CLI after Astro build, indexing only public HTML
   main content. Search assets load only on `/szukaj/` and on demand.
2. Add a small keyboard-accessible search form, titles, excerpts and direct links
   using Pagefind's search API; retain existing editorial design.
3. Remove the two obsolete PHP draft/LAB notes only; retain substantive Critic-PASS
   text, examples, limitations and immutable candidate/review/promotion history.
   Remove the article layout's local-test banner and stale local-only statements in Start.
4. Test project-owned deterministic boundaries, then run test → check → build.
5. Verify production index, exclusions, mobile layout, links, article utilities and
   production-like preview. Record generated/indexed page counts and exact URL.
6. Update current status, review the entire checkpoint, commit and push master only
   after all gates pass; verify Cloudflare public output, then STOP.

## Implementation choice

Official CLI (`astro build && pagefind --site dist`) avoids an additional
Astro integration/version contract. Pagefind reads generated public HTML, not
the repository. `data-pagefind-body` excludes shared chrome and the search page;
no internal data is copied into `dist`. Custom UI is presentation only, with the
official Pagefind engine providing indexing, ranking and excerpts.

Sources consulted: [Pagefind quick start](https://pagefind.app/docs/),
[index scope](https://pagefind.app/docs/indexing/),
[search API](https://pagefind.app/docs/api/), and official Astro routing,
styling and testing guides.

## Result

- Pagefind 1.5.2 pinned as a development dependency; production command is
  `astro build && pagefind --site dist`. CLI is simpler to control than an extra
  Astro integration and works with the existing Astro 7.3.8 static output.
- Ten generated pages, nine indexed public pages, Polish language, 1273 indexed
  words, no filters/sorts. Search page and internal paths are absent from the index.
- Minimal API-based UI returns title, plain-text excerpt and a public direct link.
  Its 4.2 kB build script is present only on `/szukaj/`; Pagefind engine/index
  are fetched on submit, not on ordinary pages. No framework or backend was added.
- Only two obsolete PHP body notes were removed; public layout's local-test banner
  and Start's old local-only status were corrected. Candidate/review/audit unchanged.
  Current PHP body SHA-256: `56f1478d4d581f8483f45bf00dbfffce91079f12c242a18d82ac9fd0db66dc9f`.
- Current gate: 254 tests / 19 files PASS; check 99 files, zero diagnostics;
  build ten pages plus official XML sitemap and real Pagefind output PASS.
- Production preview: `http://127.0.0.1:4322/`, search at `/szukaj/`.
  40/40 responsive route checks, 45 internal targets valid; tightened mobile
  header spacing after testing at 320 px with scrollbar width accounted for.
- Real-index search: article, topic and project results; Enter; empty query;
  absent-term result; load error and refresh recovery. Copy: 34/34 buttons,
  keyboard/Copied/reset, correct code text (Windows normalizes clipboard LF to CRLF),
  14 long blocks scroll independently; no page overflow. Back-to-top returns to y=0.
- Browser skill connection was unavailable (no execution tool exposed); available
  Playwright performed the real production-preview checks. No browser dependency
  or E2E framework was added to the repository.
- SOURCE/LAB protection: 141/141 files unchanged, with no added/removed protected
  paths. Existing runtime work is preserved and was not extended in this increment.
- Commit/push and Cloudflare verification pending; explicitly authorized without
  another YES. Checkpoint includes the existing M4/M5, promotion and 009 work
  needed to reproduce this current tree, without modifying those runtime artifacts.
