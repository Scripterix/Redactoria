---
title: "Jak powstały pierwsze języki programowania? Dziadek, osiem przełączników i FORTRAN"
description: "Od baterii i żarówki przez bity, ręcznie wpisywane instrukcje, taśmy i dyskietki do pierwszych języków programowania. Historia opowiedziana prostym językiem."
slug: jak-powstaly-pierwsze-jezyki-programowania
---

# Jak powstały pierwsze języki programowania? Dziadek, osiem przełączników i FORTRAN

**Jak napisano pierwszy program, skoro komputer nie miał jeszcze żadnego programu?** Żadnego Windowsa, klawiatury z edytorem kodu ani przycisku „Zapisz”. Jedynie obwody elektryczne, przełączniki, pamięć i urządzenia pokazujące wynik. Odpowiedź zaczyna się od doświadczenia, które wielu uczniów lat 80. znało z lekcji techniki.

*Poniższa rozmowa wnuka z dziadkiem, dawnym programistą COBOL-u, jest fikcyjna. Pokazywane urządzenia i wydarzenia są historyczne, natomiast proste przykłady bitów i instrukcji służą wyjaśnieniu zasady działania.*

## 1. Dziadku, po co ci bateria i żarówka?

— Dziadku, przecież mieliśmy rozmawiać o komputerach. Dlaczego wyciągasz baterię, przewód, żarówkę i przełącznik?

— Bo kiedyś od tego zaczynaliśmy naukę o prądzie. Gdy zamkniesz obwód, prąd popłynie i żarówka się zaświeci. Gdy przerwiesz obwód, zgaśnie. Niczego jeszcze nie programujemy. To **elektrotechnika**: źródło zasilania, przewody, odbiornik i wyłącznik.

— Czyli: świeci albo nie świeci?

— Tak. Nazwijmy te dwa umowne stany **1** i **0**. To nie znaczy, że w komputerze jedynka zawsze oznacza „prąd płynie”, a zero „prąd nie płynie”. W prawdziwej elektronice odpowiadają im określone poziomy napięć i zasady ich odczytywania. Na razie potrzebujemy tylko dwóch stanów.

— A pamiętasz płaskie baterie?

— Jak najbardziej. Niejeden uczeń sprawdzał językiem, czy bateria 4,5 V jeszcze działa. Szczypało! Dzisiaj nie róbmy z tego eksperymentu. Lepiej podłączmy żarówkę.

To ważny pierwszy krok: **włącznik nie jest komputerem**, ale pozwala zrozumieć ideę dwóch odróżnialnych stanów, na której opiera się zapis binarny.

## 2. Osiem przełączników: jak pokazać komputerowi liczbę 2?

— Jeden przełącznik to tylko zero albo jedynka — zauważył wnuk. — A liczba dwa?

— Ustawmy osiem przełączników w jednym rzędzie. Każdy odpowiada za jedną pozycję liczby zapisanej w systemie dwójkowym. Tak powstaje **osiem bitów**, czyli jeden bajt.

```text
Pozycja bitu:   7 6 5 4 3 2 1 0
Waga:         128 64 32 16 8 4 2 1
Stan:           0 0 0 0 0 0 1 0

Liczba: 00000010 (binarnie) = 2 (dziesiętnie)
```

— Dlaczego ta jedynka oznacza dwa?

— Bo stoi na pozycji o wadze 2. Przesuń ją w lewo, a otrzymasz `00000100`, czyli 4. Ustaw dwa odpowiednie bity, a dostaniesz `00000110`, czyli 6. Zera i jedynki są sposobem **zapisu liczb**, a nie jeszcze programem.

— To jeśli nacisnę przycisk RUN, komputer doda dwa do dwóch?

— Nie. Samo ustawienie `00000010` nie mówi mu, **co ma zrobić**. To tylko liczba. Potrzeba jeszcze sposobu przekazania rozkazu: „weź tę wartość”, „dodaj”, „zapisz”, „pokaż wynik”. I właśnie dochodzimy do sedna powstania programów.

## 3. Skąd maszyna wiedziała, co oznacza „dodaj”, skoro nie miała programu?

— Wyobraź sobie, że łączysz dwa przełączniki z żarówką. Możesz tak ułożyć obwód, że żarówka zapali się tylko wtedy, gdy **oba** przełączniki będą włączone. To zalążek bramki logicznej AND.

