# 008 — Local promotion + website refinement

Status: COMPLETED — LOCAL WEBSITE REVIEW READY · 2026-10-09

## Authorized scope

Execute the human-approved local publication test through a deterministic Promotion
Gate CLI, not manual copying. Preserve the exact Critic PASS candidate and all
upstream LAB/SOURCE artifacts. Improve the existing Astro website and introductory
content. Stop at localhost visual review; no commit, push or Cloudflare deployment.

## Plan

1. Share the existing Content Collection schema with the gate; validate candidate,
   Critic, human decision, MERGE, Research, hashes, topic and slug before writing.
2. Add an exclusive, audited CONTENT promotion and offline negative-path tests.
3. Record the local-only human approval and run the gate for PHP arrays.
4. Expand Start/About, five-column footer, homepage cards and long-article styles.
5. Run test → check → build, inspect desktop/mobile localhost and internal links.
6. Update Project Brain, compare protected hashes and hand off local review URLs.

## Acceptance / stop

No LLM/API, no Publisher/Dispatcher, no content regeneration. Candidate Markdown
must remain byte-identical after technical front matter. Failed validation writes
nothing to CONTENT. Existing LAB artifacts remain unchanged. Local visual review
does not authorize production publication.

## Result

- Generic manual CLI implemented under `engine/promotion/`, outside runtime agents.
- Separate human approval: approved / human / local-publication-test; exact candidate
  JSON + article + Critic hashes. Original candidate and upstream approvals untouched.
- Gate successfully executed the exact candidate; front matter only. PHP body hash:
  `713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068`.
- JSON-first execution record plus human audit under LAB/reports preserve both sources,
  all evidence/approval references, destination and exact hashes.
- Start/About expanded; own-CSS five-column footer, three homepage columns with
  transparent placeholders, existing design tokens and semantic internal links.
- PHP: 16-section no-JS contents disclosure, one visible H1, lead/meta, 34 rendered
  code/output blocks, three tables, readable typography and contained horizontal scrolling.
- Checks: 221 tests / 14 files (47 new gate tests); check 85 files with zero diagnostics;
  build exactly 8 pages. No LLM, additional research, PHP execution or article regeneration.
- Browser review via available Playwright fallback because the browser skill's Node REPL
  connection was unavailable: 8 routes × 1440/768/390/320 px = 32 passing checks;
  39 unique internal links/anchors valid. Footer 5/2/1. Fixed body minimum width,
  listing header grid and mobile tables after observing real overflow/cramped cells.
- Protected SHA-256 snapshot: 137/137 SOURCE + original LAB files unchanged.
  CONTENT changes only expanded Start + promoted PHP + PHP topic. LF checkout policy
  now preserves the promoted body hash across Windows checkouts.
- No new ADR: ADR 0001/0002 cover the human-authorized transition and schema;
  ADR 0003 runtime agents remain LAB-only. No Publisher/Dispatcher added.

## Local review URLs

| Page | URL |
| --- | --- |
| HOME | http://localhost:4321/ |
| START ARTICLE | http://localhost:4321/artykuly/start-redactoria-edu/ |
| ABOUT | http://localhost:4321/o-projekcie/ |
| PHP ARRAYS | http://localhost:4321/artykuly/tablice-w-php/ |
| ARTICLES | http://localhost:4321/artykuly/ |
| TOPICS | http://localhost:4321/tematy/ |

Dev server left running in Astro background mode. `npm run astro -- dev status`
confirms localhost:4321. Local captures in ignored `.playwright-mcp/` are review
artifacts, not CONTENT or website assets. The Astro developer toolbar appears only
in dev mode; no user/global preference or deployment configuration changed.

## Files created in this increment

- `engine/promotion/contract.ts`, `gate.ts`, `README.md`
- `scripts/promote.ts`, `tests/integration/promotion.test.ts`
- `src/lib/content-schema.ts`, `content/topics/php.yaml`
- `lab/decisions/php-arrays-publication.json`
- `content/articles/tablice-w-php.md` — exclusively by the gate
- `lab/reports/tablice-w-php-promotion.json` / `.md` — exclusively by the gate
- this completed plan; ignored local browser captures

## Files modified in this increment

- `package.json`, `.gitignore`, `.gitattributes`
- `src/content.config.ts`, `src/styles/global.css`
- `src/layouts/ArticleLayout.astro`
- `src/components/core/Footer.astro`
- `src/components/content/ArticleMeta.astro`, `ArticleCard.astro`
- `src/pages/index.astro`, `o-projekcie.astro`, `artykuly/index.astro`, `artykuly/[slug].astro`
- `content/articles/start-redactoria-edu.md`
- `README.md`, `docs/STATUS.md`, `docs/index.md`, `docs/architecture/overview.md`,
  `docs/roadmap/ROADMAP.md`, `docs/changelog/CHANGELOG.md`, `docs/plans/active/README.md`

Pre-existing M4/M5 uncommitted changes were preserved, not absorbed into a commit
or reverted. No git commit, push, merge, remote publication or Cloudflare deploy.

## Next human gate / STOP

Inspect localhost and give feedback. Only a separate explicit YES may authorize
Codex to commit and push origin master, leading to Cloudflare's automatic deployment.
No further development or runtime-agent execution begins automatically.
