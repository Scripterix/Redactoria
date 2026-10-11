# 018 — Implement verify:article CLI 0.1

Status: COMPLETED — IMPLEMENTED / ESTABLISHED · 2026-10-11

## Authorized scope

Implement the production read-only operator command:

```text
npm run verify:article -- --topic <topic>
```

The command composes the validated article-verification and CONTENT-lineage
contracts. It reads existing SOURCE/LAB/CONTENT and returns human-readable or
schema-valid JSON results with stable exit codes. It never invokes agents, writes
pipeline artifacts, approves, repairs, promotes, publishes, commits, pushes or
deploys.

## Implementation

1. Promotion Gate now exports its existing pure approved-publication renderer, so
   verification reconstructs initial CONTENT without duplicating transform logic.
2. The article result contract contains 27 common and five conditional publication
   checks. Published fixtures validate decision, human approval, promotion audit,
   initial CONTENT, post-promotion lineage, review validity and current CONTENT.
3. Pending candidates keep all five publication checks `NOT_APPLICABLE`.
4. The CLI provides concise human output, exact contract JSON via `--json`, and
   stable exit codes: 0 PASS, 1 verification FAIL, 2 input/configuration error.
5. The topic registry maps the five known lifecycles to existing artifacts; the
   same validation path handles every topic. Optional `--all` was deliberately not
   added because one topic → one result is the bounded priority.

## Real results

```text
php-arrays          PASS — two-record post-promotion lineage
php-control-flow    PASS — current CONTENT equals reconstructed initial promotion
javascript-if-else PASS — publication NOT_APPLICABLE
javascript-arrays  PASS — publication NOT_APPLICABLE
javascript-dom     PASS — publication NOT_APPLICABLE
```

## Tests and quality

- `npm run test`: 330/330 PASS in 25 files.
- `npm run check`: 137 files, zero diagnostics.
- `npm run build`: 11 static pages; Pagefind indexed 10 pages / 1582 words.
- All five required CLI runs: exit 0 / `OVERALL PASS`.
- Unknown topic: clear message, no stack trace, exit 2.
- `--json`: deterministic schema-v1 verification result with 32 checks.
- Broken in-memory fixture: schema-valid `OVERALL FAIL`, exit 1.
- Read-only integration test: loaded pipeline bytes are identical before/after.
- `git diff --check`: PASS apart from existing Windows line-ending notices.
- Protected `content`, candidates, reviews, lineage and promotion-audit paths have
  no tracked diff; SOURCE is read-only and external.

## Documentation/status

- `commands.md` documents usage, JSON, exit codes and read-only Operator Mode.
- `package.json` exposes `verify:article` in npm scripts.
- Architecture, Status, Roadmap, Changelog and Futureboard record the verifier as
  `IMPLEMENTED / ESTABLISHED`.
- Article Manifest remains separate NEXT; Precision Gate/Humanizer were not
  implemented; Dream Cycle/Agentic Circus remain `FROZEN / CONCEPT`.

## Stop boundary

STOP. No JS publication, Knowledge Gap, ranks #5–#10, Article Manifest, Precision
Gate, Humanizer, Interaction Layer, Dream/Agentic work, commit, push or deployment.
