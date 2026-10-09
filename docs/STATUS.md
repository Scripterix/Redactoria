# Redactoria — STATUS

Stan po Milestone 3 i Research Packet Approval Gate, 2026-10-09. Szczegóły: [Project Brain](index.md),
[architektura](architecture/overview.md) i [Roadmap](roadmap/ROADMAP.md).

## Current State

| Etap | Zakres | Status |
| --- | --- | --- |
| Milestone 0 | Astro foundation | DONE |
| Milestone 0.5 | Project Brain + Tests | DONE |
| Milestone 1 | Inventory Scanner | DONE |
| Milestone 2 | Cartographer 0.1 | DONE |
| Focused PHP Run | PHP Arrays I + II | DONE |
| PHP MERGE decision | Decyzja człowieka | APPROVED |
| Milestone 3 | Researcher 0.1 + Research Packet | DONE |
| Research Packet | Decyzja człowieka | APPROVED |
| PHP 8.4 verification | PHP 8.4.26, 12 prób / 60 asercji | PASS |
| PHP 8.5 verification | PHP 8.5.11, 12 prób / 60 asercji | PASS |
| Milestone 4 | Writer / Critic | NEXT — NOT STARTED |
| Publisher / Dispatcher | Przyszły zakres | NOT STARTED |

## Important Result

```text
PHP Arrays I + II
→ MERGE approved by human, confidence 0.96, nextStep: research
→ Researcher: two full articles + official documentation + controlled probes
→ validated Research Packet
→ actual PHP 8.4.26 / 8.5.11 verification: PASS
→ Research Packet approved by human, nextStep: writer
→ STOP: Milestone 4 not started
```

Targety: `1324-post-61-tablice-w-php-czesc-1.md` i
`1356-post-62-php-tablice-czesc-ii.md`. Nie analizowano ponownie całego korpusu.
Akceptacja MERGE jest zgodą na research, nie na wykonanie merge ani publikację.

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

Uzupełnienie obowiązkowe dla przyszłego Writera: PHP 8.5 zgłasza E_DEPRECATED także
dla `null` jako offsetu tablicy, nie tylko argumentu `array_key_exists()`.
Oczekiwane ostrzeżenia są rejestrowane i weryfikowane. Pierwszy wynik 8.5 FAIL
(58/60) zachowano w `runtime-verification-initial.json`; oczekiwania poprawiono
dopiero po sprawdzeniu oficjalnego przewodnika migracji, utrwalonego osobno w
`runtime-source-supplement.json`. Nie przepisano pakietu ani pierwotnych obserwacji.

Pierwotne `target-runtime` jest rozwiązane przez nowe evidence. Przyszłe samodzielne
bloki kodu Writera i kompletny handler formularza jeszcze nie istnieją; ich kontrola
pozostaje granicą przyszłego outputu, nie udajemy wykonania finalnego artykułu.

Portable runtime'y są wyłącznie w osobnym katalogu tymczasowym, poza Git.
Nie zmieniono XAMPP/PATH ani nie skonfigurowano produkcyjnego LLM API lub systemu CI.

## DONE

- Astro: 6 statycznych stron, layouty i walidowane Content Collections.
- Project Brain, AGENTS.md, ADR 0001–0003 oraz deterministyczne testy.
- Scanner: read-only inventory 83 tekstów w LAB.
- Cartographer 0.1: pierwszy runtime agent; mapa korpusu i focused MERGE.
- Researcher 0.1: drugi niezależny runtime agent; approved-only input, evidence,
  ścisły Research Packet, manual CLI i zapis tylko LAB/research.
- Jawny import analizy tej sesji i deterministyczny replay związany request hashem.
- ADR 0003 doprecyzowano dla evidence dokumentacyjnego; nie tworzono nowego ADR.
- Research Packet zaakceptowany przez człowieka po rzeczywistej weryfikacji PHP 8.4/8.5.

## NEXT

Milestone 4 — Writer/Critic, wyłącznie po osobnym poleceniu rozpoczęcia. Handoff:
zaakceptowany Research Packet wraz z obowiązkowym runtime addendum, korektami
i extract/form caution. W approval gate nie rozpoczęto żadnego kolejnego agenta.

## LATER

Publisher, Dispatcher, Scheduled Redactoria, multi-site,
production LLM API i PostgreSQL. Żaden z tych elementów nie jest rozpoczęty.

## Quality gate

- Tests: PASS — 123 testy w 10 plikach; 31 testów Researchera i 8 testów runtime evidence, bez live API.
- Check: PASS — 61 plików; 0 błędów, ostrzeżeń i hints.
- Build: PASS — 6 statycznych stron.
- Researcher pilot: PASS — walidacja structured output, dokładnie dwa pełne odczyty.
- Replay: identyczne bajty JSON i Markdown bez nowych fetch/inference/PHP calls.
- Runtime verification: PASS — PHP 8.4.26 i 8.5.11, łącznie 24 próby / 120 asercji.
- SHA-256: wszystkie 107 chronionych plików niezmienione; SOURCE nadal 83 pliki,
  CONTENT nadal 2 pliki, approved MERGE, Cartographer i pierwotne wyniki Researchera zachowane.
- Nie utworzono finalnego artykułu ani nie opublikowano materiału.
- Milestone 3 i approval gate przeznaczone do jednego zleconego commit/push;
  identyfikator i zdalne potwierdzenie znajdują się w historii Git i raporcie zamknięcia.

## Important File Map

- [AGENTS.md](../AGENTS.md) — zasady kodujących agentów.
- [docs/index.md](index.md) — główny indeks Project Brain.
- [docs/architecture/](architecture/) — kontrakty i procedury inventory/Cartographer/Researcher.
- [docs/adr/](adr/) — trwałe decyzje architektoniczne.
- [docs/roadmap/](roadmap/) — DONE / NOW / NEXT / LATER.
- [docs/futureboard/](futureboard/) — pomysły, nie wyniki researchu.
- [docs/changelog/](changelog/) — historia zmian.
- [docs/plans/](plans/) — plany 005 i 006 completed; Milestone 4 nie rozpoczęty.
- [content/](../content/) — niezmienione treści strony, bez nowego artykułu PHP.
- [lab/inventory/](../lab/inventory/) — metadane 83 źródeł.
- [lab/cartography/](../lab/cartography/) — mapy i audyt Cartographera.
- [lab/research/php-arrays/](../lab/research/php-arrays/) — pakiet, dokumenty, probes i import sesji.
- [lab/decisions/](../lab/decisions/) — niezmieniona human-approved PHP MERGE i nowa Research approval.
- [lab/reports/](../lab/reports/) — historyczne raporty inventory i Cartographera.
- [engine/agents/cartographer/](../engine/agents/cartographer/) — pierwszy runtime agent.
- [engine/agents/researcher/](../engine/agents/researcher/) — drugi runtime agent.
- [scripts/researcher.ts](../scripts/researcher.ts) — manual CLI bez live API.
- [scripts/research/](../scripts/research/) — jawne narzędzia przygotowania evidence pilota.
- [tests/](../tests/) i agentowe `__tests__/` — deterministyczne granice.
