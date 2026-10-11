# Plan 014 — B3: three bounded JavaScript pipeline samples

Status: COMPLETED — 2026-10-11

## Goal

Process B1 ranks #2–#4 as three independent bounded jobs, in order:

1. JavaScript if/else — source 2068,
2. JavaScript Arrays — source 2048,
3. DOM — source 940.

Each job follows the existing Golden Path through an exact Critic-PASS publication
candidate in LAB, then stops. After all three, produce one five-sample comparison
covering PHP Arrays, PHP Control Flow and the three B3 jobs.

## Human-authorized scope

The user's B3 instruction authorizes focused Cartographer, official research,
deterministic/runtime verification, Writer, Critic, a limited correction and one
new full Critic when required, and candidate creation for these three sources. It
also authorizes research-to-Writer continuation after validated packets without a
separate human gate for each job.

It does not authorize Promotion Gate, CONTENT changes, publication, Git commit or
push, deployment, B1 ranks #5–#10, Knowledge Gap 0.1, or any Futureboard layer.

## Boundaries

- Preserve `SOURCE != LAB != ENGINE != CONTENT != WEBSITE`.
- Read exactly one complete SOURCE body per job; keep SOURCE byte-identical.
- Do not rerun the full 83-article Cartographer analysis.
- Keep job artifacts and metrics separate.
- Preserve historical PHP/B1/B2 artifacts and their validation.
- Keep the existing four agent modules and manual recorded-session workflow.
- Do not add Publisher, Dispatcher, orchestration, Article Manifest,
  `verify:article`, Precision Gate, Humanizer, Interaction Layer, Knowledge Gap,
  Dream Cycle or content-addressed LAB.
- Use `null` or `unknown` for unavailable model, token, cost or timing data.

## Implementation plan

1. Snapshot protected SOURCE/CONTENT and historical artifacts. Record the exact B1
   targets, source hashes and authorization for all three jobs.
2. Make the smallest backward-compatible contract extension needed for JavaScript:
   generic runtime targets and execution evidence plus bounded B3 authorization.
   Historical PHP schema-1 artifacts must continue to validate unchanged.
3. For each job, sequentially:
   - create and validate focused single-source Cartographer output,
   - capture reviewed official MDN/ECMAScript evidence and create a validated
     Research Packet,
   - run controlled Node probes where behavior is runtime-independent,
   - create one grounded Writer draft with 2–4 metadata-only interactions,
   - execute all sensible examples; keep browser-only limitations explicit,
   - run a full Critic review, apply only required targeted changes if any, and
     perform one new full review on the new hash,
   - create an exact pending/false LAB candidate and record per-job metrics,
   - run deterministic job validation and stop before starting the next job.
4. For DOM, use a controlled browser check only where Node cannot establish DOM
   behavior; do not add general browser E2E tooling to the repository.
5. Produce a final five-sample comparison separating Quality Gaps from Knowledge
   Gaps and recording only measured/known metrics.
6. Run the complete repository gate: tests, Astro check and build. Recheck SOURCE,
   CONTENT, replay/candidate integrity and protected historical hashes.
7. Update Project Brain, roadmap, changelog and architecture notes. Move this plan
   to `docs/plans/completed/` only after all three candidates and the final report
   pass. STOP without publication or Git/deployment actions.

## Result

Completed as three sequential jobs. Each used exactly its authorized B1 source,
official MDN evidence and a hash-bound recorded-session replay. The if/else and
Arrays examples passed on Node 24.16.0; the DOM example passed a controlled
Chromium 154 check. Every first full Critic review returned PASS, so no conditional
correction or second review was needed. Exact schema-v3 candidates are preserved
under `lab/candidates/` with publication pending/false.

Per-job metrics and `lab/reports/b3-five-sample-comparison.{json,md}` record the
five-sample comparison. Unavailable elapsed time, token use and exact model ID are
recorded as `null`/unknown rather than estimated. Promotion Gate still accepts only
its historical schemas and explicitly rejects B3 schema v3. SOURCE, CONTENT, B1
ranking and historical PHP hashes are unchanged. Final quality gate: 287 tests in
22 files, Astro check over 128 files with zero diagnostics, and build PASS with 11
static pages plus a 10-page Pagefind index.
