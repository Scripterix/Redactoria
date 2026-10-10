# Exploring ideas

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

- Status: `idea`
- Recorded: 2026-10-09, human feedback after the local website review.
- Add a consistent icon system that fits Redactoria's editorial visual style.
- Specific icons, placement and implementation remain to be chosen. Keep navigation
  understandable and accessible without relying on icons alone.
- Future work only; no icon library or assets added now.

## Media in educational articles

- Status: `exploring`
- Recorded: 2026-10-09, human feedback after the local website review.
- Discuss the role of media in Redactoria EDU before choosing formats or adding assets.
- Open questions: which materials benefit from media, where it belongs in the layout,
  and how to handle provenance, rights, accessibility and page weight.
- No media strategy selected and no media generation or implementation started.
