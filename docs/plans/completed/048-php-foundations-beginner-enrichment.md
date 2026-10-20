# Plan 048 — PHP foundations beginner setup and practice

Status: **COMPLETED** · 2026-10-19

## Objective

Expand only `content/articles/podstawy-php.md` so a person who has never written
PHP on their computer can identify the required tools, verify PHP CLI, create and
edit a `.php` file in VS Code, run it repeatedly, read the result, recover from a
first syntax error and complete one small application-shaped exercise.

## Teaching sequence

```text
what is required
→ verify PHP CLI
→ create folder and file
→ write, save and run
→ edit and run again
→ value and variable
→ type observation
→ price × quantity → total
→ controlled error and recovery
→ independent exercise
→ next learning step
```

The sequence follows `docs/pedagogy.md` and `docs/pedagogy-principle.md`: remove
setup ambiguity, introduce one idea at a time, show visible results and preserve
prediction, correction and independent practice.

## Authorization and boundaries

The human explicitly authorized the article correction after reviewing the plan.
The change may add current official PHP and VS Code sources, new executable
examples, beginner troubleshooting and a fresh replacement review.

- Preserve the slug, title, featured image and provenance.
- Keep the runtime scope at local PHP CLI; no web server lesson.
- Do not teach forms, HTTP handling, databases, Composer, arrays, loops, user
  functions, classes, frameworks or Xdebug configuration.
- Do not modify immutable candidates, earlier reviews or promotion audits.
- Append a hash-bound `CONTENT_CHANGE` record and replacement PASS review.
- Do not commit, push or deploy.

## Required verification

1. Check current official PHP and VS Code documentation for installation, CLI and
   editor-support claims.
2. Execute every complete example on the declared local PHP CLI runtime; verify
   exact stdout and the intentional parse-error case.
3. Run a beginner-light pedagogical review and a replacement Critic review.
4. Replay `verify:article --topic php-language-foundation`.
5. Run `npm run test`, `npm run check`, `npm run build` and `git diff --check`.
6. Check the rendered article at desktop and 320 px for code overflow and errors.

## Result

- The article now begins with the three actual requirements: a code editor, PHP
  CLI and a working folder. It distinguishes VS Code and optional Intelephense
  support from the interpreter that executes PHP.
- The learner verifies `php --version`, receives bounded guidance for missing PHP
  or `PATH`, creates `start.php`, confirms the terminal folder, writes, saves,
  runs, edits and reruns the program before meeting variables and types.
- Seven complete PHP examples passed exact stdout checks on local PHP 8.2.4 CLI.
  One deliberate missing-semicolon example passed the expected non-zero parse-error
  check.
- The sequence includes prediction prompts, a controlled repair and one independent
  price-times-quantity exercise before the example solution.
- A new Teaching Plan and replacement Critic review pass the beginner-light,
  source, runtime, scope and productive-difficulty checks.
- Content Lineage replays PASS with the substantive body change marked as
  invalidating the previous effective review and the final reviewed metadata record
  restoring effective review `VALID`.
- `verify:article --topic php-language-foundation`: PASS across all lifecycle areas.
- `npm run test`: PASS — 368/368 tests in 29 files.
- `npm run check`: PASS — 184 files, zero errors, warnings or hints.
- `npm run build`: PASS — 29 pages; Pagefind indexed 28 pages / 3530 words.
- Browser checks at 1440 px and 320 px found no page-level horizontal overflow,
  no console warnings or errors, and correct title, H1, hero alt, table and code
  rendering. Long code blocks use contained horizontal scrolling on mobile.
- The existing background Astro server was reused and left running. No commit,
  push or deployment occurred.

