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
- **ENGINE** — manual runtime agent-modules (Cartographer and Researcher) and minimal shared
  contracts/validation/I/O. Full automation and orchestration remain future work.
- **CONTENT** — reviewed material accepted for publication and validated through
  Astro Content Collections.
- **WEBSITE** — Astro publication layer that statically renders accepted content.

Crossing a boundary requires an explicit, reviewable operation. No current process
automatically moves a LAB draft into CONTENT or publishes it.

## Implementation status

| Element | Status | Notes |
| --- | --- | --- |
| Astro Website | IMPLEMENTED | Six static routes and shared layouts |
| LAB | IMPLEMENTED | Separated workspace with publication rules |
| Content Collections | IMPLEMENTED | `articles` and `topics` |
| Project Brain | IMPLEMENTED | Documentation map and durable project memory |
| Testing foundation | IMPLEMENTED | Vitest and Astro/TypeScript diagnostics |
| Read-only source connection | IMPLEMENTED | Separate local `temp-ogwo/posts` checkout |
| Inventory Scanner | IMPLEMENTED | Versioned metadata, stable identities, SHA-256, and error records |
| Corpus summary | IMPLEMENTED | Deterministic metadata statistics and exact duplicates |
| Cartographer | IMPLEMENTED | Two-pass corpus map or focused two-article MERGE plan, grounded evidence, explicit session import, LAB-only output |
| Researcher | IMPLEMENTED | Approved two-article scope, official evidence snapshot, cited Research Packet, hash-bound session replay, research-only LAB output |
| Engine foundation | IMPLEMENTED | Minimal model port, source reader, validation, stable serialization, safe LAB writer |
| Full Engine | FUTURE | Independent automation and orchestration |
| Dispatcher | FUTURE | Single-step orchestration |
| Runtime agents | PARTIAL | Cartographer and Researcher exist under `engine/agents/`; other agents remain future |
| Multi-site support | FUTURE | Shared Engine serving multiple sites |

## Publication model

The website must remain operational without the future Engine. Git is the editorial
history, and every significant content change should be inspectable as a diff before
merge. Static generation is the default; browser JavaScript is added only for a
specific interactive need.

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
