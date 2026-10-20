---
title: "Podstawy PHP dla początkujących"
description: "Jak przygotować PHP i VS Code, utworzyć pierwszy plik, uruchamiać i poprawiać kod oraz poznać echo, zmienne, typy i proste obliczenia."
slug: podstawy-php
featuredImage: ../../src/assets/podstawy-php.webp
featuredAlt: Chłopak umieszcza moduł wartości w maszynie łączącej dane, operator i wynik programu PHP.
status: published
created: 2026-10-16T00:00:00.000Z
updated: 2026-10-19T00:00:00.000Z
domain: programming
topic: php
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: "PHP Manual — General Installation Considerations"
    url: https://www.php.net/manual/en/install.general.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP Manual — Running PHP on the command line on Windows systems"
    url: https://www.php.net/install.windows.commandline.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP Manual — Command line usage"
    url: https://www.php.net/manual/en/features.commandline.usage.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP Manual — Basic syntax"
    url: https://www.php.net/manual/en/language.basic-syntax.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP in Visual Studio Code"
    url: https://code.visualstudio.com/docs/languages/php
    publisher: Visual Studio Code Documentation
    accessed: 2026-10-19
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
# Podstawy PHP dla początkujących

Jeśli nigdy wcześniej nie pisałeś PHP na swoim komputerze, nie zaczynaj od zapamiętywania składni. Najpierw przygotuj prosty warsztat i sprawdź, co wykonuje kod. Do tej lekcji potrzebujesz tylko:

- edytora kodu, na przykład Visual Studio Code;
- interpretera PHP działającego w terminalu;
- zwykłego folderu na własne pliki.

Nie potrzebujesz jeszcze serwera WWW, przeglądarki, bazy danych, Composera ani debuggera Xdebug. Przykłady z tej lekcji zostały wykonane w lokalnym PHP 8.2.4 CLI na Windows. Numer Twojej wersji może być inny.

## Co właściwie trzeba zainstalować

Plik z rozszerzeniem `.php` jest tekstem zawierającym kod źródłowy. VS Code pozwala ten tekst wygodnie pisać i edytować, ale sam go nie wykonuje. Kod wykonuje interpreter PHP.

Najprostszy model wygląda tak:

```text
plik start.php → interpreter PHP → wynik albo komunikat błędu w terminalu
```

VS Code ma podstawową obsługę PHP, między innymi kolorowanie składni i proste podpowiedzi. Dodatkowe rozszerzenie, takie jak Intelephense, może zapewnić bogatsze podpowiedzi i nawigację po kodzie, ale nie jest wymagane do wykonania tej lekcji. Rozszerzenie również nie zastępuje interpretera PHP.

Jeśli masz już XAMPP, PHP może być zainstalowane razem z nim. Do pracy w terminalu nie musisz uruchamiać Apache ani panelu XAMPP. Najpierw sprawdź dostępne PHP, zamiast instalować drugą kopię.

## Czy PHP jest już dostępne

Otwórz terminal. W VS Code wybierz **Terminal → New Terminal**, a następnie wpisz:

```powershell
php --version
```

Jeśli zobaczysz wynik podobny do tego, możesz przejść dalej:

```text
PHP 8.2.4 (cli)
```

Skrót CLI oznacza tutaj program PHP uruchamiany z wiersza poleceń. Właśnie tego wariantu potrzebujesz do pierwszych ćwiczeń.

Jeśli terminal informuje, że polecenie `php` nie istnieje albo nie zostało rozpoznane, możliwe są dwie sytuacje:

1. PHP nie jest jeszcze zainstalowane — zainstaluj PHP CLI zgodnie z instrukcją dla swojego systemu.
2. PHP jest zainstalowane, ale folder zawierający `php.exe` nie znajduje się w zmiennej `PATH` — dodaj ten folder do `PATH` i otwórz terminal ponownie.

W instalacji XAMPP plik może znajdować się na przykład pod ścieżką `C:\xampp\php\php.exe`. Możesz wtedy najpierw sprawdzić go bez zmieniania `PATH`:

```powershell
C:\xampp\php\php.exe --version
```

Nie przechodź dalej, dopóki jedno z tych poleceń nie pokaże wersji PHP. Dzięki temu późniejszy problem z uruchomieniem pliku nie będzie zagadką dotyczącą instalacji.

<a id="first-file"></a>

## Utwórz folder i pierwszy plik

