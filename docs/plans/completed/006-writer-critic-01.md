# Execution Plan 006: Writer 0.1 + Critic 0.1

## Goal and scope

One PHP arrays pilot: one Writer model run produces a coherent educational draft;
one separate Critic model run evaluates that exact draft against the human-approved
research and mandatory runtime addendum. LAB only. No CONTENT/SOURCE changes,
publication, Publisher, Dispatcher, production LLM API or automatic revision loop.
The requested plan filename is retained; the earlier 006 approval-gate plan remains
a separate historical record.

## Execution

1. Read Project Brain, ADRs, approvals, Cartographer plan/report, Research Packet,
   runtime supplement and both source bodies. Snapshot all existing protected data.
2. Add separate Writer/Critic modules with strict input/output schemas, policies,
   stable prompts, validation, tests and provider-neutral recorded model requests.
3. Reuse safe LAB I/O with narrow draft/review capabilities. Verify approval artifact
   hashes, unchanged targets and provenance before any model work. No agent calls
   another agent or receives write/shell/research tools.
4. Prepare Writer request without inference; import explicit session response;
   execute once. Generate article.json first and article.md from validated data.
   Track section evidence, coverage, source provenance and exact draft hash.
5. Where the existing genuine PHP runtimes are available, manually execute only
   reviewed self-authored standalone draft examples; record actual versions/output
   and expected diagnostics separately. Never execute imported SOURCE Markdown.
6. Prepare Critic request for the saved exact draft, approved research and execution
   evidence; import a distinct session review and execute once. Enforce grounded
   locations, known research evidence and PASS/REVISE/BLOCK consistency. No rewriting.
7. Run test/check/build, verify all protected hashes, update Project Brain and move
   this plan to completed. Stop for human decision even if Critic says REVISE/BLOCK.

## Validation and tests

Approved research and MERGE required; exact unchanged targets/artifacts; PHP 8.4–8.5
scope; nonempty provenance; output-only draft/review actions; no publication or
SOURCE/CONTENT writes. Writer evidence/required coverage and deterministic rendering.
Critic exact draft identity, enum verdict, factual issue location + research evidence,
unknown/forged evidence rejected, explicit needs-research and stable serialization.
All automated tests use fake/recorded responses, without PHP/network/API execution.

## Result

Completed 2026-10-09: implementation and bounded pilot, not editorial acceptance.

- Separate Writer and Critic modules, strict contracts, stable prompts, policies,
  approved-only evidence and narrow LAB draft/review writers are implemented.
- One Writer run produced `lab/drafts/php-arrays/article.json` and `article.md`:
  16 sections, 2506 prose words (fenced code/output excluded), PHP 8.4–8.5, all
  22 required coverage labels. Status remains `draft`.
- Actual manual execution of 17 reviewed draft examples per runtime: PHP 8.4.26
  17/17 PASS and PHP 8.5.11 17/17 PASS. Executable hashes match approved runtime
  evidence. No SOURCE execution or general executor/CI subsystem was added.
- One separate Critic run produced `lab/reviews/php-arrays/critic-review.json`
  and `.md`: **REVISE**, one required `array_reduce()` wording precision correction,
  two optional clarity improvements. No code/security/version issues identified.
  Required change was recorded but not applied; no extra Writer or Critic run.
- Draft SHA-256: `f154a1208ff6b9f5022da5cb97b17382ac75e7803b0f41e58e7bffcef874d616`.
- Writer request hash: `c6dd70d5bf4de93690360654df4861bd9a4067db489fe809136748b05de1f6c3`.
- Critic request hash: `3984c198a337ddd5ae126c95f54439c41aaa46d203934424cc8d8c187f954c87`.
- Both explicit session imports preserve request/response/input hash/provenance.
  Module/role independence is not a claim of an independent model/provider.
- Quality: 174/174 tests in 13 files, check 80 files with zero diagnostics, build
  6 pages. Fifty-one new deterministic tests require no live API, network or PHP.
- All 114 protected hashes unchanged: 83 SOURCE files, 2 CONTENT files, inventory,
  approved MERGE, Research Packet/approval/addenda and Cartographer outputs.
- Project Brain updated; ADR 0003 already covers these boundaries, so no new ADR.
- No CONTENT writes, publication, automatic revision loop, Publisher, Dispatcher,
  production LLM API, commit or push. Next: human decision about the saved correction;
  any edit and subsequent review require a new explicit instruction.

## Human-authorized correction pass — completed

The human has now accepted the required precision correction and authorized one
additional Critic review of the entire revised draft. This is a bounded follow-up,
not an automatic loop or a new full Writer generation.

1. Preserve byte-identical copies of the original draft, code capture and first
   Critic request/response/review; snapshot protected corpus/research/engine files.
2. Replace only the overbroad reduce wording. Apply the two optional clarity fixes
   as prose only: explain the existing fn syntax and label the removal output states.
   Keep every code block, expected output, evidence and original Writer execution.
3. Record the revision and parent/new hashes. Reuse actual PHP 8.4/8.5 results only
   after proving identical example IDs/code/expected output/diagnostics; preserve
   the original capture and execution timestamp. Do not create new runtime cases.
4. Prepare a new hash-bound Critic request and explicit session response; execute
   exactly one new full review. If REVISE/BLOCK, stop with required changes.
5. Only after validated PASS, complete this correction and create the separately
   numbered minimal Milestone 5 plan for an exact LAB publication candidate.
6. Run test/check/build and protected hash checks; record final results. No CONTENT
   writes, publication approval, Cloudflare deployment, Publisher, Dispatcher or Git push.

### Correction result — 2026-10-09

- Required reduce sentence replaced exactly with the human-approved wording. Both
  optional readability fixes applied as prose only. Exactly three body changes;
  final 2559 prose words. No new Writer generation, research or runtime cases.
- Original Writer execution, 17 complete example objects, expected output/diagnostics,
  evidence, coverage and approved provenance unchanged. Seven first-pass archives
  match the preserved bytes. revision.json records the complete parent/change chain.
- Current code-execution projection changes only articleHash. Original actual
  run records, PHP 8.4.26/8.5.11 executable hashes and executedAt are retained.
- One new full Critic pass returned validated **PASS**, no required changes.
  Request hash: `13daadc9d6fe9f2cbb3339b463bfb3360992a059183398190f290b728626138e`.
- Final article SHA-256:
  `713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068`.
- Milestone 4 is now closed technically; the earlier REVISE remains historical.
  Its PASS allowed the separately planned Milestone 5, not publication approval.
- All 174 tests PASS; check 80 files with zero diagnostics; build 6 pages.
  Existing test fixture pins the original REVISE scenario to archived data; runtime
  agent code unchanged. All 114 upstream and 193 extended protected hashes unchanged.
- Stop after candidate preparation. Human publication decision remains pending;
  no CONTENT/Cloudflare/Publisher/Dispatcher/Git commit or push.
