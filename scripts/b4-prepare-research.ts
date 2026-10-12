import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AuthorityDocumentSchema, ResearchBundleSchema } from '../engine/agents/researcher/contract.ts';
import { sourceAuthorityForUrl } from '../engine/agents/researcher/policies.ts';
import { B4_AUTHORIZATION_REF, B4AuthorizationSchema } from '../engine/core/b4-authorization.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const retrievedAt = new Date().toISOString();
const asOfDate = retrievedAt.slice(0, 10);
const authorizationText = await readFile(resolve(project, B4_AUTHORIZATION_REF), 'utf8');
const authorization = B4AuthorizationSchema.parse(JSON.parse(authorizationText));
const authorizationHash = hashBytes(authorizationText);

type SourceDefinition = {
	id: string;
	title: string;
	url: string;
	kind: 'specification' | 'standard' | 'project-documentation' | 'runtime-documentation' | 'web-platform-reference' | 'implementation-documentation' | 'compatibility-data' | 'educational-guide' | 'problem-report';
	excerpts: { id: string; text: string; locator: string }[];
};
type TopicDefinition = {
	questions: { id: string; section: string; question: string; cartographerFindingIds: string[] }[];
	sources: SourceDefinition[];
	probe: { id: string; description: string; code: string };
};

const definitions: Record<string, TopicDefinition> = {
	markdown: {
		questions: [
			{ id: 'commonmark-core', section: 'commonmark', question: 'Jak działają podstawowe bloki i elementy inline oraz fenced code blocks w CommonMark?', cartographerFindingIds: ['research-markdown'] },
			{ id: 'gfm-boundary', section: 'dialects', question: 'Które elementy są rozszerzeniami GFM i dlaczego trzeba nazwać dialekt?', cartographerFindingIds: ['research-markdown'] },
		],
		sources: [
			{ id: 'commonmark-spec', title: 'CommonMark Specification 0.31.2', url: 'https://spec.commonmark.org/0.31.2/', kind: 'specification', excerpts: [
				{ id: 'blocks-inlines', text: 'A document contains block structures such as paragraphs, headings, lists and code blocks, whose content can contain inline elements.', locator: '3 Blocks and inlines' },
				{ id: 'fenced-code', text: 'A fenced code block starts with at least three consecutive backticks or tildes; the two fence characters cannot be mixed.', locator: '4.5 Fenced code blocks' },
				{ id: 'inline-links', text: 'Inline links place the destination and optional title directly after link text.', locator: '6.4 Links' },
			] },
			{ id: 'gfm-spec', title: 'GitHub Flavored Markdown Specification', url: 'https://github.github.com/gfm/', kind: 'project-documentation', excerpts: [
				{ id: 'gfm-superset', text: 'GFM is a strict superset of CommonMark and marks its additional features as extensions.', locator: '1.1 What is GitHub Flavored Markdown?' },
				{ id: 'gfm-extensions', text: 'Tables, strikethrough and task list items are defined as GFM extensions rather than CommonMark core syntax.', locator: '4.10 and 5 Extensions' },
			] },
		],
		probe: { id: 'node-commonmark-render', description: 'Render headings, emphasis, links, nested lists and tilde-fenced code with commonmark 0.31.2',
			code: `import * as commonmark from 'commonmark'; const parser = new commonmark.Parser(); const renderer = new commonmark.HtmlRenderer(); const samples = { core: '# Tytuł\\n\\n**ważne** i [link](https://example.com)', list: '- jeden\\n  - dwa', fence: '~~~js\\nconsole.log(1);\\n~~~' }; const output = Object.fromEntries(Object.entries(samples).map(([key, value]) => [key, renderer.render(parser.parse(value))])); console.log(JSON.stringify(output));` },
	},
	'javascript-calculator': {
		questions: [
			{ id: 'numeric-input', section: 'input', question: 'Jak przekształcić cały tekst w skończoną liczbę bez maskowania błędów?', cartographerFindingIds: ['research-calculator'] },
			{ id: 'function-class', section: 'organization', question: 'Co faktycznie zmienia zapis tej samej operacji jako funkcji lub metody klasy?', cartographerFindingIds: ['research-calculator'] },
		],
		sources: [
			{ id: 'ecmascript-numbers', title: 'ECMAScript Language Specification — Numbers and Dates', url: 'https://tc39.es/ecma262/multipage/numbers-and-dates.html', kind: 'specification', excerpts: [
				{ id: 'number-conversion', text: 'Calling Number as a function converts the supplied value to a Number according to the specification conversion rules.', locator: 'Number constructor' },
				{ id: 'number-is-finite', text: 'Number.isFinite returns false for non-Number values and for NaN or positive or negative infinity.', locator: 'Number.isFinite' },
			] },
			{ id: 'ecmascript-classes', title: 'ECMAScript Language Specification — Functions and Classes', url: 'https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html', kind: 'specification', excerpts: [
				{ id: 'class-methods', text: 'A class body can define a constructor and methods; class definitions are always strict mode code.', locator: 'Class Definitions' },
			] },
			{ id: 'mdn-number-is-finite', title: 'MDN — Number.isFinite()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite', kind: 'web-platform-reference', excerpts: [
				{ id: 'finite-practical', text: 'Number.isFinite accepts only finite values already having the Number type and performs no preliminary coercion.', locator: 'Description' },
			] },
		],
		probe: { id: 'node-calculator-boundaries', description: 'Full Number conversion, finite checks, supported operators and equivalent function/class results',
			code: `function parseDecimal(raw) { if (raw == null || String(raw).trim() === '') return { ok: false, error: 'empty' }; const value = Number(raw); return Number.isFinite(value) ? { ok: true, value } : { ok: false, error: 'invalid-number' }; } function calculate(a, operator, b) { if (!['+', '-'].includes(operator)) return { ok: false, error: 'unsupported-operator' }; return { ok: true, value: operator === '+' ? a + b : a - b }; } class Calculator { calculate(a, operator, b) { return calculate(a, operator, b); } } const values = ['12.5', ' ', '12px', 'Infinity'].map(parseDecimal); console.log(JSON.stringify({ values, functionResult: calculate(7, '-', 2), classResult: new Calculator().calculate(7, '-', 2), badOperator: calculate(1, '*', 2) }));` },
	},
	'api-http-json': {
		questions: [
			{ id: 'http-json', section: 'protocol', question: 'Jak połączyć semantykę metody GET, status HTTP i reprezentację JSON?', cartographerFindingIds: ['research-api'] },
			{ id: 'fetch-errors', section: 'errors', question: 'Jak rozdzielić błąd sieci, nieudany status HTTP i błąd parsowania JSON?', cartographerFindingIds: ['research-api'] },
		],
		sources: [
			{ id: 'whatwg-fetch', title: 'WHATWG Fetch Standard', url: 'https://fetch.spec.whatwg.org/', kind: 'standard', excerpts: [
				{ id: 'ok-status', text: 'A Response reports whether its status is an ok status; a network failure is represented as a network error.', locator: 'Response and fetch methods' },
				{ id: 'body-json', text: 'The Body json method parses the body bytes as JSON and can reject when parsing fails.', locator: 'Body mixin methods' },
			] },
			{ id: 'rfc-9110', title: 'RFC 9110 — HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html', kind: 'standard', excerpts: [
				{ id: 'get-semantics', text: 'GET requests transfer a current representation of the target resource.', locator: '9.3.1 GET' },
				{ id: 'method-purpose', text: 'The request method token indicates the purpose of the request and the expected meaning of a successful result.', locator: '9.1 Overview' },
			] },
			{ id: 'rfc-8259', title: 'RFC 8259 — The JavaScript Object Notation Data Interchange Format', url: 'https://www.rfc-editor.org/rfc/rfc8259.html', kind: 'standard', excerpts: [
				{ id: 'json-values', text: 'A JSON value is an object, array, number, string, true, false or null.', locator: '3 Values' },
				{ id: 'unique-names', text: 'Object member names should be unique for interoperable behavior.', locator: '4 Objects' },
			] },
			{ id: 'mdn-fetch', title: 'MDN — Window.fetch()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch', kind: 'web-platform-reference', excerpts: [
				{ id: 'fetch-rejection', text: 'fetch rejects for request or network failures, but HTTP error statuses require an explicit Response.ok or status check.', locator: 'Return value' },
			] },
		],
		probe: { id: 'node-fetch-response-boundaries', description: 'Controlled Response fixtures for 200 JSON, 404, invalid JSON and rejected network request',
			code: `async function loadJson(fetcher, url) { try { const response = await fetcher(url); if (!response.ok) return { ok: false, kind: 'http', status: response.status }; try { return { ok: true, data: await response.json() }; } catch { return { ok: false, kind: 'json' }; } } catch { return { ok: false, kind: 'network' }; } } const fixtures = { success: async () => new Response('{"name":"Ada"}', { status: 200, headers: { 'content-type': 'application/json' } }), missing: async () => new Response('{"error":"missing"}', { status: 404, headers: { 'content-type': 'application/json' } }), invalid: async () => new Response('{bad json', { status: 200, headers: { 'content-type': 'application/json' } }), network: async () => { throw new TypeError('network'); } }; const result = {}; for (const [name, fixture] of Object.entries(fixtures)) result[name] = await loadJson(fixture, '/users'); console.log(JSON.stringify(result));` },
	},
};

