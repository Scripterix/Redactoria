---
title: "Tablice JavaScript: map, filter, reduce i sort bez mutowania danych"
description: "Praktyczne operacje na tablicach JavaScript: map, filter, reduce, przypadek pusty oraz numeryczne sortowanie bez zmiany danych wejściowych."
slug: tablice-w-javascript
featuredImage: ../../src/assets/tablice-w-javascript.webp
featuredAlt: Dziewczyna porządkuje karty w szufladach symbolizujących tablice JavaScript.
status: published
created: 2026-10-11T00:00:00.000Z
updated: 2026-10-11T00:00:00.000Z
domain: programming
topic: javascript
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: MDN — Array.prototype.map
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    publisher: MDN Web Docs
  - title: MDN — Array.prototype.reduce
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    publisher: MDN Web Docs
  - title: MDN — Array.prototype.sort
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    publisher: MDN Web Docs
origin:
  type: wordpress-export
  source_id: "2048"
  original_url: https://opengateweb.com/posts/tablice-javascript-js-arrays-sortowanie-filtrowanie-i-srednia-ocen-krok-po-kroku/
  original_date: 2025-09-09T00:00:00.000Z
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
# Tablice JavaScript: map, filter, reduce i sort bez mutowania danych

Zakres: node v24.16.0. Materiał dla początkujących i osób na poziomie średnim.

<a id="transform-filter"></a>

## Nowe tablice z map i filter

`map` wywołuje funkcję dla elementów i buduje nową tablicę wyników. `filter` także zwraca nową tablicę, lecz zachowuje tylko elementy spełniające warunek. Do nauki używamy stałych danych, aby każde uruchomienie dawało ten sam wynik.

Nie trzeba dopisywać obliczonego pola do obiektów wejściowych. Możesz zwrócić nowe obiekty przez składnię spread. To ułatwia sprawdzenie, że oryginalna kolekcja pozostała bez zmian.

### Transformacja bez zmiany danych wejściowych

```js
const scores = [40, 75, 90];
const doubled = scores.map(score => score * 2);
const passed = scores.filter(score => score >= 60);
console.log(JSON.stringify({ doubled, passed, scores }));
```

Oczekiwany wynik:

```text
{"doubled":[80,150,180],"passed":[75,90],"scores":[40,75,90]}
```

<a id="reduce-average"></a>

## reduce i pusta tablica

`reduce` łączy elementy w jedną wartość. Podanie wartości początkowej `0` sprawia, że suma pustej tablicy również jest zdefiniowana. Średnia wymaga osobnego kontraktu: dla braku elementów poniższa funkcja zwraca `null`, bo zero mogłoby wyglądać jak prawdziwy wynik.

Zaokrąglanie jest decyzją prezentacyjną. Najpierw policz dokładną średnią, a dopiero podczas wyświetlania wybierz potrzebną liczbę miejsc.

### Średnia z jawnym przypadkiem pustym

```js
const average = values => values.length
  ? values.reduce((sum, value) => sum + value, 0) / values.length
  : null;
console.log(average([2, 4, 9]));
console.log(average([]));
```

Oczekiwany wynik:

```text
5
null
```

<a id="sorting"></a>

## Sortowanie numeryczne bez mutacji wejścia

`sort` zmienia tablicę, na której został wywołany. Bez komparatora porównuje wartości jak napisy, więc liczba 10 może znaleźć się przed 2. Jeśli chcesz zachować dane wejściowe, posortuj kopię utworzoną przez spread. Komparator `(a, b) => a - b` ustala kolejność rosnącą liczb.

Ponowne liczenie tej samej czystej średniej w komparatorze może być zbędną pracą, ale nie wprowadza losowości. Optymalizację uzasadniaj pomiarem, nie obietnicą.

### Komparator liczbowy i zachowane wejście

```js
const values = [10, 2, 30];
const sorted = [...values].sort((a, b) => a - b);
console.log(sorted.join(','));
console.log(values.join(','));
```

Oczekiwany wynik:

```text
2,10,30
10,2,30
```

Dalej: [DOM w JavaScript](/artykuly/dom-w-javascript/) — użycie danych do bezpiecznej aktualizacji dokumentu i obsługi zdarzeń.
