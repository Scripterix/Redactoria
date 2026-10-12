# 022 — Header search and article controls

Status: COMPLETED — 2026-10-12

## Authorized scope

Small WEBSITE-only visual refinement requested by the human:

1. Move the Search link into the header position previously occupied by
   `EDU · Pilot`.
2. Replace the text arrow after Search with an accessible magnifying-glass icon.
3. Restyle the article back-to-top control with an icon and anchor it to the
   bottom-right of the article body.
4. Make the `Czytaj artykuł` card link use the same brown hover color as the card
   heading.

The existing uncommitted article-card heading-size adjustment was preserved.

## Boundaries

- WEBSITE only; no CONTENT, LAB, SOURCE or ENGINE changes.
- No icon package, client JavaScript or SPA behavior.
- Icons are decorative inline SVG; visible text remains the accessible label.
- Back-to-top remains a normal `#top` link.

## Verification

1. Review desktop and narrow layouts visually.
2. Run `npm run test`.
3. Run `npm run check`.
4. Run `npm run build`.
5. Record the result and move this plan to `docs/plans/completed/`.

## Result

- Header Search now occupies the former right-side pilot position. Its `↗` glyph
  was replaced with an inline magnifying-glass SVG; the text remains visible on
  desktop and the compact icon remains at 320 px.
- The back-to-top control is an outlined link-button with an inline chevron icon,
  absolutely anchored at the bottom-right of the article body with reserved space
  preventing content overlap.
- `Czytaj artykuł` uses the same `--color-accent` hover color as the card heading.
- The pre-existing `ArticleCard.astro` heading-size change to a `1.8rem` maximum
  remains intact.
- Visual review passed at 1440 px, 1280 px and 320 px. At 320 px the page and
  viewport widths match, so the revised header introduces no horizontal overflow.
- Browser console: zero errors and zero warnings. Hover computed color:
  `rgb(184, 95, 60)`, matching `--color-accent: #b85f3c`.
- Quality: `npm run test` PASS — 333/333 in 25 files; `npm run check` PASS —
  137 files, zero diagnostics; `npm run build` PASS — 15 static pages and a
  14-page Pagefind index.
- No SOURCE, LAB, CONTENT, ENGINE, article-body, Git or deployment action occurred.

Follow-up: [plan 023](023-fixed-back-to-top-control.md) supersedes the initial
content-relative back-to-top placement with the requested fixed icon-only control.
