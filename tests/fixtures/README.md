# Legacy post fixtures

`legacy-posts/` contains seven minimal, synthetic Markdown documents for the
Inventory Scanner. No production articles are copied here. This README lives
outside that corpus so the scanner really inventories every Markdown file.

The fixture corpus covers these cases:

- `valid-post.md`
- `missing-author.md`
- `missing-date.md`
- `malformed-frontmatter.md`
- `unicode-polish.md`
- `bom-prefixed.md`
- `encoded-slug.md`

The integration tests run the fixture corpus through the scanner and verify
record count, stable ordering, metadata extraction, `null` for missing values, BOM
handling, Unicode, encoded slugs, and that source files remain byte-for-byte
unchanged.

Additional edge cases are supplied inline in unit tests. Fixture bodies are
deliberately small and provide inputs, not publishable content.