— Czyli sam układ kabli coś rozstrzyga?

— Dokładnie. W bardziej złożonych komputerach rolę prostych styków pełniły między innymi **przekaźniki**, potem **lampy elektronowe**, a następnie **tranzystory**. Odpowiednio połączone elementy tworzą bramki logiczne, układy dodające liczby oraz obwody pamięci i sterowania.

Tu kończy się proste doświadczenie z żarówką, a zaczyna **elektronika cyfrowa**. Nie należy mylić lampy elektronowej, która wzmacnia lub przełącza sygnały, ze zwykłą żarówką, która jedynie świeci.

— Czyli instrukcja `DODAJ` była wbudowana w przewody?

— W pewnym sensie tak: **możliwość wykonania dodawania wynikała z budowy układów**. Natomiast obwód sterujący musiał jeszcze rozpoznać właściwy kod instrukcji i skierować dane do jednostki wykonującej dodawanie. W określonych maszynach robiły to obwody sterujące, nie gotowy język tekstowy ani system operacyjny.

I jeszcze jedna rzecz: „jedynka” nie jest osobnym strumieniem elektronów w jednym wybranym kanale. Komputer odczytuje stany sygnałów elektrycznych według własnej konstrukcji. Analogia z kanałami pomaga zrozumieć kierowanie sygnału, ale nie zastępuje opisu rzeczywistego układu.

## 4. Jak ręcznie uruchomić program? Przełączniki, pamięć i lampki

— Dziadku, to pokaż mi nasze `2 + 2`.

— Możemy to **odegrać** na modelu ośmiobitowej maszyny. Na niektórych rzeczywistych komputerach, zwłaszcza na znanym **Altair 8800 z 1975 roku**, operator korzystał z panelu przełączników i lampek LED. Wprowadzał wartości i instrukcje do pamięci, ustawiał adresy, a następnie uruchamiał wykonanie. Takie panele nie były jednak wspólnym wyposażeniem wszystkich wczesnych komputerów.

Wyobraźmy sobie naszą *wymyśloną* maszynę, której konstruktor przypisał kody następującym poleceniom:

```text
Rozkaz człowieka       Umowny kod    Dane (jeśli potrzebne)
ZAŁADUJ LICZBĘ         00000001      00000010   (= 2)
DODAJ LICZBĘ           00000010      00000010   (= 2)
POKAŻ AKUMULATOR       00000011      —
ZATRZYMAJ              11111111      —
```

**Uwaga:** te kody zostały wymyślone na potrzeby lekcji. Nie są instrukcjami Intel 8080, Manchester Baby ani IBM 704. Prawdziwe procesory mają własne formaty instrukcji; nie każdy zapis operacji i liczby mieści się w jednym bajcie.

— Co robisz z tymi zerami i jedynkami?

— Wprowadzam kolejne wartości do pamięci, każdą pod odpowiedni adres. W naszej wyobrażonej maszynie naciskam przycisk rozpoczęcia wykonywania. Obwody pobierają pierwszą instrukcję, rozpoznają jej kod, odczytują liczbę 2, później dodają drugie 2. Na końcu stan rejestru wyniku można pokazać na ośmiu lampkach:

```text
Wynik:  0 0 0 0 0 1 0 0
Lampki: ○ ○ ○ ○ ○ ● ○ ○
                    
00000100 = 4
```

— A więc żarówki **nie liczą**. One tylko pokazują wynik!

— Dokładnie. Liczą układy logiczne. Lampki — w zależności od konstrukcji — pokazują stan rejestru, pamięci albo magistrali. Można też podłączyć drukarkę czy inny układ wyjściowy. „Output” oznacza po prostu sposób, w jaki maszyna oddaje wynik człowiekowi.

**Najważniejsze rozróżnienie:** program to *kolejność instrukcji*, dane to *liczby, na których instrukcje pracują*, a elektronika to *fizyczny mechanizm wykonania tych instrukcji*. Właśnie dlatego można zmienić program bez przebudowy całego komputera.

## 5. Lata 1947–1948: pierwsze wielkie zmiany

— Dziadku, czy w 1947 roku ludzie już tak programowali?

