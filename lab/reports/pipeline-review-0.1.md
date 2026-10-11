# Redactoria — Pipeline Review 0.1

Status: **COMPLETE — EVIDENCE REVIEW ONLY**
Snapshot: 2026-10-11
Zakres: pięć zakończonych próbek pipeline; bez nowej generacji, publikacji i zmian kontraktów.

## Executive summary

Pięć próbek potwierdza stabilny wspólny przebieg od identyfikacji SOURCE do
nieopublikowanego, hash-bound kandydata w LAB. Najsilniejsza racjonalizacja nie
dotyczy nowego agenta, lecz read-only `verify:article`: te same klasy kontroli
integralności powtórzyły się 5/5 razy. Article Manifest jest również silnie
uzasadniony jako indeks odwołań i hashy, ale nie jako nowe źródło prawdy.

Najważniejszym powtarzalnym problemem merytorycznym jest zakres twierdzeń:
wykonany kod może być poprawny, gdy objaśniająca go proza jest zbyt szeroka.
Dowody uzasadniają rozszerzenie rubryki Critica, lecz jeszcze nie osobny Precision
Gate. Dowody nie uzasadniają Humanizera ani nowego agenta. W metadanych interakcji
najczęstsze było ćwiczenie, a najbardziej jednolitym kandydatem komponentu jest
`predict-output` z opcjonalnym odkryciem odpowiedzi.

To porównanie jest opisowe, nie produktywnościowe. Dwie próbki PHP są znacznie
większe i mają bogatsze macierze runtime niż trzy celowo małe próbki B3. Czas,
tokeny, koszt, wykorzystanie quota i efekty nauki nie były wiarygodnie rejestrowane.

## Granice przeglądu

- Nie uruchomiono Writerów, Criticów ani Knowledge Gap 0.1.
- Nie zmieniono SOURCE, CONTENT, kandydatów, review ani decyzji publikacyjnych.
- Nie uruchomiono Promotion Gate, commit, push ani deploymentu.
- Nie wdrożono `verify:article`, Article Manifest, Precision Gate, Humanizera,
  komponentu interakcji ani nowego runtime agenta.
- Brak danych oznaczono jako `unknown` lub `not recorded`, nigdy jako zero.

## Znormalizowane porównanie

| Metryka | PHP Arrays | PHP Control Flow | JS if/else | JS Arrays | JS DOM |
| --- | --- | --- | --- | --- | --- |
| SOURCE | 2 pliki | 1 plik | 1 plik | 1 plik | 1 plik |
| Cartographer | MERGE, 0.96 | REWRITE, 0.97 | REWRITE, 0.97 | REWRITE, 0.97 | REWRITE, 0.97 |
| Oficjalne źródła research | 34 | 18 | 3 | 3 | 5 |
| Verified / incorrect / ambiguous | 25 / 4 / 3 | 18 / 1 / 2 | 1 / 1 / 0 | 1 / 1 / 0 | 1 / 1 / 0 |
| Code findings | 8 | 8 | 1 | 1 | 1 |
| Nierozwiązane przed Writerem | 0 po suplemencie | 0 | 0 | 0 | 0 |
| Runtime | PHP 8.4.26 + 8.5.11 | PHP 8.4.26 + 8.5.11 | Node 24.16.0 | Node 24.16.0 | Chromium 154 |
| Research probes / assertions | 24 / 120 | 16 / 48 | 1 / 1 | 1 / 1 | 1 / 1 |
| Final examples / records | 17 / 34 | 16 / 32 | 2 / 2 | 3 / 3 | 1 / 1 + 7 browser assertions |
| Writer generations | 1 | 1 | 1 | 1 | 1 |
| Critic iterations | 2 | 2 | 1 | 1 | 1 |
| Critic verdicts | REVISE → PASS | REVISE → PASS | PASS | PASS | PASS |
| Applied changes | 3 prose, 0 code | 1 prose, 0 code | 0 | 0 | 0 |
| Interaction metadata | unknown | 4 | 2 | 2 | 2 |
| Recorded role calls | 5 | 5 | 4 | 4 | 4 |
| Model identity | generic label | generic label | unknown | unknown | unknown |
| Duration / tokens / quota | not recorded | not recorded | not recorded | not recorded | not recorded |
| Candidate | exact, pending/false | exact, pending/false | exact, pending/false | exact, pending/false | exact, pending/false |

## Inwentarz próbek

### 1. PHP Arrays

- SOURCE: `1324-post-61-tablice-w-php-czesc-1.md`
  (`45a70e243361632e60992e1ef1ba91d7cdd073306b552b7bd4a148250b786d90`)
  i `1356-post-62-php-tablice-czesc-ii.md`
  (`845bd2e7b8d36e669688e4638c6e7c2f8ee7403aece887c423921d9282afcc5c`).
