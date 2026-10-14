# B5 queue verification — ranks #8–#10

Status: **PASS / 3 PROCEED / 0 REPLACE / 0 STOP**
Date: 2026-10-13

## Result

The remaining B1 TOP 10 entries are three existing candidates, not one candidate
plus two missing selections. Their SOURCE files are byte-identical to the bodies
read during B1. The current nine-article CONTENT snapshot does not invalidate any
of the proposed scopes, so no replacement search is needed.

| Rank | Candidate | Decision | Boundary |
| --- | --- | --- | --- |
| #8 | Git locally — source 277 | PROCEED | Temporary local repository only; no push, destructive reset, merge or global config |
| #9 | curl and HTTP — source 1336 | PROCEED | Terminal inspection of a controlled local endpoint; distinct from the published browser `fetch` article |
| #10 | Python fundamentals — source 283 | PROCEED | Pure deterministic language basics; no scraping, AI packages, random game or C comparison |

## Runtime readiness

- Git `2.21.0.windows.1` is available for an isolated temporary repository.
- curl `8.13.0` is available as explicit `curl.exe`, avoiding the PowerShell alias.
- Python `3.14.5` and `3.11` are available for two-version example checks.

## Editorial assessment

### #8 Git locally

Current CONTENT has no Git lesson. The legacy body is mostly Gist promotion and an
uncurated command list, so the job must be a bounded rewrite. Official Git docs and
an exact disposable-repository transcript can support `init`, working tree/index,
`status`, `add`, `diff`, `diff --cached`, `commit` and `log` without network access.

### #9 curl and HTTP

This is the only candidate with material overlap. The published API article teaches
browser-side `fetch`, HTTP error status, JSON parsing and network failure. B5 may
proceed only as a terminal-observation lesson: one local endpoint, response headers,
status output and JSON. Authentication, cookies, proxy, cron, public demo APIs and
the broad curl/wget comparison remain out of scope.

### #10 Python fundamentals

Current CONTENT has no Python entry layer. The source mixes fundamentals with a
random game, scraping, third-party packages and marketing. The accepted scope keeps
only values, types, `if`, `range`, functions, indentation and deterministic stdout.
A public article would later require an explicit `python` topic and separate human
publication authority; neither is created by this verification.

## Gate

Queue acceptance authorizes bounded Cartographer, Researcher, Writer, runtime
verification, Critic and exact pending candidate work. It does not authorize
CONTENT, publication decisions, Git push or deployment. A later job may still stop
with `needs-review`, `BLOCK`, or no candidate.

Structured evidence: [b5-queue-verification.json](b5-queue-verification.json).