— Nie w jednym, identycznym urządzeniu. Historia miała kilka równoległych ścieżek. Przełączniki i kable wykorzystywano już wcześniej. Ważne wydarzenia z końca lat 40. zmieniły jednak to, jak komputery budowano i programowano.

- **1947:** w Bell Labs opracowano pierwszy działający tranzystor. Nie oznaczało to, że komputery natychmiast stały się tranzystorowe. Przez kolejne lata nadal szeroko używano lamp elektronowych.
- **1947:** Kathleen Booth rozwijała metody programowania symbolicznego dla komputerów ARC; jej prace zalicza się do pionierskich osiągnięć asemblera.
- **21 czerwca 1948:** Manchester **Baby** wykonał program Toma Kilburna zapisany w elektronicznej pamięci. Miał 17 instrukcji i służył znalezieniu największego dzielnika właściwego liczby. Był to przełom: instrukcje można było przechowywać w pamięci tak jak dane, zamiast za każdym razem przebudowywać połączenia sterujące.

— Czyli komputer miał już program *w sobie*?

— W **pamięci komputera**, nie magicznie „zaszyty” w samym procesorze. A to otworzyło drogę do uruchamiania różnych programów na tej samej maszynie. Program trzeba było najpierw jakoś wprowadzić — ręcznie albo za pomocą urządzenia odczytującego nośnik.

## 6. Dziadku, po co były dziurki w papierze?

— Zrozumiałem przełączniki. Ale po co programiści dziurawili kartki i taśmy?

— Bo ręczne wpisywanie długiego programu było uciążliwe. Wyobraź sobie setki lub tysiące instrukcji. Jedna pomyłka w ustawieniu bitu i zaczynasz szukać błędu. Lepiej **utrwalić informacje na nośniku** i pozwolić urządzeniu odczytać je ponownie.

— Czyli taśma perforowana była czymś w rodzaju pliku?

— Dobra analogia. Dziurki i ich brak kodowały informacje w ustalonym układzie. Czytnik odtwarzał je jako sygnały. Podobnie działały **karty perforowane**: każda karta mogła zawierać fragment danych albo instrukcję. W zależności od epoki i maszyny były odczytywane mechanicznie, elektromechanicznie lub elektronicznie.

Taka metoda ma historię starszą od komputera. W XIX wieku wzory otworów sterowały krosnami żakardowymi. **Charles Babbage** planował użyć kart perforowanych w maszynie analitycznej, a **Ada Lovelace** w 1843 roku opisała sposób obliczania liczb Bernoulliego dla tej projektowanej maszyny. Nie był to wykonany na niej program: maszyna nie została ukończona.

— Czy dziurki były zerami i jedynkami?

— Były **fizycznym sposobem kodowania informacji**, niekoniecznie prostym „jedna dziurka = jeden bit” w każdym systemie. Na kartach mogły się znajdować również znaki tekstowe programu, które dopiero później trzeba było przetłumaczyć na kod maszyny.

— Czyli można było zachować program, wsunąć kartę do czytnika i uruchomić go ponownie?

— Tak, choć droga od karty do wykonania zależała od komputera. Nie zawsze następowało to od razu: czasem potrzebny był program ładujący, assembler albo kompilator. Sama karta **nie rozumiała** instrukcji. Przenosiła informacje.

### Od papieru do dyskietki: dlaczego ważny jest rok 1971?

— A kiedy zniknęły dziurki?

— Nie zniknęły jednego dnia. Obok kart i taśm perforowanych rozwijały się **taśmy magnetyczne**, pamięci bębnowe i dyskowe. W 1971 roku IBM wprowadził pierwszą **8-calową dyskietkę** do zastosowań związanych z ładowaniem mikrokodu. Dopiero kolejne generacje upowszechniły dyskietki jako wymienne nośniki plików i programów.

— A kaseta magnetofonowa?

— Też bywała nośnikiem programów, zwłaszcza w niektórych komputerach domowych lat 70. i 80. Nie oznacza to jednak, że wszystkie komputery przechodziły tę samą kolejność: *taśma perforowana → kaseta → dyskietka*. Różne technologie przez długi czas współistniały.

### Rok 1980: komputer coraz bliżej domu

— Więc w 1980 roku miałbym już ekran i klawiaturę?

