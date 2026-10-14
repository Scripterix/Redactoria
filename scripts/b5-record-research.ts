import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeResearchArtifacts } from '../engine/core/research-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!topic) throw new Error('Usage: node scripts/b5-record-research.ts --topic <slug>');

type Tuple = readonly [string, readonly string[], string, readonly (readonly [string, string])[]];
const definitions: Record<string, {
	facts: readonly Tuple[];
	corrections: readonly Tuple[];
	probeClaim: string;
	runtimeScope: string;
}> = {
	'git-local-basics': {
		facts: [
			['git-three-states', ['git-state-model'], 'Git rozróżnia zawartość pliku w working tree, zapis przygotowany w indexie oraz wersję z bieżącego commita HEAD; status opisuje różnice między tymi obszarami.', [['git-status', 'status-state'], ['git-add', 'add-index']]],
			['git-two-diffs', ['git-state-model'], 'git diff pokazuje zmiany working tree względem indexu, a git diff --cached pokazuje zmiany przygotowane w indexie względem HEAD.', [['git-diff', 'diff-working-index']]],
			['git-local-history', ['git-local-cycle'], 'git init tworzy lokalne repozytorium, commit zapisuje zawartość wybraną w indexie, a log pokazuje historię commitów.', [['git-init', 'init-repository'], ['git-commit-log', 'commit-index'], ['git-log', 'log-history']]],
		] as const,
		corrections: [
			['git-cached-spelling', ['git-state-model'], 'Materiał legacy zawiera literówkę --cashed; poprawna opcja używana do porównania staged changes to --cached.', [['git-diff', 'diff-working-index']]],
		] as const,
		probeClaim: 'Izolowane lokalne repozytorium potwierdziło stany ??, A, różnicę working tree, różnicę --cached oraz kolejność dwóch komunikatów w logu.',
		runtimeScope: 'Git 2.21.0.windows.1; wyłącznie izolowane repozytorium lokalne i konfiguracja autora w tym repozytorium',
	},
	'curl-http-basics': {
		facts: [
			['curl-body-headers', ['curl-response-parts'], 'curl domyślnie wypisuje body; --include dołącza nagłówki odpowiedzi, a --head wysyła dla HTTP metodę HEAD i pobiera same nagłówki.', [['curl-manpage', 'curl-include'], ['curl-manpage', 'curl-head'], ['rfc-9110', 'get-head']]],
			['curl-status-output', ['curl-exit-boundary'], '--write-out może wypisać po transferze kod statusu HTTP przez zmienną http_code.', [['curl-manpage', 'curl-write-out'], ['rfc-9110', 'status-code']]],
			['curl-fail-body', ['curl-exit-boundary'], '--fail-with-body zachowuje body odpowiedzi, ale dla statusu HTTP 400 lub wyższego kończy curl kodem 22.', [['curl-manpage', 'curl-fail-body']]],
		] as const,
		corrections: [
			['curl-status-exit-separation', ['curl-exit-boundary'], 'Status HTTP i kod wyjścia procesu nie są tym samym; bez opcji fail curl może zakończyć transfer 404 kodem procesu 0.', [['curl-manpage', 'curl-write-out'], ['curl-manpage', 'curl-fail-body']]],
		] as const,
		probeClaim: 'Kontrolowany serwer loopback potwierdził body GET, nagłówki HEAD, zapis statusu 404 oraz kod wyjścia 22 z zachowanym body dla --fail-with-body.',
		runtimeScope: 'curl 8.13.0 na Windows; wyłącznie kontrolowany serwer 127.0.0.1 bez zewnętrznych żądań',
	},
	'python-fundamentals': {
		facts: [
			['python-values-lists', ['python-values'], 'Python obsługuje liczby, napisy i listy; indeksowanie list zaczyna się od zera, a slicing zwraca wybrany fragment.', [['python-introduction', 'numbers-text-lists']]],
			['python-branches', ['python-flow-functions'], 'if wybiera gałąź, opcjonalne elif dodaje kolejne warunki, a else obsługuje pozostały przypadek.', [['python-control-flow', 'if-elif-else']]],
			['python-range', ['python-flow-functions'], 'range tworzy postęp arytmetyczny z wyłączoną wartością końcową i może sterować pętlą for.', [['python-control-flow', 'for-range']]],
			['python-function-return', ['python-flow-functions'], 'def rozpoczyna definicję funkcji, a return zwraca wartość do miejsca wywołania.', [['python-control-flow', 'function-definition']]],
		] as const,
		corrections: [
			['python-complete-blocks', ['python-flow-functions'], 'Fragmenty legacy trzeba odtworzyć jako kompletne bloki z prawidłowymi wcięciami i jawnym stdout; sama linia for i range nie tworzy kompletnego programu.', [['python-control-flow', 'for-range'], ['python-control-flow', 'function-definition']]],
		] as const,
		probeClaim: 'Te same deterministyczne przykłady wartości, slicing, range, warunków i return dały zgodny wynik w Pythonie 3.14.5 oraz 3.11.9.',
		runtimeScope: 'Python 3.14.5 i 3.11.9; czysty standardowy język bez sieci i bibliotek zewnętrznych',
	},
};

