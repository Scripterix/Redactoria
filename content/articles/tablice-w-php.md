---
title: Tablice w PHP — od podstaw do sortowania i mapowania
description: "Przewodnik po tablicach w PHP 8.4–8.5: klucze, odczyt i zmiana danych, iterowanie, łączenie, sortowanie oraz mapowanie i filtrowanie. Z przykładami i ćwiczeniami."
slug: tablice-w-php
featuredImage: ../../src/assets/tablice-php.webp
featuredAlt: Osoba porządkuje elementy w szufladach symbolizujących tablice PHP.
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

Zakres: PHP 8.4–8.5. Materiał dla początkujących i osób na poziomie średnim.

<a id="model"></a>

## Tablica to mapa kluczy i wartości

Tablica w PHP przechowuje elementy jako pary:

```text
KLUCZ → WARTOŚĆ
```

Klucz identyfikuje element, a wartość jest daną zapisaną pod tym kluczem. Elementy mają też kolejność, w której można po nich przejść. Ponowne przypisanie pod ten sam klucz zmienia istniejącą wartość, zamiast dodawać drugą obok niej.

Tablice są elastyczne: można odczytywać i zmieniać ich elementy, dopisywać i usuwać dane, przechodzić po nich oraz tworzyć na ich podstawie nowe wyniki. Zaczniemy jednak od jednego prostego modelu `klucz → wartość`, a kolejne możliwości będziemy dodawać krok po kroku.

### Jak uruchamiać przykłady

Kod PHP zapisujemy w pliku z rozszerzeniem `.php`, na przykład `example.php`. Na komputerze musi być zainstalowany interpreter PHP, a polecenie `php` musi być dostępne w terminalu. Terminal to program, w którym wpisuje się polecenia tekstowe.

Otwórz terminal w katalogu zawierającym plik i uruchom:

```text
php example.php
```

`php` uruchamia interpreter PHP, czyli program wykonujący kod. `example.php` jest nazwą pliku, który ma zostać wykonany. Każdy przykład w artykule jest samodzielny: zapisz wybrany blok do osobnego pliku i nie uruchamiaj wcześniejszych przykładów.

Jeżeli nie masz jeszcze lokalnego PHP, możesz przepisać przykład do zaufanego środowiska PHP online. Podstawowym sposobem w tej lekcji pozostaje jednak lokalny plik `.php`.

### Kod nie zawsze coś wyświetla

Przypisanie `$numbers = [10, 20];` tworzy tablicę w pamięci, ale samo niczego nie wypisuje. Podobnie `$numbers[1] = 25;` zmienia dane, lecz efekt zobaczysz dopiero wtedy, gdy jawnie go wyświetlisz.

W przykładach używamy dwóch podstawowych narzędzi:

- `echo` wypisuje tekst albo prostą wartość;
- `print_r()` pokazuje czytelną strukturę tablicy, razem z kluczami i wartościami.

Etykiety takie jak `Na początku:` i `Po zmianie:` są częścią programu. Dzięki nim wynik pokazuje nie tylko dane, lecz także etap, którego dotyczą.

<a id="creation"></a>

## Tworzenie tablic: lista i nazwane pola

Zapis `[]` jest krótką składnią tworzenia tablicy. Pusta tablica to `[]`. Starszy zapis `array(...)` również jest poprawny, ale w tej lekcji konsekwentnie używamy krótszej postaci.

### Lista: automatyczne klucze całkowite

Jeżeli nie podasz kluczy, PHP utworzy je automatycznie. Pierwszym kluczem jest `0`:

```text
0 → apple
1 → pear
2 → plum
```

```php
<?php
$fruits = ['apple', 'pear', 'plum'];

echo "Lista owoców:\n";
print_r($fruits);
```

Oczekiwany wynik:

```text
Lista owoców:
Array
(
    [0] => apple
    [1] => pear
    [2] => plum
)
```

`apple`, `pear` i `plum` są wartościami. Liczby `0`, `1` i `2` są ich kluczami. Odczyt `$fruits[0]` oznacza: „pobierz wartość zapisaną pod kluczem `0`”.

