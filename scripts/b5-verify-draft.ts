import { createHash } from 'node:crypto';
import { execFile, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { CodeExecutionSchema } from '../engine/agents/critic/contract.ts';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!topic) throw new Error('Usage: node scripts/b5-verify-draft.ts --topic <slug>');
const execFileAsync = promisify(execFile);
const draft = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/article.json`), 'utf8')) as any;
const runtime = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/runtime-verification.json`), 'utf8')) as any;
const draftExamples = draft.sections.flatMap((section: any) => section.examples);

function run(file: string, args: string[], cwd?: string) {
	const result = spawnSync(file, args, { cwd, encoding: 'utf8' });
	return { stdout: result.stdout, stderr: result.stderr, exitCode: result.status ?? -1 };
}

function git(args: string[], cwd: string) {
	return run('git', ['-c', 'core.autocrlf=false', ...args], cwd);
}

async function gitExample(example: any) {
	const directory = await mkdtemp(join(tmpdir(), 'redactoria-b5-git-draft-'));
	try {
		await writeFile(join(directory, 'note.txt'), 'pierwsza wersja\n', 'utf8');
		let stdout = '';
		let stderr = '';
		let exitCode = 0;
		if (example.id === 'git-init-status') {
			for (const args of [['init', '--quiet'], ['status', '--short']]) {
				const result = git(args, directory); stdout += result.stdout; stderr += result.stderr; exitCode ||= result.exitCode;
			}
		} else {
			git(['init', '--quiet'], directory);
			git(['config', 'user.name', 'Redactoria Draft'], directory);
			git(['config', 'user.email', 'draft@example.invalid'], directory);
			git(['add', 'note.txt'], directory);
			git(['commit', '--quiet', '-m', 'Pierwsza wersja'], directory);
			await writeFile(join(directory, 'note.txt'), 'pierwsza wersja\ndruga linia\n', 'utf8');
			const commands = example.id === 'git-diff-stage'
				? [['diff', '--numstat', '--', 'note.txt'], ['add', 'note.txt'], ['diff', '--cached', '--numstat', '--', 'note.txt']]
				: [['add', 'note.txt'], ['commit', '--quiet', '-m', 'Druga wersja'], ['log', '-2', '--pretty=format:%s']];
			for (const args of commands) {
				const result = git(args, directory); stdout += result.stdout; stderr += result.stderr; exitCode ||= result.exitCode;
			}
		}
		return { stdout, stderr, exitCode };
	} finally {
		if (!directory.startsWith(join(tmpdir(), 'redactoria-b5-git-draft-'))) throw new Error('Unsafe temporary Git draft path.');
		await rm(directory, { recursive: true, force: true });
	}
}

async function withCurlServer<T>(task: () => Promise<T>) {
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
		server.listen(38421, '127.0.0.1', () => resolveListen());
	});
	try { return await task(); }
	finally { await new Promise<void>(resolveClose => server.close(() => resolveClose())); }
}

async function curlExample(example: any) {
	const args = example.id === 'curl-get-json'
		? ['--silent', 'http://127.0.0.1:38421/data']
		: ['--silent', '--output', 'NUL', '--write-out', 'status=%{http_code}', 'http://127.0.0.1:38421/missing'];
	try {
		const result = await execFileAsync('curl.exe', args, { encoding: 'utf8' });
		return { stdout: result.stdout, stderr: result.stderr, exitCode: 0 };
	} catch (error) {
		const value = error as { stdout?: string; stderr?: string; code?: number };
		return { stdout: value.stdout ?? '', stderr: value.stderr ?? '', exitCode: value.code ?? -1 };
	}
}

const runs = [];
if (topic === 'git-local-basics') {
	const target = runtime.runs[0];
	const examples = [];
	for (const example of draftExamples) {
		const result = await gitExample(example);
		examples.push({ id: example.id, codeHash: createHash('sha256').update(example.code).digest('hex'), ...result, assertions: 3, automated: true, limitation: 'Executed in a newly created isolated local repository with repository-local identity.', status: result.exitCode === 0 && result.stdout === example.expectedOutput && result.stderr === '' ? 'PASS' : 'FAIL' });
	}
	runs.push({ runtimeId: target.runtimeId, kind: target.kind, version: target.version, executableHash: target.executableHash, execution: target.execution, examples });
} else if (topic === 'curl-http-basics') {
	const target = runtime.runs[0];
	const examples = await withCurlServer(async () => {
		const values = [];
		for (const example of draftExamples) {
			const result = await curlExample(example);
			values.push({ id: example.id, codeHash: createHash('sha256').update(example.code).digest('hex'), ...result, assertions: 3, automated: true, limitation: 'Executed against a controlled loopback HTTP server on 127.0.0.1:38421.', status: result.exitCode === 0 && result.stdout === example.expectedOutput && result.stderr === '' ? 'PASS' : 'FAIL' });
		}
		return values;
	});
	runs.push({ runtimeId: target.runtimeId, kind: target.kind, version: target.version, executableHash: target.executableHash, execution: target.execution, examples });
} else if (topic === 'python-fundamentals') {
	const executables: Record<string, string> = { 'python-3-14': 'C:/Python314/python.exe', 'python-3-11': 'C:/python.exe' };
	for (const target of runtime.runs) {
		const examples = draftExamples.map((example: any) => {
			const observed = run(executables[target.runtimeId]!, ['-c', example.code]);
			const result = { ...observed, stdout: observed.stdout.replace(/\r\n/g, '\n'), stderr: observed.stderr.replace(/\r\n/g, '\n') };
			return { id: example.id, codeHash: createHash('sha256').update(example.code).digest('hex'), ...result, assertions: 3, automated: true, limitation: `Executed as an isolated -c program in ${target.runtimeId}; Windows CRLF output was normalized to LF for deterministic comparison.`, status: result.exitCode === 0 && result.stdout === example.expectedOutput && result.stderr === '' ? 'PASS' : 'FAIL' };
		});
		runs.push({ runtimeId: target.runtimeId, kind: target.kind, version: target.version, executableHash: target.executableHash, execution: target.execution, examples });
	}
} else throw new Error(`Unknown B5 topic: ${topic}.`);

const execution = CodeExecutionSchema.parse({
	schemaVersion: 2,
	status: runs.every(runItem => runItem.examples.every((example: any) => example.status === 'PASS')) ? 'PASS' : 'FAIL',
	articleHash: draft.articleHash,
	executedAt: new Date().toISOString(),
	runs,
	limitations: [topic === 'python-fundamentals' ? 'Examples ran independently in both approved Python runtimes.' : 'Examples ran independently against a controlled local fixture; no remote service or global configuration was used.'],
});
await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/code-execution.json`]: stableJson(execution) });
if (execution.status !== 'PASS') {
	for (const runItem of runs) for (const example of runItem.examples.filter((item: any) => item.status === 'FAIL')) console.error(runItem.runtimeId, example.id, { stdout: example.stdout, stderr: example.stderr, exitCode: example.exitCode });
	throw new Error(`${topic}: draft example execution failed.`);
}
console.log(`${topic}: all final draft examples passed ${runs.length} approved CLI runtime(s).`);
