# Redactoria LAB

LAB jest roboczą przestrzenią Redactorii. Materiały znajdujące się tutaj **nie są
automatycznie publikowane** i nie są ładowane przez Astro Content Collections.

```text
SOURCE (read-only) → LAB (work in progress) → human review → content/ (published)
```

## Katalogi

- `inventory/` — deterministyczny katalog źródłowego korpusu.
- `candidates/` — kandydaci do analizy oraz technicznie sprawdzone publication candidates;
  nie są zaakceptowaną publikacją ani publicznym CONTENT.
- `research/` — źródła, ustalenia i sprawdzenie aktualności technicznej.
- `drafts/` — robocze wersje nowych lub modernizowanych materiałów.
- `reviews/` — oceny Critica dotyczące dokładnego draftu; PASS nie jest akceptacją publikacji.
- `decisions/` — propozycje decyzji redakcyjnych i wyniki review; `proposed` nie
  oznacza akceptacji ani zgody na publikację.
- `cartography/` — walidowana mapa wiedzy, propozycje redakcyjne i audytowe wejścia
  oraz odpowiedzi modelu Cartographera.
- `reports/` — raporty zbiorcze, w tym wyniki Cartographera 0.1.

## Zasady

1. Źródłowy korpus pozostaje niezmieniony.
2. Brakujące dane oznaczamy jako `null`, `unknown` lub `needs-review`.
3. Research i draft nie są zgodą na publikację.
4. Tylko zaakceptowany materiał może zostać przeniesiony do `content/`.
5. Każda opublikowana modernizacja zachowuje proweniencję oryginału.
6. Nie wykonujemy automatycznego merge ani publikacji.

## Inventory

`npm run inventory -- ../temp-ogwo/posts` aktualizuje wyłącznie
`inventory/inventory.json` i `reports/corpus-summary.md`. Status `parse_status`
opisuje odczyt metadanych. Każdy rekord zachowuje `review_status: unreviewed`, nawet
jeśli metadane są poprawne; inventory nie zatwierdza materiałów do publikacji.

## Cartographer

`npm run cartographer` odtwarza jawnie importowaną analizę pierwszej sesji Codex
zapisując tylko mapę, projekcję kandydatów i raport w LAB. Odpowiedzi są powiązane
hashami z dokładnymi requestami; niezgodne lub niepoprawne wyniki są odrzucane.
Propozycje KEEP/UPDATE/MERGE/SPLIT/ARCHIVE/REVIEW/NEW_CONTENT wymagają decyzji człowieka.
Przygotowanie nowej analizy i limit selektywnych odczytów opisuje
[kontrakt Cartographera](../docs/architecture/cartographer.md).

Focused run (`--task merge` i dokładnie dwa `--focus`) zapisuje plan porównania
pełnych tekstów oraz proponowaną strukturę w `cartography/`, raport w `reports/`
i — tylko przy rekomendacji MERGE — propozycję w `decisions/`. Nie aktualizuje
wcześniejszej mapy całego korpusu. Propozycja ma status `proposed` oraz hash analizy
i źródeł do sprawdzenia przed review. Nie uruchamia researchu ani pisania artykułu.

Decyzja PHP MERGE została następnie zatwierdzona przez człowieka: `approved`,
`approvedBy: human`, `nextStep: research`. Raport i plan Cartographera pozostają
historycznym zapisem analizy. Writer LAB blokuje zastąpienie zatwierdzonej decyzji;
akceptacja nie wykonuje MERGE ani nie uruchamia kolejnego agenta.

## Researcher

Osobno zaakceptowany milestone Researcher 0.1 utworzył
[Research Packet PHP arrays](research/php-arrays/research.md). Structured JSON jest
kontraktem; raport jest jego projekcją. Snapshot oficjalnych dokumentów i kontrolowane
próby kodu są oddzielone od importowanej interpretacji sesji. Powtórzenie polecenia
`npm run researcher -- --decision lab/decisions/php-arrays-merge-proposal.json`
nie odświeża źródeł ani nie wykonuje nowej inferencji. Zapis tylko LAB/research;
approved decision i Cartographer pozostają niezmienione. Research nie jest zgodą
na artykuł ani publikację. Kolejny approval gate zapisał
[akceptację człowieka](decisions/php-arrays-research-approval.json) po rzeczywistej
[weryfikacji PHP 8.4.26 / 8.5.11](research/php-arrays/runtime-verification.md).
Pierwotny pakiet i evidence nie zostały przepisane; runtime addendum jest obowiązkowe
dla Writera. `nextStep: writer` oznacza kolejny etap, nie jego automatyczne rozpoczęcie.

## Writer / Critic

Osobno zlecony Milestone 4 utworzył [draft PHP arrays](drafts/php-arrays/article.md)
i [review Critica](reviews/php-arrays/critic-review.md). Pierwszy pilot wykonał jeden
przebieg każdego modułu; structured JSON pozostaje kontraktem, Markdown jego projekcją. Weryfikacja
17 nowych bloków na obu docelowych runtime’ach jest oddzielnym evidence, nie zmianą
Research Packet. Pierwszy REVISE został zachowany. Osobna decyzja człowieka zezwoliła
na trzy małe poprawki prozy i jeden nowy pełny review: PASS. Kod i wcześniejsze wyniki
PHP nie zmieniły się; nie wykonano nowego generowania ani automatycznej pętli.

## First publication candidate

Milestone 5 utworzył [kandydata PHP arrays](candidates/php-arrays/article.md), dokładną
kopię wersji ocenionej jako PASS, z walidowanymi metadanymi i hashami w LAB.
`publication-candidate` oznacza **AWAIT HUMAN PUBLICATION DECISION**, nie
`approved-for-publication` ani `published`. Brak przeniesienia do CONTENT lub deployu.
