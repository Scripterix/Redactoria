---
title: "Instrukcje sterujące w PHP z warunkami i pętlami"
description: Praktyczny przewodnik po warunkach, porównaniach, switch, match oraz pętlach w PHP 8.4–8.5, z 16 wykonanymi przykładami.
slug: instrukcje-sterujace-php
featuredImage: ../../src/assets/instrukcje-sterujace.webp
featuredAlt: Dwie osoby analizują schematy warunków i pętli na ekranie.
status: published
created: 2026-10-10T00:00:00.000Z
updated: 2026-10-19T00:00:00.000Z
domain: programming
topic: php
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: PHP Manual — if
    url: https://www.php.net/manual/en/control-structures.if.php
    publisher: PHP Documentation
  - title: PHP Manual — Booleans
    url: https://www.php.net/manual/en/language.types.boolean.php
    publisher: PHP Documentation
  - title: PHP Manual — Comparison Operators
    url: https://www.php.net/manual/en/language.operators.comparison.php
    publisher: PHP Documentation
  - title: PHP Manual — Logical Operators
    url: https://www.php.net/manual/en/language.operators.logical.php
    publisher: PHP Documentation
  - title: PHP Manual — switch
    url: https://www.php.net/manual/en/control-structures.switch.php
    publisher: PHP Documentation
  - title: PHP Manual — match
    url: https://www.php.net/manual/en/control-structures.match.php
    publisher: PHP Documentation
  - title: PHP Manual — for
    url: https://www.php.net/manual/en/control-structures.for.php
    publisher: PHP Documentation
  - title: PHP Manual — foreach
    url: https://www.php.net/manual/en/control-structures.foreach.php
    publisher: PHP Documentation
origin:
  type: wordpress-export
  source_id: "1308"
  original_url: https://opengateweb.com/posts/post-60-instrukcje-sterujace-php/
  original_date: null
  original_author: null
review:
  status: approved
  reviewer: human — public production approval
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-10T00:00:00.000Z
  update_priority: normal
redactoria:
  decision: rewrite
  modernization: major
---
# Instrukcje sterujące w PHP z warunkami i pętlami

Zakres: PHP 8.4–8.5. Materiał dla początkujących i osób na poziomie średnim.

<a id="before-start"></a>

## Zanim zaczniesz

Instrukcje sterujące rozstrzygają dwie rzeczy: który fragment programu uruchomić i ile razy go powtórzyć. Warunek wybiera drogę, a pętla powtarza czynność. W tym materiale przejdziesz od pojedynczej decyzji do przeglądania tablicy.

Potrzebujesz podstaw zmiennych, liczb, napisów, wartości `true` i `false` oraz `echo`. Przed częścią o `foreach` warto znać [podstawy tablic w PHP](/artykuly/tablice-w-php/). Nie musisz znać całego API tablic.

Każdy blok PHP jest osobnym, kompletnym przykładem. Zapisz go w pliku `przyklad.php` i uruchom `php przyklad.php` w terminalu. PHP działa również w CLI: do tych prób nie potrzebujesz serwera WWW. Nie sklejaj wszystkich bloków w jeden plik, bo niektóre używają tych samych nazw.

Przykłady sprawdzono na PHP 8.4.26 i 8.5.11. Ten zakres nie oznacza, że wszystkie porównania w obu wersjach są identyczne: migracje zmieniają m.in. szczególne przypadki obiektów. Tutaj pracujemy na prostych danych.

<a id="if-elseif-else"></a>

## if, elseif i else: pierwsza pasująca gałąź

`if` sprawdza warunek. Gdy warunek jest prawdziwy, wykonuje blok w klamrach. `elseif` daje kolejną możliwość, a `else` obsługuje sytuację, w której żaden wcześniejszy warunek nie pasował.

W jednym łańcuchu wybierana jest pierwsza pasująca gałąź. Dla wyniku 74 program pomija próg 90, wybiera próg 60 i nie wykonuje `else`.

Kolejność ma znaczenie. Gdyby próg 60 znalazł się przed progiem 90, również wynik 95 trafiłby do zwykłego zaliczenia. Najpierw sprawdzaj bardziej szczegółowy przypadek. Jeśli chcesz wykonać kilka niezależnych sprawdzeń, użyj osobnych instrukcji `if`, a nie jednego łańcucha `elseif`.

