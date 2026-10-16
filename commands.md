# Redactoria — komendy Engine i Astro CLI

Praktyczna ściąga do uruchamiania poleceń z katalogu głównego repozytorium.
Bloki są zapisane dla Bash (Git Bash, WSL, Linux lub macOS). Same polecenia `npm`
działają również w PowerShellu.

> **Najważniejsza zasada:** `SOURCE != LAB != ENGINE != CONTENT != WEBSITE`.
> Każdy etap kończy się `STOP` i wymaga sprawdzenia wyniku. Nie uruchamiaj całego
> pipeline'u jako jednego skryptu. Engine nie daje zgody redakcyjnej, nie wykonuje
> `git push` i nie wdraża strony.

## 1. Start i szybka kontrola

```sh
cd /sciezka/do/asto

node --version             # wymagane: Node.js >= 22.12
npm --version
npm ci                     # instalacja dokładnie z package-lock.json
git status --short         # sprawdź istniejące zmiany przed pracą
```

Pomoc dla poleceń projektu:

```sh
npm run inventory -- --help
npm run cartographer -- --help
npm run researcher -- --help
npm run select:pilot -- --help
npm run astro -- --help
```

### Operator Mode — read-only `verify:article`

Sprawdzenie kompletnego istniejącego lifecycle jednego artykułu:

```sh
npm run verify:article -- --topic php-control-flow
```

Dostępne tematy operatorskie:

```sh
npm run verify:article -- --topic php-arrays
npm run verify:article -- --topic php-control-flow
npm run verify:article -- --topic javascript-if-else
npm run verify:article -- --topic javascript-arrays
npm run verify:article -- --topic javascript-dom
npm run verify:article -- --topic php-language-foundation
npm run verify:article -- --topic javascript-language-foundation
npm run verify:article -- --topic javascript-functions-callbacks
```

Wynik zgodny z kontraktem, przeznaczony dla narzędzi:

```sh
npm run verify:article -- --topic javascript-dom --json
# czysty JSON bez standardowego nagłówka npm:
npm run --silent verify:article -- --topic javascript-dom --json
```

Exit codes są stabilne: `0` oznacza `OVERALL PASS`, `1` — poprawnie wykonane
sprawdzenie zakończone `OVERALL FAIL`, a `2` — błąd argumentów lub konfiguracji.
`NOT_APPLICABLE` nie powoduje błędu.

`verify:article` niczego nie generuje, nie uruchamia agentów, nie zatwierdza, nie
naprawia i nie publikuje. Tylko odczytuje istniejące SOURCE/LAB/CONTENT i sprawdza
ich schematy, hashe, provenance, review, decyzję publikacyjną oraz — gdy dotyczy —
CONTENT lineage. To Operator Mode, nie nowy etap pipeline.

## 2. Kolejność procedury Redactoria Engine

```text
SOURCE (tylko odczyt)
  → Inventory
  → Cartographer
  → decyzja człowieka
  → Researcher
  → akceptacja researchu przez człowieka
  → Writer
  → sprawdzenie przykładów
  → Critic
  → poprawki zatwierdzone przez człowieka, jeśli potrzebne
  → ponowny Critic
  → kandydat w LAB
  → decyzja publikacyjna człowieka
  → Promotion Gate
  → test / check / build
  → lokalny przegląd WEBSITE
  → osobna decyzja o commit/push/deploy
```

### Etap 0 — przeczytaj stan projektu

```sh
git status --short
sed -n '1,240p' docs/STATUS.md
sed -n '1,260p' docs/roadmap/ROADMAP.md
```

Obecny roadmap nakazuje `STOP` przed B3. Dalsze joby nie mają jeszcze ogólnej,
zaakceptowanej komendy. Nie uruchamiaj kolejnego rankingu lub artykułu bez osobnej
decyzji i planu w `docs/plans/active/`.

### Etap 1 — Inventory: SOURCE → LAB

Pierwsze pobranie zewnętrznego korpusu, poza repozytorium Redactorii:

```sh
git clone --depth 1 https://github.com/Scripterix/temp-ogwo.git ../temp-ogwo
```

Skan tylko do odczytu i zapis inventory w LAB:

```sh
npm run inventory -- ../temp-ogwo/posts
```

Własne ścieżki wejścia i wyjścia:

```sh
npm run inventory -- /sciezka/do/source --output /sciezka/do/lab
```

Po skanie sprawdź wynik. Ten sam SOURCE powinien dać ten sam inventory:

```sh
git diff -- lab/inventory
sha256sum lab/inventory/inventory.json
```

**STOP:** scanner nie może modyfikować `../temp-ogwo/posts`.

