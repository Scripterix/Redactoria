# Redactoria EDU

Pierwszy pilot projektu Redactoria: statyczny serwis edukacyjny o programowaniu,
web developmencie, AI i software engineeringu.

Projekt ma trzy wyraźnie oddzielone obszary:

- **Website** — publiczna strona Astro i zatwierdzone treści.
- **LAB** — materiały robocze, research, propozycje i decyzje redakcyjne.
- **Redactoria Engine** — niezależna warstwa automatyzacji. Pilot zawiera
  ręcznie uruchamiane moduły Cartographer, Researcher, Writer i Critic 0.1; pełny Engine pozostaje przyszłością.

Materiały w LAB nie są automatycznie publikowane. Źródłowy korpus artykułów jest
traktowany jako tylko do odczytu.

## Wymagania

- Node.js 22.12 lub nowszy
- npm

## Uruchomienie

```sh
npm install
npm run dev
```

## Kontrola jakości

```sh
npm run test
npm run check
npm run build
```

Tryb obserwowania testów podczas pracy uruchamia `npm run test:watch`. Podgląd
produkcyjnego buildu jest dostępny przez `npm run preview`.

`npm run build` wykonuje Astro build, a następnie oficjalne Pagefind CLI,
tworząc statyczny indeks w `dist/pagefind/`. Wyszukiwarka jest pod `/szukaj/`;
obejmuje publiczną treść stron, artykułów i tematów, bez wspólnego headera/footera
i samej strony wyszukiwania. LAB ani dokumentacja nie trafiają do buildu.
Testuj ją przez `npm run preview` po buildzie — zwykły dev server nie generuje indeksu.

## Zasady architektury

- Astro jest nadrzędną warstwą publikacyjną.
- Strony i artykuły są domyślnie generowane statycznie.
- React może być używany wyłącznie jako lokalne Islands.
- Treść jest oddzielona od komponentów prezentacyjnych.
- Git przechowuje historię zmian i decyzji redakcyjnych.
- Nie ma automatycznego merge ani publikacji.

Punktem wejścia do dokumentacji jest [Project Brain](docs/index.md). Decyzje
architektoniczne znajdują się w [`docs/adr`](docs/adr/).
Szybki stan projektu i przekazanie kolejnej sesji: [STATUS](docs/STATUS.md).

## Źródłowy korpus

Historyczne posty znajdują się w osobnym repozytorium:

<https://github.com/Scripterix/temp-ogwo/tree/main/posts>

Repozytorium źródłowe nie może być modyfikowane przez narzędzia Redactorii. Jego
lokalna ścieżka jest przekazywana scannerowi przez argument CLI.

Scanner tworzy inventory i raport w LAB:

```sh
npm run inventory -- ../temp-ogwo/posts
```

Opcjonalne `--output <katalog-lab>` pozwala wskazać inny katalog wynikowy. Oryginalne
pliki pozostają bez zmian. Szczegółowy kontrakt i sposób przygotowania kopii źródłowej
opisuje [dokumentacja inventory](docs/architecture/inventory.md).

## Cartographer 0.1

Pierwszy runtime agent analizuje inventory i wybrane teksty, tworząc mapę wiedzy,
propozycje luk oraz kandydatów redakcyjnych. Nie wykonuje tych propozycji.

Powtórzenie pierwszej analizy:

```sh
npm run cartographer
```

Ten przebieg importuje jawnie oznaczoną analizę sesji Codex z
`lab/cartography/session-responses.json`. Nie wykonuje nowego wywołania API ani
inferencji. Zmiana wejść, promptu lub limitów wymaga nowych odpowiedzi modelu.

Wyniki to `lab/cartography/knowledge-map.json`,
`lab/cartography/editorial-candidates.json` i `lab/reports/cartographer-001.md`.
Sposób przygotowania nowej analizy, kontrakt i limity opisuje
[dokumentacja Cartographera](docs/architecture/cartographer.md).

Focused run dla dwóch części lekcji o tablicach PHP:

```sh
npm run cartographer -- --focus 1324-post-61-tablice-w-php-czesc-1.md --focus 1356-post-62-php-tablice-czesc-ii.md --task merge
```

Czyta tylko te dwa pełne teksty. Odtwarza jawnie importowaną analizę tej sesji,
bez zewnętrznego API i bez ponownej analizy całego korpusu. Wyniki:
[plan JSON](lab/cartography/php-arrays-merge.json),
[raport i struktura artykułu](lab/reports/php-arrays-merge.md) oraz
[propozycja decyzji](lab/decisions/php-arrays-merge-proposal.json) ze statusem
`proposed`, nigdy automatycznie `approved`. Nie tworzy artykułu ani nie modyfikuje
SOURCE/CONTENT. Nowy import przygotowuje `--prepare merge` z tymi samymi argumentami.

