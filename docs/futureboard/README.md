# Redactoria Futureboard

Futureboard przechowuje hipotezy, kierunki rozwoju, możliwe eksperymenty i
potencjalne racjonalizacje Redactorii.

Nie jest backlogiem implementacyjnym ani Roadmapą. Wpis nie może zostać wdrożony
tylko dlatego, że został tutaj zapisany.

```text
IDEA
  ↓
Futureboard
  ↓
obserwacja / eksperyment / dyskusja
  ↓
jawna decyzja?
  ├── NIE → pozostaje w Futureboard
  └── TAK → ADR i/lub Roadmapa
```

Pomysł może przejść do Roadmapy lub ADR dopiero, gdy:

- pojawi się wystarczająca liczba obserwacji,
- znamy rzeczywisty problem,
- potrafimy opisać wartość rozwiązania,
- koszt i wpływ architektoniczny są uzasadnione,
- człowiek podejmie jawną decyzję o promocji.

## Statusy

- `OBSERVE` — zbieramy przypadki; za mało danych na eksperyment.
- `EXPERIMENT` — zaakceptowano mały, ograniczony test hipotezy.
- `CANDIDATE` — powtarzalny problem i prawdopodobne rozwiązanie są już widoczne.
- `PROMOTE` — propozycja jest gotowa do jawnej decyzji o Roadmapie lub ADR.
- `FROZEN` — ważna hipoteza nie jest obecnie rozwijana; może wrócić po nowych danych.
- `CONCEPT` — nazwana koncepcja bez zaakceptowanego eksperymentu lub zakresu.
- `REJECTED` — hipoteza została odrzucona; wpis zostaje jako pamięć decyzji.
- `IMPLEMENTED / ESTABLISHED` — rozwiązanie przeszło jawnie autoryzowaną
  implementację i quality gate; wpis pozostaje jako historia evidence, nie backlog.

Zmiana statusu nie jest automatyczna. `PROMOTE` nadal nie oznacza zgody na
implementację.

## Format kolejnych wpisów

Każdy nowy wpis powinien, o ile ma to zastosowanie, zawierać:

- **Status** — jeden ze statusów Futureboard.
- **Problem** — konkretna obserwacja, nie przewidywanie bez danych.
- **Hipoteza** — rozwiązanie, które może pomóc.
- **Evidence** — przebiegi, błędy lub dane stojące za pomysłem.
- **Niepewności** — czego jeszcze nie wiemy.
- **Minimalny eksperyment** — najmniejszy test hipotezy.
- **Trigger do promocji** — warunek przejścia do Roadmapy lub ADR.
- **Nie robić jeszcze** — granice przeciw przedwczesnemu overengineeringowi.
- **Możliwy przyszły właściciel** — moduł lub warstwa, nie automatyczna decyzja.

---

## Stan bazowy: Production Loop 0.1

To udowodniony stan systemu, nie nowa idea do wdrożenia:

```text
SOURCE
  ↓
MAP
  ↓
RESEARCH
  ↓
WRITE
  ↓
CRITIQUE
  ↓
CANDIDATE
  ↓
HUMAN GATE
  ↓
PROMOTE
  ↓
PUBLISH
```

PHP Arrays i PHP Control Flow przeszły pełny pipeline oraz publiczny quality gate.
Kolejne hipotezy mają upraszczać albo wzmacniać ten proces bez zacierania granic
`SOURCE != LAB != ENGINE != CONTENT != WEBSITE`.

---

## IDEA 1: Golden Path 0.x

**Status:** `CANDIDATE`

**Problem**

Pipeline działa, ale istnieją dopiero dwie pełne próbki. Nie wiadomo jeszcze, które
elementy procesu są trwałym wzorcem, a które wynikały z charakteru materiałów PHP.

**Hipoteza**

Przez pierwszych pięć pełnych artykułów utrzymać możliwie niezmieniony proces:

