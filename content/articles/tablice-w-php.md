---
title: Tablice w PHP — od podstaw do sortowania i mapowania
description: "Przewodnik po tablicach w PHP 8.4–8.5: klucze, odczyt i zmiana danych, iterowanie, łączenie, sortowanie oraz mapowanie i filtrowanie. Z przykładami i ćwiczeniami."
slug: tablice-w-php
status: published
created: 2026-10-09T00:00:00.000Z
updated: 2026-10-10T00:00:00.000Z
domain: programming
topic: php
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: PHP Manual — Arrays
    url: https://www.php.net/manual/en/language.types.array.php
    publisher: PHP Documentation
  - title: PHP Manual — array_key_exists
    url: https://www.php.net/manual/en/function.array-key-exists.php
    publisher: PHP Documentation
  - title: PHP Manual — Sorting Arrays
    url: https://www.php.net/manual/en/array.sorting.php
    publisher: PHP Documentation
  - title: PHP Manual — array_map
    url: https://www.php.net/manual/en/function.array-map.php
    publisher: PHP Documentation
  - title: PHP Manual — extract
    url: https://www.php.net/manual/en/function.extract.php
    publisher: PHP Documentation
  - title: PHP 8.5 — Deprecated Features
    url: https://www.php.net/manual/en/migration85.deprecated.php
    publisher: PHP Documentation
origin:
  type: wordpress-export
  source_id: "1324"
  original_url: null
  original_date: null
  original_author: null
review:
  status: approved
  reviewer: human — local publication test
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-09T00:00:00.000Z
  update_priority: normal
redactoria:
  decision: merge
  modernization: major
---
# Tablice w PHP — od podstaw do sortowania i mapowania

Zakres: PHP 8.4–8.5. Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.

<a id="model"></a>

## Tablica to mapa kluczy i wartości

Tablica w PHP jest uporządkowaną mapą: każda wartość ma klucz, a elementy mają kolejność, w której można po nich przejść. Klucz wskazuje jedną wartość. Ponowne przypisanie pod ten sam klucz zastępuje tę wartość, nie dokłada drugiej obok niej. Wartością może być również inna tablica.

„Tablica indeksowana” i „tablica asocjacyjna” opisują sposoby użycia tego samego typu `array`. W pierwszym przypadku zwykle pracujemy z kluczami całkowitymi, w drugim z nazwami, np. `name`. Jedna tablica może łączyć oba rodzaje kluczy i wartości różnych typów.

W tej lekcji przejdziemy od tworzenia i odczytu danych przez operacje zmieniające tablicę do sortowania, mapowania, filtrowania i agregacji. Ważne będą trzy pytania: czy operacja zmienia wejście, co zwraca oraz co robi z kluczami. To pomaga wybrać właściwe narzędzie bez zapamiętywania samych nazw funkcji.

Każdy blok PHP uruchamiaj osobno jako plik, np. `php example.php`. Każdy sam inicjalizuje dane; nie wymaga wykonania poprzedniego bloku.

<a id="creation"></a>

## Tworzenie tablic: lista i nazwane pola

Zapis `[]` jest krótką składnią tworzenia tablicy. Zapis `array(...)` również jest poprawny; w tej lekcji stosujemy spójnie krótszą postać. Pusta tablica to `[]`.

W prostej liście utworzonej bez jawnych kluczy kolejne elementy dostają klucze `0`, `1`, `2`. Nie jest to reguła dla każdej tablicy z kluczami liczbowymi: klucze można nadawać samodzielnie, zaczynać od innej liczby i pozostawiać luki.

W zapisie `klucz => wartość` lewa strona identyfikuje element, prawa jest jego zawartością. Nazwane klucze ułatwiają opis danych osoby czy konfiguracji. Dostęp `$person['name']` oznacza odczyt konkretnego pola, a nie elementu o pozycji nazwanej „name”.

### Lista owoców i dane osoby

```php
<?php
$fruits = ['apple', 'pear', 'plum'];
$person = ['name' => 'Jan', 'age' => 30];
echo $fruits[0], "\n";
echo $person['name'], "\n";
```

Oczekiwany wynik:

```text
apple
Jan
```

<a id="keys"></a>

## Konwersja kluczy i kolizje

