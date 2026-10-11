# Knowledge Gap 0.1

Status: **LAB DIAGNOSIS — HUMAN REVIEW REQUIRED**

Date: 2026-10-11

Question: **Czego brakuje obecnej bazie wiedzy Redactoria EDU?**

This experiment diagnoses missing nodes and relations. It did not run Researcher,
Writer, Critic or candidate generation, did not produce an article, and did not
publish the three JavaScript candidates. The canonical structured result is
[`knowledge-gap-0.1.json`](../knowledge-gaps/knowledge-gap-0.1.json).

## 1. Inputs

The analysis kept six layers separate:

| Layer | Observed state | Evidential role |
| --- | --- | --- |
| PUBLIC CONTENT | 3 articles: 2 curriculum lessons and 1 project/process article | Existing public knowledge |
| PENDING KNOWLEDGE | 3 JavaScript publication candidates, all still `approvedForPublication: false` | Reviewed knowledge that must not be counted as public |
| SOURCE CORPUS | 83 inventory records; 82 parsed OK, 1 review-required; 77 records not represented by the five curriculum lifecycles | Legacy evidence and acquisition options, never publication-ready by default |
| KNOWLEDGE MAP | 20 overlapping domains, 23 clusters, 6 prior gap hypotheses, 8 selective deep reads | Existing structural interpretation with stated limits |
| STRATEGIC MEMORY | `ROADMAP.md`, `STATUS.md`, completed plans | Direction only, never factual curriculum evidence |
| FUTUREBOARD | `docs/futureboard/ideas.md` | Planned system ideas only, never existing coverage |

The repository contains no separately named Project Master, OGW roadmap or historical
cluster plan. Their absence is recorded instead of reconstructed. Input hashes and
the exact classification of each layer are in the JSON result.

## 2. Current knowledge snapshot

PUBLIC curriculum coverage is currently PHP control flow and PHP arrays. The Start
article describes Redactoria itself and is not counted as a programming lesson.
PENDING coverage is JavaScript conditions/input validation, array transformations,
and DOM selection/safe updates/events.

The normalized prerequisite evidence exposes a structural mismatch:

- PHP control flow explicitly requires variables, scalar values, `echo`, PHP CLI,
  and basic arrays. Only the arrays prerequisite is already public.
- All three JavaScript analyses explicitly require basic JavaScript syntax and the
  ability to run a small example. No PUBLIC or PENDING node provides that shared base.
- The DOM candidate contains HTML structure and CSS-style selectors, but the current
  knowledge base does not teach that foundation.
- Angular, React, API, Python, tooling and other SOURCE clusters remain islands outside
  PUBLIC/PENDING learning sequences.

There is no normalized prerequisite graph. Relations currently live as local prose
or fields in focused artifacts, so a learner-visible sequence cannot yet be replayed
or checked for cycles and missing references.

## 3. Gap methodology

A Knowledge Gap is a missing node or relation that blocks, weakens or interrupts an
educational sequence. Article mistakes, absent citations, missing runtime evidence,
and overbroad claims are Quality Gaps and were excluded from the ranking.

No numeric composite was used. The qualitative rubric considers educational value,
prerequisite importance, current coverage, SOURCE availability, research cost,
outdated risk, code testability, internal-link potential and confidence.

- **P1** — high educational and prerequisite value, none/thin coverage, and at least
  two current beneficiaries or a blocker on the public path.
- **P2** — defensible sequence/bridge value with fewer beneficiaries, weaker evidence,
  or higher research cost.
- **P3** — useful coverage expansion that does not immediately block multiple current
  PUBLIC/PENDING lessons.

Ordering within a band uses prerequisite importance, number/status of beneficiaries,
confidence, then research cost. This is an editorial rubric, not a probability model.

## 4. TOP 10 Knowledge Gaps

