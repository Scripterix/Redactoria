import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!topic) throw new Error('Usage: node scripts/b5-record-writer.ts --topic <slug>');
const refs = (...ids: string[]) => ids.map(id => ({ kind: 'finding', id }));

const definitions: Record<string, { title: string; sections: any[]; limitations: string[] }> = {
	'git-local-basics': {
		title: 'Git lokalnie: status, staging, commit i historia',
		sections: [
			{
				id: 'three-states', heading: 'Working tree, index i HEAD', coverage: ['working-tree', 'index', 'head'],
				evidence: refs('git-three-states', 'git-two-diffs'), examples: [],
				body: 'W lokalnym repozytorium warto rozdzielić trzy obrazy pliku. Working tree to plik, który właśnie edytujesz. Index, nazywany też staging area, przechowuje treść przygotowaną do następnego commita. HEAD wskazuje bieżący commit, czyli ostatni zapis historii na aktualnej gałęzi.\n\n`git status` opisuje różnice między tymi obszarami. `git add` nie zapisuje historii: kopiuje bieżącą treść pliku do indexu. Jeżeli po `git add` ponownie zmienisz plik, część staged i nowa zmiana w working tree mogą istnieć jednocześnie.',
			},
			{
				id: 'init-status', heading: 'Nowe repozytorium i pierwszy status', coverage: ['init', 'status'],
				evidence: refs('git-local-history', 'git-three-states', 'executed-boundaries'),
				body: 'Utwórz pusty katalog ćwiczenia i plik `note.txt` z wierszem `pierwsza wersja`. Następnie wykonaj poniższe polecenia w tym katalogu. `git init` tworzy lokalne repozytorium; nie zakłada konta i nie wysyła niczego do GitHub.\n\nFormat `--short` skraca wynik statusu. Dwa znaki zapytania oznaczają plik untracked: Git widzi go w working tree, ale nie ma go jeszcze w indexie ani historii.',
				examples: [{ id: 'git-init-status', language: 'shell', purpose: 'Inicjalizacja i status istniejącego pliku note.txt', code: 'git init --quiet\ngit status --short', expectedOutput: '?? note.txt\n', expectedDiagnostics: [] }],
			},
			{
				id: 'diff-and-stage', heading: 'Zmiana przed i po git add', coverage: ['add', 'diff', 'diff-cached'],
				evidence: refs('git-two-diffs', 'git-cached-spelling', 'executed-boundaries'),
				body: 'Po pierwszym commicie dopisz do `note.txt` wiersz `druga linia`. Zwykły `git diff` porównuje working tree z indexem. Po `git add note.txt` ta sama treść znajduje się w indexie, dlatego oglądasz ją przez `git diff --cached`.\n\nOpcja nazywa się `--cached`, nie `--cashed`. Wariant `--numstat` pokazuje zwięzłe liczby dodanych i usuniętych wierszy; tutaj jedna linia została dodana i żadna usunięta.',
				examples: [{ id: 'git-diff-stage', language: 'shell', purpose: 'Ta sama zmiana przed i po stagingu', code: 'git diff --numstat -- note.txt\ngit add note.txt\ngit diff --cached --numstat -- note.txt', expectedOutput: '1\t0\tnote.txt\n1\t0\tnote.txt\n', expectedDiagnostics: [] }],
			},
			{
				id: 'commit-log', heading: 'Commit i krótka historia', coverage: ['commit', 'log'],
				evidence: refs('git-local-history', 'executed-boundaries'),
				body: 'Commit zapisuje wersję przygotowaną w indexie. Do lokalnego ćwiczenia ustaw nazwę i e-mail autora wyłącznie w tym repozytorium przez `git config user.name` oraz `git config user.email`; nie zmieniaj konfiguracji globalnej.\n\nPo drugim commicie `git log -2` ogranicza wynik do dwóch wpisów, a format `%s` pokazuje same tematy komunikatów. Najnowszy commit jest pierwszy.',
				examples: [{ id: 'git-commit-log', language: 'shell', purpose: 'Drugi commit i dwa komunikaty historii', code: 'git add note.txt\ngit commit --quiet -m "Druga wersja"\ngit log -2 --pretty=format:"%s"', expectedOutput: 'Druga wersja\nPierwsza wersja', expectedDiagnostics: [] }],
			},
		],
		limitations: ['Ćwiczenie dotyczy jednego lokalnego repozytorium. Nie obejmuje GitHub, Gist, push, merge, stash, reset --hard ani konfiguracji globalnej.'],
	},
	'curl-http-basics': {
		title: 'curl i HTTP: odpowiedź, nagłówki i lokalny JSON',
		sections: [
			{
				id: 'response-parts', heading: 'Odpowiedź HTTP ma status, nagłówki i body', coverage: ['curl-command', 'get-body', 'http-status'],
				evidence: refs('curl-body-headers', 'curl-status-output'), examples: [],
				body: 'Polecenie `curl.exe` pozwala obejrzeć odpowiedź HTTP z terminala. Używamy jawnie nazwy `curl.exe`, aby w PowerShell nie pomylić programu z innym poleceniem lub aliasem. Odpowiedź ma kod statusu, nagłówki i opcjonalne body.\n\nW ćwiczeniu działa kontrolowany serwer pod `127.0.0.1:38421`. Trasa `/data` zwraca status 200 i mały dokument JSON, a `/missing` zwraca 404. Nie wysyłamy danych do zewnętrznego API.',
			},
			{
				id: 'get-body', heading: 'GET i body JSON', coverage: ['get-body'],
				evidence: refs('curl-body-headers', 'executed-boundaries'),
				body: 'Bez dodatkowej opcji curl wypisuje body odpowiedzi na standardowe wyjście. `--silent` usuwa pasek postępu, dzięki czemu wynik nadaje się do dalszego przetwarzania. Nie oznacza to jednak walidacji struktury JSON.',
				examples: [{ id: 'curl-get-json', language: 'shell', purpose: 'Body z kontrolowanego endpointu JSON', code: 'curl.exe --silent http://127.0.0.1:38421/data', expectedOutput: '{"name":"Ada"}\n', expectedDiagnostics: [] }],
			},
			{
				id: 'headers-head', heading: 'Nagłówki: --include i --head', coverage: ['head-headers', 'include'],
				evidence: refs('curl-body-headers'), examples: [],
				body: '`--include` dołącza nagłówki odpowiedzi do zwykłego body. `--head` dla HTTP wysyła metodę HEAD: ma semantykę GET, ale odpowiedź nie zawiera body. Nagłówki mogą opisywać reprezentację, którą zwróciłby GET.\n\nNie zakładaj, że każdy serwer zwróci identyczny zestaw ani kolejność nagłówków. Do automatycznego sprawdzania statusu lepiej użyć `--write-out` niż parsować pierwszą linię nagłówków.',
			},
			{
				id: 'status-exit', heading: 'Status HTTP i kod wyjścia procesu', coverage: ['write-out', 'exit-code', 'fail-with-body'],
				evidence: refs('curl-status-output', 'curl-fail-body', 'curl-status-exit-separation', 'executed-boundaries'),
				body: '`--write-out` wypisuje dane o zakończonym transferze. Zmienna `%{http_code}` daje kod statusu, nawet gdy body zapiszesz do `NUL`. Sam status 404 nie musi oznaczać niezerowego kodu wyjścia curl.\n\nJeżeli skrypt ma traktować odpowiedzi 400+ jako błąd procesu i zachować body diagnostyczne, użyj `--fail-with-body`. W takim przypadku curl kończy się kodem 22. To osobna informacja od statusu HTTP.',
				examples: [{ id: 'curl-http-status', language: 'shell', purpose: 'Sam status odpowiedzi bez body', code: 'curl.exe --silent --output NUL --write-out "status=%{http_code}" http://127.0.0.1:38421/missing', expectedOutput: 'status=404', expectedDiagnostics: [] }],
			},
		],
		limitations: ['Przykłady używają curl 8.13.0 na Windows i lokalnego serwera testowego; nie obejmują auth, cookies, proxy, pobierania plików ani zewnętrznych API.'],
	},
	'python-fundamentals': {
		title: 'Podstawy Pythona: wartości, warunki, pętle i funkcje',
		sections: [
			{
				id: 'values-lists', heading: 'Wartości, typy i listy', coverage: ['values', 'types', 'lists', 'indexing', 'slicing'],
				evidence: refs('python-values-lists', 'executed-boundaries'),
				body: 'Python przechowuje wartości różnych typów, między innymi liczby, napisy i listy. `type(value).__name__` pozwala zobaczyć nazwę typu. Lista zachowuje kolejność, jej pierwszy element ma indeks `0`, a slicing `lista[1:]` zwraca nową listę od indeksu 1 do końca.\n\nPrzypisanie wiąże nazwę z wartością. Nie trzeba deklarować typu przed pierwszym przypisaniem, ale kod nadal powinien jasno określać, jakich danych oczekuje.',
				examples: [{ id: 'python-values-lists', language: 'python', purpose: 'Typ napisu, pierwszy element i fragment listy', code: 'name = "Ada"\nscores = [2, 4, 6]\nprint(type(name).__name__)\nprint(scores[0])\nprint(scores[1:])', expectedOutput: 'str\n2\n[4, 6]\n', expectedDiagnostics: [] }],
			},
			{
				id: 'conditions-range', heading: 'Warunek i pętla range', coverage: ['if-elif-else', 'for', 'range', 'indentation'],
				evidence: refs('python-branches', 'python-range', 'python-complete-blocks', 'executed-boundaries'),
				body: '`if`, `elif` i `else` wybierają jedną gałąź. Blok jest wyznaczony wcięciem, dlatego linie należące do warunku muszą mieć spójne wcięcie.\n\n`range(-1, 2)` tworzy wartości -1, 0 i 1; koniec 2 jest wyłączony. Pętla `for` przechodzi po każdej z nich. Ten przykład obejmuje gałąź ujemną, zero i gałąź dodatnią.',
				examples: [{ id: 'python-condition-range', language: 'python', purpose: 'Trzy gałęzie dla wartości z range', code: 'for number in range(-1, 2):\n    if number > 0:\n        label = "positive"\n    elif number < 0:\n        label = "negative"\n    else:\n        label = "zero"\n    print(number, label)', expectedOutput: '-1 negative\n0 zero\n1 positive\n', expectedDiagnostics: [] }],
			},
			{
				id: 'function-return', heading: 'Funkcja zwraca wynik', coverage: ['functions', 'return'],
				evidence: refs('python-function-return', 'python-complete-blocks', 'executed-boundaries'),
				body: '`def` rozpoczyna definicję funkcji. Parametr `values` przyjmuje listę przekazaną przy wywołaniu. `return` kończy funkcję i oddaje obliczony wynik; dopiero `print` wypisuje go na standardowe wyjście.\n\nFunkcja poniżej używa jawnej wartości początkowej `0`, dzięki czemu dla pustej listy również zwróci zero.',
				examples: [{ id: 'python-function-total', language: 'python', purpose: 'Suma listy zwracana z funkcji', code: 'def total(values):\n    result = 0\n    for value in values:\n        result += value\n    return result\n\nprint(total([2, 4, 6]))\nprint(total([]))', expectedOutput: '12\n0\n', expectedDiagnostics: [] }],
			},
		],
		limitations: ['Przykłady dotyczą czystego Pythona 3.14 i 3.11. Nie obejmują sieci, bibliotek zewnętrznych, scrapingu, AI ani Pythona 2.'],
	},
};