```text
SOURCE → Cartographer → Researcher → runtime verification
→ Writer → Critic → Candidate → Human Gate → Promotion Gate → CONTENT
```

**Evidence**

PHP Arrays i PHP Control Flow zakończyły się poprawnymi publikacjami, zachowaną
proweniencją i pełnym quality gate. Pipeline Review 0.1 potwierdził wspólny rdzeń
od SOURCE do exact, pending candidate w pięciu próbkach; publikacja pozostała
osobnym etapem tylko w dwóch przebiegach.

**Minimalny eksperyment**

Przeprowadzić osobno JavaScript if/else, JavaScript Arrays i DOM bez dużych zmian
w pipeline.

**Trigger do promocji**

Pięć pełnych próbek i Pipeline Review 0.1 wskazujące stabilny wspólny przebieg.

**Nie robić jeszcze**

- nie dodawać nowych agentów,
- nie reorganizować całego pipeline,
- nie optymalizować na podstawie pojedynczego przypadku.

**Możliwy przyszły właściciel:** Engine / Project Brain.

## IDEA 2: Article Manifest — paszport artykułu

**Status:** `CANDIDATE`

**Problem**

Lifecycle artykułu jest rozproszony między source decision, cartography, research,
runtime verification, draft, review, candidate, publication decision i audit.

**Hipoteza**

Mały manifest powinien referować istniejące artefakty i ich hashe, nie kopiować
payloadów:

```text
article
├── source / cartography
├── research / runtime evidence
├── writer / critic
├── candidate
└── publication
```

**Evidence**

Pięć przebiegów wymaga ręcznego przechodzenia przez te same grupy artefaktów:
source, cartography/decision, research/acceptance, runtime evidence, draft,
execution/revision, Critic i candidate; publication/audit są warunkowe. Pipeline
Review 0.1 ocenił minimalny manifest refs/hashów jako `strongly justified`.

**Niepewności**

Ostateczny zestaw pól i granica między manifestem a istniejącymi kontraktami nie są
jeszcze znane.

**Minimalny eksperyment**

Po pięciu próbkach zaprojektować manifest wyłącznie z danych, które faktycznie
powtórzyły się w każdym przebiegu.

**Trigger do promocji**

Stabilna struktura informacji w co najmniej pięciu pełnych pipeline runs.

**Nie robić jeszcze**

Nie projektować manifestu na zapas ani nie przenosić do niego źródeł prawdy.

**Możliwy przyszły właściciel:** Engine / LAB contracts.

## IDEA 3: `verify:article`

**Status:** `IMPLEMENTED / ESTABLISHED`

**Problem**

Wiele kontroli przed publikacją jest powtarzalnych i deterministycznych, ale obecnie
uruchamia się je przez kilka osobnych poleceń i ręcznych sprawdzeń.

**Hipoteza**

Dodać read-only polecenie:

```text
npm run verify:article -- --topic <topic>
```

które sprawdza SOURCE provenance, approvals, research/runtime evidence, Critic PASS,
candidate hash, exact-copy integrity, publication decision, CONTENT i audit trail.
Polecenie nie uruchamia agentów, nie poprawia artefaktów i niczego nie publikuje.

**Evidence**

Wszystkie pięć próbek wymagało tych samych klas kontroli od source hash do exact
candidate; kontrola publication/CONTENT/audit była wspólna dla dwóch opublikowanych
próbek. Pipeline Review 0.1 ocenił siłę evidence jako `HIGH` i rekomendację `NOW`,
bez udzielenia zgody na implementację.

Contract Spike 0.1 zastosował 27 wspólnych deterministic checks do wszystkich pięciu
próbek i cztery warunkowe checks publikacji. Cztery fixtures dały OVERALL PASS;
PHP Arrays dał FAIL wyłącznie dlatego, że obecny CONTENT po późniejszym, autoryzowanym
cleanupie nie ma już hasha z pierwotnego promotion auditu. Kontrakt wykrywa siedem
żądanych klas błędów negatywnych. Status pozostaje `CANDIDATE`: rdzeń jest stabilny,
ale właściwy CLI wymaga najpierw jawnego kontraktu dla zmian CONTENT po promocji.