Stosuj klamry także dla jednej instrukcji. Dzięki temu łatwiej zobaczyć, gdzie kończy się gałąź, i bezpiecznie dopisać następną linię.

### Wybór komunikatu z wyniku

```php
<?php
$score = 74;

if ($score >= 90) {
    echo "Bardzo dobry wynik\n";
} elseif ($score >= 60) {
    echo "Zaliczone\n";
} else {
    echo "Sprobuj ponownie\n";
}
```

Oczekiwany wynik:

```text
Zaliczone
```

<a id="comparison"></a>

## Porównanie to nie przypisanie

`=` zapisuje wartość w zmiennej. `==` sprawdza równość z możliwą konwersją typów. `===` sprawdza zarówno wartość, jak i typ. To różnica między liczbą `5` a napisem `'5'`: luźno są równe, ale nie są identyczne.

Dla sprawdzania znanego typu zwykle czytelne są `===` i `!==`. `!==` oznacza brak ścisłej zgodności, a `!=` jest zaprzeczeniem luźnej równości. Nie chodzi o zakaz używania `==`, tylko o świadome wybranie zasad porównania.

Przy progach liczbowych używaj `<`, `<=`, `>` i `>=`. W poprzednim przykładzie `>= 60` obejmuje także dokładnie 60.

Uważaj na przypadkowe `=` w warunku. Zapis `if ($score = 60)` nie pyta o wynik: zmienia `$score` na 60, a przypisana wartość zostaje potraktowana jako warunek. Gdy szukasz błędu w decyzji programu, policz znaki równości.

### Ta sama reprezentacja, inny typ

```php
<?php
$number = 5;
$text = '5';

var_dump($number == $text);
var_dump($number === $text);
var_dump($number !== $text);
```

Oczekiwany wynik:

```text
bool(true)
bool(false)
bool(true)
```

<a id="truthiness"></a>

## Co PHP uznaje za prawdziwy warunek?

Warunek nie musi już być wartością `bool`. PHP może potraktować inną wartość jako prawdę lub fałsz — to konwersja do `bool`, często nazywana truthiness.

Do wartości fałszywych należą `false`, liczba `0`, `0.0` i `-0.0`, pusty napis `''`, napis `'0'`, pusta tablica `[]` oraz `null`. Zwróć uwagę na napis zawierający jedno zero: nie jest pusty, a mimo to oznacza fałsz. Napisy `'00'` i `'false'` oznaczają prawdę, podobnie jak liczba `-1`.

Dlatego pytanie „czy tekst nie jest pusty?” nie zawsze powinno mieć postać `if ($text)`. Jeśli znasz typ i chcesz dopuścić również napis `'0'`, porównaj tekst z pustym napisem przez `$text !== ''`.

Truthiness nie sprawdza poprawności danych. Nie potwierdza, że napis zawiera sensowną liczbę ani że użytkownik ma uprawnienia. Najpierw ustal, o jaką właściwość danych naprawdę pytasz.

### Fałsz nie musi oznaczać pustego napisu

```php
<?php
$text = '0';

var_dump((bool) $text);
var_dump($text !== '');
```

Oczekiwany wynik:

```text
bool(false)
bool(true)
```

<a id="logical-operators"></a>

## Łączenie warunków i rola nawiasów

`&&` oznacza „i”: oba warunki muszą być prawdziwe. `||` oznacza „lub”: wystarczy jeden. `!` odwraca prawdę i fałsz. W przykładzie dostęp zależy jednocześnie od wieku, potwierdzenia i braku blokady. To demonstracja warunku na własnych danych, nie gotowy system autoryzacji.

`&&` i `||` stosują krótkie spięcie, czyli short-circuit. Jeśli lewa strona `&&` jest fałszywa, prawa nie jest obliczana. Jeśli lewa strona `||` jest prawdziwa, prawa również nie jest potrzebna. Drugie ćwiczenie wykorzystuje to do pominięcia dzielenia przez zero przy dzielniku typu `int`. Ścisły test `$denominator !== 0` rozpoznaje tutaj całkowite zero; nie jest ogólnym testem zera numerycznego. Na przykład `0.0 !== 0` daje `true`, ponieważ typy się różnią. Jeśli zmieniasz typ danych w swoim wariancie, musisz też dobrać odpowiedni test wartości.