**Kiedy może się przydać?** Lista jest wygodna, gdy kolejność danych ma znaczenie, na przykład dla produktów, kroków instrukcji albo wyników.

### Nazwane klucze

W zapisie `klucz => wartość` lewa strona jest kluczem, a prawa wartością:

```text
name → Jan
age  → 30
```

```php
<?php
$person = [
    'name' => 'Jan',
    'age' => 30,
];

echo "Dane osoby:\n";
print_r($person);
echo "Imię: ", $person['name'], "\n";
```

Oczekiwany wynik:

```text
Dane osoby:
Array
(
    [name] => Jan
    [age] => 30
)
Imię: Jan
```

Klucz `name` identyfikuje pole, a `Jan` jest przechowywaną wartością. Nazwane klucze opisują dane czytelniej niż pozycje liczbowe.

**Kiedy może się przydać?** Nazwane klucze dobrze pasują do danych użytkownika i konfiguracji.

<a id="read-write"></a>

## Odczyt, zapis i dopisywanie

Pierwszy dłuższy przykład pokazuje konwencję używaną dalej: stan początkowy, jedna operacja, stan po operacji i podpisany wynik.

### Stan tablicy krok po kroku

```php
<?php
$numbers = [10, 20];

echo "Na początku:\n";
print_r($numbers);

$numbers[1] = 25;

echo "Po zmianie drugiego elementu:\n";
print_r($numbers);

$numbers[] = 30;

echo "Po dodaniu nowego elementu:\n";
print_r($numbers);

$numbers[10] = 100;

echo "Po dodaniu wartości pod kluczem 10:\n";
print_r($numbers);

echo "Liczba elementów: ", count($numbers), "\n";
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => 10
    [1] => 20
)
Po zmianie drugiego elementu:
Array
(
    [0] => 10
    [1] => 25
)
Po dodaniu nowego elementu:
Array
(
    [0] => 10
    [1] => 25
    [2] => 30
)
Po dodaniu wartości pod kluczem 10:
Array
(
    [0] => 10
    [1] => 25
    [2] => 30
    [10] => 100
)
Liczba elementów: 4
```

Na początku `$numbers = [10, 20];` tworzy dwie pary:

```text
0 → 10
1 → 20
```

`10` i `20` są wartościami. `0` i `1` są automatycznie utworzonymi kluczami.

Następnie `$numbers[1] = 25;` znaczy: „zmień wartość pod kluczem `1`”.

```text
przed: 1 → 20
po:    1 → 25
```

Zapis `$numbers[] = 30;` dopisuje wartość pod następnym odpowiednim kluczem całkowitym:

```text
przed: 0 → 10, 1 → 25
po:    0 → 10, 1 → 25, 2 → 30
```

Puste `[]` przy przypisaniu nie oznacza „drugiego elementu”. Oznacza: „dobierz następny odpowiedni klucz całkowity i dopisz wartość”.

Na końcu `$numbers[10] = 100;` dodaje element pod jawnie wybranym kluczem `10`:

```text
0  → 10
1  → 25
2  → 30
10 → 100
```

Tablica ma cztery elementy. Klucz `10` nie oznacza dziesięciu elementów. `count($numbers)` liczy elementy, nie największy klucz. Klucz jest identyfikatorem elementu, a nie jego numerem porządkowym.

<a id="types"></a>

## Wartości mogą mieć różne typy

Jedna tablica może przechowywać wartości różnych typów:

### Typy wartości w danych użytkownika

Aby nazwy typów były widoczne, użyjemy pomocniczej funkcji `get_debug_type()`. Zwraca ona nazwę rzeczywistego typu podanej wartości.

```php
<?php
$user = [
    'name' => 'Jan',
    'age' => 30,
    'height' => 1.82,
    'active' => true,
    'skills' => ['PHP', 'Git'],
    'secondName' => null,
];

echo "Dane użytkownika:\n";
echo "name       → ", get_debug_type($user['name']), "\n";
echo "age        → ", get_debug_type($user['age']), "\n";
echo "height     → ", get_debug_type($user['height']), "\n";
echo "active     → ", get_debug_type($user['active']), "\n";
echo "skills     → ", get_debug_type($user['skills']), "\n";
echo "secondName → ", get_debug_type($user['secondName']), "\n";
```

