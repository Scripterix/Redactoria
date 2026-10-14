---
title: "API, HTTP i JSON: bezpieczne pobieranie danych przez fetch"
description: Wprowadzenie do API, metody GET, statusów HTTP, JSON i poprawnej obsługi błędów fetch na kontrolowanych przykładach.
slug: api-http-json
status: published
created: 2026-10-12T00:00:00.000Z
updated: 2026-10-12T00:00:00.000Z
domain: programming
topic: web
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: WHATWG Fetch Standard
    url: https://fetch.spec.whatwg.org/
    publisher: WHATWG
  - title: RFC 9110 — HTTP Semantics
    url: https://www.rfc-editor.org/rfc/rfc9110.html
    publisher: IETF
  - title: RFC 8259 — The JavaScript Object Notation Data Interchange Format
    url: https://www.rfc-editor.org/rfc/rfc8259.html
    publisher: IETF
  - title: MDN — Window.fetch()
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
    publisher: MDN Web Docs
origin:
  type: wordpress-export
  source_id: "578"
  original_url: https://opengateweb.com/posts/22-post-api/
  original_date: 2025-03-07T00:00:00.000Z
  original_author: Scripterix
review:
  status: approved
  reviewer: human — B4 publication authorization
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-12T00:00:00.000Z
  update_priority: normal
redactoria:
  decision: rewrite
  modernization: major
---
# API, HTTP i JSON: bezpieczne pobieranie danych przez fetch

Zakres: node v24.16.0. Materiał dla początkujących i osób na poziomie średnim.

<a id="api-http"></a>

## API, metoda GET i odpowiedź HTTP

API opisuje sposób komunikacji między programami. W webowym API klient wysyła żądanie HTTP do zasobu, a serwer zwraca odpowiedź ze statusem, nagłówkami i opcjonalnym ciałem. Metoda GET służy do pobrania bieżącej reprezentacji wskazanego zasobu.

`fetch` zwraca obietnicę z obiektem `Response`. Statusy 200–299 dają `response.ok === true`. Odpowiedź 404 nadal jest odpowiedzią HTTP, dlatego sama nie powoduje odrzucenia obietnicy `fetch`; trzeba sprawdzić `ok` albo `status`.

### Porównanie kontrolowanej odpowiedzi 200 i 404

```js
const success = new Response('{}', { status: 200 });
const missing = new Response('{}', { status: 404 });
console.log(JSON.stringify([
  { status: success.status, ok: success.ok },
  { status: missing.status, ok: missing.ok },
]));
```

Oczekiwany wynik:

```text
[{"status":200,"ok":true},{"status":404,"ok":false}]
```

<a id="json-body"></a>

## JSON jest formatem danych

JSON może reprezentować obiekt, tablicę, liczbę, napis, `true`, `false` albo `null`. Nie jest wykonywalnym kodem i nie gwarantuje, że odpowiedź ma pola oczekiwane przez aplikację. Po parsowaniu nadal trzeba sprawdzić strukturę danych.

Metoda `response.json()` odczytuje ciało i próbuje sparsować je jako JSON. Może odrzucić obietnicę, gdy ciało ma niepoprawną składnię. Nagłówek `Content-Type` pomaga opisać reprezentację, ale nie zastępuje obsługi błędu parsera.

### Oddzielenie poprawnego JSON od błędu składni

```js
async function parse(response) {
  try {
    return { ok: true, data: await response.json() };
  } catch {
    return { ok: false, kind: 'json' };
  }
}
;(async () => {
  console.log(JSON.stringify(await parse(new Response('{"name":"Ada"}'))));
  console.log(JSON.stringify(await parse(new Response('{bad json'))));
})();
```

Oczekiwany wynik:

```text
{"ok":true,"data":{"name":"Ada"}}
{"ok":false,"kind":"json"}
```

<a id="error-boundaries"></a>

## Trzy różne granice błędu

Kod klienta powinien rozróżniać błąd sieci lub samego żądania, nieudany status HTTP oraz błąd parsowania JSON. Dzięki temu interfejs może pokazać właściwy komunikat, a logi nie sklejają odmiennych przyczyn w jedno ogólne „API nie działa”.

Poniższa funkcja przyjmuje `fetcher` jako zależność. W produkcji może to być globalne `fetch`, a w sprawdzalnym przykładzie są to lokalne funkcje zwracające kontrolowane obiekty `Response`. Żadne zewnętrzne API nie jest potrzebne.

### Sukces, błąd HTTP, błąd JSON i błąd sieci

```js
async function loadJson(fetcher, url) {
  try {
    const response = await fetcher(url);
    if (!response.ok) return { ok: false, kind: 'http', status: response.status };
    try {
      return { ok: true, data: await response.json() };
    } catch {
      return { ok: false, kind: 'json' };
    }
  } catch {
    return { ok: false, kind: 'network' };
  }
}
const fixtures = {
  success: async () => new Response('{"name":"Ada"}', { status: 200 }),
  missing: async () => new Response('{}', { status: 404 }),
  invalid: async () => new Response('{bad json', { status: 200 }),
  network: async () => { throw new TypeError('network'); },
};
;(async () => {
  const result = {};
  for (const [name, fixture] of Object.entries(fixtures)) {
    result[name] = await loadJson(fixture, '/users');
  }
  console.log(JSON.stringify(result));
})();
```

Oczekiwany wynik:

```text
{"success":{"ok":true,"data":{"name":"Ada"}},"missing":{"ok":false,"kind":"http","status":404},"invalid":{"ok":false,"kind":"json"},"network":{"ok":false,"kind":"network"}}
```