CONTENT Lineage Contract Spike 0.1 zamknął ten warunek na poziomie prototypu:
deterministyczny replay dwóch autoryzowanych przejść PHP Arrays prowadzi od
promotion hasha `3b2435…` przez `117d4b…` do obecnego `c4111b…`, zachowując ważność
Critic PASS. Dziewięć fixtures negatywnych wykrywa m.in. fałszywe metadata-only,
zerwany łańcuch, brak autoryzacji i podmienioną wersję pośrednią. Na tym etapie
status nadal był `CANDIDATE`, ponieważ integracja, operator CLI i trwała polityka
zapisu wymagały osobnej jawnej decyzji.

Jawnie autoryzowany plan 018 wdrożył następnie właściwy read-only Operator Mode.
Pięć realnych lifecycle’ów daje `OVERALL PASS`; PHP Arrays przechodzi przez
dwurekordowy lineage, PHP Control Flow przez exact initial promotion, a trzy pending
JavaScript candidates otrzymują publication `NOT_APPLICABLE`. CLI zwraca stabilne
exit codes `0/1/2`, schema-valid `--json` i nie zapisuje artefaktów. Hipoteza jest
zrealizowana; dalsze rozszerzenia wymagają nowego evidence i zakresu.

**Niepewności**

Obecny registry obejmuje pięć znanych lifecycle’ów. Automatyczne odkrywanie nowych
artykułów mogłoby wymagać Article Manifestu, który nadal pozostaje osobnym `NEXT`,
a nie ukrytą częścią tego CLI.

**Minimalny eksperyment**

Wykonany: contract spike, lineage spike i produkcyjne CLI na pięciu próbkach.

**Trigger do promocji**

Spełniony: pięć wspólnych sekwencji, zamknięty lineage blocker i pełny quality gate.

**Nie robić jeszcze**

Nie łączyć verification z orchestration, agent invocation ani publication.

**Możliwy przyszły właściciel:** Engine validation / CLI.

## IDEA 4: Pipeline Metrics 0.1

**Status:** `CANDIDATE`

**Problem**

Redactoria mierzy jakość i provenance, ale effort, czas oraz koszt nadzoru pozostają
w dużej mierze `null`.

**Hipoteza**

Od B3 zbierać lekkie metryki:

- source reads i źródła research,
- executable examples i runtime executions,
- Writer/Critic iterations i model calls, jeżeli są wiarygodnie mierzalne,
- required corrections i human interventions,
- wall-clock duration, jeśli jest dostępne bez zgadywania.

Pomocnicze wskaźniki do późniejszej oceny:

```text
human interventions / article
verified knowledge / human supervision
```

**Evidence**

Pipeline Review 0.1 wykazał, że liczniki research/runtime/examples/revisions i hashe
są dostępne i użyteczne, natomiast czas, tokeny, koszt, quota i learner outcomes
pozostają `UNKNOWN`. Produktywność między runs i procent quota są bez pełnego
licznika `NOT MEASURABLE RELIABLY`; nie należy budować dla nich pseudo-metryk.

**Minimalny eksperyment**

Zebrać dostępne dane dla trzech artykułów B3, używając `null` dla danych
niemierzalnych.

**Trigger do promocji**

Pipeline Review 0.1 wykaże, że konkretne metryki zmieniają decyzje projektowe.

**Nie robić jeszcze**

Nie budować telemetry stack, dashboardu ani automatycznych ocen produktywności.

**Możliwy przyszły właściciel:** Project Brain / Observer.

## IDEA 5: Claim Scope / Precision Gate

**Status:** `CANDIDATE`

**Problem**

