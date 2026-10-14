import { createHash } from 'node:crypto';
import { execFile, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { AuthorityDocumentSchema, ResearchBundleSchema, RuntimeProbeSchema } from '../engine/agents/researcher/contract.ts';
import { sourceAuthorityForUrl } from '../engine/agents/researcher/policies.ts';
import { B5_AUTHORIZATION_REF, B5AuthorizationSchema } from '../engine/core/b5-authorization.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!topic) throw new Error('Usage: node scripts/b5-prepare-research.ts --topic <slug>');
const retrievedAt = new Date().toISOString();
const asOfDate = retrievedAt.slice(0, 10);
const authorizationText = await readFile(resolve(project, B5_AUTHORIZATION_REF), 'utf8');
const authorization = B5AuthorizationSchema.parse(JSON.parse(authorizationText));
const authorizationHash = hashBytes(authorizationText);
const execFileAsync = promisify(execFile);

type SourceDefinition = {
	id: string;
	title: string;
	url: string;
	kind: 'standard' | 'project-documentation' | 'runtime-documentation';
	excerpts: { id: string; text: string; locator: string }[];
};

const definitions: Record<string, {
	questions: { id: string; section: string; question: string; cartographerFindingIds: string[] }[];
	sources: SourceDefinition[];
}> = {
	'git-local-basics': {
		questions: [
			{ id: 'git-state-model', section: 'state', question: 'Jak working tree, index i HEAD wiążą się z status, add, diff oraz diff --cached?', cartographerFindingIds: ['research-git-local'] },
			{ id: 'git-local-cycle', section: 'cycle', question: 'Jak bezpiecznie wykonać lokalny cykl init → status → add → commit → log bez zdalnego repozytorium?', cartographerFindingIds: ['research-git-local'] },
		],
		sources: [
			{ id: 'git-init', title: 'git-init Documentation', url: 'https://git-scm.com/docs/git-init', kind: 'project-documentation', excerpts: [
				{ id: 'init-repository', text: 'git init creates an empty Git repository or reinitializes an existing one.', locator: 'NAME and DESCRIPTION' },
			] },
			{ id: 'git-status', title: 'git-status Documentation', url: 'https://git-scm.com/docs/git-status', kind: 'project-documentation', excerpts: [
				{ id: 'status-state', text: 'git status shows paths that differ between the working tree, index and current HEAD commit, including untracked paths.', locator: 'DESCRIPTION' },
			] },
			{ id: 'git-add', title: 'git-add Documentation', url: 'https://git-scm.com/docs/git-add', kind: 'project-documentation', excerpts: [
				{ id: 'add-index', text: 'git add updates the index with current working-tree content; later file changes require git add again before the next commit.', locator: 'DESCRIPTION' },
			] },
			{ id: 'git-diff', title: 'git-diff Documentation', url: 'https://git-scm.com/docs/git-diff', kind: 'project-documentation', excerpts: [
				{ id: 'diff-working-index', text: 'git diff compares working-tree changes with the index, while git diff --cached compares staged changes with the named commit or HEAD.', locator: 'DESCRIPTION' },
			] },
			{ id: 'git-commit-log', title: 'git-commit and git-log Documentation', url: 'https://git-scm.com/docs/git-commit', kind: 'project-documentation', excerpts: [
				{ id: 'commit-index', text: 'git commit records the contents selected in the index as a new commit.', locator: 'DESCRIPTION' },
			] },
			{ id: 'git-log', title: 'git-log Documentation', url: 'https://git-scm.com/docs/git-log', kind: 'project-documentation', excerpts: [
				{ id: 'log-history', text: 'git log shows commit logs and supports formatting selected commit information.', locator: 'NAME and PRETTY FORMATS' },
			] },
		],
	},
	'curl-http-basics': {
		questions: [
			{ id: 'curl-response-parts', section: 'response', question: 'Jak curl rozdziela body, nagłówki, status HTTP i metodę HEAD?', cartographerFindingIds: ['research-curl-http'] },
			{ id: 'curl-exit-boundary', section: 'errors', question: 'Jak --write-out i --fail-with-body rozdzielają status HTTP od kodu wyjścia procesu?', cartographerFindingIds: ['research-curl-http'] },
		],
		sources: [
			{ id: 'curl-manpage', title: 'curl command line tool man page', url: 'https://curl.se/docs/manpage.html', kind: 'project-documentation', excerpts: [
				{ id: 'curl-head', text: '--head fetches headers only and makes curl issue an HTTP HEAD request.', locator: '--head' },
				{ id: 'curl-include', text: '--include adds response headers to the normal output together with the response body.', locator: '--include' },
				{ id: 'curl-write-out', text: '--write-out prints selected transfer information after completion; http_code exposes the response status code.', locator: '--write-out and VARIABLES' },
				{ id: 'curl-fail-body', text: '--fail-with-body returns error 22 for HTTP responses with status 400 or greater while preserving the response body.', locator: '--fail-with-body' },
			] },
			{ id: 'rfc-9110', title: 'RFC 9110 — HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html', kind: 'standard', excerpts: [
				{ id: 'get-head', text: 'GET requests transfer a current representation; HEAD has the same semantics as GET but the server does not send content in the response.', locator: '9.3.1 GET and 9.3.2 HEAD' },
				{ id: 'status-code', text: 'The status code describes the result of attempting to understand and satisfy the request.', locator: '15 Status Codes' },
			] },
		],
	},
	'python-fundamentals': {
		questions: [
			{ id: 'python-values', section: 'values', question: 'Jak wyjaśnić liczby, napisy, listy i indeksowanie bez przenoszenia nieaktualnej składni?', cartographerFindingIds: ['research-python-core'] },
			{ id: 'python-flow-functions', section: 'flow', question: 'Jak połączyć if, for, range i funkcję w małych deterministycznych przykładach?', cartographerFindingIds: ['research-python-core'] },
		],
		sources: [
			{ id: 'python-introduction', title: 'Python 3.14 Tutorial — An Informal Introduction', url: 'https://docs.python.org/3.14/tutorial/introduction.html', kind: 'runtime-documentation', excerpts: [
				{ id: 'numbers-text-lists', text: 'The tutorial introduces numeric expressions, strings and lists, including zero-based indexing and slicing.', locator: '3.1 Using Python as a Calculator' },
			] },
			{ id: 'python-control-flow', title: 'Python 3.14 Tutorial — More Control Flow Tools', url: 'https://docs.python.org/3.14/tutorial/controlflow.html', kind: 'runtime-documentation', excerpts: [
				{ id: 'if-elif-else', text: 'Python uses if with optional elif and else clauses for conditional execution.', locator: '4.1 if Statements' },
				{ id: 'for-range', text: 'for iterates over collection items, and range generates arithmetic progressions with an excluded end value.', locator: '4.2 for Statements and 4.3 range()' },
				{ id: 'function-definition', text: 'def introduces a function definition; return sends a value back to the caller.', locator: '4.7 Defining Functions' },
			] },
		],
	},
};

function command(file: string, args: string[], cwd?: string) {
	const result = spawnSync(file, args, { cwd, encoding: 'utf8' });
	if (result.status !== 0) throw new Error(`${file} ${args.join(' ')} failed: ${result.stderr}`);
	return result.stdout;
}

async function gitProbe() {
	const directory = await mkdtemp(join(tmpdir(), 'redactoria-b5-git-'));
	try {
		command('git', ['init', '--quiet'], directory);
		command('git', ['config', 'user.name', 'Redactoria Probe'], directory);
		command('git', ['config', 'user.email', 'probe@example.invalid'], directory);
		await writeFile(join(directory, 'note.txt'), 'pierwsza wersja\n', 'utf8');
		const untracked = command('git', ['status', '--short'], directory);
		command('git', ['add', 'note.txt'], directory);
		const stagedNew = command('git', ['status', '--short'], directory);
		command('git', ['commit', '--quiet', '-m', 'Pierwsza wersja'], directory);
		await writeFile(join(directory, 'note.txt'), 'pierwsza wersja\ndruga linia\n', 'utf8');
		const workingDiff = command('git', ['diff', '--numstat', '--', 'note.txt'], directory);
		command('git', ['add', 'note.txt'], directory);
		const stagedDiff = command('git', ['diff', '--cached', '--numstat', '--', 'note.txt'], directory);
		command('git', ['commit', '--quiet', '-m', 'Druga wersja'], directory);
		const log = command('git', ['log', '-2', '--pretty=format:%s'], directory);
		return { untracked, stagedNew, workingDiff, stagedDiff, log };
	} finally {
		if (!directory.startsWith(join(tmpdir(), 'redactoria-b5-git-'))) throw new Error('Unsafe temporary Git path.');
		await rm(directory, { recursive: true, force: true });
	}
}

async function curlProbe() {
	const server = createServer((request, response) => {
		response.sendDate = false;
		response.setHeader('Content-Type', 'application/json');
		response.setHeader('Connection', 'close');
		const body = request.url === '/data' ? '{"name":"Ada"}\n' : '{"error":"missing"}\n';
		response.statusCode = request.url === '/data' ? 200 : 404;
		response.setHeader('Content-Length', Buffer.byteLength(body));
		response.end(request.method === 'HEAD' ? undefined : body);
	});
	await new Promise<void>((resolveListen, reject) => {
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => resolveListen());
	});
	try {
		const address = server.address();
		if (!address || typeof address === 'string') throw new Error('Missing local curl probe port.');
		const base = `http://127.0.0.1:${address.port}`;
		const get = await execFileAsync('curl.exe', ['--silent', `${base}/data`], { encoding: 'utf8' });
		const head = await execFileAsync('curl.exe', ['--silent', '--head', '--write-out', '\nstatus=%{http_code}\n', `${base}/data`], { encoding: 'utf8' });
		const status = await execFileAsync('curl.exe', ['--silent', '--output', 'NUL', '--write-out', '%{http_code}', `${base}/missing`], { encoding: 'utf8' });
		let failure: { stdout: string; stderr: string; code: number | string | undefined };
		try {
			await execFileAsync('curl.exe', ['--silent', '--show-error', '--fail-with-body', `${base}/missing`], { encoding: 'utf8' });
			throw new Error('Expected curl --fail-with-body to fail for HTTP 404.');
		} catch (error) {
			const value = error as { stdout?: string; stderr?: string; code?: number | string };
			failure = { stdout: value.stdout ?? '', stderr: value.stderr ?? '', code: value.code };
		}
		return { get: get.stdout, head: head.stdout, status: status.stdout, failure };
	} finally {
		await new Promise<void>(resolveClose => server.close(() => resolveClose()));
	}
}