Słowa `and` i `or` też są operatorami logicznymi, ale mają inne pierwszeństwo. W trzecim przykładzie `&&` wiąże mocniej niż przypisanie, a `and` słabiej. W pierwszej linii przypisujesz wynik całej koniunkcji; w drugiej przypisujesz `true`, a dopiero potem następuje `and false`. Stąd dwa różne wyniki.

Na początek używaj `&&`, `||` i jawnych nawiasów przy mieszaniu warunków. Na przykład `($isVerified || $isGuest) && !$isBlocked` wyraźnie pokazuje, że blokada dotyczy obu możliwości. Nawiasy pokazują grupowanie; nie traktuj ich jako obietnicy kolejności wykonania dowolnych wyrażeń.

### Kilka warunków jednocześnie

```php
<?php
$age = 20;
$isVerified = true;
$isBlocked = false;

if ($age >= 18 && $isVerified && !$isBlocked) {
    echo "Dostep\n";
} else {
    echo "Brak dostepu\n";
}
```

Oczekiwany wynik:

```text
Dostep
```

### Najpierw sprawdź dzielnik

```php
<?php
$denominator = 0;

if ($denominator !== 0 && 10 / $denominator > 1) {
    echo "Wynik wiekszy od 1\n";
} else {
    echo "Warunek niespelniony; bez dzielenia przez zero\n";
}
```

Oczekiwany wynik:

```text
Warunek niespelniony; bez dzielenia przez zero
```

### && i and przy przypisaniu

```php
<?php
$withSymbols = true && false;
$withWords = true and false;

var_dump($withSymbols);
var_dump($withWords);
```

Oczekiwany wynik:

```text
bool(false)
bool(true)
```

<a id="ternary"></a>

## Krótki wybór jednej wartości

Operator warunkowy `warunek ? wartośćA : wartośćB` przydaje się, gdy decyzja ma dać jedną krótką wartość. Tutaj wybiera etykietę.

Jeżeli gałąź ma wykonać kilka czynności albo wymaga długiego wyjaśnienia, zostań przy `if/else`. Nie zagnieżdżaj kolejnych operatorów warunkowych tylko po to, by zmieścić kod w jednej linii.

### Etykieta zależna od bool

```php
<?php
$active = true;
$label = $active ? 'Aktywny' : 'Nieaktywny';
echo $label, "\n";
```

Oczekiwany wynik:

```text
Aktywny
```

<a id="switch-match"></a>

## switch i match: podobny wybór, inne porównanie

`switch` sprawdza jedną wartość względem kolejnych `case`. Używa luźnego porównania, podobnego do `==`. Dlatego napis `'1'` pasuje do liczby `1`.

Po dopasowaniu `switch` wykonuje kolejne instrukcje aż do `break` albo końca bloku. Jeśli pominiesz `break`, program może wejść również do następnego `case` — to fallthrough. Czasem jest zamierzone, ale na początku zapisuj zakończenie gałęzi jawnie. `default` obsługuje brak dopasowania.

`match` jest wyrażeniem: wybiera i daje wartość, którą możesz przypisać. Porównuje ściśle przez `===`, nie przechodzi do następnych ramion i nie potrzebuje `break`. W drugim przykładzie ten sam napis `'1'` nie pasuje do liczby `1`, więc wybierane jest `default`.

`match` istnieje od PHP 8.0, nie jest nowością 8.4 ani 8.5. Musi obsłużyć daną wartość. Gdy żadne ramię nie pasuje i nie ma `default`, rzuca `UnhandledMatchError`. Przy prostym wyborze etykiety `match` może być wygodny; przy zakresach liczbowych i kilku czynnościach w gałęzi nadal użyteczny jest `if/elseif`.

### switch dopasowuje napis do liczby

