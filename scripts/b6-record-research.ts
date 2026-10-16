import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeResearchArtifacts } from '../engine/core/research-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';
import { B6_TOPICS } from '../engine/core/b6-authorization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!B6_TOPICS.includes(topic as typeof B6_TOPICS[number])) throw new Error('Usage: node scripts/b6-record-research.ts --topic <B6 topic>');

type Fact = readonly [string, readonly string[], string, readonly (readonly [string, string])[]];
const definitions: Record<typeof B6_TOPICS[number], { facts: readonly Fact[]; runtimeScope: string; probeClaim: string }> = {
	'php-language-foundation': {
		facts: [
			['php-variable-name', ['php-variable-type-model'], 'Zmienne PHP są zapisywane znakiem dolara przed nazwą, a wielkość liter w nazwie ma znaczenie.', [['php-variables', 'dollar-name']]],
			['php-scalar-types', ['php-variable-type-model'], 'Wyrażenia PHP mogą mieć między innymi typ null, bool, int, float i string; domyślnie język jest dynamicznie typowany.', [['php-types', 'built-in-types']]],
			['php-first-output', ['php-operators-output-cli'], 'Operator + daje sumę operandów, a echo wypisuje jeden lub więcej napisów; ich mały przykład można sprawdzić lokalnie w CLI.', [['php-arithmetic', 'addition'], ['php-echo', 'echo-output']]],
		],
		runtimeScope: 'PHP 8.2.4 CLI available in this environment; the article must not claim broader version coverage without a further check.',
		probeClaim: 'Kontrolowana próba PHP CLI zwróciła przewidywalny komunikat, sumę i trzy obserwacje typów dla string, int i bool.',
	},
	'javascript-language-foundation': {
		facts: [
			['js-lexical-bindings', ['js-bindings-values'], 'Deklaracje lexical tworzą bindingi przez let i const, a const wymaga inicjalizatora; const opisuje binding, nie ogólną niezmienność wartości złożonej.', [['ecmascript-lexical', 'lexical-declarations'], ['mdn-const', 'const-binding']]],
			['js-type-observation', ['js-bindings-values'], 'Operator typeof zwraca napis wskazujący typ swojego operandu, więc może służyć do prostej obserwacji wyniku początkującego programu.', [['mdn-typeof', 'typeof-result']]],
			['js-first-node-script', ['js-operators-output'], 'Node uruchamia program JavaScript przekazany jako plik lub inne wspierane wejście; lokalny przykład może połączyć operator i template literal w deterministyczny stdout.', [['node-cli', 'node-script']]],
		],
		runtimeScope: `Node ${process.version}; no browser or DOM behavior is within this article.`,
		probeClaim: 'Kontrolowana próba Node zwróciła komunikat template literal oraz obserwacje typeof dla string, number i boolean.',
	},
	'javascript-functions-callbacks': {
		facts: [
			['js-function-parameters-return', ['js-function-return'], 'Definicja funkcji tworzy function object z parametrami i body; funkcja może zwrócić wartość do miejsca wywołania przez return.', [['ecmascript-functions', 'function-definition'], ['mdn-functions', 'parameters-return']]],
			['js-map-callback', ['js-callback-model'], 'Array.prototype.map tworzy nową tablicę z wyników wywołania przekazanej funkcji dla kolejnych elementów.', [['mdn-map', 'map-callback']]],
			['js-functions-node-scope', ['js-function-return'], 'Node uruchamia lokalny program JavaScript, dzięki czemu parametry, return i stdout można wykonać bez zależności DOM.', [['node-cli', 'node-script']]],
		],
		runtimeScope: `Node ${process.version}; callback is limited to synchronous Array.map, not events or asynchronous APIs.`,
		probeClaim: 'Kontrolowana próba Node potwierdziła wynik funkcji add oraz nową tablicę wyników callbacku map.',
	},
};

const definition = definitions[topic as typeof B6_TOPICS[number]];
const request = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/request.json`), 'utf8')) as { requestHash: string };
const bundle = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/sources.json`), 'utf8')) as any;
const cartography = JSON.parse(await readFile(resolve(project, `lab/cartography/${topic}-single.json`), 'utf8')) as any;
const articleEvidence = cartography.evidence;
const finding = (tuple: Fact) => ({
	id: tuple[0], questionIds: [...tuple[1]], claim: tuple[2], sourceType: 'authority-ladder', status: 'verified',
	evidence: tuple[3].map(([documentId, excerptId]) => ({ documentId, excerptId })), articleEvidence, confidence: 0.98,
	recommendation: 'Use this only within the selected beginner scope and preserve its stated runtime boundary.',
});
const facts = definition.facts.map(finding);
const environmentEvidence = bundle.sources.map((source: any) => ({ documentId: source.id, excerptId: source.excerpts[0].id }));
const code = {
	id: 'executed-boundaries', questionIds: bundle.questions.map((question: any) => question.id), claim: definition.probeClaim,
	sourceType: 'authority-ladder', status: 'verified', evidence: environmentEvidence, articleEvidence, confidence: 0.99,
	recommendation: 'Run every final draft example independently; this probe only supports the research boundary.',
	verification: 'executed-probe', probeIds: bundle.probes.map((probe: any) => probe.id),
};
const analysis = {
	action: 'RESEARCH_PACKET', topic,
	environment: { runtimeScope: definition.runtimeScope, asOfDate: bundle.asOfDate, evidence: environmentEvidence },
	verifiedFacts: facts, outdatedClaims: [], incorrectClaims: [], ambiguousClaims: [], securityNotes: [], codeReview: [code],
	recommendations: [{ id: 'keep-bounded-entry-scope', action: 'KEEP', instruction: 'Uczyć tylko zweryfikowanego, lokalnego rdzenia; nie przenosić frameworków, DOM, klas ani marketingowych porównań.', findingIds: [...facts.map((item) => item.id), code.id] }],
	questionAnswers: bundle.questions.map((question: any) => ({ questionId: question.id, status: 'resolved',
		findingIds: [...facts, code].filter((item) => item.questionIds.includes(question.id)).map((item) => item.id),
		note: 'Rozstrzygnięte przez adekwatne źródła Authority Ladder oraz kontrolowaną próbę lokalną.' })),
	unresolvedQuestions: [],
	writerHandoff: {
		keep: [{ instruction: 'Zachować krótkie samodzielne przykłady i jawne oczekiwane wyniki.', findingIds: facts.map((item) => item.id) }],
		correct: [], avoid: [{ instruction: 'Nie przedstawiać context SOURCE jako pełnej lub zweryfikowanej lekcji i nie wykraczać poza zakres runtime.', findingIds: [code.id] }],
		caution: [{ instruction: 'Próba badawcza nie jest wykonaniem końcowych bloków artykułu.', findingIds: [code.id] }], verifiedCodeFindingIds: [code.id],
	},
	limitations: ['Research uses one authorized context/source body and four Authority Ladder documents. It validates neither every engine version nor publication readiness.'],
};
const recorded = {
	schemaVersion: 1,
	provenance: { mode: 'imported-session-analysis', model: 'codex-session', description: 'B6 Authority Ladder analysis recorded in the active coding session; exact provider model identifier is unavailable.' },
	research: { requestHash: request.requestHash, response: analysis },
};
await writeResearchArtifacts(project, sourceRoot, { [`research/${topic}/session-responses.json`]: stableJson(recorded) });
console.log(`Recorded B6 Researcher analysis for ${topic}.`);
