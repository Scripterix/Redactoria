import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!topic || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic)) throw new Error('Usage: node scripts/b6-execute-draft.ts --topic <slug>');
const draft = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/article.json`), 'utf8')) as any;
const config = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/input.json`), 'utf8')) as any;
const target = config.targetRuntimes[0];
if (!target || config.targetRuntimes.length !== 1) throw new Error('B6 expects exactly one runtime target.');
const executable = target.id === 'php-cli' ? 'C:/xampp/php/php.exe' : process.execPath;
const executableHash = createHash('sha256').update(await readFile(executable)).digest('hex');
const directory = await mkdtemp(join(tmpdir(), `redactoria-b6-${topic}-`));
try {
	const records = [];
	for (const example of draft.sections.flatMap((section: any) => section.examples)) {
		const extension = example.language === 'php' ? 'php' : 'mjs';
		const file = join(directory, `${example.id}.${extension}`);
		await writeFile(file, example.code, 'utf8');
		const result = example.language === 'php'
			? spawnSync(executable, [file], { encoding: 'utf8' })
			: spawnSync(executable, [file], { encoding: 'utf8' });
		const stdout = result.stdout ?? '';
		const stderr = result.stderr ?? '';
		const exitCode = result.status ?? 1;
		const expectedDiagnostics = example.expectedDiagnostics.length ? example.expectedDiagnostics.join('\n') + '\n' : '';
		records.push({ id: example.id, codeHash: createHash('sha256').update(example.code).digest('hex'), stdout, stderr, exitCode,
			assertions: 3, automated: true, limitation: null, status: exitCode === 0 && stdout === example.expectedOutput && stderr === expectedDiagnostics ? 'PASS' : 'FAIL' });
	}
	const execution = { schemaVersion: 2, status: records.every((record) => record.status === 'PASS') ? 'PASS' : 'FAIL', articleHash: draft.articleHash, executedAt: new Date().toISOString(),
		runs: [{ runtimeId: target.id, kind: target.kind, version: target.version, executableHash, execution: 'actual-local-cli', examples: records }],
		limitations: [`Each final example was executed independently with ${target.id} ${target.version}; no browser, network, SOURCE or external service was used.`] };
	await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/code-execution.json`]: stableJson(execution) });
	console.log(`Executed ${records.length} B6 final examples for ${topic}: ${execution.status}.`);
} finally {
	if (!directory.startsWith(join(tmpdir(), `redactoria-b6-${topic}-`))) throw new Error('Unsafe B6 temporary directory.');
	await rm(directory, { recursive: true, force: true });
}