| # | Proposed topic | Type | Origin | Priority | Confidence |
| ---: | --- | --- | --- | --- | --- |
| 1 | PHP od zera: zmienne, typy, operatory i uruchamianie skryptu | FOUNDATION | CREATE_NEW | P1 | HIGH |
| 2 | JavaScript od zera: wartości, zmienne, typy, operatory i uruchamianie kodu | FOUNDATION | CREATE_NEW | P1 | HIGH |
| 3 | Funkcje i callbacki JavaScript przed metodami tablic i zdarzeniami | SEQUENCE | MODERNIZE | P1 | HIGH |
| 4 | HTML i selektory CSS jako fundament pracy z DOM | BRIDGE | CREATE_NEW | P1 | HIGH |
| 5 | Debugowanie początkującego: stdout, konsola, błędy i minimalny przypadek | BRIDGE | CREATE_NEW | P2 | HIGH |
| 6 | Testowanie małych programów: przykłady, granice i regresje | BRIDGE | CREATE_NEW | P2 | MEDIUM |
| 7 | TypeScript przed Angularem: typy, interfejsy i małe ćwiczenia | PREREQUISITE | CREATE_NEW | P2 | HIGH |
| 8 | API, HTTP, JSON i async: od żądania do kontrolowanej odpowiedzi | BRIDGE | MERGE | P2 | HIGH |
| 9 | Python od podstaw: wartości, warunki, pętle i funkcje | COVERAGE | MODERNIZE | P3 | MEDIUM |
| 10 | Git lokalnie: status, staging, diff, commit i historia | FOUNDATION | MERGE | P3 | MEDIUM |

### 1. PHP language foundations

Two PUBLIC lessons exist above the entry level. The focused PHP analysis explicitly
names variables, scalars, output and CLI execution as prerequisites. SOURCE 977 only
touches variable syntax and dynamic typing inside a language comparison, so it is
insufficient as a lesson. A new, researched foundation would directly enable both
public PHP articles. Research cost: medium; code testability and link potential: high.

### 2. JavaScript language entry

All three PENDING candidates independently declare the same missing prerequisite:
basic syntax and running examples. SOURCE 542 is a project overview and SOURCE 281
starts at functions/classes, so neither closes the entry gap. This needs a new bounded
lesson and would support conditions, arrays, functions and DOM. Research cost: medium;
outdated risk: low.

### 3. JavaScript functions and callbacks

PENDING Arrays uses callback functions for `map`, `filter` and `reduce`; DOM uses an
event callback; if/else already contains a named function. SOURCE 281 has a useful
small function/calculator core, making `MODERNIZE` credible, but callback semantics
still require research. This is the missing step between syntax and all three pending
articles. Research cost: low; code testability: high.

### 4. HTML/CSS foundation for DOM

The DOM candidate is runnable, yet it assumes elements, attributes, ids, classes and
selectors. SOURCE 542 lists projects and SOURCE 551 lists skills; neither teaches the
model. This is a new bridge node rather than a repair to the DOM article. Research
cost: medium; code testability: high.

### 5. Debugging and reading errors

Every code lesson asks the learner to observe output, but none teaches what to do when
actual and expected output differ. The SOURCE title about `console.log` looks like
coverage until inspection shows a zero-word body. SOURCE 1575 merely mentions a
debugger. This therefore requires new content rather than modernization. It can link
to all five curriculum lifecycles. Research cost: medium; outdated risk: low.

### 6. Testing small programs

Current lessons contain deterministic examples and expected results, while SOURCE 551
only describes unit testing and SOURCE 281 supplies a possible exercise domain. Missing
is the learner-facing bridge from examples to boundary cases and regression tests.
This is new content after functions and debugging, not a Quality Gap in an article.
Research cost and confidence: medium; testability and link potential: high.

### 7. TypeScript before Angular

The existing map already observes that Angular introductions use or name TypeScript,
but inventory contains no dedicated TypeScript lesson. A self-contained prerequisite
would connect JavaScript knowledge to the Angular intro and Signals SOURCE clusters.
Existing mentions are not content to modernize. Research cost and outdated risk:
medium; confidence: high.

### 8. API/HTTP/JSON/async bridge

The map moves from local DOM to API/framework projects without a reviewed data-fetching
step. SOURCE 410 and 578 overlap on API, methods, JSON and fetch; together they justify
a `MERGE`, but need narrowing, corrected error semantics and controlled fixtures.
This would connect the browser path to API/CRUD and Angular project clusters. Research
cost and outdated risk: medium.

### 9. Python foundation path

Python is a mapped three-item SOURCE domain with no PUBLIC or PENDING node. SOURCE 283
is a viable modernization base if reduced to values, conditions, loops and functions.
It expands coverage rather than repairing the active PHP/JS paths, hence P3. Research
cost and confidence: medium; code testability: high.

### 10. Local Git workflow

The tooling cluster contains installation/context in SOURCE 1575 and a loose command
list in SOURCE 277, including an incorrect `--cashed` spelling and GitHub/Gist scope.
A safe local-only merge could cover status, staging, diff, commit and history without
push or destructive recovery. It supports future project lessons, but is not an
immediate prerequisite for multiple current articles, hence P3.