— W wielu komputerach mikrokomputerowych — tak, choć możliwości bardzo się różniły. W latach 70. i na początku 80. programy coraz częściej wpisywano na klawiaturze, oglądano tekst na ekranie i zapisywano na dyskietkach lub kasetach. Ale sposób **przechowywania** programu to coś innego niż sposób **pisania** go. I tu pojawia się język programowania.

## 7. Jeśli maszyna rozumiała liczby, kto nauczył ją słów?

— Nie chcę już pamiętać, że `00000010` znaczy „dodaj” — powiedział wnuk. — Wolę napisać `ADD`.

— Programiści pomyśleli tak samo. Najpierw sami, z pomocą tabel instrukcji, zamieniali nazwy operacji na kody liczbowe. Potem napisali programy, które wykonywały to tłumaczenie automatycznie. Powstał **asembler**.

Przykładowy zapis — znowu **pseudokod**, nie składnia konkretnego historycznego procesora — wyglądałby tak:

```asm
LOAD 2
ADD  2
STORE RESULT
HALT
```

— Ale chwila! Jak napisali pierwszy asembler, skoro nie mieli asemblera?

— Najpierw przygotowali go przy użyciu istniejących metod, choćby bezpośrednio w kodzie maszynowym. Gdy prosty translator już działał, mógł pomagać tworzyć bardziej złożone narzędzia. Ten sposób stopniowego budowania narzędzi za pomocą wcześniej dostępnych narzędzi nazywamy **bootstrappingiem**.

```text
Sprzęt umie wykonywać kody instrukcji
                    ↓
Człowiek zapisuje te kody ręcznie
                    ↓
Prosty program tłumaczy nazwy na kody
                    ↓
Powstają wygodniejsze asemblery i kompilatory
                    ↓
Można pisać wzory i instrukcje wyższego poziomu
```

— A kto wymyślił pierwszy taki język?

— Nie da się uczciwie wskazać jednej osoby. W latach 40. **Konrad Zuse** pracował nad koncepcją *Plankalkül*. Na początku lat 50. **Alick Glennie** opracował *Autocode*. **Grace Hopper** ze współpracownikami stworzyła w 1952 roku system **A-0**, ułatwiający korzystanie z gotowych procedur. John Backus pracował wcześniej nad **Speedcode**. Były to różne kroki na drodze do języków wysokiego poziomu. Przełomem w ich praktycznej popularności okazał się FORTRAN.

— Czyli kiedy naciskam dziś „Uruchom”, pod spodem nadal dzieje się coś podobnego?

— Tak. Tylko między twoim kodem a tranzystorami pracuje teraz wiele warstw. Zobaczmy, jak jedna z najważniejszych powstała w IBM.

---

## 8. John Backus i zespół IBM: język zamiast instrukcji procesora

Na początku lat 50. napisanie i przetestowanie programu naukowego pochłaniało ogromną ilość pracy. Programiści musieli jednocześnie rozwiązywać problem matematyczny i pilnować szczegółów konkretnego komputera.

**John Backus**, matematyk i programista IBM, dostrzegł możliwość radykalnej zmiany: zamiast ręcznie rozpisywać działanie na instrukcje procesora, człowiek powinien podawać komputerowi **wzory i operacje w zapisie przypominającym matematykę**. Resztą miał zająć się translator.

W 1953 roku rozpoczęto organizację zespołu, a w 1954 roku powstał projekt systemu **FORTRAN** — od *FORmula TRANslation*. Pierwszy działający system dla komputera **IBM 704** udostępniono w 1957 roku.

Nie stworzył go sam Backus. W zespole pracowali również m.in. **Lois Haibt, Harlan Herrick, David Sayre, Peter Sheridan, Richard Goldberg, Robert Nelson, Roy Nutt i Sheldon Best**. Szczególnie ważnym osiągnięciem był kompilator analizujący wyrażenia i optymalizujący wynikowy kod maszynowy.

Nie chodziło jedynie o łatwiejsze pisanie. Trzeba było przekonać ówczesnych programistów, że kod wytworzony automatycznie **nie będzie dramatycznie wolniejszy** od kodu zapisanego przez doświadczonego specjalistę. Zespół IBM zbudował kompilator, którego wyniki okazały się wystarczająco wydajne, aby język zdobył uznanie.

## 9. Historyczne `2 + 2 = 4`: jak zapisano by to w FORTRAN-ie?