Obecna decyzja PHP MERGE została zatwierdzona przez człowieka; następny krok to
research, którego pierwszy pakiet jest już gotowy. Powyższy zapis focused run jest teraz blokowany,
aby nie nadpisać `approved` nową propozycją. Raport Cartographera pozostaje zapisem
historycznej rekomendacji, a aktualna akceptacja znajduje się w pliku decyzji.

## Researcher 0.1

```sh
npm run researcher -- --decision lab/decisions/php-arrays-merge-proposal.json
```

Odtwarza jawny import analizy sesji bez API i bez ponownej analizy korpusu. Czyta
dokładnie dwa zatwierdzone teksty, waliduje evidence i zapisuje tylko
[Research Packet JSON](lab/research/php-arrays/research.json) oraz
[raport/handoff](lab/research/php-arrays/research.md) w LAB. Fakty pochodzą z 34
oficjalnych dokumentów PHP, nie z pamięci modelu. Pierwotne próby na PHP 8.2.4
pozostają w niezmienionym pakiecie. Oddzielna [weryfikacja runtime](lab/research/php-arrays/runtime-verification.md)
przeszła na rzeczywistym PHP 8.4.26 i 8.5.11: po 12 prób i 60 asercji; zawiera
obowiązkowe uzupełnienie o deprecacji offsetów `null` w PHP 8.5.
[Research approval](lab/decisions/php-arrays-research-approval.json) zapisuje decyzję
człowieka: `approved`, `approvedBy: human`, `nextStep: writer`.
Instrukcje: [Researcher](docs/architecture/researcher.md). Writer/Critic został
następnie osobno uruchomiony w Milestone 4. Publiczny deployment wymaga osobnej zgody.

## Writer / Critic 0.1

Manualne, osobne komendy odtwarzające jawny import sesji:

```sh
npm run writer -- --topic php-arrays
npm run critic -- --draft lab/drafts/php-arrays/article.md
```

Pierwszy pilot wykonał po jednym przebiegu i zatrzymał się na REVISE. Osobne polecenie
człowieka zezwoliło na małą korektę zdania o reduce i dwie poprawki czytelności prozy,
bez nowego generowania. [Draft](lab/drafts/php-arrays/article.md) ma teraz 2559 słów
części opisowej. Kod 17 bloków i zachowane rzeczywiste wyniki PHP 8.4.26/8.5.11
nie zmieniły się; nie wykonywano nowych prób. Jeden nowy pełny
[Critic review](lab/reviews/php-arrays/critic-review.md) zwrócił PASS.
Oryginalny draft, wykonania i pierwszy review zachowano. Default Writer CLI powyżej
odtwarza pierwotne generowanie, nie korektę; nie uruchamiaj go do promocji kandydata.
Te runtime agents nie zapisują do CONTENT ani nie publikują.
Kontrakty, prepare-only import, ograniczenia i evidence:
[Writer/Critic](docs/architecture/writer-critic.md).

## First publication candidate

Milestone 5: [kandydat PHP arrays](lab/candidates/php-arrays/article.md) jest dokładną
kopią wersji z PASS. [Metadane i audyt](lab/candidates/php-arrays/README.md) zachowują
hashe i provenance. Historyczny status kandydata M5 pozostaje publication-candidate
i pending. Oddzielna nowa decyzja człowieka autoryzuje wyłącznie lokalny test.

## Local publication / visual review

```sh
npm run promote -- --candidate lab/candidates/php-arrays/article.json --decision lab/decisions/php-arrays-publication.json
```

[Promotion Gate](engine/promotion/README.md) sprawdza zgody, Critic PASS, dokładne
hashe, schema/temat i kolizję slugu. Pierwszy przebieg już promował niezmienione
Markdown do `content/articles/tablice-w-php.md`; powtórzenie odmawia nadpisania.
[Audyt](lab/reports/tablice-w-php-promotion.json) zachowuje pełne provenance.

`npm run dev -- --background` udostępnia [localhost](http://localhost:4321/).
[PHP Arrays](http://localhost:4321/artykuly/tablice-w-php/) i pozostałe adresy
czekają na [human visual review](docs/plans/completed/008-local-promotion-website-review.md).
Plan 009 dodał czas czytania, mapę strony, oficjalne sitemap XML, powrót na górę
i lekkie Copy code. Tests 230/230, check PASS, build 9 stron. Nie wykonano
commit/push/deploy. Nie uruchamiać Publishera ani Dispatchera bez osobnej decyzji.
