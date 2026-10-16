# JavaScript od pierwszego uruchomienia: wartości, zmienne, typy i operatory

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

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Zakres wykonania to Node v24.16.0. Materiał nie omawia DOM, tablic, funkcji, modułów, asynchroniczności ani różnic między silnikami JavaScript.