Poprawny i wykonany kod nie gwarantuje precyzyjnego objaśnienia. Przykład może
dowodzić wyniku tylko dla określonej wartości i typu, gdy prose sugeruje regułę
uniwersalną.

**Hipoteza**

Najpierw rozszerzyć rubricę Critica o pytania:

- czy twierdzenie wykracza poza przykład,
- czy wskazano typ danych i wersję runtime,
- czy opisano istotne wyjątki,
- czy demonstracja nie jest przedstawiana jako ogólna gwarancja,
- czy opis mówi dokładnie tyle, ile dowodzi evidence.

**Evidence**

PHP Arrays i PHP Control Flow wymagały prose-only korekt precyzji mimo poprawnych
i wykonanych przykładów. JS if/else i JS Arrays miały analogiczne zbyt szerokie
twierdzenia legacy, usunięte wcześniej przez Cartographera/Researchera. Pipeline
Review 0.1: `POSSIBLE` dla rozszerzenia rubricy Critica, lecz nie dla osobnego gate
lub agenta.

**Niepewności**

Nie wiadomo jeszcze, czy to stała klasa problemu poza materiałami PHP.

**Minimalny eksperyment**

Klasyfikować podobne uwagi podczas trzech przeglądów B3.

**Trigger do promocji**

Ten sam typ problemu pojawi się w kilku niezależnych artykułach, a dodatkowa rubrica
wykryje go wcześniej.

**Nie robić jeszcze**

Nie tworzyć osobnego agenta ani automatycznego rewrite loop.

**Możliwy przyszły właściciel:** Critic.

## IDEA 6: Humanizer 0.1 jako rubrica

**Status:** `OBSERVE`

**Problem**

Niektóre fragmenty mogą brzmieć mechanicznie, nadmiernie symetrycznie albo
nienaturalnie, lecz drugi pełny Writer mógłby naruszyć poprawne twierdzenia.

**Hipoteza**

Humanizer powinien zacząć jako rubrica oceniająca naturalność, rytm, długość zdań,
powtórzenia, sztuczne przejścia i korporacyjny ton. Ewentualne zmiany mają być
diff-limited, a zmienione twierdzenia ponownie kontrolowane.

**Evidence**

Pierwsze publikacje zawierają pojedyncze miejsca o mniej naturalnym brzmieniu, ale
nie ma jeszcze powtarzalnego katalogu problemów. Pipeline Review 0.1 nie znalazł
powtarzalnej klasy w pięciu finalnych reviews i wydał werdykt `TOO EARLY`.

**Minimalny eksperyment**

Po pięciu artykułach zebrać rzeczywiste przykłady i wykonać ocenę bez modyfikowania
tekstów.

**Trigger do promocji**

Powtarzalny wzorzec językowy oraz rubrica, której oceny są użyteczne dla człowieka.

**Nie robić jeszcze**

Nie tworzyć drugiego Writera, nie przepisywać całych artykułów i nie poprawiać
stylu bez ponownej walidacji merytorycznej.

**Możliwy przyszły właściciel:** Critic / przyszły Humanizer.

## IDEA 7: Interaction Metadata

**Status:** `CANDIDATE`

**Problem**

Nie wiadomo jeszcze, które formy interakcji naturalnie powtarzają się w materiałach
edukacyjnych i uzasadniają budowę interfejsu.

**Hipoteza**

Zapisywać potencjalne interakcje jako niezaimplementowane metadata, np.:

```yaml
interactionCandidates:
  - type: predict-output
    section: truthiness
  - type: quiz
    section: switch-vs-match
  - type: exercise
    section: validation
```

Obserwowane typy mogą obejmować `predict-output`, `show-output`, `quiz`, `hint`,
`exercise`, `next-step`, `compare` i `explain-simpler`.

**Evidence**

