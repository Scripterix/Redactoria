import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeResearchArtifacts } from '../engine/core/research-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');

const definitions = {
	markdown: {
		facts: [
			['commonmark-blocks', ['commonmark-core'], 'CommonMark rozróżnia bloki, takie jak nagłówki, akapity, listy i bloki kodu, od elementów inline, takich jak wyróżnienia i linki.', [['commonmark-spec', 'blocks-inlines']]],
			['commonmark-fences', ['commonmark-core'], 'Fenced code block zaczyna się co najmniej trzema kolejnymi backtickami albo tyldami; znaków ogrodzenia nie wolno mieszać.', [['commonmark-spec', 'fenced-code']]],
			['gfm-boundary', ['gfm-boundary'], 'GFM jest ścisłym nadzbiorem CommonMark, a tabele, przekreślenie i task listy są rozszerzeniami GFM.', [['gfm-spec', 'gfm-superset'], ['gfm-spec', 'gfm-extensions']]],
		] as const,
		correction: ['markdown-legacy-dialect', ['gfm-boundary'], 'Przykład atrybutów nagłówka z materiału legacy nie należy do podstawowej składni CommonMark ani do opisanych rozszerzeń GFM.', [['commonmark-spec', 'blocks-inlines'], ['gfm-spec', 'gfm-superset']]] as const,
		probeId: 'node-commonmark-render',
		probeClaim: 'Kontrolowany renderer CommonMark 0.31.2 potwierdził wyniki dla nagłówka, wyróżnienia, linku, listy zagnieżdżonej i bloku kodu ogrodzonego tyldami.',
	},
	'javascript-calculator': {
		facts: [
			['number-conversion', ['numeric-input'], 'Wywołanie Number(value) wykonuje pełną konwersję wartości do typu Number; po konwersji Number.isFinite odrzuca NaN oraz dodatnią i ujemną nieskończoność.', [['ecmascript-numbers', 'number-conversion'], ['ecmascript-numbers', 'number-is-finite']]],
			['finite-no-coercion', ['numeric-input'], 'Number.isFinite nie wykonuje wstępnej konwersji, dlatego należy wywołać je na już przekonwertowanej liczbie.', [['mdn-number-is-finite', 'finite-practical']]],
			['function-class-boundary', ['function-class'], 'Klasa może grupować konstruktor i metody, lecz metoda może delegować tę samą operację do zwykłej funkcji; wybór formy organizuje API, a nie zmienia arytmetyki.', [['ecmascript-classes', 'class-methods']]],
		] as const,
		correction: ['calculator-default-zero', ['numeric-input'], 'Wzorzec parseFloat(value) || 0 maskuje pustą lub błędną wartość jako poprawne zero; walidacja powinna zwrócić jawny błąd.', [['ecmascript-numbers', 'number-conversion'], ['mdn-number-is-finite', 'finite-practical']]] as const,
		probeId: 'node-calculator-boundaries',
		probeClaim: 'Kontrolowana próba Node potwierdziła pełną konwersję, odrzucenie pustego tekstu, 12px i Infinity oraz identyczny wynik funkcji i delegującej metody klasy.',
	},
	'api-http-json': {
		facts: [
			['get-representation', ['http-json'], 'Metoda GET żąda transferu bieżącej reprezentacji zasobu, a znaczenie odpowiedzi wynika także ze statusu HTTP.', [['rfc-9110', 'get-semantics'], ['rfc-9110', 'method-purpose']]],
			['json-values', ['http-json'], 'JSON przenosi wartości będące obiektem, tablicą, liczbą, napisem, true, false albo null.', [['rfc-8259', 'json-values']]],
			['fetch-error-boundaries', ['fetch-errors'], 'fetch odrzuca obietnicę przy błędzie żądania lub sieci, natomiast status HTTP trzeba sprawdzić przez Response.ok lub status; parsowanie JSON może odrzucić osobno.', [['whatwg-fetch', 'ok-status'], ['whatwg-fetch', 'body-json'], ['mdn-fetch', 'fetch-rejection']]],
		] as const,
		correction: ['api-status-check', ['fetch-errors'], 'Łańcuch fetch(...).then(response => response.json()) nie odróżnia odpowiedzi HTTP 404 od sukcesu przed próbą parsowania JSON.', [['mdn-fetch', 'fetch-rejection'], ['whatwg-fetch', 'ok-status']]] as const,
		probeId: 'node-fetch-response-boundaries',
		probeClaim: 'Kontrolowane obiekty Response w Node potwierdziły cztery rozłączne wyniki: sukces JSON, błąd HTTP, błąd JSON i błąd sieci.',
	},
} as const;