Klucze tablic PHP są typu `int` lub `string`. Niektóre wartości użyte jako klucze są konwertowane. String `"0"` oznacza ten sam klucz co liczba `0`. String `"8"` zostaje kluczem całkowitym `8`, ale `"08"` pozostaje stringiem. Wartość `true` staje się kluczem `1`, a `false` kluczem `0`.

Poniżej drugie przypisanie zastępuje wartość pierwszego. Jeśli klucz jest identyfikatorem, zastanów się, czy jego zapis ma znaczenie: `"08"` i `8` nie wskazują tu tego samego elementu.

Nie stosuj ułamków jako praktycznych kluczy. Niejawna konwersja np. `1.5` do `1` z utratą precyzji jest deprecated od PHP 8.1. Również `null` jest konwertowany do klucza pustego stringa `""`, ale w PHP 8.5 użycie `null` jako offsetu tablicy emituje `E_DEPRECATED`. Od tej wersji deprecated jest też `null` jako argument klucza w `array_key_exists()`. Jeżeli naprawdę potrzebujesz pustego klucza, podaj jawnie `""`. **Wartość `null` pod zwykłym kluczem pozostaje dozwolona** — to inna sytuacja.

Dopisywanie przez `[]` zależy od historii kluczy całkowitych, nie od liczby elementów. Po przypisaniu klucza `10` i usunięciu go przez `unset()` kolejne dopisanie otrzyma klucz `11`. Szczególny przypadek: po nadaniu pustej tablicy klucza `-5` dopisanie otrzyma `-4` w docelowych 8.4–8.5. Nie przenoś tutaj starego wyniku `0` z PHP 8.2.

### Ten sam klucz zapisany jako int i string

```php
<?php
$data = [0 => 'first'];
$data['0'] = 'replacement';
$data['08'] = 'padded';
$data[8] = 'integer';
foreach ($data as $key => $value) {
    echo $key, '=', $value, "\n";
}
```

Oczekiwany wynik:

```text
0=replacement
08=padded
8=integer
```

<a id="read-write"></a>

## Odczyt, zapis i dopisywanie

Odczyt korzysta z nawiasów kwadratowych z konkretnym kluczem. Przypisanie pod istniejący klucz zmienia jego wartość, a przypisanie pod nowy dodaje element. Zapis bez klucza, `$numbers[] = 60`, dopisuje wartość pod automatycznie dobranym kluczem całkowitym.

Klucz `10` nie oznacza dziesiątego elementu. Poniższa tablica ma tylko cztery elementy, choć jednym z kluczy jest `10`. Funkcja `count()` zwraca liczbę elementów, a nie największy klucz ani następny wolny indeks. Nie wyznaczaj następnego klucza za pomocą `count($numbers)`; do zwykłego dopisywania użyj `[]`.

Takie rozróżnienie przyda się po usuwaniu i filtrowaniu, kiedy numeracja może mieć luki. Klucz jest identyfikatorem elementu; pozycja jest jego miejscem w aktualnej kolejności.

### Zmiana wartości i jawny klucz

```php
<?php
$numbers = [10, 20];
$numbers[1] = 25;
$numbers[] = 30;
$numbers[10] = 100;
echo $numbers[1], "\n";
echo count($numbers), "\n";
foreach ($numbers as $key => $value) {
    echo $key, '=', $value, "\n";
}
```

Oczekiwany wynik:

```text
25
4
0=10
1=25
2=30
10=100
```

<a id="presence"></a>

## Brak klucza, null i wartość domyślna

Bezpośredni odczyt brakującego klucza w PHP 8 zgłasza `E_WARNING` i daje `null`. Stare określenie „Notice: Undefined index” nie opisuje docelowego zakresu. Zwykle najpierw określ, czego chcesz się dowiedzieć:

- `array_key_exists('name', $data)`: czy klucz istnieje, nawet gdy jego wartością jest `null`;
- `isset($data['name'])`: czy element istnieje i ma wartość różną od `null`;
- `$data['name'] ?? 'fallback'`: wartość, jeśli jest ustawiona i nie jest `null`; w przeciwnym razie fallback, bez ostrzeżenia o braku klucza.

Te narzędzia nie są zamienne. Jeżeli `null` ma znaczyć „pole jest obecne, ale nie ma wartości”, test samego `isset()` nie odróżni go od braku pola.

