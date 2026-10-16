# Funkcje JavaScript: parametry, return i callbacki

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

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Zakres wykonania to Node v24.16.0 i synchroniczny Array.map. Materiał nie omawia DOM, addEventListener, this, klas, wyjątków, Promise ani callbacków asynchronicznych.
