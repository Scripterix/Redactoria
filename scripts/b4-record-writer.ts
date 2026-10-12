import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const refs = (...ids: string[]) => ids.map(id => ({ kind: 'finding', id }));

const definitions: Record<string, any> = {
	markdown: {
		title: 'Markdown: nagłówki, linki, listy i bloki kodu',
		sections: [
			{
				id: 'markdown-model', heading: 'Tekst źródłowy i wynik renderowania',
				coverage: ['markdown-model', 'headings-paragraphs', 'emphasis-links'],
				evidence: refs('commonmark-blocks', 'executed-boundaries'),
				body: 'Markdown jest tekstowym formatem zapisu, który renderer zamienia na wynik, zwykle HTML. Znak `#` na początku wiersza tworzy nagłówek, pusty wiersz rozdziela bloki, podwójne gwiazdki oznaczają mocne wyróżnienie, a zapis `[tekst](adres)` tworzy link. Czytelnik widzi efekt, ale w repozytorium nadal przechowujesz zwykły tekst.\n\nNie każdy parser obsługuje identyczny dialekt. W tym materiale podstawą jest CommonMark 0.31.2. Najpierw warto opanować jego rdzeń, a dopiero później korzystać z rozszerzeń platformy.',
				examples: [{
					id: 'heading-emphasis-link', language: 'markdown', purpose: 'Nagłówek, wyróżnienie i link w jednym krótkim dokumencie',
					code: '# Plan\n\nTo jest **ważne** i zawiera [link](https://example.com).',
					expectedOutput: '<h1>Plan</h1>\n<p>To jest <strong>ważne</strong> i zawiera <a href="https://example.com">link</a>.</p>\n', expectedDiagnostics: [],
				}],
			},
			{
				id: 'lists-and-code', heading: 'Listy, kod inline i fenced code block',
				coverage: ['lists', 'code-spans', 'fenced-code', 'escaping'],
				evidence: refs('commonmark-blocks', 'commonmark-fences', 'executed-boundaries'),
				body: 'Wcięcie pozwala zagnieżdżać listy. Pojedyncze backticki otaczają krótki fragment kodu w zdaniu. Dłuższy przykład umieszcza się w fenced code block: ogrodzenie ma co najmniej trzy takie same backticki albo tyldy, a opcjonalna etykieta po otwarciu może wskazać język do podświetlania.\n\nTyldy są wygodne, gdy artykuł sam pokazuje składnię Markdown. Jeśli znak ma być widoczny dosłownie, można poprzedzić go backslashem. Wcięcia i puste wiersze traktuj jako część składni, nie dekorację.',
				examples: [
					{
						id: 'nested-list', language: 'markdown', purpose: 'Lista z jednym elementem zagnieżdżonym',
						code: '- pierwszy\n  - zagnieżdżony',
						expectedOutput: '<ul>\n<li>pierwszy\n<ul>\n<li>zagnieżdżony</li>\n</ul>\n</li>\n</ul>\n', expectedDiagnostics: [],
					},
					{
						id: 'tilde-fence', language: 'markdown', purpose: 'Blok JavaScript ogrodzony tyldami',
						code: '~~~js\nconsole.log(1);\n~~~',
						expectedOutput: '<pre><code class="language-js">console.log(1);\n</code></pre>\n', expectedDiagnostics: [],
					},
				],
			},
			{
				id: 'commonmark-and-gfm', heading: 'CommonMark a GitHub Flavored Markdown',
				coverage: ['commonmark-gfm'],
				evidence: refs('gfm-boundary', 'markdown-legacy-dialect'),
				body: 'GitHub Flavored Markdown, czyli GFM, jest ścisłym nadzbiorem CommonMark. Dodaje między innymi tabele, przekreślenie i listy zadań. Taki zapis może działać na GitHubie, lecz inny renderer ograniczony do CommonMark nie musi go rozumieć. Dlatego w dokumentacji projektu warto nazwać używany dialekt.\n\nNiestandardowe atrybuty dopisywane do nagłówka, spotykane w materiale legacy, nie są częścią podstawowej składni CommonMark ani opisanych tu rozszerzeń GFM. Klasy CSS lub identyfikatory dodawaj tylko wtedy, gdy dokumentacja konkretnego renderera wyraźnie je obsługuje.',
				examples: [],
			},
		],
	},
	'javascript-calculator': {
		title: 'Kalkulator w JavaScript: walidacja, funkcja i klasa',
		sections: [
			{
				id: 'calculator-contract', heading: 'Najpierw kontrakt kalkulatora',
				coverage: ['calculator-contract', 'operators', 'errors'],
				evidence: refs('function-class-boundary', 'executed-boundaries'),
				body: 'Prosty kalkulator potrzebuje jawnej listy operatorów oraz przewidywalnego wyniku błędu. Zamiast wykonywać dowolny tekst, funkcja poniżej dopuszcza tylko dodawanie i odejmowanie. Zwraca obiekt z polem `ok`, dzięki czemu kod wywołujący nie musi zgadywać, czy liczba jest wynikiem, czy wartością zastępczą.\n\nTaki rdzeń nie zna DOM-u i nie czyta pól formularza. Dzięki temu można go wykonać bez przeglądarki, a warstwę interfejsu dołączyć osobno.',
				examples: [{
					id: 'calculate-operation', language: 'js', purpose: 'Dwa obsługiwane operatory i jawny błąd',
					code: "function calculate(a, operator, b) {\n  if (!['+', '-'].includes(operator)) {\n    return { ok: false, error: 'unsupported-operator' };\n  }\n  return { ok: true, value: operator === '+' ? a + b : a - b };\n}\nconsole.log(JSON.stringify(calculate(7, '-', 2)));\nconsole.log(JSON.stringify(calculate(1, '*', 2)));",
					expectedOutput: '{"ok":true,"value":5}\n{"ok":false,"error":"unsupported-operator"}\n', expectedDiagnostics: [],
				}],
			},
			{
				id: 'number-input', heading: 'Od tekstu do skończonej liczby',
				coverage: ['number-conversion', 'finite-number', 'edge-cases'],
				evidence: refs('number-conversion', 'finite-no-coercion', 'calculator-default-zero', 'executed-boundaries'),
				body: 'Wartość z formularza jest tekstem. Najpierw odrzuć `null`, `undefined` i tekst pusty po `trim()`. Następnie użyj `Number`, aby przetworzyć całą wartość, oraz `Number.isFinite`, aby odrzucić `NaN` i nieskończoność. Napis `12px` nie jest poprawną liczbą dla tego kontraktu.\n\nZapis `parseFloat(value) || 0` jest kusząco krótki, ale maskuje błąd jako zero. Zero może być prawidłowym operandem, więc brak danych i błędne dane powinny dostać osobne rezultaty.',
				examples: [{
					id: 'parse-decimal', language: 'js', purpose: 'Walidacja wartości pustej, niepełnej i nieskończonej',
					code: "function parseDecimal(raw) {\n  if (raw == null || String(raw).trim() === '') {\n    return { ok: false, error: 'empty' };\n  }\n  const value = Number(raw);\n  return Number.isFinite(value)\n    ? { ok: true, value }\n    : { ok: false, error: 'invalid-number' };\n}\nconsole.log(JSON.stringify(['12.5', ' ', '12px', 'Infinity'].map(parseDecimal)));",
					expectedOutput: '[{"ok":true,"value":12.5},{"ok":false,"error":"empty"},{"ok":false,"error":"invalid-number"},{"ok":false,"error":"invalid-number"}]\n', expectedDiagnostics: [],
				}],
			},
			{
				id: 'function-or-class', heading: 'Funkcja albo metoda klasy',
				coverage: ['function', 'class-method'],
				evidence: refs('function-class-boundary', 'executed-boundaries'),
				body: 'Zwykła funkcja wystarcza, gdy operacja nie przechowuje stanu. Klasa może zapewnić wygodne API, gdy kalkulator ma konfigurację lub kilka powiązanych metod. Sama obecność klasy nie zmienia reguł dodawania ani odejmowania.\n\nNajprostsza metoda może delegować do przetestowanej funkcji. Nie nazywaj jednak każdej funkcji „programowaniem funkcyjnym”: w tym przykładzie chodzi o organizację kodu i jeden wspólny kontrakt.',
				examples: [{
					id: 'calculator-class', language: 'js', purpose: 'Metoda klasy delegująca do zwykłej funkcji',
					code: "function calculate(a, operator, b) {\n  if (operator === '+') return a + b;\n  if (operator === '-') return a - b;\n  throw new Error('unsupported-operator');\n}\nclass Calculator {\n  calculate(a, operator, b) {\n    return calculate(a, operator, b);\n  }\n}\nconsole.log(calculate(7, '-', 2));\nconsole.log(new Calculator().calculate(7, '-', 2));",
					expectedOutput: '5\n5\n', expectedDiagnostics: [],
				}],
			},
		],
	},
	'api-http-json': {
		title: 'API, HTTP i JSON: bezpieczne pobieranie danych przez fetch',
		sections: [
			{
				id: 'api-http', heading: 'API, metoda GET i odpowiedź HTTP',
				coverage: ['api-http', 'get', 'response-status', 'response-ok'],
				evidence: refs('get-representation', 'fetch-error-boundaries', 'api-status-check'),
				body: 'API opisuje sposób komunikacji między programami. W webowym API klient wysyła żądanie HTTP do zasobu, a serwer zwraca odpowiedź ze statusem, nagłówkami i opcjonalnym ciałem. Metoda GET służy do pobrania bieżącej reprezentacji wskazanego zasobu.\n\n`fetch` zwraca obietnicę z obiektem `Response`. Statusy 200–299 dają `response.ok === true`. Odpowiedź 404 nadal jest odpowiedzią HTTP, dlatego sama nie powoduje odrzucenia obietnicy `fetch`; trzeba sprawdzić `ok` albo `status`.',
				examples: [{
					id: 'response-status', language: 'js', purpose: 'Porównanie kontrolowanej odpowiedzi 200 i 404',
					code: "const success = new Response('{}', { status: 200 });\nconst missing = new Response('{}', { status: 404 });\nconsole.log(JSON.stringify([\n  { status: success.status, ok: success.ok },\n  { status: missing.status, ok: missing.ok },\n]));",
					expectedOutput: '[{"status":200,"ok":true},{"status":404,"ok":false}]\n', expectedDiagnostics: [],
				}],
			},
			{
				id: 'json-body', heading: 'JSON jest formatem danych',
				coverage: ['json', 'json-error'],
				evidence: refs('json-values', 'fetch-error-boundaries', 'executed-boundaries'),
				body: 'JSON może reprezentować obiekt, tablicę, liczbę, napis, `true`, `false` albo `null`. Nie jest wykonywalnym kodem i nie gwarantuje, że odpowiedź ma pola oczekiwane przez aplikację. Po parsowaniu nadal trzeba sprawdzić strukturę danych.\n\nMetoda `response.json()` odczytuje ciało i próbuje sparsować je jako JSON. Może odrzucić obietnicę, gdy ciało ma niepoprawną składnię. Nagłówek `Content-Type` pomaga opisać reprezentację, ale nie zastępuje obsługi błędu parsera.',
				examples: [{
					id: 'json-parse-error', language: 'js', purpose: 'Oddzielenie poprawnego JSON od błędu składni',
					code: "async function parse(response) {\n  try {\n    return { ok: true, data: await response.json() };\n  } catch {\n    return { ok: false, kind: 'json' };\n  }\n}\n;(async () => {\n  console.log(JSON.stringify(await parse(new Response('{\"name\":\"Ada\"}'))));\n  console.log(JSON.stringify(await parse(new Response('{bad json'))));\n})();",
					expectedOutput: '{"ok":true,"data":{"name":"Ada"}}\n{"ok":false,"kind":"json"}\n', expectedDiagnostics: [],
				}],
			},
			{
				id: 'error-boundaries', heading: 'Trzy różne granice błędu',
				coverage: ['http-error', 'network-error'],
				evidence: refs('fetch-error-boundaries', 'api-status-check', 'executed-boundaries'),
				body: 'Kod klienta powinien rozróżniać błąd sieci lub samego żądania, nieudany status HTTP oraz błąd parsowania JSON. Dzięki temu interfejs może pokazać właściwy komunikat, a logi nie sklejają odmiennych przyczyn w jedno ogólne „API nie działa”.\n\nPoniższa funkcja przyjmuje `fetcher` jako zależność. W produkcji może to być globalne `fetch`, a w sprawdzalnym przykładzie są to lokalne funkcje zwracające kontrolowane obiekty `Response`. Żadne zewnętrzne API nie jest potrzebne.',
				examples: [{
					id: 'load-json-boundaries', language: 'js', purpose: 'Sukces, błąd HTTP, błąd JSON i błąd sieci',
					code: "async function loadJson(fetcher, url) {\n  try {\n    const response = await fetcher(url);\n    if (!response.ok) return { ok: false, kind: 'http', status: response.status };\n    try {\n      return { ok: true, data: await response.json() };\n    } catch {\n      return { ok: false, kind: 'json' };\n    }\n  } catch {\n    return { ok: false, kind: 'network' };\n  }\n}\nconst fixtures = {\n  success: async () => new Response('{\"name\":\"Ada\"}', { status: 200 }),\n  missing: async () => new Response('{}', { status: 404 }),\n  invalid: async () => new Response('{bad json', { status: 200 }),\n  network: async () => { throw new TypeError('network'); },\n};\n;(async () => {\n  const result = {};\n  for (const [name, fixture] of Object.entries(fixtures)) {\n    result[name] = await loadJson(fixture, '/users');\n  }\n  console.log(JSON.stringify(result));\n})();",
					expectedOutput: '{"success":{"ok":true,"data":{"name":"Ada"}},"missing":{"ok":false,"kind":"http","status":404},"invalid":{"ok":false,"kind":"json"},"network":{"ok":false,"kind":"network"}}\n', expectedDiagnostics: [],
				}],
			},
		],
	},
};