| Stan elementu | isset | array_key_exists | Wynik ?? 'fallback' | empty |
| --- | --- | --- | --- | --- |
| brak klucza | false | false | 'fallback' | true |
| null | false | true | 'fallback' | true |
| 0 | true | true | 0 | true |
| "0" | true | true | "0" | true |
| false | true | true | false | true |
| "" | true | true | "" | true |

`empty()` sprawdza brak lub wartość falsey, nie samo istnienie klucza. Może więc odrzucić string `"0"`, który w twoim formularzu jest prawidłową wartością. Operator `??` zachowuje `0`, `false` i pusty string — nie zastępuje ich fallbackiem.

Szukanie wartości jest jeszcze innym pytaniem. Jeśli używasz `in_array()` do danych mieszanych, parametr `true` włącza porównanie także typów; nie myl szukania wartości ze sprawdzaniem klucza.

### Istniejący null a brak pola

```php
<?php
$data = ['name' => null, 'count' => 0];
echo isset($data['name']) ? 'true' : 'false', "\n";
echo array_key_exists('name', $data) ? 'true' : 'false', "\n";
echo $data['name'] ?? 'fallback', "\n";
echo $data['missing'] ?? 'fallback', "\n";
echo $data['count'] ?? 99, "\n";
```

Oczekiwany wynik:

```text
false
true
fallback
fallback
0
```

<a id="nested"></a>

## Tablice zagnieżdżone i różne typy danych

Wartość elementu może być kolejną tablicą. Nie powstaje wtedy drugi rodzaj typu: przechodzisz przez następne poziomy tej samej struktury. Najpierw wybierasz użytkownika, potem pole, następnie element listy umiejętności.

Dane można mieszać: osoba może mieć nazwę jako string, wiek jako int, znacznik aktywności jako bool oraz umiejętności jako tablicę. Czytelne klucze pomagają pokazać, co reprezentują wartości. Mała macierz liczb działa analogicznie: `$matrix[1][2]` odczytuje element drugiego wiersza pod kluczem `2`.

W poniższym przykładzie strukturę znamy, więc bezpośredni odczyt jest uzasadniony. Przy danych z zewnątrz samo założenie, że istnieją wszystkie poziomy i mają oczekiwane typy, nie wystarcza.

### Odczyt z listy użytkowników

```php
<?php
$users = [
    ['name' => 'Jan', 'skills' => ['PHP', 'JavaScript']],
    ['name' => 'Anna', 'skills' => ['Python']],
];
$matrix = [[1, 2, 3], [4, 5, 6]];
echo $users[0]['name'], "\n";
echo $users[1]['skills'][0], "\n";
echo $matrix[1][2], "\n";
```

Oczekiwany wynik:

```text
Jan
Python
6
```

<a id="mutations"></a>

## Dodawanie i usuwanie: obserwuj stan po operacji

Operacje mutujące zmieniają przekazaną tablicę. Ich wynik zwracany nie musi być nową tablicą:

- `[]` dopisuje element;
- `array_push()` dopisuje wartości na końcu;
- `array_unshift()` dodaje na początku i reindeksuje klucze liczbowe od zera, zachowując klucze nazwane;
- `array_pop()` usuwa ostatnią wartość i ją zwraca;
- `array_shift()` usuwa pierwszą wartość i ją zwraca; reindeksuje klucze liczbowe;
- `unset($a[$key])` usuwa wskazany klucz bez automatycznego reindeksowania pozostałych;
- `array_splice()` operuje na pozycji w kolejności tablicy, zwraca usunięty wycinek i reindeksuje klucze liczbowe.

`array_push()` oraz `array_unshift()` zwracają liczbę elementów po operacji, nie tablicę. Dla pustej tablicy `array_pop()` i `array_shift()` zwracają `null`.

W drugim przykładzie po `shift()` mamy `[2, 3, 4]`. Usunięcie klucza `1` zostawia pary `0 => 2`, `2 => 4`. Następnie `splice(..., 1, 2)` zaczyna od drugiej pozycji, nie od klucza `1`: usuwa dostępny element `4`. Pokazanie pośrednich stanów jest ważniejsze niż długa lista nazw funkcji.

W wyniku drugiego przykładu pierwsze dwie linie to wartości zwrócone przez `array_pop()` i `array_shift()`. Cztery bloki `Array` pokazują kolejno: stan po `array_shift()`, stan po `unset()`, usunięty wycinek w `$removed` i końcowy stan `$numbers`.