Oczekiwany wynik:

```text
Dane użytkownika:
name       → string
age        → int
height     → float
active     → bool
skills     → array
secondName → null
```

Znaczenie pól jest następujące:

| Klucz | Typ wartości | Praktyczne znaczenie |
| --- | --- | --- |
| `name` | `string` | tekst |
| `age` | `int` | liczba całkowita |
| `height` | `float` | liczba dziesiętna |
| `active` | `bool` | odpowiedź tak/nie: `true` albo `false` |
| `skills` | `array` | kolejna grupa danych |
| `secondName` | `null` | świadomy brak wartości |

Używamy `get_debug_type()` tylko po to, aby typów nie trzeba było zgadywać.

<a id="nested"></a>

## Tablica zagnieżdżona

Wartością elementu może być kolejna tablica. Taką strukturę nazywamy tablicą zagnieżdżoną:

```text
user
├── name → Jan
└── skills
    ├── 0 → PHP
    └── 1 → Git
```

### Odczyt z dwóch poziomów

```php
<?php
$user = [
    'name' => 'Jan',
    'skills' => ['PHP', 'Git'],
];

echo "Pierwsza umiejętność: ", $user['skills'][0], "\n";
```

Oczekiwany wynik:

```text
Pierwsza umiejętność: PHP
```

Odczyt `$user['skills'][0]` wykonujemy etapami:

1. wybierz klucz `skills` w tablicy `$user`;
2. otrzymasz tablicę `['PHP', 'Git']`;
3. z tej tablicy wybierz klucz `0`;
4. wynikiem będzie wartość `PHP`.

**Kiedy może się przydać?** Tablice zagnieżdżone reprezentują na przykład listę użytkowników, menu albo pogrupowaną konfigurację.

<a id="iteration"></a>

## foreach: najpierw wartości, potem klucze

Pętla `foreach` wykonuje ten sam fragment kodu dla kolejnych elementów tablicy.

### Przejście po wartościach

```php
<?php
$fruits = ['apple', 'pear', 'plum'];

echo "Owoce:\n";
foreach ($fruits as $fruit) {
    echo $fruit, "\n";
}
```

Oczekiwany wynik:

```text
Owoce:
apple
pear
plum
```

`foreach ($fruits as $fruit)` czytaj: „dla każdego elementu tablicy `$fruits` pobierz jego wartość i na czas tego obiegu nazwij ją `$fruit`”.

### Przejście po kluczach i wartościach

```php
<?php
$person = [
    'name' => 'Jan',
    'age' => 30,
];

echo "Pola osoby:\n";
foreach ($person as $key => $value) {
    echo $key, ': ', $value, "\n";
}
```

Oczekiwany wynik:

```text
Pola osoby:
name: Jan
age: 30
```

`foreach ($person as $key => $value)` czytaj: „dla każdego elementu pobierz jego klucz i wartość”. Nie potrzebujesz ciągłej numeracji.

**Kiedy może się przydać?** `foreach` służy do wypisywania albo przetwarzania każdego elementu.

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

`empty()` sprawdza brak lub wartość interpretowaną jako fałsz (często nazywaną *falsey*), nie samo istnienie klucza. Może więc odrzucić string `"0"`, który w twoim formularzu jest prawidłową wartością. Operator `??` zachowuje `0`, `false` i pusty string — nie zastępuje ich fallbackiem.

Szukanie wartości jest jeszcze innym pytaniem. Jeśli używasz `in_array()` do danych mieszanych, parametr `true` włącza porównanie także typów; nie myl szukania wartości ze sprawdzaniem klucza.

### Istniejący null a brak pola

W kodzie poniżej zapis `warunek ? 'true' : 'false'` wybiera pierwszy tekst, gdy warunek jest spełniony, a drugi, gdy nie jest. Używamy go tylko do czytelnego wypisania wyniku sprawdzenia.

