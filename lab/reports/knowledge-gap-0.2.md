# Knowledge Gap 0.2 — blind discovery and ablation

Status: **LAB DIAGNOSIS — HUMAN REVIEW REQUIRED**

Date: 2026-10-11

Question: **Czego najbardziej brakuje obecnej bazie wiedzy Redactoria EDU?**

No article, candidate or publication action was performed. Run A was serialized and
frozen before Strategic Memory was opened. Knowledge Gap 0.1 and Futureboard were
excluded from both runs.

Canonical artifacts:

- [`knowledge-gap-0.2-run-a.json`](../knowledge-gaps/knowledge-gap-0.2-run-a.json)
- [`knowledge-gap-0.2-run-b.json`](../knowledge-gaps/knowledge-gap-0.2-run-b.json)

## 1. Methodology

Run A used only:

- current PUBLIC content;
- three PENDING JavaScript candidates, never counted as public;
- all 83 inventory metadata records;
- the current Knowledge Map;
- explicit prerequisite relations in focused article analyses;
- 12 bounded SOURCE deep reads selected only to test plausible gaps and acquisition
  origins.

Run A excluded Strategic Memory, roadmaps, Futureboard, Knowledge Gap 0.1 and earlier
expected-gap prompts. Its frozen SHA-256 is
`98542ccd4bafc59a466a3180f8149822dad3c67bb8355789611bb3bc92bfacef`.

Run B reused the exact factual evidence and added only checkpoint `dfccf0c` versions
of the accepted Roadmap, historical B1 selection plan, Pipeline Review plan and
STATUS. The current uncommitted STATUS was excluded because it contains later gap
results. No separately named Project Master, OGW historical roadmap or cluster plan
was found. Strategic Memory could reorder or suggest a hypothesis, but could not
prove that content exists or that a technical statement is correct.

A Knowledge Gap is a missing node or relation in a learnable sequence. Article
errors, citation gaps, runtime-evidence gaps and outdated claims were excluded as
Quality Gaps. Ranking used qualitative P1/P2/P3 bands rather than a numeric score.

## 2. Source coverage

| Measure | Result |
| --- | ---: |
| Inventory records inspected | 83 / 83 |
| Full SOURCE bodies read in Run A | 12 |
| Bodies not read | 71 |
| TOP 10 gaps with body evidence | 10 |
| TOP 10 gaps based only on metadata in Run A | 0 |
| New Run B gap based only on fixed metadata + strategy | 1 |

The 12 full reads were sources 281, 977, 542, 551, 2070, 410, 578,
`path:143…`, 981, 283, 277 and 1575. They cover the plausible foundations,
bridges and acquisition options needed for the TOP 10. Reading all 83 bodies would
have exceeded the bounded verification need.

Run B's Markdown hypothesis is explicitly metadata-only in the fixed ablation
evidence set. The B1 plan makes it strategically visible, but does not turn that
metadata into body evidence.

## 3. Run A — blind TOP 10

| # | Proposed topic | Type | Origin | Priority | Confidence |
| ---: | --- | --- | --- | --- | --- |
| 1 | PHP od pierwszego skryptu: zmienne, wartości, typy, operatory i CLI | FOUNDATION | CREATE_NEW | P1 | HIGH |
| 2 | JavaScript od pierwszego uruchomienia: wartości, zmienne, typy i operatory | FOUNDATION | CREATE_NEW | P1 | HIGH |
| 3 | Funkcje i callbacki JavaScript przed tablicami i zdarzeniami | SEQUENCE | MODERNIZE | P1 | HIGH |
| 4 | Struktura HTML, atrybuty, klasy i selektory przed DOM | PREREQUISITE | CREATE_NEW | P1 | HIGH |
| 5 | Konsola, komunikaty błędów i minimalny przypadek | BRIDGE | CREATE_NEW | P2 | HIGH |
| 6 | HTTP, JSON i asynchroniczny fetch między DOM a API | BRIDGE | MERGE | P2 | HIGH |
| 7 | Testowanie małych funkcji: przypadki, granice i regresje | BRIDGE | CREATE_NEW | P2 | MEDIUM |
| 8 | TypeScript przed Angularem | PREREQUISITE | CREATE_NEW | P2 | HIGH |
| 9 | Python: wartości, warunki, pętle i funkcje | COVERAGE | MODERNIZE | P3 | MEDIUM |
| 10 | Git lokalnie: status, staging, diff, commit i historia | FOUNDATION | MERGE | P3 | MEDIUM |

