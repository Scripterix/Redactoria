# Researcher 0.1 — Tablice PHP — Research Packet do zatwierdzonego połączenia części I i II

## RESEARCH SCOPE

Research Packet, nie artykuł ani zatwierdzenie publikacji. Dokładnie dwa pełne materiały SOURCE.

- 1324-post-61-tablice-w-php-czesc-1.md (1324)
- 1356-post-62-php-tablice-czesc-ii.md (1356)

Tryb: imported-session-analysis; model: Codex current session — Researcher 0.1.
Request SHA-256: 9fe6e26a5da722bccc0a74afc43ead40525932cb1342330deb19fde1f844fa64

## PHP VERSION TARGET

PHP 8.4–8.5 na aktualnych wydaniach poprawkowych; zakres redakcyjny proponowany na podstawie aktywnego wsparcia. Ogólne objaśnienia PHP 8.x z wyraźnymi uwagami 8.1/8.3/8.5. Lokalne kontrolowane próby wykonane wyłącznie na PHP 8.2.4; brak macierzy runtime 8.4/8.5.

Stan dokumentacji: 2026-10-09.

Próby wykonano lokalnie na PHP 8.2.4; nie oznacza to uruchomienia na docelowych wersjach.

## VERIFIED CLAIMS

### php-lifecycle

Na 2026-10-09 stabilne wspierane gałęzie to PHP 8.2, 8.3, 8.4 i 8.5. PHP 8.4 i 8.5 mają aktywne wsparcie; 8.2 i 8.3 wyłącznie poprawki bezpieczeństwa. Wsparcie bezpieczeństwa 8.2 kończy się 2026-12-31, 8.3: 2027-12-31, 8.4: 2028-12-31, 8.5: 2029-12-31. (verified; confidence: 1)