```php
<?php
$data = ['name' => null, 'count' => 0];

echo "isset dla name: ", isset($data['name']) ? 'true' : 'false', "\n";
echo "Klucz name istnieje: ", array_key_exists('name', $data) ? 'true' : 'false', "\n";
echo "name z fallbackiem: ", $data['name'] ?? 'fallback', "\n";
echo "missing z fallbackiem: ", $data['missing'] ?? 'fallback', "\n";
echo "count z fallbackiem: ", $data['count'] ?? 99, "\n";
```

Oczekiwany wynik:

```text
isset dla name: false
Klucz name istnieje: true
name z fallbackiem: fallback
missing z fallbackiem: fallback
count z fallbackiem: 0
```

<a id="mutations"></a>

## Dodawanie i usuwanie: najpierw proste operacje

Najpierw użyjemy dwóch podstawowych zapisów: `[]` do dopisania wartości i `unset()` do usunięcia elementu. Po każdej operacji wypiszemy stan tablicy.

### Dodanie jednego elementu

```php
<?php
$fruits = ['apple', 'pear'];

echo "Na początku:\n";
print_r($fruits);

$fruits[] = 'plum';

echo "Po dodaniu plum:\n";
print_r($fruits);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => apple
    [1] => pear
)
Po dodaniu plum:
Array
(
    [0] => apple
    [1] => pear
    [2] => plum
)
```

`$fruits[] = 'plum';` zmienia tablicę w pamięci. Dopiero `print_r($fruits)` pokazuje nowy stan.

### Usunięcie jednego elementu

```php
<?php
$fruits = ['apple', 'pear', 'plum'];

echo "Na początku:\n";
print_r($fruits);

unset($fruits[1]);

echo "Po usunięciu klucza 1:\n";
print_r($fruits);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => apple
    [1] => pear
    [2] => plum
)
Po usunięciu klucza 1:
Array
(
    [0] => apple
    [2] => plum
)
```

`unset($fruits[1])` usuwa element pod kluczem `1`, ale nie zmienia automatycznie klucza `2` na `1`. Luki w kluczach są dozwolone.

**Kiedy może się przydać?** Dopisywanie i usuwanie pozwala aktualizować listę produktów, tagów albo zadań.

### Funkcje operujące na końcu tablicy

```php
<?php
$fruits = ['apple', 'pear'];

echo "Na początku:\n";
print_r($fruits);

$size = array_push($fruits, 'plum');
echo "Po array_push; liczba elementów: ", $size, "\n";
print_r($fruits);

$removed = array_pop($fruits);
echo "array_pop usunęło: ", $removed, "\n";
echo "Po array_pop:\n";
print_r($fruits);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => apple
    [1] => pear
)
Po array_push; liczba elementów: 3
Array
(
    [0] => apple
    [1] => pear
    [2] => plum
)
array_pop usunęło: plum
Po array_pop:
Array
(
    [0] => apple
    [1] => pear
)
```

`array_push()` dopisuje wartość na końcu i zwraca nową liczbę elementów. `array_pop()` usuwa ostatnią wartość i ją zwraca. Zwykłe `$fruits[] = 'plum'` jest prostszym zapisem, gdy dopisujesz jedną wartość.

### Funkcje operujące na początku tablicy

```php
<?php
$numbers = [20, 30];

echo "Na początku:\n";
print_r($numbers);

$size = array_unshift($numbers, 10);
echo "Po array_unshift; liczba elementów: ", $size, "\n";
print_r($numbers);

$removed = array_shift($numbers);
echo "array_shift usunęło: ", $removed, "\n";
echo "Po array_shift:\n";
print_r($numbers);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => 20
    [1] => 30
)
Po array_unshift; liczba elementów: 3
Array
(
    [0] => 10
    [1] => 20
    [2] => 30
)
array_shift usunęło: 10
Po array_shift:
Array
(
    [0] => 20
    [1] => 30
)
```

`array_unshift()` dodaje wartość na początku i zwraca nową liczbę elementów. `array_shift()` usuwa pierwszą wartość i ją zwraca. Obie operacje porządkują klucze liczbowe od zera.