### Dodawanie na koniec i początek

```php
<?php
$fruits = ['apple', 'pear'];
$fruits[] = 'plum';
$afterPush = array_push($fruits, 'cherry');
$afterUnshift = array_unshift($fruits, 'peach');
echo $afterPush, '/', $afterUnshift, "\n";
foreach ($fruits as $key => $value) {
    echo $key, '=', $value, "\n";
}
```

Oczekiwany wynik:

```text
4/5
0=peach
1=apple
2=pear
3=plum
4=cherry
```

### Klucz w unset a pozycja w splice

```php
<?php
$numbers = [1, 2, 3, 4, 5];
echo array_pop($numbers), "\n";
echo array_shift($numbers), "\n";
print_r($numbers);
unset($numbers[1]);
print_r($numbers);
$removed = array_splice($numbers, 1, 2);
print_r($removed);
print_r($numbers);
```

Oczekiwany wynik:

```text
5
1
Array
(
    [0] => 2
    [1] => 3
    [2] => 4
)
Array
(
    [0] => 2
    [2] => 4
)
Array
(
    [0] => 4
)
Array
(
    [0] => 2
)
```

<a id="iteration"></a>

## foreach: wartości albo pary klucz–wartość

Pętla `foreach ($data as $value)` udostępnia kolejne wartości. Wariant `foreach ($data as $key => $value)` udostępnia również rzeczywisty klucz każdego elementu w kolejności iteracji. Nie potrzebujesz ciągłych indeksów.

Zwykła pętla jest dobrym pierwszym wyborem, gdy chcesz wypisać dane lub wykonać kilka różnych operacji dla każdego elementu. Gdy potrzebujesz tablicy przekształconych wartości, później pokażemy `array_map()`; gdy wybierasz część elementów — `array_filter()`.

Uwaga na wariant z referencją `&$value`: może zmieniać wartości wejścia, a po zakończeniu pętli zmienna nadal może odnosić się do ostatniego elementu. Trzeba świadomie przerwać tę referencję przez `unset($value)`. W przykładach podstawowych pozostajemy przy pętli po wartości.

### Iteracja bez ciągłej numeracji

```php
<?php
$data = ['x' => 1, 4 => 2];
foreach ($data as $key => $value) {
    echo $key, ': ', $value, "\n";
}
foreach ($data as $value) {
    echo $value, "\n";
}
```

Oczekiwany wynik:

```text
x: 1
4: 2
1
2
```

<a id="merge"></a>

## Łączenie: merge, suma tablic i replace

Wybór funkcji zależy od tego, czy potrzebujesz zebrać wszystkie wartości, zachować lewy element przy kolizji czy zastąpić go prawym. Wszystkie poniższe operacje tworzą wynik bez zmiany tablicy `$left`.

| Operacja | Kolidujący klucz tekstowy | Kolidujący klucz całkowity | Klucze całkowite w wyniku |
| --- | --- | --- | --- |
| array_merge | prawa wartość wygrywa | obie wartości dopisywane | reindeksowane od 0 |
| + | lewa wartość zostaje | lewa wartość zostaje | zachowane |
| array_replace | prawa wartość wygrywa | prawa wartość wygrywa | zachowane |

Operator `+` jest sumą tablic, nie dopisaniem wszystkich ich wartości. Dla kluczy już obecnych po lewej pomija prawy element. `array_replace()` zastępuje wartości pod kolidującymi kluczami i nie jest operacją rekurencyjną: zagnieżdżonego łączenia nie omawiamy tutaj.

W `array_merge()` nie przenoś na klucze liczbowe reguły „prawa wartość nadpisuje lewą”. Odróżnienie liczb od nazw jest najważniejszą częścią tego kontrastu.

### Trzy operacje na tej samej parze danych

```php
<?php
$left = [2 => 'left-number', 'x' => 'left'];
$right = [2 => 'right-number', 'x' => 'right', 7 => 'seven'];
print_r(array_merge($left, $right));
print_r($left + $right);
print_r(array_replace($left, $right));
```

Oczekiwany wynik:

```text
Array
(
    [0] => left-number
    [x] => right
    [1] => right-number
    [2] => seven
)
Array
(
    [2] => left-number
    [x] => left
    [7] => seven
)
Array
(
    [2] => right-number
    [x] => right
    [7] => seven
)
```