W VS Code wybierz **File → Open Folder** i utwórz folder `pierwszy-php`. Otwieranie całego folderu jest ważne: terminal uruchomiony w VS Code zacznie wtedy pracę właśnie w tym miejscu.

W panelu Explorer utwórz plik:

```text
start.php
```

Sprawdź nazwę. Plik powinien kończyć się na `.php`, a nie na `.php.txt`. Rozszerzenie pomaga edytorowi rozpoznać język i od razu pokazuje, z jakim rodzajem pliku pracujesz.

Otwórz ponownie terminal poleceniem **Terminal → New Terminal** i wpisz:

```powershell
dir
```

Na liście powinien znaleźć się `start.php`. Jeśli go nie widzisz, terminal prawdopodobnie pracuje w innym folderze.

## Napisz pierwszy program

W pliku `start.php` wpisz:

```php
<?php
echo "Start PHP\n";
```

Każdy element ma zadanie:

- `<?php` informuje, że zaczyna się kod PHP;
- `echo` wysyła wartość do wyniku programu;
- tekst między cudzysłowami jest wartością, którą chcesz wypisać;
- `\n` przechodzi do następnego wiersza terminala;
- średnik `;` kończy instrukcję.

Na początku pliku używaj `<?php`. W pliku zawierającym wyłącznie PHP nie potrzebujesz zamykającego `?>`.

## Zapisz i uruchom kod

Zapisz plik skrótem **Ctrl+S**. Następnie uruchom go w terminalu:


```powershell
php start.php
```

Oczekiwany wynik:

```text
Start PHP
```

Polecenie składa się z dwóch części: `php` uruchamia interpreter, a `start.php` wskazuje plik do wykonania. PHP czyta instrukcje od góry do dołu i zatrzymuje się po wykonaniu ostatniej.

Zapamiętaj podstawowy cykl pracy:

```text
napisz → zapisz → uruchom → przeczytaj wynik
```

## Zmień program i uruchom go ponownie

Zmień tekst w pliku:

```php
<?php
echo "Uczę się PHP\n";
```

Zanim uruchomisz kod, przewidź dokładny wynik. Następnie zapisz plik, przejdź do terminala, naciśnij strzałkę w górę, aby przywołać poprzednie polecenie, i zatwierdź je klawiszem Enter.

Oczekiwany wynik:

```text
Uczę się PHP
```

Jeśli nadal widzisz stary tekst, najpierw sprawdź, czy plik został zapisany. Edytowanie i uruchamianie to dwie oddzielne czynności.

<a id="values-and-variables"></a>

## Wartość ma nazwę

Program staje się użyteczniejszy, gdy może przechowywać wartość pod nazwą. Taka nazwa to zmienna. W PHP zaczyna się ona od znaku dolara.

```php
<?php
$name = 'Ada';
echo "Cześć, ", $name, "!\n";
```

Oczekiwany wynik:

```text
Cześć, Ada!
```

Instrukcja `$name = 'Ada';` zapisuje tekst `Ada` pod nazwą `$name`. Znak `=` oznacza tutaj przypisanie: wartość z prawej strony trafia do zmiennej po lewej stronie. `echo` może wypisać kilka wartości oddzielonych przecinkami.

Zmień `Ada` na swoje imię. Przed uruchomieniem programu przewidź, co pojawi się w terminalu.

## Wartości mają typy

Tekst, liczba całkowita i odpowiedź „tak lub nie” są różnymi rodzajami wartości. PHP nazywa je odpowiednio `string`, `int` i `bool`. Wbudowane narzędzie `get_debug_type()` przyjmuje wartość i zwraca nazwę jej typu. Użyjemy go jak lupy — nie uczymy się jeszcze tworzenia własnych funkcji.

```php
<?php
$name = 'Ada';
$count = 2;
$ready = true;
echo get_debug_type($name), "\n";
echo get_debug_type($count), "\n";
echo get_debug_type($ready), "\n";
```

Oczekiwany wynik:

```text
string
int
bool
```

Te trzy rodzaje należą do prostych typów skalarnych. Nie musisz teraz zapamiętywać tej nazwy. Ważniejsze jest rozróżnienie, czy pracujesz z tekstem, liczbą, czy stanem `true` albo `false`.

<a id="operators"></a>

## Operator tworzy nowy wynik

Operator wykonuje działanie na wartościach. Operator `+` dodaje liczby. Najpierw PHP oblicza prawą stronę przypisania, a potem zapisuje wynik w zmiennej po lewej stronie.

