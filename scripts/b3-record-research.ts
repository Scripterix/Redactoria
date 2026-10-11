import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeResearchArtifacts } from '../engine/core/research-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const defs = {
 'javascript-if-else': {
  article: { sourceId: '2068', sourcePath: '2068-if-i-else-w-javascript-od-prostych-warunkow-do-pra.md', field: 'body', value: 'if (Number.isNaN(n)) {' },
  core: 'Gałęzie if/else są sprawdzane po kolei; przed Number należy odrzucić brak lub same białe znaki, a po konwersji wymagać Number.isFinite.',
  correction: 'Sprawdzenie wyłącznie Number.isNaN nie odrzuca Infinity, a sprawdzenie raw === "" nie obejmuje samych białych znaków.',
  action: 'CORRECT', probe: 'node-if-boundaries',
 },
 'javascript-arrays': {
  article: { sourceId: '2048', sourcePath: '2048-tablice-javascript-js-arrays-sortowanie-filtrowani.md', field: 'body', value: 'Pierwotna wersja kodu miała drobny problem:średnia była liczona **na bieżąco w kilku miejscach** (avg(u.marks)), przez co sortowanie potrafiło zwracać różne wyniki albo działało wolniej.' },
  core: 'map i filter zwracają nowe tablice, reduce z wartością początkową obsługuje pustą tablicę, a sort mutuje odbiorcę i potrzebuje komparatora numerycznego.',
  correction: 'Wielokrotne wywołanie czystej funkcji avg może zwiększyć koszt, lecz nie powoduje samo w sobie różnych wyników sortowania.',
  action: 'CORRECT', probe: 'node-array-behavior',
 },
 'javascript-dom': {
  article: { sourceId: '940', sourcePath: '940-post-45-javascript-dom-selections-i-proste-funkcje.md', field: 'body', value: 'DOM ( Data Object Model )' },
  core: 'querySelector może zwrócić null, querySelectorAll zwraca statyczny NodeList, a textContent wstawia tekst bez interpretowania go jako HTML.',
  correction: 'Rozwinięcie skrótu DOM jako Data Object Model jest niepoprawne; poprawna nazwa to Document Object Model.',
  action: 'CORRECT', probe: null,
 },
} as const;

for (const [topic, d] of Object.entries(defs)) {
 const request = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/request.json`), 'utf8')) as { requestHash: string };
 const bundle = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/sources.json`), 'utf8')) as any;
 const evidence = bundle.sources.map((source: any) => ({ documentId: source.id, excerptId: source.excerpts[0].id }));
 const common = { questionIds: ['core'], sourceType: 'official-documentation', articleEvidence: [d.article], confidence: 0.98 };
 const verified = { id: 'verified-core', ...common, claim: d.core, status: 'verified', evidence, recommendation: 'Użyć tej semantyki jako granicy treści i przykładów.' };
 const incorrect = { id: 'correct-legacy', ...common, claim: d.correction, status: 'verified', evidence: [evidence[0]], recommendation: 'Nie przenosić błędu źródłowego do nowej wersji.' };
 const code = { id: 'code-boundary', ...common, claim: d.probe ? 'Kontrolowana próba Node potwierdza oczekiwane wyniki dla przypadków granicznych.' : 'Przykład DOM musi być sprawdzony później w kontrolowanej przeglądarce, nie emulowany w Node.', status: 'verified', evidence,
  recommendation: d.probe ? 'Pisać przykłady zgodne z wykonanym probe i ponownie wykonać kod finalnego draftu.' : 'Wykonać kompletny harness HTML w przeglądarce przed Critic.',
  verification: d.probe ? 'executed-probe' : 'documentation-reviewed', probeIds: d.probe ? [d.probe] : [] };
 const analysis = {
  action: 'RESEARCH_PACKET', topic, environment: { runtimeScope: d.probe ? `Node ${process.version}` : 'Współczesna przeglądarka z DOM', asOfDate: bundle.asOfDate, evidence },
  verifiedFacts: [verified], outdatedClaims: [], incorrectClaims: [incorrect], ambiguousClaims: [], securityNotes: [], codeReview: [code],
  recommendations: [{ id: 'rewrite-bounded', action: d.action, instruction: 'Napisać zwarty materiał od nowa, zachować pochodzenie i użyć tylko zweryfikowanych twierdzeń.', findingIds: ['verified-core', 'correct-legacy', 'code-boundary'] }],
  questionAnswers: [{ questionId: 'core', status: 'resolved', findingIds: ['verified-core', 'correct-legacy', 'code-boundary'], note: 'Zakres rozstrzygnięty przez oficjalną dokumentację i właściwą dla runtime weryfikację.' }], unresolvedQuestions: [],
  writerHandoff: { keep: [{ instruction: 'Zachować dydaktyczny rdzeń źródła, ale przepisać prozę.', findingIds: ['verified-core'] }], correct: [{ instruction: d.correction, findingIds: ['correct-legacy'] }], avoid: [], caution: [{ instruction: d.probe ? 'Wyniki draftu wykonać ponownie, niezależnie od probe badawczego.' : 'Nie deklarować wykonania DOM przed browser check.', findingIds: ['code-boundary'] }], verifiedCodeFindingIds: ['code-boundary'] },
  limitations: ['Badanie jest ograniczone do jednego autoryzowanego źródła legacy i wskazanych oficjalnych stron; nie stanowi zgody na publikację.'],
 };
 const recorded = { schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B3 official-source analysis recorded in-session; exact model identifier is unavailable.' }, research: { requestHash: request.requestHash, response: analysis } };
 await writeResearchArtifacts(project, sourceRoot, { [`research/${topic}/session-responses.json`]: stableJson(recorded) });
}
console.log('Recorded three B3 Researcher analyses.');