<a id="sorting"></a>

## Sortowanie: po czym, w którą stronę i z jakimi kluczami

Sześć podstawowych funkcji sortowania zmienia wejściową tablicę. Zwracają `true`, a nie posortowaną tablicę. Po wywołaniu odczytaj zmienioną zmienną; przypisanie `$sorted = sort($data)` nie zapisze w `$sorted` tablicy.

| Funkcja | Porządek | Kierunek | Powiązanie klucz–wartość | Mutuje | Zwraca |
| --- | --- | --- | --- | --- | --- |
| sort | wartości | rosnąco | nie; nowe klucze 0..n-1 | tak | true |
| rsort | wartości | malejąco | nie; nowe klucze 0..n-1 | tak | true |
| asort | wartości | rosnąco | zachowane | tak | true |
| arsort | wartości | malejąco | zachowane | tak | true |
| ksort | klucze | rosnąco | zachowane | tak | true |
| krsort | klucze | malejąco | zachowane | tak | true |

Jeżeli nazwa identyfikuje obiekt, np. produkt, `asort()` może być właściwsze niż `sort()`, bo zachowuje to powiązanie. W przykładzie kopiujemy dane przed każdą operacją, aby wynik jednego sortowania nie stał się ukrytym wejściem następnego.

Używamy jednorodnych liczb. Ten przykład nie jest gwarancją polskiego porządku alfabetycznego ani instrukcją porównywania mieszanych typów. Takie przypadki wymagają świadomego doboru zasad porównania; nie rozszerzamy tu zakresu lekcji.

### sort zmienia klucze, asort je zachowuje

```php
<?php
$scores = ['a' => 3, 'b' => 2, 'c' => 1];
$values = $scores;
sort($values);
print_r($values);
$associated = $scores;
asort($associated);
foreach ($associated as $key => $value) {
    echo $key, '=', $value, "\n";
}
```

Oczekiwany wynik:

```text
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
)
c=1
b=2
a=3
```

<a id="map"></a>

## array_map: przekształć każdą wartość

Gdy dla każdego elementu chcesz obliczyć nową wartość, użyj `array_map()`. Callback, czyli przekazana funkcja, dostaje wartość wejściową i zwraca jej przekształcenie. W tym przykładzie mnoży liczbę przez dwa. Zapis `fn($number) => $number * 2` czytaj jako: „weź `$number` i zwróć `$number * 2`”.

Funkcja zwraca tablicę wyników, nie zmienia `$numbers`. Przy dokładnie jednej tablicy wejściowej zachowuje klucze — także tekstowe. Przy wielu tablicach wejściowych wynik otrzymuje kolejne klucze całkowite. To nie jest ta sama reguła w obu wariantach.

Mapowanie nie służy do usuwania elementów na podstawie warunku. Zwrócenie `false` z callbacku da wartość `false` w wynikowej tablicy; do wyboru podzbioru służy filtr.

### Podwojenie liczb

```php
<?php
$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(fn($number) => $number * 2, $numbers);
print_r($doubled);
echo $numbers[0], "\n";
```

Oczekiwany wynik:

```text
Array
(
    [0] => 2
    [1] => 4
    [2] => 6
    [3] => 8
    [4] => 10
)
1
```

<a id="filter"></a>

## array_filter: wybierz część danych

Callback filtra odpowiada na pytanie, czy element ma zostać. Poniżej zostają liczby parzyste, ponieważ reszta z dzielenia przez dwa jest równa zeru. Funkcja zwraca nową tablicę wybranych elementów i zachowuje ich klucze.

Dlatego wynik zawiera klucze `1` i `3`, a nie `0` i `1`. To prawidłowe zachowanie, nie błąd eksportu lub drukowania. Jeżeli potrzebujesz potem listy o ciągłej numeracji, można użyć `array_values()`; nie zakładaj jednak, że filtr wykona to automatycznie.

Bez callbacku `array_filter()` usuwa wartości uznawane za puste/falsey, w tym `0` i `"0"`. Jeżeli takie dane są wartościowe, przekaż własny warunek. Filtrowanie „pustych” i sprawdzanie obecności klucza rozwiązują różne problemy.

### Parzyste liczby z zachowaniem kluczy

```php
<?php
$numbers = [1, 2, 3, 4, 5];
$even = array_filter($numbers, fn($number) => $number % 2 === 0);
print_r($even);
```

