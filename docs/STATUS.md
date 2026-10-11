# Redactoria — STATUS

Stan po Milestone 4/5, Search 0.1, selekcji B1, pilocie B2, jego formalnej
promocji do CONTENT, trzech próbkach B3, Pipeline Review 0.1 oraz read-only
verify:article i CONTENT Lineage Contract Spikes 0.1, 2026-10-11. Szczegóły: [Project Brain](index.md),
[architektura](architecture/overview.md) i [Roadmap](roadmap/ROADMAP.md).

## Current State

| Etap | Zakres | Status |
| --- | --- | --- |
| Milestone 0 | Astro foundation | DONE |
| Cloudflare Pages | Publiczny pilot, 11 stron Astro / 10 stron indeksu | DEPLOYMENT SUCCESS — B2 VERIFIED |
| Milestone 0.5 | Project Brain + Tests | DONE |
| Milestone 1 | Inventory Scanner | DONE |
| Milestone 2 | Cartographer 0.1 | DONE |
| Focused PHP Run | PHP Arrays I + II | DONE |
| PHP MERGE decision | Decyzja człowieka | APPROVED |
| Milestone 3 | Researcher 0.1 + Research Packet | DONE |
| Research Packet | Decyzja człowieka | APPROVED |
| PHP 8.4 verification | PHP 8.4.26, 12 prób / 60 asercji | PASS |
| PHP 8.5 verification | PHP 8.5.11, 12 prób / 60 asercji | PASS |
| Milestone 4 | Writer 0.1 / Critic 0.1 + authorized correction pass | DONE |
| PHP arrays draft | 2559 prose words, 16 sections, LAB only | DRAFT — REVIEW PASS |
| Critic final verdict | One new full review after targeted revision | PASS |
| Draft code verification | 17 examples on each PHP 8.4.26 / 8.5.11 | PASS |
| Milestone 5 | First Publication Candidate, exact reviewed copy in LAB | DONE |
| Human publication decisions | PHP Arrays local-only; B2 public-production | APPROVED — HUMAN, SCOPED |
| Promotion Gate | Deterministic CLI, exact candidate → CONTENT + LAB audit | PASS |
| Local website | 11 static routes, HTML/XML sitemap, trzy artykuły | PRODUCTION PREVIEW PASS |
| Plan 009 utilities | Reading time, `Scripterix`, back-to-top, Copy code | DONE |
| Search 0.1 | Pagefind CLI after Astro build, public WEBSITE only | IMPLEMENTED |
| Public checkpoint approval | Human authorizes commit/push after the current full gate | APPROVED — HUMAN |
| Current Cloudflare checkpoint | `ee3f1fd`, push master, public route/search checks | VERIFIED — SUCCESS |
| B1 — ten-article selection | 83 metadata records, 19 full reads, fresh ranking 1–10 | SELECTION ONLY |
| B2 — rank #1 PHP control flow | Candidate `2a4414…` → human decision → Promotion Gate | PUBLISHED — VERIFIED |
| B3 — ranks #2–#4 JavaScript | if/else, Arrays, DOM; trzy exact schema-v3 candidates | LAB ONLY — PASS |
| Pipeline Review 0.1 | Pięć frozen samples, osiem racjonalizacji, bez implementacji | COMPLETE — LAB ONLY |
| verify:article Contract Spike 0.1 | 27 common + 4 conditional checks; bez operator CLI | 4 PASS / 1 CONTENT-LINEAGE FAIL |
| CONTENT Lineage Contract Spike 0.1 | Replay PHP Arrays + 6 positive / 9 negative scenarios | PASS — READ-ONLY PROTOTYPE |
| verify:article Operator CLI 0.1 | 32 checks, human/JSON, exit 0/1/2, pięć lifecycle’ów | IMPLEMENTED — 5/5 PASS |
| Publisher / Dispatcher | Przyszły zakres | NOT STARTED |

## Cloudflare Pages — publiczne środowisko testowe

