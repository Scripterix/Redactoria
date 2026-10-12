import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as commonmark from 'commonmark';
import { CodeExecutionSchema } from '../engine/agents/critic/contract.ts';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const parser = new commonmark.Parser();
const renderer = new commonmark.HtmlRenderer();

for (const topic of ['markdown', 'javascript-calculator', 'api-http-json']) {
	const draft = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/article.json`), 'utf8')) as any;
	const runtime = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/runtime-verification.json`), 'utf8')) as any;
	const target = runtime.runs[0];
	const examples = [];
	for (const example of draft.sections.flatMap((section: any) => section.examples)) {
		const codeHash = createHash('sha256').update(example.code).digest('hex');
		let stdout = '';
		let stderr = '';
		let exitCode = 0;
		let limitation = 'One local Node version; no cross-engine compatibility claim.';
		if (example.language === 'markdown') {
			stdout = renderer.render(parser.parse(example.code));
			limitation = 'Rendered with commonmark 0.31.2 in the local Node process; extensions specific to other Markdown dialects were not enabled.';
		} else {
			const run = spawnSync(process.execPath, ['-e', example.code], { encoding: 'utf8' });
			stdout = run.stdout;
			stderr = run.stderr;
			exitCode = run.status ?? -1;
		}
		examples.push({
			id: example.id, codeHash, stdout, stderr, exitCode, assertions: 3, automated: true, limitation,
			status: exitCode === 0 && stdout === example.expectedOutput && stderr === '' ? 'PASS' : 'FAIL',
		});
	}
	const execution = CodeExecutionSchema.parse({
		schemaVersion: 2, status: examples.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL',
		articleHash: draft.articleHash, executedAt: new Date().toISOString(),
		runs: [{ runtimeId: target.runtimeId, kind: target.kind, version: target.version, executableHash: target.executableHash, execution: target.execution, examples }],
		limitations: ['One local Node version; Markdown examples use commonmark 0.31.2 and HTTP examples use controlled Response fixtures without external requests.'],
	});
	await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/code-execution.json`]: stableJson(execution) });
	if (execution.status !== 'PASS') {
		for (const example of examples.filter(item => item.status === 'FAIL')) console.error(topic, example.id, { stdout: example.stdout, stderr: example.stderr });
		throw new Error(`${topic}: draft example execution failed.`);
	}
}

console.log('All B4 draft examples passed controlled CommonMark rendering or actual Node execution.');
