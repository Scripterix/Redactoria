# Researcher 0.1 — Instrukcje sterujące PHP: warunki i pętle

## RESEARCH SCOPE

Research Packet, nie artykuł ani zatwierdzenie publikacji. Jeden pełny materiał SOURCE.

- 1308-post-60-instrukcje-sterujace-php.md (1308)

Tryb: imported-session-analysis; model: current-codex-session.
Request SHA-256: 5aba4e164866b4cd060b6ad6d15d88329a0db136935a8aad2dd72ebe5efaed88

## PHP VERSION TARGET

PHP 8.4–8.5; rzeczywiste controlled probes: 8.4.26 i 8.5.11. Zakres skalarów i prostych tablic, nie wszystkie przypadki PHP.

Stan dokumentacji: 2026-10-10.

Wykonane runtime: 8.4.26, 8.5.11; szczegóły w osobnym execution evidence.

## VERIFIED CLAIMS

### if-branches

if interpretuje warunek jako bool; elseif testuje kolejne warunki tylko po niepasujących wcześniejszych gałęziach. W łańcuchu wykona się pierwsza pasująca gałąź, a else jest fallback. (verified; confidence: 0.98)

Evidence: [if/anchor](https://www.php.net/manual/en/control-structures.if.php), [elseif/anchor](https://www.php.net/manual/en/control-structures.elseif.php)


Zalecenie: Pokaż progi od najbardziej szczegółowego do ogólnego, z klamrami.

### comparisons

== porównuje z dopuszczeniem konwersji typów; === wymaga tej samej wartości i typu. != jest luźnym zaprzeczeniem równości, !== ścisłym. <, <=, >, >= nadają się tu do porównywania progów liczbowych. (verified; confidence: 0.98)

Evidence: [comparison/anchor](https://www.php.net/manual/en/language.operators.comparison.php)


Zalecenie: Preferuj ===/!== dla sprawdzania znanego typu; nie przedstawiaj == jako zakazanego.

### assignment

= przypisuje wartość, a == i === porównują. Wartość przypisania może stać się warunkiem, więc przypadkowe = może zmienić zmienną i wybrać inną gałąź. (verified; confidence: 0.98)

Evidence: [comparison/anchor](https://www.php.net/manual/en/language.operators.comparison.php), [logical/anchor](https://www.php.net/manual/en/language.operators.logical.php)


Zalecenie: Wyjaśnij pułapkę w prozie; efekt potwierdza owned probe conditions.

### truthiness

false, 0, 0.0/-0.0, pusty napis, napis "0", pusta tablica i null konwertują do false. "00", "false" i ujemna liczba niezerowa konwertują do true. (verified; confidence: 0.98)

Evidence: [boolean/anchor](https://www.php.net/manual/en/language.types.boolean.php)


Zalecenie: Pokaż "0" kontra test pustego napisu; nie utożsamiaj truthiness z walidacją danych.

### logic

&& wymaga dwóch prawdziwych warunków, || co najmniej jednego, ! neguje bool. &&/|| oraz and/or mają short-circuit. (verified; confidence: 0.98)

Evidence: [logical/anchor](https://www.php.net/manual/en/language.operators.logical.php)


Zalecenie: Krótkie zdefiniowane dane, przykład ochrony przed dzieleniem przez zero.

### precedence

&& ma wyższe pierwszeństwo od =, a and niższe. Analogiczny kontrast dotyczy || i or. Nawiasy pomagają pokazać grupowanie, ale nie gwarantują kolejności ewaluacji dowolnych wyrażeń. (verified; confidence: 0.98)

Evidence: [logical/anchor](https://www.php.net/manual/en/language.operators.logical.php), [precedence/anchor](https://www.php.net/manual/en/language.operators.precedence.php)


Zalecenie: Pokaż kontrast przypisanych bool; nie wprowadzaj xor.

### ternary

Prosty operator warunkowy condition ? a : b wybiera jedną wartość. Nie jest zamiennikiem czytelnej gałęzi z wieloma instrukcjami. (verified; confidence: 0.98)

Evidence: [comparison/ternary](https://www.php.net/manual/en/language.operators.comparison.php)


Zalecenie: Jedna krótka linia, bez zagnieżdżonych ternary.

### switch

switch dopasowuje case luźno. Po pasującym case wykonuje dalsze instrukcje aż do break lub końca switch; brak break może dać fallthrough. (verified; confidence: 0.98)

Evidence: [switch/anchor](https://www.php.net/manual/en/control-structures.switch.php)


Zalecenie: Pokaż napis '1' pasujący do liczby 1, jawne break i default.

### match

match jest dostępny od PHP 8.0, porównuje przez ===, daje wartość, nie ma fallthrough i wymaga dopasowania. Brak pasującego ramienia i default powoduje UnhandledMatchError. (verified; confidence: 0.98)

Evidence: [match/anchor](https://www.php.net/manual/en/control-structures.match.php)


Zalecenie: Krótki kontrast tego samego '1' z case 1; użyj default. Nie przedstawiaj jako nowości 8.4/8.5.

### while

while sprawdza warunek przed każdym obiegiem; body może nie wykonać się ani razu. Zmiana warunku w body nie przerywa go natychmiast bez dodatkowego przepływu. (verified; confidence: 0.98)

Evidence: [while/anchor](https://www.php.net/manual/en/control-structures.while.php)


Zalecenie: Sumowanie 1..10 i jawny przyrost; ostrzeżenie o braku postępu.

### do-while

do-while testuje warunek po body, więc body wykona się co najmniej raz. Po while(condition) wymaga końcowego średnika. (verified; confidence: 0.98)

Evidence: [do-while/anchor](https://www.php.net/manual/en/control-structures.do.while.php)


Zalecenie: Przykład z false pokazuje minimum jedno wykonanie.

### for

for ma inicjalizację raz, test przed iteracją i krok po body; granice < i <= mogą zmienić liczbę obiegów. (verified; confidence: 0.98)

Evidence: [for/anchor](https://www.php.net/manual/en/control-structures.for.php)


Zalecenie: Krótki licznik 0..2 i opis trzech części; brak twierdzeń o popularności.

### foreach

foreach po tablicy ma formę wartościową lub klucz=>wartość; pusta tablica daje zero obiegów. Przykłady nie używają referencji ani modyfikacji iterowanej kolekcji. (verified; confidence: 0.98)

Evidence: [foreach/anchor](https://www.php.net/manual/en/control-structures.foreach.php)


Zalecenie: Link do publicznego PHP Arrays; pokaż nazwy zmiennych wskazujące klucz i wartość.

### break-continue

break bez poziomu kończy bieżącą pętlę lub switch, continue w pętli pomija resztę bieżącego obiegu. W for krok licznika nadal wykona się po continue. Nested levels i continue w switch mają osobne zasady poza zakresem. (verified; confidence: 0.98)

Evidence: [break/anchor](https://www.php.net/manual/en/control-structures.break.php), [continue/anchor](https://www.php.net/manual/en/control-structures.continue.php), [for/anchor](https://www.php.net/manual/en/control-structures.for.php)


Zalecenie: Dwa małe przykłady pętli, bez continue w switch.

### return

Wewnątrz funkcji return kończy tę funkcję i zwraca wartość; wywołujący kontynuuje pracę. return na poziomie pliku ma inne zastosowanie, którego tu nie nauczamy. (verified; confidence: 0.98)

Evidence: [return/anchor](https://www.php.net/manual/en/function.return.php)


Zalecenie: Named function z prostym typem parametru/zwrotu i jawne echo po wywołaniu.

### runtime-scope

Migracja 8.4 zmienia exit i rekurencyjne porównania; 8.5 zmienia niektóre luźne porównania obiektów oraz moment dezaktywacji tick handlers. To nie są użyte tu proste skalarne warunki. Nie wolno stwierdzić, że wszystkie porównania lub wszystkie instrukcje są identyczne w tych wersjach. (verified; confidence: 0.98)

Evidence: [migration84/anchor](https://www.php.net/manual/en/migration84.incompatible.php), [migration85/anchor](https://www.php.net/manual/en/migration85.incompatible.php)


Zalecenie: Wykonaj owned probes i każdy nowy przykład na obu dokładnych runtime; ogranicz wniosek do użytego kodu.

### cli-context

PHP ma tryb CLI do uruchamiania plików poza serwerem WWW; tutorial może używać stałych danych bez formularzy/HTML/zależności. (verified; confidence: 0.98)

Evidence: [cli/anchor](https://www.php.net/manual/en/features.commandline.usage.php)


Zalecenie: Użyj php przyklad.php w inline text; każdy fenced PHP przykład osobno.

### pitfalls

Pusta instrukcja kończąca if średnikiem nie obejmie następującego bloku. Przy elseif kolejność progów wpływa na wybór pierwszej prawdziwej gałęzi. (verified; confidence: 0.98)

Evidence: [if/anchor](https://www.php.net/manual/en/control-structures.if.php), [elseif/anchor](https://www.php.net/manual/en/control-structures.elseif.php)


Zalecenie: Wyjaśnij w prozie, bez osobnego błędnego kodu publikacyjnego; owned probe beginner-pitfalls utrwala dowód.

## CLAIMS REQUIRING CORRECTION

### incorrect-server-only

Legacy etykieta wyłącznie server-side pomija udokumentowany CLI. W nowym materiale wystarczy opisać realny sposób uruchomienia. (verified; confidence: 0.98)

Evidence: [cli/anchor](https://www.php.net/manual/en/features.commandline.usage.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "**PHP i Python to języki, które działają po stronie serwera (server-side).**"

Zalecenie: Usuń dygresję PHP/Python i nie zastępuj jej porównaniem języków.

## OUTDATED / QUESTIONABLE MATERIAL

### unmeasured-popularity

Nie mamy pomiaru potwierdzającego, że for jest najczęstszą pętlą. Manual opisuje zachowanie, nie częstość użycia. (needs-review; confidence: 0.8)

Evidence: [for/anchor](https://www.php.net/manual/en/control-structures.for.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "Najczęściej używana pętla w PHP:"

Zalecenie: Usuń superlatyw.

### unsupported-language-similarity

Przejrzana dokumentacja PHP nie potwierdza prawie identycznej składni w kilku innych językach; porównanie nie jest potrzebne do tego celu. (needs-review; confidence: 0.8)

Evidence: [for/anchor](https://www.php.net/manual/en/control-structures.for.php), [do-while/anchor](https://www.php.net/manual/en/control-structures.do.while.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "**for i do while** mają prawie taką samą konstrukcję w PHP, JavaScript, Pythonie czy C++"

Zalecenie: Nie badaj języków poza PHP dla tej dygresji; pomiń ją.

## CODE ISSUES

### code-if

Legacy if zależy od niezdefiniowanej tu zmiennej; nowy kontrolowany probe definiuje dane i sprawdza kolejność gałęzi. (verified; confidence: 0.98)

Evidence: [if/anchor](https://www.php.net/manual/en/control-structures.if.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "if ($user_validated)"

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: conditions-84, conditions-85.

### code-ternary

Legacy ternary wymaga $active; kontrolowany probe wybiera jawne true. (verified; confidence: 0.98)

Evidence: [comparison/ternary](https://www.php.net/manual/en/language.operators.comparison.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "echo ($active) ? 'Tak' : 'Nie';"

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: choices-84, choices-85.

### code-switch

Legacy switch jest niesamodzielny; probe używa jawnego napisu i sprawdza loose kontra strict. (verified; confidence: 0.98)

Evidence: [switch/anchor](https://www.php.net/manual/en/control-structures.switch.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "switch ($name) {"

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: choices-84, choices-85.

### code-while

Kontrolowany równoważny wzorzec sumowania kończy się wynikiem 55 na obu runtime. (verified; confidence: 0.98)

Evidence: [while/anchor](https://www.php.net/manual/en/control-structures.while.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "while ($i <= 10) {"

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: loops-84, loops-85.

### code-do

Próba odtwarza minimum jedno wykonanie bez zewnętrznych zależności. (verified; confidence: 0.98)

Evidence: [do-while/anchor](https://www.php.net/manual/en/control-structures.do.while.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "} while (false);"

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: loops-84, loops-85.

### code-for

Kontrolowane krótsze granice 0..2, jawny wynik; nie używamy nieskończonej pętli. (verified; confidence: 0.98)

Evidence: [for/anchor](https://www.php.net/manual/en/control-structures.for.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "for ($i = 0; $i < 10; $i++) {"

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: loops-84, loops-85.

### code-foreach

Kontrolowany probe iteruje własną tablicę po kluczach/wartościach i sprawdza pustość. (verified; confidence: 0.98)

Evidence: [foreach/anchor](https://www.php.net/manual/en/control-structures.foreach.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "foreach ($users as $user) {"

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: foreach-84, foreach-85.

### code-return

Probe ma własną zdefiniowaną funkcję i potwierdza kontynuację wywołującego. (verified; confidence: 0.98)

Evidence: [return/anchor](https://www.php.net/manual/en/function.return.php)

SOURCE: 1308-post-60-instrukcje-sterujace-php.md, body: "return zwraca wartość z funkcji i kończy jej wykonywanie."

Zalecenie: Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

Kod: executed-probe; probes: flow-84, flow-85.

## CONDITIONS

- [if-branches](#if-branches): Pokaż progi od najbardziej szczegółowego do ogólnego, z klamrami.
- [comparisons](#comparisons): Preferuj ===/!== dla sprawdzania znanego typu; nie przedstawiaj == jako zakazanego.
- [assignment](#assignment): Wyjaśnij pułapkę w prozie; efekt potwierdza owned probe conditions.
- [truthiness](#truthiness): Pokaż "0" kontra test pustego napisu; nie utożsamiaj truthiness z walidacją danych.
- [pitfalls](#pitfalls): Wyjaśnij w prozie, bez osobnego błędnego kodu publikacyjnego; owned probe beginner-pitfalls utrwala dowód.
- [code-if](#code-if): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

## LOGIC

- [logic](#logic): Krótkie zdefiniowane dane, przykład ochrony przed dzieleniem przez zero.
- [precedence](#precedence): Pokaż kontrast przypisanych bool; nie wprowadzaj xor.
- [ternary](#ternary): Jedna krótka linia, bez zagnieżdżonych ternary.
- [code-ternary](#code-ternary): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

## CHOICE

- [switch](#switch): Pokaż napis '1' pasujący do liczby 1, jawne break i default.
- [match](#match): Krótki kontrast tego samego '1' z case 1; użyj default. Nie przedstawiaj jako nowości 8.4/8.5.
- [code-switch](#code-switch): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

## LOOPS

- [while](#while): Sumowanie 1..10 i jawny przyrost; ostrzeżenie o braku postępu.
- [do-while](#do-while): Przykład z false pokazuje minimum jedno wykonanie.
- [for](#for): Krótki licznik 0..2 i opis trzech części; brak twierdzeń o popularności.
- [foreach](#foreach): Link do publicznego PHP Arrays; pokaż nazwy zmiennych wskazujące klucz i wartość.
- [code-while](#code-while): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.
- [code-do](#code-do): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.
- [code-for](#code-for): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.
- [code-foreach](#code-foreach): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

## FLOW

- [break-continue](#break-continue): Dwa małe przykłady pętli, bez continue w switch.
- [return](#return): Named function z prostym typem parametru/zwrotu i jawne echo po wywołaniu.
- [code-return](#code-return): Nowy Writer przykład musi dostać własny execution evidence; controlled probe nie oznacza uruchomienia legacy.

## PHP VERSION TARGET

- [runtime-scope](#runtime-scope): Wykonaj owned probes i każdy nowy przykład na obu dokładnych runtime; ogranicz wniosek do użytego kodu.

## SOURCE AND SAFETY

- [cli-context](#cli-context): Użyj php przyklad.php w inline text; każdy fenced PHP przykład osobno.
- [incorrect-server-only](#incorrect-server-only): Usuń dygresję PHP/Python i nie zastępuj jej porównaniem języków.
- [unmeasured-popularity](#unmeasured-popularity): Usuń superlatyw.
- [unsupported-language-similarity](#unsupported-language-similarity): Nie badaj języków poza PHP dla tej dygresji; pomiń ją.

## SECURITY / CAUTION NOTES

Brak.

## RECOMMENDED ARTICLE CHANGES

- KEEP: Zachowaj warunki i pętle jako główny zakres; nowa proza i samodzielny kod. [if-branches, while, foreach]
- CORRECT: Dodaj ===, truthiness '0', logikę/precedence i kolejność progów. [comparisons, truthiness, precedence, pitfalls]
- ADD_CAUTION: Dodaj krótki kontrast switch/match z default, bez pełnego kursu match. [switch, match]
- REMOVE_EXAMPLE: Omiń ticks, include/require, niejawne inputs, marketing i porównania międzyjęzykowe. Nie określaj pominiętych konstrukcji jako przestarzałych. [cli-context, unmeasured-popularity, unsupported-language-similarity]
- ADD_CAUTION: Wyniki dotyczą dokładnych runtime/przykładów. Typy obiektowe, exit i ticks poza zakresem. [runtime-scope]

## UNRESOLVED QUESTIONS


## SOURCE REGISTER

- [if — PHP: if - Manual](https://www.php.net/manual/en/control-structures.if.php); language-reference; pobrano 2026-10-10T17:55:25.615Z; evidence: anchor; SHA-256: f2cb6c7ad6371f427b0d316bb967681e9f8f412cef8f904c4de8867261b65d7b
- [elseif — PHP: elseif/else if - Manual](https://www.php.net/manual/en/control-structures.elseif.php); language-reference; pobrano 2026-10-10T17:55:25.626Z; evidence: anchor; SHA-256: b7ffe88b172dd337fe74dbaf6085a9e06fc452a7c3ed00bca7bc52ecf02328ad
- [comparison — PHP: Comparison - Manual](https://www.php.net/manual/en/language.operators.comparison.php); language-reference; pobrano 2026-10-10T17:55:25.647Z; evidence: anchor, ternary; SHA-256: 5198eaa5eabc8d347a2a450365e8eb5757c3650685a18e69108e1855321e54f8
- [boolean — PHP: Booleans - Manual](https://www.php.net/manual/en/language.types.boolean.php); language-reference; pobrano 2026-10-10T17:55:25.634Z; evidence: anchor; SHA-256: 851ab73917025740ca85f4bed118b0b033b58dd05b24e689aa45d78e70f33527
- [logical — PHP: Logic - Manual](https://www.php.net/manual/en/language.operators.logical.php); language-reference; pobrano 2026-10-10T17:55:25.640Z; evidence: anchor; SHA-256: d77cf7af4914cf37669215d2d5f173abfc92e9dcee75f3d6e7011889ed918399
- [precedence — PHP: Operator Precedence - Manual](https://www.php.net/manual/en/language.operators.precedence.php); language-reference; pobrano 2026-10-10T17:55:25.630Z; evidence: anchor; SHA-256: 89d4d2710eb38f1b73e885ea06042981b92c2736559a36801d9b507116429a8f
- [switch — PHP: switch - Manual](https://www.php.net/manual/en/control-structures.switch.php); language-reference; pobrano 2026-10-10T17:55:25.641Z; evidence: anchor; SHA-256: 0f4652f69679768dff3b3ebc91b4a117b08497e5e6c336f15e5f2b72ec4c45a2
- [match — PHP: match - Manual](https://www.php.net/manual/en/control-structures.match.php); language-reference; pobrano 2026-10-10T17:55:25.650Z; evidence: anchor; SHA-256: 7e1696699976ad00a36aa017568f7f774c06c14b5ebc35fc0d46843ad0e67fca
- [while — PHP: while - Manual](https://www.php.net/manual/en/control-structures.while.php); language-reference; pobrano 2026-10-10T17:55:25.617Z; evidence: anchor; SHA-256: 98c9a0ad2b38c7a25664e1e5d408260baa2e74e5a86cd12a1ab60f5264c39250
- [do-while — PHP: do-while - Manual](https://www.php.net/manual/en/control-structures.do.while.php); language-reference; pobrano 2026-10-10T17:55:25.618Z; evidence: anchor; SHA-256: 789812de39b6b7f77535cefa5ea69be01572b07c79ec080b4b220c57264c074c
- [for — PHP: for - Manual](https://www.php.net/manual/en/control-structures.for.php); language-reference; pobrano 2026-10-10T17:55:25.631Z; evidence: anchor; SHA-256: 764042749e4d86e45908361806f62dfd561c3efe43d02b2dd85c9a8a7a887499
- [foreach — PHP: foreach - Manual](https://www.php.net/manual/en/control-structures.foreach.php); language-reference; pobrano 2026-10-10T17:55:25.643Z; evidence: anchor; SHA-256: 6942bf0591808260289101fab8e6260a77e383628a32ef01c56f89e7fb8b7991
- [break — PHP: break - Manual](https://www.php.net/manual/en/control-structures.break.php); language-reference; pobrano 2026-10-10T17:55:25.602Z; evidence: anchor; SHA-256: c2f74b0bfe50a164b8ee8969f4e1fc493410ccb9ee3c6d953c6b2f1324f586d2
- [continue — PHP: continue - Manual](https://www.php.net/manual/en/control-structures.continue.php); language-reference; pobrano 2026-10-10T17:55:25.636Z; evidence: anchor; SHA-256: 98fe0fa2f8816a15e7d0bf1715b589660c9cc5ed093c1dfc4a6dc784296f7a11
- [return — PHP: return - Manual](https://www.php.net/manual/en/function.return.php); language-reference; pobrano 2026-10-10T17:55:25.621Z; evidence: anchor; SHA-256: 617b757c075d58acade259239b2817d7ab200dc8e3b169437d968ef76b2105f5
- [cli — PHP: Usage - Manual](https://www.php.net/manual/en/features.commandline.usage.php); language-reference; pobrano 2026-10-10T17:55:25.622Z; evidence: anchor; SHA-256: 2bd2a2e1975aaf47bb350b07c310a67bdd1abfcf713332faec765ac5475c9545
- [migration84 — PHP: Backward Incompatible Changes - Manual](https://www.php.net/manual/en/migration84.incompatible.php); migration; pobrano 2026-10-10T17:55:25.644Z; evidence: anchor; SHA-256: 880d93dd31fc752a99a8641fed0540c08d3a5dc5321fc48a7d657567ab39e8e2
- [migration85 — PHP: Backward Incompatible Changes - Manual](https://www.php.net/manual/en/migration85.incompatible.php); migration; pobrano 2026-10-10T17:55:25.639Z; evidence: anchor; SHA-256: f97f3a95c03a9e2793914de131ec4da0861969d91ddd284e670911e95012aed7

## LIMITATIONS

- Role Researcher, Writer i Critic będą rozdzielone funkcjonalnie w tej samej sesji, nie niezależni dostawcy/modelle.
- 18 oficjalnych stron, krótkie anchors i hashe bajtów; user notes wyłączone. Manual może być aktualizowany po dacie snapshotu.
- Źródła PHP nie dowodzą międzyjęzykowych analogii ani popularności for; Writer ma usunąć te zbędne twierdzenia, a nie oznaczać ich jako zweryfikowane.
- Legacy code nie wykonano: if/ternary/switch mają brakujące inputs; ticks wymaga callbacku, include/require plików. Uruchomiono wyłącznie osiem własnych controlled probes na każdym runtime.
- Pominięte ticks/include/require nie są nazwane przestarzałymi. Inne konteksty return, foreach z referencjami, zagnieżdżone poziomy break/continue i obiekty poza zakresem.

## WRITER HANDOFF

Założona wersja: PHP 8.4–8.5; rzeczywiste controlled probes: 8.4.26 i 8.5.11. Zakres skalarów i prostych tablic, nie wszystkie przypadki PHP.

### Zachowaj

- Warunki, cztery pętle i proste sterowanie przepływem. [if-branches, while, do-while, for, foreach, break-continue, return]

### Popraw

- Każdy przykład samodzielny, wynik jawny, zwięzłe kontrasty ===/==, truthiness i switch/match. [comparisons, truthiness, switch, match]

### Nie powielaj

- Marketing, twierdzenia o najczęstszej pętli, analogie do Pythona i zaawansowane dygresje. [unmeasured-popularity, unsupported-language-similarity, runtime-scope]

### Ostrożność

- Truthiness nie sprawdza poprawności danych; używamy własnych stałych bez danych z żądań. No promises about all versions or objects. [truthiness, cli-context, runtime-scope]

### Zweryfikowane przykłady

- code-if: executed-probe; conditions-84, conditions-85
- code-ternary: executed-probe; choices-84, choices-85
- code-switch: executed-probe; choices-84, choices-85
- code-while: executed-probe; loops-84, loops-85
- code-do: executed-probe; loops-84, loops-85
- code-for: executed-probe; loops-84, loops-85
- code-foreach: executed-probe; foreach-84, foreach-85
- code-return: executed-probe; flow-84, flow-85

STOP — następny krok wymaga decyzji człowieka.
