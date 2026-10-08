# Legacy inventory contract (schema version 1)

The scanner under `scripts/legacy/` is a deterministic migration tool. It inventories
the source corpus; it does not classify article quality or authorize publication.

## Usage

```sh
git clone --depth 1 https://github.com/Scripterix/temp-ogwo.git ../temp-ogwo
npm run inventory -- ../temp-ogwo/posts
```

Any source directory may be supplied as the positional argument. It is resolved
relative to the current working directory; the convenient default is
`../temp-ogwo/posts`. Default outputs are rooted in the project's `lab/` directory
independently of the caller's working directory.

```sh
npm run inventory -- path/to/source --output path/to/lab
npm run inventory -- --help
```

The CLI uses Node's TypeScript type stripping, available with the supplied flag in
the project's supported Node 22.12+ environment. No additional TypeScript runner is
required. Parser dependencies are declared directly and locked in `package-lock.json`.

## Artifacts

- `lab/inventory/inventory.json`: `{ "schema_version": 1, "articles": InventoryRecord[] }`.
- `lab/reports/corpus-summary.md`: deterministic summary derived from inventory.

The canonical TypeScript contract is [`scripts/legacy/types.ts`](../../scripts/legacy/types.ts).

| Field | Meaning |
| --- | --- |
| `source_id` | Source `post_id` as a string, or `path:<source_path>` when unavailable |
| `source_path` | POSIX path relative to the supplied source root |
| `title`, `slug` | Source strings or `null`; slugs are never decoded or rewritten |
| `original_url` | Source URL string or `null`; an invalid URL remains visible with a warning |
| `original_date` | Original date/time string or `null`; no inferred timezone |
| `original_author` | Source author string or `null` |
| `categories`, `tags` | Arrays of source strings; absent lists become `[]` with a warning |
| `word_count` | Approximate Unicode body token count; `null` when the body cannot be located/decoded |
| `content_hash` | SHA-256 of original bytes, including BOM and line endings |
| `bom_detected` | Whether the original file starts with UTF-8 BOM bytes |
| `parse_status` | `ok`, `needs-review`, or `error` |
| `warnings` | Stable warning codes without dynamic paths, execution IDs, or timestamps |
| `review_status` | Always `unreviewed`; parsing is not editorial review |

## Parsing and data quality

The parser recognizes an opening/closing `---` block, including CRLF line endings.
UTF-8 BOM is removed only from the in-memory parse input. YAML 1.2 core parsing
preserves unquoted WordPress date strings; duplicate keys are treated as errors.

Missing scalar values produce `null` and `missing:<field>`. Invalid scalar/list
types produce `invalid:<field>`. A nonempty scalar category/tag is retained as one
array element with `scalar_list:<field>` rather than split into guessed values.
Encoded slugs, case, spelling, and Unicode are retained as supplied.

Missing front matter is `needs-review`; malformed or unterminated front matter and
invalid UTF-8 become `error` records with their path and original hash. The scanner
continues past these records. Filesystem access errors abort instead of reporting
a misleadingly complete corpus. Symbolic links in SOURCE are rejected explicitly.

Duplicate `source_id` values remain visible and receive `duplicate:source_id`;
their source paths still distinguish records. No source ID is fabricated from a
filename's numeric prefix.

The summary includes mutually exclusive parser status counts, calendar date range,
authors, categories, tags, body lengths, metadata issues, and exact duplicates by
title, slug, and original byte hash. Category/tag frequencies count documents rather
than repeated labels inside a document. Invalid dates are excluded from the range.
Body counts include code tokens and should not be treated as reading-time estimates.

## Determinism and source preservation

- Every `.md` file is included recursively; the extension check is case-insensitive.
- Paths are sorted by JavaScript string comparison, independent of filesystem order
  and host locale.
- Source content is only read. Metadata errors are not repaired in place.
- Output targets are checked against the resolved source root, including existing
  filesystem links, before directories are created or files are written.
- Serialization uses stable field order, UTF-8, two-space JSON indentation, and LF.
- Inventory has no `generated_at`, execution IDs, random IDs, or absolute source paths.
- Identical source bytes and paths with the locked scanner version produce identical
  inventory and summary bytes. Different checkout line endings produce different
  hashes by design; preserve source bytes when comparing runs across machines.

## Verification

Minimal fixtures exercise BOM, Polish Unicode, encoded slugs, missing author/date,
valid metadata, and malformed YAML. Integration tests cover actual CLI execution,
recursive ordering, stable identity, repeated output, missing source, blocked writes,
and source hashes before/after. Real corpus verification evidence is recorded in
the [completed execution plan](../plans/completed/002-legacy-corpus-inventory.md).
