# Exploring ideas

## Observation: Pedagogy / article-input evidence

**Status:** `OBSERVE`

Pedagogy 0.1 records a learner persona, Teaching Plan and distinct
`ENGINE_WRITTEN`, `HUMAN_WRITTEN` and `GPT_ASSISTED_EXTERNAL` routes. It is not an
implemented Engine schema or agent. The supplied Google AI Search body demonstrates
why content creation and verification must stay separate. Gather independent cases
before proposing a shared contract, manifest or automation.

The following concepts are exploratory. They are not current implementation
requirements.

## Cross-site Knowledge Core

- Status: `exploring`
- Hypothesis: one validated observation or research result could support several
  specialized sites without duplicating the underlying knowledge.

## Multi-site Engine

- Status: `exploring`

```text
Engine
├── EDU
├── Money
├── HB
└── future sites
```

The common Engine could operate on separate Site Contexts while each site keeps its
own topic, sources, editorial rules, and publishing adapter.

## Single-Step Agent Loop

- Status: `exploring`

```text
WAKE
  ↓
READ JOB
  ↓
RUN ONE AGENT
  ↓
VERIFY
  ↓
SAVE
  ↓
STOP
```

The default execution would remain bounded to one job and one agent branch.

## Domain Packs

- Status: `exploring`
- Hypothesis: domain sources, ontology, quality rules, and editorial policy should
  be configuration rather than hardcoded Engine behavior.

## Scheduled Task Dispatcher

- Status: `exploring`
- Hypothesis: a scheduled task should wake the Engine and select one bounded job,
  not execute an entire autonomous publishing pipeline.

## Shared LAB Knowledge

- Status: `exploring`
- Hypothesis: reviewed LAB knowledge could eventually support more than one site
  while publication decisions remain site-specific.

## Article reading time

- Status: `implemented`
- Recorded: 2026-10-09, human feedback after the local website review.
- Show estimated reading time in the article metadata below the title, immediately
  after the author, e.g. “8 min czytania”.
- Accepted and implemented: 2026-10-10, by explicit human instruction.
- Deterministic build-time rule: 220 prose words/minute plus 12 non-empty fenced-code
  lines/minute, rounded up to at least one minute. No client JavaScript or manual field.
- Result and quality evidence: [completed plan 009](../plans/completed/009-reading-time-and-website-utilities.md).

## Website icons

- Status: `partially implemented`
- Recorded: 2026-10-09, human feedback after the local website review.
- Add a consistent icon system that fits Redactoria's editorial visual style.
- First bounded use accepted and implemented on 2026-10-12: inline SVG icons for
  header Search and the article back-to-top control. Visible labels remain available,
  the SVGs are decorative, and no icon dependency or client JavaScript was added.
- A broader reusable icon system, additional placements and media strategy remain
  future work. Evidence: [completed plan 022](../plans/completed/022-header-search-and-article-controls.md).

## Media in educational articles

- Status: `experiment`
- Recorded: 2026-10-09, human feedback after the local website review.
- Discuss the role of media in Redactoria EDU before choosing formats or adding assets.
- Open questions: which materials benefit from media, where it belongs in the layout,
  and how to handle provenance, rights, accessibility and page weight.
- Featured Image 0.1 established the shared 16:9 hero/thumbnail contract and fallback.
  Two human-supplied PHP illustrations and nine human-directed generated
  illustrations now exercise article-specific media. The human has selected an
  expanded but closed palette and detailed soft-comic language from the latter
  sets; visual frame 0.2 records its limits. The latest set covers Python, local
  Git and curl/HTTP. All generated sets record prompts, references, file hashes,
  alt text and metadata-only CONTENT lineage; all affected lifecycle and browser
  checks pass.
- The experiment does not establish an automatic generator or complete media
  strategy. API cost/retry evidence, selection criteria for future articles and a
  durable source-master policy remain open.
