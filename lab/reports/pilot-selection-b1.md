# B1 — dziesięciu kandydatów pilota

Status: **selection-only**. 83 źródła, 19 pełnych odczytów, 10 wyborów.

Bez researchu, draftów i publikacji. Ranking nie stanowi human approval dla B2 ani CONTENT.

## Metoda

Każde kryterium ma skalę 1–5. Wartość edukacyjna, testowalność, jasność zakresu, linkowanie i użyteczność: więcej = lepiej. Ryzyko starzenia/security i koszt researchu: mniej = lepiej. Oceny dotyczą proponowanego ograniczonego zakresu, nie poprawności legacy.

Wagi (suma 100): educationalValue=20, codeTestability=20, beginnerUsefulness=15, scopeClarity=15, internalLinking=10, outdatedRisk=5, researchCost=10, securityRisk=5.

Wynik = suma(waga × ocena korzystna)/5, ryzyka odwrócone jako 6−ocena. Remis: sourcePath rosnąco. To deterministyczny porządek ocen redakcyjnych, nie zmierzona jakość/koszt ani pełny research.

## Ranking

| # | Proponowany temat | Wynik / 100 | Koszt | Starzenie | Security |
| --- | --- | --- | --- | --- | --- |
| 1 | Instrukcje sterujące w PHP: warunki i pętle | 97 | 2 | 2 | 1 |
| 2 | if i else w JavaScript: warunki i walidacja wejścia | 94 | 2 | 2 | 1 |
| 3 | Tablice JavaScript: map, filter, reduce i sort | 91 | 2 | 2 | 1 |
| 4 | DOM w JavaScript: selektory, tekst i zdarzenia | 89 | 2 | 2 | 2 |
| 5 | Markdown: nagłówki, linki, listy i bloki kodu | 88 | 1 | 2 | 1 |
| 6 | Funkcje i klasy JavaScript na przykładzie kalkulatora | 87 | 2 | 2 | 1 |
| 7 | API, HTTP i JSON: od żądania do odpowiedzi | 87 | 3 | 2 | 2 |
| 8 | Git lokalnie: status, staging, commit i historia | 80 | 2 | 3 | 2 |
| 9 | curl i HTTP: odpowiedź, nagłówki i lokalny JSON | 79 | 3 | 3 | 2 |
| 10 | Podstawy Pythona: wartości, warunki, pętle i funkcje | 78 | 3 | 2 | 1 |

## 1. Instrukcje sterujące w PHP: warunki i pętle

