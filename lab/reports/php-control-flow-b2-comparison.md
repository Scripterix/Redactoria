# B2 comparison — PHP control flow vs PHP Arrays

Status: **comparison-only / LAB**. Both rows describe exact preserved artifacts;
this report is not publication approval and does not implement future layers.

## Measured scope and effort proxies

| Metric | PHP Arrays | PHP control flow B2 |
| --- | ---: | ---: |
| Legacy source articles | 2 | 1 |
| Official PHP documents | 34 | 18 |
| Research questions | 13 | 11 |
| Verified facts | 25 | 18 |
| Incorrect / ambiguous source claims | 4 / 3 | 1 / 2 |
| Security notes | 3 | 0 |
| Research code findings | 8 | 8 |
| Packet unresolved questions | 2, resolved before Writer by approved supplement | 0 |
| Prose words / sections | 2559 / 16 | 1663 / 13 |
| Executable draft examples | 17 | 16 |

Elapsed research time, model tokens, monetary cost, human reading time and learning
outcomes were not measured; their values are `null`. Counts are scope proxies, not
a benchmark of semantic difficulty or quality.

## PHP 8.4 / 8.5 verification

Both pilots used the exact verified PHP 8.4.26 and 8.5.11 executables.

| Gate per runtime | PHP Arrays | PHP control flow B2 |
| --- | ---: | ---: |
| Controlled research probes | 12 | 8 |
| Exact research assertions | 60 | 24 |
| Draft examples executed | 17/17 PASS | 16/16 PASS |

The revisions changed prose only. No example, expected output or diagnostic changed,
so neither pilot invented a rerun after revision; the original actual captures were
rebound to the reviewed article hash with an explicit audit.

## Writer and Critic

| Metric | PHP Arrays | PHP control flow B2 |
| --- | ---: | ---: |
| Writer generations | 1 | 1 |
| Additional Writer generations | 0 | 0 |
| Targeted prose changes | 3 (1 required, 2 optional) | 1 required |
| Changed examples | 0 | 0 |
| Critic iterations | 2 | 2 |
| Verdicts | REVISE → PASS | REVISE → PASS |
| Issues in first / second review | 3 / 0 | 1 / 0 |

The repeating problem is precise scope in prose around correct code. PHP Arrays
overgeneralized the result type of one `array_reduce()` sum; B2 initially described
`!== 0` too generally despite an `int` input and the distinct `0.0` case. In both
pilots the deterministic examples passed. A narrow, hash-bound correction plus a
new full review was more appropriate than regenerating the article or rerunning
unchanged code.

## Conclusions for future layers

### Humanizer

Humanizer should remain a constrained editorial pass, not a fact source or an
autonomous rewrite loop. It must preserve qualifications such as “in this example”,
the input type and exact runtime scope rather than smoothing them into universal
claims. Neither pilot measured human reading time or comprehension, so the benefit
of a separate Humanizer remains unknown.

### Interaction Layer

B2 records four unimplemented opportunities attached to exact section IDs: a quiz,
hidden-output comparison, hint and exercise. PHP Arrays predates this contract, so
its value is `null`, not measured zero. Future interactions should bind prompt and
expected concept to a reviewed article hash and must distinguish executed examples
from unexecuted learner variants. No UI or implementation decision is made here.

### Knowledge Gaps

Unsupported popularity and cross-language claims are removable source noise, not
technical knowledge gaps. Useful gaps are explicit excluded contexts and unresolved
contracts: object comparisons, `foreach` references, nested `break`/`continue`,
file-scope `return`, input-shape and security boundaries. A shared gap should be
promoted only after repeated evidence across articles; two pilots reveal a pattern
but do not justify a new module.

## Boundary

The B2 candidate is an exact Critic-PASS copy in `lab/candidates/php-control-flow/`.
Publication remains pending and false. CONTENT, Promotion Gate, Git and deployment
are outside this report and were not changed.
