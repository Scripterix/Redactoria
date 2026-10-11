# Architecture overview

## Current model

Redactoria EDU separates source material, editorial work, automation, accepted
content, and publication into explicit boundaries:

```text
SOURCE CORPUS
      ↓
INVENTORY
      ↓
LAB
      ↓
ENGINE
      ↓
CONTENT
      ↓
ASTRO WEBSITE
```

The diagram describes the intended end-to-end direction, not the current level of
implementation. The invariant is:

```text
SOURCE != LAB != ENGINE != CONTENT != WEBSITE
```

### Boundaries

- **SOURCE** — external, read-only historical material. It must never be changed by
  the importer or editorial workflow.
- **INVENTORY** — implemented deterministic metadata derived from SOURCE through
  the read-only scanner in `scripts/legacy/`.
- **LAB** — experimental workspace for inventory, candidates, research, drafts,
  decisions, and reports. LAB files are not public content.
- **ENGINE** — manual runtime agent-modules (Cartographer, Researcher, Writer and Critic) and minimal shared
  contracts/validation/I/O. Full automation and orchestration remain future work.
- **CONTENT** — reviewed material accepted for publication and validated through
  Astro Content Collections.
- **WEBSITE** — Astro publication layer that statically renders accepted content;
  Cloudflare Pages hosts and deploys the static build, outside ENGINE/LAB/runtime agents.

Crossing a boundary requires an explicit, reviewable operation. No current process
automatically moves a LAB draft into CONTENT or grants it publication approval.
Cloudflare builds/deploys the website after a push to master; it does not make
editorial decisions or publish LAB artifacts as articles.

## Implementation status

| Element | Status | Notes |
| --- | --- | --- |
| Astro Website | IMPLEMENTED | Fifteen static routes; HTML/XML sitemap, reading time, copy code, long-form code/tables |
| Static search | IMPLEMENTED | Official Pagefind CLI after Astro build; fourteen public main-content pages, lazy search API on `/szukaj/` |
| Cloudflare Pages deployment | VERIFIED B3 CHECKPOINT | Commit `fb86db7`; fifteen public pages, Pagefind fourteen pages; direct route/search/sitemap review PASS |
| LAB | IMPLEMENTED | Separated workspace with publication rules |
| Content Collections | IMPLEMENTED | `articles` and `topics` |
| Project Brain | IMPLEMENTED | Documentation map and durable project memory |
| Testing foundation | IMPLEMENTED | Vitest and Astro/TypeScript diagnostics |
| Read-only source connection | IMPLEMENTED | Separate local `temp-ogwo/posts` checkout |
| Inventory Scanner | IMPLEMENTED | Versioned metadata, stable identities, SHA-256, and error records |
| Corpus summary | IMPLEMENTED | Deterministic metadata statistics and exact duplicates |
| Cartographer | IMPLEMENTED | Two-pass corpus map or focused two-article MERGE plan, grounded evidence, explicit session import, LAB-only output |
| Researcher | IMPLEMENTED | Approved two-article scope, official evidence snapshot, cited Research Packet, hash-bound session replay, research-only LAB output |
| Writer | IMPLEMENTED | Approved research/addenda to one structured LAB draft; no research/publication |
| Critic | IMPLEMENTED | Separate grounded review of exact draft; PASS/REVISE/BLOCK, no rewrite or loop |
| First publication candidate | PRESERVED IN LAB | Exact second-pass PASS copy; separate human local-only publication approval recorded |
| Second publication candidate | PRESERVED IN LAB | B2 single-source PHP control-flow exact PASS copy; publication pending/false |
| B3 JavaScript candidates | PUBLISHED LOCALLY / PRESERVED IN LAB | Three immutable schema-v3 PASS copies plus separate human decisions, CONTENT and audits |
| Promotion Gate | IMPLEMENTED | Manual deterministic schema 1–3 CLI; validated human scope/hashes/approvals → exact CONTENT + LAB audit; not Publisher |
| Article verification | IMPLEMENTED | Read-only 32-check `verify:article` Operator CLI, human/JSON output and exit codes 0/1/2; all five lifecycles PASS |
| CONTENT lineage validation | IMPLEMENTED | Deterministic replay integrated into verification; PHP Arrays backfill and three current B3 navigation records PASS |
| Engine foundation | IMPLEMENTED | Minimal model port, source reader, validation, stable serialization, safe LAB writer |
| Full Engine | FUTURE | Independent automation and orchestration |
| Dispatcher | FUTURE | Single-step orchestration |
| Runtime agents | PARTIAL | Cartographer, Researcher, Writer and Critic exist; Publisher remains future |
| Multi-site support | FUTURE | Shared Engine serving multiple sites |

