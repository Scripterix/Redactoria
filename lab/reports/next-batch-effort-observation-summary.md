# Next batch — effort map and optimization proposals

Status: **OBSERVATION COMPLETE — NO OPTIMIZATION IMPLEMENTED**

## What the batch used

| Measure | Result |
| --- | ---: |
| Context SOURCE deep reads | 3 |
| Authority Ladder documents | 12 (tier 1: 2; tier 2: 6; tier 3: 4) |
| Manual module runs | 12 (3 each: Cartographer, Researcher, Writer, Critic) |
| Critic revisions | 0 |
| Controlled research probes | 3 |
| Independently executed final examples | 9 |
| Output assertions | 27 |
| New B6 LAB artifacts | 75 files / 824,957 bytes |

All three candidates have an exact Critic `PASS`, three passing final examples,
and publication flags `pending/false`. SOURCE and CONTENT were not modified.

## Relative effort

| Stage | Recorded command wall-clock | Level |
| --- | ---: | --- |
| Selection + contract preflight | 11.2 s | MEDIUM |
| Focused Cartographer | 40.8 s | MEDIUM |
| Authority Ladder research | 45.9 s | MEDIUM |
| Writer + final execution | 42.4 s | MEDIUM |
| Critic + candidate gate | 18.1 s | LOW |
| First repository quality gate | 48.63 s | MEDIUM |
| Final repository quality rerun | 51.55 s | MEDIUM |

Wall-clock is a proxy only. It excludes unobservable model reasoning, billing and
time between commands; it is not a token count.

## Proposals, not implementation

1. **NOW** — retain one contextual SOURCE read and the smallest authority-adequate
   document set per foundation topic.
2. **NEXT** — measure exact request payload duplication before changing LAB storage;
   825 KB alone is not evidence of a real review or clone problem.
3. **NEXT** — reuse a tested execution helper per runtime family while preserving an
   independent final execution artifact per draft.
4. **LATER** — consider content-addressed immutable payloads only after repeated
   evidence of storage/review friction.
5. **NOT WORTH IT** — do not replace manual STOP gates with Dispatcher or automatic
   multi-agent orchestration. This batch's fail-closed checks caught two mismatches
   before an invalid artifact could advance.

The structured record is `next-batch-effort-observation.json`.
