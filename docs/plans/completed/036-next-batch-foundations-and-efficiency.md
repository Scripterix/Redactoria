# 036 — Next foundation batch and efficiency observation

Status: COMPLETED · 2026-10-16

## Objective

Select three next editorial candidates from current evidence, then take each through
the existing manual, LAB-only lifecycle to a publication candidate. Alongside the
work, record observable wall-clock cost and propose — but do not implement —
reductions in repeated context, runtime work and large artifacts.

## Selection method

The order is deliberately:

```text
current PUBLIC + SOURCE inventory + Knowledge Gap 0.2 blind Run A
→ Strategic Memory Run B only for sequencing
→ bounded focused analysis
→ human-authorized decision
```

The planned candidates are:

1. `php-language-foundation` — “PHP od pierwszego skryptu: wartości, zmienne, typy, operatory i CLI”; `CREATE_NEW`, context source `977`.
2. `javascript-language-foundation` — “JavaScript od pierwszego uruchomienia: wartości, zmienne, typy i operatory”; `CREATE_NEW`, context sources `542` and `281`.
3. `javascript-functions-callbacks` — “Funkcje JavaScript: parametry, return i callbacki”; `MODERNIZE`, source `281`.

The final selection report must retain the source IDs, current prerequisites,
confidence, scope/complexity and a duplicate check against all public articles.

## Scope and boundary

- SOURCE remains read-only. New artifacts stay in LAB.
- Candidate preparation is the terminal authorized state; there is no CONTENT write,
  promotion, Git operation, push or deployment.
- Each module is manually advanced only after its previous output validates; no
  runtime agent invokes another one.
- The two `CREATE_NEW` topics must be represented honestly as new editorial nodes.
  Their SOURCE records are context/evidence, not a false claim that a legacy article
  was rewritten. A minimal, tested contract extension is allowed only if it is
  necessary to carry that distinction through Cartographer, Researcher, Writer,
  Critic and candidate validation.

## Execution

1. Record the selection, authority/research plan and explicit human task
   authorization in LAB.
2. Add the smallest schema/validation support needed for this one three-topic batch;
   preserve historical B2–B5 behavior with regression tests.
3. For each topic: focused Cartographer → cited Authority-Ladder Research Packet →
   runtime/example evidence → validated research acceptance → Writer → actual code
   execution → Critic → exact LAB publication candidate.
4. Record per-stage observable work in
   `lab/reports/next-batch-effort-observation.md` and the final selection/effort
   report in both Markdown and JSON.
5. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
6. Move this plan to `docs/plans/completed/` only after the candidate and quality
   gates are recorded. Stop before publication.

## Cost observation policy

Wall-clock duration is the only quantitative proxy. It measures command or
instrumented-stage elapsed time, not tokens, hidden model work, user wait time or
provider billing. Each entry states its scope, observed duration where available,
relative level (`LOW` / `MEDIUM` / `HIGH`) and an explanation. Recommendations may
be `NOW`, `NEXT`, `LATER` or `NOT_WORTH_IT`; none authorizes implementation.

## Done criteria

- Exactly three evidence-backed candidates, each with traceable source/context,
  prerequisite, scope and authority plan.
- Three schema-valid LAB candidates with actual runtime evidence and Critic `PASS`,
  or an explicit, evidence-backed STOP for any topic that cannot safely reach one.
- No SOURCE/CONTENT/publication/Git/deployment mutation.
- Final efficiency map covers selection, context reads, research sources, module
  runs, revisions, runtime assertions, artifact size and measured wall-clock time.
- Required quality commands pass, or a precise failure is recorded.

## Result

All three selected topics reached independent LAB-only publication candidates:

1. `php-language-foundation` — `NEW_CONTENT`; three PHP 8.2.4 CLI examples PASS.
2. `javascript-language-foundation` — `NEW_CONTENT`; three Node v24.16.0 examples PASS.
3. `javascript-functions-callbacks` — `REWRITE`; three Node v24.16.0 examples PASS.

Every final Critic verdict is `PASS`, with no revision loop. Each candidate stays
`pending` / `approvedForPublication: false` / `published: false`. SOURCE and CONTENT
were not modified; no Promotion Gate, commit, push or deployment occurred.

The smallest contract extension preserved the distinction between a contextual
legacy source and genuine `NEW_CONTENT`; it also permits PHP examples only when the
approved runtime is explicit `php-cli`. Historical B2–B5 behavior remains covered by
the full test suite.

Effort observation: 3 SOURCE reads, 12 Authority Ladder documents, 12 manual module
runs, 3 research probes, 9 final examples / 27 assertions and 75 new B6 LAB files
(824,957 bytes). The final map and recommendations-only proposals are in
`lab/reports/next-batch-effort-observation.json`.

Quality: `npm run test` PASS (362/362); `npm run check` PASS (177 files, 0
diagnostics); `npm run build` PASS (23 pages, Pagefind 22 pages / 2,350 words);
`git diff --check` PASS apart from existing Windows line-ending notices.