Metadata czterech próbek zawiera: `exercise` 4, `predict-output` 3 oraz `quiz`,
`show-output` i `hint` po 1; PHP Arrays jest `unknown`. Pipeline Review 0.1 wskazał
`predict-output` z odkryciem odpowiedzi jako kandydata do osobnego eksperymentu,
nie jako zgodę na UI.

**Minimalny eksperyment**

Zbierać takie metadata dla pięciu artykułów bez tworzenia UI.

**Trigger do promocji**

Jeden format występuje często, ma jasną wartość edukacyjną i da się wdrożyć jako
mały, dostępny komponent.

**Nie robić jeszcze**

Nie budować pełnego Interaction Layer ani Knowledge Navigatora.

**Możliwy przyszły właściciel:** Writer metadata / WEBSITE.

## IDEA 8: Quality Gaps

**Status:** `CANDIDATE`

**Problem i definicja**

Quality Gap to brak albo problem wewnątrz konkretnego materiału lub pipeline, np.:

- brak źródła lub runtime evidence,
- niezweryfikowana gałąź,
- zbyt szerokie twierdzenie,
- niejasny przykład albo cel ćwiczenia,
- niespójna wersja runtime.

Quality Gap nie jest Knowledge Gapem dotyczącym całej mapy wiedzy.

Pipeline Review 0.1 potwierdził powtarzalne klasy: claim scope, granica typu/runtime,
deterministyczny fixture, execution context/prerequisites i clarity ćwiczenia.
Knowledge Gap 0.1 nie został przy tym uruchomiony.

**Hipoteza**

Stała, mała taksonomia pozwoli porównywać Critic failures i interwencje człowieka
bez sprowadzania ich do jednego ogólnego statusu `REVISE`.

**Minimalny eksperyment**

Klasyfikować rzeczywiste problemy w B3 bez zmiany kontraktów agentów.

**Trigger do promocji**

Kategorie powtarzają się i pomagają wskazać konkretną racjonalizację pipeline.

**Nie robić jeszcze**

Nie tworzyć scoringu jakości ani automatycznej decyzji publikacyjnej.

**Możliwy przyszły właściciel:** Critic / Observer.

## IDEA 9: Knowledge Gaps 0.1

**Status:** `CANDIDATE`

**Problem i definicja**

Knowledge Gap oznacza brak w całej mapie wiedzy, nie usterkę jednego artykułu.
Przykładowo obecność materiałów o tablicach i instrukcjach sterujących nie dowodzi,
że istnieje kompletna ścieżka podstaw PHP.

**Hipoteza**

Cartographer może wykrywać luki na podstawie public CONTENT, Knowledge Map, legacy
SOURCE, Strategic Memory, prerequisites, roadmapy, a później także search failures
i analytics.

**Minimalny eksperyment**

Po pięciu pełnych próbkach uruchomić Knowledge Gap 0.1 bez podpowiadania konkretnego
braku. Wejściem byłyby public EDU map, OGW inventory, Strategic Memory i istniejące
candidates. Wynik powinien zawierać TOP gaps, reasoning, prerequisites, priority i
confidence.

**Trigger do promocji**

Cartographer generuje użyteczne i uzasadnione luki bez ręcznego wskazania odpowiedzi.

**Nie robić jeszcze**

Nie budować automatycznego planowania contentu ani publikacji na podstawie gaps.

**Możliwy przyszły właściciel:** Cartographer / Project Brain.

## IDEA 10: Strategic Memory

**Status:** `CANDIDATE`

**Problem**

Legacy SOURCE nie jest jedynym zasobem wiedzy o intencjach projektu. Istnieją także
Project Master, historyczne roadmapy, Futureboard, plany contentowe, wcześniejsze
klastry i materiały typu 10k hours.

**Hipoteza**

Jawnie rozdzielić:

```text
PUBLIC CONTENT      = to, co rzeczywiście publikujemy
SOURCE CORPUS       = legacy artykuły i materiały
STRATEGIC MEMORY    = roadmapy, plany, pomysły i intencje
EXTERNAL EVIDENCE   = aktualna dokumentacja i źródła
```

