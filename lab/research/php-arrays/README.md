# PHP arrays research audit

Researcher 0.1, manual pilot, 2026-10-09. Exactly the two human-approved PHP arrays
articles were read in full. No article was written or published.

Start with [research.md](research.md); [research.json](research.json) is the formal
validated contract. `sources.json` is independently captured primary documentation
with short exact anchors, dates, URLs and SHA-256; `probes.json` records nine owned
data probes executed on local PHP 8.2.4. User-contributed PHP manual notes are excluded.

`request.json` records the exact two bodies, questions, documentation/probes,
prompt, schema and hashes. `session-responses.json` explicitly imports this Codex
session's interpretation, not a live API inference or fake pilot result. Re-running
the CLI reproduces the packet without automatically fetching or executing PHP.

Proposed tutorial baseline: PHP 8.4–8.5. Execution on those versions is still
needs-review, as is completeness of the final standalone snippets/form handler.
The validation boundary checks reference fidelity, not mathematical truth of every
interpretation. Confidence is not a calibrated probability.

See [Researcher operation](../../../docs/architecture/researcher.md) for commands
and refresh rules. Refreshing evidence invalidates the saved request/response pair.
Nothing here constitutes approval to write, publish or move material into CONTENT.
