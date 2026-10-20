---
title: "Warunki w JavaScript z if, else i bezpieczną walidacją liczb"
description: Praktyczne wprowadzenie do if/else, kolejności gałęzi, truthiness, ścisłych porównań i bezpiecznej walidacji liczb w JavaScript.
slug: warunki-w-javascript
featuredImage: ../../src/assets/warunki-w-javascript.webp
featuredAlt: Osoba ogląda na monitorze wireframe z rozgałęzionym schematem warunków JavaScript.
status: published
created: 2026-10-11T00:00:00.000Z
updated: 2026-10-19T00:00:00.000Z
domain: programming
topic: javascript
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: MDN — if...else
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
    publisher: MDN Web Docs
  - title: MDN — Boolean
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
    publisher: MDN Web Docs
  - title: MDN — Number
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
    publisher: MDN Web Docs
origin:
  type: wordpress-export
  source_id: "2068"
  original_url: https://opengateweb.com/posts/if-i-else-w-javascript-od-prostych-warunkow-do-praktycznych-aplikacji/
  original_date: 2025-09-21T00:00:00.000Z
  original_author: Scripterix
review:
  status: approved
  reviewer: human — public production approval
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-11T00:00:00.000Z
  update_priority: normal
redactoria:
  decision: rewrite
  modernization: major
---
# Warunki w JavaScript z if, else i bezpieczną walidacją liczb

Zakres: node v24.16.0. Materiał dla początkujących i osób na poziomie średnim.

<a id="branches"></a>

## Pierwsza pasująca gałąź

`if` wykonuje blok, gdy warunek po konwersji do wartości logicznej jest prawdziwy. Kolejne `else if` są sprawdzane od góry, a po pierwszym dopasowaniu reszta łańcucha jest pomijana. Dlatego bardziej szczegółowy próg umieszczaj przed ogólniejszym. `else` obsługuje wszystkie pozostałe przypadki.

Warto rozdzielić truthiness od porównania. Pusty napis jest falsy, lecz napis `"0"` jest truthy. Operator `===` nie konwertuje typów: liczba `0` i napis `"0"` nie są ściśle równe. Do sprawdzania danych wejściowych używaj jawnych warunków zamiast liczyć na przypadkową konwersję.

### Kolejność progów i ścisłe porównanie

```js
const score = 92;
let label;
if (score >= 90) label = 'bardzo dobry';
else if (score >= 60) label = 'zaliczony';
else label = 'do poprawy';
console.log(label);
console.log(0 === '0');
```

Oczekiwany wynik:

```text
bardzo dobry
false
```

<a id="numeric-input"></a>

## Od tekstu do skończonej liczby

Wartość z pola formularza jest tekstem. Sama funkcja `Number` nie wystarcza do walidacji: pusty napis i same białe znaki stają się zerem, a napis `"Infinity"` daje liczbę nieskończoną. Najpierw odrzuć `null`, `undefined` i tekst pusty po `trim()`. Potem wykonaj konwersję i zaakceptuj wynik tylko wtedy, gdy `Number.isFinite` zwraca `true`.

Czysta funkcja poniżej ma jawny kontrakt i zwraca etykietę zamiast zmieniać DOM. Dzięki temu każdą gałąź można wykonać w Node. Zwróć uwagę na zero: nie jest dodatnie ani ujemne, więc potrzebuje własnej gałęzi.

### Walidacja białych znaków, NaN i Infinity

```js
function analyzeNumber(raw) {
  if (raw == null || String(raw).trim() === '') return 'brak';
  const value = Number(raw);
  if (!Number.isFinite(value)) return 'niepoprawna';
  if (value > 0) return 'dodatnia';
  if (value < 0) return 'ujemna';
  return 'zero';
}
console.log([' ', '12', 'Infinity', 'abc', '0', '-2'].map(analyzeNumber).join('|'));
```

Oczekiwany wynik:

```text
brak|dodatnia|niepoprawna|niepoprawna|zero|ujemna
```

Dalej: [tablice w JavaScript](/artykuly/tablice-w-javascript/) — transformacje, filtrowanie, redukcja i sortowanie bez zmiany danych wejściowych.
