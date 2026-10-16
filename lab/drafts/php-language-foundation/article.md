# PHP od pierwszego skryptu: wartości, zmienne, typy, operatory i CLI

Zakres: cli 8.2.4 (cli) (built: Mar 14 2023 17:54:25) (ZTS Visual C++ 2019 x64). Materiał dla początkujących i osób na poziomie średnim.

<a id="first-file"></a>

## Jeden plik i pierwszy wynik

Zapisz kod w pliku `start.php`. W terminalu uruchom `php start.php`. Ten mały cykl jest ważny: najpierw zapisujesz program, potem sprawdzasz jego dokładny wynik. `echo` wypisuje tekst. Nie potrzebujesz do tego serwera WWW ani formularza.

### Pierwszy wynik z echo

```php
<?php
echo "Start PHP\n";
```

Oczekiwany wynik:

```text
Start PHP
```

<a id="values-and-variables"></a>

## Wartość ma nazwę

Zmienna pozwala odwołać się do wartości przez nazwę. W PHP nazwa zmiennej zaczyna się od `$`. W tym przykładzie tekst, liczba i wartość logiczna są trzema prostymi wartościami scalar. `get_debug_type` pokazuje ich typ; to obserwacja, nie test poprawności całego programu.

### Trzy wartości i ich typy

```php
<?php
$name = 'Ada';
$count = 2;
$ready = true;
echo $name, "\n";
echo get_debug_type($count), "\n";
echo get_debug_type($ready), "\n";
```

Oczekiwany wynik:

```text
Ada
int
bool
```

<a id="operators"></a>

## Operator tworzy nowy wynik

Operator `+` dodaje wartości liczbowe. Zapis po prawej stronie przypisania jest obliczany, a wynik trafia do zmiennej po lewej stronie. Zmienna nie musi przechowywać wyłącznie liczby: wcześniej zapisana nazwa i obliczony wynik mogą zostać wypisane razem.

### Suma zapisana pod nową nazwą

```php
<?php
$first = 2;
$second = 3;
$total = $first + $second;
echo "Suma: ", $total, "\n";
```

Oczekiwany wynik:

```text
Suma: 5
```

---

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Zakres wykonania to lokalne PHP 8.2.4 CLI. Materiał nie omawia tablic, funkcji, formularzy, serwera WWW, deklaracji typów ani zgodności z innymi wersjami PHP.
