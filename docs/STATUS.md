# Redactoria — STATUS

Szybki stan projektu po zamknięciu sesji 2026-10-08. Szczegóły techniczne:
[Project Brain](index.md), [architektura](architecture/overview.md) i
[Roadmap](roadmap/ROADMAP.md). Brak aktywnej implementacji następnego milestone.

## Current State

| Etap | Zakres | Status |
| --- | --- | --- |
| Milestone 0 | Astro foundation | DONE |
| Milestone 0.5 | Project Brain + Tests | DONE |
| Milestone 1 | Inventory Scanner | DONE |
| Milestone 2 | Cartographer 0.1 | DONE |
| Focused PHP Run | PHP Arrays I + II | DONE |
| PHP MERGE decision | Decyzja człowieka | APPROVED |
| Milestone 3 | Researcher 0.1 | NEXT — nie rozpoczęty |

## Important Result

```text
PHP Arrays I + II
→ MERGE approved by human
→ confidence 0.96
→ research required before writing
```

Dotyczy `1324-post-61-tablice-w-php-czesc-1.md` oraz
`1356-post-62-php-tablice-czesc-ii.md`. Zachowano oba targety, evidence, confidence,
hashe źródeł i powiązanie z analizą. Confidence nie jest prawdopodobieństwem.

- [lab/cartography/php-arrays-merge.json](../lab/cartography/php-arrays-merge.json)
  — porównanie dwóch pełnych tekstów i szkielet 15 sekcji.
- [lab/reports/php-arrays-merge.md](../lab/reports/php-arrays-merge.md)
  — raport Cartographera; historyczna propozycja, nie gotowy artykuł.
- [lab/decisions/php-arrays-merge-proposal.json](../lab/decisions/php-arrays-merge-proposal.json)
  — aktualna decyzja: `approved`, `approvedBy: human`, `nextStep: research`.

Akceptacja MERGE oznacza gotowość do researchu, nie automatyczne wykonanie decyzji,
pisanie czy publikację. SOURCE i CONTENT pozostają niezmienione. Researcher, Writer
i Critic nie zostali uruchomieni. Zapis Cartographera nie może nadpisać zatwierdzonej
decyzji nową propozycją; weryfikacja zatwierdzonego przebiegu musi być read-only.

## DONE

- Astro: 6 statycznych stron, wspólne layouty i walidowane Content Collections.
- Project Brain, AGENTS.md, ADR 0001–0003 i testy deterministycznych granic.
- Scanner: read-only inventory 83 artykułów oraz podsumowanie korpusu w LAB.
- Cartographer 0.1: jawne kontrakty, polityki, adapter modelu i walidacja evidence.
- Pierwsza mapa: 8 selektywnych odczytów, 20 domen, 23 klastry, 6 luk i 16 propozycji.
- Focused PHP: dokładnie 2 pełne odczyty, plan MERGE, raport i akceptacja człowieka.
- Analizy sesji są jawnie importowane i powiązane hashem z requestami; nie ma
  produkcyjnego API LLM ani automatycznej publikacji.

## NEXT

**Milestone 3 — Researcher 0.1**. Pilot: approved PHP Arrays I + II MERGE → Research Packet.
Cel następnej sesji: zweryfikować oba teksty względem aktualnej dokumentacji PHP,
zamknąć pytania o wersję, klucze/null, funkcje, bezpieczeństwo i przykłady kodu.
Nie utworzono jeszcze modułu ani planu Researchera.

Poniżej docelowy pipeline, a nie działająca automatyzacja. Każdy kolejny etap wymaga
osobnego zakresu prac i odpowiedniej akceptacji:

```text
approved PHP MERGE
      ↓
Researcher 0.1
      ↓
Research Packet
      ↓
human review
      ↓
Writer
      ↓
Critic
      ↓
human approval
      ↓
CONTENT
      ↓
Astro publication
```

## LATER

Dispatcher, Single-Step Loop, Scheduled Redactoria, Publisher Agent, multi-site,
production LLM API i PostgreSQL. Żaden z tych elementów nie jest rozpoczęty.

## Quality at Closeout

- Tests: PASS — 84 testy w 8 plikach, bez zewnętrznego LLM API.
- Check: PASS — 46 plików, 0 błędów, ostrzeżeń i hints.
- Build: PASS — 6 statycznych stron.
- Focused verification: PASS, read-only — 2 pełne teksty, zgodna analiza/raport,
  zatwierdzona decyzja i zachowane evidence/provenance.
- SOURCE, CONTENT, ADRs i dotychczasowa analiza/raport niezmienione; zmieniono
  wyłącznie zatwierdzany plik decyzji spośród kontrolowanych artefaktów.

## Important File Map

- [AGENTS.md](../AGENTS.md) — zasady pracy agentów kodujących i granice systemu.
- [docs/index.md](index.md) — główny indeks trwałej dokumentacji Project Brain.
- [docs/STATUS.md](STATUS.md) — szybki stan projektu i punkt startowy kolejnej sesji.
- [docs/architecture/](architecture/) — aktualna architektura, kontrakty i procedury CLI.
- [docs/adr/](adr/) — zaakceptowane decyzje architektoniczne; akceptacja MERGE nie tworzy ADR.
- [docs/roadmap/](roadmap/) — ukończony zakres i rozdzielone NEXT/LATER.
- [docs/futureboard/](futureboard/) — pomysły, nie automatycznie przyjęte wymagania.
- [docs/changelog/](changelog/) — historia istotnych zmian projektu.
- [docs/plans/](plans/) — zapisy wykonania; plan 004 pozostaje w completed, active jest puste poza indeksem.
- [content/](../content/) — zaakceptowane treści strony; nie zawiera nowego artykułu PHP.
- [lab/](../lab/) — niepubliczny warsztat, oddzielony od Content Collections.
- [lab/inventory/](../lab/inventory/) — deterministyczne metadane 83 tekstów źródłowych.
- [lab/cartography/](../lab/cartography/) — walidowane mapy, plan MERGE oraz audyt requestów i odpowiedzi.
- [lab/research/](../lab/research/) — miejsce na przyszły Research Packet; obecnie bez wyników researchu.
- [lab/decisions/](../lab/decisions/) — propozycje i formalne decyzje człowieka z evidence/provenance.
- [lab/reports/](../lab/reports/) — czytelne podsumowania inventory i Cartographera.
- [scripts/legacy/](../scripts/legacy/) — deterministyczny scanner; zewnętrzne temp-ogwo jest tylko do odczytu.
- [engine/agents/cartographer/](../engine/agents/cartographer/) — jedyny obecny runtime agent-module.
- [tests/](../tests/) — testy treści i migracji; testy agenta są również w jego `__tests__/`.