Strategic Memory może wpływać na priorytety Cartographera, ale nie jest źródłem
faktów dla Researchera.

**Evidence**

B1 i B2 korzystały z wyraźnego oddzielenia SOURCE, decyzji i Project Brain; dalsze
planowanie będzie potrzebowało także historycznych intencji bez mylenia ich z evidence.

**Niepewności**

Nie znamy jeszcze minimalnego kontraktu ani zasad rozstrzygania sprzecznych planów.

**Minimalny eksperyment**

W Knowledge Gap 0.1 oznaczyć każdy strategiczny input jako osobną, niewiążącą
kategorię i sprawdzić, czy poprawia ranking bez tworzenia fałszywych faktów.

**Trigger do promocji**

Eksperyment wykaże powtarzalną wartość i bezpieczną granicę względem Research evidence.

**Nie robić jeszcze**

Nie mieszać historycznych roadmap z evidence i nie tworzyć nowej bazy danych.

**Możliwy przyszły właściciel:** Cartographer / Project Brain.

## IDEA 11: Rendered Content QA

**Status:** `OBSERVE`

**Problem**

Poprawny Markdown i schema-valid CONTENT mogą po transformacji wygenerować
niepożądany HTML.

**Evidence**

W PHP Control Flow samodzielne `WWW` zostało wyrenderowane jako niezamierzony link
`http://WWW`. Kontrola przeglądarkowa wykryła problem, którego nie widać w samym
Markdownzie.

Pipeline Review 0.1 nie wykazał drugiej potwierdzonej klasy rendered defect;
rekomendacja pozostaje `LATER`, a status `OBSERVE`.

**Hipoteza**

Deterministyczne QA wygenerowanego HTML mogłoby kontrolować:

- broken i unexpected links,
- broken anchors, duplicate IDs i heading hierarchy,
- empty links oraz brakujące `alt`,
- malformed external URLs,
- code/table overflow.

**Niepewności**

Nie wiadomo jeszcze, ile klas błędów powtórzy się i które kontrole należą do
testów build output, a które do browser review.

**Minimalny eksperyment**

Zapisywać kolejne render-time defects podczas B3 bez dodawania browser E2E tooling.

**Trigger do promocji**

Powtarzalny problem albo prosta, stabilna kontrola HTML o niskim koszcie utrzymania.

**Nie robić jeszcze**

Nie budować rozbudowanego crawlera ani frameworka E2E dla jednego autolinku.

**Możliwy przyszły właściciel:** WEBSITE / build validation.

## IDEA 12: Content-addressed LAB

**Status:** `OBSERVE`

**Problem**

LAB rośnie przez pełne kopie requestów, responses, drafts, reviews i runtime
evidence. Obecny rozmiar nie utrudnia jeszcze realnej pracy.

**Hipoteza**

W przyszłości powtarzalne payloady mogłyby używać modelu:

```text
payload → SHA-256 → immutable object → manifest references
```

**Evidence**

B1 i B2 znacząco zwiększyły liczbę audytowalnych artefaktów, ale traceability nadal
ma większą wartość niż oszczędność miejsca.

Po pięciu próbkach nadal nie zmierzono przeszkody w clone, review lub replay.
Pipeline Review 0.1 pozostawił pomysł na `LATER` z niską siłą evidence.

**Niepewności**

Nie znamy rzeczywistego kosztu duplikacji, migracji ani wpływu na czytelność Git.

**Minimalny eksperyment**

Po pięciu próbkach zmierzyć duplikację bajtową i liczbę powtarzanych payloadów bez
zmiany ich przechowywania.

**Trigger do promocji**

Rozmiar lub duplikacja mierzalnie utrudnia clone, review, replay albo utrzymanie.

**Nie robić jeszcze**

Nie obniżać traceability, nie migrować historycznych artefaktów i nie dodawać
zewnętrznego object storage.

