import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const definitions = {
	markdown: {
		sourceId: '48', sourcePath: '48-post-2-jezyk-markdown.md', quote: 'Potrójny backtick ``````` – używany do bloków kodu',
		title: 'Markdown: nagłówki, linki, listy i bloki kodu',
		scope: 'Podstawy CommonMark: struktura dokumentu, akapity, wyróżnienie, linki, listy i fenced code blocks; osobno jednoznacznie nazwane rozszerzenia GFM. Bez atrybutów nagłówków, CMS-ów i eksportu PDF.',
		keep: ['keep-readable-source', 'Zachować naukę przez krótki, czytelny tekst źródłowy i natychmiastowy wynik renderowania.'],
		correct: ['correct-dialects', 'Oddzielić składnię CommonMark od rozszerzeń GFM i usunąć niestandardowe atrybuty nagłówka.'],
		uncertain: ['uncertain-universality', 'Nie twierdzić, że każdy renderer obsługuje te same rozszerzenia i surowy HTML.'],
		remove: ['remove-broken-examples', 'Usunąć niedomknięte znaczniki HTML, samotny backtick oraz niespójne ogrodzenia kodu.'],
		missing: ['missing-rendering-model', 'Dodać rozróżnienie między tekstem Markdown, dialektem i wynikowym HTML oraz pokazać escaping.'],
		research: ['research-markdown', 'Zweryfikować nagłówki, linki, listy, code spans, fenced code blocks oraz granicę CommonMark/GFM.'],
		sections: ['Markdown jako tekst i wynik renderowania', 'Nagłówki, akapity, wyróżnienie i linki', 'Listy oraz bezpieczne bloki kodu', 'CommonMark a rozszerzenia GFM'],
	},
	'javascript-calculator': {
		sourceId: '281', sourcePath: '281-post-9-calculator-math-func-oop.md', quote: 'class Calculator {',
		title: 'Kalkulator w JavaScript: funkcja, klasa i poprawne dane wejściowe',
		scope: 'Jedna czysta funkcja obliczeniowa i mała bezstanowa klasa obsługujące dodawanie oraz odejmowanie; jawne parsowanie pełnej liczby dziesiętnej i błędy. Bez Person, mouseout, alertów i trzech kalkulatorów.',
		keep: ['keep-function-class', 'Zachować porównanie prostego wywołania funkcji z metodą małej klasy na tym samym kontrakcie.'],
		correct: ['correct-functional-label', 'Nie nazywać zwykłych handlerów DOM programowaniem funkcyjnym i nie maskować błędnego wejścia przez || 0.'],
		uncertain: ['uncertain-oop-choice', 'Nie przedstawiać klasy jako automatycznie łatwiejszej w utrzymaniu bez kontekstu i potrzebnego stanu.'],
		remove: ['remove-person-ui', 'Usunąć poboczne klasy Person, zdarzenie mouseout oraz niekompletny UI.'],
		missing: ['missing-input-contract', 'Dodać pełne parsowanie liczby, Number.isFinite, jawny błąd operatora i testy przypadków granicznych.'],
		research: ['research-calculator', 'Zweryfikować konwersję Number, liczby skończone, metody klas oraz różnicę między funkcją, stylem proceduralnym i funkcyjnym.'],
		sections: ['Najpierw kontrakt kalkulatora', 'Czysta funkcja z jawnymi błędami', 'Ta sama operacja jako metoda klasy', 'Parsowanie wejścia i przypadki graniczne'],
	},
	'api-http-json': {
		sourceId: '578', sourcePath: '578-post-22-wprowadzenie-do-api.md', quote: "fetch('https://przykladoweapi.com/uzytkownicy')",
		title: 'API, HTTP i JSON: od żądania do bezpiecznej odpowiedzi',
		scope: 'API a HTTP API, żądanie GET, status odpowiedzi, response.ok, parsowanie JSON i osobne błędy HTTP, JSON oraz sieci. Kontrolowane Response fixtures; bez zewnętrznego API, CRUD, Express i kluczy.',
		keep: ['keep-request-response', 'Zachować prosty model żądanie → odpowiedź → dane jako wejście do tematu.'],
		correct: ['correct-fetch-errors', 'Wyjaśnić, że fetch nie odrzuca Promise wyłącznie z powodu statusu 404 i że response.json może odrzucić dla błędnego JSON.'],
		uncertain: ['uncertain-security', 'Nie przedstawiać samego API jako gwarancji bezpieczeństwa ani aktualności danych.'],
		remove: ['remove-external-backend', 'Usunąć niedziałającą domenę przykładową, katalog darmowych API i serwer Express wykraczający poza zakres.'],
		missing: ['missing-controlled-errors', 'Dodać kontrolowane przypadki 200, 404, niepoprawnego JSON i błędu sieci.'],
		research: ['research-api', 'Zweryfikować semantykę GET, fetch, Response.ok, Response.json oraz składnię JSON w WHATWG i aktualnych RFC.'],
		sections: ['API, HTTP i reprezentacja JSON', 'Żądanie GET i status odpowiedzi', 'Parsowanie JSON dopiero po sprawdzeniu HTTP', 'Trzy różne klasy błędów'],
	},
} as const;

for (const [topic, definition] of Object.entries(definitions)) {
	const request = JSON.parse(await readFile(resolve(project, `lab/cartography/requests/${topic}-single.json`), 'utf8')) as { requestHash: string };
	const evidence = [{ sourceId: definition.sourceId, sourcePath: definition.sourcePath, field: 'body', value: definition.quote }];
	const finding = (data: readonly [string, string]) => ({ id: data[0], interpretation: data[1], evidence, confidence: 0.97 });
	const response = {
		task: 'SINGLE_ARTICLE', artifactName: `${topic}-single`, action: 'REWRITE', recommended: true, confidence: 0.98,
		reason: 'Legacy ma wartościowy rdzeń dydaktyczny i zachowane pochodzenie, ale wymaga zwartej modernizacji, korekt technicznych i wykonywalnych przykładów zamiast pobocznych obietnic.',
		evidence, scope: definition.scope, keep: [finding(definition.keep)], correct: [finding(definition.correct)],
		outdatedOrUncertain: [finding(definition.uncertain)], remove: [finding(definition.remove)], missing: [finding(definition.missing)],
		needsResearch: [finding(definition.research)], prerequisites: ['Podstawowa umiejętność pracy z plikiem tekstowym i uruchamiania krótkich przykładów.'],
		relationships: topic === 'markdown' ? [] : [{ publicPath: '/artykuly/warunki-w-javascript/', reason: 'Materiał wykorzystuje jawne warunki i kontrolę błędów poznane wcześniej.' }],
		proposedTitle: definition.title,
		proposedStructure: definition.sections.map((title, index) => ({ order: index + 1, title,
			purpose: `Wyjaśnić i sprawdzić: ${title.toLowerCase()}.`, sourceIds: [definition.sourceId], evidence, needsResearch: true })),
		limitations: ['Analiza obejmuje tylko jeden autoryzowany plik SOURCE; techniczne twierdzenia wymagają Source Authority Ladder i kontrolowanej weryfikacji.'],
	};
	const recorded = { schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session',
		description: 'B4 focused analysis recorded in-session; exact model identifier is unavailable.' },
		'focused-article': { requestHash: request.requestHash, response } };
	await writeLabArtifacts(project, sourceRoot, { [`cartography/${topic}-session-responses.json`]: stableJson(recorded) });
}
console.log('Recorded three bounded B4 Cartographer responses.');
