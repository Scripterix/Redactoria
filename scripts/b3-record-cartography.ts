import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const definitions = {
 'javascript-if-else': {
  sourceId: '2068', sourcePath: '2068-if-i-else-w-javascript-od-prostych-warunkow-do-pra.md',
  quote: "Bo inaczej Number('') zwróci 0, co wprowadziłoby w błąd.",
  title: 'Warunki w JavaScript: if, else i bezpieczna walidacja liczby',
  scope: 'if/else, kolejność gałęzi, truthy/falsy, === oraz jedna czysta funkcja analizująca tekst jako liczbę; bez prawa drogowego, logowania i kalkulatora kosztów.',
  keep: ['keep-validation', 'Zachować ideę sprawdzania pustej wartości przed konwersją Number.'],
  correct: ['correct-finite', 'Po Number sprawdzać Number.isFinite, nie tylko Number.isNaN, oraz uznać sam biały znak za brak wartości.'],
  uncertain: ['uncertain-ranges', 'Nie powielać normatywnych opisów zakresów prędkości bez źródła prawnego.'],
  remove: ['remove-apps', 'Usunąć poboczne aplikacje i skupić lekcję na kontrakcie jednej funkcji.'],
  missing: ['missing-equality', 'Dodać ścisłe porównanie i wyjaśnić kolejność if/else if/else.'],
  research: ['research-conversion', 'Zweryfikować ToBoolean, Number, NaN, Infinity i ścisłe porównanie w aktualnej specyfikacji oraz MDN.'],
  sections: ['Decyzja i kolejność gałęzi', 'Walidacja tekstowego wejścia', 'Granice, przypadki testowe i ćwiczenie'],
 },
 'javascript-arrays': {
  sourceId: '2048', sourcePath: '2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md',
  quote: 'Taki zapis sprawia, że dla każdego porównania funkcja avg liczy od nowa całą tablicę ocen.',
  title: 'Tablice JavaScript: map, filter, reduce i sort bez mutowania danych',
  scope: 'Stałe fixtures, map/filter/reduce, średnia z pustej tablicy i numeryczne sortowanie kopii; bez losowych ID, UI i niezmierzonych obietnic wydajności.',
  keep: ['keep-methods', 'Zachować mały przykład ocen jako wspólny kontekst dla metod tablicowych.'],
  correct: ['correct-determinism', 'Powtórne liczenie deterministycznej średniej może kosztować czas, lecz samo nie powoduje różnych wyników sortowania.'],
  uncertain: ['uncertain-performance', 'Nie nazywać precompute szybszym bez pomiaru i określonej wielkości danych.'],
  remove: ['remove-random', 'Usunąć losowe identyfikatory, aby przykłady miały powtarzalne wyniki.'],
  missing: ['missing-mutation', 'Jawnie pokazać, że sort mutuje odbiorcę, a toSorted lub kopia zachowuje wejście.'],
  research: ['research-arrays', 'Zweryfikować callbacki map/filter/reduce, pusty reduce, komparator, mutację i stabilność sortowania.'],
  sections: ['Transformowanie i filtrowanie', 'Redukcja i bezpieczna średnia', 'Sortowanie liczb i obiektów bez zmiany wejścia'],
 },
 'javascript-dom': {
  sourceId: '940', sourcePath: '940-post-45-javascript-dom-selections-i-proste-funkcje.md',
  quote: 'const allParagraphs = document.querySelectorAll(\'p\');',
  title: 'DOM w JavaScript: selektory, bezpieczny tekst i zdarzenia',
  scope: 'Mały kompletny dokument: querySelector/querySelectorAll, null, textContent, classList, createElement i click natywnego button; bez bibliotek, innerHTML z wejścia i hover-only.',
  keep: ['keep-dom-apis', 'Zachować naukę przez selektory, zmianę tekstu, klasę i tworzenie elementu.'],
  correct: ['correct-name', 'Poprawić Data Object Model na Document Object Model i uporządkować kompletne fragmenty.'],
  uncertain: ['uncertain-collections', 'Rozróżnić statyczny NodeList querySelectorAll od żywych kolekcji innych API.'],
  remove: ['remove-hover', 'Usunąć zachowanie dostępne wyłącznie po najechaniu wskaźnikiem.'],
  missing: ['missing-null', 'Dodać obsługę braku elementu oraz uruchomienie po zbudowaniu dokumentu.'],
  research: ['research-dom', 'Zweryfikować kontrakty selektorów, textContent, classList, createElement i zdarzeń oraz sprawdzić je w przeglądarce.'],
  sections: ['Selektory i możliwość braku elementu', 'Bezpieczna zmiana tekstu i klas', 'Tworzenie elementu i dostępne zdarzenie click'],
 },
} as const;

for (const [topic, d] of Object.entries(definitions)) {
 const request = JSON.parse(await readFile(resolve(project, `lab/cartography/requests/${topic}-single.json`), 'utf8')) as { requestHash: string };
 const evidence = [{ sourceId: d.sourceId, sourcePath: d.sourcePath, field: 'body', value: d.quote }];
 const finding = (data: readonly [string, string]) => ({ id: data[0], interpretation: data[1], evidence, confidence: 0.96 });
 const response = {
  task: 'SINGLE_ARTICLE', artifactName: `${topic}-single`, action: 'REWRITE', recommended: true, confidence: 0.97,
  reason: 'Źródło ma wartościowy rdzeń dydaktyczny, ale wymaga ograniczenia zakresu, korekt faktów i deterministycznych przykładów; spójny rewrite zachowa pochodzenie bez kopiowania błędów.',
  evidence, scope: d.scope, keep: [finding(d.keep)], correct: [finding(d.correct)], outdatedOrUncertain: [finding(d.uncertain)],
  remove: [finding(d.remove)], missing: [finding(d.missing)], needsResearch: [finding(d.research)], prerequisites: ['Podstawowa składnia JavaScript i uruchamianie małych przykładów.'], relationships: [],
  proposedTitle: d.title,
  proposedStructure: d.sections.map((title, index) => ({ order: index + 1, title, purpose: `Wyjaśnić i sprawdzić: ${title.toLowerCase()}.`, sourceIds: [d.sourceId], evidence, needsResearch: true })),
  limitations: ['Analiza obejmuje tylko jeden autoryzowany plik SOURCE; twierdzenia normatywne wymagają oficjalnych źródeł i wykonania przykładów.'],
 };
 const recorded = { schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B3 focused analysis recorded in-session; exact model identifier is unavailable.' }, 'focused-article': { requestHash: request.requestHash, response } };
 await writeLabArtifacts(project, sourceRoot, { [`cartography/${topic}-session-responses.json`]: stableJson(recorded) });
}
console.log('Recorded three bounded B3 Cartographer responses.');
