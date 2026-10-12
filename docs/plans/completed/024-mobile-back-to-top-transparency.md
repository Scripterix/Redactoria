# 024 — Mobile back-to-top transparency

Status: COMPLETED — 2026-10-12

## Authorized scope

Make the fixed article back-to-top control transparent on mobile while retaining
its circular border, black arrow, brown hover state, fixed position and accessible
name.

## Boundaries

- WEBSITE CSS only.
- No CONTENT, LAB, SOURCE, ENGINE, JavaScript or dependency changes.

## Verification

1. Review the control at 320 px and desktop width.
2. Run `npm run test`, `npm run check` and `npm run build`.
3. Record the result and move the plan to `docs/plans/completed/`.

## Result

- At widths up to `36rem`, the fixed control uses `background: transparent` and
  removes its shadow. Its subtle circular border, black arrow and brown hover remain.
- Browser verification at 320 px reports `rgba(0, 0, 0, 0)` and `box-shadow: none`.
  Page and viewport widths both equal 305 CSS px, with no horizontal overflow.
- Desktop styling remains unchanged.
- Quality: `npm run test` PASS — 333/333 in 25 files; `npm run check` PASS —
  137 files, zero diagnostics; `npm run build` PASS — 15 static pages and a
  14-page Pagefind index.
- No SOURCE, LAB, CONTENT, ENGINE, article-body, Git or deployment action occurred.
