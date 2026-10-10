# 009 — Reading time and website utilities

Status: COMPLETED — APPEND · 2026-10-10

## Authorized scope

The original increment implemented deterministic reading time and corrected current
CONTENT bylines to `Scripterix`. A later explicit append extended the same bounded
website milestone to:

```text
reading time
back-to-top
sitemap
copy code
```

The sitemap scope has two complementary outputs: machine-readable XML generated
only by the official `@astrojs/sitemap` integration installed through
`npx astro add sitemap`, and a static HTML “Mapa strony” route.

## Implementation

1. Reading time uses 220 prose words/minute plus 12 non-empty fenced-code
   lines/minute, rounded up to at least one minute.
2. `@astrojs/sitemap` uses `https://redactoria.pages.dev` as the canonical `site`.
3. `/mapa-strony/` lists all core pages, published topics and published articles.
4. Article pages include a plain `#top` link with no JavaScript.
5. Only articles containing fenced code receive the small Astro-processed clipboard
   script. It progressively creates one native button per rendered `pre > code`.
6. Copy passes exact `textContent` to the Clipboard API, shows `Copied` for 2.5 s
   and restores the accessible label. The displayed code is never edited.

## Result

- Current article metadata: author `Scripterix`; Start `3 min czytania`; PHP Arrays
  `31 min czytania`. Five deterministic reading-time tests pass.
- Official `@astrojs/sitemap@3.7.4` generates `sitemap-index.xml` and
  `sitemap-0.xml` during build. The XML contains exactly all nine public routes,
  including generated article/topic routes and the HTML map.
- Every page links the sitemap index in `<head>`. The footer links the HTML map.
- HTML map renders five core pages, two topics and two articles with accessible
  full-row links and decorative arrows; no client JavaScript.
- PHP Arrays has 34 rendered fenced blocks and exactly 34 `Copy` buttons. At 320 px,
  14 long blocks retain their own horizontal overflow while page width stays contained.
- Browser verification confirmed `Copy → Copied → Copy`, the changing Polish
  accessibility label, native button semantics and the ordinary `#top` link.
- The clipboard script is absent from the Start article because it has no fenced code.
- Four new unit tests cover exact clipboard text/error propagation and the static
  HTML-map route contract.
- Approved PHP body remains byte-identical: SHA-256
  `713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068`.
- Quality: 230/230 tests in 17 files; Astro check 94 files with zero diagnostics;
  static build nine pages plus official sitemap XML.
- No SOURCE/LAB artifact, article body, runtime agent, ADR, commit, push or deployment change.