- Cartographer: `MERGE`, confidence 0.96; materiały komplementarne, lecz
  fragmentaryczne, z duplikacją, konfliktami i ukrytym stanem.
- Research: 34 oficjalne źródła, 25 faktów, 4 niepoprawne twierdzenia, 3
  niejednoznaczności, 3 uwagi bezpieczeństwa i 8 code findings. Dwie początkowe
  niewiadome zostały zamknięte runtime supplementem przed Writerem.
- Wykonanie: PHP 8.4.26 i 8.5.11; 24 probes / 120 assertions PASS; potem 17
  unikalnych przykładów / 34 records PASS.
- Writer: jedna generacja. Critic: `REVISE`, potem `PASS`. Wymagana korekta
  zawęziła twierdzenie o `array_reduce`; dwie opcjonalne korekty objaśniły arrow
  callback i podpisały stany usuwania. Zmieniono trzy fragmenty prozy, bez zmian kodu.
- Kandydat: `713d31d87e8bdfb1b41b237299ce30d397dafcec56f220eaa13bad5d003b3068`,
  exact copy, historycznie `pending/false`; późniejsza lokalna promocja jest osobnym
  wynikiem.
- Interwencje człowieka: cztery zapisane zdarzenia — MERGE, research, korekta i
  późniejsza publikacja; trzy prowadziły do kandydata, jedno nastąpiło po nim.
- Interakcje: kontrakt jeszcze ich nie zapisywał, więc wynik to `unknown`, nie zero.

### 2. PHP Control Flow

- SOURCE: `1308-post-60-instrukcje-sterujace-php.md`
  (`b9709b37984d1cac4aeef2d14fb49e614d2eb3d406e399117ed818b6c39799c4`).
- Cartographer: `REWRITE`, confidence 0.97; szeroki, lecz niepełny materiał.
- Research: 18 oficjalnych źródeł, 18 faktów, 1 niepoprawne twierdzenie,
  2 niejednoznaczności, 8 code findings, 0 nierozwiązanych kwestii.
- Wykonanie: PHP 8.4.26 i 8.5.11; 16 probes / 48 assertions PASS; 16 finalnych
  przykładów / 32 records PASS.
- Writer: jedna generacja. Critic: `REVISE`, potem `PASS`. Jedna wymagana korekta
  rozdzieliła `int 0` od `float 0.0`; bez zmian kodu i expected output.
- Kandydat: `2a44143b3a355375fead8fe24b2c08c40ed2f1f6df1a7fcb13aa942f3d2f8f8b`,
  exact copy, historycznie `pending/false`; późniejsza publiczna promocja jest
  osobnym wynikiem.
- Interwencje człowieka: dwa zapisane zdarzenia — ograniczona autoryzacja B2 do
  kandydata i późniejsza publikacja. Akceptacja research była walidacją sesji, nie
  nowym review człowieka.
- Interakcje: `quiz`, `show-output`, `hint`, `exercise` — metadata only.

### 3. JavaScript if/else

- SOURCE: `2068-if-i-else-w-javascript-od-prostych-warunkow-do-pra.md`
  (`47adb6838a319abcd781504a75f071fe88c852c63fdd9cd5300e13f7cc1fa692`).
- Cartographer: `REWRITE`, confidence 0.97; przydatny rdzeń wymagał granic dla
  whitespace, liczb skończonych, równości i usunięcia pobocznych zakresów.
- Research: 3 oficjalne źródła, 1 fakt, 1 niepoprawne twierdzenie, 1 code finding.
- Wykonanie: Node 24.16.0; 1 probe / 1 assertion oraz 2 finalne przykłady PASS.
- Writer / Critic: jedna generacja, jeden pełny `PASS`, bez rewizji.
- Kandydat: `016fca1b663c48fdf8db76530be43d37f71769905c6a057647098f3755e06835`,
  exact, `pending/false`.
- Interwencje: jedna wspólna autoryzacja B3 przypisana do próbki; łącznie dla
  trzech B3 jest to jedno unikalne zdarzenie. Interakcje: `predict-output`, `exercise`.

### 4. JavaScript Arrays

- SOURCE: `2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md`
  (`c6a8b0859da9d9186a3bccc697bb1f82eb382ebe498c64dfea0603635e8c42fe`).
- Cartographer: `REWRITE`, confidence 0.97; losowe fixtures, pominięta mutacja
  `sort()` oraz nieudowodnione twierdzenia o deterministyczności i wydajności.
