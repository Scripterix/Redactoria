---
title: "Kalkulator w JavaScript: walidacja, funkcja i klasa"
description: Prosty kalkulator w JavaScript z jawną walidacją liczb, obsługą operatorów oraz porównaniem funkcji i metody klasy.
slug: kalkulator-w-javascript
status: published
created: 2026-10-12T00:00:00.000Z
updated: 2026-10-12T00:00:00.000Z
domain: programming
topic: javascript
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: ECMAScript Language Specification — Numbers and Dates
    url: https://tc39.es/ecma262/multipage/numbers-and-dates.html
    publisher: TC39
  - title: ECMAScript Language Specification — Functions and Classes
    url: https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html
    publisher: TC39
  - title: MDN — Number.isFinite()
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
    publisher: MDN Web Docs
origin:
  type: wordpress-export
  source_id: "281"
  original_url: https://opengateweb.com/posts/9-post-calc/
  original_date: 2025-02-15T00:00:00.000Z
  original_author: Scripterix
review:
  status: approved
  reviewer: human — B4 publication authorization
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-12T00:00:00.000Z
  update_priority: normal
redactoria:
  decision: rewrite
  modernization: major
---
# Kalkulator w JavaScript: walidacja, funkcja i klasa

Zakres: node v24.16.0. Materiał dla początkujących i osób na poziomie średnim.

<a id="calculator-contract"></a>

## Najpierw kontrakt kalkulatora

Prosty kalkulator potrzebuje jawnej listy operatorów oraz przewidywalnego wyniku błędu. Zamiast wykonywać dowolny tekst, funkcja poniżej dopuszcza tylko dodawanie i odejmowanie. Zwraca obiekt z polem `ok`, dzięki czemu kod wywołujący nie musi zgadywać, czy liczba jest wynikiem, czy wartością zastępczą.

Taki rdzeń nie zna DOM-u i nie czyta pól formularza. Dzięki temu można go wykonać bez przeglądarki, a warstwę interfejsu dołączyć osobno.

### Dwa obsługiwane operatory i jawny błąd

```js
function calculate(a, operator, b) {
  if (!['+', '-'].includes(operator)) {
    return { ok: false, error: 'unsupported-operator' };
  }
  return { ok: true, value: operator === '+' ? a + b : a - b };
}
console.log(JSON.stringify(calculate(7, '-', 2)));
console.log(JSON.stringify(calculate(1, '*', 2)));
```

Oczekiwany wynik:

```text
{"ok":true,"value":5}
{"ok":false,"error":"unsupported-operator"}
```

<a id="number-input"></a>

## Od tekstu do skończonej liczby

Wartość z formularza jest tekstem. Najpierw odrzuć `null`, `undefined` i tekst pusty po `trim()`. Następnie użyj `Number`, aby przetworzyć całą wartość, oraz `Number.isFinite`, aby odrzucić `NaN` i nieskończoność. Napis `12px` nie jest poprawną liczbą dla tego kontraktu.

Zapis `parseFloat(value) || 0` jest kusząco krótki, ale maskuje błąd jako zero. Zero może być prawidłowym operandem, więc brak danych i błędne dane powinny dostać osobne rezultaty.

### Walidacja wartości pustej, niepełnej i nieskończonej

```js
function parseDecimal(raw) {
  if (raw == null || String(raw).trim() === '') {
    return { ok: false, error: 'empty' };
  }
  const value = Number(raw);
  return Number.isFinite(value)
    ? { ok: true, value }
    : { ok: false, error: 'invalid-number' };
}
console.log(JSON.stringify(['12.5', ' ', '12px', 'Infinity'].map(parseDecimal)));
```

Oczekiwany wynik:

```text
[{"ok":true,"value":12.5},{"ok":false,"error":"empty"},{"ok":false,"error":"invalid-number"},{"ok":false,"error":"invalid-number"}]
```

<a id="function-or-class"></a>

## Funkcja albo metoda klasy

Zwykła funkcja wystarcza, gdy operacja nie przechowuje stanu. Klasa może zapewnić wygodne API, gdy kalkulator ma konfigurację lub kilka powiązanych metod. Sama obecność klasy nie zmienia reguł dodawania ani odejmowania.

Najprostsza metoda może delegować do przetestowanej funkcji. Nie nazywaj jednak każdej funkcji „programowaniem funkcyjnym”: w tym przykładzie chodzi o organizację kodu i jeden wspólny kontrakt.

### Metoda klasy delegująca do zwykłej funkcji

```js
function calculate(a, operator, b) {
  if (operator === '+') return a + b;
  if (operator === '-') return a - b;
  throw new Error('unsupported-operator');
}
class Calculator {
  calculate(a, operator, b) {
    return calculate(a, operator, b);
  }
}
console.log(calculate(7, '-', 2));
console.log(new Calculator().calculate(7, '-', 2));
```

Oczekiwany wynik:

```text
5
5
```