Oczekiwany wynik:

```text
Array
(
    [1] => 2
    [3] => 4
)
```

<a id="aggregation"></a>

## Redukcja i zliczanie to różne operacje

W `array_reduce()` callback otrzymuje akumulator i bieżący element. Zwrócona wartość staje się akumulatorem następnego kroku. Przy sumowaniu startujemy od `0`, następnie dodajemy każdą liczbę. W tym przykładzie wynikiem jest liczba 15, a nie tablica liczb.

Wartość początkowa ma znaczenie także dla pustej tablicy: z początkowym `0` redukcja zwróci `0`; bez podanego initial zwróci `null`. Dobierz ją do operacji, którą wykonujesz.

`array_count_values()` rozwiązuje inne zadanie: zlicza wystąpienia wartości i zwraca mapę `wartość => liczność`. Przyjmuje do zliczania wartości `int` i `string`. Elementy innych typów powodują `E_WARNING` i nie są zliczane. Nie używaj tej funkcji jako ogólnego licznika dowolnych obiektów, tablic czy booli.

Suma `15` poniżej jest wynikiem redukcji. Częstości owoców `2/2/1` są wynikiem zliczania; każdy przykład ma własne dane i cel.

### Sumowanie z początkowym akumulatorem

```php
<?php
$numbers = [1, 2, 3, 4, 5];
$total = array_reduce($numbers, fn($carry, $number) => $carry + $number, 0);
echo $total, "\n";
echo array_reduce([], fn($carry, $number) => $carry + $number, 0), "\n";
```

Oczekiwany wynik:

```text
15
0
```

### Liczenie powtarzających się owoców

```php
<?php
$products = ['apple', 'pear', 'apple', 'cherry', 'pear'];
print_r(array_count_values($products));
```

Oczekiwany wynik:

```text
Array
(
    [apple] => 2
    [pear] => 2
    [cherry] => 1
)
```

<a id="practice"></a>

## Praktyka: konfiguracja, menu i dane podobne do formularza

Zagnieżdżona konfiguracja przechowuje grupy opcji pod nazwami. Dane menu można reprezentować jako listę elementów, a ich podmenu jako kolejną listę. Nie trzeba od razu budować rekurencyjnego generatora HTML, aby przećwiczyć odczyt.

Opcjonalny klucz `active` odczytujemy przez `?? false`. Odróżnia to brak tego pola od bezwarunkowego założenia, że każdy element je ma. Poniższe dane są lokalnymi stałymi; przykład wypisuje tekst do CLI, nie renderuje HTML.

Przy formularzu jest dodatkowa granica: `$_POST['email'] ?? ''` zapewnia fallback, ale nie gwarantuje stringa. Wejście formularza może mieć kształt tablicy. Zanim walidujesz email przez `filter_var(..., FILTER_VALIDATE_EMAIL)`, sprawdź typ przez `is_string()`.

Drugi przykład używa lokalnego wejścia o kształcie pola formularza, nie obsługuje HTTP i niczego nie wysyła. Walidacja email to nie autoryzacja ani uniwersalne „oczyszczanie”. Przy wyświetlaniu dynamicznego tekstu w HTML stosuje się osobny escaping, np. `htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`; nie jest on ochroną dowolnego URL, SQL lub JavaScript. Pełny handler formularza pozostaje poza tą lekcją.

### Zagnieżdżona opcja i opcjonalny stan menu

```php
<?php
$config = ['cache' => ['enabled' => true, 'ttl' => 3600]];
$menu = [
    ['title' => 'Start', 'active' => true],
    ['title' => 'Docs'],
];
echo $config['cache']['ttl'], "\n";
foreach ($menu as $item) {
    $active = $item['active'] ?? false;
    echo $item['title'], ': ', $active ? 'active' : 'inactive', "\n";
}
```

Oczekiwany wynik:

```text
3600
Start: active
Docs: inactive
```

### Najpierw sprawdź typ, potem waliduj

```php
<?php
$input = ['email' => ['unexpected']];
$email = $input['email'] ?? '';
if (!is_string($email)) {
    echo "Odrzucono nieoczekiwany typ\n";
} elseif (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    echo "Nieprawidlowy email\n";
} else {
    echo "Email przeszedl walidacje\n";
}
```

