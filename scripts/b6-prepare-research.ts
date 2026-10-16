import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AuthorityDocumentSchema, ResearchBundleSchema, RuntimeProbeSchema } from '../engine/agents/researcher/contract.ts';
import { sourceAuthorityForUrl } from '../engine/agents/researcher/policies.ts';
import { B6_AUTHORIZATION_REF, B6AuthorizationSchema, B6_TOPICS } from '../engine/core/b6-authorization.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!B6_TOPICS.includes(topic as typeof B6_TOPICS[number])) throw new Error('Usage: node scripts/b6-prepare-research.ts --topic <B6 topic>');

type Source = {
	id: string;
	title: string;
	url: string;
	kind: 'specification' | 'project-documentation' | 'runtime-documentation' | 'web-platform-reference';
	excerpts: { id: string; text: string; locator: string }[];
};
type Definition = {
	questions: { id: string; section: string; question: string; cartographerFindingIds: string[] }[];
	sources: Source[];
	runtime: { id: string; kind: 'node' | 'cli'; executable: string; code: string; description: string };
};

const definitions: Record<typeof B6_TOPICS[number], Definition> = {
	'php-language-foundation': {
		questions: [
			{ id: 'php-variable-type-model', section: 'values', question: 'Jak bezpiecznie wprowadzić nazwy zmiennych i podstawowe typy scalar?', cartographerFindingIds: ['research-php-entry-semantics'] },
			{ id: 'php-operators-output-cli', section: 'first-script', question: 'Jak pokazać operator arytmetyczny, echo i wynik lokalnego pliku bez serwera WWW?', cartographerFindingIds: ['research-php-entry-semantics'] },
		],
		sources: [
			{ id: 'php-variables', title: 'PHP Manual — Basics: Variables', url: 'https://www.php.net/manual/en/language.variables.basics.php', kind: 'runtime-documentation', excerpts: [{ id: 'dollar-name', text: 'Variables in PHP are represented by a dollar sign followed by the name of the variable, and variable names are case-sensitive.', locator: 'Basics' }] },
			{ id: 'php-types', title: 'PHP Manual — Introduction: Types', url: 'https://www.php.net/manual/en/language.types.intro.php', kind: 'runtime-documentation', excerpts: [{ id: 'built-in-types', text: 'Expressions have built-in types such as null, bool, int, float and string; PHP is dynamically typed by default.', locator: 'Introduction' }] },
			{ id: 'php-arithmetic', title: 'PHP Manual — Arithmetic Operators', url: 'https://www.php.net/manual/en/language.operators.arithmetic.php', kind: 'runtime-documentation', excerpts: [{ id: 'addition', text: 'The + operator produces the sum of two operands, while -, * and / provide subtraction, multiplication and division.', locator: 'Arithmetic Operators table' }] },
			{ id: 'php-echo', title: 'PHP Manual — echo', url: 'https://www.php.net/manual/en/function.echo.php', kind: 'runtime-documentation', excerpts: [{ id: 'echo-output', text: 'echo outputs one or more strings and is a language construct rather than a function.', locator: 'Description' }] },
		],
		runtime: { id: 'php-cli', kind: 'cli', executable: 'php', description: 'Local scalar values, arithmetic, type observation and output in PHP CLI.', code: '$name = "Ada"; $count = 2; $total = $count + 3; echo json_encode(["line" => "$name:$total", "types" => [get_debug_type($name), get_debug_type($count), get_debug_type(true)]], JSON_THROW_ON_ERROR), "\\n";' },
	},
	'javascript-language-foundation': {
		questions: [
			{ id: 'js-bindings-values', section: 'values', question: 'Jak wprowadzić const/let i wartości bez mieszania DOM lub kolekcji?', cartographerFindingIds: ['research-js-entry-semantics'] },
			{ id: 'js-operators-output', section: 'first-script', question: 'Jak pokazać typ, operator i czytelny wynik lokalnego programu Node?', cartographerFindingIds: ['research-js-entry-semantics'] },
		],
		sources: [
			{ id: 'ecmascript-lexical', title: 'ECMAScript Language Specification — Lexical Declarations', url: 'https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html', kind: 'specification', excerpts: [{ id: 'lexical-declarations', text: 'Lexical declarations introduce bindings with let and const; a const binding requires an initializer.', locator: 'Lexical Declarations' }] },
			{ id: 'mdn-const', title: 'MDN — const', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const', kind: 'web-platform-reference', excerpts: [{ id: 'const-binding', text: 'const declares block-scoped local bindings and requires an initializer.', locator: 'Description' }] },
			{ id: 'mdn-typeof', title: 'MDN — typeof', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof', kind: 'web-platform-reference', excerpts: [{ id: 'typeof-result', text: 'The typeof operator returns a string indicating the type of its operand.', locator: 'Description' }] },
			{ id: 'node-cli', title: 'Node.js Documentation — Command-line API', url: 'https://nodejs.org/api/cli.html', kind: 'runtime-documentation', excerpts: [{ id: 'node-script', text: 'The node command executes a JavaScript program supplied as a file path or other supported input.', locator: 'Command-line API' }] },
		],
		runtime: { id: 'node', kind: 'node', executable: process.execPath, description: 'Local JavaScript values, type observation, arithmetic and template literal in Node.', code: 'const name = "Ada"; let count = 2; count += 3; console.log(JSON.stringify({ message: `${name}:${count}`, types: [typeof name, typeof count, typeof true] }));' },
	},
	'javascript-functions-callbacks': {
		questions: [
			{ id: 'js-function-return', section: 'functions', question: 'Jak odróżnić parametry, return i efekt console.log?', cartographerFindingIds: ['research-functions-callbacks'] },
			{ id: 'js-callback-model', section: 'callbacks', question: 'Jak pokazać funkcję przekazaną do map bez DOM i asynchroniczności?', cartographerFindingIds: ['research-functions-callbacks'] },
		],
		sources: [
			{ id: 'ecmascript-functions', title: 'ECMAScript Language Specification — Functions and Classes', url: 'https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html', kind: 'specification', excerpts: [{ id: 'function-definition', text: 'A function definition creates a function object with formal parameters and a function body.', locator: 'Function Definitions' }] },
			{ id: 'mdn-functions', title: 'MDN — Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions', kind: 'web-platform-reference', excerpts: [{ id: 'parameters-return', text: 'Functions can receive parameters and return a value to the caller with return.', locator: 'Functions guide' }] },
			{ id: 'mdn-map', title: 'MDN — Array.prototype.map()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map', kind: 'web-platform-reference', excerpts: [{ id: 'map-callback', text: 'map creates a new array populated with results of calling a provided function on each element.', locator: 'Description' }] },
			{ id: 'node-cli', title: 'Node.js Documentation — Command-line API', url: 'https://nodejs.org/api/cli.html', kind: 'runtime-documentation', excerpts: [{ id: 'node-script', text: 'The node command executes a JavaScript program supplied as a file path or other supported input.', locator: 'Command-line API' }] },
		],
		runtime: { id: 'node', kind: 'node', executable: process.execPath, description: 'Function parameters, return values and Array.map callback in Node.', code: 'function add(left, right) { return left + right; } const doubled = [1, 2, 3].map(value => value * 2); console.log(JSON.stringify({ sum: add(2, 3), doubled }));' },
	},
};

function execute(runtime: Definition['runtime']) {
	const result = runtime.kind === 'node'
		? spawnSync(runtime.executable, ['-e', runtime.code], { encoding: 'utf8' })
		: spawnSync(runtime.executable, ['-r', runtime.code], { encoding: 'utf8' });
	if (result.status !== 0) throw new Error(`${runtime.id} probe failed: ${result.stderr}`);
	const version = runtime.kind === 'node' ? process.version : spawnSync(runtime.executable, ['--version'], { encoding: 'utf8' }).stdout.split(/\r?\n/, 1)[0]!.replace(/^PHP /, '');
	return RuntimeProbeSchema.parse({ id: `${topic}-boundaries`, description: runtime.description, runtimeId: runtime.id, runtimeVersion: version,
		code: runtime.code, codeHash: hashBytes(runtime.code), result: JSON.parse(result.stdout), diagnostics: [] });
}

const definition = definitions[topic as typeof B6_TOPICS[number]];
const authorizationText = await readFile(resolve(project, B6_AUTHORIZATION_REF), 'utf8');
const authorization = B6AuthorizationSchema.parse(JSON.parse(authorizationText));
if (!authorization.jobs.some((job) => job.topic === topic)) throw new Error('Topic is not authorized in B6.');
const retrievedAt = new Date().toISOString();
const sources = [];
for (const source of definition.sources) {
	const response = await fetch(source.url, { redirect: 'error', headers: { 'user-agent': 'Redactoria-B6-research/1.0' } });
	if (response.status !== 200 || response.url !== source.url) throw new Error(`${source.url}: HTTP ${response.status}, final ${response.url}`);
	const body = await response.text();
	const authority = sourceAuthorityForUrl(source.url);
	const selection = authority.tier <= 2 ? 'authoritative-content' : 'practical-content';
	sources.push(AuthorityDocumentSchema.parse({ ...source, sourceType: 'authority-ladder', authorityTier: authority.tier, authorityClass: authority.authorityClass,
		evidenceRole: authority.evidenceRole, retrievedAt, documentHash: createHash('sha256').update(body).digest('hex'),
		retrieval: { method: 'https-get', httpStatus: 200, finalUrl: response.url, selection } }));
}
const probe = execute(definition.runtime);
const bundle = ResearchBundleSchema.parse({ schemaVersion: 3, topicSlug: topic, asOfDate: retrievedAt.slice(0, 10),
	provenance: 'Current Authority Ladder snapshots plus one controlled local runtime probe. No SOURCE execution, external API, global configuration or publication action.',
	questions: definition.questions, sources, probes: [probe] });
await writeLabArtifacts(project, sourceRoot, {
	[`research/${topic}/sources.json`]: stableJson(bundle),
	[`research/${topic}/probes.json`]: stableJson([probe]),
});
console.log(`Prepared B6 research for ${topic}: ${sources.length} Authority Ladder sources; one ${probe.runtimeId} probe.`);
