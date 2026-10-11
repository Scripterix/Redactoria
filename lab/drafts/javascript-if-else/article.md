# Warunki w JavaScript: if, else i bezpieczna walidacja liczby

Zakres: node v24.16.0. Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.

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

---

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Materiał obejmuje wyłącznie autoryzowany zakres B3 i wskazany runtime; metadane interakcji nie są zaimplementowanym UI.
