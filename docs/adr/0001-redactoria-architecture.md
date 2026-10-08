# ADR 0001: Rozdzielenie Website, LAB i przyszłego Engine

- Status: przyjęta
- Data: 2026-10-08

## Kontekst

Redactoria EDU jest pierwszym pilotem systemu, który docelowo ma wspierać wiele
wyspecjalizowanych serwisów. Pilot musi umożliwić pracę z historycznym korpusem,
eksperymenty redakcyjne i publikowanie zatwierdzonych materiałów, ale nie powinien
jeszcze zawierać pełnego autonomicznego Engine.

Najważniejszym ryzykiem jest przypadkowe połączenie materiałów źródłowych,
eksperymentów i publicznej treści w jeden proces publikacyjny.

## Decyzja

System dzielimy na trzy niezależne warstwy:

```text
Website != LAB != future Redactoria Engine
```

### Website

- Astro jest nadrzędną warstwą publikacyjną.
- HTML jest domyślnie generowany statycznie.
- Zatwierdzone treści są ładowane przez Astro Content Collections.
- React jest dozwolony wyłącznie jako lokalne Islands wymagające interakcji.
- Strona działa niezależnie od dostępności przyszłego Engine.

### LAB

- LAB przechowuje inventory, kandydatów, research, drafty, decyzje i raporty.
- Materiał w LAB nie jest automatycznie publikowany.
- Przeniesienie treści z LAB do publicznej kolekcji wymaga jawnego review.
- Korpus źródłowy pozostaje niezmieniony.

### Przyszły Redactoria Engine

- Engine będzie niezależny od konkretnej witryny Astro.
- Dispatcher będzie sterował wykonaniem pojedynczych jobów.
- Domyślna zasada przyszłej orkiestracji to: jeden run, jeden job, jedna gałąź
  agenta, zapis wyniku i stop.
- Automatyczny merge i automatyczna publikacja są domyślnie wyłączone.

W przyszłej strukturze każdy katalog `engine/agents/<agent-name>/` będzie oznaczał
osobnego agenta-moduł, a nie techniczną kategorię plików. Agent będzie posiadał
własną odpowiedzialność, kontrakt wejścia i wyjścia, polityki, walidację oraz testy.
Agenci nie będą uruchamiali siebie nawzajem bezpośrednio; kontrola przepływu należy
do Dispatchera. Wspólne usługi, repozytoria, adaptery i orkiestracja pozostaną poza
`engine/agents/`.

Struktura Engine ani moduły agentów nie są implementowane w Milestone 0.

## Git jako pamięć redakcyjna

Git przechowuje historię treści i decyzji. Docelowy przepływ to propozycja, branch,
diff, testy, review i dopiero potem merge. W pilocie żaden krok nie wykonuje
automatycznego merge ani publikacji.

## Konsekwencje

- Publiczna strona może działać bez Engine.
- Eksperymenty nie trafiają przypadkowo do publikacji.
- Źródło, materiały robocze i treść finalna zachowują osobną historię.
- Przyszły Engine można rozwijać bez przebudowy warstwy Astro.
- Pilot wymaga jawnych przejść pomiędzy SOURCE, LAB i PUBLISHED CONTENT.
