# curl i HTTP: odpowiedź, nagłówki i lokalny JSON

Zakres: cli 8.13.0. Materiał dla początkujących i osób na poziomie średnim.

<a id="response-parts"></a>

## Odpowiedź HTTP ma status, nagłówki i body

Polecenie `curl.exe` pozwala obejrzeć odpowiedź HTTP z terminala. Używamy jawnie nazwy `curl.exe`, aby w PowerShell nie pomylić programu z innym poleceniem lub aliasem. Odpowiedź ma kod statusu, nagłówki i opcjonalne body.

W ćwiczeniu działa kontrolowany serwer pod `127.0.0.1:38421`. Trasa `/data` zwraca status 200 i mały dokument JSON, a `/missing` zwraca 404. Nie wysyłamy danych do zewnętrznego API.

<a id="get-body"></a>

## GET i body JSON

Bez dodatkowej opcji curl wypisuje body odpowiedzi na standardowe wyjście. `--silent` usuwa pasek postępu, dzięki czemu wynik nadaje się do dalszego przetwarzania. Nie oznacza to jednak walidacji struktury JSON.

### Body z kontrolowanego endpointu JSON

```shell
curl.exe --silent http://127.0.0.1:38421/data
```

Oczekiwany wynik:

```text
{"name":"Ada"}
```

<a id="headers-head"></a>

## Nagłówki: --include i --head

`--include` dołącza nagłówki odpowiedzi do zwykłego body. `--head` dla HTTP wysyła metodę HEAD: ma semantykę GET, ale odpowiedź nie zawiera body. Nagłówki mogą opisywać reprezentację, którą zwróciłby GET.

Nie zakładaj, że każdy serwer zwróci identyczny zestaw ani kolejność nagłówków. Do automatycznego sprawdzania statusu lepiej użyć `--write-out` niż parsować pierwszą linię nagłówków.

<a id="status-exit"></a>

## Status HTTP i kod wyjścia procesu

`--write-out` wypisuje dane o zakończonym transferze. Zmienna `%{http_code}` daje kod statusu, nawet gdy body zapiszesz do `NUL`. Sam status 404 nie musi oznaczać niezerowego kodu wyjścia curl.

Jeżeli skrypt ma traktować odpowiedzi 400+ jako błąd procesu i zachować body diagnostyczne, użyj `--fail-with-body`. W takim przypadku curl kończy się kodem 22. To osobna informacja od statusu HTTP.

### Sam status odpowiedzi bez body

```shell
curl.exe --silent --output NUL --write-out "status=%{http_code}" http://127.0.0.1:38421/missing
```

Oczekiwany wynik:

```text
status=404
```

---

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Przykłady używają curl 8.13.0 na Windows i lokalnego serwera testowego; nie obejmują auth, cookies, proxy, pobierania plików ani zewnętrznych API.
