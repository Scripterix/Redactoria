# Plan 040 — Google AI Search 2026 manual publication

Status: **COMPLETED**

## Scope

Publish one explicitly user-supplied, GPT-assisted Polish article as a manually
curated, major modernization of SOURCE post 1329. The supplied prose is immutable:
only Markdown/front-matter adaptation, provenance, source linking, LAB candidate
records, Critic-style evidence review and publication validation are in scope.

## Boundaries observed

- Writer was not invoked and the supplied prose was not regenerated.
- The final input paragraph was preserved as process instruction in provenance,
  not published as article prose.
- The input bibliography was migrated to the standard linked source list; Markdown
  headings/lists were rendering-only adaptations.
- This is one manual, human-authorized CONTENT action, not a new automatic
  candidate or publication workflow.
- Git, push, deployment, a feature image and a new topic were not changed.

## Result

Completed on 2026-10-16. The user-supplied GPT-assisted replacement was published
locally as `content/articles/google-ai-search-2026.md`, a major modernization of
SOURCE post 1329. It has eight official Google sources and truthful `ai-assisted`
metadata. Its exact public body is hash-bound to
`lab/drafts/google-ai-search-2026/article.md`:
`9bd60793465730036825cabb4b0e69ddf0630f9428ac8559cf68ed1cba4b36a0`.

The import has a supplied-text provenance record, manual LAB candidate and
Critic-style Google-first review with PASS:
`lab/drafts/google-ai-search-2026/input-provenance.md`,
`lab/candidates/google-ai-search-2026/candidate.json`, and
`lab/reviews/google-ai-search-2026/critic-review.json`. The review found no
required factual correction. It records one retained, non-blocking wording nuance
about a manual checking workflow.

Quality: manual body/candidate/review linkage PASS; `npm run check` PASS (177
files, zero diagnostics); `npm run build` PASS (27 routes, 26 Pagefind pages);
the rendered route has one H1 and eight linked sources. The default test run had
four pre-existing 5-second CLI-test timeouts under 29 isolated workers. No test was
changed; rerunning with a 15-second execution limit passed all **368 / 368** tests.
`git diff --check` has no whitespace errors (only existing CRLF notices).