W pierwszym FORTRAN-ie nadal używano kart perforowanych, a kod źródłowy miał sztywny układ kolumn. Nowością nie był więc brak kart, lecz **zawartość kart**: zamiast ręcznie podawać instrukcje maszyny, można było zapisywać wyrażenia matematyczne.

Poniżej prosty program w stylu wczesnego FORTRAN-u. Składnia `PRINT` i `FORMAT` występowała już w dokumentacji IBM 704; **nie twierdzimy jednak, że poniższe karty pochodzą z konkretnego programu z 1957 roku**:

```fortran
      I = 2 + 2
      PRINT 10, I
   10 FORMAT (I5)
      STOP
      END
```

**Wynik na urządzeniu wyjściowym:**

```text
    4
```

Co robi każda linia?

1. `I = 2 + 2` — oblicza sumę i zapisuje ją w zmiennej `I`.
2. `PRINT 10, I` — wysyła wartość na urządzenie wyjściowe, stosując format o etykiecie `10`.
3. `10 FORMAT (I5)` — określa sposób wypisania liczby całkowitej w polu o szerokości pięciu znaków.
4. `STOP` — kończy wykonywanie programu.
5. `END` — oznacza koniec jednostki programu w kodzie źródłowym.

Jest to **rekonstrukcja dydaktyczna w historycznym stylu**, a nie transkrypcja autentycznej karty z 1957 roku. Odstępy i umiejscowienie etykiety mają znaczenie dla dawnego formatu stałokolumnowego. Nie należy mylić ówczesnego `PRINT` z wyświetlaniem wyniku na współczesnym monitorze: IBM 704 używał m.in. urządzeń drukujących.

Dla porównania we współczesnym FORTRAN-ie można napisać:

```fortran
program dodawanie
    implicit none
    integer :: wynik

    wynik = 2 + 2
    print *, wynik
end program dodawanie
```

A w JavaScripcie:

```javascript
console.log(2 + 2); // 4
```

Trzy epoki, jedna intencja: **oblicz i pokaż wynik**. Zmieniło się to, ile szczegółów maszyny musi znać autor programu.

## 10. Co naprawdę robił kompilator FORTRAN-u?

To właśnie tu wydarzył się najważniejszy przełom.

```text
Programista zapisuje:
       I = 2 + 2
             ↓
Kompilator analizuje instrukcję
             ↓
Generuje odpowiedni kod maszynowy IBM 704
             ↓
Komputer wykonuje program
             ↓
Urządzenie wyjściowe podaje wynik: 4
```

Kompilator nie musiał rozumieć matematyki tak jak człowiek. Miał zestaw reguł analizowania instrukcji, nazw zmiennych i wyrażeń oraz metod przekształcania ich w operacje obsługiwane przez komputer. Jego dodatkowym zadaniem było optymalizowanie powstającego programu.

To także odpowiedź na pytanie, **w czym napisano pierwszy kompilator FORTRAN-u**: jego twórcy tworzyli go za pomocą dostępnych technik programowania niskopoziomowego, dostosowanych do IBM 704. Nie potrzebowali wcześniejszego kompilatora FORTRAN-u: translator sam był programem dla istniejącej maszyny. Współczesny termin *bootstrapping* obejmuje również późniejszą technikę budowania kompilatora nowej wersji języka za pomocą wcześniejszej wersji tego samego kompilatora.

## 11. Od języków matematycznych do języków ogólnego zastosowania

Sukces FORTRAN-u pokazał, że programowanie można oddzielić od szczegółów procesora. Wkrótce rozwijały się kolejne języki o odmiennych celach:

| Rok | Język | Główna idea |
|---|---|---|
| 1957 | **FORTRAN** | Wydajne obliczenia naukowe i inżynierskie |
| 1958 | **LISP** | Przetwarzanie symboli i list; później ważny dla badań nad AI |
| 1959–1960 | **COBOL** | Projekt zapoczątkowany w 1959 r.; wczesne specyfikacje w 1960 r. — przetwarzanie danych biznesowych |
| 1960 | **ALGOL 60** | Precyzyjny opis algorytmów i struktury blokowe |
| 1964 | **BASIC** | Ułatwienie nauki i dostępu do programowania |
| 1972 | **C** | Programowanie systemowe blisko możliwości sprzętu |