Załóżmy, że chcesz policzyć, ile stron przeczytałeś w ciągu dwóch dni:

```php
<?php
$yesterday = 8;
$today = 12;
$totalPages = $yesterday + $today;
echo "Przeczytane strony: ", $totalPages, "\n";
```

Oczekiwany wynik:

```text
Przeczytane strony: 20
```

Zmień `$today` z `12` na `15`. Najpierw oblicz wynik sam, a dopiero później uruchom program.

## Błąd też przekazuje informację

Programista nie tylko pisze kod. Regularnie czyta błędy i poprawia ich przyczynę. Usuń średnik z instrukcji `echo`, aby celowo utworzyć niepoprawny kod:

```php
<?php
echo "Brakuje średnika\n"
```

Zapisz plik i uruchom `php start.php`. PHP nie wykona programu. Zobaczysz komunikat o błędzie składni. Jego dokładne brzmienie zależy od wersji, ale powinien wskazać plik i okolicę, w której parser nie potrafił kontynuować.

Wskazana linia może znajdować się tuż za rzeczywistą przyczyną. Sprawdź więc również poprzednią instrukcję. Przywróć średnik:

```php
<?php
echo "Brakuje średnika\n";
```

Zapisz i uruchom plik ponownie. Program powinien zakończyć się poprawnie. To jest pełny cykl pracy:

```text
napisz → przewidź → uruchom → przeczytaj wynik lub błąd → popraw
```

## Samodzielne ćwiczenie: prosty koszt zakupów

Utwórz nowy plik `zakupy.php`. Program ma:

1. zapisać nazwę produktu;
2. zapisać cenę jednej sztuki;
3. zapisać liczbę sztuk;
4. pomnożyć cenę przez liczbę sztuk;
5. wypisać nazwę produktu i łączny koszt.

Zanim zajrzysz do rozwiązania, spróbuj sam. Potrzebny operator mnożenia to `*`. Możesz użyć nazw `$product`, `$price`, `$quantity` i `$total`.

### Przykładowe rozwiązanie

```php
<?php
$product = 'Notatnik';
$price = 12;
$quantity = 3;
$total = $price * $quantity;

echo "Produkt: ", $product, "\n";
echo "Liczba sztuk: ", $quantity, "\n";
echo "Razem: ", $total, " zł\n";
```

Oczekiwany wynik:

```text
Produkt: Notatnik
Liczba sztuk: 3
Razem: 36 zł
```

Zmień produkt, cenę i liczbę sztuk. Za każdym razem przewiduj wynik przed uruchomieniem kodu.

## Gdy program nie działa

| Objaw | Co sprawdzić najpierw |
| --- | --- |
| Polecenie `php` nie zostało rozpoznane | Czy `php --version` działa i czy folder z `php.exe` jest w `PATH` |
| `Could not open input file` | Czy terminal jest w folderze zawierającym wskazany plik |
| Widzisz poprzedni wynik | Czy zapisałeś plik skrótem Ctrl+S |
| VS Code nie koloruje kodu | Czy nazwa naprawdę kończy się na `.php`, a nie `.php.txt` |
| Pojawia się `Parse error` | Sprawdź wskazaną linię i instrukcję bezpośrednio przed nią, zwłaszcza średniki i cudzysłowy |

Nie poprawiaj kilku rzeczy naraz. Zmień jedną rzecz, zapisz plik i uruchom program ponownie. Dzięki temu wiesz, która zmiana rozwiązała problem.

## Co już potrafisz

Po wykonaniu ćwiczeń potrafisz:

- sprawdzić, czy interpreter PHP jest dostępny;
- utworzyć i edytować plik `.php` w VS Code;
- zapisać i uruchomić program w terminalu;
- odróżnić kod źródłowy, wynik i komunikat błędu;
- użyć `echo`, wartości, zmiennej i prostego operatora;
- przewidzieć wynik i poprawić prosty błąd składni.

Następnym krokiem są instrukcje warunkowe, które wykorzystują wartości `true` i `false` do wybierania jednej z kilku dróg. Później możesz przejść do tablic i funkcji. Nie są one potrzebne do zrozumienia pierwszego lokalnego programu.

---

- Zakres wykonania to lokalne PHP 8.2.4 CLI na Windows. Materiał nie omawia formularzy, obsługi HTTP, serwera WWW, baz danych, Composera, tablic, pętli, własnych funkcji, klas, frameworków, deklaracji typów ani zgodności każdego komunikatu diagnostycznego z innymi wersjami PHP.
