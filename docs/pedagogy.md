# Pedagogy 0.1 — Redactoria EDU

Status: policy candidate for future editorial inputs; not an Engine contract or an
automatic article rewrite rule.

## Target persona: EDU 0.1 — self-directed beginner

The learner can use a computer and VS Code, create and save a file, and follow a
simple sequence of steps. Do not assume they know a programming term merely because
it is common to developers.

Every future EDU article should state: `KNOWS`, `DOES_NOT_KNOW`, `LEARNING_GOAL`,
`LIKELY_CONFUSIONS`, and `PREREQUISITES`. These fields are local to the article;
the persona is a starting point, not a global knowledge profile.

Writer must build the meaning of a term before relying on it where the selected
persona does not know it.

## Writer persona: teacher with a flashlight

Writer is not a Research Packet summarizer, documentation generator or
encyclopedia. The role is to guide an intelligent person through unfamiliar ground:
build a mental model, explain why it matters, show how it works, apply it, show the
result, then indicate the next concept around the corner. Code may require thought;
instructions should not require guessing.

## Compact Teaching Plan

Before prose, a future Writer input should contain a practical Teaching Plan:

- target persona;
- cognitive problem and learning goal;
- prerequisites;
- mental model;
- order of concepts;
- applications;
- likely confusions;
- knowledge around the corner.

It belongs after research/persona selection and before Writer. It is a small input
artifact, not a new agent or bureaucratic form.

## Teaching principles

1. Explain why before how.
2. Explain a term before using it as known knowledge.
3. Prefer one new idea per example.
4. Show an output or visible state change.
5. Prefer: initial state → operation → final state → explanation.
6. Give examples a purpose, not only syntax.
7. Teach the base model before edge cases.
8. Teach the ordinary case before exceptions.
9. Let concepts follow from one another.
10. State what the learner has learned and why it matters.
11. Name knowledge around the corner without teaching it prematurely.
12. Do not teach names without a use.

### Functions example

Often begin with an already-used function such as `console.log("Hello")`, then
`JSON.stringify(data)`, and only then show a function the learner can write:
`calculateTotal(price, quantity)`. This makes a function a useful tool before it
becomes an abstract syntax definition.

### Foundation notes

Future PHP foundations should build a server-side/request-to-response model and
local CLI practice before specialised terminology. JavaScript foundations should
build value, variable, `const`/`let`, expression, operator and output before
conditions, arrays and functions. Scope and hoisting remain later concepts unless
the article makes them necessary.

Prefer an application-shaped example such as `price × quantity → total` when it
clarifies the idea, but do not add a business story that obscures the lesson.

## Article-input model — future contract, not implemented

| Input | Route |
| --- | --- |
| `ENGINE_WRITTEN` | Researcher → Teaching Plan → Writer → Critic |
| `HUMAN_WRITTEN` | Human article → verification → Critic |
| `GPT_ASSISTED_EXTERNAL` | Human/GPT article → verification → Critic |

All routes require truthful provenance and a human approval before Promotion Gate.
For externally supplied prose, content creation is distinct from content
verification: do not rerun Writer or rewrite the canonical body merely to make it
look Engine-written. SOURCE can remain origin/provenance for a MODERNIZE operation
without being mechanically merged into the new prose.

## Pedagogy is not Humanization

Pedagogy asks whether the learner can understand the material. Humanization asks
whether prose sounds natural, concrete and consistent with the authorial voice.
Conceptual order for Engine-written EDU material is: research → persona → Teaching
Plan → Writer → pedagogical check → Critic → optional humanization/editorial check
→ candidate. For human/GPT inputs: article → verification → pedagogical check when
EDU → Critic → optional editorial check → candidate.

No automatic Humanizer follows from this policy.