**Możliwy przyszły właściciel:** LAB storage / Engine core.

## IDEA 13: Learning Loop — Redactoria improves Redactoria

**Status:** `EXPERIMENT`

**Problem**

Redactoria gromadzi dowody o domenie, lecz wiedza o skuteczności własnego pipeline
pozostaje rozproszona między Critic reviews, planami i interwencjami człowieka.

**Hipoteza**

Drugi feedback loop mógłby wyglądać tak:

```text
OBSERVE PIPELINE
  ↓
collect failures
  ↓
classify recurring patterns
  ↓
propose simplification
  ↓
human evaluation
  ↓
improve contracts / validators
```

Potencjalne inputy to Critic/research failures, human interventions, pipeline metrics,
Quality Gaps, rendering defects i Knowledge Gaps.

**Minimalny eksperyment**

Pipeline Review 0.1 po pięciu próbkach, wykonany jako jednorazowy human-reviewed
raport, bez runtime loop.

Eksperyment wykonano na zamrożonych artefaktach. Dał osiem jawnych racjonalizacji,
ale jego wartość nie została jeszcze potwierdzona w następnym przebiegu, więc nie
spełnia triggera do promocji.

**Trigger do promocji**

Review prowadzi do co najmniej jednej mierzalnej racjonalizacji potwierdzonej w
następnym przebiegu.

**Nie robić jeszcze**

Nie tworzyć samomodyfikującego się Engine ani automatycznego wdrażania rekomendacji.

**Możliwy przyszły właściciel:** Observer / Project Brain / człowiek.

## IDEA 14: Nightly Reflection / Dream Cycle

**Status:** `FROZEN / CONCEPT`

**Problem**

W dłuższym okresie wartościowe obserwacje mogą pozostać ukryte w Project Brain,
CONTENT, LAB, historii Critica, search failures i późniejszych analytics.

**Hipoteza**

Okresowa refleksja mogłaby zadawać ograniczone pytania:

- Cartographer: czego brakuje,
- Researcher: co wymaga ponownej weryfikacji,
- Critic: jakie błędy się powtarzają,
- Architect: co można uprościć,
- Opportunity/Business: gdzie może powstać nowa wartość.

Wynik powinien być mały: 1–3 obserwacje, 1–3 hipotezy, jeden Knowledge Gap,
jedna możliwa racjonalizacja i jeden eksperyment do rozważenia.

```text
Reflection → LAB hypothesis → human review
```

Nigdy:

```text
Reflection → CONTENT → publication
```

**Niepewności**

Nie znamy częstotliwości, kontraktu, jakości sygnału ani kosztu. Nie wiadomo też,
czy okresowość daje przewagę nad ręcznym Pipeline Review.

Pipeline Review 0.1 zalecił nie realizować Dream Cycle teraz: siła evidence jest
niska, a koszt i ryzyko szumu wysokie. To brak priorytetu i dojrzałości, nie evidence
przeciw hipotezie. Koncepcja pozostaje zamrożona i może wrócić wyłącznie po nowych
danych oraz jawnej decyzji człowieka.

Szersza etykieta `Agentic Circus` również ma wyłącznie status `FROZEN / CONCEPT`;
nie jest osobnym zaakceptowanym eksperymentem ani elementem Roadmapy.

**Minimalny eksperyment**

Po Pipeline Review 0.1 wykonać co najwyżej jedną ręczną refleksję na zamrożonym
snapshotcie i ocenić jej wartość.

**Trigger do promocji**

Kilka ręcznych prób daje powtarzalne, nieoczywiste i użyteczne obserwacje, a granice
bezpieczeństwa są testowalne.

**Nie robić jeszcze**

Nie implementować, nie harmonogramować, nie uruchamiać agentów okresowo i nie
nadawać wynikowi żadnej władzy nad Roadmapą lub publikacją.