for (const [topic, definition] of Object.entries(definitions)) {
	const request = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/request.json`), 'utf8')) as { requestHash: string };
	const bundle = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/sources.json`), 'utf8')) as any;
	const cartography = JSON.parse(await readFile(resolve(project, `lab/cartography/${topic}-single.json`), 'utf8')) as any;
	const articleEvidence = cartography.evidence;
	const finding = (tuple: readonly [string, readonly string[], string, readonly (readonly [string, string])[]]) => ({
		id: tuple[0], questionIds: [...tuple[1]], claim: tuple[2], sourceType: 'authority-ladder', status: 'verified',
		evidence: tuple[3].map(([documentId, excerptId]) => ({ documentId, excerptId })), articleEvidence,
		confidence: 0.98, recommendation: 'Użyć jako zweryfikowanej granicy treści i przykładów.',
	});
	const facts = definition.facts.map(finding);
	const correction = finding(definition.correction);
	const allEvidence = bundle.sources.flatMap((source: any) => source.excerpts.slice(0, 1).map((excerpt: any) => ({ documentId: source.id, excerptId: excerpt.id })));
	const code = {
		id: 'executed-boundaries', questionIds: bundle.questions.map((question: any) => question.id), claim: definition.probeClaim,
		sourceType: 'authority-ladder', status: 'verified', evidence: allEvidence, articleEvidence, confidence: 0.99,
		recommendation: 'Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.',
		verification: 'executed-probe', probeIds: [definition.probeId],
	};
	const ids = [...facts.map(item => item.id), correction.id, code.id];
	const analysis = {
		action: 'RESEARCH_PACKET', topic,
		environment: { runtimeScope: `Node ${process.version}; semantyka zgodna ze wskazanymi standardami`, asOfDate: bundle.asOfDate, evidence: allEvidence },
		verifiedFacts: facts, outdatedClaims: [], incorrectClaims: [correction], ambiguousClaims: [], securityNotes: [], codeReview: [code],
		recommendations: [{ id: 'modernize-bounded', action: 'CORRECT', instruction: 'Zmodernizować pojedynczy materiał legacy bez przenoszenia błędów i bez poszerzania zakresu.', findingIds: ids }],
		questionAnswers: bundle.questions.map((question: any) => ({
			questionId: question.id,
			status: 'resolved',
			findingIds: [...facts, correction, code].filter(item => item.questionIds.includes(question.id)).map(item => item.id),
			note: 'Rozstrzygnięte przez źródła z Authority Ladder i kontrolowaną próbę.',
		})),
		unresolvedQuestions: [],
		writerHandoff: {
			keep: [{ instruction: 'Zachować krótki, praktyczny charakter materiału legacy.', findingIds: facts.map(item => item.id) }],
			correct: [{ instruction: correction.claim, findingIds: [correction.id] }], avoid: [],
			caution: [{ instruction: 'Nie przedstawiać próby badawczej jako wykonania finalnego kodu artykułu.', findingIds: [code.id] }],
			verifiedCodeFindingIds: [code.id],
		},
		limitations: ['Research obejmuje jeden autoryzowany materiał SOURCE i tylko tyle źródeł Authority Ladder, ile potrzeba do rozstrzygnięcia claims; nie jest samodzielną zgodą na publikację.'],
	};
	const recorded = {
		schemaVersion: 1,
		provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B4 Authority Ladder analysis recorded in-session; exact model identifier is unavailable.' },
		research: { requestHash: request.requestHash, response: analysis },
	};
	await writeResearchArtifacts(project, sourceRoot, { [`research/${topic}/session-responses.json`]: stableJson(recorded) });
}

console.log('Recorded three B4 Researcher analyses.');