```php
<?php
$value = '1';

switch ($value) {
    case 1:
        echo "Luzne dopasowanie\n";
        break;
    default:
        echo "Brak dopasowania\n";
        break;
}
```

Oczekiwany wynik:

```text
Luzne dopasowanie
```

### match odróżnia typy

```php
<?php
$value = '1';

$label = match ($value) {
    1 => 'Liczba jeden',
    default => 'Inna wartosc lub typ',
};

echo $label, "\n";
```

Oczekiwany wynik:

```text
Inna wartosc lub typ
```

<a id="while-do"></a>

## while i do...while: kiedy sprawdzany jest warunek?

`while` sprawdza warunek przed obiegiem. Jeśli jest on fałszywy od początku, blok nie wykona się ani razu. W sumowaniu zaczynamy od 1, dodajemy bieżącą liczbę i przesuwamy licznik o jeden.

Postęp jest ważny: bez `$i++` licznik pozostałby równy 1, a warunek nadal byłby prawdziwy. Taka pętla nie doszłaby do swojego zakończenia. Zanim uruchomisz własny wariant, sprawdź, co zmienia warunek i czy da się osiągnąć jego fałsz.

`do...while` najpierw wykonuje blok, a dopiero potem sprawdza warunek. Drugi przykład wykonuje się raz mimo `false`. Nie zapomnij o średniku po końcowym `while (false);`.

Wybieraj `while`, kiedy przed pierwszą próbą może już nie być nic do zrobienia. `do...while` pasuje do czynności, którą chcesz wykonać przynajmniej raz.

### Sumowanie od 1 do 10

```php
<?php
$i = 1;
$sum = 0;

while ($i <= 10) {
    $sum += $i;
    $i++;
}

echo $sum, "\n";
```

Oczekiwany wynik:

```text
55
```

### Jedno wykonanie przy fałszywym warunku

```php
<?php
do {
    echo "Pierwsza proba\n";
} while (false);
```

Oczekiwany wynik:

```text
Pierwsza proba
```

<a id="for-loop"></a>

## for: licznik w jednym miejscu

`for` zbiera trzy części pętli w nagłówku. Inicjalizacja wykonuje się raz. Warunek jest sprawdzany przed każdym obiegiem. Krok wykonuje się po obiegu.

W tym przykładzie `$i = 0` ustawia początek, `$i < 3` ogranicza zakres, a `$i++` przesuwa licznik. Wynik to 0, 1 i 2, czyli trzy obiegi. Zmiana `< 3` na `<= 3` dołączyłaby także 3.

Nie wybieraj pętli na podstawie tego, która rzekomo jest najpopularniejsza. `for` jest czytelny, gdy licznik, granicę i krok warto widzieć obok siebie. Przy kolekcji zwykle prostszy będzie `foreach`.

### Trzy wartości licznika

```php
<?php
for ($i = 0; $i < 3; $i++) {
    echo $i, "\n";
}
```

Oczekiwany wynik:

```text
0
1
2
```

<a id="foreach-loop"></a>

## foreach: kolejne elementy tablicy

`foreach` przechodzi po elementach tablicy bez ręcznego licznika. W formie `as $value` otrzymujesz wartość. W formie `as $key => $value` otrzymujesz także klucz.

Tablica poniżej ma nazwane klucze, więc `$role` dostaje klucz, a `$name` odpowiadającą mu wartość. Dla pustej tablicy nie byłoby żadnego obiegu.

Nie używamy tutaj `&` ani nie zmieniamy kolekcji podczas przechodzenia po niej. To pozwala skupić się na samym przepływie. O indeksach, kluczach i operacjach na tablicach przeczytasz więcej w [artykule o tablicach w PHP](/artykuly/tablice-w-php/).

### Klucz i wartość w jednym obiegu

```php
<?php
$team = ['editor' => 'Anna', 'reviewer' => 'Tomek'];

foreach ($team as $role => $name) {
    echo $role, ': ', $name, "\n";
}
```

Oczekiwany wynik:

```text
editor: Anna
reviewer: Tomek
```

<a id="break-continue"></a>

## break kończy pętlę, continue pomija jej fragment