**Możliwy przyszły właściciel:** przyszły Observer / Engine, zawsze z human gate.

## IDEA 15: Post-promotion CONTENT Lineage

**Status:** `CANDIDATE`

**Problem**

Promotion audit dowodzi pierwszej wersji CONTENT, ale nie opisuje późniejszych,
autoryzowanych zmian. Sam mismatch hasha nie odróżnia kontrolowanego cleanupu od
nieudokumentowanej mutacji i może błędnie unieważnić albo zaakceptować Critic PASS.

**Hipoteza**

Każda przyszła zmiana CONTENT po promocji powinna otrzymać append-only rekord z
poprzednim/nowym hashem, zamkniętym typem zmiany, dokładną deterministyczną operacją,
hash-bound zgodą człowieka, źródłowym kandydatem, promotion auditem i wpływem na
review. `CONTENT_CHANGE` unieważnia poprzedni review do czasu nowego Critic PASS.

**Evidence**

CONTENT Lineage Contract Spike 0.1 odtworzył realny przypadek PHP Arrays jako dwa
przejścia: `METADATA_ONLY` i `TECHNICAL_CLEANUP`. Oddzielny backfill nie zmienia
historycznego auditu, a replay osiąga obecny hash dokładnie. Sześć scenariuszy
pozytywnych przechodzi; dziewięć klas błędów zostaje wykrytych.

**Niepewności**

Nie ustalono jeszcze trwałej lokalizacji i atomowego zapisu nowych rekordów. Typy
link fix wymagają większej liczby realnych przykładów. Jeden deterministyczny
backfill nie dowodzi jeszcze ergonomii polityki w kolejnych publikacjach.

**Minimalny eksperyment**

Przy następnej jawnie autoryzowanej zmianie opublikowanego CONTENT zapisać rekord w
tym samym reviewed change i sprawdzić go read-only przed quality gate.

**Trigger do promocji**

Co najmniej dwie nowe rzeczywiste zmiany po promocji tworzą poprawny łańcuch bez
ręcznego rekonstruowania historii, a reguły wpływu na Critic review pozostają jasne.

**Nie robić jeszcze**

Nie edytować starych promotion auditów, nie naprawiać CONTENT automatycznie, nie
uznawać prose-only uzasadnienia i nie integrować z publikacją bez osobnej decyzji.

**Możliwy przyszły właściciel:** Engine validation / Promotion policy.

---

## Najbliższa sekwencja eksperymentalna

Golden Path B3 wykonano bez zmiany ról i bez publikacji kandydatów:

1. JavaScript if/else.
2. JavaScript Arrays.
3. DOM.

Podczas trzech osobnych bounded jobs:

- zbierać lekkie pipeline metrics,
- klasyfikować Critic failures i claim-boundary problems,
- zbierać interaction candidates,
- obserwować problemy językowe i rendering defects,
- nie implementować pozostałych idei Futureboard.

Stan po przeglądzie:

```text
5 full pipeline samples — DONE
  ↓
Pipeline Review 0.1 — DONE, LAB only
  ↓
read-only verify:article contract spike — DONE, 4 PASS / 1 LINEAGE FAIL
  ↓
post-promotion CONTENT lineage contract spike — DONE, prototype PASS
  ↓
operator CLI / durable lineage policy — SEPARATE DECISION REQUIRED
  ↓
Knowledge Gap 0.1 — NOT RUN
  ↓
jawne decyzje o dalszych eksperymentach lub promocji — REQUIRED
```

Review może ocenić Article Manifest, `verify:article`, Precision Gate, Humanizer
rubric, pierwszy Interaction component, Rendered Content QA i zasadność dalszych
pomysłów.

Zasada nadrzędna:

> Nie przyspieszamy przez dokładanie agentów. Przyspieszamy przez mierzenie,
> eliminowanie powtarzalnej pracy, deterministyczne walidatory, reusable contracts
> i architekturę opartą na evidence.
