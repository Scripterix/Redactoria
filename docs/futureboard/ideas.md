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