for (const [topic, definition] of Object.entries(definitions)) {
	const request = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/request.json`), 'utf8')) as { requestHash: string };
	const input = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/input.json`), 'utf8')) as any;
	const response = {
		action: 'DRAFT', title: definition.title, targetRuntimes: input.targetRuntimes, sections: definition.sections,
		interactionOpportunities: [
			{ id: 'predict-output', sectionId: definition.sections[0].id, type: 'predict-output', purpose: 'Sprawdzić model mentalny przed uruchomieniem.', prompt: 'Przewidź dokładny wynik pierwszego przykładu, a potem porównaj go z wykonaniem.', expectedConcept: 'Jawny kontrakt i obserwowalny wynik.', implemented: false },
			{ id: 'change-boundary', sectionId: definition.sections.at(-1).id, type: 'exercise', purpose: 'Samodzielnie sprawdzić przypadek graniczny.', prompt: 'Zmień jedną wartość graniczną, zapisz przewidywanie i wykonaj przykład ponownie.', expectedConcept: 'Granice formatu lub błędu pozostają jawne.', implemented: false },
		],
		limitations: ['Materiał obejmuje wyłącznie autoryzowany zakres B4, wskazane źródła i runtime Node; metadane interakcji nie są zaimplementowanym UI.'],
	};
	const recorded = {
		schemaVersion: 1,
		provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B4 Writer response authored from the validated Authority Ladder packet; exact model identifier is unavailable.' },
		writer: { requestHash: request.requestHash, response },
	};
	await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/session-responses.json`]: stableJson(recorded) });
}

console.log('Recorded three B4 Writer responses.');
