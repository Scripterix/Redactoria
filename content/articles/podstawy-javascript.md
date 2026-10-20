---
title: "Podstawy JavaScript dla początkujących"
description: "Pierwszy program JavaScript w Node: console.log, wartości, const, let, typeof, operatory i template literal."
slug: podstawy-javascript
featuredImage: ../../src/assets/podstawy-javascript.webp
featuredAlt: Chłopak widziany od tyłu naciska duży przycisk uruchamiający pierwszy program JavaScript na ekranie.
status: published
created: 2026-10-16T00:00:00.000Z
updated: 2026-10-19T00:00:00.000Z
domain: programming
topic: javascript
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: ECMAScript Language Specification — Lexical Declarations
    url: https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html
    publisher: TC39
  - title: MDN — const
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
    publisher: MDN Web Docs
  - title: MDN — typeof
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
    publisher: MDN Web Docs
  - title: Node.js Documentation — Command-line API
    url: https://nodejs.org/api/cli.html
    publisher: Node.js
origin:
  type: wordpress-export
  source_id: "542"
  original_url: https://opengateweb.com/posts/17-post-js/
  original_date: 2025-03-01T06:07:00.000Z
  original_author: Scripterix
review:
  status: approved
  reviewer: human — B6 publication authorization
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-16T00:00:00.000Z
  update_priority: normal
---
# Podstawy JavaScript dla początkujących

Zakres: node v24.16.0. Materiał dla początkujących i osób na poziomie średnim.

<a id="first-node-file"></a>

## Jeden plik JavaScript i wynik

Zapisz program jako `start.js`, a potem uruchom `node start.js`. `console.log` wypisuje wartość do terminala. To osobny, mały program: nie potrzebuje HTML, przeglądarki ani DOM.

### Pierwszy komunikat Node

```js
console.log('Start JavaScript');
```

Oczekiwany wynik:

```text
Start JavaScript
```

<a id="bindings-and-types"></a>

## Wartości, const, let i typeof

`const` i `let` wprowadzają nazwę, pod którą program przechowuje wartość. Użyj `const`, gdy w tym małym programie nie zamierzasz przypisać nowej wartości do nazwy. Użyj `let`, gdy kolejne przypisanie jest elementem przykładu. `typeof` zwraca napis opisujący typ obserwowanej wartości.

### Nazwa, zmiana i obserwacja typu

```js
const name = 'Ada';
let count = 2;
count = count + 1;
console.log(name);
console.log(count);
console.log(typeof count);
```

Oczekiwany wynik:

```text
Ada
3
number
```

<a id="operators-message"></a>

## Operator i template literal

Operator `+` może dodać dwie liczby. Template literal, zapisany między znakami backtick, pozwala wstawić wartość nazwy do czytelnego komunikatu. Najpierw oblicz wynik, a potem wypisz go. Dzięki temu łatwiej odróżnić dane od prezentacji.

### Suma wewnątrz komunikatu

```js
const first = 2;
const second = 3;
const total = first + second;
console.log(`Suma: ${total}`);
```

Oczekiwany wynik:

```text
Suma: 5
```

---

- Zakres wykonania to Node v24.16.0. Materiał nie omawia DOM, tablic, funkcji, modułów, asynchroniczności ani różnic między silnikami JavaScript.