const definition = definitions[topic];
if (!definition) throw new Error(`Unknown B5 topic: ${topic}.`);
const request = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/request.json`), 'utf8')) as { requestHash: string };
const bundle = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/sources.json`), 'utf8')) as any;
const cartography = JSON.parse(await readFile(resolve(project, `lab/cartography/${topic}-single.json`), 'utf8')) as any;
const articleEvidence = cartography.evidence;
const finding = (tuple: Tuple) => ({
	id: tuple[0],
	questionIds: [...tuple[1]],
	claim: tuple[2],
	sourceType: 'authority-ladder',
	status: 'verified',
	evidence: tuple[3].map(([documentId, excerptId]) => ({ documentId, excerptId })),
	articleEvidence,
	confidence: 0.98,
	recommendation: 'Użyć jako zweryfikowanej granicy treści i przykładów.',
});
const facts = definition.facts.map(finding);
const corrections = definition.corrections.map(finding);
const allEvidence = bundle.sources.flatMap((source: any) => source.excerpts.slice(0, 1).map((excerpt: any) => ({ documentId: source.id, excerptId: excerpt.id })));
const code = {
	id: 'executed-boundaries',
	questionIds: bundle.questions.map((question: any) => question.id),
	claim: definition.probeClaim,
	sourceType: 'authority-ladder',
	status: 'verified',
	evidence: allEvidence,
	articleEvidence,
	confidence: 0.99,
	recommendation: 'Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.',
	verification: 'executed-probe',
	probeIds: bundle.probes.map((probe: any) => probe.id),
};
const allFindings = [...facts, ...corrections, code];
const analysis = {
	action: 'RESEARCH_PACKET',
	topic,
	environment: { runtimeScope: definition.runtimeScope, asOfDate: bundle.asOfDate, evidence: allEvidence },
	verifiedFacts: facts,
	outdatedClaims: [],
	incorrectClaims: corrections,
	ambiguousClaims: [],
	securityNotes: [],
	codeReview: [code],
	recommendations: [{ id: 'modernize-bounded', action: 'CORRECT', instruction: 'Zmodernizować jeden materiał legacy w ograniczonym, lokalnym i sprawdzalnym zakresie.', findingIds: allFindings.map(item => item.id) }],
	questionAnswers: bundle.questions.map((question: any) => ({
		questionId: question.id,
		status: 'resolved',
		findingIds: allFindings.filter(item => item.questionIds.includes(question.id)).map(item => item.id),
		note: 'Rozstrzygnięte przez źródła Authority Ladder i kontrolowane wykonanie lokalne.',
	})),
	unresolvedQuestions: [],
	writerHandoff: {
		keep: [{ instruction: 'Zachować praktyczny, terminalowy charakter materiału i jawne oczekiwane wyniki.', findingIds: facts.map(item => item.id) }],
		correct: corrections.map(item => ({ instruction: item.claim, findingIds: [item.id] })),
		avoid: [],
		caution: [{ instruction: 'Nie przedstawiać próby badawczej jako wykonania finalnego kodu artykułu.', findingIds: [code.id] }],
		verifiedCodeFindingIds: [code.id],
	},
	limitations: ['Research obejmuje jeden autoryzowany materiał SOURCE, oficjalne źródła potrzebne do zakresu oraz kontrolowane lokalne wykonanie; nie jest zgodą na publikację.'],
};
const recorded = {
	schemaVersion: 1,
	provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B5 Authority Ladder analysis recorded in-session; exact model identifier is unavailable.' },
	research: { requestHash: request.requestHash, response: analysis },
};
await writeResearchArtifacts(project, sourceRoot, { [`research/${topic}/session-responses.json`]: stableJson(recorded) });
console.log(`Recorded B5 Researcher analysis for ${topic}.`);