function pythonProbe(executable: string) {
	const code = `import json\nvalues = [2, 4, 6]\ndef classify(number):\n    if number > 0:\n        return "positive"\n    if number < 0:\n        return "negative"\n    return "zero"\nprint(json.dumps({"slice": values[1:], "range": list(range(1, 6, 2)), "labels": [classify(x) for x in [-1, 0, 1]]}, separators=(",", ":")))`;
	const run = spawnSync(executable, ['-c', code], { encoding: 'utf8' });
	if (run.status !== 0) throw new Error(`${executable} probe failed: ${run.stderr}`);
	return { code, result: JSON.parse(run.stdout), version: command(executable, ['--version']).trim().replace(/^Python /, '') };
}

const definition = definitions[topic];
if (!definition) throw new Error(`Unknown B5 topic: ${topic}.`);
const job = authorization.jobs.find(item => item.topic === topic);
if (!job) throw new Error(`Missing B5 job: ${topic}.`);
const cartographyRef = `lab/cartography/${topic}-single.json`;
const cartography = JSON.parse(await readFile(resolve(project, cartographyRef), 'utf8'));
const decision = {
	schemaVersion: 3,
	status: 'approved',
	approvedBy: 'human',
	action: cartography.action,
	nextStep: 'research',
	targets: cartography.targets,
	confidence: cartography.confidence,
	reason: cartography.reason,
	evidence: cartography.evidence,
	analysisHash: hashJson(cartography),
	analysisRef: cartographyRef,
	authorizationRef: B5_AUTHORIZATION_REF,
	authorizationHash,
	topic,
};
const sources = [];
for (const item of definition.sources) {
	const response = await fetch(item.url, { redirect: 'error', headers: { 'user-agent': 'Redactoria-B5-research/1.0' } });
	if (response.status !== 200 || response.url !== item.url) throw new Error(`${item.url}: HTTP ${response.status}, final ${response.url}`);
	const body = await response.text();
	const authority = sourceAuthorityForUrl(item.url);
	sources.push(AuthorityDocumentSchema.parse({
		...item,
		sourceType: 'authority-ladder',
		authorityTier: authority.tier,
		authorityClass: authority.authorityClass,
		evidenceRole: authority.evidenceRole,
		retrievedAt,
		documentHash: createHash('sha256').update(body).digest('hex'),
		retrieval: { method: 'https-get', httpStatus: 200, finalUrl: response.url, selection: 'authoritative-content' },
	}));
}
const probes = [];
if (topic === 'git-local-basics') {
	const code = 'git init; git config (repository-local); status --short; add; commit; diff --numstat; diff --cached --numstat; log --pretty=format:%s';
	probes.push(RuntimeProbeSchema.parse({ id: 'git-local-cycle', description: 'Isolated local repository with untracked, staged, modified and committed states', runtimeId: 'git', runtimeVersion: command('git', ['--version']).trim().replace(/^git version /, ''), code, codeHash: hashBytes(code), result: await gitProbe(), diagnostics: [] }));
} else if (topic === 'curl-http-basics') {
	const code = 'Local HTTP fixture; curl.exe GET; --head; --write-out %{http_code}; --fail-with-body on 404';
	probes.push(RuntimeProbeSchema.parse({ id: 'curl-local-http', description: 'GET, HEAD, status reporting and HTTP failure against a controlled loopback server', runtimeId: 'curl', runtimeVersion: command('curl.exe', ['--version']).split(/\r?\n/, 1)[0]!.split(' ')[1]!, code, codeHash: hashBytes(code), result: await curlProbe(), diagnostics: [] }));
} else {
	for (const [runtimeId, executable] of [['python-3-14', 'C:\\Python314\\python.exe'], ['python-3-11', 'C:\\python.exe']] as const) {
		const probe = pythonProbe(executable);
		probes.push(RuntimeProbeSchema.parse({ id: `${runtimeId}-fundamentals`, description: 'Numbers, lists, slicing, range, conditions and function return values', runtimeId, runtimeVersion: probe.version, code: probe.code, codeHash: hashBytes(probe.code), result: probe.result, diagnostics: [] }));
	}
}
const research = ResearchBundleSchema.parse({
	schemaVersion: 3,
	topicSlug: topic,
	asOfDate,
	provenance: 'Current official project/runtime documentation snapshots plus controlled local CLI probes; no remote repository, external API or global configuration mutation.',
	questions: definition.questions,
	sources,
	probes,
});
await writeLabArtifacts(project, sourceRoot, {
	[`decisions/${topic}-rewrite.json`]: stableJson(decision),
	[`research/${topic}/sources.json`]: stableJson(research),
	[`research/${topic}/probes.json`]: stableJson(probes),
});
console.log(`Prepared B5 research for ${topic}: ${sources.length} official sources, ${probes.length} controlled probe(s).`);
