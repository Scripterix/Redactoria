# B3 — porównanie pięciu próbek

Status: **COMPLETE IN LAB ONLY**. Nie wykonano publikacji, promocji, commitu, pushu ani deployu.

| Próbka | Język | Słowa | Candidate schema | Critic B3 | Korekty B3 |
|---|---:|---:|---:|---:|---:|
| php-arrays | PHP | 2559 | 1 | — | — |
| php-control-flow | PHP | 1663 | 2 | — | — |
| javascript-if-else | JavaScript | 256 | 3 | 1 | 0 |
| javascript-arrays | JavaScript | 279 | 3 | 1 | 0 |
| javascript-dom | JavaScript | 260 | 3 | 1 | 0 |

## Wnioski

- Wszystkie pięć próbek kończy się recenzowanym artefaktem LAB; tylko wcześniejsze próbki PHP mają kontrakt Promotion Gate.
- B3 uogólnia kontrakty runtime z PHP na Node i kontrolowaną przeglądarkę, bez zmiany zachowania historycznych artefaktów.
- Trzy joby B3 przeszły pierwszy pełny Critic, więc ścieżka ograniczonej korekty pozostała niewykonana zgodnie z warunkiem.

## Quality Gaps

- Drafty B3 są krótsze niż obie próbki PHP i przed publikacją mogą wymagać ludzkiej oceny tempa, przykładów oraz języka.
- DOM sprawdzono w jednej wersji Chromium; nie ma macierzy cross-browser ani testów wizualnych.
- Nie zmierzono czasu całego przebiegu ani tokenów, ponieważ licznik nie został uruchomiony przed startem; pola pozostają null.

## Knowledge Gaps

Brak nierozstrzygniętych pytań w trzech zwalidowanych pakietach B3. To nie znaczy, że zakres został rozszerzony poza pytania tych jobów.

## Metryki B3

- 12 jawnych wywołań ról zapisanych w replayach (po 4 na job).
- 3 pełne iteracje Critic; 0 korekt; 1 wspólne zdarzenie autoryzacji człowieka.
- Czas end-to-end i tokeny: nieznane (null), bez estymowania.