Aktualny checkpoint potwierdzony bezpośrednio: Cloudflare Pages check dla commita
`ee3f1fd932e6be674b99b9d3fe302265613a9ead` ma **completed / success**
(`2026-10-10T22:03:16Z`). Jedenaście statycznych stron Astro i polski indeks
Pagefind dziesięciu stron działają pod
[redactoria.pages.dev](https://redactoria.pages.dev/).
Provider: Cloudflare Pages; repository: `Scripterix/Redactoria`; production branch:
`master`; build: `npm run build`; output directory: `dist`.

```text
GitHub master → Cloudflare Pages build → Astro static build → dist/ → redactoria.pages.dev
```

Cloudflare Pages należy wyłącznie do **WEBSITE / deployment**, nie do ENGINE, LAB
ani runtime agents. Działający deployment nie jest zgodą na publikację draftów.
Agenci nadal nie mogą zapisywać do CONTENT, samodzielnie publikować ani inicjować
deployu. Pierwszy artykuł wymaga: Writer → Critic → human review → human approval
→ jawne LAB → CONTENT → Git commit/push → Cloudflare Pages deploy. Kandydat PHP arrays
ma Critic PASS. Nowa jawna zgoda człowieka pozwoliła na test lokalny przez Promotion
Gate i zapis dokładnej wersji do CONTENT. Kolejna jawna decyzja z 2026-10-10
autoryzuje commit/push i wynikający z niego deploy po aktualnych test/check/build,
działającym Pagefind i production preview. Gate przeszedł, commit został pushnięty,
a nowy publiczny build i jego działanie sprawdzono w przeglądarce.

Według przekazanych logów pierwszy build zakończył się sukcesem na Node `22.16.0`,
ale `undici@8.11.2` zgłosiło wymaganie Node `>=22.19.0`. Przy kolejnej konfiguracji
ustawić `NODE_VERSION=22.19.0` lub nowsze kompatybilne Node 22.x. To zalecenie,
nie wykonana zmiana konfiguracji. Preview branchy/PR-ów pozostaje możliwością na później.

## Important Result

```text
PHP Arrays I + II
→ MERGE approved by human, confidence 0.96, nextStep: research
→ Researcher: two full articles + official documentation + controlled probes
→ validated Research Packet
→ actual PHP 8.4.26 / 8.5.11 verification: PASS
→ Research Packet approved by human, nextStep: writer
→ Writer: one recorded run, validated draft in LAB
→ 17 draft examples executed on each PHP 8.4.26 / 8.5.11: PASS
→ Critic first pass: REVISE, original review preserved
→ human-authorized targeted prose revision, no Writer regeneration/code changes
→ Critic second full pass: PASS
→ exact publication candidate in LAB
→ human approval: local-publication-test, candidate/review hashes bound
→ deterministic Promotion Gate → exact body in CONTENT + LAB audit
→ plan 009: article utilities + official sitemap XML/HTML
→ Search 0.1 + human-authorized public note cleanup
→ 10-page production preview / 9-page Pagefind index
→ current full gate PASS → Git checkpoint 56cc7a7 pushed → Cloudflare success verified
→ separate human authorization: B1 selection only
→ new eight-criterion ranking: 10 candidates in LAB, no draft/publication
→ separate human authorization: B2 rank #1 / source 1308 only
→ 18 official documents + 8 probes per PHP 8.4/8.5 runtime
→ one Writer draft, 16 examples × two runtimes PASS
→ first Critic REVISE → one required prose correction → full second Critic PASS
→ exact publication candidate + B2/PHP Arrays comparison in LAB
→ separate human public-production decision, exact candidate/review hashes bound
→ schema-v2 Promotion Gate PASS → CONTENT + structured LAB audit
→ local 11-page build / 10-page Pagefind index / browser verification PASS
→ Git checkpoint ee3f1fd i Cloudflare success verified
→ B3 ranks #2–#4: trzy exact LAB candidates, zero publikacji
→ Pipeline Review 0.1: evidence/status only; zero implementacji i Knowledge Gap run
```

## Pipeline Review 0.1 result

Pięć zamrożonych przebiegów potwierdziło stabilny wspólny rdzeń od hash-bound
SOURCE do exact, pending candidate. Najsilniejsze racjonalizacje to read-only
`verify:article` (`NOW` jako rekomendacja, nie autoryzacja), minimalny Article
Manifest (`NEXT`) oraz rozszerzenie rubricy Critica o claim scope (`NEXT`; osobny
gate dopiero `LATER`). Humanizer jest `TOO EARLY`, a Dream Cycle / szerszy
Agentic Circus pozostają `FROZEN / CONCEPT`, nie `REJECTED`.

[Raport](../lab/reports/pipeline-review-0.1.md) i
[JSON](../lab/reports/pipeline-review-0.1.json) rozdzielają Quality Gap od Knowledge
Gap, klasyfikują metryki jako AVAILABLE / UNKNOWN / NOT MEASURABLE RELIABLY i
rekomendują mały contract spike dla `verify:article`. Knowledge Gap 0.1 nie został
uruchomiony. Nie zmieniono SOURCE, CONTENT, pięciu kandydatów ani historycznych
decyzji; nie uruchomiono Promotion Gate, Git ani deploymentu.

## verify:article Contract Spike 0.1 result

Read-only prototyp sprawdził SOURCE, cartography, research, runtime, draft, Critic,
candidate i warunkową publikację jednym 31-check kontraktem. PHP Control Flow oraz
trzy pending candidates JavaScript dały OVERALL PASS. PHP Arrays dał OVERALL FAIL
wyłącznie na `publication.contentIntegrity`: pierwotny promotion audit ma hash
`3b2435…`, a obecny CONTENT po późniejszym autoryzowanym cleanupie `c4111b…`.

To nie jest zmiana kandydata ani niewyjaśniona mutacja treści — istniejący test
regresyjny potwierdza dokładne usunięcie dwóch nieaktualnych not. Brakuje jednak
strukturalnego, hash-bound auditu łączącego post-promotion change z obecną wersją.
Siedem negatywnych fixtures wykrywa wszystkie wymagane klasy awarii. Rekomendacja
dla finalnego CLI jest warunkowa: najpierw osobny kontrakt lineage dla późniejszych
zmian CONTENT. Nie dodano komendy operatorskiej ani wyjątków hardcodujących PASS.

## CONTENT Lineage Contract Spike 0.1 result

Ścisły kontrakt rozdziela lineage kandydata, pierwszej promocji i późniejszych
zmian CONTENT. Walidator odtwarza jawne operacje, zamiast ufać samym deklaracjom.
Realny PHP Arrays tworzy poprawny łańcuch `3b2435…` → `117d4b…` → `c4111b…`:
`METADATA_ONLY` (data i byline) oraz `TECHNICAL_CLEANUP` (dokładnie dwie noty).
Oba kroki mają hash-bound istniejącej autoryzacji człowieka; Critic PASS pozostaje
ważny, bo nie zmieniło się żadne twierdzenie, przykład, cytowanie ani evidence.

Oddzielny backfill jest append-only i nie zmienia historycznego promotion auditu.
Sześć pozytywnych przypadków przechodzi, a dziewięć wymaganych negatywnych klas
zostaje wykrytych, w tym fałszywe metadata-only i podmieniony etap pośredni.
Przyszła polityka zapisu nadal wymaga osobnej decyzji. Integracja CLI została
później osobno autoryzowana i jest opisana poniżej; Dream Cycle i Agentic Circus
pozostają `FROZEN / CONCEPT`.

## verify:article Operator CLI 0.1

Właściwa komenda `npm run verify:article -- --topic <topic>` jest wdrożona jako
read-only Operator Mode. Komponuje istniejący 27-check wspólny rdzeń z pięcioma
warunkowymi kontrolami publikacji, w tym deterministycznym CONTENT lineage.
Wszystkie pięć znanych lifecycle’ów daje `OVERALL PASS`: oba opublikowane PHP oraz
trzy pending candidates JavaScript. PHP Arrays przechodzi dzięki istniejącemu
backfillowi; pending publication pozostaje w całości `NOT_APPLICABLE`.

Domyślny output jest krótki i czytelny, `--json` zwraca dokładny verification
result contract, a exit codes to 0 PASS, 1 zweryfikowany FAIL i 2 błąd
input/configuration. Test niezmienności potwierdza identyczne bajty snapshotu przed
i po uruchomieniu. CLI nie uruchamia agentów, niczego nie zatwierdza, nie naprawia
i nie publikuje. Article Manifest pozostaje NEXT; Precision Gate i Humanizer nie
zostały wdrożone; Dream/Agentic pozostają `FROZEN / CONCEPT`.

## B3 result — three JavaScript samples

B1 ranks #2–#4 were processed sequentially as isolated single-source jobs:
JavaScript if/else, JavaScript Arrays and DOM. Each has a focused Cartographer
result, captured official MDN evidence, validated Research Packet, one Writer draft,
actual final-example execution and a full Critic PASS. Pure JavaScript ran on Node
24.16.0; DOM ran in a controlled Chromium 154 harness. No correction was required.

All three exact schema-v3 candidates remain under `lab/candidates/` with
`humanPublicationDecision: pending`, `approvedForPublication: false` and
`published: false`. Promotion Gate deliberately rejects schema v3. The
[five-sample report](../lab/reports/b3-five-sample-comparison.md) records per-job
metrics and separates Quality Gaps from Knowledge Gaps. Final gate: 287 tests in
22 files, zero Astro diagnostics, 11 static pages and a 10-page Pagefind index.
SOURCE, CONTENT, B1 ranking and historical PHP candidate/review hashes are unchanged.

## B2 result — PHP control flow

Source 1308 was processed as one bounded `REWRITE`, never a fake MERGE. The
Research Packet uses 18 official PHP documents, 11 questions, 18 verified facts,
one corrected source claim, two explicit ambiguous claims and eight code findings.
Actual target-runtime verification passed on PHP 8.4.26 and 8.5.11: eight owned
probes and 24 exact assertions per runtime.

Writer produced one 1663-word / 13-section draft with four metadata-only interaction
opportunities. All 16 standalone examples passed on both runtimes. The first full
Critic returned REVISE for one overbroad explanation of `!== 0`; one authorized
prose-only correction distinguished `int 0` from `float 0.0`. No code, expected
output or Writer generation changed. The second full Critic returned PASS with zero
issues and zero required changes.

- [B2 candidate](../lab/candidates/php-control-flow/article.md) and
  [metadata](../lab/candidates/php-control-flow/article.json) — exact reviewed copy,
  immutable historical state remains `pending`, `approvedForPublication: false`,
  `published: false`; approval is a separate human record.
- [B2 comparison](../lab/reports/php-control-flow-b2-comparison.md) — PHP Arrays vs
  control flow, measured effort proxies, runtime/example counts and recommendation-only
  conclusions for Humanizer, Interaction Layer and Knowledge Gaps.
- [Final Critic review](../lab/reviews/php-control-flow/critic-review.md) — PASS;
  original REVISE and exact revision audit remain preserved.
- [Human publication decision](../lab/decisions/php-control-flow-publication.json) and
  [Promotion audit](../lab/reports/instrukcje-sterujace-php-promotion.json) —
  schema-v2 `public-production`, candidate/review/hash/destination bound;
  `PROMOTED_PUBLIC` to `content/articles/instrukcje-sterujace-php.md`.

Current B2 publication checkpoint, 2026-10-11:

- Candidate Markdown SHA-256 remains
  `2a44143b3a355375fead8fe24b2c08c40ed2f1f6df1a7fcb13aa942f3d2f8f8b`;
  final Critic JSON remains `78c542a74f5cb32f627e96fce73991a26a45afcb856532528c236209f2924834`.
- Public body differs only by removal of the exact human-approved technical LAB
  note. A unit test and the gate audit enforce this delta; prose and all 16 examples
  are unchanged.
- `npm run test`: PASS 285/285 in 21 files. `npm run check`: PASS for 116 files,
  zero diagnostics. `npm run build`: PASS, 11 static pages; Pagefind 10 pages /
  1586 words. Sitemap contains 11 URLs.
- B1 read-only replay, SOURCE no-diff protection, protected B2 hashes and the
  promotion audit trail: PASS.
- Production preview: article metadata, 18-minute reading estimate, 13-section TOC,
  Copy controls, back-to-top, PHP Arrays links, both Pagefind queries, HTML map and
  XML sitemap verified.
- Publication commit `ee3f1fd932e6be674b99b9d3fe302265613a9ead` pushed to
  `origin/master`; Cloudflare Pages check `completed / success` at
  `2026-10-10T22:03:16Z`. Direct production routes, both Pagefind queries and the
  11-URL sitemap were verified under `https://redactoria.pages.dev/`.

Targety: `1324-post-61-tablice-w-php-czesc-1.md` i
`1356-post-62-php-tablice-czesc-ii.md`. Nie analizowano ponownie całego korpusu.
Akceptacja MERGE i Research Packet sama nie jest zgodą na publikację. Pierwszy pilot
zatrzymał się po jednym drafcie i jednej ocenie. Osobne polecenie człowieka
zaakceptowało małą korektę, jeden nowy review i utworzenie kandydata tylko przy PASS.
Kolejne polecenie zatwierdziło dokładnie ten kandydat tylko do lokalnego testu.

- [Local publication approval](../lab/decisions/php-arrays-publication.json) —
  `approved`, `approvedBy: human`, `scope: local-publication-test`; hash kandydata
  i ocenionego Markdown, `remotePublicationApproved: false`.
- [Promotion Gate](../engine/promotion/README.md) — walidacja wszystkich zgód,
  evidence, hashy, wspólnego schema, tematu i kolizji; bez LLM/Publishera.
- [Promotion audit](../lab/reports/tablice-w-php-promotion.json) i
  [raport](../lab/reports/tablice-w-php-promotion.md) — destination, pełne provenance
  dwóch źródeł i ref/hash każdej zgody. Przy promocji body było byte-identical;
  obecnie dwie nieaktualne noty LAB/draft usunięto wyłącznie z CONTENT na jawne
  polecenie człowieka. Kandydat, review i pierwotny audit pozostały niezmienione.
- [Local review closeout](plans/completed/008-local-promotion-website-review.md) —
  adresy, wyniki desktop/mobile i granica następnej decyzji człowieka.

- [Publication candidate](../lab/candidates/php-arrays/article.md) i
  [metadata](../lab/candidates/php-arrays/article.json) — dokładna kopia wersji z PASS,
  `publication-candidate`, `readyForHumanPublicationDecision: true`,
  `humanPublicationDecision: pending`, `approvedForPublication: false`, `published: false`.
  To niezmieniony historyczny stan artefaktu M5; nowa lokalna zgoda jest osobną decyzją.
- [Writer draft](../lab/drafts/php-arrays/article.md) i
  [structured metadata](../lab/drafts/php-arrays/article.json) — 2559 słów prozy,
  PHP 8.4–8.5, 16 sekcji, pokrycie 22 wymaganych zagadnień.
- [Critic review](../lab/reviews/php-arrays/critic-review.md) i
  [JSON](../lab/reviews/php-arrays/critic-review.json) — finalny PASS, 0 wymaganych
  zmian; pełna ocena 10 kryteriów. Pierwszy REVISE zachowano jako `critic-review-001`.
- [Revision audit](../lab/drafts/php-arrays/revision.json) — dokładnie 3 zmiany prozy:
  wymagane zawężenie reduce oraz opcjonalne objaśnienie fn i podpisy stanów usuwania.
  Parent/current hashes i oryginalny Writer execution zachowane; bez nowego generowania.
- [Draft code evidence projection](../lab/drafts/php-arrays/code-execution.json) —
  zachowane wyniki 34/34 PASS, wykonawcy i pierwotny czas wykonania. Zmienia się tylko
  articleHash po korekcie prozy. Oryginalny capture: `code-execution-001.json`.
  Wszystkie 17 obiektów przykładów jest identycznych; nie wykonano nowych runtime cases.
- [Writer / Critic architecture](architecture/writer-critic.md) — kontrakty,
  oddzielne moduły, CLI, hash-bound recorded requests i granice polityk.

- [Research Packet JSON](../lab/research/php-arrays/research.json) — formalny kontrakt.
- [Research report / Writer handoff](../lab/research/php-arrays/research.md) — instrukcje, nie artykuł.
- [Audit guide](../lab/research/php-arrays/README.md) — źródła, probes, request i recorded response.
- [Research approval](../lab/decisions/php-arrays-research-approval.json) — approved / human / writer,
  evidence, provenance i hashe niezmienionego pakietu oraz uzupełnień.
- [Runtime verification](../lab/research/php-arrays/runtime-verification.md) i
  [JSON](../lab/research/php-arrays/runtime-verification.json) — rzeczywiste wykonania i asercje.
- [Approved MERGE decision](../lab/decisions/php-arrays-merge-proposal.json) — niezmieniona.
- [Focused Cartographer map](../lab/cartography/php-arrays-merge.json) i
  [report](../lab/reports/php-arrays-merge.md) — niezmienione.

Research: 34 oficjalne dokumenty PHP, 13 pytań, 25 verified facts, 4 corrections,
1 outdated framing note, 3 ambiguities, 3 security notes i 8 code findings.
Evidence jest oddzielone od interpretacji sesji. Confidence nie jest prawdopodobieństwem.

## PHP scope and runtime verification

Zaakceptowany zakres redakcyjny to PHP 8.4–8.5. Historyczny pakiet i jego dziewięć
prób na PHP 8.2.4 pozostają byte-identical. Approval gate wykonał 12 kontrolowanych
prób na każdej rzeczywistej wersji PHP 8.4.26 i 8.5.11: po 60/60 asercji PASS.
Oficjalne portable Windows x64 NTS ZIP-y sprawdzono względem opublikowanych SHA-256;
wykonano CLI `-n`, bez php.ini i bez uruchamiania SOURCE.

Uzupełnienie obowiązkowe uwzględnione przez Writera: PHP 8.5 zgłasza E_DEPRECATED także
dla `null` jako offsetu tablicy, nie tylko argumentu `array_key_exists()`.
Oczekiwane ostrzeżenia są rejestrowane i weryfikowane. Pierwszy wynik 8.5 FAIL
(58/60) zachowano w `runtime-verification-initial.json`; oczekiwania poprawiono
dopiero po sprawdzeniu oficjalnego przewodnika migracji, utrwalonego osobno w
`runtime-source-supplement.json`. Nie przepisano pakietu ani pierwotnych obserwacji.

Pierwotne `target-runtime` jest rozwiązane przez zatwierdzone evidence. Milestone 4
wykonał osobno wszystkie 17 samodzielnych bloków draftu na każdej z obu rzeczywistych
wersji: zgodny stdout, brak stderr i exit code 0. Użyto tych samych hashy plików
wykonywalnych co w approval gate. Nie wykonywano SOURCE. Nie deklarujemy testu
wszystkich gałęzi, rozwiązań ćwiczeń, kompletnego handlera formularza, bezpieczeństwa
aplikacji ani innych wersji PHP. Pierwotny Research Packet i addenda nie zmieniły się.

Portable runtime'y są wyłącznie w osobnym katalogu tymczasowym, poza Git.
Nie zmieniono XAMPP/PATH ani nie skonfigurowano produkcyjnego LLM API lub systemu CI.

## DONE

- Astro lokalnie: 10 statycznych stron, 2 artykuły / 2 tematy, walidowane Content Collections.
- Formalny Promotion Gate i lokalny PHP Arrays; nie jest to Publisher Agent.
- Rozbudowane Start i O projekcie, pięć kolumn footera (5/2/1), homepage 3-col
  z jawnymi placeholderami, linkowanie, spis treści i długie artykuły/code/tables.
- Project Brain, AGENTS.md, ADR 0001–0003 oraz deterministyczne testy.
- Scanner: read-only inventory 83 tekstów w LAB.
- Cartographer 0.1: pierwszy runtime agent; mapa korpusu i focused MERGE.
- Researcher 0.1: drugi niezależny runtime agent; approved-only input, evidence,
  ścisły Research Packet, manual CLI i zapis tylko LAB/research.
- Jawny import analizy tej sesji i deterministyczny replay związany request hashem.
- ADR 0003 doprecyzowano dla evidence dokumentacyjnego; nie tworzono nowego ADR.
- Research Packet zaakceptowany przez człowieka po rzeczywistej weryfikacji PHP 8.4/8.5.
- Writer 0.1: jawny approved-only input, walidowany draft, sekcyjne evidence,
  pełne provenance i deterministyczny JSON → Markdown; tylko LAB/drafts.
- Critic 0.1: osobny moduł, 10 kryteriów, grounded issues i walidowane
  PASS/REVISE/BLOCK; tylko LAB/reviews. Nie przepisuje artykułu.
- Jeden oryginalny Writer i dwa oddzielnie zlecone przebiegi Critica przez
  RecordedLanguageModel; każdy request, response i input hash zachowany. Oddzielne
  role w tej samej sesji/modelu, bez twierdzenia
  o niezależnym providerze. Nie dodano live LLM API ani nowego ADR.
- Milestone 4 zamknięty po jawnie zaakceptowanej korekcie i finalnym Critic PASS.
- Milestone 5: walidowany publication candidate w LAB, identyczny z ocenioną wersją,
  schema i hash-bound provenance. Plany 006 oraz 007 są completed. To akceptacja
  techniczna, nie decyzja o publikacji.
- Plan 009: deterministyczny czas czytania, `Scripterix`, oficjalne sitemap XML,
  statyczna mapa HTML, no-JS back-to-top i progresywne Copy code. Historyczna
  decyzja promocji oraz body kandydata PHP pozostały niezmienione.
- Search 0.1: oficjalne Pagefind CLI 1.5.2 po Astro build, indeks publicznych
  main content, formularz `/szukaj/` i link w headerze. Silnik ładowany na żądanie;
  strona wyszukiwania, wspólna nawigacja i dane wewnętrzne nie są indeksowane.
- Publiczny PHP: usunięte tylko dwie nieaktualne noty o draftcie/pliki LAB oraz
  baner lokalnego testu z layoutu. Lekcja i kod zachowane; Start ma aktualny status.

## NEXT

Pozytywny visual review z 2026-10-09 pozostaje zapisany. Osobne polecenia z
2026-10-10 wdrożyły ograniczony plan 009 i jego append: czas czytania, korektę
byline do `Scripterix`, sitemap, mapę HTML, back-to-top oraz Copy code.
W [Futureboard](futureboard/ideas.md) ikony oraz media nadal pozostają do
przemyślenia. Nowa jawna zgoda z 2026-10-10 obejmuje Search 0.1, porządki przed
publicznym buildem i commit/push po pełnej bieżącej weryfikacji; nie wymaga kolejnego YES.

**Human localhost visual review**: [HOME](http://localhost:4321/),
[Start](http://localhost:4321/artykuly/start-redactoria-edu/),
[About](http://localhost:4321/o-projekcie/),
[PHP Arrays](http://localhost:4321/artykuly/tablice-w-php/),
[Articles](http://localhost:4321/artykuly/), [Topics](http://localhost:4321/tematy/),
[Site map](http://localhost:4321/mapa-strony/).
Production-like preview gotowego buildu: [HOME](http://127.0.0.1:4322/),
[Search](http://127.0.0.1:4322/szukaj/); zwykły dev nie generuje indeksu Pagefind.
Git checkpoint i Cloudflare zweryfikowane. Kolejne polecenie człowieka uruchomiło
wyłącznie B1: [nowy ranking 1–10](../lab/reports/pilot-selection-b1.md) i
[JSON](../lab/cartography/pilot-selection/ranking.json), 19 pełnych odczytów.
Wcześniejsze TOP 10 nie zostało użyte jako ranking B1. Rank #1 — instrukcje sterujące
w PHP (source 1308) — zakończył osobny B2 dokładnym kandydatem w LAB i porównaniem
z PHP Arrays. Następna granica to decyzja człowieka po ocenie B2. Rank #2 nie został
uruchomiony. Nie wykonano promocji do CONTENT, commit/push ani deploymentu;
wcześniejsza zgoda Git była tylko dla planu 010. Publisher i Dispatcher pozostają
nierozpoczęte.

## LATER

Publisher, Dispatcher, Scheduled Redactoria, multi-site,
production LLM API i PostgreSQL. Żaden z tych elementów nie jest rozpoczęty.

## Quality gate

verify:article Contract Spike 0.1 final gate, 2026-10-11:

- Tests: PASS — 301/301 w 23 plikach; 14 nowych testów kontraktu, pięciu frozen
  fixtures i siedmiu klas negatywnych mutacji.
- Check: PASS — 131 plików, 0 errors / warnings / hints.
- Build: PASS — 11 stron; Pagefind 10 stron / 1586 słów.
- Contract: 27 wspólnych + 4 warunkowe checks; 4 fixtures OVERALL PASS, PHP Arrays
  OVERALL FAIL na rzeczywistym `publication.contentIntegrity` mismatch.
- Boundary: read-only, offline, bez agentów, modeli, sieci, publikacji i operator CLI.
- Integrity: SOURCE, CONTENT, pięć candidates, pięć final reviews i dwa historyczne
  promotion audits nie zostały zmienione przez spike.

Pipeline Review 0.1 final gate, 2026-10-11:

- Tests: PASS — 287/287 w 22 plikach.
- Check: PASS — 128 plików, 0 errors / warnings / hints.
- Build: PASS — 11 stron; Pagefind 10 stron / 1586 słów.
- Raport JSON: PASS — 5 samples, 8 rationalizations, wyłącznie dozwolone
  rekomendacje `NOW` / `NEXT` / `LATER` / `REJECT`; flagi implementacji i
  Knowledge Gap pozostają `false`.
- Integrity: PASS — sześć SOURCE hashy, pięć CONTENT hashy i dziesięć plików
  article/metadata pięciu kandydatów zgodnych z zamrożonym snapshotem.
- Scope: tylko raport LAB, Futureboard evidence/status i Project Brain; bez
  Promotion Gate, CONTENT, nowych agentów, commit/push lub deploymentu.

B2 final gate, 2026-10-10:

- Tests: PASS — 283/283 w 21 plikach; nowy candidate v2 gate odrzuca REVISE,
  podmieniony revision hash/draft, zmieniony Markdown i flagę publikacji.
- Check: PASS — 116 plików; 0 errors / warnings / hints.
- Build: PASS — bez zmian WEBSITE: 10 stron, Pagefind 9 stron / 1273 słowa.
- Critic second pass: PASS, 0 issues / required changes; request hash
  `8834345c51e9fdc4812ad010df272f62f70d20828050bef4296764a3d5ee50d1`.
- Candidate: byte-identical draft, SHA-256
  `2a44143b3a355375fead8fe24b2c08c40ed2f1f6df1a7fcb13aa942f3d2f8f8b`;
  pending/false in LAB only.
- SOURCE/B1 replay and CONTENT boundary: PASS; no CONTENT diff, rank #2 not read,
  no Promotion Gate, Git operation or deployment.

B1 selection gate, 2026-10-10:

- Tests: PASS — 281/281 w 20 plikach, w tym 27 nowych testów screening,
  pełnych odczytów, evidence, scoring, liczby wyborów i hash-bound replay.
- Check: PASS — 102 pliki; 0 errors / warnings / hints.
- Build: PASS — nadal 10 publicznych stron, 9 stron Pagefind / 1273 słowa.
- `npm run select:pilot -- --verify`: PASS, read-only replay dokładnego ranking/report.
- Oceniono 19 pełnych tekstów, wybrano 10, odłożono 9; pozostałe 64 źródła
  screened tylko z metadanych. Koszt/ryzyka są szacunkami, metryki użycia null.
- WEBSITE i CONTENT nie zmieniły się; granica następnego kroku: B2 — rank #1 only.
- SHA-256: wszystkie 145 wcześniejszych plików SOURCE/CONTENT/LAB bez zmian;
  dodano wyłącznie pięć odrębnych artefaktów B1 w LAB.

Previous Search 0.1 gate, 2026-10-10:

- Tests: PASS — 254/254 w 19 plikach; nowe testy granic linków, pustych zapytań,
  błędów, konkurujących odpowiedzi i dokładnego zakresu usunięcia not PHP.
- Check: PASS — 99 plików, 0 errors / warnings / hints.
- Build: PASS — 10 statycznych stron; Pagefind 1.5.2, polski indeks 9 stron,
  1273 słowa indeksu, 0 filtrów/sorts; oficjalne sitemap XML obejmuje 10 tras.
- Production preview: `http://127.0.0.1:4322/`; rzeczywisty indeks potwierdza
  artykuły, tematy i strony projektu; `/szukaj/` oraz trasy wewnętrzne nie występują.
- Browser: 40/40 route/viewport checks (10 tras × 320/390/768/1440 px),
  45 poprawnych linków/kotwic. Mobilny header mieści się także z pionowym scrollbarem.
  PHP: Copy 34/34, Enter → Copied → Copy, 14 długich bloków z własnym scrollem;
  back-to-top działa. Windows clipboard normalizuje LF do CRLF; tekst kodu zgodny.
- Search: Enter, tytuł/fragment/URL, puste zapytanie, zero wyników, błąd pobrania
  indeksu i powrót po odświeżeniu przetestowane na realnym produkcyjnym indeksie.
- SHA-256: 141/141 plików SOURCE i istniejącego LAB niezmienionych w tym etapie.
- Publiczny body PHP po usunięciu dwóch not: SHA-256
  `56f1478d4d581f8483f45bf00dbfffce91079f12c242a18d82ac9fd0db66dc9f`.
  Unit test sprawdza dokładną różnicę względem historycznego Critic-PASS kandydata.
- Git/Cloudflare: `56cc7a7` push origin/master PASS; Cloudflare Pages check success.
  Publiczne kontrole 20/20 route/viewport, 45 linków/kotwic bez błędów; search,
  reading time, Copy/Copied/reset, back-to-top i sitemap XML/HTML potwierdzone.
  Pełny wynik: [completed plan 010](plans/completed/010-pagefind-search-public-checkpoint.md).

Previous plan 009 local publication / website gate, 2026-10-10 (historical):

- Tests: PASS — 230/230 w 17 plikach, w tym czas czytania, Copy code i kontrakt mapy; bez LLM API.
- Check: PASS — 94 pliki, 0 errors / warnings / hints.
- Build: PASS — dokładnie 9 statycznych stron oraz oficjalne `sitemap-index.xml` / `sitemap-0.xml`.
- Article meta: `Scripterix`; Start 3 min, PHP Arrays 31 min. Browser 320 px bez
  page overflow; body PHP nadal ma hash `713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068`.
- Sitemap: 9/9 publicznych tras w XML; HTML map ma 9 linków (5 stron, 2 tematy,
  2 artykuły). PHP: 34/34 bloków z Copy; `Copied` resetuje się po 2,5 s, a 14
  długich bloków zachowuje własny poziomy scroll przy viewport 320 px.
- Promotion CLI: PASS — jawna lokalna zgoda, dokładna wersja z Critic PASS;
  zapis CONTENT i structured LAB audit, żadnego ręcznego kopiowania.
- Browser: 32/32 route/viewport checks (8 stron × 320/390/768/1440 px), 39
  linków/kotwic wewnętrznych bez broken targets; jeden widoczny H1 na każdej stronie.
- Footer 5/2/1; kod i szerokie tabele przewijają się we własnych kontenerach,
  bez page overflow. Naprawiono wcześniejszy body min-width i grid nagłówka listy.
- SHA-256: 137/137 chronionych plików SOURCE + istniejącego LAB bez zmian.
  Candidate, Cartographer, MERGE, Research, drafts/reviews/runtime pozostają niezmienione.
- CONTENT: tylko autoryzowane rozszerzenie Start, nowy PHP article i temat PHP.
  Body PHP = candidate, hash `713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068`.
- Git: istniejące zmiany M4/5 zachowane; lokalne zmiany uncommitted. No commit,
  push, merge, remote publication or Cloudflare deploy.

### Previous M4/M5 quality gate (historical)

- Tests: PASS — 174 testy w 13 plikach; 51 nowych testów Writer/Critic i granic
  LAB. Automatyczne testy nie wykonują zewnętrznego API, sieci ani PHP.
- Check: PASS — 80 plików; 0 błędów, ostrzeżeń i hints.
- Build: PASS — 6 statycznych stron.
- Researcher pilot: PASS — walidacja structured output, dokładnie dwa pełne odczyty.
- Writer / Critic closeout: original REVISE archived, human-authorized correction,
  one new full Critic request and final PASS. No additional Writer generation.
- Candidate gate: PASS — strict schema, exact article/draft/review/revision hashes,
  byte-identical Markdown; 8 negative checks reject unreviewed/published/forged states.
- Replay boundaries: stabilna serializacja i rendering, request/input hashes;
  końcowa walidacja bez nowych wywołań modelu, fetch ani PHP.
- Runtime verification: PASS — PHP 8.4.26 i 8.5.11, łącznie 24 próby / 120 asercji.
- Draft runtime evidence: 17/17 PASS na PHP 8.4.26 i 8.5.11, zachowane wcześniejsze
  wykonania identycznego kodu. Nowe wykonania PHP w korekcie: 0.
- SHA-256: wszystkie 114 chronionych plików niezmienione; SOURCE nadal 83 pliki,
  CONTENT nadal 2 pliki, approved MERGE, Research Packet, Research approval,
  addenda i Cartographer outputs zachowane byte-identical.
- Extended snapshot: 193/193 hashy upstream/engine/scripts/testów niezmienione;
  jedyny wyjątek fixture testowy przypięty do zachowanego pierwszego REVISE, zamiast
  bieżącego zmiennego review. Membership wszystkich 194 plików bez zmian.
- Draft pozostał w LAB, nie opublikowano materiału i nie rozpoczęto Publishera/Dispatchera.
- Milestone 3 i approval gate są w Git jako `34144c9`. Milestone 4/5 nie commitowano
  ani nie pushowano; nie zmieniono pipeline'u ani konfiguracji Cloudflare.

## Important File Map

- [AGENTS.md](../AGENTS.md) — zasady kodujących agentów.
- [docs/index.md](index.md) — główny indeks Project Brain.
- [docs/architecture/](architecture/) — kontrakty i procedury inventory oraz czterech runtime agentów.
- [docs/adr/](adr/) — trwałe decyzje architektoniczne.
- [docs/roadmap/](roadmap/) — DONE / NOW / NEXT / LATER.
- [docs/futureboard/](futureboard/) — pomysły, nie wyniki researchu.
- [docs/changelog/](changelog/) — historia zmian.
- [Completed Writer / Critic plan](plans/completed/006-writer-critic-01.md) — implementacja
  oraz zaakceptowany correction pass zakończone finalnym PASS.
- [Completed candidate plan](plans/completed/007-first-publication-candidate.md) —
  dokładna historyczna kopia w LAB; późniejsza lokalna promocja i publiczny checkpoint osobno zatwierdzone.
- [content/](../content/) — Start, dwa promowane artykuły PHP oraz dwa publiczne tematy.
- [lab/inventory/](../lab/inventory/) — metadane 83 źródeł.
- [lab/cartography/](../lab/cartography/) — mapy i audyt Cartographera.
- [lab/research/php-arrays/](../lab/research/php-arrays/) — pakiet, dokumenty, probes i import sesji.
- [lab/decisions/](../lab/decisions/) — niezmienione human-approved PHP MERGE i Research approval.
- [lab/drafts/php-arrays/](../lab/drafts/php-arrays/) — draft, recorded Writer i wykonania kodu.
- [lab/reviews/php-arrays/](../lab/reviews/php-arrays/) — dwa oddzielne requesty/reviews,
  pierwszy REVISE historyczny i drugi PASS aktualny.
- [lab/candidates/php-arrays/](../lab/candidates/php-arrays/) — candidate metadata,
  dokładny historyczny tekst, JSON Schema i audyt; aktualne zgody są osobnymi decyzjami.
- [lab/candidates/php-control-flow/](../lab/candidates/php-control-flow/) — exact
  Critic-PASS B2 candidate; zachowany jako immutable LAB artifact, z odrębną zgodą
  i audytem promocji.
- [B2 comparison](../lab/reports/php-control-flow-b2-comparison.md) — opisowe
  porównanie dwóch pilotów i granice przyszłych warstw.
- [lab/reports/](../lab/reports/) — raporty inventory/Cartographera i pierwotny audit lokalnej promocji.
- [engine/agents/cartographer/](../engine/agents/cartographer/) — pierwszy runtime agent.
- [engine/agents/researcher/](../engine/agents/researcher/) — drugi runtime agent.
- [engine/agents/writer/](../engine/agents/writer/) i
  [engine/agents/critic/](../engine/agents/critic/) — osobne, ręcznie uruchamiane moduły.
- [scripts/writer.ts](../scripts/writer.ts) i [scripts/critic.ts](../scripts/critic.ts) —
  minimalne CLI; żadnego automatycznego loopa.
- [scripts/researcher.ts](../scripts/researcher.ts) — manual CLI bez live API.
- [scripts/research/](../scripts/research/) — jawne narzędzia przygotowania evidence pilota.
- [tests/](../tests/) i agentowe `__tests__/` — deterministyczne granice.