### Usunięcie fragmentu przez array_splice

```php
<?php
$numbers = [10, 20, 30, 40];

echo "Na początku:\n";
print_r($numbers);

$removed = array_splice($numbers, 1, 2);

echo "Usunięty fragment:\n";
print_r($removed);
echo "Po array_splice:\n";
print_r($numbers);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => 10
    [1] => 20
    [2] => 30
    [3] => 40
)
Usunięty fragment:
Array
(
    [0] => 20
    [1] => 30
)
Po array_splice:
Array
(
    [0] => 10
    [1] => 40
)
```

`array_splice($numbers, 1, 2)` zaczyna od drugiej pozycji i usuwa dwa elementy. Drugi argument opisuje pozycję w bieżącej kolejności, a nie dowolnie nazwany klucz. Funkcja zwraca usunięty fragment i reindeksuje klucze liczbowe w pozostałej tablicy.

<a id="keys"></a>

## Dodatkowe reguły kluczy w PHP

Podstawowy model już znamy: klucz identyfikuje wartość, a `[]` dopisuje element. PHP ma jeszcze reguły konwersji kluczy, które warto znać później.

Klucz tablicy ma typ `int` albo `string`. String `"0"` staje się tym samym kluczem co liczba `0`. String `"8"` staje się kluczem całkowitym `8`, ale `"08"` pozostaje stringiem. Wartość `true` użyta jako klucz staje się `1`, a `false` staje się `0`.

### Kolizja po konwersji klucza

```php
<?php
$data = [0 => 'first'];

echo "Na początku:\n";
print_r($data);

$data['0'] = 'replacement';
$data['08'] = 'padded';
$data[8] = 'integer';

echo "Po przypisaniach:\n";
print_r($data);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => first
)
Po przypisaniach:
Array
(
    [0] => replacement
    [08] => padded
    [8] => integer
)
```

`'0'` i `0` wskazują ten sam klucz, więc pierwsza wartość zostaje zastąpiona. `'08'` i `8` pozostają dwoma różnymi kluczami.

Nie stosuj ułamków ani `null` jako praktycznych kluczy. Konwersja ułamka, na przykład `1.5` do `1`, może tracić precyzję i od PHP 8.1 jest oznaczona jako przestarzała (*deprecated*). `null` jest konwertowany do pustego stringa, a w PHP 8.5 użycie go jako klucza tablicy albo argumentu klucza w `array_key_exists()` emituje ostrzeżenie `E_DEPRECATED`. Wartość `null` zapisana pod zwykłym kluczem nadal jest dozwolona.

Zaawansowana uwaga: automatyczny klucz zależy od największego użytego klucza całkowitego, nie od `count()`. Po użyciu klucza `10`, nawet jeśli go usuniesz, kolejne `[]` może otrzymać klucz `11`. Od PHP 8.3 po kluczu `-5` w pustej tablicy kolejny automatyczny klucz to `-4`.

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

echo "array_merge:\n";
print_r(array_merge($left, $right));
echo "Suma tablic (+):\n";
print_r($left + $right);
echo "array_replace:\n";
print_r(array_replace($left, $right));
```

Oczekiwany wynik:

```text
array_merge:
Array
(
    [0] => left-number
    [x] => right
    [1] => right-number
    [2] => seven
)
Suma tablic (+):
Array
(
    [2] => left-number
    [x] => left
    [7] => seven
)
array_replace:
Array
(
    [2] => right-number
    [x] => right
    [7] => seven
)
```

**Kiedy może się przydać?** Łączenie pomaga składać listy lub nakładać ustawienia, ale wybór operacji zależy od tego, która strona ma wygrać przy kolizji kluczy.

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

echo "Na początku:\n";
print_r($scores);

$values = $scores;
sort($values);
echo "Po sort:\n";
print_r($values);

$associated = $scores;
asort($associated);
echo "Po asort:\n";
print_r($associated);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [a] => 3
    [b] => 2
    [c] => 1
)
Po sort:
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
)
Po asort:
Array
(
    [c] => 1
    [b] => 2
    [a] => 3
)
```

