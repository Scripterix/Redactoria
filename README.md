# Redactoria EDU

Pierwszy pilot projektu Redactoria: statyczny serwis edukacyjny o programowaniu,
web developmencie, AI i software engineeringu.

Projekt ma trzy wyraźnie oddzielone obszary:

- **Website** — publiczna strona Astro i zatwierdzone treści.
- **LAB** — materiały robocze, research, propozycje i decyzje redakcyjne.
- **Redactoria Engine** — niezależna warstwa automatyzacji. Pilot zawiera pierwszy
  ręcznie uruchamiany moduł Cartographer 0.1; pełny Engine pozostaje przyszłością.

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
research, jeszcze nie uruchomiony. Powyższy zapis focused run jest teraz blokowany,
aby nie nadpisać `approved` nową propozycją. Raport Cartographera pozostaje zapisem
historycznej rekomendacji, a aktualna akceptacja znajduje się w pliku decyzji.
