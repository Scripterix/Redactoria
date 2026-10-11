import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const evidence = [{ kind: 'finding', id: 'verified-core' }, { kind: 'finding', id: 'correct-legacy' }, { kind: 'finding', id: 'code-boundary' }];
const definitions: Record<string, any> = {
 'javascript-if-else': {
  title: 'Warunki w JavaScript: if, else i bezpieczna walidacja liczby',
  sections: [
   { id: 'branches', heading: 'Pierwsza pasująca gałąź', coverage: ['conditions', 'branch-order', 'truthiness', 'strict-equality'], evidence,
    body: '`if` wykonuje blok, gdy warunek po konwersji do wartości logicznej jest prawdziwy. Kolejne `else if` są sprawdzane od góry, a po pierwszym dopasowaniu reszta łańcucha jest pomijana. Dlatego bardziej szczegółowy próg umieszczaj przed ogólniejszym. `else` obsługuje wszystkie pozostałe przypadki.\n\nWarto rozdzielić truthiness od porównania. Pusty napis jest falsy, lecz napis `"0"` jest truthy. Operator `===` nie konwertuje typów: liczba `0` i napis `"0"` nie są ściśle równe. Do sprawdzania danych wejściowych używaj jawnych warunków zamiast liczyć na przypadkową konwersję.',
    examples: [{ id: 'ordered-branches', language: 'js', purpose: 'Kolejność progów i ścisłe porównanie', code: `const score = 92;\nlet label;\nif (score >= 90) label = 'bardzo dobry';\nelse if (score >= 60) label = 'zaliczony';\nelse label = 'do poprawy';\nconsole.log(label);\nconsole.log(0 === '0');`, expectedOutput: 'bardzo dobry\nfalse\n', expectedDiagnostics: [] }] },
   { id: 'numeric-input', heading: 'Od tekstu do skończonej liczby', coverage: ['input-validation', 'finite-number', 'edge-cases'], evidence,
    body: 'Wartość z pola formularza jest tekstem. Sama funkcja `Number` nie wystarcza do walidacji: pusty napis i same białe znaki stają się zerem, a napis `"Infinity"` daje liczbę nieskończoną. Najpierw odrzuć `null`, `undefined` i tekst pusty po `trim()`. Potem wykonaj konwersję i zaakceptuj wynik tylko wtedy, gdy `Number.isFinite` zwraca `true`.\n\nCzysta funkcja poniżej ma jawny kontrakt i zwraca etykietę zamiast zmieniać DOM. Dzięki temu każdą gałąź można wykonać w Node. Zwróć uwagę na zero: nie jest dodatnie ani ujemne, więc potrzebuje własnej gałęzi.',
    examples: [{ id: 'analyze-number', language: 'js', purpose: 'Walidacja białych znaków, NaN i Infinity', code: `function analyzeNumber(raw) {\n  if (raw == null || String(raw).trim() === '') return 'brak';\n  const value = Number(raw);\n  if (!Number.isFinite(value)) return 'niepoprawna';\n  if (value > 0) return 'dodatnia';\n  if (value < 0) return 'ujemna';\n  return 'zero';\n}\nconsole.log([' ', '12', 'Infinity', 'abc', '0', '-2'].map(analyzeNumber).join('|'));`, expectedOutput: 'brak|dodatnia|niepoprawna|niepoprawna|zero|ujemna\n', expectedDiagnostics: [] }] },
  ],
 },
 'javascript-arrays': {
  title: 'Tablice JavaScript: map, filter, reduce i sort bez mutowania danych',
  sections: [
   { id: 'transform-filter', heading: 'Nowe tablice z map i filter', coverage: ['map', 'filter', 'stable-fixtures'], evidence,
    body: '`map` wywołuje funkcję dla elementów i buduje nową tablicę wyników. `filter` także zwraca nową tablicę, lecz zachowuje tylko elementy spełniające warunek. Do nauki używamy stałych danych, aby każde uruchomienie dawało ten sam wynik.\n\nNie trzeba dopisywać obliczonego pola do obiektów wejściowych. Możesz zwrócić nowe obiekty przez składnię spread. To ułatwia sprawdzenie, że oryginalna kolekcja pozostała bez zmian.',
    examples: [{ id: 'map-filter', language: 'js', purpose: 'Transformacja bez zmiany danych wejściowych', code: `const scores = [40, 75, 90];\nconst doubled = scores.map(score => score * 2);\nconst passed = scores.filter(score => score >= 60);\nconsole.log(JSON.stringify({ doubled, passed, scores }));`, expectedOutput: '{"doubled":[80,150,180],"passed":[75,90],"scores":[40,75,90]}\n', expectedDiagnostics: [] }] },
   { id: 'reduce-average', heading: 'reduce i pusta tablica', coverage: ['reduce', 'empty-array'], evidence,
    body: '`reduce` łączy elementy w jedną wartość. Podanie wartości początkowej `0` sprawia, że suma pustej tablicy również jest zdefiniowana. Średnia wymaga osobnego kontraktu: dla braku elementów poniższa funkcja zwraca `null`, bo zero mogłoby wyglądać jak prawdziwy wynik.\n\nZaokrąglanie jest decyzją prezentacyjną. Najpierw policz dokładną średnią, a dopiero podczas wyświetlania wybierz potrzebną liczbę miejsc.',
    examples: [{ id: 'safe-average', language: 'js', purpose: 'Średnia z jawnym przypadkiem pustym', code: `const average = values => values.length\n  ? values.reduce((sum, value) => sum + value, 0) / values.length\n  : null;\nconsole.log(average([2, 4, 9]));\nconsole.log(average([]));`, expectedOutput: '5\nnull\n', expectedDiagnostics: [] }] },
   { id: 'sorting', heading: 'Sortowanie numeryczne bez mutacji wejścia', coverage: ['numeric-sort', 'sort-mutation'], evidence,
    body: '`sort` zmienia tablicę, na której został wywołany. Bez komparatora porównuje wartości jak napisy, więc liczba 10 może znaleźć się przed 2. Jeśli chcesz zachować dane wejściowe, posortuj kopię utworzoną przez spread. Komparator `(a, b) => a - b` ustala kolejność rosnącą liczb.\n\nPonowne liczenie tej samej czystej średniej w komparatorze może być zbędną pracą, ale nie wprowadza losowości. Optymalizację uzasadniaj pomiarem, nie obietnicą.',
    examples: [{ id: 'numeric-copy-sort', language: 'js', purpose: 'Komparator liczbowy i zachowane wejście', code: `const values = [10, 2, 30];\nconst sorted = [...values].sort((a, b) => a - b);\nconsole.log(sorted.join(','));\nconsole.log(values.join(','));`, expectedOutput: '2,10,30\n10,2,30\n', expectedDiagnostics: [] }] },
  ],
 },
 'javascript-dom': {
  title: 'DOM w JavaScript: selektory, bezpieczny tekst i zdarzenia',
  sections: [
   { id: 'selection', heading: 'Selektory i brak dopasowania', coverage: ['query-selector', 'query-selector-all', 'null', 'static-node-list'], evidence,
    body: 'DOM to Document Object Model: obiektowa reprezentacja dokumentu. `querySelector` zwraca pierwszy pasujący element albo `null`, więc przed użyciem wyniku trzeba sprawdzić jego obecność. `querySelectorAll` zwraca statyczny `NodeList`: lista nie dopisze automatycznie elementu utworzonego później.\n\nUmieść skrypt po elementach w `body` albo użyj modułu ładowanego z odpowiednim momentem wykonania. W kompletnym przykładzie wszystkie wymagane elementy istnieją przed uruchomieniem skryptu.', examples: [] },
   { id: 'safe-update', heading: 'Tekst, klasy i nowy element', coverage: ['text-content', 'class-list', 'create-element'], evidence,
    body: '`textContent` zapisuje tekst, nie interpretuje go jako HTML. Jest właściwym wyborem, gdy treść może pochodzić z formularza. `classList.add` dodaje pojedynczy token klasy, a `createElement` tworzy nowy element, który można uzupełnić i dołączyć do dokumentu.\n\nPo kliknięciu napis przypominający znacznik pozostaje widocznym tekstem. Odczyt `innerHTML` pokaże encje, co potwierdza brak utworzonego elementu `strong`.', examples: [] },
   { id: 'click-example', heading: 'Kompletny przykład z natywnym przyciskiem', coverage: ['click'], evidence,
    body: 'Natywny element `button` można aktywować wskaźnikiem i klawiaturą. Rejestrujemy jedno zdarzenie `click`, zamiast budować zachowanie dostępne tylko po najechaniu. Przykład jest samodzielnym dokumentem do zapisania jako plik HTML i otwarcia w przeglądarce.\n\nPo aktywacji tytuł dostaje klasę, tekst jest zapisany bez parsowania HTML, a lista ma dwa elementy. Wcześniej zachowany statyczny `NodeList` nadal ma długość jeden.',
    examples: [{ id: 'dom-click', language: 'html', purpose: 'Bezpieczna zmiana DOM po kliknięciu', code: `<!doctype html>\n<html lang="pl"><meta charset="utf-8"><title>DOM</title>\n<body>\n<h1 id="title">Start</h1>\n<button id="add" type="button">Dodaj element</button>\n<ul id="list"><li>A</li></ul>\n<script>\nconst title = document.querySelector('#title');\nconst initial = document.querySelectorAll('#list li');\ndocument.querySelector('#add').addEventListener('click', () => {\n  title.textContent = '<strong>Bezpieczny tekst</strong>';\n  title.classList.add('updated');\n  const item = document.createElement('li');\n  item.textContent = 'B';\n  document.querySelector('#list').appendChild(item);\n  console.log(initial.length, document.querySelectorAll('#list li').length);\n});\n</script>\n</body></html>`, expectedOutput: 'Po kliknięciu: widoczny tekst <strong>Bezpieczny tekst</strong>; klasa updated; elementy listy A i B; konsola: 1 2.\n', expectedDiagnostics: [] }] },
  ],
 },
};