The top four are direct prerequisites for current PUBLIC/PENDING material. Debugging
is supported by all five executable lifecycles and the discovery that the apparent
console SOURCE is empty. API has two complementary full bodies. Testing is derived
from repeated expected-output structures, not a roadmap. Python and Git open mapped
SOURCE-only islands but do not currently block multiple articles.

Run A origins: **2 MODERNIZE / 2 MERGE / 6 CREATE_NEW**.

## 4. Run B — Strategic Memory TOP 10

| # | Proposed topic | Change from A | Origin | Priority | Confidence |
| ---: | --- | --- | --- | --- | --- |
| 1 | PHP language foundation | unchanged | CREATE_NEW | P1 | HIGH |
| 2 | JavaScript language foundation | unchanged | CREATE_NEW | P1 | HIGH |
| 3 | JavaScript functions and callbacks | unchanged | MODERNIZE | P1 | HIGH |
| 4 | HTML/selectors before DOM | unchanged | CREATE_NEW | P1 | HIGH |
| 5 | HTTP/JSON/async bridge | ↑ from 6 | MERGE | P2 | HIGH |
| 6 | Debugging feedback loop | ↓ from 5 | CREATE_NEW | P2 | HIGH |
| 7 | Local Git workflow | ↑ from 10 | MERGE | P2 | MEDIUM |
| 8 | Python foundation | ↑ from 9 | MODERNIZE | P2 | MEDIUM |
| 9 | TypeScript before Angular | ↓ from 8 | CREATE_NEW | P3 | HIGH |
| 10 | Markdown authoring foundation | new | MODERNIZE | P3 | LOW |

Run B origins: **3 MODERNIZE / 2 MERGE / 5 CREATE_NEW**.

No shared gap received higher confidence. The Strategic Memory artifacts derive
from the same project and corpus, so they are not independent factual evidence.

## 5. Overlap

Nine gaps are common to both runs:

1. PHP language foundation.
2. JavaScript language foundation.
3. JavaScript functions and callbacks.
4. HTML/selectors before DOM.
5. Debugging feedback loop.
6. HTTP/JSON/async bridge.
7. TypeScript before Angular.
8. Python foundation.
9. Local Git workflow.

Run A only:

- **Small-program testing** — structurally derived from current examples and expected
  outputs; displaced despite unchanged evidence.

Run B only:

- **Markdown authoring foundation** — appears because historical B1 selected SOURCE
  48. With no body read in the fixed Run A evidence set, its confidence remains low.

The 90% overlap and unchanged TOP 4 show that the strongest gaps do not require
Strategic Memory to appear.

## 6. Strategic Memory influence

Strategic Memory helps with **sequencing and acquisition readiness**:

- API rises because B1 already identified a bounded read-only API pilot.
- Git and Python rise because they were already screened as tractable legacy work.
- It confirms that B3 candidates are complete but pending and that any content action
  still needs a separate human decision.

It also **anchors the result**:

- Markdown enters from the historical B1 queue without body evidence in this run.
- Independently derived testing falls out of the TOP 10 even though its structural
  evidence did not weaken.
- SOURCE-ready work gains rank over CREATE_NEW needs.

Verdict: **useful for sequencing, unsafe as discovery truth**. It should be applied
after a blind structural pass, exactly as in this experiment.

## 7. Confidence limitations

- 71 of 83 SOURCE bodies were not read. Metadata absence cannot prove body absence.
- The Knowledge Map itself is a prior selective interpretation with eight inherited
  deep reads.
- PENDING candidates may never become public, so their downstream value is conditional.
- Strategic documents reuse project/corpus interpretations and are not independent
  corroboration.
- Run B's Markdown item is metadata-only and low confidence until a bounded body read.
- Priority bands are editorial judgments, not probabilities.
- Technical currency and correctness remain future Researcher/Critic work.

## 8. Recommended next content action

**B. Create one newly discovered foundation article.**

Recommended target: the highest-priority **PHP language foundation** from Run A.
It repairs the current public path immediately, benefits both existing PUBLIC PHP
lessons and survived Run B unchanged without strategic anchoring. Publishing B3 first
would expose three pending JavaScript lessons while their shared entry prerequisite
remains missing. Modernizing a lower-ranked legacy source would optimize reuse rather
than close the largest current structural hole. Another discovery pass is not needed:
9/10 overlap already demonstrates stability.

This recommendation is not executed and requires separate human authorization.

## Blind discovery answer

**YES.** PUBLIC + PENDING + SOURCE + Knowledge Map were sufficient to find the
missing entry layer and multiple bridge nodes. The strongest evidence is independent
of Strategic Memory: explicit PHP/JavaScript prerequisites, constructs used before
they are taught, the HTML/selector dependency of DOM, and full-body checks that
distinguish thin or empty SOURCE from real reusable material.