for (const [topic, definition] of Object.entries(definitions)) {
	const job = authorization.jobs.find(item => item.topic === topic);
	if (!job) throw new Error(`Missing B4 job: ${topic}.`);
	const cartographyRef = `lab/cartography/${topic}-single.json`;
	const cartography = JSON.parse(await readFile(resolve(project, cartographyRef), 'utf8'));
	const decision = { schemaVersion: 3, status: 'approved', approvedBy: 'human', action: cartography.action, nextStep: 'research',
		targets: cartography.targets, confidence: cartography.confidence, reason: cartography.reason, evidence: cartography.evidence,
		analysisHash: hashJson(cartography), analysisRef: cartographyRef, authorizationRef: B4_AUTHORIZATION_REF, authorizationHash, topic };
	const sources = [];
	for (const item of definition.sources) {
		const response = await fetch(item.url, { redirect: 'error', headers: { 'user-agent': 'Redactoria-B4-research/1.0' } });
		if (response.status !== 200 || response.url !== item.url) throw new Error(`${item.url}: HTTP ${response.status}, final ${response.url}`);
		const body = await response.text();
		const authority = sourceAuthorityForUrl(item.url);
		const selection = authority.tier <= 2 ? 'authoritative-content' : authority.tier === 7 ? 'reviewed-problem-content' : 'practical-content';
		sources.push(AuthorityDocumentSchema.parse({ ...item, sourceType: 'authority-ladder', authorityTier: authority.tier,
			authorityClass: authority.authorityClass, evidenceRole: authority.evidenceRole, retrievedAt,
			documentHash: createHash('sha256').update(body).digest('hex'),
			retrieval: { method: 'https-get', httpStatus: 200, finalUrl: response.url, selection } }));
	}
	const execution = spawnSync(process.execPath, ['--input-type=module', '-e', definition.probe.code], { encoding: 'utf8' });
	if (execution.status !== 0) throw new Error(`${topic} probe failed: ${execution.stderr}`);
	const probe = { ...definition.probe, runtimeId: 'node', runtimeVersion: process.version,
		codeHash: createHash('sha256').update(definition.probe.code).digest('hex'), result: JSON.parse(execution.stdout), diagnostics: [] };
	const research = ResearchBundleSchema.parse({ schemaVersion: 3, topicSlug: topic, asOfDate,
		provenance: 'Source Authority Ladder snapshots plus one controlled local Node probe; no external example API calls.',
		questions: definition.questions, sources, probes: [probe] });
	await writeLabArtifacts(project, sourceRoot, {
		[`decisions/${topic}-rewrite.json`]: stableJson(decision),
		[`research/${topic}/sources.json`]: stableJson(research),
		[`research/${topic}/probes.json`]: stableJson([probe]),
	});
}
console.log('Prepared B4 decisions, Source Authority Ladder snapshots and controlled Node probes.');
