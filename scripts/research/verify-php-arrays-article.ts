import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stableJson } from '../../engine/core/serialization.ts';
import { TARGET_RUNTIMES } from './runtime-verification.ts';

const project = fileURLToPath(new URL('../../', import.meta.url));
const articleRef = 'content/articles/tablice-w-php.md';
const baselineRef = 'lab/research/php-arrays/runtime-verification.json';
const jsonRef = 'lab/research/php-arrays/clarity-pass-2-runtime.json';
const markdownRef = 'lab/research/php-arrays/clarity-pass-2-runtime.md';

function hash(value: string | Buffer): string {
	return createHash('sha256').update(value).digest('hex');
}

function parseOptions(): Map<string, string> {
	const options = new Map<string, string>();
	for (let index = 2; index < process.argv.length; index += 2) {
		const flag = process.argv[index]!, value = process.argv[index + 1];
		if (!['--php84', '--php85'].includes(flag) || !value || !isAbsolute(value) || options.has(flag)) {
			throw new Error('Specify absolute --php84 and --php85 executable paths.');
		}
		options.set(flag, value);
	}
	if (!options.has('--php84') || !options.has('--php85')) {
		throw new Error('Both --php84 and --php85 are required.');
	}
	return options;
}

function slug(value: string): string {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
		.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function examplesFromArticle(article: string) {
	const pattern = /```php\r?\n([\s\S]*?)\r?\n```[\t \r\n]*Oczekiwany wynik:[\t \r\n]*```text\r?\n([\s\S]*?)\r?\n```/g;
	const examples = [];
	for (const match of article.matchAll(pattern)) {
		const before = article.slice(0, match.index);
		const heading = [...before.matchAll(/^### (.+)$/gm)].at(-1)?.[1];
		if (!heading) throw new Error('Every PHP example must have a level-three heading.');
		examples.push({
			id: slug(heading),
			title: heading,
			code: match[1]!.replace(/\r\n/g, '\n') + '\n',
			expectedStdout: match[2]!.replace(/\r\n/g, '\n') + '\n',
		});
	}
	if (!examples.length || new Set(examples.map(example => example.id)).size !== examples.length) {
		throw new Error('Examples are missing or their heading-derived IDs are not unique.');
	}
	const phpBlockCount = [...article.matchAll(/```php\r?\n/g)].length;
	if (examples.length !== phpBlockCount) {
		throw new Error(`Expected output is missing for ${phpBlockCount - examples.length} PHP example(s).`);
	}
	return examples;
}

const options = parseOptions();
const article = await readFile(resolve(project, articleRef), 'utf8');
const articleHash = hash(article);
const examples = examplesFromArticle(article);
const baseline = JSON.parse(await readFile(resolve(project, baselineRef), 'utf8')) as {
	runs: { family: '8.4' | '8.5'; executableHash: string; version: string }[];
};
const startedAt = new Date().toISOString();
const runs = [];

for (const [family, suffix] of [['8.4', '84'], ['8.5', '85']] as const) {
	const executable = options.get(`--php${suffix}`)!;
	const executableBytes = await readFile(executable);
	const executableHash = hash(executableBytes);
	const approvedRuntime = baseline.runs.find(run => run.family === family);
	if (!approvedRuntime || approvedRuntime.executableHash !== executableHash) {
		throw new Error(`PHP ${family} executable does not match the previously verified official runtime.`);
	}
	const version = spawnSync(executable, ['-n', '--version'], { encoding: 'utf8', timeout: 15_000 });
	if (version.status !== 0 || !version.stdout.startsWith(`PHP ${TARGET_RUNTIMES[family].version} (cli)`)) {
		throw new Error(`PHP ${family} executable reported an unexpected version.`);
	}
	const results = examples.map(example => {
		const execution = spawnSync(executable, ['-n'], {
			input: example.code,
			encoding: 'utf8',
			timeout: 5_000,
			maxBuffer: 1_048_576,
		});
		const stdout = execution.stdout.replace(/\r\n/g, '\n');
		const stderr = execution.stderr.replace(/\r\n/g, '\n');
		const matchesExpected = stdout === example.expectedStdout;
		const status = execution.status === 0 && execution.signal === null && stderr === '' && matchesExpected ? 'PASS' : 'FAIL';
		return {
			id: example.id,
			title: example.title,
			status,
			codeHash: hash(example.code),
			expectedStdoutHash: hash(example.expectedStdout),
			actualStdoutHash: hash(stdout),
			exitCode: execution.status,
			signal: execution.signal,
			stderr,
			...(matchesExpected ? {} : { expectedStdout: example.expectedStdout, actualStdout: stdout }),
		};
	});
	const status = results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
	runs.push({
		family,
		version: TARGET_RUNTIMES[family].version,
		versionBanner: version.stdout.trim(),
		executableHash,
		execution: 'actual-local-cli',
		arguments: ['-n', 'stdin'],
		status,
		passed: results.filter(result => result.status === 'PASS').length,
		total: results.length,
		results,
	});
	console.log(`PHP ${family}: ${status}, ${results.filter(result => result.status === 'PASS').length}/${results.length} article examples.`);
}

const status = runs.every(run => run.status === 'PASS') ? 'PASS' : 'FAIL';
const verification = {
	schemaVersion: 1,
	topic: 'php-arrays-beginner-clarity-pass-2',
	articleRef,
	articleHash,
	baselineRuntimeEvidenceRef: baselineRef,
	startedAt,
	finishedAt: new Date().toISOString(),
	exampleCount: examples.length,
	runtimeCount: runs.length,
	executionCount: examples.length * runs.length,
	status,
	runs,
	limitations: [
		'Each fenced PHP example paired with its expected-output block was executed independently through actual local CLI stdin.',
		'Exact stdout, empty stderr and exit code 0 were required; this is not a web-server, security or cross-platform test.',
		'The executable hashes must match the official PHP 8.4.26 and 8.5.11 binaries recorded by the existing approved runtime evidence.',
	],
};
const report = [
	'# PHP arrays clarity pass 2 — runtime verification',
	'',
	`Status: ${status}`,
	'',
	`Article: \`${articleRef}\``,
	`Article SHA-256: \`${articleHash}\``,
	`Examples: ${examples.length}; runtimes: ${runs.length}; executions: ${examples.length * runs.length}.`,
	'',
	...runs.flatMap(run => [
		`## PHP ${run.version}`,
		'',
		`${run.status}: ${run.passed}/${run.total} examples; actual local CLI, \`-n\`, stdin.`,
		`Executable SHA-256: \`${run.executableHash}\`.`,
		'',
		...run.results.map(result => `- ${result.status} — ${result.title} — code \`${result.codeHash}\``),
		'',
	]),
	'## Boundary',
	'',
	...verification.limitations.map(item => `- ${item}`),
	'',
].join('\n');

await Promise.all([
	writeFile(resolve(project, jsonRef), stableJson(verification), 'utf8'),
	writeFile(resolve(project, markdownRef), report, 'utf8'),
]);

if (status !== 'PASS') process.exitCode = 1;