for (const [topic, d] of Object.entries(definitions)) {
 const request = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/request.json`), 'utf8')) as { requestHash: string };
 const input = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/input.json`), 'utf8')) as any;
 const response = { action: 'DRAFT', title: d.title, targetRuntimes: input.targetRuntimes, sections: d.sections,
  interactionOpportunities: [{ id: 'predict-result', sectionId: d.sections[0].id, type: 'predict-output', purpose: 'Sprawdzić model mentalny przed uruchomieniem.', prompt: 'Przewidź wynik przykładu i uzasadnij każdą część.', expectedConcept: 'Kolejność operacji i brak ukrytej mutacji lub konwersji.', implemented: false },
   { id: 'change-boundary', sectionId: d.sections.at(-1).id, type: 'exercise', purpose: 'Samodzielnie sprawdzić przypadek graniczny.', prompt: 'Zmień jedną wartość graniczną, zapisz przewidywanie i uruchom przykład ponownie.', expectedConcept: 'Jawny kontrakt i obserwowalny wynik.', implemented: false }],
  limitations: ['Materiał obejmuje wyłącznie autoryzowany zakres B3 i wskazany runtime; metadane interakcji nie są zaimplementowanym UI.'] };
 const recorded = { schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B3 Writer response authored from the validated packet; exact model identifier is unavailable.' }, writer: { requestHash: request.requestHash, response } };
 await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/session-responses.json`]: stableJson(recorded) });
}
console.log('Recorded three B3 Writer responses.');
