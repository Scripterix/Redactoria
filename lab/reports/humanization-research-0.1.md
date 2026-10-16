# Humanization Research 0.1

Status: **COMPLETE — RESEARCH AND POLICY ONLY**

## Purpose and boundary

This report evaluates editorial quality of AI-assisted prose. It does not seek to
evade AI detection, manufacture mistakes, hide authorship or change factual
meaning. It does not authorize an implementation, Writer/Critic change, automatic
rewrite, promotion or publication.

## Evidence

The research used current primary editorial guidance:

- [Google Search Central: helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google developer documentation: voice and tone](https://developers.google.com/style/tone), [headings](https://developers.google.com/style/headings), [lists](https://developers.google.com/style/lists) and [active voice](https://developers.google.com/style/voice)
- [Microsoft Writing Style Guide: style and voice](https://learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice)
- [GOV.UK Design System: lists](https://design-system.service.gov.uk/styles/lists/)

These sources converge on useful, reader-centred material; direct, concise language;
descriptive headings; intentional lists; a clear actor; and project-specific judgment
over a universal mechanical rule.

## A. Already covered

`docs/humanization.md` already covers formulaic openings and transitions, repeated
rhythm, three-part patterns, overuse of headings/lists/colons, fake questions,
generic adjectives and contrasts, empty conclusions, unsuitable tone, unnatural
synonyms, unverifiable claims and invented personal experience. It also correctly
protects facts, code, terminology and LAB/CONTENT boundaries.

## B. Genuine additions

The research added eight gaps: descriptive header function; one cognitive move per
paragraph; beginner progression (model → action → result); explicit actors; lists
selected by purpose; information instead of advance notice; context rather than
counts; and a read-through of headings as the lesson's navigation path.

## C. Possible duplicates

Three clusters can later be consolidated without losing meaning:

1. headings/lists/three-part structures → structure follows reader need;
2. formulaic openings/previews/transitions → remove navigation filler;
3. repeated claims/generic statements/empty endings → every sentence adds a
   consequence, condition, example, limitation or decision.

Colon, punctuation and separator observations should become one contextual rule,
not a numeric colon quota.

## D. Proposed Humanizer 0.1 rubric

The canonical ten-priority proposal is in
[`docs/humanization.md`](../../docs/humanization.md#humanizer-01--najwyzej-dziesiec-priorytetow).
Its leading principles are: preserve verified meaning; make headers descriptive;
teach progressively for a beginner; give each paragraph one job; name the actor;
and remove filler only when it adds no reader value.

## E. BEFORE → AFTER examples

The five examples in the policy cover an overloaded colon header, a slogan header,
a generic transition, a fake rhetorical question and an empty conclusion. The
important new example for Redactoria is:

```text
BEFORE: Dlaczego funkcje są tak ważne?
AFTER:  Funkcja uruchamia swój kod dopiero po wywołaniu
```

The second version teaches the concept and retains the beginner-critical fact that
a definition alone does not invoke a function.

## F. Exceptions

Do not apply a signal when it would weaken the reader's task:

- a colon legitimately introduces a definition, output label, mapping or list;
- ordered steps and parallel choices legitimately need a list;
- repeated technical names improve precision;
- short sentences serve an instruction, warning or result;
- a question is a real learner exercise or uncertainty;
- passive voice intentionally foregrounds the result; or
- a simple explanatory step is necessary to form the beginner's mental model.

## Result

`docs/humanization.md` now contains the source list, covered and missing rules,
possible duplicates, the ten-rule proposal, five before/after examples and
exceptions. No production or agent behaviour changed.