### Etap 2A — Cartographer: pełna mapa korpusu

Przygotowanie Pass A nie wywołuje modelu:

```sh
npm run cartographer -- --prepare inventory
```

Następnie człowiek analizuje
`lab/cartography/requests/pass-a.json` w wybranej sesji modelu i zapisuje jawnie
oznaczoną odpowiedź w nowym pliku odpowiedzi. Dopiero wtedy przygotowuje Pass B:

```sh
npm run cartographer -- \
  --prepare deep-read \
  --responses lab/cartography/moj-run-session-responses.json
```

Po analizie `lab/cartography/requests/pass-b.json` i uzupełnieniu tego samego pliku
odpowiedzi można wykonać walidowany import:

```sh
npm run cartographer -- \
  --responses lab/cartography/moj-run-session-responses.json
```

Odtworzenie historycznego, zapisanego przebiegu:

```sh
npm run cartographer
```

Uwaga: obecny zaakceptowany focused run może celowo odmówić zapisu, aby nie
zastąpić decyzji człowieka o statusie `approved`.

### Etap 2B — Cartographer: dokładnie dwa teksty do MERGE

Najpierw przygotuj request dla dwóch istniejących ścieżek z inventory:

```sh
npm run cartographer -- \
  --focus pierwszy-plik.md \
  --focus drugi-plik.md \
  --task merge \
  --prepare merge
```

Po ręcznej analizie requestu i zapisaniu odpowiedzi w LAB:

```sh
npm run cartographer -- \
  --focus pierwszy-plik.md \
  --focus drugi-plik.md \
  --task merge \
  --responses lab/cartography/moj-focused-session-responses.json
```

**STOP:** wynik Cartographera jest propozycją. Nie zatwierdza MERGE, nie tworzy
artykułu i nie zapisuje do CONTENT.

### Etap 2C — wybór pilota B1

Nowy przebieg jest trzyetapowy:

```sh
npm run select:pilot -- --prepare
# ręczna analiza requestu i jawny import odpowiedzi
npm run select:pilot
npm run select:pilot -- --verify
```

Samo sprawdzenie istniejącego B1, bez zapisu i bez inferencji:

```sh
npm run select:pilot -- --verify
```

**STOP:** B1 tylko szereguje kandydatów. Nie uruchamia Researchera ani Writera.

### Etap 3 — decyzja człowieka po Cartographerze

Nie ma komendy automatycznie zatwierdzającej decyzję. Człowiek musi sprawdzić
propozycję, zakres, źródła, hashe i jawnie zapisać decyzję w `lab/decisions/`.

Przydatne polecenia kontrolne:

```sh
git diff -- lab/cartography lab/reports lab/decisions
sha256sum lab/decisions/*.json
```

**STOP:** brak `approvedBy: human`, `status: approved` lub poprawnego `nextStep`
oznacza brak zgody na następny etap.

### Etap 4 — Researcher: zatwierdzony zakres → Research Packet

Przygotuj request bez wywołania modelu:

```sh
npm run researcher -- \
  --decision lab/decisions/<zatwierdzona-decyzja>.json \
  --prepare
```

Po przejrzeniu dowodów, analizie requestu i zapisaniu odpowiedzi w LAB:

```sh
npm run researcher -- \
  --decision lab/decisions/<zatwierdzona-decyzja>.json \
  --responses lab/research/<temat>/session-responses.json
```

Odtworzenie istniejącego pilota PHP Arrays:

```sh
npm run researcher -- \
  --decision lab/decisions/php-arrays-merge-proposal.json
```

**STOP:** Research Packet pozostaje w LAB. Nie jest draftem ani zgodą publikacyjną.
Przed Writerem potrzebna jest osobna akceptacja researchu przez człowieka.

### Etap 5 — Writer: zaakceptowany research → jeden draft

Temat musi mieć kompletny `lab/drafts/<temat>/input.json` i zatwierdzone wejścia.

```sh
npm run writer -- --topic <temat> --prepare
# ręczna analiza requestu i jawny import odpowiedzi
npm run writer -- \
  --topic <temat> \
  --responses lab/drafts/<temat>/session-responses.json
```

Przykład istniejącego tematu:

```sh
npm run writer -- --topic php-arrays
```

**Uwaga:** domyślna komenda odtwarza zapisane generowanie i może zapisać bieżące
artefakty draftu. Nie używaj jej do „drobnej poprawki” istniejącego kandydata.

**STOP:** Writer tworzy jeden draft w LAB i nie wywołuje Critica.

### Etap 6 — rzeczywiste sprawdzenie kodu