Evidence: [php-support/branches](https://www.php.net/supported-versions.php)


Zalecenie: Przyjąć redakcyjnie PHP 8.4–8.5, zawsze aktualne wydanie poprawkowe. Nie rekomendować lokalnego 8.2.4 jako środowiska docelowego.

### array-model

PHP array jest uporządkowaną mapą, nie osobnymi typami dla tablicy indeksowanej i asocjacyjnej. Jedna tablica może mieszać klucze int/string i zawierać wartości dowolnego typu, również inne tablice. (verified; confidence: 0.99)

Evidence: [arrays/definition](https://www.php.net/manual/en/language.types.array.php), [arrays/keys](https://www.php.net/manual/en/language.types.array.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "Tablica w PHP to uporządkowana mapa"

Zalecenie: Zachować definicję, przykłady mixed_data, matrix i users; odróżnić rodzaj użycia od osobnego typu.

### array-syntax

array(...) oraz [...] są poprawnymi zapisami tablic w aktualnym PHP; długa składnia nie jest przez sam fakt użycia przestarzała. (verified; confidence: 0.99)

Evidence: [arrays/definition](https://www.php.net/manual/en/language.types.array.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "$fruits = array(\"jabłko\", \"banan\", \"pomarańcza\");"

Zalecenie: Ujednolicić stylistycznie do []; nie nazywać array() usuniętym ani deprecated.

### key-casts

Klucze 0 i "0" oznaczają ten sam klucz int 0. true staje się int 1, false int 0, null pustym stringiem "", a 1.5 int 1. Ostatnie przypisanie do tego samego klucza zastępuje wcześniejszą wartość; "08" pozostaje stringiem, inaczej niż "8". (verified; confidence: 0.99)

Evidence: [arrays/keys](https://www.php.net/manual/en/language.types.array.php)


Zalecenie: Dodać mały przykład kolizji kluczy; nie używać float jako praktycznego klucza.

### float-key-deprecation

Od PHP 8.1 niejawna konwersja float do int z utratą precyzji, także w kluczu tablicy, jest deprecated. Dla 1.5 następuje obcięcie do 1 i diagnostyka E_DEPRECATED; nie należy przedstawiać tego jako cichej zalecanej konwersji. (verified; confidence: 0.99)

Evidence: [migration81/float-keys](https://www.php.net/manual/en/migration81.deprecated.php), [arrays/keys](https://www.php.net/manual/en/language.types.array.php)


Zalecenie: Zaznaczyć ostrzeżenie wersyjne i używać int/string świadomie.

### append-key-history

Dopisywanie [] dobiera następny klucz całkowity według historii użytych indeksów; usunięcie najwyższego elementu przez unset nie cofa licznika. Nie należy utożsamiać count($a) z następnym indeksem. (verified; confidence: 0.99)

Evidence: [arrays/append](https://www.php.net/manual/en/language.types.array.php), [arrays/keys](https://www.php.net/manual/en/language.types.array.php)


Zalecenie: Po ręcznie nadanym kluczu 10 wyjaśnić dziury oraz kolejny klucz; klucz to nie pozycja.

### negative-append-version

Po przypisaniu ujemnego klucza n do początkowo pustej tablicy dopisanie [] od PHP 8.3 używa n+1; wcześniej używało 0. Kontrolowana próba przypisania -5 na 8.2.4 dała klucz 0, więc jej wyniku nie wolno przenieść na 8.4/8.5. (verified; confidence: 0.99)

Evidence: [arrays/append](https://www.php.net/manual/en/language.types.array.php)


Zalecenie: Ograniczyć początkujący przykład do nieujemnych kluczy, różnicę opisać w uwadze wersyjnej.

### missing-warning

Odczyt nieistniejącego klucza tablicy w PHP 8 emituje E_WARNING i daje null. Opis Notice: Undefined index odnosi się do starszego zachowania; ?? pozwala odczytać fallback bez ostrzeżenia o brakującym kluczu. (verified; confidence: 0.99)

Evidence: [arrays/missing](https://www.php.net/manual/en/language.types.array.php), [migration80/warnings](https://www.php.net/manual/en/migration80.incompatible.php), [coalesce/fallback](https://www.php.net/manual/en/language.operators.comparison.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "Notice: Undefined index"

Zalecenie: Poprawić FAQ i komentarz; inicjalizować $array przed demonstracją.

### presence-comparison

Dla brakującego klucza: isset=false, array_key_exists=false, ?? wybiera fallback. Dla istniejącego klucza o wartości null: isset=false, array_key_exists=true, ?? wybiera fallback. Dla wartości 0, "0", false i "": isset=true, klucz istnieje, ?? zachowuje wartość. (verified; confidence: 0.99)

Evidence: [isset/presence](https://www.php.net/manual/en/function.isset.php), [key-exists/null](https://www.php.net/manual/en/function.array-key-exists.php), [coalesce/fallback](https://www.php.net/manual/en/language.operators.comparison.php)


Zalecenie: Dodać tabelę brak/null/0/false/""; dobierać narzędzie do pytania, nie zamieniać ich bez objaśnienia.

### empty-is-not-existence

empty zwraca true dla braku elementu i wartości falsey, m.in. null, false, 0, "0" oraz pustego stringa. Nie jest testem samego istnienia klucza ani walidatorem pola tekstowego. (verified; confidence: 0.99)

Evidence: [empty/falsey](https://www.php.net/manual/en/function.empty.php)


Zalecenie: W formularzu jawnie ustalić, czy string "0" jest akceptowany; nie zastępować sprawdzenia typu przez empty.

### key-exists-null-argument

PHP 8.5 deprecates przekazywanie null jako argumentu key funkcji array_key_exists; dla klucza pustego stringa użyć "". To osobna kwestia od wartości null pod istniejącym kluczem oraz od konwersji $array[null] do klucza "". (verified; confidence: 0.99)

Evidence: [key-exists/null](https://www.php.net/manual/en/function.array-key-exists.php), [arrays/keys](https://www.php.net/manual/en/language.types.array.php)


Zalecenie: Tabelę presence oprzeć na nazwanym kluczu ze stanem null, nie na array_key_exists(null, ...).

### mutating-operations

[] przypisuje nowy element. array_push i array_unshift mutują wejście i zwracają liczbę elementów po operacji, nie nową tablicę. unshift przesuwa i reindeksuje numeryczne klucze od 0, zachowując nazwane klucze. (verified; confidence: 0.99)

Evidence: [push/size](https://www.php.net/manual/en/function.array-push.php), [unshift/numeric](https://www.php.net/manual/en/function.array-unshift.php), [arrays/append](https://www.php.net/manual/en/language.types.array.php)


Zalecenie: Zachować dodawanie; przy każdej funkcji rozdzielić efekt na tablicy od return value.

### removal-operations

unset usuwa element bez automatycznego reindeksowania. array_pop i array_shift mutują wejście i zwracają usuniętą wartość (dla pustej tablicy null); shift reindeksuje klucze numeryczne, zachowując stringowe. array_splice używa offsetu pozycyjnego, reindeksuje klucze numeryczne i zwraca usunięty wycinek. (verified; confidence: 0.99)

Evidence: [arrays/definition](https://www.php.net/manual/en/language.types.array.php), [pop/last](https://www.php.net/manual/en/function.array-pop.php), [shift/numeric](https://www.php.net/manual/en/function.array-shift.php), [splice/numeric](https://www.php.net/manual/en/function.array-splice.php)


Zalecenie: Pokazać stan po każdym kroku; odróżnić unset($a[klucz]) od splice($a, pozycja, długość).

### foreach-contract

foreach ($a as $value) udostępnia wartości; foreach ($a as $key => $value) także rzeczywiste klucze w kolejności iteracji. Pętla po referencji &$value może zmieniać wartości i zostawia referencję do ostatniego elementu; po niej trzeba świadomie przerwać ją przez unset($value). (verified; confidence: 0.99)

Evidence: [foreach/reference](https://www.php.net/manual/en/control-structures.foreach.php)


Zalecenie: Zachować pętle po wartości; referencje tylko jako krótka uwaga advanced, nie domyślny wzorzec.

### merge-comparison

array_merge zwraca nową tablicę: późniejsza wartość pod tym samym kluczem string wygrywa, elementy z kluczami int są dopisywane i reindeksowane od 0. Operator + zachowuje lewą wartość przy kolizji każdego klucza, bez reindeksowania. array_replace zastępuje kolidujące wartości z prawej dla kluczy int i string, bez reindeksowania; nie jest rekurencyjny. (verified; confidence: 0.99)

Evidence: [merge/numeric](https://www.php.net/manual/en/function.array-merge.php), [union/left](https://www.php.net/manual/en/language.operators.array.php), [replace/right](https://www.php.net/manual/en/function.array-replace.php)


Zalecenie: Dodać jedno porównanie trzech operacji na tej samej parze danych; nie traktować ich jako synonimów.

### sorting-contract

sort/rsort sortują po wartościach rosnąco/malejąco i nadają nowe klucze int 0..n-1. asort/arsort sortują po wartościach, zachowując powiązanie klucz–wartość. ksort/krsort sortują po kluczach i zachowują powiązania. Wszystkie sześć mutuje wejściową tablicę i zwraca true, a nie nową tablicę. (verified; confidence: 0.99)

Evidence: [sorting/mutates](https://www.php.net/manual/en/array.sorting.php), [sort/return](https://www.php.net/manual/en/function.sort.php), [rsort/return](https://www.php.net/manual/en/function.rsort.php), [asort/return](https://www.php.net/manual/en/function.asort.php), [arsort/return](https://www.php.net/manual/en/function.arsort.php), [ksort/return](https://www.php.net/manual/en/function.ksort.php), [krsort/return](https://www.php.net/manual/en/function.krsort.php)


Zalecenie: Dodać zwartą tabelę sześciu funkcji z kolumnami: kierunek, po czym, klucze, mutacja, return.

### sorting-version-caution

Równe elementy zachowują pierwotną kolejność od PHP 8.0. W PHP 8.2 typ zwracany sześciu funkcji doprecyzowano z bool do true; ksort/krsort przy SORT_REGULAR zmieniły porównywanie kluczy będących numerycznymi stringami. (verified; confidence: 0.99)

Evidence: [sorting/mutates](https://www.php.net/manual/en/array.sorting.php), [sort/return](https://www.php.net/manual/en/function.sort.php), [rsort/return](https://www.php.net/manual/en/function.rsort.php), [asort/return](https://www.php.net/manual/en/function.asort.php), [arsort/return](https://www.php.net/manual/en/function.arsort.php), [ksort/return](https://www.php.net/manual/en/function.ksort.php), [krsort/return](https://www.php.net/manual/en/function.krsort.php)


Zalecenie: Początkujące przykłady oprzeć na jednorodnych danych; nie obiecywać polskiej kolejności leksykograficznej na podstawie sort z domyślnymi flagami.

### map-contract

array_map zwraca tablicę wyników callbacku. Dla dokładnie jednej wejściowej tablicy zachowuje klucze, dla wielu tworzy sekwencyjne klucze int. Przykład podwajania 1..5 daje [2,4,6,8,10]. (verified; confidence: 0.99)

Evidence: [map/keys](https://www.php.net/manual/en/function.array-map.php)


Zalecenie: Zachować podwajanie i dopisać zasadę kluczy, bez rozwijania wszystkich wariantów callbacku.

### filter-contract

array_filter zwraca wybrane elementy z zachowaniem kluczy; wynik [1=>2,3=>4] dla parzystych z [1,2,3,4,5] jest poprawny, nie jest błędem eksportu. Bez callbacku usuwa wartości empty/falsey. Jeśli potrzebna jest lista o indeksach ciągłych, wynik można przepuścić przez array_values. (verified; confidence: 0.99)

Evidence: [filter/keys](https://www.php.net/manual/en/function.array-filter.php), [empty/falsey](https://www.php.net/manual/en/function.empty.php)


Zalecenie: Zachować widoczne klucze 1 i 3; nie reindeksować niejawnie w objaśnieniu.

### reduce-contract

array_reduce składa elementy do jednego akumulatora. Dla sumowania 1..5 i initial=0 daje 15; dla pustej tablicy z initial zwraca initial, bez initial zwraca null. (verified; confidence: 0.99)

Evidence: [reduce/result](https://www.php.net/manual/en/function.array-reduce.php)


Zalecenie: Przenieść kod sumy bezpośrednio pod array_reduce i wyjaśnić początkowe 0.

### count-values-contract

array_count_values liczy częstości wartości int/string, używając ich jako kluczy wyniku. Dla elementów innych typów zgłasza E_WARNING. Nie wykonuje callbacku redukującego ani nie zwraca sumy 15. (verified; confidence: 0.99)

Evidence: [count-values/types](https://www.php.net/manual/en/function.array-count-values.php)


Zalecenie: Oddzielić przykład liczenia owoców od sumowania; zaznaczyć ograniczenie typów.

### extract-contract

extract importuje zmienne do bieżącej tablicy symboli; domyślny EXTR_OVERWRITE nadpisuje istniejące zmienne o kolidujących nazwach. Oficjalny manual przestrzega przed użyciem z niezaufanymi danymi. (verified; confidence: 0.99)

Evidence: [extract/untrusted](https://www.php.net/manual/en/function.extract.php)


Zalecenie: Ograniczyć do advanced/caution na zaufanych stałych danych lub pominąć z głównej ścieżki; nie uczyć extract($_POST).

### post-and-validation

$_POST jest tablicą danych formularza dla application/x-www-form-urlencoded lub multipart/form-data, nie automatycznym parserem JSON. Składnia formularzy może utworzyć zagnieżdżone tablice, więc $_POST["email"] ?? "" nie gwarantuje stringa. filter_var z FILTER_VALIDATE_EMAIL waliduje wartość; FILTER_DEFAULT nie filtruje danych. (verified; confidence: 0.99)

Evidence: [post/forms](https://www.php.net/manual/en/reserved.variables.post.php), [external/array-input](https://www.php.net/manual/en/language.variables.external.php), [filter-var/validation](https://www.php.net/manual/en/function.filter-var.php)


Zalecenie: Pokazać oczekiwane klucze i is_string przed walidacją; sprawdzać wynik walidacji jawnie, nie mylić jej z sanitization lub autoryzacją.

### html-output-boundary

htmlspecialchars zamienia znaki specjalne do reprezentacji HTML i może służyć do escape tekstu oraz poprawnie cytowanych atrybutów przy zgodnym kodowaniu. Nie jest uniwersalnym oczyszczaniem danych ani zabezpieczeniem kontekstu JavaScript, SQL lub dowolnego URL. (verified; confidence: 0.99)

Evidence: [escape/html](https://www.php.net/manual/en/function.htmlspecialchars.php)


Zalecenie: Przy demonstracyjnym wyświetleniu użyć jawnych ENT_QUOTES | ENT_SUBSTITUTE i UTF-8; walidacja danych wejściowych jest oddzielnym krokiem.

### membership-types

in_array porównuje luźno, jeśli strict nie jest ustawione; parametr true włącza także porównanie typów. Obecny przykład z samymi stringami jest poprawny, lecz nie uzasadnia bezwarunkowego uogólnienia na dane mieszane. (verified; confidence: 0.99)

Evidence: [in-array/strict](https://www.php.net/manual/en/function.in-array.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "in_array(\"admin\", $data)"

Zalecenie: W przykładzie edukacyjnym wybrać in_array("admin", $data, true) i krótko wyjaśnić parametr.

## CLAIMS REQUIRING CORRECTION

### correct-multiple-values

Zdanie o przechowywaniu wielu wartości pod jednym kluczem jest mylące: klucz wskazuje jedną wartość; tą wartością może być zagnieżdżona tablica, a ponowne przypisanie zastępuje poprzednią. (verified; confidence: 0.99)

Evidence: [arrays/keys](https://www.php.net/manual/en/language.types.array.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "przechowywanie wielu wartości pod jednym kluczem"

Zalecenie: Zastąpić zdanie opisem jednej wartości na klucz i osobnym przykładem tablicy zagnieżdżonej.

### correct-zero-index

Klucze tablicy nie muszą zaczynać się od zera ani być ciągłe. Zero jest początkiem prostej listy utworzonej bez jawnych kluczy; zdanie w SOURCE zbyt szeroko opisuje wszystkie tablice indeksowane. (verified; confidence: 0.99)

Evidence: [arrays/keys](https://www.php.net/manual/en/language.types.array.php), [arrays/append](https://www.php.net/manual/en/language.types.array.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "Tablice indeksowane używają liczbowych indeksów, które automatycznie zaczynają się od 0:"
SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "$numbers[10] = 100; // Dodaje na pozycji 10"

Zalecenie: Zawęzić twierdzenie do listy; mówić o kluczu 10, nie dziesiątej pozycji.

### correct-warning

FAQ i komentarz o Notice nie pasują do PHP 8: odczyt brakującego klucza jest E_WARNING. Brak wcześniejszej inicjalizacji $array w wyizolowanym fragmencie dodatkowo zaciemnia przykład. (verified; confidence: 0.99)

Evidence: [migration80/warnings](https://www.php.net/manual/en/migration80.incompatible.php), [arrays/missing](https://www.php.net/manual/en/language.types.array.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "// BŁĄD - może generować Notice"
SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "Notice: Undefined index"

Zalecenie: Zainicjalizować $array = []; pokazać ostrzeżenie kontrolowanie lub tylko wyjaśnić, następnie ?? i test obecności.

### correct-reduce-placement

Po nagłówku array_count_values umieszczono kod $suma = array_reduce(..., 0) i wynik 15. To właściwy przykład reduce, a nie count_values; oddzielny licznik owoców poniżej jest poprawnym count_values. (verified; confidence: 0.99)

Evidence: [reduce/result](https://www.php.net/manual/en/function.array-reduce.php), [count-values/types](https://www.php.net/manual/en/function.array-count-values.php)

SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "### array_count_values()"
SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "$suma = array_reduce($liczby, function($carry, $item) {"

Zalecenie: Przenieść sumę pod array_reduce; zachować osobno licznik produktów i jego wynik 2/2/1.

## OUTDATED / QUESTIONABLE MATERIAL

### dated-version-framing

Adnotacja „od PHP 5.4” jest historyczną ramą dla krótkiej składni, nie uzasadnieniem traktowania array() jako niepoprawnego. SOURCE nie określa aktualnego celu PHP 8.4–8.5 ani różnic zachowania zależnych od wersji. (verified; confidence: 0.99)

Evidence: [arrays/definition](https://www.php.net/manual/en/language.types.array.php), [php-support/branches](https://www.php.net/supported-versions.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "// Alternatywna składnia (od PHP 5.4)"

Zalecenie: Wprowadzić jawny target wersji na początku; historię składni skrócić do opcjonalnej uwagi bez udawania pełnego audytu wersji 5.x.

### hidden-state

Wynik łączenia owoców w części II jest spójny z wcześniejszym rsort($owoce); nie jest sam w sobie błędny. Wyrwany blok array_merge zakłada jednak zmienną i stan z poprzednich bloków. (verified; confidence: 0.99)

Evidence: [rsort/return](https://www.php.net/manual/en/function.rsort.php), [merge/numeric](https://www.php.net/manual/en/function.array-merge.php)

SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "rsort($owoce);"
SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "$wszystko = array_merge($owoce, $warzywa);"

Zalecenie: Każdy blok inicjalizować samodzielnie albo jawnie oznaczyć wspólny scenariusz, bez przypisywania tej różnicy funkcji merge.

### form-skeleton

processFormData($form_data) jest wywołane, lecz jego implementacji nie ma w obu przekazanych artykułach. Nie potwierdzono kompletnego przebiegu formularza ani reguł domenowych; fragment jest szkieletem, nie gotowym handlerem. (needs-review; confidence: 0.98)

Evidence: [post/forms](https://www.php.net/manual/en/reserved.variables.post.php), [filter-var/validation](https://www.php.net/manual/en/function.filter-var.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "processFormData($form_data);"

Zalecenie: Oznaczyć jako pseudokod/szkic lub usunąć wywołanie z samodzielnego przykładu. Ustalenie pełnego handlera wymaga osobnej decyzji, nie rozbudowy tego tutorialu.

### mixed-markdown-php

Część II przeplata otwierające tagi PHP, Markdown i wyniki bez wydzielonych bloków kodu. Nie należy uruchamiać całego pliku .md jako skryptu; kompletność finalnych bloków po redakcji nie została jeszcze sprawdzona. (needs-review; confidence: 1)

Evidence: [map/keys](https://www.php.net/manual/en/function.array-map.php), [reduce/result](https://www.php.net/manual/en/function.array-reduce.php)

SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "echo $role; // wypisze: admin\n\n**Zalety:**"

Zalecenie: Przyszły Writer ma wydzielić samodzielne fenced code blocks, potem zlecić ich wykonanie na docelowym runtime. Nie zastępować tego uruchomieniem SOURCE.

## CODE ISSUES

### code-key-extension

Kontrolowane przypisania 0/"0"/true/null/1.5 na PHP 8.2.4 dały końcowe klucze [0,1,""] i E_DEPRECATED dla 1.5. Po unset klucza 10 dopisano 11. Ujemny klucz -5 przypisany pustej tablicy dał po [] klucz 0; dla 8.4–8.5 manual przewiduje -4, którego tutaj nie wykonano. (verified; confidence: 0.99)

Evidence: [arrays/definition](https://www.php.net/manual/en/language.types.array.php), [migration81/float-keys](https://www.php.net/manual/en/migration81.deprecated.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "$numbers[10] = 100; // Dodaje na pozycji 10"

Zalecenie: Użyć próby jako sprawdzenia pułapek; nie podpisywać wyniku ujemnego dopisania jako wyniku PHP 8.4. To rozszerzenie przykładu, nie wykonanie całego SOURCE.

Kod: executed-probe; probes: keys.

### code-presence-matrix

Kontrolowana próba na 8.2.4 potwierdziła rozdział brak/null/zero/false/pusty string oraz E_WARNING przy bezpośrednim odczycie brakującego klucza. Wywołania ?? i empty nie dały ostrzeżenia o braku klucza. (verified; confidence: 0.99)

Evidence: [isset/presence](https://www.php.net/manual/en/function.isset.php), [key-exists/null](https://www.php.net/manual/en/function.array-key-exists.php), [coalesce/fallback](https://www.php.net/manual/en/language.operators.comparison.php), [empty/falsey](https://www.php.net/manual/en/function.empty.php), [migration80/warnings](https://www.php.net/manual/en/migration80.incompatible.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "echo $array[\"key\"] ?? \"domyślna wartość\";"

Zalecenie: Zachować tabelę wyników probes/presence; brakującą zmienną $array zastąpić zainicjalizowaną tablicą.

Kod: executed-probe; probes: presence.

### code-removal-sequence

Kontrolowane odtworzenie sekwencji z I na 8.2.4: pop zwraca 5, shift zwraca 1, stan po shift to [2,3,4], po unset(klucz1) {0:2,2:4}, po splice(offset1,length2) zostaje [2] i wycinek [4]. Splice nie operuje tu na numerze klucza. (verified; confidence: 0.99)

Evidence: [pop/last](https://www.php.net/manual/en/function.array-pop.php), [shift/numeric](https://www.php.net/manual/en/function.array-shift.php), [splice/numeric](https://www.php.net/manual/en/function.array-splice.php), [arrays/definition](https://www.php.net/manual/en/language.types.array.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "$last = array_pop($numbers);"
SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "unset($numbers[1]);"
SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "array_splice($numbers, 1, 2);"

Zalecenie: Zachować scenariusz, ale pokazać pośrednie stany. Dodawanie push/unshift przetestowano w skróconej reprodukcji, nie w identycznym pełnym bloku owoców.

Kod: executed-probe; probes: operations.

### code-foreach

Kontrolowana próba na 8.2.4 zachowała pary ['x',1] i [4,2], a pętla referencyjna podwoiła wartości. unset($value) przerwał referencję przed dalszym przypisaniem. Oryginalne pętle po wartości oceniono dokumentacyjnie; nie wykonywano całego artykułu. (verified; confidence: 0.99)

Evidence: [foreach/reference](https://www.php.net/manual/en/control-structures.foreach.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "foreach ($data as $key => $value) {"

Zalecenie: Zachować zwykły foreach; referencyjną reprodukcję traktować tylko jako materiał ostrzegawczy.

Kod: executed-probe; probes: iteration.

### code-merge-and-sort

Kontrolowane próby na 8.2.4 potwierdziły kontrasty merge/union/replace oraz mutację, klucze i return=true sześciu sortowań. Dla zachowanej asocjacji kolejność jest zapisana osobno w keyOrder: sortowanie kluczy obiektu w stableJson nie jest kolejnością iteracji PHP. (verified; confidence: 0.99)

Evidence: [merge/numeric](https://www.php.net/manual/en/function.array-merge.php), [union/left](https://www.php.net/manual/en/language.operators.array.php), [replace/right](https://www.php.net/manual/en/function.array-replace.php), [sorting/mutates](https://www.php.net/manual/en/array.sorting.php), [sort/return](https://www.php.net/manual/en/function.sort.php), [rsort/return](https://www.php.net/manual/en/function.rsort.php), [asort/return](https://www.php.net/manual/en/function.asort.php), [arsort/return](https://www.php.net/manual/en/function.arsort.php), [ksort/return](https://www.php.net/manual/en/function.ksort.php), [krsort/return](https://www.php.net/manual/en/function.krsort.php)

SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "sort($owoce);"
SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "$wszystko = array_merge($owoce, $warzywa);"

Zalecenie: Dodać porównania oparte na kontrolowanych danych; kopiować wejście przed każdym sortowaniem. Nie wyciągać kolejności z uporządkowanego alfabetycznie obiektu JSON.

Kod: executed-probe; probes: merge, sorting.

### code-functional

Kontrolowane odtworzenie rachunku na 8.2.4 potwierdziło map=[2,4,6,8,10], filter={1:2,3:4}, reduce=15 i częstości owoców 2/2/1. Zastosowano równoważne stałe dane i callbacki w wydzielonej próbie; nie wykonano Markdownu jako PHP. (verified; confidence: 0.99)

Evidence: [map/keys](https://www.php.net/manual/en/function.array-map.php), [filter/keys](https://www.php.net/manual/en/function.array-filter.php), [reduce/result](https://www.php.net/manual/en/function.array-reduce.php), [count-values/types](https://www.php.net/manual/en/function.array-count-values.php)

SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "$podwojone = array_map(function($n) {"
SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "$parzyste = array_filter($liczby, function($n) {"
SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "$suma = array_reduce($liczby, function($carry, $item) {"

Zalecenie: Zachować wyniki, inicjalizować $liczby w każdym samodzielnym przykładzie; przenieść sumę pod poprawny nagłówek.

Kod: executed-probe; probes: functional.

### code-extract-overwrite

Kontrolowana próba na 8.2.4 nadpisała lokalną zmienną name przez extract na specjalnie przygotowanej tablicy. To demonstracja ryzyka domyślnego flagowania, nie przykład do zalecanego przetwarzania HTTP. (verified; confidence: 0.99)

Evidence: [extract/untrusted](https://www.php.net/manual/en/function.extract.php)

SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "extract($user);"

Zalecenie: Ewentualne extract wyłącznie w ramce advanced/caution na zaufanych danych; domyślnie preferować dostęp po kluczu.

Kod: executed-probe; probes: extract.

### code-menu-missing-active

Dane submenu nie mają klucza active, a generateMenu czyta go bez zabezpieczenia. Kontrolowana reprodukcja dostępu na 8.2.4 zgłosiła Undefined array key "active". SOURCE jedynie definiuje funkcję, więc ostrzeżenie dotyczy jej przyszłego wywołania na tym submenu, nie samej definicji. (verified; confidence: 0.99)

Evidence: [arrays/missing](https://www.php.net/manual/en/language.types.array.php), [coalesce/fallback](https://www.php.net/manual/en/language.operators.comparison.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "$class = $item[\"active\"] ? \"active\" : \"\";"
SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "[\"title\" => \"Tworzenie stron\", \"url\" => \"/services/web-design\"]"

Zalecenie: Ustalić jednolity kontrakt menu lub użyć $item["active"] ?? false. Nie przedstawiać definicji funkcji jako faktycznie wywołanej.

Kod: executed-probe; probes: forms-menu.

## ARRAY KEY BEHAVIOR

- [key-casts](#key-casts): Dodać mały przykład kolizji kluczy; nie używać float jako praktycznego klucza.
- [float-key-deprecation](#float-key-deprecation): Zaznaczyć ostrzeżenie wersyjne i używać int/string świadomie.
- [append-key-history](#append-key-history): Po ręcznie nadanym kluczu 10 wyjaśnić dziury oraz kolejny klucz; klucz to nie pozycja.
- [negative-append-version](#negative-append-version): Ograniczyć początkujący przykład do nieujemnych kluczy, różnicę opisać w uwadze wersyjnej.
- [key-exists-null-argument](#key-exists-null-argument): Tabelę presence oprzeć na nazwanym kluczu ze stanem null, nie na array_key_exists(null, ...).
- [correct-zero-index](#correct-zero-index): Zawęzić twierdzenie do listy; mówić o kluczu 10, nie dziesiątej pozycji.
- [code-key-extension](#code-key-extension): Użyć próby jako sprawdzenia pułapek; nie podpisywać wyniku ujemnego dopisania jako wyniku PHP 8.4. To rozszerzenie przykładu, nie wykonanie całego SOURCE.

## NULL / MISSING KEY BEHAVIOR

- [missing-warning](#missing-warning): Poprawić FAQ i komentarz; inicjalizować $array przed demonstracją.
- [presence-comparison](#presence-comparison): Dodać tabelę brak/null/0/false/""; dobierać narzędzie do pytania, nie zamieniać ich bez objaśnienia.
- [empty-is-not-existence](#empty-is-not-existence): W formularzu jawnie ustalić, czy string "0" jest akceptowany; nie zastępować sprawdzenia typu przez empty.
- [key-exists-null-argument](#key-exists-null-argument): Tabelę presence oprzeć na nazwanym kluczu ze stanem null, nie na array_key_exists(null, ...).
- [membership-types](#membership-types): W przykładzie edukacyjnym wybrać in_array("admin", $data, true) i krótko wyjaśnić parametr.
- [correct-warning](#correct-warning): Zainicjalizować $array = []; pokazać ostrzeżenie kontrolowanie lub tylko wyjaśnić, następnie ?? i test obecności.
- [code-presence-matrix](#code-presence-matrix): Zachować tabelę wyników probes/presence; brakującą zmienną $array zastąpić zainicjalizowaną tablicą.
- [code-menu-missing-active](#code-menu-missing-active): Ustalić jednolity kontrakt menu lub użyć $item["active"] ?? false. Nie przedstawiać definicji funkcji jako faktycznie wywołanej.

## ARRAY OPERATIONS

- [array-model](#array-model): Zachować definicję, przykłady mixed_data, matrix i users; odróżnić rodzaj użycia od osobnego typu.
- [array-syntax](#array-syntax): Ujednolicić stylistycznie do []; nie nazywać array() usuniętym ani deprecated.
- [append-key-history](#append-key-history): Po ręcznie nadanym kluczu 10 wyjaśnić dziury oraz kolejny klucz; klucz to nie pozycja.
- [mutating-operations](#mutating-operations): Zachować dodawanie; przy każdej funkcji rozdzielić efekt na tablicy od return value.
- [removal-operations](#removal-operations): Pokazać stan po każdym kroku; odróżnić unset($a[klucz]) od splice($a, pozycja, długość).
- [foreach-contract](#foreach-contract): Zachować pętle po wartości; referencje tylko jako krótka uwaga advanced, nie domyślny wzorzec.
- [merge-comparison](#merge-comparison): Dodać jedno porównanie trzech operacji na tej samej parze danych; nie traktować ich jako synonimów.
- [correct-multiple-values](#correct-multiple-values): Zastąpić zdanie opisem jednej wartości na klucz i osobnym przykładem tablicy zagnieżdżonej.
- [hidden-state](#hidden-state): Każdy blok inicjalizować samodzielnie albo jawnie oznaczyć wspólny scenariusz, bez przypisywania tej różnicy funkcji merge.
- [code-removal-sequence](#code-removal-sequence): Zachować scenariusz, ale pokazać pośrednie stany. Dodawanie push/unshift przetestowano w skróconej reprodukcji, nie w identycznym pełnym bloku owoców.
- [code-foreach](#code-foreach): Zachować zwykły foreach; referencyjną reprodukcję traktować tylko jako materiał ostrzegawczy.
- [code-merge-and-sort](#code-merge-and-sort): Dodać porównania oparte na kontrolowanych danych; kopiować wejście przed każdym sortowaniem. Nie wyciągać kolejności z uporządkowanego alfabetycznie obiektu JSON.

## SORTING

- [sorting-contract](#sorting-contract): Dodać zwartą tabelę sześciu funkcji z kolumnami: kierunek, po czym, klucze, mutacja, return.
- [sorting-version-caution](#sorting-version-caution): Początkujące przykłady oprzeć na jednorodnych danych; nie obiecywać polskiej kolejności leksykograficznej na podstawie sort z domyślnymi flagami.
- [hidden-state](#hidden-state): Każdy blok inicjalizować samodzielnie albo jawnie oznaczyć wspólny scenariusz, bez przypisywania tej różnicy funkcji merge.
- [code-merge-and-sort](#code-merge-and-sort): Dodać porównania oparte na kontrolowanych danych; kopiować wejście przed każdym sortowaniem. Nie wyciągać kolejności z uporządkowanego alfabetycznie obiektu JSON.

## MAP / FILTER / REDUCE

- [map-contract](#map-contract): Zachować podwajanie i dopisać zasadę kluczy, bez rozwijania wszystkich wariantów callbacku.
- [filter-contract](#filter-contract): Zachować widoczne klucze 1 i 3; nie reindeksować niejawnie w objaśnieniu.
- [reduce-contract](#reduce-contract): Przenieść kod sumy bezpośrednio pod array_reduce i wyjaśnić początkowe 0.
- [count-values-contract](#count-values-contract): Oddzielić przykład liczenia owoców od sumowania; zaznaczyć ograniczenie typów.
- [correct-reduce-placement](#correct-reduce-placement): Przenieść sumę pod array_reduce; zachować osobno licznik produktów i jego wynik 2/2/1.
- [code-functional](#code-functional): Zachować wyniki, inicjalizować $liczby w każdym samodzielnym przykładzie; przenieść sumę pod poprawny nagłówek.

## EXTRACT SAFETY

- [extract-contract](#extract-contract): Ograniczyć do advanced/caution na zaufanych stałych danych lub pominąć z głównej ścieżki; nie uczyć extract($_POST).
- [html-output-boundary](#html-output-boundary): Przy demonstracyjnym wyświetleniu użyć jawnych ENT_QUOTES | ENT_SUBSTITUTE i UTF-8; walidacja danych wejściowych jest oddzielnym krokiem.
- [unsafe-extract-post](#unsafe-extract-post): Usunąć przykład kontaktowy extract($_POST). Dla formularzy jawnie pobierać oczekiwane pola, sprawdzić typ, walidować i oddzielnie escape przy wyświetlaniu.
- [code-extract-overwrite](#code-extract-overwrite): Ewentualne extract wyłącznie w ramce advanced/caution na zaufanych danych; domyślnie preferować dostęp po kluczu.

## FORM EXAMPLES

- [post-and-validation](#post-and-validation): Pokazać oczekiwane klucze i is_string przed walidacją; sprawdzać wynik walidacji jawnie, nie mylić jej z sanitization lub autoryzacją.
- [html-output-boundary](#html-output-boundary): Przy demonstracyjnym wyświetleniu użyć jawnych ENT_QUOTES | ENT_SUBSTITUTE i UTF-8; walidacja danych wejściowych jest oddzielnym krokiem.
- [form-skeleton](#form-skeleton): Oznaczyć jako pseudokod/szkic lub usunąć wywołanie z samodzielnego przykładu. Ustalenie pełnego handlera wymaga osobnej decyzji, nie rozbudowy tego tutorialu.
- [unsafe-extract-post](#unsafe-extract-post): Usunąć przykład kontaktowy extract($_POST). Dla formularzy jawnie pobierać oczekiwane pola, sprawdzić typ, walidować i oddzielnie escape przy wyświetlaniu.
- [post-type-boundary](#post-type-boundary): Dodać małą uwagę o is_string i odrzuceniu nieoczekiwanego kształtu. Nie rozbudowywać do CSRF, bazy danych, wysyłki e-mail czy pełnej aplikacji.
- [menu-dynamic-output](#menu-dynamic-output): Nie opisywać obecnego statycznego przykładu jako dowiedzionej exploitable luki. Zaznaczyć granicę: zaufane stałe dane kontra dynamiczne wejście.
- [code-menu-missing-active](#code-menu-missing-active): Ustalić jednolity kontrakt menu lub użyć $item["active"] ?? false. Nie przedstawiać definicji funkcji jako faktycznie wywołanej.

## SECURITY / CAUTION NOTES

### unsafe-extract-post

extract($_POST) bezpośrednio importuje niezaufane klucze jako zmienne i domyślnie może nadpisać stan scope. Późniejsze echo interpolowanego $imie nie wykonuje HTML escaping. Ogólna uwaga „filtruj” nie czyni tego bezpiecznym wzorcem. (verified; confidence: 0.99)

Evidence: [extract/untrusted](https://www.php.net/manual/en/function.extract.php), [escape/html](https://www.php.net/manual/en/function.htmlspecialchars.php), [external/array-input](https://www.php.net/manual/en/language.variables.external.php)

SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "extract($_POST);"
SOURCE: 1356-post-62-php-tablice-czesc-ii.md, body: "echo \"Dziękujemy, $imie, za kontakt!\";"

Zalecenie: Usunąć przykład kontaktowy extract($_POST). Dla formularzy jawnie pobierać oczekiwane pola, sprawdzić typ, walidować i oddzielnie escape przy wyświetlaniu.

### post-type-boundary

Fallback ?? zapobiega brakowi klucza, ale nie odrzuca wartości będącej tablicą w polu name/email/message. empty(name) i walidacja email nie zastępują spójnego sprawdzenia oczekiwanego typu każdego pola. (verified; confidence: 0.99)

Evidence: [external/array-input](https://www.php.net/manual/en/language.variables.external.php), [empty/falsey](https://www.php.net/manual/en/function.empty.php), [filter-var/validation](https://www.php.net/manual/en/function.filter-var.php), [coalesce/fallback](https://www.php.net/manual/en/language.operators.comparison.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "\"name\" => $_POST[\"name\"] ?? \"\""
SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "\"email\" => $_POST[\"email\"] ?? \"\""

Zalecenie: Dodać małą uwagę o is_string i odrzuceniu nieoczekiwanego kształtu. Nie rozbudowywać do CSRF, bazy danych, wysyłki e-mail czy pełnej aplikacji.

### menu-dynamic-output

Menu w SOURCE korzysta ze stałych nazw i URL-i, więc nie stwierdzono ataku na aktualne dane. Wariant przyjmujący dane z zewnątrz wymagałby escape tekstu/cytowanych atrybutów i osobnej walidacji URL; samo htmlspecialchars nie narzuca dozwolonego schematu URL. (verified; confidence: 0.96)

Evidence: [escape/html](https://www.php.net/manual/en/function.htmlspecialchars.php), [external/array-input](https://www.php.net/manual/en/language.variables.external.php)

SOURCE: 1324-post-61-tablice-w-php-czesc-1.md, body: "echo \"<a href='{$item[\"url\"]}'>{$item[\"title\"]}</a>\";"

Zalecenie: Nie opisywać obecnego statycznego przykładu jako dowiedzionej exploitable luki. Zaznaczyć granicę: zaufane stałe dane kontra dynamiczne wejście.

## RECOMMENDED ARTICLE CHANGES

- CORRECT: Dodać zakres PHP 8.4–8.5 i rozdzielić aktualną dokumentację od lokalnych prób na 8.2.4. [php-lifecycle, negative-append-version, key-exists-null-argument]
- CORRECT: Poprawić definicje klucza, listy i jednej wartości na klucz; zachować nested/mixed przykłady. [array-model, correct-multiple-values, correct-zero-index]
- CORRECT: Poprawić Notice na E_WARNING; dodać tabelę isset/key_exists/??/empty z brak/null/0. [correct-warning, presence-comparison, empty-is-not-existence]
- KEEP: Zachować operacje dodawania/usuwania i foreach, objaśniając mutację, return i pośrednie stany. [mutating-operations, removal-operations, foreach-contract, code-removal-sequence]
- ADD_CAUTION: Dodać tabelę merge/+ /replace i sześciu sortowań; jawnie inicjalizować dane. [merge-comparison, sorting-contract, hidden-state, code-merge-and-sort]
- CORRECT: Przenieść kod sumy pod reduce; zachować klucze wyniku filter i osobny count_values. [correct-reduce-placement, filter-contract, count-values-contract, code-functional]
- REMOVE_EXAMPLE: Usunąć formularz extract($_POST); najwyżej krótka ramka advanced na zaufanych danych. [unsafe-extract-post, extract-contract, code-extract-overwrite]
- ADD_CAUTION: Dodać sprawdzanie stringów, walidację email i osobny HTML escaping; nie budować pełnego handlera. [post-type-boundary, post-and-validation, html-output-boundary, form-skeleton]
- CORRECT: Zabezpieczyć brak active; wyraźnie ograniczyć renderer do zaufanych statycznych danych. [code-menu-missing-active, menu-dynamic-output]
- NEEDS_REVIEW: Po redakcji wydzielić samodzielne bloki PHP i wykonać je na aktualnych wydaniach 8.4 i 8.5; w tym milestone niczego nie pisać ani nie instalować. [mixed-markdown-php, form-skeleton, negative-append-version]

## UNRESOLVED QUESTIONS

- target-runtime: Nie ma wykonania na PHP 8.4 i 8.5; szczególnie różnicy append po ujemnym przypisaniu i deprecated null argumentu array_key_exists w 8.5 nie zweryfikowano lokalnie. Nie instalowano runtime. (needs-review)
- snippets: Finalne samodzielne fenced bloki jeszcze nie istnieją, processFormData nie jest zaimplementowane. Pełny handler i finalne testy wymagają osobnego zakresu/akceptacji. (needs-review)

## SOURCE REGISTER

- [php-support — PHP: Supported Versions](https://www.php.net/supported-versions.php); support-lifecycle; pobrano 2026-10-09T07:31:01.697Z; evidence: branches; SHA-256: 2c0f3710ee9c6288c9017022ce4518cab1add1e2a64757a8809597b82fab2648
- [arrays — PHP: Arrays - Manual](https://www.php.net/manual/en/language.types.array.php); language-reference; pobrano 2026-10-09T07:31:01.732Z; evidence: definition, keys, append, missing; SHA-256: 7ee76947c093d34b1967e3f06dbe63fac72d61715c964810adb7966d14797f48
- [migration80 — PHP: Backward Incompatible Changes - Manual](https://www.php.net/manual/en/migration80.incompatible.php); migration; pobrano 2026-10-09T07:31:01.753Z; evidence: warnings; SHA-256: 32915fbebfbc2a2e4f21f57b1e1c34c0bf5bb14a633d5dd92895384825d959a1
- [migration81 — PHP: Deprecated Features - Manual](https://www.php.net/manual/en/migration81.deprecated.php); migration; pobrano 2026-10-09T07:31:01.769Z; evidence: float-keys; SHA-256: fcb474b92adf284b33797da2e874614e5ff0e4f9870431f8c5ea4bb2f3138137
- [isset — PHP: isset - Manual](https://www.php.net/manual/en/function.isset.php); manual; pobrano 2026-10-09T07:31:01.789Z; evidence: presence; SHA-256: d7e9fcbbf594c079bbd419a0db97f02e9126cf78c5535ca7a21a4885b4eb4e5a
- [key-exists — PHP: array_key_exists - Manual](https://www.php.net/manual/en/function.array-key-exists.php); manual; pobrano 2026-10-09T07:31:01.806Z; evidence: null; SHA-256: 3172a236c59215e8dfd64cf1eb5fe01cca6f23424ccf2510bad0f34643960ed3
- [coalesce — PHP: Comparison - Manual](https://www.php.net/manual/en/language.operators.comparison.php); language-reference; pobrano 2026-10-09T07:31:01.823Z; evidence: fallback; SHA-256: 5198eaa5eabc8d347a2a450365e8eb5757c3650685a18e69108e1855321e54f8
- [empty — PHP: empty - Manual](https://www.php.net/manual/en/function.empty.php); manual; pobrano 2026-10-09T07:31:01.843Z; evidence: falsey; SHA-256: 4c0fc12ca13cf0eccd1e644056e8097283222626102ce5cc4b96b92f80a039f5
- [pop — PHP: array_pop - Manual](https://www.php.net/manual/en/function.array-pop.php); manual; pobrano 2026-10-09T07:31:01.860Z; evidence: last; SHA-256: db7b666a17de95540f1d445f690af46d3c030e1cb56d09bdae53e952f04439fa
- [shift — PHP: array_shift - Manual](https://www.php.net/manual/en/function.array-shift.php); manual; pobrano 2026-10-09T07:31:01.879Z; evidence: numeric; SHA-256: 1066596690e5b3381fd22ef6637bf62b0763f2c390c2006dd20954178f4d141c
- [foreach — PHP: foreach - Manual](https://www.php.net/manual/en/control-structures.foreach.php); language-reference; pobrano 2026-10-09T07:31:01.897Z; evidence: reference; SHA-256: bee4a793e2893b509c51476e0343c99e2136da8fc5cd18fddea2db17d4b24ec5
- [merge — PHP: array_merge - Manual](https://www.php.net/manual/en/function.array-merge.php); manual; pobrano 2026-10-09T07:31:01.910Z; evidence: numeric; SHA-256: f90b0a9bf0539f66ff99bd4015e983234214645da9093eacaa4d8eab60681707
- [union — PHP: Array - Manual](https://www.php.net/manual/en/language.operators.array.php); language-reference; pobrano 2026-10-09T07:31:01.927Z; evidence: left; SHA-256: 902e29af87ebda846380b7a27576500d78157e12efa31112e97cc4a3a43ba740
- [replace — PHP: array_replace - Manual](https://www.php.net/manual/en/function.array-replace.php); manual; pobrano 2026-10-09T07:31:01.943Z; evidence: right; SHA-256: 6a4f448757c21cc9380b68cb16df1bf043635f0556a822ec27d290b4ec3c0fd1
- [splice — PHP: array_splice - Manual](https://www.php.net/manual/en/function.array-splice.php); manual; pobrano 2026-10-09T07:31:01.962Z; evidence: numeric; SHA-256: 2d7a2689bde34ff306296ef18ff65df1a0f69d97ca3b66ff66df875983f76900
- [sorting — PHP: Sorting Arrays - Manual](https://www.php.net/manual/en/array.sorting.php); manual; pobrano 2026-10-09T07:31:01.979Z; evidence: mutates; SHA-256: e2d9d47165bcfc544f6cd62f60208818dbae4763efc7ef6079c9d3b16107249f
- [sort — PHP: sort - Manual](https://www.php.net/manual/en/function.sort.php); manual; pobrano 2026-10-09T07:31:01.998Z; evidence: return; SHA-256: 692acb9fa820f2f291d8ba4df1f024b75c50fe0ecd3c197d9e1bdb077524c529
- [rsort — PHP: rsort - Manual](https://www.php.net/manual/en/function.rsort.php); manual; pobrano 2026-10-09T07:31:02.017Z; evidence: return; SHA-256: e3d384b4a1ce318fa39d2fae5fd513ad8a079cada3447e0923542d8b789af671
- [asort — PHP: asort - Manual](https://www.php.net/manual/en/function.asort.php); manual; pobrano 2026-10-09T07:31:02.037Z; evidence: return; SHA-256: d6a4577ca09ff92b965cdd976107126a69d886541b4aeb4b693d0f19ae86bc44
- [arsort — PHP: arsort - Manual](https://www.php.net/manual/en/function.arsort.php); manual; pobrano 2026-10-09T07:31:02.050Z; evidence: return; SHA-256: 6a2c93de297dc8210dc3d4996497cfa09af541259684f13e1bd84b3067fca507
- [ksort — PHP: ksort - Manual](https://www.php.net/manual/en/function.ksort.php); manual; pobrano 2026-10-09T07:31:02.067Z; evidence: return; SHA-256: b022088128a711897ccb41c239e591cb7624c717616b1f2bf05b837fb854b65a
- [krsort — PHP: krsort - Manual](https://www.php.net/manual/en/function.krsort.php); manual; pobrano 2026-10-09T07:31:02.080Z; evidence: return; SHA-256: 0127c19621d5ae8b2682a83e82f0f0725ea5686d7f8fd6021ef991ce071cf36c
- [map — PHP: array_map - Manual](https://www.php.net/manual/en/function.array-map.php); manual; pobrano 2026-10-09T07:31:02.096Z; evidence: keys; SHA-256: b0e41ec4793fe4e3d2d50ce801b62bd153015ed473cd184241947e076578a5da
- [filter — PHP: array_filter - Manual](https://www.php.net/manual/en/function.array-filter.php); manual; pobrano 2026-10-09T07:31:02.110Z; evidence: keys; SHA-256: 2d1513892c9167fec83f5e29337c3da78885a6ba6270b17f1aad619a009376b1
- [reduce — PHP: array_reduce - Manual](https://www.php.net/manual/en/function.array-reduce.php); manual; pobrano 2026-10-09T07:31:02.127Z; evidence: result; SHA-256: 8c8f144b9f3094ead5dc9b87501a5e6d2d229f0854fde60d75fb6bf43823e492
- [count-values — PHP: array_count_values - Manual](https://www.php.net/manual/en/function.array-count-values.php); manual; pobrano 2026-10-09T07:31:02.141Z; evidence: types; SHA-256: 5f15a4a6e18626bcb6cf211116d817500db5fc8339c09b4d1bf30e121ee574f3
- [extract — PHP: extract - Manual](https://www.php.net/manual/en/function.extract.php); manual; pobrano 2026-10-09T07:31:02.160Z; evidence: untrusted; SHA-256: d678d39a4e75ee0441906ecd7c9ffdef79d58843ec4bf038ae63b3143ac3189e
- [post — PHP: $_POST - Manual](https://www.php.net/manual/en/reserved.variables.post.php); language-reference; pobrano 2026-10-09T07:31:02.174Z; evidence: forms; SHA-256: 0333d9e8d66f0eff023cfc408dadea10f66e7e6e161821a8ec29da5978b91872
- [external — PHP: Variables From External Sources - Manual](https://www.php.net/manual/en/language.variables.external.php); language-reference; pobrano 2026-10-09T07:31:02.188Z; evidence: array-input; SHA-256: 4205f46bb44a8d0549d1bda0c7fd969caa23764e1d79bd1b56337cc8ff1a72dc
- [filter-var — PHP: filter_var - Manual](https://www.php.net/manual/en/function.filter-var.php); manual; pobrano 2026-10-09T07:31:02.202Z; evidence: validation; SHA-256: ab8c0251d92d8e58ea68ca16ca68f08bcfe293550f14a3045693bee0a56bdcd6
- [escape — PHP: htmlspecialchars - Manual](https://www.php.net/manual/en/function.htmlspecialchars.php); manual; pobrano 2026-10-09T07:31:02.220Z; evidence: html; SHA-256: 89a5ad3e069edcce0011c20475cc0dcd5f20181f35c4645f5477ddb6b9188bd6
- [push — PHP: array_push - Manual](https://www.php.net/manual/en/function.array-push.php); manual; pobrano 2026-10-09T07:31:02.233Z; evidence: size; SHA-256: 43252be470143d4af66c72fafdf840a40fe5bd8e1f5088f0750733be61f69f1e
- [unshift — PHP: array_unshift - Manual](https://www.php.net/manual/en/function.array-unshift.php); manual; pobrano 2026-10-09T07:31:02.249Z; evidence: numeric; SHA-256: 0616352308ce51cd369f5ef397147242796768df5fd36ac9ae8841686ab60dbb
- [in-array — PHP: in_array - Manual](https://www.php.net/manual/en/function.in-array.php); manual; pobrano 2026-10-09T07:31:02.263Z; evidence: strict; SHA-256: c6d888481f4e6e93a97583f43fa7d41667c216da9dee24944a18545afb6f6f1c

## LIMITATIONS

- Pakiet jest research handoff, nie finalnym artykułem i nie akceptacją publikacji. Decyzja MERGE zatwierdza zakres researchu, nie wszystkie rekomendacje.
- Analiza modelu została wykonana w tej sesji Codex i jawnie importowana; CLI odtwarza zapis związany z requestHash, bez zewnętrznej inferencji.
- Źródłem faktów są 34 pobrane oficjalne strony PHP. Krótkie dosłowne kotwice, URL, data i hash są zapisane oddzielnie od interpretacji. Nie archiwizowano pełnych stron ani user-contributed notes.
- Walidacja sprawdza kształt, referencje i zgodność cytatów z wejściem; nie dowodzi automatycznie prawdziwości każdej interpretacji ani aktualności źródła w późniejszym terminie.
- 9 kontrolowanych prób używa stałych, własnych danych i nie wykonuje SOURCE. PHP 8.2.4 nie jest docelową ani zalecaną aktualną wersją poprawkową. Brak testów runtime PHP 8.4/8.5.
- Obiekty JSON są serializowane ze stabilnie sortowanymi kluczami. Kolejność tablic PHP przechowywać w jawnych parach lub keyOrder; sortowanie kluczy JSON nie dowodzi kolejności PHP.
- Nie uruchomiono całego eksportu Markdown jako PHP, nie przetestowano gotowego formularza/serwera ani finalnej redakcji kodu. Część przykładów oceniona przez dokumentację i równoważne małe reprodukcje.
- Zakres bezpieczeństwa ogranicza się do ryzyk extract, kształtu $_POST i HTML escaping. Nie jest to audyt aplikacji, CSRF, mailera, SQL ani dynamicznej polityki URL.
- Nie użyto Search Console, performance ani innych artykułów korpusu. SOURCE, CONTENT, decyzja human-approved i Cartographer pozostają tylko do odczytu.
- Odnośnik do Post #60 w II i formatowanie są istniejącymi ustaleniami redakcyjnymi Cartographera; nie potwierdzają żadnego technicznego faktu o PHP.

## WRITER HANDOFF

Założona wersja: PHP 8.4–8.5 na aktualnych wydaniach poprawkowych; zakres redakcyjny proponowany na podstawie aktywnego wsparcia. Ogólne objaśnienia PHP 8.x z wyraźnymi uwagami 8.1/8.3/8.5. Lokalne kontrolowane próby wykonane wyłącznie na PHP 8.2.4; brak macierzy runtime 8.4/8.5.

### Zachowaj

- Zachować model ordered map, osoby/macierze/zagnieżdżone dane i zwykły foreach. Zachować [] oraz array() jako poprawne składnie; preferować spójny styl []. [array-model, array-syntax, foreach-contract]
- Zachować rachunkowo poprawne wyniki map/filter/reduce/count_values oraz sekwencję usuwania z wyjaśnionymi stanami. [code-functional, code-removal-sequence]

### Popraw

- Poprawić wiele wartości pod kluczem, automatyczne 0 i słowo pozycja; dodać int/string, kolizje, klucze a liczba elementów. [correct-multiple-values, correct-zero-index, key-casts, append-key-history]
- Poprawić FAQ Notice i rozdzielić brak/null/falsey; ustawić zmienną przed demonstracją brakującego klucza. [correct-warning, presence-comparison, empty-is-not-existence]
- Umieścić sumę we właściwej sekcji reduce, inicjalizować każdy samodzielny blok oraz poprawić kontrakt submenu active. [correct-reduce-placement, hidden-state, code-menu-missing-active]

### Nie powielaj

- Nie powielać extract($_POST) ani interpolowanego wyjścia jako zalecanej obsługi formularza. Nie sugerować, że ogólne filtrowanie naprawia kolizje zmiennych. [unsafe-extract-post]
- Nie przedstawiać Markdownu jako skryptu PHP, szkicu processFormData jako gotowej aplikacji lub prób 8.2.4 jako wykonanych na 8.4/8.5. [mixed-markdown-php, form-skeleton, negative-append-version]

### Ostrożność

- Wersja redakcyjna 8.4–8.5: oznaczyć float key deprecated od 8.1, ujemny append od 8.3 i null key argument array_key_exists od 8.5. [php-lifecycle, float-key-deprecation, negative-append-version, key-exists-null-argument]
- Extract najwyżej advanced/caution; foreach by reference tylko z objaśnieniem unset. Dla danych formularza osobno typ, walidacja i escaping; nie rozwijać pełnej aplikacji. [extract-contract, foreach-contract, post-type-boundary, html-output-boundary]
- Sortowanie mutuje i nie zwraca tablicy; asocjacyjne JSON nie zachowuje samo w sobie kolejności PHP, odczytywać keyOrder. Locale i mieszane typy poza główną ścieżką. [sorting-contract, sorting-version-caution, code-merge-and-sort]

### Zweryfikowane przykłady

- code-key-extension: executed-probe; keys
- code-presence-matrix: executed-probe; presence
- code-removal-sequence: executed-probe; operations
- code-foreach: executed-probe; iteration
- code-merge-and-sort: executed-probe; merge, sorting
- code-functional: executed-probe; functional
- code-extract-overwrite: executed-probe; extract
- code-menu-missing-active: executed-probe; forms-menu

STOP — następny krok wymaga decyzji człowieka.
