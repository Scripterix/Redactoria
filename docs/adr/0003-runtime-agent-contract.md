# ADR 0003: Runtime Agent Contract

- Status: przyjęta
- Data: 2026-10-08

## Kontekst

ADR 0001 definiuje granice systemu i zasadę folder = agent-module. Milestone 2
uruchamia pierwszy taki moduł. Potrzebna jest formalna granica między interpretacją
LLM a walidowanymi danymi systemu, uprawnieniami narzędzi i zapisem do LAB.
Nie zmieniamy granic publikacji ani nie tworzymy pełnego Engine.

## Decyzja

- Każdy agent-module posiada odpowiedzialność, jawne wejście/wyjście, polityki,
  stabilny prompt, walidację i testy. Cartographer jest pierwszym modułem.
- Model znajduje się za provider-neutral `LanguageModel`; wynik ma typ `unknown`
  aż do lokalnej walidacji. Provider ani SDK nie należy do logiki agenta.
- Structured JSON jest podstawowym wynikiem. Markdown jest projekcją zwalidowanych
  danych, nie alternatywnym kontraktem.
- Istotne interpretacje mają evidence, confidence i ograniczenia. Walidacja
  sprawdza odwołania oraz dokładną zgodność metadanych/cytatów z dostarczonymi
  źródłami; nie udaje automatycznej walidacji prawdziwości interpretacji.
- Narzędzia są wstrzykiwanymi, ograniczonymi możliwościami. Cartographer otrzymuje
  tylko model i bounded source reader. Manual CLI zapisuje wyłącznie LAB po
  walidacji. Propozycja MERGE/ARCHIVE nie daje uprawnień Git ani kasowania źródła.
- Agent nie uruchamia innych agentów. Dwa przebiegi modelu należą do jednego
  wykonania Cartographera, nie sieci agentów. Dispatcher pozostaje przyszłością.
- Pierwszy przebieg używa jawnie zatwierdzonego importu analizy sesji Codex.
  Każda odpowiedź jest związana hashem z pełnym requestem; provenance odróżnia
  import/replay od live inference i testowego fake modelu.

## Konsekwencje

Strona Astro pozostaje niezależna. SOURCE i CONTENT nie są modyfikowane przez
Cartographera. Błędny structured output zatrzymuje końcowy zapis. Budżet selektywnego
odczytu ogranicza zakres i koszt kontekstu. Testy używają fake modelu i sprawdzają
deterministyczne granice, nie powtarzalność semantyki LLM.

Można później dodać live adapter bez przebudowy agenta. Obecny import wymaga jawnej
analizy sesji przed uruchomieniem; replay nie jest nową inferencją. Ostateczne decyzje
pozostają po stronie człowieka.

Szczegóły kontraktu i uruchomienia: [Cartographer 0.1](../architecture/cartographer.md).

## Doprecyzowanie evidence — Researcher, 2026-10-09

Researcher stosuje tę samą granicę runtime; nie wymaga odrębnego ADR. Zweryfikowany
snapshot dokumentów jest wejściem niezależnym od interpretacji modelu. Model nie
jest źródłem faktów. Każdy finding factual/verified ma odwołanie do dostarczonego
dokumentu i evidence ID; source register jest wyprowadzany z użytych referencji.
Nierozstrzygnięte kwestie pozostają needs-review. Review dokumentacji i rzeczywiste
wykonanie kodu są rozdzielone, z zapisem faktycznej wersji runtime dla prób.

Researcher nie otrzymuje możliwości wykonania shell ani zapisu plików. Manual CLI
ma zawężony writer do LAB/research; snapshot i recorded response są związane pełnym
request hashem. Walidacja nie zastępuje oceny semantycznej człowieka ani nie dowodzi
autentyczności ręcznie podmienionego snapshotu. Szczegóły:
[Researcher 0.1](../architecture/researcher.md).
