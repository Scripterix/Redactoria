# 026 — Source Authority Ladder

Status: COMPLETE · 2026-10-12

## Goal

Add the human-approved seven-level Source Authority Ladder to the existing
Researcher → Writer → Critic path without creating a new agent or orchestration
layer. Preserve every historical research artifact and replay contract.

## Scope

- Extend the Researcher source policy to the approved standards, official docs,
  MDN, implementation/platform docs, compatibility data, educational sources and
  Stack Overflow.
- Add a versioned research-bundle source record with explicit authority tier,
  authority class and evidence role.
- Validate source-host classification and reject Stack Overflow as the sole
  evidence for a verified technical claim.
- Teach Researcher, Writer and Critic prompts how to apply the hierarchy.
- Update the Researcher architecture guide, STATUS and changelog.

## Boundaries

- No new runtime agent, validator service, Engine layer or publication behavior.
- No changes to SOURCE, CONTENT or existing LAB artifacts.
- No live research capture and no B4 article processing in this milestone.
- Existing schema-v1/v2 bundles and Research Packets remain valid.

## Verification

Add deterministic tests for the allowed host catalogue, tier/class/role integrity,
historical compatibility, valid supplementary Stack Overflow evidence and rejection
of Stack Overflow-only verified claims. Then run once:

```text
npm run test
npm run check
npm run build
git diff --check
```

## Result

Implemented as a backward-compatible Researcher contract extension:

- New research bundle schema version 3 requires every source to carry
  `authorityTier`, `authorityClass` and `evidenceRole`.
- The closed host catalogue covers TC39/ECMAScript, WHATWG, W3C, RFC/IETF, Node.js,
  TypeScript, Python, Git, curl, GitHub Docs/GFM, MDN, web.dev, Chrome for Developers,
  V8, Can I use, javascript.info, CommonMark and Stack Overflow. Existing php.net
  support remains available for historical and future PHP work.
- Source URL and final URL must be HTTPS, unchanged and consistently classified.
  Tier-7 capture is explicitly labelled `reviewed-problem-content` /
  `problem-signal`; it cannot independently verify a technical finding or runtime
  scope.
- Research Packet source registers preserve and display authority metadata. Writer
  cannot strengthen lower-tier evidence; Critic maps inadequate authority to
  `NEEDS_RESEARCH` under existing review criteria.
- Historical schema-v1/v2 bundles and schema-v1 Research Packets remain valid and
  were not rewritten. SOURCE, CONTENT and existing LAB artifacts were untouched.

Quality gate:

- `npm run test`: PASS — 337 tests / 25 files.
- `npm run check`: PASS — 137 files, 0 errors / warnings / hints.
- `npm run build`: PASS — 15 pages, Pagefind 14 pages / 1800 words.
- `git diff --check`: PASS; only repository line-ending warnings.

This policy removes the previous MDN-heavy evidence restriction for future work,
but it does not change the separate B4 authorization and `verify:article` lifecycle
blocker recorded in plan 025. No article, publication, Git push or deployment was
performed.