- Research: 3 oficjalne źródła, 1 fakt, 1 niepoprawne twierdzenie, 1 code finding.
- Wykonanie: Node 24.16.0; 1 probe / 1 assertion oraz 3 finalne przykłady PASS.
- Writer / Critic: jedna generacja, jeden pełny `PASS`, bez rewizji.
- Kandydat: `c0a29c1cc9a1e68702bac00d9eff999b1240cab0e622199b64ce8e1602f6f465`,
  exact, `pending/false`.
- Interwencje: ta sama wspólna autoryzacja B3. Interakcje: `predict-output`, `exercise`.

### 5. JavaScript DOM

- SOURCE: `940-post-45-javascript-dom-selections-i-proste-funkcje.md`
  (`786157fe64bdabe59cdef16a614e30676d45a47b070fab6fa562ffd0b6fe715a`).
- Cartographer: `REWRITE`, confidence 0.97; błąd terminologiczny, zduplikowane lub
  niepełne snippets, niejasne collections, brak null/timing i hover-only behavior.
- Research: 5 oficjalnych źródeł, 1 fakt, 1 niepoprawne twierdzenie, 1 code finding.
- Wykonanie: kontrolowany Chromium 154; 1 research record PASS; 1 finalny przykład
  i 7 browser assertions PASS.
- Writer / Critic: jedna generacja, jeden pełny `PASS`, bez rewizji.
- Kandydat: `7774e12d71a8622eb5df093c1f124a5970853bddb74885cd501ae2119c901bed`,
  exact, `pending/false`.
- Interwencje: ta sama wspólna autoryzacja B3. Interakcje: `predict-output`, `exercise`.

## Powtarzalne wzorce

### A. Pipeline

Wystąpiły 5/5 razy: SOURCE path + SHA-256, jawna decyzja Cartographera, oficjalne
evidence Researchera, runtime evidence przed Writerem, osobne wykonanie przykładów
draftu, hash-bound draft, pełny Critic, audit rewizji także dla no-op oraz exact
kandydat z flagami publikacji `false`. Decyzja publikacyjna, CONTENT i audit promocji
występują tylko w dwóch PHP runs i są warunkowym etapem poza wspólnym rdzeniem.

### B. Problemy jakości

- Zakres twierdzenia szerszy niż pokazany typ, input albo przykład: dwa potwierdzone
  Critic failures i dwa podobne problemy usunięte wcześniej przez research.
- Brak jawnej granicy typu, runtime lub wejścia: cztery próbki.
- Potrzeba deterministycznych fixtures lub jawnych inputs: wszystkie próbki.
- Potrzeba jawnego execution context lub prerequisites: trzy próbki.
- Niejasne objaśnienie ćwiczenia albo outputu mimo poprawnego kodu: jedna próbka.

### C. Język i styl

Nie wykryto powtarzalnej klasy problemu stylistycznego. PHP Arrays miało dwie
opcjonalne uwagi czytelności; PHP Control Flow miał problem przede wszystkim z
precyzją. Trzy małe artykuły JavaScript otrzymały `PASS` bez uwag stylistycznych.
Nie ma ocen naturalności od czytelników ani danych o rozumieniu tekstu.

### D. Interakcje

Metadata istnieją dla czterech próbek; PHP Arrays jest `unknown`. Po normalizacji
`mini-quiz` do `quiz`: `exercise` 4, `predict-output` 3, a `quiz`, `show-output`
i `hint` po 1. Nic nie zostało wdrożone w WEBSITE.

## Quality Gap a Knowledge Gap

**Quality Gap** to wada lub brak kontroli wewnątrz konkretnego materiału albo
przebiegu, np. brak evidence, nadmiernie szerokie twierdzenie, brak runtime check
lub niejasne ćwiczenie.

**Knowledge Gap** to brak prerequisite lub tematu w całej mapie wiedzy. Nie można
go wnioskować tylko z usterki pojedynczego artykułu. Obecność artykułów o tablicach
i sterowaniu nie dowodzi kompletnej ścieżki PHP lub JavaScript; podobnie brak
publikacji trzech kandydatów JS nie dowodzi luki wiedzy.

W tym przeglądzie sklasyfikowano wyłącznie Quality Gaps i zapisano możliwe inputy
dla przyszłego eksperymentu. Knowledge Gap 0.1 **nie został uruchomiony** i raport
nie stwierdza żadnego konkretnego brakującego tematu.

## Claim Scope / Precision

