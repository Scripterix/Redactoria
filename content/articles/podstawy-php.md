---
title: "PHP od pierwszego skryptu: wartości, zmienne, typy, operatory i CLI"
description: "Pierwszy skrypt PHP w terminalu: echo, wartości, zmienne, podstawowe typy scalar i prosty operator arytmetyczny."
slug: podstawy-php
status: published
created: 2026-10-16T00:00:00.000Z
updated: 2026-10-16T00:00:00.000Z
domain: programming
topic: php
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: "PHP Manual — Basics: Variables"
    url: https://www.php.net/manual/en/language.variables.basics.php
    publisher: PHP Documentation
  - title: "PHP Manual — Introduction: Types"
    url: https://www.php.net/manual/en/language.types.intro.php
    publisher: PHP Documentation
  - title: PHP Manual — Arithmetic Operators
    url: https://www.php.net/manual/en/language.operators.arithmetic.php
    publisher: PHP Documentation
  - title: PHP Manual — echo
    url: https://www.php.net/manual/en/function.echo.php
    publisher: PHP Documentation
origin:
  type: wordpress-export
  source_id: "977"
  original_url: https://opengateweb.com/posts/52-php-python/
  original_date: 2025-04-14T18:21:36.000Z
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

- Zakres wykonania to lokalne PHP 8.2.4 CLI. Materiał nie omawia tablic, funkcji, formularzy, serwera WWW, deklaracji typów ani zgodności z innymi wersjami PHP.