const definition = definitions[topic];
if (!definition) throw new Error(`Unknown B5 topic: ${topic}.`);
const request = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/request.json`), 'utf8')) as { requestHash: string };
const input = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/input.json`), 'utf8')) as any;
const response = {
	action: 'DRAFT',
	title: definition.title,
	targetRuntimes: input.targetRuntimes,
	sections: definition.sections,
	interactionOpportunities: [
		{ id: 'predict-output', sectionId: definition.sections[1].id, type: 'predict-output', purpose: 'Sprawdzić model mentalny przed uruchomieniem.', prompt: 'Przewidź dokładny wynik pierwszego wykonywalnego przykładu, a potem porównaj go z uruchomieniem.', expectedConcept: 'Jawny stan wejściowy prowadzi do obserwowalnego wyniku.', implemented: false },
		{ id: 'change-boundary', sectionId: definition.sections.at(-1).id, type: 'exercise', purpose: 'Samodzielnie sprawdzić przypadek graniczny.', prompt: 'Zmień jedną wartość graniczną, zapisz przewidywanie i wykonaj przykład ponownie.', expectedConcept: 'Granice polecenia lub języka pozostają jawne.', implemented: false },
	],
	limitations: definition.limitations,
};
const recorded = {
	schemaVersion: 1,
	provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B5 Writer response authored from the validated Authority Ladder packet; exact model identifier is unavailable.' },
	writer: { requestHash: request.requestHash, response },
};
await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/session-responses.json`]: stableJson(recorded) });
console.log(`Recorded B5 Writer response for ${topic}.`);