| Przypadek | Gdzie wykryty | Czy runtime wystarcza? | Możliwa reguła deterministyczna |
| --- | --- | --- | --- |
| `array_reduce` opisany jakby nie mógł zwrócić tablicy | Critic PHP Arrays | Nie; kod sumujący nie dowodzi uniwersalnego typu wyniku | Tylko eskalacja sygnału leksykalnego; wymaga oceny semantycznej |
| `!== 0` opisany jak ogólna walidacja zera liczbowego | Critic PHP Control Flow | Tylko po dodaniu boundary case `0.0` | Częściowo: porównanie typu w prozie z fixtures |
| Powtarzany średni wynik miał rzekomo zmieniać sort i zawsze poprawiać wydajność | Cartographer/Researcher JS Arrays | Determinizm tak; wydajność wymaga benchmarku | Flagować niemierzone twierdzenia wydajnościowe |
| `Number.isNaN` potraktowany jak pełna walidacja liczby | Cartographer/Researcher JS if/else | Tak, dla ustalonego kontraktu wejścia i boundary fixtures | Dobra podatność na stałe testy graniczne |

Werdykt: **POSSIBLE**. Powtarzalność uzasadnia rozszerzenie istniejącej rubryki
Critica o kontrolę claim scope. Nie uzasadnia osobnego gate, agenta ani
automatycznego rewrite loop. Runtime testuje zachowanie kodu, nie zakres znaczeniowy
prozy.

## Humanizer

| Kategoria | Evidence |
| --- | --- |
| Nienaturalne frazowanie | nie rejestrowano systematycznie |
| Powtórzenia | brak powtarzalnego issue Critica; brak pomiaru czytelników |
| Długość zdań | niemierzona wiarygodnie |
| Sztuczna symetria | słaba obserwacja tylko w powtarzalnych metadanych B3 |
| Generyczny „CI tone” | niepotwierdzony w reviews |
| Niezręczne przejścia | nie odnotowano |

Werdykt: **TOO EARLY**. Niewiążąca checklista może być tania, lecz evidence nie
uzasadnia etapu Humanizer, osobnego agenta ani ingerencji w tekst.

## Interaction Layer

| Typ | Liczba znanych próbek |
| --- | ---: |
| `exercise` | 4 |
| `predict-output` | 3 |
| `quiz` | 1 |
| `show-output` | 1 |
| `hint` | 1 |

Top 3 to `exercise`, `predict-output` oraz remis `quiz` / `show-output` / `hint`.
Werdykt: **candidate identified**. Pierwszym kandydatem jest dostępny
`predict-output` z opcjonalnym odkryciem odpowiedzi, ponieważ występuje w trzech
niezależnych próbkach JS i można go związać z już wykonanymi przykładami. `exercise`
jest częstsze, ale mniej jednolite i trudniejsze do automatycznej weryfikacji.
Brakuje danych użycia, oceny dostępności i kosztu utrzymania.

## Propozycja `verify:article`

Powtarzalne kontrole: source path/hash, decision/cartography binding, acceptance i
hash Research Packet, runtime evidence, wykonanie finalnych przykładów, exact draft
i Critic `PASS`, revision audit, candidate exact-copy/hash oraz spójność flag stanu.
Kontrole publikacji, CONTENT i auditu są warunkowe i dotyczą obecnie 2/5 próbek.

Proponowany kontrakt, **bez implementacji**:

```text
npm run verify:article -- --topic <topic>

input:  topic slug + istniejące SOURCE/LAB + opcjonalne publication/CONTENT
work:   read-only, deterministic, offline, zero model calls
output: per-check PASS | FAIL | NOT_APPLICABLE + krótkie podsumowanie
exit 0: wszystkie applicable checks PASS
exit 1: naruszenie integralności albo polityki
exit 2: niewspierana lub niepełna generacja artefaktów
```

Polecenie nie może wywoływać agentów, poprawiać, regenerować, zatwierdzać,
publikować, zapisywać plików ani używać sieci.

## Minimalny Article Manifest

Werdykt: **strongly justified**, lecz tylko jako indeks istniejących artefaktów.

```yaml
id: topic-slug
source:
  - ref: SOURCE-relative-path
    sha256: 64-hex
cartography:
  ref: LAB-ref
  sha256: 64-hex
  decisionRef: LAB-ref
  decision: MERGE | REWRITE | KEEP_AND_UPDATE
research:
  packetRef: LAB-ref
  packetHash: 64-hex
  approvalRef: LAB-ref
  status: approved | validated
runtimeEvidence:
  ref: LAB-ref
  sha256: 64-hex
  status: PASS
writer:
  draftRef: LAB-ref
  metadataRef: LAB-ref
  articleHash: 64-hex
critic:
  reviewRef: LAB-ref
  reviewHash: 64-hex
  verdict: PASS | REVISE | BLOCK
  iterations: integer
candidate:
  ref: LAB-ref
  hash: 64-hex
  articleHash: 64-hex
  status: publication-candidate
publication:
  status: not-requested | pending | approved | promoted
  decisionRef: LAB-ref | null
  auditRef: LAB-ref | null
  contentRef: CONTENT-ref | null
```

