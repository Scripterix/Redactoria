# Kalkulator w JavaScript: walidacja, funkcja i klasa

Zakres: node v24.16.0. Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.

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

---

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Materiał obejmuje wyłącznie autoryzowany zakres B4, wskazane źródła i runtime Node; metadane interakcji nie są zaimplementowanym UI.
