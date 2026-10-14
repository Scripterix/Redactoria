# 027 — B4 minimal contract extension and publication

Status: COMPLETED · 2026-10-13

## Objective

Extend the existing schema-v3 single-article lifecycle only as required for B1
ranks #5–#7, then process and publish them sequentially:

1. Markdown — source 48,
2. JavaScript Calculator — source 281,
3. API / HTTP / JSON — source 578.

## Authorized contract change

- Add one immutable B4 batch authorization while preserving the historical B3
  authorization and schema-v3 artifacts.
- Allow that exact authorization reference in the existing schema-v3 decision and
  research-acceptance contracts.
- Add only the runtime/example vocabulary needed by Markdown.
- Add three explicit `verify:article` registry entries and matching tests.

No new agent, pipeline semantics, Promotion Gate semantics, auto-discovery,
Article Manifest or general refactor.

## Pipeline

For each topic, in order:

```text
SOURCE → Cartographer → Researcher → Writer → Critic → Candidate
→ human-approved publication decision → Promotion Gate → CONTENT
→ verify:article
```

Every Research Packet uses schema-v3 Source Authority Ladder evidence. Stack
Overflow may be captured only as supplementary problem-signal evidence and is not
required when authoritative sources already cover the claims.

## Done criteria

- Three final Critic verdicts PASS and exact candidates.
- Three explicit human publication records bind exact candidate/review hashes.
- Promotion Gate publishes without overwriting or weakening validation.
- All eight registered lifecycles PASS.
- `npm run test`, `npm run check`, `npm run build` and `git diff --check` PASS.
- Commit, push `origin/master`, Cloudflare production verification and public URLs
  recorded.

## Result

- Existing schema v3 was extended with one exact B4 authorization and three allowed
  topics; no new schema version, agent, pipeline semantics or Promotion Gate change.
- All three origins: `MODERNIZE` / single-source `REWRITE`.
- Research: CommonMark + GFM; TC39 + MDN; WHATWG Fetch + RFC 9110 + RFC 8259 + MDN.
- Three Writer drafts; all final Markdown/JavaScript examples PASS in controlled
  CommonMark 0.31.2 or local Node 24.16.0 execution.
- Critic: PASS / PASS / PASS, zero required changes. Three exact candidates and
  separate hash-bound human publication decisions.
- Promotion Gate: `PROMOTED_PUBLIC` for Markdown, JavaScript Calculator and
  API / HTTP / JSON; CONTENT and structured audits created.
- `verify:article`: 8/8 PASS. `npm run test`: 345/345. `npm run check`: 0
  diagnostics. `npm run build`: 19 pages; Pagefind 18 pages / 2063 words.
  `git diff --check`: PASS.
- Browser smoke: all three routes render, no console error or horizontal overflow;
  mobile back-to-top is fixed with a transparent background.
- Commit `828703ef54f7624f34eabe557c1c22df13688355` was pushed to
  `origin/master`. On 2026-10-13 the production listing and all three Cloudflare
  Pages routes returned HTTP 200 with their expected titles and article content:
  `/artykuly/markdown-podstawy/`, `/artykuly/kalkulator-w-javascript/` and
  `/artykuly/api-http-json/`.