Manifest przechowuje refs i hashe, nie kopiuje payloadów i nie zastępuje źródeł
prawdy. Sekcja publication jest nullable i nie nadaje zgody.

## Metryki

### AVAILABLE

Liczby i hashe SOURCE, liczba oficjalnych źródeł i findings research, probes i
assertions runtime, finalne przykłady i records, generacje Writera, iteracje i
werdykty Critica, required/optional corrections, exact candidate hashes, zapisane
decyzje, interaction metadata tam, gdzie istniał kontrakt, oraz recorded role calls.

### UNKNOWN

End-to-end duration, tokeny, quota, koszt pieniężny, czas ludzkiej lektury/review,
wyniki uczących się i interaction opportunities dla PHP Arrays.

### NOT MEASURABLE RELIABLY

Produktywność między runs na podstawie liczby dokumentów, trudność semantyczna z
liczby słów/przykładów, unikalne interwencje przy wspólnej lub chat-only
autoryzacji oraz procent tokenów/quota bez kompletnego licznika i mianownika.
Nie należy budować procentowego licznika wykorzystania na tych danych.

## Ranking racjonalizacji

| # | Pomysł | Evidence | Wartość | Koszt | Ryzyko | Rekomendacja |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `verify:article` | HIGH | usuwa powtarzalną ręczną kontrolę bez decyzji redakcyjnej | MEDIUM | LOW przy read-only i obsłudze generacji | **NOW** |
| 2 | Article Manifest | HIGH | jeden stabilny indeks rozproszonych refs/hashów | MEDIUM | MEDIUM: duplikacja lub nowe źródło prawdy | **NEXT** |
| 3 | Precision / Critic rubric | HIGH | wcześniejsza eskalacja claim-boundary errors | LOW jako rubrica, MEDIUM jako gate | LOW jako rubrica, wyższe jako autonomiczny gate | **NEXT** dla rubricy; osobny gate LATER |
| 4 | Humanizer rubric | LOW | możliwa poprawa czytelności, nieudowodniona | LOW checklista, HIGH agent | MEDIUM: wygładzenie może poszerzyć poprawne claims | **LATER** |
| 5 | Pierwszy Interaction component | MEDIUM | przewidywanie outputu wokół wykonanych przykładów | MEDIUM | MEDIUM: accessibility, stale output, utrzymanie | **NEXT** jako osobny micro-experiment |
| 6 | Rendered Content QA | MEDIUM | wykrywa błędy dopiero w HTML | MEDIUM | LOW–MEDIUM | **LATER** |
| 7 | Content-addressed LAB | LOW | dziś mała; traceability jest ważniejsze od niezmierzonej oszczędności | HIGH | HIGH: migracja i czytelność Git | **LATER** |
| 8 | Dream Cycle | LOW | nieudowodniona ponad jednorazowy review | HIGH | HIGH: szum i presja automatyzacji | **REJECT** |

## Wniosek architektoniczny

Zasada została potwierdzona: nie przyspieszać przez dokładanie agentów. Wspólną
wartość dają reusable contracts, deterministyczne walidatory read-only i usuwanie
powtarzalnej pracy integralnościowej. Ocena zakresu twierdzenia oraz zgoda na
publikację pozostają decyzjami wymagającymi osądu i jawnego human gate.

Wszystkie pięć runs użyło tych samych czterech ról. Dwie skuteczne korekty były
małymi, hash-bound zmianami prozy zakończonymi pełnym re-review, a nie nowymi
generacjami Writera.

## Następny najmniejszy eksperyment

**Read-only `verify:article` contract spike**: zdefiniować fixtures oraz oczekiwane
wyniki `PASS` / `FAIL` / `NOT_APPLICABLE` dla pięciu zamrożonych próbek przed
implementacją CLI. To najwyższa siła powtarzalnego evidence, małe ryzyko granic i
brak potrzeby nowego agenta albo mutacji contentu.

Na tym Pipeline Review 0.1 się zatrzymuje. Implementacja, Knowledge Gap 0.1,
publikacja i promocja pomysłów do Roadmapy wymagają osobnych decyzji człowieka.

Strukturalnym odpowiednikiem raportu jest
[`pipeline-review-0.1.json`](pipeline-review-0.1.json).
