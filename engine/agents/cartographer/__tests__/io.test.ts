import { createHash } from 'node:crypto';
import { cp, link, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { writeLabArtifacts } from '../../../core/lab-writer.ts';
import { createSourceReader } from '../../../core/source-reader.ts';
import { runCartographer } from '../agent.ts';
import { createCartographerArtifacts } from '../report.ts';
import { FakeLanguageModel, fixturesDirectory, sampleInput } from './helpers.ts';

const directories: string[] = [];
async function workspace() {
	const project = await mkdtemp(join(tmpdir(), 'redactoria-cartographer-test-'));
	directories.push(project);
	const source = join(project, 'source');
	await mkdir(source); await mkdir(join(project, 'content'));
	for (const article of sampleInput().inventory.articles) await cp(join(fixturesDirectory, article.source_path), join(source, article.source_path));
	await writeFile(join(project, 'content/accepted.md'), 'Accepted content must remain unchanged.');
	return { project, source };
}
async function hashes(source: string, project: string) {
	const paths = [...sampleInput().inventory.articles.map((item) => join(source, item.source_path)), join(project, 'content/accepted.md')];
	return Promise.all(paths.map(async (path) => createHash('sha256').update(await readFile(path)).digest('hex')));
}
afterEach(async () => { for (const directory of directories.splice(0)) await rm(directory, { recursive: true, force: true }); });

describe('SOURCE/CONTENT boundaries and LAB artifacts', () => {
	it('runs a fake model against real fixture bytes and writes stable LAB outputs without mutating inputs', async () => {
		const { project, source } = await workspace();
		const input = sampleInput(); const before = await hashes(source, project);
		const run = async () => {
			const result = await runCartographer(input, 'Test prompt', new FakeLanguageModel(), createSourceReader(source));
			return writeLabArtifacts(project, source, createCartographerArtifacts(result, input.inventory));
		};
		const first = await run(); const contents = await Promise.all(first.map((path) => readFile(path, 'utf8')));
		const second = await run();
		expect(await Promise.all(second.map((path) => readFile(path, 'utf8')))).toEqual(contents);
		expect(await hashes(source, project)).toEqual(before);
		expect(JSON.parse(contents[0]!).schemaVersion).toBe(1);
		expect(JSON.parse(contents[1]!).candidates).toHaveLength(1);
	});
	it('verifies raw source hashes and applies explicit byte and character limits', async () => {
		const { source } = await workspace(); const input = sampleInput(); const article = input.inventory.articles[0]!;
		const reader = createSourceReader(source);
		await expect(reader({ ...article, content_hash: '0'.repeat(64) }, input.limits)).rejects.toThrow('changed since inventory');
		await expect(reader(article, { ...input.limits, maxSourceBytes: 1 })).rejects.toThrow('byte budget');
		const read = await reader(article, { ...input.limits, maxBodyCharacters: 2 });
		expect(read.body).toHaveLength(2); expect(read.truncated).toBe(true);
		expect(read.body).not.toContain('---');
	});
	it('rejects path traversal and filesystem links escaping SOURCE', async () => {
		const { project, source } = await workspace();
		const article = sampleInput().inventory.articles[0]!;
		await expect(createSourceReader(source)({ ...article, source_path: '../content/accepted.md' }, sampleInput().limits)).rejects.toThrow('escapes SOURCE');
		await symlink(join(project, 'content'), join(source, 'escape'), 'junction');
		await expect(createSourceReader(source)({ ...article, source_path: 'escape/accepted.md' }, sampleInput().limits)).rejects.toThrow('escapes SOURCE');
	});
	it('rejects arbitrary destinations and a LAB symlink pointing to SOURCE', async () => {
		const { project, source } = await workspace(); const before = await hashes(source, project);
		await expect(writeLabArtifacts(project, source, { '../content/accepted.md': 'bad' })).rejects.toThrow('Invalid LAB');
		await mkdir(join(project, 'lab'));
		await symlink(source, join(project, 'lab/cartography'), 'junction');
		await expect(writeLabArtifacts(project, source, { 'cartography/map.json': '{}' })).rejects.toThrow('inside LAB');
		expect(await hashes(source, project)).toEqual(before);
	});
	it('rejects LAB links pointing to CONTENT and replaces hard links without modifying originals', async () => {
		const { project, source } = await workspace(); const before = await hashes(source, project);
		await mkdir(join(project, 'lab'));
		await symlink(join(project, 'content'), join(project, 'lab/reports'), 'junction');
		await expect(writeLabArtifacts(project, source, { 'reports/accepted.md': 'bad' })).rejects.toThrow('inside LAB');
		await mkdir(join(project, 'lab/cartography'));
		await link(join(project, 'content/accepted.md'), join(project, 'lab/cartography/map.json'));
		await writeLabArtifacts(project, source, { 'cartography/map.json': '{}' });
		expect(await readFile(join(project, 'lab/cartography/map.json'), 'utf8')).toBe('{}');
		expect(await hashes(source, project)).toEqual(before);
	});
	it('preserves an approved human decision and rejects the entire artifact batch before writing', async () => {
		const { project, source } = await workspace(); const before = await hashes(source, project);
		await mkdir(join(project, 'lab/decisions'), { recursive: true });
		const decisionPath = join(project, 'lab/decisions/sample-merge-proposal.json');
		const approved = JSON.stringify({ status: 'approved', action: 'MERGE', approvedBy: 'human', nextStep: 'research' });
		await writeFile(decisionPath, approved);
		await expect(writeLabArtifacts(project, source, {
			'cartography/sample-merge.json': '{}',
			'decisions/sample-merge-proposal.json': JSON.stringify({ status: 'proposed', action: 'MERGE' }),
		})).rejects.toThrow('Approved human decisions cannot be overwritten');
		expect(await readFile(decisionPath, 'utf8')).toBe(approved);
		await expect(readFile(join(project, 'lab/cartography/sample-merge.json'))).rejects.toMatchObject({ code: 'ENOENT' });
		expect(await hashes(source, project)).toEqual(before);
	});
	it('manual CLI offers help and rejects malformed options without running any model', () => {
		const cli = fileURLToPath(new URL('../../../../scripts/cartographer.ts', import.meta.url));
		const run = (args: string[]) => spawnSync(process.execPath, ['--experimental-strip-types', cli, ...args], { encoding: 'utf8' });
		expect(run(['--help']).stdout).toContain('no live API calls');
		expect(run(['--unknown', 'x']).status).toBe(1);
		expect(run(['--prepare', 'everything']).status).toBe(1);
		expect(run(['--max-deep-reads', 'NaN']).status).toBe(1);
	});
});