Oczekiwany wynik:

```text
Odrzucono nieoczekiwany typ
```

<a id="mistakes"></a>

## Typowe błędy i ostrożność przy extract

Przy pracy z tablicami najczęściej gubimy kontrakt operacji, a nie jej składnię:

- nie traktuj klucza jako pozycji ani `count()` jako następnego indeksu;
- nie myl brakującego pola z polem o wartości `null`;
- nie sprawdzaj istnienia klucza przez `empty()`, jeśli `0` lub `"0"` mają znaczenie;
- nie przypisuj wyniku `sort()` jako rzekomej posortowanej tablicy;
- po `array_filter()` nie zakładaj ciągłych kluczy;
- po `array_merge()` nie zakładaj zachowania numerycznych identyfikatorów;
- nie przenoś stanu zmiennych między przykładami, które mają działać samodzielnie.

`extract()` tworzy zmienne na podstawie kluczy tablicy w bieżącym zakresie. Domyślny tryb `EXTR_OVERWRITE` może nadpisać zmienne już obecne. Poniższa demonstracja używa wyłącznie zaufanych stałych danych i pokazuje ryzyko, **nie wzorzec zalecanej architektury**. Zwykły dostęp przez `$data['name']` wyraźniej pokazuje pochodzenie wartości.

Nie stosuj `extract()` do nieufnych danych, w szczególności pól formularza. Filtrowanie wartości nie usuwa problemu importowania dowolnych nazw zmiennych ani potrzeby osobnego zabezpieczenia wyjścia.

### Demonstracja nadpisania, nie wzorzec dla formularza

```php
<?php
$name = 'original';
$trusted = ['name' => 'overwritten'];
$count = extract($trusted);
echo $name, "\n";
echo $count, "\n";
```

Oczekiwany wynik:

```text
overwritten
1
```

<a id="exercises"></a>

## Ćwiczenia i dalsza nauka

1. Utwórz listę trzech owoców. Usuń środkowy klucz przez `unset()` i wypisz pary przez `foreach`. Wyjaśnij, dlaczego pozostałe klucze nie tworzą teraz ciągłej numeracji.
2. Przygotuj tablicę z nazwanym kluczem o wartości `null` oraz drugą bez tego klucza. Porównaj `isset()`, `array_key_exists()` i `??`. Który test odróżnia te dwa przypadki?
3. Powtórz porównanie `array_merge()`, `+` i `array_replace()` na danych z kluczem liczbowym oraz tekstowym. Zanim uruchomisz kod, zapisz przewidywane klucze i wartości.
4. Posortuj tę samą kopię nazwanych ocen przez `sort()` i `asort()`. W którym wyniku pozostaje informacja, do kogo należała ocena?
5. Z listy liczb wybierz parzyste, podwój je i oblicz sumę z początkowym `0`. Osobno zlicz owoce. Opisz, dlaczego redukcja i zliczanie zwracają różne rodzaje wyniku.
6. Rozszerz przykład typu pola email o zwykły string oraz nieprawidłowy adres. Sprawdź wszystkie trzy ścieżki, bez dodawania obsługi serwera.

Rozwiązania ćwiczeń nie zostały wykonane jako część przykładów tej lekcji — są zadaniem do samodzielnego sprawdzenia. Jako dalszą naukę wybierz świadome kontrakty danych: oczekiwane klucze, typy wartości, reguły ich walidacji i znaczenie kolejności.

Dokumentacyjne źródła użytych reguł: [model tablic](https://www.php.net/manual/en/language.types.array.php), [sprawdzanie obecności](https://www.php.net/manual/en/function.array-key-exists.php), [sortowanie](https://www.php.net/manual/en/array.sorting.php), [funkcje tablicowe](https://www.php.net/manual/en/function.array-map.php), [ostrożność przy extract](https://www.php.net/manual/en/function.extract.php) oraz [deprecacje PHP 8.5](https://www.php.net/manual/en/migration85.deprecated.php).

---

- Zakres dotyczy PHP 8.4–8.5; wcześniejsze wersje wspomniano tylko przy różnicach uzasadnionych zatwierdzonym researchem.
- Przykłady lokalnych danych nie są pełnym handlerem formularza ani audytem bezpieczeństwa aplikacji; zaawansowane sortowanie mieszanych typów i locale pozostaje poza zakresem.
