# PHP arrays — first publication candidate

State: **AWAIT HUMAN PUBLICATION DECISION**. This is not public CONTENT and is not
approved-for-publication or published. No Publisher, deploy, commit or push.

`article.md` is a byte-identical copy of the revised Writer draft reviewed by the
full Critic second pass. SHA-256:
`713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068`.
2559 prose words, 16 sections, PHP 8.4–8.5. No content generation during promotion.

`article.json` is the strict candidate contract, with `candidate.schema.json` as
its persisted JSON Schema. It contains the complete exact `reviewedDraft`, hashes
of the article/draft metadata/review/revision, approved source/research provenance,
original Writer execution, and the separate second Critic execution.
Status is only `publication-candidate`; `criticVerdict: PASS`,
`readyForHumanPublicationDecision: true`, `humanPublicationDecision: pending`,
`approvedForPublication: false`, `published: false`.

Gate validation checked the existing strict Writer/Critic contracts, matching
request/input/draft/review hashes and exact Markdown bytes before copying.
Eight negative checks rejected published/approved states, non-PASS, unready state,
forged article/review hashes and unreviewed Markdown. No production publisher code
or automatic promotion workflow was implemented.

## Revision and runtime evidence

- [Revision audit](../../drafts/php-arrays/revision.json): one required reduce
  precision fix and two optional prose-only readability fixes, all applied.
- Original draft retained as `article-001.json/md`; original Writer request/response
  and execution unchanged. No full Writer regeneration or new model call.
- All 17 example objects, code, expected stdout and diagnostics unchanged.
  Original `code-execution-001.json` remains byte-identical. Current capture changes
  only articleHash to reflect revised prose, retaining actual original run records
  and executedAt. No PHP reruns or artificial new runtime cases.
- [Final Critic review](../../reviews/php-arrays/critic-review.md): **PASS**, one
  new full review, no required changes. Initial REVISE request/response/review
  retained as `*-001` files; the second pass has its own bound request/response.

Critic is a separate module/role in the same Codex session/model, not an independent
provider. Passing examples are not a complete application/security or every-patch
test. Publication still requires a separate explicit human decision.

## Quality gate

174/174 tests in 13 files PASS; check 80 files, zero diagnostics; build 6 static pages.
The existing Critic test fixture is pinned to preserved first-pass REVISE data.
All 114 required upstream artifact hashes are unchanged; SOURCE has 83 files and
CONTENT has 2. Extended protection: 193 unchanged hashes, with only that deliberate
test fixture update; all 194 original upstream/engine/script/test paths remain.
Candidate/draft/review/revision validation and seven archive-byte comparisons PASS.