**Kiedy może się przydać?** Sortowanie porządkuje wyniki, ceny lub nazwy. Gdy klucze wskazują konkretne obiekty, wybierz funkcję zachowującą powiązanie klucz–wartość.

<a id="map"></a>

## array_map: przekształć każdą wartość

Gdy dla każdego elementu chcesz obliczyć nową wartość, użyj `array_map()`. Callback, czyli przekazana funkcja, dostaje wartość wejściową i zwraca jej przekształcenie. W tym przykładzie mnoży liczbę przez dwa. Zapis `fn($number) => $number * 2` czytaj jako: „weź `$number` i zwróć `$number * 2`”.

Funkcja zwraca tablicę wyników, nie zmienia `$numbers`. Przy dokładnie jednej tablicy wejściowej zachowuje klucze — także tekstowe. Przy wielu tablicach wejściowych wynik otrzymuje kolejne klucze całkowite. To nie jest ta sama reguła w obu wariantach.

Mapowanie nie służy do usuwania elementów na podstawie warunku. Zwrócenie `false` z callbacku da wartość `false` w wynikowej tablicy; do wyboru podzbioru służy filtr.

### Podwojenie liczb

```php
<?php
$numbers = [1, 2, 3, 4, 5];

echo "Na początku:\n";
print_r($numbers);

$doubled = array_map(fn($number) => $number * 2, $numbers);

echo "Po array_map:\n";
print_r($doubled);
echo "Tablica wejściowa nadal ma pierwszy element: ", $numbers[0], "\n";
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
    [3] => 4
    [4] => 5
)
Po array_map:
Array
(
    [0] => 2
    [1] => 4
    [2] => 6
    [3] => 8
    [4] => 10
)
Tablica wejściowa nadal ma pierwszy element: 1
```

**Kiedy może się przydać?** `array_map()` przekształca wszystkie wartości, na przykład przelicza ceny lub formatuje nazwy.

<a id="filter"></a>

## array_filter: wybierz część danych

Callback filtra odpowiada na pytanie, czy element ma zostać. Poniżej zostają liczby parzyste, ponieważ reszta z dzielenia przez dwa jest równa zeru. Funkcja zwraca nową tablicę wybranych elementów i zachowuje ich klucze.

Dlatego wynik zawiera klucze `1` i `3`, a nie `0` i `1`. To prawidłowe zachowanie, nie błąd eksportu lub drukowania. Jeżeli potrzebujesz potem listy o ciągłej numeracji, można użyć `array_values()`; nie zakładaj jednak, że filtr wykona to automatycznie.

Bez callbacku `array_filter()` usuwa wartości uznawane za puste/falsey, w tym `0` i `"0"`. Jeżeli takie dane są wartościowe, przekaż własny warunek. Filtrowanie „pustych” i sprawdzanie obecności klucza rozwiązują różne problemy.

### Parzyste liczby z zachowaniem kluczy

```php
<?php
$numbers = [1, 2, 3, 4, 5];

echo "Na początku:\n";
print_r($numbers);

$even = array_filter($numbers, fn($number) => $number % 2 === 0);

echo "Liczby parzyste:\n";
print_r($even);
```

Oczekiwany wynik:

```text
Na początku:
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
    [3] => 4
    [4] => 5
)
Liczby parzyste:
Array
(
    [1] => 2
    [3] => 4
)
```

**Kiedy może się przydać?** `array_filter()` wybiera tylko elementy spełniające warunek, na przykład aktywnych użytkowników albo dostępne produkty.

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

echo "Suma liczb: ", $total, "\n";
echo "Suma pustej tablicy ze startowym 0: ", array_reduce([], fn($carry, $number) => $carry + $number, 0), "\n";
```

Oczekiwany wynik:

```text
Suma liczb: 15
Suma pustej tablicy ze startowym 0: 0
```

### Liczenie powtarzających się owoców

```php
<?php
$products = ['apple', 'pear', 'apple', 'cherry', 'pear'];