`break` kończy bieżącą pętlę. W pierwszym przykładzie nie drukujemy 4: gdy licznik do niej dochodzi, wykonuje się `break`. Program przechodzi do instrukcji po pętli.

`continue` nie kończy całej pętli. Pomija resztę bieżącego obiegu i przechodzi do następnego. Drugi przykład pomija tylko 2, a potem drukuje 3 i 4. W pętli `for` krok `$i++` nadal wykonuje się po `continue`.

To ważny kontrast: gdy chcesz zatrzymać szukanie po znalezieniu wyniku, potrzebujesz `break`; gdy chcesz pominąć niepasujący element, może wystarczyć `continue`. Tutaj używamy jednej pętli naraz. Zagnieżdżone poziomy i zachowanie `continue` wewnątrz `switch` to osobny temat.

### Zakończenie przed wartością 4

```php
<?php
for ($i = 1; $i <= 5; $i++) {
    if ($i === 4) {
        break;
    }
    echo $i, "\n";
}
echo "Po petli\n";
```

Oczekiwany wynik:

```text
1
2
3
Po petli
```

### Pominięcie tylko wartości 2

```php
<?php
for ($i = 1; $i <= 4; $i++) {
    if ($i === 2) {
        continue;
    }
    echo $i, "\n";
}
```

Oczekiwany wynik:

```text
1
3
4
```

<a id="return-function"></a>

## return: zakończ funkcję i oddaj wynik

Wewnątrz funkcji `return` kończy jej wykonanie i zwraca wynik do miejsca wywołania. Nie zastępuje `break`: kończy funkcję, a nie tylko pętlę wewnątrz niej.

Funkcja poniżej przyjmuje wynik punktowy. `int` opisuje typ parametru, a `string` typ zwracanej wartości. Gdy próg jest spełniony, pierwszy `return` kończy funkcję; drugi nie zostaje już wykonany. Dla niższego wyniku funkcja dochodzi do drugiego `return`.

Po wywołaniu program nadal wykonuje następne instrukcje. Dlatego widzisz także komunikat `Program trwa dalej`. W tym materiale używamy `return` wyłącznie wewnątrz funkcji; na poziomie pliku ma inne zastosowanie.

### Dwa wyniki i dalsza praca programu

```php
<?php
function resultLabel(int $score): string
{
    if ($score >= 60) {
        return 'Zaliczone';
    }
    return 'Powtorka';
}

echo resultLabel(74), "\n";
echo resultLabel(40), "\n";
echo "Program trwa dalej\n";
```

Oczekiwany wynik:

```text
Zaliczone
Powtorka
Program trwa dalej
```

<a id="next-step"></a>

## Gdy wynik zaskakuje — i co przećwiczyć dalej

Sprawdź najpierw pięć rzeczy: czy warunek porównuje zamiast przypisywać, czy typy są takie, jak zakładasz, czy próg szczegółowy jest przed ogólnym, czy licznik ma prawidłową granicę i czy pętla robi postęp.

Nie stawiaj średnika bezpośrednio po `if (...)`. Taki średnik tworzy pustą instrukcję, a następujący po nim blok nie jest już objęty tym warunkiem. To inna sytuacja niż wymagany średnik na końcu `do...while`.

Na ćwiczenie zmień `$score` w pierwszym przykładzie kolejno na 59, 60, 89 i 90. Przewidź komunikat przed uruchomieniem. Potem zmień granicę pętli `for` z `< 3` na `<= 3` i policz obiegi. Nie usuwaj kroku licznika podczas prób.

Następny krok to połączenie `foreach` i `if`: przejdź po własnej tablicy wyników i wybierz te, które spełniają próg. Potrzebne podstawy kolekcji znajdziesz w [Tablicach w PHP](/artykuly/tablice-w-php/). Nie potrzebujesz do tego ticks ani dołączania innych plików.

---

- Przykłady dotyczą prostych liczb, napisów i tablic. Nie omawiają porównań obiektów, referencji w foreach ani zagnieżdżonych poziomów break/continue.
- Testy wykonano na PHP 8.4.26 i 8.5.11; nie jest to gwarancja zachowania wszystkich programów PHP.
- Ticks, dołączanie plików i return na poziomie pliku wymagają osobnych materiałów.