Każdy język tworzył nowy poziom abstrakcji albo upraszczał inny rodzaj problemów. C nie zastąpił FORTRAN-u w każdej dziedzinie, tak samo jak JavaScript nie zastąpił C. Różne narzędzia powstały dla różnych potrzeb.

Co ciekawe, **FORTRAN nadal jest rozwijany i używany**, zwłaszcza tam, gdzie istotne są długotrwałe obliczenia numeryczne i istniejące biblioteki naukowe.

## 12. Czy klawiatura i ekran stworzyły współczesne programowanie?

Nie od razu. Początkowo kod źródłowy w języku wysokiego poziomu nadal trafiał do komputera na kartach perforowanych. Z czasem upowszechniały się terminale, edytory tekstu, a potem środowiska programistyczne i interfejsy graficzne.

To **osobna historia**, której nie należy mieszać z wynalezieniem języków programowania. FORTRAN był przełomem w sposobie *zapisywania i tłumaczenia instrukcji*, a rozwój terminali i GUI — w sposobie *interakcji człowieka z komputerem*. Jedno wspierało drugie, ale nie było tym samym wynalazkiem.

## Podsumowanie: komputer nie nauczył się naszego języka — stworzyliśmy tłumacza

Historia pierwszych języków programowania nie jest opowieścią o jednej osobie, która pewnego dnia wymyśliła `PRINT`. To ciąg następujących po sobie rozwiązań: od mechanicznego kodowania instrukcji, przez kod maszynowy, symboliczne nazwy operacji i wczesne translatory, aż po kompilator, który potrafił zamienić wzór matematyczny w efektywny program.

**Najważniejsza zmiana nie polegała na tym, że komputer stał się inteligentniejszy. Polegała na tym, że człowiek nie musiał już myśleć dokładnie tak, jak działa procesor.**

Dziś, gdy piszemy:

```javascript
console.log(2 + 2);
```

korzystamy z idei rozwijanej przez pokolenia konstruktorów sprzętu i twórców języków: **opisujemy, co chcemy zrobić, a kolejne warstwy oprogramowania przekładają to na operacje wykonywane przez maszynę**.

---

## Źródła i materiały do dalszego czytania

1. IBM, **Fortran — History**: https://www.ibm.com/history/fortran
2. IBM, **John Backus**: https://www.ibm.com/history/john-backus
3. John Backus, **The History of FORTRAN I, II, and III** (1978/1979): https://research.ibm.com/publications/the-history-of-fortran-i-ii-and-iii
4. Computer History Museum, **Software & Languages Timeline**: https://www.computerhistory.org/timeline/software-languages/
5. Computer History Museum, **History of FORTRAN and FORTRAN II — Software Preservation**: https://softwarepreservation.computerhistory.org/FORTRAN/
6. IBM, **FORTRAN: An Automatic Coding System for the IBM 704** (podręcznik referencyjny, 1956/1957; archiwalny skan): https://bitsavers.trailing-edge.com/pdf/ibm/704/704_FortranProgRefMan_Oct56.pdf
7. Jean E. Sammet, **The Early Development of Programming Languages** (przegląd historyczny): https://doi.org/10.1016/B978-0-12-491650-0.50019-8
8. Plan 28, **How We Got to Where We Are** — o projekcie maszyny analitycznej i programie Ady Lovelace: https://blog.plan28.org/2016/10/how-we-got-to-where-we-are.html



9. University of Manchester, **The Baby — pierwsze uruchomienie programu zapisanego w pamięci (1948)**: https://curation.cs.manchester.ac.uk/digital60/www.digital60.org/birth/thebaby/index.html
10. Computer History Museum, **The Stored Program**: https://www.computerhistory.org/revolution/story/87
11. Computer History Museum, **Programming the ENIAC: an example of why computer history is hard**: https://computerhistory.org/blog/programming-the-eniac-an-example-of-why-computer-history-is-hard/

<!-- Nota redakcyjna Redactoria: dialog jest fikcyjny, wszystkie kody maszynowe w rozdziałach 2–7 są przykładami dydaktycznymi. Sprawdzić formatowanie kodu FORTRAN fixed-form. Poprzednia nota: opis dotyczy rozwoju języków i kompilatorów, a nie historii GUI. Historyczne przykłady asemblera są pseudokodem. Przed publikacją sprawdzić zachowanie spacji przy renderowaniu przykładu FORTRAN fixed-form. -->