echo "Liczba wystąpień:\n";
print_r(array_count_values($products));
```

Oczekiwany wynik:

```text
Liczba wystąpień:
Array
(
    [apple] => 2
    [pear] => 2
    [cherry] => 1
)
```

**Kiedy może się przydać?** Redukcja tworzy jeden wynik z wielu wartości, a zliczanie częstotliwości pokazuje, ile razy wystąpiła każda wartość.

<a id="practice"></a>

## Praktyka: konfiguracja, menu i dane podobne do formularza

Zagnieżdżona konfiguracja przechowuje grupy opcji pod nazwami. Dane menu można reprezentować jako listę elementów, a ich podmenu jako kolejną listę. Nie trzeba od razu budować rekurencyjnego generatora HTML, aby przećwiczyć odczyt.

Opcjonalny klucz `active` odczytujemy przez `?? false`. Odróżnia to brak tego pola od bezwarunkowego założenia, że każdy element je ma. Poniższe dane są lokalnymi stałymi; przykład wypisuje tekst do CLI, nie renderuje HTML.

Przy formularzu jest dodatkowa granica: `$_POST['email'] ?? ''` zapewnia fallback, ale nie gwarantuje stringa. Wejście formularza może mieć kształt tablicy. Zanim walidujesz email przez `filter_var(..., FILTER_VALIDATE_EMAIL)`, sprawdź typ przez `is_string()`.

Drugi przykład używa lokalnego wejścia o kształcie pola formularza, nie obsługuje HTTP i niczego nie wysyła. Walidacja email to nie autoryzacja ani uniwersalne „oczyszczanie”. Przy wyświetlaniu dynamicznego tekstu w HTML stosuje się osobny escaping, np. `htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`; nie jest on ochroną dowolnego URL, SQL lub JavaScript. Pełny handler formularza pozostaje poza tą lekcją.

Instrukcje `if` i `elseif` wybierają jedną z trzech ścieżek. W tym przykładzie najważniejsza jest kolejność: najpierw sprawdzenie typu, dopiero potem walidacja wartości.

### Zagnieżdżona opcja i opcjonalny stan menu

```php
<?php
$config = ['cache' => ['enabled' => true, 'ttl' => 3600]];
$menu = [
    ['title' => 'Start', 'active' => true],
    ['title' => 'Docs'],
];

echo "Czas cache: ", $config['cache']['ttl'], " sekund\n";
echo "Menu:\n";
foreach ($menu as $item) {
    $active = $item['active'] ?? false;
    echo $item['title'], ': ', $active ? 'active' : 'inactive', "\n";
}
```

Oczekiwany wynik:

```text
Czas cache: 3600 sekund
Menu:
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
    echo "Nieprawidłowy email\n";
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

echo "Przed extract: ", $name, "\n";

$count = extract($trusted);

echo "Po extract: ", $name, "\n";
echo "Utworzone lub nadpisane zmienne: ", $count, "\n";
```

Oczekiwany wynik:

```text
Przed extract: original
Po extract: overwritten
Utworzone lub nadpisane zmienne: 1
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

Dokumentacyjne źródła użytych reguł: [model tablic](https://www.php.net/manual/en/language.types.array.php), [foreach](https://www.php.net/manual/en/control-structures.foreach.php), [print_r](https://www.php.net/manual/en/function.print-r.php), [sprawdzanie obecności](https://www.php.net/manual/en/function.array-key-exists.php), [sortowanie](https://www.php.net/manual/en/array.sorting.php), [array_map](https://www.php.net/manual/en/function.array-map.php), [array_filter](https://www.php.net/manual/en/function.array-filter.php), [ostrożność przy extract](https://www.php.net/manual/en/function.extract.php) oraz [deprecacje PHP 8.5](https://www.php.net/manual/en/migration85.deprecated.php).

---

- Zakres dotyczy PHP 8.4–8.5; wcześniejsze wersje wspomniano tylko przy różnicach uzasadnionych zatwierdzonym researchem.
- Przykłady lokalnych danych nie są pełnym handlerem formularza ani audytem bezpieczeństwa aplikacji; zaawansowane sortowanie mieszanych typów i locale pozostaje poza zakresem.
