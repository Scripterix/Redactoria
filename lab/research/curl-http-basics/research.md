# Researcher 0.1 — curl-http-basics

## RESEARCH SCOPE

Research Packet, nie artykuł ani zatwierdzenie publikacji. Jeden pełny materiał SOURCE.

- 1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md (1336)

Tryb: imported-session-analysis; model: unknown-codex-session.
Request SHA-256: b10325358654e472a97d0304b6bd88f9376bdf23d4bdaf49b30b5cde6626750d

## RUNTIME TARGET

curl 8.13.0 na Windows; wyłącznie kontrolowany serwer 127.0.0.1 bez zewnętrznych żądań

Stan dokumentacji: 2026-10-13.

Wykonane runtime: curl 8.13.0; szczegóły w osobnym execution evidence.

## VERIFIED CLAIMS

### curl-body-headers

curl domyślnie wypisuje body; --include dołącza nagłówki odpowiedzi, a --head wysyła dla HTTP metodę HEAD i pobiera same nagłówki. (verified; confidence: 0.98)

Evidence: [curl-manpage/curl-include](https://curl.se/docs/manpage.html), [curl-manpage/curl-head](https://curl.se/docs/manpage.html), [rfc-9110/get-head](https://www.rfc-editor.org/rfc/rfc9110.html)

SOURCE: 1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md, body: "curl -I https://example.com"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

### curl-status-output

--write-out może wypisać po transferze kod statusu HTTP przez zmienną http_code. (verified; confidence: 0.98)

Evidence: [curl-manpage/curl-write-out](https://curl.se/docs/manpage.html), [rfc-9110/status-code](https://www.rfc-editor.org/rfc/rfc9110.html)

SOURCE: 1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md, body: "curl -I https://example.com"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

### curl-fail-body

--fail-with-body zachowuje body odpowiedzi, ale dla statusu HTTP 400 lub wyższego kończy curl kodem 22. (verified; confidence: 0.98)

Evidence: [curl-manpage/curl-fail-body](https://curl.se/docs/manpage.html)

SOURCE: 1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md, body: "curl -I https://example.com"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

## CLAIMS REQUIRING CORRECTION

### curl-status-exit-separation

Status HTTP i kod wyjścia procesu nie są tym samym; bez opcji fail curl może zakończyć transfer 404 kodem procesu 0. (verified; confidence: 0.98)

Evidence: [curl-manpage/curl-write-out](https://curl.se/docs/manpage.html), [curl-manpage/curl-fail-body](https://curl.se/docs/manpage.html)

SOURCE: 1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md, body: "curl -I https://example.com"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

## OUTDATED / QUESTIONABLE MATERIAL

Brak.

## CODE ISSUES

### executed-boundaries

Kontrolowany serwer loopback potwierdził body GET, nagłówki HEAD, zapis statusu 404 oraz kod wyjścia 22 z zachowanym body dla --fail-with-body. (verified; confidence: 0.99)

Evidence: [curl-manpage/curl-head](https://curl.se/docs/manpage.html), [rfc-9110/get-head](https://www.rfc-editor.org/rfc/rfc9110.html)

SOURCE: 1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md, body: "curl -I https://example.com"

Zalecenie: Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.

Kod: executed-probe; probes: curl-local-http.

## response

- [curl-body-headers](#curl-body-headers): Użyć jako zweryfikowanej granicy treści i przykładów.
- [executed-boundaries](#executed-boundaries): Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.

## errors

- [curl-status-output](#curl-status-output): Użyć jako zweryfikowanej granicy treści i przykładów.
- [curl-fail-body](#curl-fail-body): Użyć jako zweryfikowanej granicy treści i przykładów.
- [curl-status-exit-separation](#curl-status-exit-separation): Użyć jako zweryfikowanej granicy treści i przykładów.
- [executed-boundaries](#executed-boundaries): Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.

## SECURITY / CAUTION NOTES

Brak.

## RECOMMENDED ARTICLE CHANGES

- CORRECT: Zmodernizować jeden materiał legacy w ograniczonym, lokalnym i sprawdzalnym zakresie. [curl-body-headers, curl-status-output, curl-fail-body, curl-status-exit-separation, executed-boundaries]

## UNRESOLVED QUESTIONS


## SOURCE REGISTER

- [curl-manpage — curl command line tool man page](https://curl.se/docs/manpage.html); tier 2 / official-project-runtime / technical-authority; project-documentation; pobrano 2026-10-13T19:41:02.183Z; evidence: curl-head, curl-include, curl-write-out, curl-fail-body; SHA-256: 0ef77bad12997946fd2663bb2222b4201ab5cf3b2d724595cb099ca2ef58283d
- [rfc-9110 — RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); tier 1 / specification-standard / technical-authority; standard; pobrano 2026-10-13T19:41:02.183Z; evidence: get-head, status-code; SHA-256: d431760660ea44e130f6e919dab216df2d0b3a490567a98089267523368fe1e5

## LIMITATIONS

- Research obejmuje jeden autoryzowany materiał SOURCE, oficjalne źródła potrzebne do zakresu oraz kontrolowane lokalne wykonanie; nie jest zgodą na publikację.

## WRITER HANDOFF

Założony runtime: curl 8.13.0 na Windows; wyłącznie kontrolowany serwer 127.0.0.1 bez zewnętrznych żądań

### Zachowaj

- Zachować praktyczny, terminalowy charakter materiału i jawne oczekiwane wyniki. [curl-body-headers, curl-status-output, curl-fail-body]

### Popraw

- Status HTTP i kod wyjścia procesu nie są tym samym; bez opcji fail curl może zakończyć transfer 404 kodem procesu 0. [curl-status-exit-separation]

### Nie powielaj


### Ostrożność

- Nie przedstawiać próby badawczej jako wykonania finalnego kodu artykułu. [executed-boundaries]

### Zweryfikowane przykłady

- executed-boundaries: executed-probe; curl-local-http

STOP — następny krok wymaga decyzji człowieka.
