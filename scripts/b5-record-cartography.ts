import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');

const definitions = {
	'git-local-basics': {
		sourceId: '277', sourcePath: '277-post-8-moj-gist.md', quote: '# git rm --cashed index.html',
		title: 'Git lokalnie: status, staging, commit i historia',
		scope: 'Jedno izolowane lokalne repozytorium: init, status, add, diff, diff --cached, commit i log. Lokalna konfiguracja autora tylko w repo. Bez GitHub/Gist, push, reset --hard, automatycznych merge i zmian konfiguracji globalnej.',
		keep: ['keep-local-commands', 'Zachować lokalne polecenia init, add, status i commit jako punkt wyjścia do obserwowalnego przepływu pracy.'],
		correct: ['correct-index-command', 'Poprawić literówkę --cashed na --cached i nie uczyć usuwania pliku z indeksu przed wyjaśnieniem working tree, index oraz HEAD.'],
		uncertain: ['uncertain-git-hosting', 'Oddzielić Git od GitHub i Gist; nie obiecywać aktualności ani jakości zewnętrznego zbioru skryptów.'],
		remove: ['remove-gist-promotion', 'Usunąć reklamowy przegląd Gist, push, edytor Vim, stash i tworzenie branchy poza małym zakresem podstaw.'],
		missing: ['missing-state-model', 'Dodać model working tree → staging area → commit oraz porównanie diff i diff --cached na jednym pliku.'],
		research: ['research-git-local', 'Zweryfikować semantykę init, status, add, diff, diff --cached, commit i log w oficjalnej dokumentacji Git oraz w izolowanym repo.'],
		sections: ['Trzy stany pliku w lokalnym repozytorium', 'Inicjalizacja i pierwszy status', 'Zmiana, diff oraz staging', 'Commit i czytanie krótkiej historii'],
		relationships: [{ publicPath: '/artykuly/start-redactoria-edu/', reason: 'Git pełni w Redactorii rolę pamięci zmian, ale lekcja pozostaje niezależnym lokalnym ćwiczeniem.' }],
	},
	'curl-http-basics': {
		sourceId: '1336', sourcePath: '1336-post-64-curl-twoje-terminalowe-okno-na-swiat.md', quote: 'curl -I https://example.com',
		title: 'curl i HTTP: odpowiedź, nagłówki i lokalny JSON',
		scope: 'Jawne curl.exe wobec kontrolowanego lokalnego endpointu: GET, HEAD, nagłówki odpowiedzi, kod statusu i jeden dokument JSON. Bez auth, cookies, proxy, cron, publicznych skracaczy, zewnętrznych API i szerokiego porównania curl/wget.',
		keep: ['keep-terminal-observation', 'Zachować bezpośrednią obserwację odpowiedzi HTTP z terminala jako główną wartość dydaktyczną.'],
		correct: ['correct-command-boundaries', 'Rozróżnić body, nagłówki, metodę HEAD, status HTTP i kod wyjścia; używać curl.exe, aby uniknąć niejednoznaczności PowerShell.'],
		uncertain: ['uncertain-platform-availability', 'Nie twierdzić bez sprawdzenia, że curl jest zawsze zainstalowany ani że każde API zachowuje się jednakowo.'],
		remove: ['remove-sensitive-breadth', 'Usunąć Basic Auth, JWT, cookies, proxy, cron, publiczne short linki, placeholder API i pobieranie plików.'],
		missing: ['missing-local-fixture', 'Dodać kontrolowany lokalny serwer z trasą JSON oraz dokładne oczekiwane nagłówki, status i stdout.'],
		research: ['research-curl-http', 'Zweryfikować opcje --head, --include, --write-out i --fail-with-body oraz znaczenie statusu i kodu wyjścia.'],
		sections: ['Co curl pokazuje o odpowiedzi HTTP', 'GET i body z lokalnego endpointu', 'HEAD, nagłówki oraz kod statusu', 'JSON i błędy bez sekretów'],
		relationships: [{ publicPath: '/artykuly/api-http-json/', reason: 'Artykuł o fetch wyjaśnia granice odpowiedzi w kodzie; curl pokaże ten sam protokół z perspektywy terminala.' }],
	},
	'python-fundamentals': {
		sourceId: '283', sourcePath: '283-post-10-python-crash-course.md', quote: 'for i in range(5):',
		title: 'Podstawy Pythona: wartości, warunki, pętle i funkcje',
		scope: 'Czysty Python: wartości i podstawowe typy, if, range, mała funkcja, wcięcia i deterministyczny stdout. Bez scrapingu, requests, BeautifulSoup, AI, CDN, gry losowej, marketingu i porównania z C.',
		keep: ['keep-language-core', 'Zachować prosty ciąg wartości, warunku, pętli range i wywołania funkcji jako rdzeń pierwszej lekcji.'],
		correct: ['correct-code-formatting', 'Odtworzyć poprawne wcięcia i kompletne bloki kodu oraz oddzielić wartości wejściowe od dokładnego stdout.'],
		uncertain: ['uncertain-language-claims', 'Nie opierać lekcji na ogólnych twierdzeniach o popularności, łatwości lub zastosowaniach Pythona.'],
		remove: ['remove-unrelated-python', 'Usunąć losową grę, scraping, biblioteki zewnętrzne, AI, CDN i porównanie składni z C.'],
		missing: ['missing-deterministic-boundaries', 'Dodać przykłady typów, gałęzi false, granic range, return z funkcji i znaczenia wcięć, każdy z oczekiwanym stdout.'],
		research: ['research-python-core', 'Zweryfikować typy wbudowane, truth testing, range, definicje funkcji, return i reguły bloków w oficjalnej dokumentacji Python.'],
		sections: ['Wartości, nazwy i podstawowe typy', 'Warunek if i jawne gałęzie', 'Pętla for oraz granice range', 'Funkcja, argument i wartość return'],
		relationships: [{ publicPath: '/artykuly/warunki-w-javascript/', reason: 'Czytelnik może porównać ten sam model decyzji z istniejącą lekcją JavaScript bez mieszania składni w jednym artykule.' }],
	},
} as const;