Przykłady z draftu należy wykonać zaufanym, kontrolowanym skryptem właściwym dla
danego tematu i zapisać dowody w `lab/drafts/<temat>/code-execution.json`.
Repozytorium celowo nie ma uniwersalnej komendy wykonującej dowolny kod z draftu.
Nie oznaczaj niewykonanych prób jako zaliczone.

### Etap 7 — Critic: dokładny draft → jeden review

```sh
npm run critic -- \
  --draft lab/drafts/<temat>/article.md \
  --prepare

# ręczna analiza requestu i jawny import odpowiedzi
npm run critic -- \
  --draft lab/drafts/<temat>/article.md \
  --responses lab/reviews/<temat>/session-responses.json
```

Przykład istniejącego tematu:

```sh
npm run critic -- --draft lab/drafts/php-arrays/article.md
```

Możliwe wyniki to `PASS`, `REVISE` albo `BLOCK`.

**STOP:** Critic nie poprawia tekstu, nie uruchamia Writera i nie publikuje.
`PASS` oznacza gotowość do kontroli człowieka, a nie zgodę na publikację.

### Etap 8 — poprawki i drugi Critic

Nie istnieje automatyczna pętla Writer ↔ Critic. Przy `REVISE` człowiek zatwierdza
konkretną, ograniczoną poprawkę i zapisuje jej audyt. Po zmianie trzeba wykonać nowy,
pełny Critic związany z nowym hashem draftu. Przy braku takiej zgody: `STOP`.

### Etap 9 — kandydat publikacyjny, nadal tylko LAB

Dopiero po dokładnym `Critic PASS`, zweryfikowanym kodzie i wymaganym audycie rewizji:

```sh
npm run candidate -- --topic <temat>
```

Przykład:

```sh
npm run candidate -- --topic php-control-flow
```

Komenda odmawia nadpisania istniejącego kandydata. Wynik w
`lab/candidates/<temat>/` nadal ma publikację `pending/false`.

**STOP:** przygotowanie kandydata nie jest publikacją.

### Etap 10 — decyzja publikacyjna człowieka

Nie ma komendy samodzielnie tworzącej zgodę. Decyzja w `lab/decisions/` musi wiązać
dokładne hashe kandydata, artykułu i końcowego review oraz określać metadane i cel.

```sh
sha256sum lab/candidates/<temat>/article.json
sha256sum lab/candidates/<temat>/article.md
sha256sum lab/reviews/<temat>/critic-review.json
git diff -- lab/candidates/<temat> lab/reviews/<temat> lab/decisions
```

### Etap 11 — Promotion Gate: LAB → CONTENT

Uruchamiaj wyłącznie z pasującą, jawnie zatwierdzoną decyzją człowieka:

```sh
npm run promote -- \
  --candidate lab/candidates/<temat>/article.json \
  --decision lab/decisions/<decyzja-publikacyjna>.json
```

Historyczne przykłady ścieżek:

```sh
npm run promote -- \
  --candidate lab/candidates/php-arrays/article.json \
  --decision lab/decisions/php-arrays-publication.json

npm run promote -- \
  --candidate lab/candidates/php-control-flow/article.json \
  --decision lab/decisions/php-control-flow-publication.json
```

Promotion Gate odmawia nadpisania istniejącego CONTENT lub raportu audytowego, więc
historyczne przykłady powinny dziś zakończyć się bezpiecznym `STOP`.

**STOP:** gate nie wykonuje `git commit`, `git push` ani deployu.

### Etap 12 — obowiązkowa kontrola jakości

Zawsze w tej kolejności:

```sh
npm run test
npm run check
npm run build
```

`npm run build` uruchamia `astro build`, a potem Pagefind dla `dist/`. Dlatego w tym
repo jest właściwsze niż bezpośrednie `npm run astro -- build`, które nie utworzy
indeksu wyszukiwarki.

Sprawdź również zmiany dokumentacji i zakres diffu:

```sh
git status --short
git diff --check
git diff --stat
git diff
```

Nie raportuj zakończenia etapu, jeśli test, check albo build nie przechodzi.

### Etap 13 — lokalny przegląd WEBSITE

Serwer developerski zawsze uruchamiaj w tle:

```sh
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev logs --follow
npm run astro -- dev stop
```

Domyślny adres: <http://localhost:4321/>.

Do testu wyniku produkcyjnego z Pagefind najpierw wykonaj build, potem preview:

```sh
npm run build
npm run preview -- --background
npm run astro -- preview status
npm run astro -- preview logs
npm run astro -- preview stop
```

Preview służy tylko do kontroli lokalnej, nie do hostingu produkcyjnego.

