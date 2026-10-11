# Researcher 0.1 — javascript-arrays

## RESEARCH SCOPE

Research Packet, nie artykuł ani zatwierdzenie publikacji. Jeden pełny materiał SOURCE.

- 2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md (2048)

Tryb: imported-session-analysis; model: unknown-codex-session.
Request SHA-256: fabbf42d8b843b15e7109bb0831808e82fe078610e7df19512744852ac8e296c

## RUNTIME TARGET

Node v24.16.0

Stan dokumentacji: 2026-10-11.

Wykonane runtime: node v24.16.0; szczegóły w osobnym execution evidence.

## VERIFIED CLAIMS

### verified-core

map i filter zwracają nowe tablice, reduce z wartością początkową obsługuje pustą tablicę, a sort mutuje odbiorcę i potrzebuje komparatora numerycznego. (verified; confidence: 0.98)

Evidence: [mdn-array-map/map-new-array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [mdn-array-reduce/reduce-empty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), [mdn-array-sort/sort-mutates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

SOURCE: 2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md, body: "Pierwotna wersja kodu miała drobny problem:średnia była liczona **na bieżąco w kilku miejscach** (avg(u.marks)), przez co sortowanie potrafiło zwracać różne wyniki albo działało wolniej."

Zalecenie: Użyć tej semantyki jako granicy treści i przykładów.

## CLAIMS REQUIRING CORRECTION

### correct-legacy

Wielokrotne wywołanie czystej funkcji avg może zwiększyć koszt, lecz nie powoduje samo w sobie różnych wyników sortowania. (verified; confidence: 0.98)

Evidence: [mdn-array-map/map-new-array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

SOURCE: 2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md, body: "Pierwotna wersja kodu miała drobny problem:średnia była liczona **na bieżąco w kilku miejscach** (avg(u.marks)), przez co sortowanie potrafiło zwracać różne wyniki albo działało wolniej."

Zalecenie: Nie przenosić błędu źródłowego do nowej wersji.

## OUTDATED / QUESTIONABLE MATERIAL

Brak.

## CODE ISSUES

### code-boundary

Kontrolowana próba Node potwierdza oczekiwane wyniki dla przypadków granicznych. (verified; confidence: 0.98)

Evidence: [mdn-array-map/map-new-array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [mdn-array-reduce/reduce-empty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), [mdn-array-sort/sort-mutates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

SOURCE: 2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md, body: "Pierwotna wersja kodu miała drobny problem:średnia była liczona **na bieżąco w kilku miejscach** (avg(u.marks)), przez co sortowanie potrafiło zwracać różne wyniki albo działało wolniej."

Zalecenie: Pisać przykłady zgodne z wykonanym probe i ponownie wykonać kod finalnego draftu.

Kod: executed-probe; probes: node-array-behavior.

## bounded-scope

- [verified-core](#verified-core): Użyć tej semantyki jako granicy treści i przykładów.
- [correct-legacy](#correct-legacy): Nie przenosić błędu źródłowego do nowej wersji.
- [code-boundary](#code-boundary): Pisać przykłady zgodne z wykonanym probe i ponownie wykonać kod finalnego draftu.

## SECURITY / CAUTION NOTES

Brak.

## RECOMMENDED ARTICLE CHANGES

- CORRECT: Napisać zwarty materiał od nowa, zachować pochodzenie i użyć tylko zweryfikowanych twierdzeń. [verified-core, correct-legacy, code-boundary]

## UNRESOLVED QUESTIONS


## SOURCE REGISTER

- [mdn-array-map — MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map); language-reference; pobrano 2026-10-11T14:33:09.282Z; evidence: map-new-array; SHA-256: 27cddd1fb9a13fd00e7127a55122054a514f26c475b29bd14dc3acec2b6430c2
- [mdn-array-reduce — MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce); language-reference; pobrano 2026-10-11T14:33:09.282Z; evidence: reduce-empty; SHA-256: 777e14f10417568a468fbee1bdaedb604bf8106c4062c7020ccd78df71f1702c
- [mdn-array-sort — MDN: Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort); language-reference; pobrano 2026-10-11T14:33:09.282Z; evidence: sort-mutates; SHA-256: a13c97ec1c7e4e8ee986aabafc22790bf45d9c88aeadb1e239bbd91d4d7b7d28

## LIMITATIONS

- Badanie jest ograniczone do jednego autoryzowanego źródła legacy i wskazanych oficjalnych stron; nie stanowi zgody na publikację.

## WRITER HANDOFF

Założony runtime: Node v24.16.0

### Zachowaj

- Zachować dydaktyczny rdzeń źródła, ale przepisać prozę. [verified-core]

### Popraw

- Wielokrotne wywołanie czystej funkcji avg może zwiększyć koszt, lecz nie powoduje samo w sobie różnych wyników sortowania. [correct-legacy]

### Nie powielaj


### Ostrożność

- Wyniki draftu wykonać ponownie, niezależnie od probe badawczego. [code-boundary]

### Zweryfikowane przykłady

- code-boundary: executed-probe; node-array-behavior

STOP — następny krok wymaga decyzji człowieka.