## Publication model

The website must remain operational without the future Engine. Git is the editorial
history, and every significant content change should be inspectable as a diff before
merge. Static generation is the default; browser JavaScript is added only for a
specific interactive need.

### Cloudflare Pages deployment

The public test environment is [redactoria.pages.dev](https://redactoria.pages.dev/).
The human-reported successful deployment uses `Scripterix/Redactoria`, production
branch `master`, Astro, build command `npm run build` and output directory `dist`.
The B3 publication build serves fifteen static pages and a fourteen-page Pagefind
index. Commit `fb86db7` passed its Cloudflare check and direct public route, search,
sitemap and responsive verification. Cloudflare is WEBSITE infrastructure, not
an agent runtime, LAB service or part of the Engine.

Content publication remains human-controlled:

```text
Writer → Critic → human review → human approval → explicit LAB → CONTENT
→ Git commit/push → Cloudflare Pages build/deploy
```

Runtime agents cannot write drafts directly into CONTENT, initiate deployment or
authorize publication. Branch/PR previews may be used later; no preview workflow
or Cloudflare-specific runtime code is introduced by this status update.

The reported first build succeeded on Node `22.16.0`, with an engine requirement
warning from `undici@8.11.2` for Node `>=22.19.0`. At the next deployment configuration
update, set `NODE_VERSION=22.19.0` or a newer compatible Node 22.x. This is a pending
configuration recommendation, not a change made here. Existing ADR boundaries suffice;
no new ADR or pipeline change is needed for recording the deployment status.

The detailed accepted decisions are recorded in [ADR 0001](../adr/0001-redactoria-architecture.md),
[ADR 0002](../adr/0002-content-model.md), and [ADR 0003](../adr/0003-runtime-agent-contract.md).

The [inventory contract](inventory.md) documents the current scanner's inputs,
outputs, deterministic behavior, and source-preservation guarantees.

The [Cartographer contract](cartographer.md) documents the implemented agent boundary.
The current branch is `inventory → Cartographer A → selected reads → Cartographer B
→ validation → LAB → STOP`. No current flow moves those artifacts into CONTENT.

The focused branch is `two selected inventory records → two full source reads
→ one focused MERGE analysis → validation → LAB plan/report/proposed decision → STOP`.
It reuses the same agent and model port, never repeats full-corpus analysis, and
never sets a decision to approved or starts research/writing. ADR 0003 already
covers this branch; no new architectural decision or runtime agent is introduced.

The separately authorized [Researcher branch](researcher.md) is `human-approved
MERGE + unchanged focused map + two full reads + official evidence snapshot → one
Researcher request → validation → LAB Research Packet → STOP`. It does not call
Cartographer or start Writer. Documentation capture and controlled code probes are
explicit preparation steps, separate from model interpretation and offline replay.

The [Writer/Critic workflow](writer-critic.md) uses two separately invoked manual
modules, never one agent calling the other. Each performs one model request,
validates structured data and writes its own LAB subtree through the CLI. The PHP
pilot initially stopped at REVISE after one draft and one review. A later explicit
human instruction authorized three small prose changes and one new full Critic
pass, which returned PASS. Milestone 5 then copied that exact reviewed article to
LAB/candidates with hash-bound metadata. That milestone performed no regeneration,
automatic loop, CONTENT write, publication approval, deploy, Dispatcher or new API.

### Explicit local Promotion Gate

A subsequent human instruction authorized **local-publication-test**, not remote
publication. [Promotion Gate](../../engine/promotion/README.md) is a small Engine
tool outside `agents/`, with no model or orchestration. It revalidates candidate,
Critic PASS, exact hashes, human approval, unchanged MERGE/Research approvals,
existing topic and the shared `src/lib/content-schema.ts` before exclusive writes.
Only Content Collection front matter is added; Markdown body remains byte-identical.
Structured LAB audit preserves the complete two-source lineage and all approval refs.

```text
LAB candidate + Critic PASS + hash-bound local human approval
→ npm run promote → CONTENT + LAB audit → Astro localhost → STOP
→ separate human approval now authorizes Search 0.1 / public checkpoint
→ full quality gate → authorized Git commit/push → Cloudflare verification → STOP
```

Astro imports only CONTENT, never LAB/Engine. `published` in the local collection
is visibility to the static renderer, not permission to push. Runtime-agent policies
remain LAB-only. ADR 0001's explicit reviewed transition and ADR 0002's content model
already cover this mechanism; no new ADR, Publisher, Dispatcher or deploy code.

Plan 010 adds Pagefind indexing of generated `dist` HTML only. Public main content
is explicitly tagged; search UI/chrome and all internal repository files are excluded.
The human also approved removing two obsolete LAB/draft notes from the public PHP
body and its local-test banner. The original PASS candidate and promotion audit
retain their exact historical bytes; an exact-diff regression test records this
presentation cleanup. This does not authorize new editorial generation or B1.

A subsequent human instruction separately authorized B1 selection. The bounded
Cartographer branch screens 83 metadata records, reads 19 full shortlisted bodies
and saves ten new pilot-ranked candidates in a separate LAB subtree. Existing PHP
arrays sources are excluded. Eight ordinal estimates and recorded weights drive
deterministic ordering; citation/request validation does not certify technical
correctness. No research, writing, candidate, CONTENT, Git or deployment follows.
The B1 operation itself stopped before B2: one ranked source could proceed only after
separate human review. That later authorization is recorded below. The original
corpus cartography and PHP lineage remain unchanged; ADR 0003 still covers the branch.

The separately authorized B2 branch processes only rank #1 / source 1308. A focused
single-article Cartographer result may recommend KEEP/UPDATE/REWRITE, but cannot fake
MERGE or approve publication. Researcher, Writer and Critic remain separately invoked
manual modules. One required prose correction is preserved as an audit; the second
full Critic pass binds the corrected hash and returned PASS.

Candidate preparation is an explicit deterministic LAB operation outside runtime
agents. Schema v2 uses the generic `sourceDecision` field so the single-source
REWRITE is not mislabeled as MERGE. It validates the exact draft, actual example
evidence, Critic PASS, revision audit and hashes before byte-copying Markdown to
`lab/candidates/php-control-flow/`. This is not Publisher or Promotion Gate and does
not write CONTENT. The B2 comparison records measured counts and `null` for unmeasured
cost/time data; future-layer conclusions remain recommendations, not architecture.

The separately authorized B3 run reuses the same manual Golden Path for B1 ranks
#2–#4 as three isolated jobs. Backward-compatible schema variants describe Node or
browser runtime evidence while historical PHP contracts remain valid. Pure
JavaScript examples execute in Node; the DOM example uses a controlled Chromium
harness. A later explicit human decision authorized exactly these three immutable
schema-v3 candidates for public production. Promotion Gate support was extended only
to runtime-neutral target validation and separate schema-v3 decisions. Each candidate
entered CONTENT through its own audit; three navigation-only post-promotion changes
have append-only lineage. Candidate flags remain historical `pending/false`. No
Publisher, Dispatcher or automatic publication policy was added.