## 3. Astro CLI — podręczna ściąga dla tego repo

Repo używa obecnie Astro `7.3.8`. Preferuj lokalną, przypiętą wersję przez skrypty
`npm`, zamiast globalnej instalacji `astro`.

### Informacje i pomoc

```sh
npm run astro -- --version
npm run astro -- --help
npm run astro -- dev --help
npm run astro -- build --help
npm run astro -- check --help
npm run astro -- info
npm run astro -- docs
```

### Development server

```sh
npm run dev -- --background                  # localhost:4321
npm run dev -- --background --port 4322      # inny port
npm run dev -- --background --host           # dostęp z sieci; używaj świadomie
npm run dev -- --background --open           # otwórz przeglądarkę
npm run dev -- --background --force          # wyczyść cache content layer
```

Zarządzanie procesem uruchomionym w tle:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev logs --follow
npm run astro -- dev stop
```

### Diagnostyka i typy

```sh
npm run check
npm run check -- --watch
npm run check -- --minimumFailingSeverity warning
npm run astro -- sync
```

`astro sync` generuje typy Astro, Content Collections, env i actions. Polecenia
`dev`, `build` i `check` uruchamiają sync automatycznie.

### Build i preview

```sh
npm run build                              # Astro + Pagefind; preferowane w repo
npm run astro -- build --verbose           # tylko diagnostyczny build Astro
npm run preview -- --background
npm run preview -- --background --port 4322
npm run astro -- preview status
npm run astro -- preview logs --follow
npm run astro -- preview stop
```

Zmiany wykonane po buildzie nie pojawią się w preview, dopóki ponownie nie wykonasz
`npm run build`.

### Testy projektu

```sh
npm run test              # jeden pełny przebieg Vitest
npm run test:watch        # testy w trybie obserwowania
npm run test -- --help
```

### Integracje Astro — tylko po decyzji architektonicznej

```sh
npm run astro -- add <nazwa-integracji>
```

Ta komenda zmienia zależności i konfigurację. W Redactorii nie dodawaj integracji
„na próbę”. Astro ma pozostać statyczną warstwą publikacyjną, a framework UI może
być użyty tylko jako uzasadniona lokalna Island.

### Przydatne flagi Astro

Flagi przekazywane przez `npm run` muszą wystąpić po dodatkowym `--`:

```sh
npm run dev -- --port 4322
npm run astro -- build --verbose
```

W drugim przykładzie uruchamiasz wyłącznie Astro, bez Pagefind. Do końcowej kontroli
repo zawsze wróć do pełnego `npm run build`.

Najczęściej używane:

| Flaga | Zastosowanie |
| --- | --- |
| `--background` | uruchamia `dev` lub `preview` w tle |
| `--port <numer>` | zmienia port, domyślnie 4321 |
| `--host` | nasłuchuje także poza localhostem |
| `--open` | otwiera stronę w przeglądarce |
| `--force` | wymusza pełne odtworzenie cache content layer |
| `--verbose` | pokazuje bardziej szczegółowe logi |
| `--silent` | wyłącza logowanie |
| `--json` | zwraca logi w formacie JSON |
| `--root <ścieżka>` | wskazuje inny katalog projektu |
| `--config <ścieżka>` | wskazuje inny plik konfiguracji |
| `--mode <nazwa>` | wybiera tryb środowiska Vite/Astro |

## 4. Przydatne komendy Bash przy pracy z repo

```sh
pwd                                      # bieżący katalog
ls -la                                   # pliki, także ukryte
rg --files                               # szybka lista plików repo
rg "szukany tekst" src content docs     # wyszukiwanie tekstu
git status --short                       # stan zmian
git diff --check                         # błędy whitespace
git diff -- path/do/pliku                # diff jednego zakresu
sha256sum path/do/pliku                  # hash artefaktu
```

Nie używaj masowych poleceń usuwających, nie edytuj SOURCE i nie wykonuj
automatycznego commit/push/deploy bez jawnej decyzji dla konkretnego checkpointu.

## 5. Dokumentacja źródłowa

- [Project Brain](docs/index.md)
- [Stan projektu](docs/STATUS.md)
- [Architektura](docs/architecture/overview.md)
- [Inventory](docs/architecture/inventory.md)
- [Cartographer](docs/architecture/cartographer.md)
- [Researcher](docs/architecture/researcher.md)
- [Writer / Critic](docs/architecture/writer-critic.md)
- [Promotion Gate](engine/promotion/README.md)
- [Oficjalna dokumentacja Astro CLI](https://docs.astro.build/en/reference/cli-reference/)