Źródło: [Post #60 Instrukcje sterujące PHP](../../../temp-ogwo/posts/1308-post-60-instrukcje-sterujace-php.md) · ID 1308 · PHP

Dlaczego: Najmniejszy kolejny pilot PHP: fundament potrzebny przy tablicach, łatwo wyznaczyć oczekiwany stdout i przypadki brzegowe. Zakres ograniczamy, bo legacy miesza sterowanie przepływem z dyrektywami i dołączaniem plików.

Zakres: if/elseif/else, switch, while/do-while/for/foreach, break/continue i return w małych skryptach CLI. Bez declare(ticks), dynamicznego include/require, logowania i ogólnych porównań języków.

Oceny: educationalValue=5, outdatedRisk=2, researchCost=2, codeTestability=5, securityRisk=1, scopeClarity=5, internalLinking=5, beginnerUsefulness=5.

Do sprawdzenia w osobnym researchu:

- Potwierdzić semantykę warunków, porównań switch i przerwania pętli dla jawnie wybranych wersji PHP.
- Nadać przykładom kompletne wejścia; sprawdzić pętle o zerowej/jednej iteracji i zagnieżdżone break/continue. Bez declare i include w tej lekcji.

Potencjalne linki (source IDs, nie publiczne URL): 1324, 1356, 2068.

SHA-256 źródła: `b9709b37984d1cac4aeef2d14fb49e614d2eb3d406e399117ed818b6c39799c4`.

## 2. if i else w JavaScript: warunki i walidacja wejścia

Źródło: [If i Else w JavaScript – od prostych warunków do praktycznych aplikacji](../../../temp-ogwo/posts/2068-if-i-else-w-javascript-od-prostych-warunkow-do-pra.md) · ID 2068 · JavaScript

Dlaczego: Jasny temat z czystymi funkcjami i praktyką walidacji. Źródło już odróżnia pustą wartość od liczby, ale scenariusze prędkości i kosztów niepotrzebnie zwiększają zakres; trzeba kontrolować wartości niefinitywne i białe znaki.

Zakres: Warunki, truthy/falsy, ścisłe porównania i jedna czysta funkcja analizująca wejście liczbowe; najwyżej mały formularz HTML. Bez prawa drogowego, loginu, trzech aplikacji i szerokiego kalkulatora finansowego.

Oceny: educationalValue=5, outdatedRisk=2, researchCost=2, codeTestability=5, securityRisk=1, scopeClarity=4, internalLinking=5, beginnerUsefulness=5.

Do sprawdzenia w osobnym researchu:

- Zweryfikować konwersję Number dla pustych/białych znaków, NaN i wartości niefinitywnych; ustalić kontrakt wejścia.
- Usunąć normatywne przykłady prędkości; testować gałęzie i granice, a UI osobno jako mały przykład.

Potencjalne linki (source IDs, nie publiczne URL): 1308, 2048, 940.

SHA-256 źródła: `47adb6838a319abcd781504a75f071fe88c852c63fdd9cd5300e13f7cc1fa692`.

## 3. Tablice JavaScript: map, filter, reduce i sort

Źródło: [Tablice JavaScript JS Arrays – sortowanie, filtrowanie i średnia ocen krok po kroku. Post #73](../../../temp-ogwo/posts/2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md) · ID 2048 · JavaScript

Dlaczego: Duża wartość edukacyjna i naturalny link do PHP Arrays. Stałe fixtures pozwalają dokładnie sprawdzić transformacje; źródłową narrację o niespójnym sortowaniu i precompute trzeba zweryfikować, nie powielać.

Zakres: Stała mała tablica liczb/obiektów, map/filter/reduce i sortowanie numeryczne; średnia oraz pusta tablica. Bez losowych ID, rozbudowanego UI i niesprawdzonych obietnic wydajności.

Oceny: educationalValue=5, outdatedRisk=2, researchCost=2, codeTestability=5, securityRisk=1, scopeClarity=4, internalLinking=5, beginnerUsefulness=4.

Do sprawdzenia w osobnym researchu:

- Sprawdzić mutację sort, comparator, stabilność oraz zachowanie reduce dla pustej tablicy.
- Oddzielić zaokrąglanie od obliczenia średniej; ocenić twierdzenie o ponownym obliczaniu deterministycznej średniej. Zastąpić losowe ID stałymi fixtures.

Potencjalne linki (source IDs, nie publiczne URL): 1324, 1356, 2068, 281.

SHA-256 źródła: `c6a8b0859da9d9186a3bccc697bb1f82eb382ebe498c64dfea0603635e8c42fe`.

## 4. DOM w JavaScript: selektory, tekst i zdarzenia

Źródło: [Post #45 JavaScript DOM selections i proste funkcje](../../../temp-ogwo/posts/940-post-45-javascript-dom-selections-i-proste-funkcje.md) · ID 940 · JavaScript

Dlaczego: Podstawy frontendu bez frameworka. Proste zachowania są obserwowalne, ale testy DOM wymagają rzeczywistej przeglądarki; źródło ma artefakty kopiowania, duplikaty i hover bez równoważnej obsługi klawiatury.

Zakres: Mały kompletny dokument: querySelector/querySelectorAll, brak elementu, textContent, classList, createElement i kliknięcie natywnego przycisku. Bez animacji/bibliotek i efektów zależnych tylko od hover.

Oceny: educationalValue=5, outdatedRisk=2, researchCost=2, codeTestability=4, securityRisk=2, scopeClarity=4, internalLinking=5, beginnerUsefulness=5.

Do sprawdzenia w osobnym researchu:

- Zweryfikować live collections vs statyczna lista, null i moment wykonania skryptu.
- Zaplanować krótki browser check klawiatury i bezpiecznego textContent; nie stosować dowolnego HTML z wejścia.

Potencjalne linki (source IDs, nie publiczne URL): 2068, 2048, 578.

SHA-256 źródła: `786157fe64bdabe59cdef16a614e30676d45a47b070fab6fa562ffd0b6fe715a`.

## 5. Markdown: nagłówki, linki, listy i bloki kodu

Źródło: [Post #2 język Markdown](../../../temp-ogwo/posts/48-post-2-jezyk-markdown.md) · ID 48 · Markdown

Dlaczego: Krótki, niski koszt i deterministyczne przykłady renderowania. Pomaga czytelnikom korzystać z code fences, jednak legacy miesza podstawy z przekreśleniem i rozszerzeniami bez nazwania dialektu.

Zakres: Podstawy CommonMark oraz jawnie oznaczone, potrzebne rozszerzenia GFM; minimalne wejścia i oczekiwany HTML. Bez porównania wszystkich CMS, eksportu PDF i frameworkowych atrybutów nagłówka.

Oceny: educationalValue=4, outdatedRisk=2, researchCost=1, codeTestability=5, securityRisk=1, scopeClarity=5, internalLinking=3, beginnerUsefulness=4.

Do sprawdzenia w osobnym researchu:

- Rozdzielić CommonMark od GFM i składni rozszerzeń atrybutów.
- Zweryfikować code fences, zagnieżdżanie list, escaping i poprawny przykład HTML; dobór renderera testowego dopiero w B2 danego tematu.

Potencjalne linki (source IDs, nie publiczne URL): 277, 940.

SHA-256 źródła: `8acfe3003445f48dc262e3e475da55c29360b715902cdd1de76a093e73dfb817`.

## 6. Funkcje i klasy JavaScript na przykładzie kalkulatora

Źródło: [Post #9 Calculator Math Func OOP](../../../temp-ogwo/posts/281-post-9-calculator-math-func-oop.md) · ID 281 · JavaScript

Dlaczego: Proste operacje i dwa sposoby organizacji kodu zapewniają konkretne testy. Legacy miesza proceduralne/funkcyjne, stan i UI; zawężenie daje dobrą lekcję po warunkach i DOM.

Zakres: Porównanie jednej czystej funkcji z niewielką klasą dla dodawania/odejmowania; jawne wejścia i zwrot błędu. Opcjonalnie mały formularz. Bez Person, trzech kalkulatorów i twierdzenia, że kod z funkcjami automatycznie jest funkcyjny.

Oceny: educationalValue=4, outdatedRisk=2, researchCost=2, codeTestability=5, securityRisk=1, scopeClarity=4, internalLinking=5, beginnerUsefulness=4.

Do sprawdzenia w osobnym researchu:

- Zweryfikować różnicę między funkcją, stylem proceduralnym i programowaniem funkcyjnym.
- Ustalić obsługę pustego/niepoprawnego wejścia i liczby dziesiętnej; nie maskować błędów przez || 0, UI testować osobno.

Potencjalne linki (source IDs, nie publiczne URL): 2068, 940, 2048.

SHA-256 źródła: `4740eac41f4886772f1a4908ba3dfc11365bc384734fb65290ea547d7bf53813`.

## 7. API, HTTP i JSON: od żądania do odpowiedzi

Źródło: [Post #22 Wprowadzenie do API.](../../../temp-ogwo/posts/578-post-22-wprowadzenie-do-api.md) · ID 578 · Web/API

Dlaczego: Łączy frontend z małym sprawdzalnym przykładem JSON. Priorytet niższy od czystej logiki: potrzebne rozdzielenie błędu HTTP/sieci oraz kontrolowane fixtures. Nie przenosimy źródłowego serwera Express do architektury Redactorii.

Zakres: API vs HTTP API, odczyt stałego lokalnego JSON przez fetch, status HTTP, niepoprawny JSON i błąd sieci. Bez kont, kluczy, zewnętrznego darmowego API, CRUD, Express i budowy backendu strony.

Oceny: educationalValue=5, outdatedRisk=2, researchCost=3, codeTestability=4, securityRisk=2, scopeClarity=4, internalLinking=5, beginnerUsefulness=5.

Do sprawdzenia w osobnym researchu:

- Zweryfikować semantykę fetch, response.ok/json i podstawy metod HTTP z oficjalnych źródeł.
- Przygotować kontrolowane odpowiedzi 200/404 i niepoprawny JSON; nie używać przykładowej domeny jako działającego API. Unikać obietnicy, że samo API zapewnia bezpieczeństwo.

Potencjalne linki (source IDs, nie publiczne URL): 940, 1336, 2048, 410.

SHA-256 źródła: `161efccbf72c77b0fd87280c7adc963f7d5a7b675f72f70756b2af1b51bcbf13`.

## 8. Git lokalnie: status, staging, commit i historia

Źródło: [Post #8 Mój Gist](../../../temp-ogwo/posts/277-post-8-moj-gist.md) · ID 277 · Git

Dlaczego: Podstawowe narzędzie uczenia się przez małe kroki; komendy można testować w izolowanym katalogu. Źródło to głównie promocja Gist i luźna lista poleceń, więc trzeba napisać samodzielną lekcję i poprawić składnię, nie kopiować reklamy.

Zakres: Jednorazowe lokalne repo testowe: init, status, add, diff, commit i log. Bez pushu, kont GitHub, reklamowania gistów, reset --hard, czyszczenia katalogów i automatycznych merge.

Oceny: educationalValue=4, outdatedRisk=3, researchCost=2, codeTestability=5, securityRisk=2, scopeClarity=3, internalLinking=4, beginnerUsefulness=4.

Do sprawdzenia w osobnym researchu:

- Potwierdzić polecenia staging/diff i poprawny --cached; oddzielić Git od GitHub/Gist.
- Testować na tymczasowym repo z lokalnym config, bez sieci i bez zmian globalnej konfiguracji; przyjąć jawną politykę bez destrukcyjnych operacji.

Potencjalne linki (source IDs, nie publiczne URL): 48, 281, 283.

SHA-256 źródła: `29f5f3797f45a8e5f6c9612beb0d1f98f8728785f6ff92180b9d3abfd4f6bc12`.

## 9. curl i HTTP: odpowiedź, nagłówki i lokalny JSON

Źródło: [Post #64 Curl – Twoje Terminalowe Okno na Świat](../../../temp-ogwo/posts/1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md) · ID 1336 · Tooling

Dlaczego: Praktyczna kontynuacja API z lokalnymi oczekiwanymi odpowiedziami. Różnice quoting powłok i kontrola błędów podnoszą koszt; źródło ma zlane komendy, dlatego proponowany zakres jest znacznie mniejszy.

Zakres: GET, HEAD, status, nagłówki i jeden mały JSON względem kontrolowanego lokalnego endpointu. Jawne warianty Bash/PowerShell. Bez JWT, Basic Auth, cookies, proxy, cronów i porównania wszystkich protokołów curl/wget.

Oceny: educationalValue=4, outdatedRisk=3, researchCost=3, codeTestability=4, securityRisk=2, scopeClarity=4, internalLinking=5, beginnerUsefulness=4.

Do sprawdzenia w osobnym researchu:

- Sprawdzić opcje curl i exit status z oficjalnym manualem dla jawnego runtime.
- Zbudować w LAB kontrolowane fixtures HTTP zamiast polegać na bit.ly/public API; zweryfikować składnię Bash i PowerShell. Wykluczyć sekrety i auth.

Potencjalne linki (source IDs, nie publiczne URL): 578, 410, 277.

SHA-256 źródła: `354c16de83a9f44d0d924b3eea7e087f773b10b717bcb8781b47c3564ac43401`.

## 10. Podstawy Pythona: wartości, warunki, pętle i funkcje

Źródło: [Post #10 Python Crash Course](../../../temp-ogwo/posts/283-post-10-python-crash-course.md) · ID 283 · Python

Dlaczego: Fundamentalny temat poszerza pilot, ale jest poza preferowanym rdzeniem PHP/JS i wymaga osobnego runtime. Legacy ma luźne wklejki i wiele odgałęzień, więc ograniczony zakres jest konieczny.

Zakres: Małe skrypty czystego Python: typy, if, range i funkcja; stałe wejścia i stdout. Bez scrapingu, requests/BeautifulSoup, AI, CDN, losowej gry i porównania C jako osobnej lekcji.

Oceny: educationalValue=4, outdatedRisk=2, researchCost=3, codeTestability=5, securityRisk=1, scopeClarity=3, internalLinking=3, beginnerUsefulness=4.

Do sprawdzenia w osobnym researchu:

- Zweryfikować przykłady z oficjalnym tutorialem dla jawnie wybranej wersji Python.
- Sprawdzić ukryte znaki/wcięcia i kompletność snippetów; bez pobierania repo kursu ani polegania na zewnętrznym filmie.

Potencjalne linki (source IDs, nie publiczne URL): 1308, 2003, 277.

SHA-256 źródła: `ca517d073632503903aaedf853cfe13e99a863b52c3939ef6330c2d84115b0e5`.

## Odłożona shortlista

- 410 — Post #11 API Advanced Programming Interface: Silny overlap z 578, błąd w rozwinięciu skrótu API i dominacja opisu Express/JSON-Server. Osobny wybór dublowałby wprowadzenie; ewentualny MERGE wymaga nowego approval, nie jest wykonywany w B1.
- 1166 — Post #58 PHP Kodowanie i znaki specjalne: Źródło łączy XSS, encje, charset, locale, MySQL i daty. Nawet ważny edukacyjnie temat wymaga większego researchu security i środowisk niż pierwszy prosty batch; nie oceniamy go jako uniwersalnie bezpiecznego.
- 542 — Post #17 Przegląd JS Html CSS: Tytuł sugeruje podstawy, ale body nie dostarcza kodu HTML/CSS ani konkretnej lekcji. Wybranie go tylko dla pokrycia HTML/CSS wymagałoby nowej treści, nie modernizacji ograniczonego materiału.
- 551 — Post #18 Front-End Jakie są wymagania ?: Szeroka lista frameworków, narzędzi, AWS/Azure i wymagań juniora jest niejasna i trudna do kodowego sprawdzenia. Odłożone zamiast przedstawiać zestaw opinii jako minimum dla początkujących.
- 1575 — Post #66 – Jak zbudować środowisko programistyczne na Windows Visual Studio Code, Git, Node.js: Instrukcje instalatorów, Settings Sync, rozszerzenia i create-react-app zwiększają koszt aktualności oraz zależność od OS. Git 277 ma bardziej kontrolowalny lokalny zakres na pierwszy batch.
- 514 — Post #13 CRUD: Trwałe zapisy, request.body i pełny CRUD wymagają walidacji, obsługi błędów, konkurencji i zależności. Wyższy koszt/security niż read-only JSON; nie wprowadzamy backendu do strony.
- 977 — Post #52 Jakie są PHP i Python: Szerokie porównanie języków, hostingu i frameworków zawiera powtórzenia i generalizacje. Małe lekcje 1308/283 oferują lepszą bazę testów i jaśniejszą wartość.
- 2003 — Jak zacząć naukę Pythona w Windows i Visual Studio Code Post #70: Wartościowy onboarding, ale wersje instalatorów/PATH/rozszerzeń wymagają aktualnej weryfikacji OS; brakuje zapowiedzianej sekcji venv. Pierwszy Python pilot ograniczamy do języka, a nie instalacji.
- 1789 — Zrównoważony web design – jak tworzyć harmonijne i estetyczne strony internetowe Post #67: Tekst opisuje estetykę bez kodu i testowalnych ćwiczeń. Wprowadzenie HTML/CSS tylko dla różnorodności wymagałoby większej nowej pracy niż kandydaci z konkretnymi fragmentami.

## Ograniczenia i następny krok

- Pełne body odczytano tylko dla 19 shortlistowanych źródeł; pozostałe 64 odłożono na podstawie metadanych (w tym dwie już opracowane części PHP Arrays). Nie jest to ranking technicznej jakości wszystkich 83 tekstów.
- Oceny 1–5 są szacunkami redakcyjnymi, nie pomiarami kosztu, czasu ani gotowości do publikacji. Dotyczą ograniczonego proponowanego zakresu; research może zmienić kolejność lub odrzucić temat.
- Nie sprawdzano oficjalnej dokumentacji, zewnętrznych repozytoriów/Gist ani wykonywania kodu. Cytat świadczy o zawartości legacy, nie o prawdziwości twierdzenia. Techniczne kwestie są wyłącznie research needs.
- Brak wystarczająco konkretnego małego tutorialu HTML/CSS w shortlistowanych tekstach. Nie wypełniano kwoty nową treścią; wybór obejmuje fundamenty PHP/JS, read-only API, Markdown, Git, curl i mały Python.
- Możliwe linki to istniejące source IDs, nie obietnica publicznych tras. Dwie części PHP Arrays wskazują wspólny już opublikowany artykuł; nowy ranking ich nie liczy.
- Każdy wybór wymaga osobnej decyzji człowieka przed pełnym pipeline i osobnej publication approval po Critic PASS. B1 nie uruchamia B2 ani agentów.
- Tokeny, koszt modelu i godziny researchu nie były mierzone; structured metryki mają null. Historyczne LAB/SOURCE/CONTENT pozostają niezmienione.

STOP B1. Następny osobny etap: B2 — wyłącznie rank #1, po decyzji człowieka. Potem ocena pipeline, następne 3 i kolejna ocena przed ostatnimi 6.

Request SHA-256: `df9b31244a478aa3a1586f51f1b6e653977d93626bcd46b372e23038085f67bf`. Inventory SHA-256: `3a715b48a0feb57374790c8954ddcfceef102ab0cd135b40919c6686cd192039`.

Tokeny, koszt modelu i godziny researchu: null (nie były mierzone).
