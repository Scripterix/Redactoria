# Next batch — effort observation

Status: **COMPLETE**

Started: 2026-10-16T15:13:37+02:00

## Measurement rule

This is an operational proxy, not token accounting. `wall-clock` means elapsed
time reported by a command or an explicitly timestamped bounded stage. It excludes
unobservable model reasoning, provider billing, user response time and elapsed time
between commands. Relative level is therefore an explanation of the observed work,
not a claim of precise compute use.

| Stage | Scope | Wall-clock | Level | Why |
| --- | --- | ---: | --- | --- |
| Orientation | Read active architecture, agent contracts, roadmap, ADRs, Futureboard and current state | 3.1 s recorded commands | MEDIUM | Several long durable documents; no runtime or network execution. |
| Structural selection | Read frozen Knowledge Gap 0.2 runs, current PUBLIC inventory and B4/B5 precedent | 4.0 s recorded commands | MEDIUM | Cross-checking several large, immutable LAB artifacts and current CONTENT prevents a stale or duplicate queue. |
| Contract preflight | Read focused-article, Researcher, Writer, Critic and candidate schemas | 2.1 s recorded commands | MEDIUM | Identified that `CREATE_NEW` cannot truthfully pass through the existing rewrite-only single-source variant. |
| B6 focused Cartographer | Three full SOURCE context reads, prepared requests and validated responses | 40.8 s recorded commands | MEDIUM | One response pass failed closed for two non-verbatim evidence fragments; both were corrected before writes. |
| B6 Authority Ladder research | 12 HTTPS document captures, 3 controlled probes, 3 Researcher requests/packets | 45.9 s recorded commands | MEDIUM | Four authority-adequate documents per topic resolved all listed questions without MDN-only research. |
| B6 Writer + final runtime | 3 Writer runs and 9 independently executed final examples | 42.4 s recorded commands | MEDIUM | A runtime-neutral PHP language guard failed closed, then was narrowed to the explicit `php-cli` target only. |
| B6 Critic + candidate | 3 Critic runs and 3 deterministic candidate gates | 18.1 s recorded commands | LOW | All full reviews PASS with no revision loop; candidate gates retained `pending/false`. |
| B6 quality gate | 362 Vitest tests, Astro check and production build | 48.63 s observed | MEDIUM | Tests: 16.59 s; check: 22.14 s; build: 9.90 s. All passed after the final candidate artifacts existed. |
| B6 final verification rerun | 362 Vitest tests, Astro check and production build after documentation closure | 51.55 s observed | MEDIUM | Tests: 18.25 s; check: 23.30 s; build: 10.00 s. All passed. |

## Recorded result

- The complete observation map, including 75 LAB artifacts (824,957 bytes),
  repeated-context notes and recommendations only, is in
  [`next-batch-effort-observation.json`](next-batch-effort-observation.json) and
  [`next-batch-effort-observation-summary.md`](next-batch-effort-observation-summary.md).
