# 023 — Fixed back-to-top control

Status: COMPLETED — 2026-10-12

## Authorized scope

Refine the article back-to-top control after visual feedback and the supplied
positioning reference:

1. Keep the control fixed at the viewport's bottom-right while scrolling.
2. Show only a black upward arrow inside a subtle circular border.
3. Change the arrow and border to the brown accent on hover.
4. Remove visible wording while retaining an accessible name.

## Boundaries

- WEBSITE only; no CONTENT, LAB, SOURCE or ENGINE changes.
- Preserve the native `#top` link and avoid client JavaScript.
- The reference image supplies visual intent only and is not copied into the site.

## Verification

1. Verify fixed position at multiple scroll depths on desktop and mobile.
2. Verify normal and hover colors plus accessible naming.
3. Run `npm run test`, `npm run check` and `npm run build`.
4. Record the result and move the plan to `docs/plans/completed/`.

## Result

- The article control is a `2.75rem` circle fixed to the viewport bottom-right
  through responsive `clamp()` offsets. Its viewport rectangle remains identical
  before and after a 2200 px desktop scroll.
- Only the upward-chevron SVG is visible. The link retains
  `aria-label="Wróć na górę strony"` and the native `href="#top"` behavior.
- Default color is the site's near-black ink. Hover color and border both resolve
  to `rgb(184, 95, 60)`, matching `--color-accent: #b85f3c`.
- Visual review passed at 1440 px and 320 px. The 320 px page has no horizontal
  overflow, and the control remains fully inside the viewport while scrolling.
- Clicking the control returned the long PHP article to the top without JavaScript.
- Browser console: zero errors and zero warnings.
- Quality: `npm run test` PASS — 333/333 in 25 files; `npm run check` PASS —
  137 files, zero diagnostics; `npm run build` PASS — 15 static pages and a
  14-page Pagefind index.
- No SOURCE, LAB, CONTENT, ENGINE, article-body, Git or deployment action occurred.

Follow-up: [plan 024](024-mobile-back-to-top-transparency.md) removes the control's
mobile fill and shadow while retaining its circular border and fixed position.
