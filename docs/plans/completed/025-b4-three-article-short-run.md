# 025 — B4 three-article short run

Status: CLOSED — BLOCKED · 2026-10-12

## Authorized scope

Process the next three existing B1 selections through the established manual
pipeline and publish them only if all three receive final Critic PASS and existing
promotion/verification contracts support their lifecycle:

1. rank #5 / source 48 — Markdown,
2. rank #6 / source 281 — JavaScript Calculator,
3. rank #7 / source 578 — API / HTTP / JSON.

For each item:

```text
SOURCE → Cartographer → Researcher → Writer → Critic → Candidate
→ human publication decision → Promotion Gate → CONTENT → verification
```

The user's B4 instruction is the bounded human authority to process and, after all
required PASS checks, publish these three specific items in the listed order.

## Constraints

- Reuse existing agent contracts, Candidate schema, Promotion Gate and
  `verify:article`; no new agent, validator, contract spike or Engine layer.
- Preserve SOURCE as read-only and retain exact provenance/hashes.
- Prefer CommonMark/GFM, ECMAScript/MDN, WHATWG Fetch/current HTTP RFC/RFC 8259 as
  specified by the human; use only enough sources to verify claims.
- Use `null`, `unknown` or `needs-review` for unavailable measurements.
- Keep each job independent and stop any unsupported lifecycle before changing
  architecture.
- Run the full quality sequence once after the complete three-item run.
- Update only STATUS, this plan and required publication/changelog records.

## Verification planned

1. Confirm exact B1 records and unchanged SOURCE hashes.
2. Validate every stage with existing contracts and execute applicable examples.
3. Require final Critic PASS and exact reviewed candidates for all three.
4. Promote sequentially only with hash-bound human publication decisions.
5. Run once: `npm run test`, `npm run check`, `npm run build`, `git diff --check`.
6. Run `verify:article` for every new topic only if the existing registry supports it.
7. Perform a small browser smoke test after the final build.
8. If the entire checkpoint passes, commit, push `origin/master` and verify the
   Cloudflare deployment.

## Result

The preflight contract check blocked all three jobs before new pipeline artifacts
were written.

1. B1 identities were confirmed exactly:
   - rank #5, source 48, SHA-256 `8acfe3003445f48dc262e3e475da55c29360b715902cdd1de76a093e73dfb817`,
   - rank #6, source 281, SHA-256 `4740eac41f4886772f1a4908ba3dfc11365bc384734fb65290ea547d7bf53813`,
   - rank #7, source 578, SHA-256 `161efccbf72c77b0fd87280c7adc963f7d5a7b675f72f70756b2af1b51bcbf13`.
2. `ApprovedArticleDecisionV3Schema` and B3 research acceptance require the literal
   historical `lab/decisions/b3-authorization.json`. Its validator allows exactly
   three B3 jobs and `scripts/b3-cartographer.ts` maps them only to B1 ranks #2–#4.
3. The only alternative bounded schema-v2 path is rejected by `editorialBasis`
   unless `input.config.topic === 'php-control-flow'`.
4. `verify:article` exposes a closed registry containing only PHP Arrays, PHP
   Control Flow and the three B3 JavaScript topics. All proposed B4 topics are
   unknown to the current operator contract.
5. Reusing or rewriting historical B2/B3 approvals would falsify provenance.
   Extending these schemas/registries would be a contract change explicitly
   prohibited by this short-run instruction.

Therefore Markdown, JavaScript Calculator and API / HTTP / JSON remain `NOT RUN`:
no Research Packet, draft, Critic verdict, candidate, publication or deployment
exists. The final quality gate, Git push and Cloudflare check were not applicable
because the three-item run never entered implementation. SOURCE remained read-only;
only this plan and STATUS were updated to record the blocker.

STOP before any architecture or contract change.