for (const [topic, definition] of Object.entries(definitions)) {
	const request = JSON.parse(await readFile(resolve(project, `lab/cartography/requests/${topic}-single.json`), 'utf8')) as { requestHash: string };
	const evidence = [{ sourceId: definition.sourceId, sourcePath: definition.sourcePath, field: 'body', value: definition.quote }];
	const finding = (data: readonly [string, string]) => ({ id: data[0], interpretation: data[1], evidence, confidence: 0.96 });
	const response = {
		task: 'SINGLE_ARTICLE', artifactName: `${topic}-single`, action: 'REWRITE', recommended: true, confidence: 0.96,
		reason: 'Źródło zachowuje użyteczny rdzeń początkującej lekcji, ale miesza go z promocją, zbyt szerokim zakresem lub niezweryfikowanymi przykładami; wymaga zwartego rewrite opartego na dokumentacji i kontrolowanym wykonaniu.',
		evidence, scope: definition.scope, keep: [finding(definition.keep)], correct: [finding(definition.correct)],
		outdatedOrUncertain: [finding(definition.uncertain)], remove: [finding(definition.remove)], missing: [finding(definition.missing)],
		needsResearch: [finding(definition.research)], prerequisites: ['Umiejętność utworzenia pliku tekstowego i uruchomienia jawnie wskazanego polecenia w terminalu.'],
		relationships: definition.relationships, proposedTitle: definition.title,
		proposedStructure: definition.sections.map((title, index) => ({ order: index + 1, title,
			purpose: `Wyjaśnić i sprawdzić: ${title.toLowerCase()}.`, sourceIds: [definition.sourceId], evidence, needsResearch: true })),
		limitations: ['Analiza obejmuje dokładnie jeden autoryzowany plik SOURCE; nie potwierdza technicznych twierdzeń bez Authority Ladder i kontrolowanego wykonania.'],
	};
	const recorded = {
		schemaVersion: 1,
		provenance: {
			mode: 'imported-session-analysis', model: 'unknown-codex-session',
			description: 'B5 focused analysis authored and recorded in the active coding session from the exact prepared request.',
		},
		'focused-article': { requestHash: request.requestHash, response },
	};
	await writeLabArtifacts(project, sourceRoot, { [`cartography/${topic}-session-responses.json`]: stableJson(recorded) });
}

console.log('Recorded three bounded B5 Cartographer responses.');