## 5. MODERNIZE / MERGE / CREATE_NEW

| Origin | Count | Gaps |
| --- | ---: | --- |
| MODERNIZE | 2 | JavaScript functions/callbacks; Python foundations |
| MERGE | 2 | API/HTTP/JSON/async; local Git workflow |
| CREATE_NEW | 6 | PHP entry; JavaScript entry; HTML/CSS for DOM; debugging; testing; TypeScript |

The high `CREATE_NEW` count is itself useful evidence: legacy inventory is not a
complete curriculum. Six structural needs should not be forced into weak historical
articles merely to maximize reuse.

## 6. Proposed prerequisite relations

```text
PHP foundations
  -> PUBLIC PHP control flow
  -> PUBLIC PHP arrays
  -> small-program testing

JavaScript entry
  -> functions and callbacks
  -> PENDING if/else
  -> PENDING arrays
  -> HTML/CSS foundation
  -> PENDING DOM
  -> API/HTTP/JSON/async

JavaScript entry + functions
  -> TypeScript foundation
  -> SOURCE Angular intro
  -> SOURCE Angular Signals
```

Debugging is a lateral support node for all five current code lifecycles. Git is a
tooling foundation for future project practice rather than a language prerequisite.

## 7. Learning-path observations

At most three hypothetical paths are proposed; none is an implementation or publishing
decision.

1. **PHP beginner:** PHP foundations → PUBLIC control flow → PUBLIC arrays → testing.
2. **JavaScript browser:** JS entry → functions/callbacks → PENDING conditions/arrays
   → HTML/CSS foundation → PENDING DOM → API/HTTP/JSON/async.
3. **Tooling to Python:** local Git → debugging → Python foundations → testing.

The largest structural hole is the missing beginner-entry layer: all five current
code-focused PUBLIC/PENDING lifecycles assume foundations that are not themselves
PUBLIC or PENDING.

The most surprising gap is debugging. Metadata suggests a console topic exists, but
its body is empty; title-only mapping would falsely treat that need as covered.

## 8. Uncertainties

- The original corpus map deep-read only 8 of 83 SOURCE bodies. Targeted reads here
  improve acquisition choices but are not Researcher validation.
- Missing titles/tags cannot prove a concept never occurs in an unread body.
- The PUBLIC/PENDING sample is small, so future publication choices can change link
  value and order.
- Strategic memory describes system direction, not curriculum truth.
- Priority bands are qualitative judgments, not calibrated probabilities.
- Technical currency and teaching correctness remain Researcher/Critic work.

## 9. Self-check

| Question | Result | Evidence |
| --- | --- | --- |
| Is the ranking only the old roadmap reflected back? | PASS | Five gaps (#1, #2, #4, #5, #6) arise from current prerequisites/coverage and are not roadmap items; B1 order was not copied. |
| Were PUBLIC and PENDING separated? | PASS | 3 PUBLIC files and 3 PENDING candidates have distinct classifications and counts. |
| Was planned content treated as existing? | PASS | Strategic memory, Futureboard, proposed gaps and paths are never counted as coverage. |
| Were Quality Gaps confused with Knowledge Gaps? | PASS | Correctness, citations, runtime evidence and article defects are excluded from the TOP 10. |
| Do gaps follow the map rather than popularity? | PASS | Every item supplies a prerequisite, repairs a sequence/bridge, or opens a mapped SOURCE-only domain. |
| Were unsupported gaps injected? | PASS WITH LIMITATION | Each gap has lifecycle/map/SOURCE evidence; negative absence claims remain explicitly limited by unread bodies. |

## 10. Recommended next experiment

Run a separately authorized **Prerequisite Graph Contract Spike 0.1**. It should define
a read-only, status-aware graph for PUBLIC, PENDING and proposed nodes and validate
unknown references, cycles and broken paths. It must not generate content.

## Core answer

**YES.** Redactoria detected missing knowledge that was not named in the task prompt:
the repeated PHP/JavaScript entry nodes, functions/callbacks bridge, HTML-to-DOM
foundation, debugging recovery layer and testing bridge. The evidence is the current
articles' own prerequisite declarations, their actual teaching constructs, the
PUBLIC/PENDING separation and the collapse of apparent console coverage after reading
the empty SOURCE body. Confidence is limited by selective SOURCE reads, so this is a
grounded diagnosis for human review, not authorization to produce articles.
