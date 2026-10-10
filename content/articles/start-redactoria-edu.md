---
title: "Start pilota Redactoria EDU"
description: "Dlaczego budujemy statyczną bazę wiedzy i jak oddzielamy źródła, LAB oraz opublikowane treści."
slug: "start-redactoria-edu"
status: published
created: 2026-10-08
updated: 2026-10-10
domain: software-engineering
topic: redactoria
author:
  type: ai-assisted
  name: Scripterix
sources: []
origin:
  type: native
review:
  status: approved
  reviewer: Scripterix
  confidence: 1
automation:
  generated: false
  last_checked: null
  update_priority: normal
redactoria:
  decision: keep
  modernization: none
---

Redactoria EDU jest pierwszym praktycznym pilotem systemu do rozwijania i utrzymywania
wyspecjalizowanych serwisów wiedzy. Zaczynamy od programowania, web developmentu,
sztucznej inteligencji i software engineeringu. Nie od pustej kartki, lecz od
istniejącego dorobku: 83 historycznych artykułów zachowanych w eksporcie bloga.

## Dlaczego odzyskujemy starsze treści

Dobry przykład czy jasno opisana idea nie tracą wartości tylko dlatego, że zmienił
się silnik bloga. Jednocześnie stare teksty mogą zawierać nieaktualne reguły,
powtórzenia i luki. Chcemy rozpoznać, co warto zachować, co wymaga sprawdzenia,
a co lepiej połączyć lub pozostawić w archiwum. Liczba nowych artykułów nie jest
miarą sukcesu. Jest nią użyteczny i sprawdzalny materiał.

Pierwszym przykładem tej pracy są [tablice w PHP](/artykuly/tablice-w-php/).
Dwa teksty historyczne stały się podstawą jednej lekcji dla PHP 8.4–8.5.
To pierwszy publiczny artykuł pilota po pełnej ścieżce redakcyjnej i akceptacji
człowieka. Dostępne materiały znajdziesz w [spisie artykułów](/artykuly/),
a obszary wiedzy na stronie [tematów](/tematy/).

## Pięć przestrzeni, pięć odpowiedzialności

Rozdzielenie danych jest ważniejsze niż nazwa narzędzia:

- **SOURCE** — niezmienione oryginały. Możemy je czytać, nie poprawiamy ich w miejscu.
- **LAB** — prywatny warsztat: mapy, research, drafty, oceny i decyzje. To nie serwis publiczny.
- **ENGINE** — moduły agentów i deterministyczne narzędzia, które wspierają pracę redakcji.
- **CONTENT** — materiały dopuszczone przez człowieka do konkretnego etapu publikacji.
- **WEBSITE** — statyczna strona Astro, która przedstawia zaakceptowane treści czytelnikowi.

SOURCE ≠ LAB ≠ ENGINE ≠ CONTENT ≠ WEBSITE. Dzięki temu nieudany eksperyment w LAB
nie zmienia oryginałów i nie staje się samoczynnie artykułem na stronie.

## Od mapy do decyzji człowieka

Deterministyczny scanner tworzy inwentaryzację. Cartographer rozpoznaje związki,
pokrycie tematów i możliwe dalsze działania. Researcher sprawdza wskazane kwestie
i przygotowuje pakiet dowodów. Writer buduje draft na zatwierdzonej podstawie,
a Critic ocenia go względem źródeł, czytelności i wymagań zadania.

Wynik Critic PASS nie jest zgodą na publikację. Następny krok należy do człowieka:
review, jawna akceptacja i określenie zakresu. Mały Promotion Gate sprawdza decyzję,
hashe i wcześniejsze zgody, zanim przeniesie dokładnie ocenioną treść do CONTENT.
Nie redaguje tekstu i nie uruchamia kolejnych agentów.

Więcej o rolach i granicach przeczytasz w [opisie projektu](/o-projekcie/#proces).

## Jak sprawdzamy jakość

Interpretację oddzielamy od evidence: konkretnego źródła, fragmentu dokumentacji
lub rzeczywistego wyniku uruchomienia. Zanim zaufamy staremu przykładowi, sprawdzamy
go względem dokumentacji i docelowej wersji środowiska. Przy PHP wykonano lokalnie
próby na PHP 8.4.26 i 8.5.11, a następnie wszystkie 17 samodzielnych przykładów
lekcji na obu wersjach. To nie deklaracja testu każdej możliwej aplikacji.

Kontrakty agentów, wymagane evidence, zakresy confidence i granice zapisu mają
deterministyczne testy bez zewnętrznych wywołań LLM. Treści przechodzą walidację
Content Collections, projekt przechodzi testy, check i statyczny build, a końcowy
układ wymaga obejrzenia w przeglądarce — również na małym ekranie.

## Co działa, co jest przed nami

**NOW:** odzyskany korpus, mapa wiedzy, cztery ręcznie uruchamiane moduły agentów,
pakiet researchu, oceniony draft, formalna bramka promocji i mały serwis Astro.
Pierwszy artykuł techniczny jest dostępny w serwisie; publiczne materiały można
znaleźć także przez [wyszukiwarkę](/szukaj/).

**NEXT:** ocena pierwszej publikacji, a po osobnej decyzji stopniowy pilot
modernizacji około dziesięciu artykułów. Chcemy też poprawiać nawigację między
tematami i sprawdzić proste formy interaktywnej edukacji. To kierunek, nie gotowe funkcje.

**LATER:** wielojęzyczność, Knowledge Navigator, rozmowa z wiedzą w trybie Ask/LM,
kolejni agenci i obsługa wielu serwisów. Te pomysły nie są obecnie wdrożone.
Nie ma automatycznego Publishera, Dispatchera ani harmonogramu publikacji.

Zacznij od [lekcji o tablicach](/artykuly/tablice-w-php/) lub zobacz
[kierunek rozwoju projektu](/o-projekcie/#kierunek). Rozwijamy Redactorię małymi,
sprawdzalnymi krokami, zachowując historię materiałów i odpowiedzialność człowieka.
