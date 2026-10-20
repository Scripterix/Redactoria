---
title: "Jak działają funkcje w JavaScript"
description: "Podstawy funkcji JavaScript: parametry, return, obserwowanie wyniku i callback przekazany do Array.map."
slug: funkcje-javascript
status: published
created: 2026-10-16T00:00:00.000Z
updated: 2026-10-19T00:00:00.000Z
domain: programming
topic: javascript
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: ECMAScript Language Specification — Functions and Classes
    url: https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html
    publisher: TC39
  - title: MDN — Functions
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions
    publisher: MDN Web Docs
  - title: MDN — Array.prototype.map()
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    publisher: MDN Web Docs
  - title: Node.js Documentation — Command-line API
    url: https://nodejs.org/api/cli.html
    publisher: Node.js
origin:
  type: wordpress-export
  source_id: "281"
  original_url: https://opengateweb.com/posts/9-post-calc/
  original_date: 2025-02-15T06:31:24.000Z
  original_author: Scripterix
review:
  status: approved
  reviewer: human — B6 publication authorization
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-16T00:00:00.000Z
  update_priority: normal
redactoria:
  decision: rewrite
  modernization: major
---
# Jak działają funkcje w JavaScript

Zakres: node v24.16.0. Materiał dla początkujących i osób na poziomie średnim.

<a id="function-call"></a>

## Definicja i wywołanie funkcji

Funkcja ma nazwę, parametry i body. Parametry są nazwami dla danych przekazanych przy wywołaniu. Definicja nie uruchamia funkcji sama z siebie; wynik zobaczysz dopiero po wywołaniu. W tym materiale używamy liczb i Node, aby skupić się na samym modelu funkcji.

### Parametr przekazany do funkcji

```js
function greet(name) {
  console.log(`Cześć, ${name}`);
}

greet('Ada');
```

Oczekiwany wynik:

```text
Cześć, Ada
```

<a id="return-value"></a>

## return oddaje wynik

`return` kończy bieżące wywołanie funkcji i oddaje wartość do miejsca, które funkcję wywołało. To co innego niż `console.log`: log obserwuje wartość, a return pozwala użyć jej dalej. Poniżej funkcja liczy sumę, a osobna linia wypisuje wynik.

### Wynik funkcji użyty poza jej body

```js
function add(left, right) {
  return left + right;
}

const total = add(2, 3);
console.log(total);
```

Oczekiwany wynik:

```text
5
```

<a id="map-callback"></a>

## Callback przekazany do map

Callback to funkcja przekazana innemu wywołaniu, które zdecyduje, kiedy ją uruchomić. `map` wywołuje przekazaną funkcję dla każdego elementu i tworzy nową tablicę wyników. Ten przykład jest synchroniczny i nie dotyczy zdarzeń DOM ani Promise.

### Funkcja strzałkowa jako callback map

```js
const values = [1, 2, 3];
const doubled = values.map(value => value * 2);
console.log(doubled.join(','));
console.log(values.join(','));
```

Oczekiwany wynik:

```text
2,4,6
1,2,3
```

---

- Zakres wykonania to Node v24.16.0 i synchroniczny Array.map. Materiał nie omawia DOM, addEventListener, this, klas, wyjątków, Promise ani callbacków asynchronicznych.
