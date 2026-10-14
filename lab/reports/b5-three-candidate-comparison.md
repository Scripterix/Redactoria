# B5 — porównanie trzech kandydatów

Status: **COMPLETE IN LAB ONLY**. Nie wykonano publikacji, zapisu do CONTENT,
commitu, pushu ani deployu.

| Rank | Kandydat | SOURCE | Słowa | Oficjalne źródła | Przykłady | Runtime | Critic |
|---:|---|---:|---:|---:|---:|---|---|
| #8 | Git lokalnie | 277 | 364 | 6 | 3 | Git 2.21.0.windows.1 | PASS |
| #9 | curl i HTTP | 1336 | 311 | 2 | 2 | curl 8.13.0 | PASS |
| #10 | Podstawy Pythona | 283 | 260 | 2 | 3 | Python 3.14.5 i 3.11.9 | PASS |

## Wynik

- Wszystkie trzy pozycje zaakceptowanej kolejki przeszły ponowną weryfikację jako
  `PROCEED`; nie trzeba było szukać kandydatów zastępczych.
- Każdy job zachował osobne etapy Cartographer → Researcher → akceptacja researchu
  → Writer → wykonanie przykładów → Critic → dokładny kandydat.
- Trzy Research Packety zawierają łącznie 10 zweryfikowanych faktów, 3 korekty
  materiałów legacy i 0 nierozstrzygniętych pytań.
- Osiem finalnych przykładów przeszło 4 rzeczywiste wykonania runtime i 33
  asercje. Pythonowe 3 przykłady wykonano w obu wersjach, dlatego evidence zawiera
  6 wyników przykładów, ale artykuł ma 3 unikalne bloki.
- Każdy pierwszy pełny Critic zwrócił `PASS`, bez issues i bez wymaganych zmian.
  Kandydaci są dokładni, ale nadal mają `pending` / `false` i oczekują osobnej
  decyzji człowieka.

## Ograniczenia

- Git sprawdzono w izolowanym lokalnym repozytorium, z konfiguracją autora tylko
  dla niego. Zakres nie obejmuje GitHub, push, merge, stash, `reset --hard` ani
  konfiguracji globalnej.
- curl działał wyłącznie przeciw kontrolowanemu serwerowi `127.0.0.1`; wynik nie
  jest testem dowolnego zewnętrznego API ani sieci produkcyjnej.
- Python przeszedł w 3.14.5 i 3.11.9. Normalizacja CRLF → LF na Windows jest jawna
  i ograniczona do porównania oczekiwanego tekstu wyjściowego.

## Granica następnej decyzji

B5 kończy się w LAB. Human review może zatwierdzić, odrzucić lub odesłać każdy
kandydat osobno. Ten raport nie upoważnia Promotion Gate, zapisu do CONTENT,
commita, pushu ani deploymentu.
