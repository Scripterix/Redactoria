import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { listSourceFiles, scanCorpus, serializeInventory } from '../../scripts/legacy/inventory.ts';
import { writeInventoryArtifacts } from '../../scripts/legacy/scan.ts';
import { createCorpusSummary } from '../../scripts/legacy/summary.ts';

const fixtures = fileURLToPath(new URL('../fixtures/legacy-posts/', import.meta.url));
const cli = fileURLToPath(new URL('../../scripts/legacy/scan.ts', import.meta.url));
const temporaryDirectories: string[] = [];

async function temporaryDirectory() {
	const directory = await mkdtemp(join(tmpdir(), 'redactoria-inventory-test-'));
	temporaryDirectories.push(directory);
	return directory;
}

afterEach(async () => {
	for (const directory of temporaryDirectories.splice(0)) await rm(directory, { recursive: true, force: true });
});

async function sourceHashes(directory: string) {
	return Promise.all((await listSourceFiles(directory)).map(async (path) => [
		path, createHash('sha256').update(await readFile(join(directory, path))).digest('hex'),
	]));
}

describe('legacy corpus scanner', () => {
	it('scans every fixture in explicit order and keeps error records alongside valid records', async () => {
		const inventory = await scanCorpus(fixtures);
		expect(inventory.schema_version).toBe(1);
		expect(inventory.articles.map((record) => record.source_path)).toEqual([
			'bom-prefixed.md', 'encoded-slug.md', 'malformed-frontmatter.md',
			'missing-author.md', 'missing-date.md', 'unicode-polish.md', 'valid-post.md',
		]);
		expect(inventory.articles.filter((record) => record.parse_status === 'ok')).toHaveLength(4);
		expect(inventory.articles.filter((record) => record.parse_status === 'needs-review')).toHaveLength(2);
		expect(inventory.articles.filter((record) => record.parse_status === 'error')).toHaveLength(1);
		expect(inventory.articles.find((record) => record.source_path === 'bom-prefixed.md')?.bom_detected).toBe(true);
		expect(inventory.articles.find((record) => record.source_path === 'encoded-slug.md')?.slug).toBe('wersje-v16%e2%86%92v20');
		expect(inventory.articles.find((record) => record.source_path === 'missing-author.md')?.original_author).toBeNull();
		expect(inventory.articles.find((record) => record.source_path === 'missing-date.md')?.original_date).toBeNull();
		expect(inventory.articles.find((record) => record.source_path === 'unicode-polish.md')?.original_author).toBe('Łukasz');
		for (const record of inventory.articles) {
			expect(record.content_hash).toBe(createHash('sha256').update(await readFile(join(fixtures, record.source_path))).digest('hex'));
		}
	});

	it('produces byte-identical inventory and reports without changing source hashes', async () => {
		const before = await sourceHashes(fixtures);
		const first = await scanCorpus(fixtures);
		const second = await scanCorpus(fixtures);
		expect(serializeInventory(first)).toBe(serializeInventory(second));
		expect(createCorpusSummary(first)).toBe(createCorpusSummary(second));
		expect(await sourceHashes(fixtures)).toEqual(before);
	});

	it('uses relative paths and scans nested Markdown independently of file creation order', async () => {
		const directory = await temporaryDirectory();
		await mkdir(join(directory, 'nested'));
		const bytes = await readFile(join(fixtures, 'valid-post.md'));
		await writeFile(join(directory, 'z.md'), bytes);
		await writeFile(join(directory, 'a.MD'), bytes);
		await writeFile(join(directory, 'nested', 'b.md'), bytes);
		await writeFile(join(directory, 'ignored.txt'), bytes);
		const inventory = await scanCorpus(directory);
		expect(inventory.articles.map((record) => record.source_path)).toEqual(['a.MD', 'nested/b.md', 'z.md']);
		expect(inventory.articles.every((record) => record.warnings.includes('duplicate:source_id'))).toBe(true);
		expect(inventory.articles.every((record) => record.parse_status === 'needs-review')).toBe(true);
	});

	it('writes through the actual CLI twice with identical artifacts and unchanged source', async () => {
		const directory = await temporaryDirectory();
		const source = join(directory, 'source');
		await cp(fixtures, source, { recursive: true });
		const before = await sourceHashes(source);
		const run = () => execFileSync(process.execPath, [
			'--experimental-strip-types', cli, source, '--output', join(directory, 'lab'),
		], { encoding: 'utf8' });
		expect(run()).toContain('Source files: 7; parsed OK: 4; review required: 2; parse errors: 1');
		const inventoryPath = join(directory, 'lab/inventory/inventory.json');
		const reportPath = join(directory, 'lab/reports/corpus-summary.md');
		const firstInventory = await readFile(inventoryPath, 'utf8');
		const firstReport = await readFile(reportPath, 'utf8');
		run();
		expect(await readFile(inventoryPath, 'utf8')).toBe(firstInventory);
		expect(await readFile(reportPath, 'utf8')).toBe(firstReport);
		expect(JSON.parse(firstInventory).articles).toHaveLength(7);
		expect(await sourceHashes(source)).toEqual(before);
	});

	it('refuses writes inside the source', async () => {
		const directory = await temporaryDirectory();
		await cp(fixtures, directory, { recursive: true });
		const inventory = await scanCorpus(directory);
		const before = await sourceHashes(directory);
		await expect(writeInventoryArtifacts(inventory, directory, directory)).rejects.toThrow('outside the read-only source');
		expect(await sourceHashes(directory)).toEqual(before);
	});

	it('fails explicitly on an unavailable source and displays CLI help', async () => {
		const directory = await temporaryDirectory();
		const result = spawnSync(process.execPath, ['--experimental-strip-types', cli, join(directory, 'missing')], { encoding: 'utf8' });
		expect(result.status).toBe(1);
		expect(result.stderr).toContain('Inventory failed');
		expect(execFileSync(process.execPath, ['--experimental-strip-types', cli, '--help'], { encoding: 'utf8' })).toContain('Usage:');
	});

	it('rejects an output directory redirected into source by a filesystem link', async () => {
		const directory = await temporaryDirectory();
		const source = join(directory, 'source');
		const lab = join(directory, 'lab');
		await cp(fixtures, source, { recursive: true });
		await mkdir(lab);
		await symlink(source, join(lab, 'inventory'), 'junction');
		const before = await sourceHashes(source);
		await expect(writeInventoryArtifacts(await scanCorpus(source), source, lab)).rejects.toThrow('outside the read-only source');
		expect(await sourceHashes(source)).toEqual(before);
	});

	it('supports an empty source without fabricated records', async () => {
		const directory = await temporaryDirectory();
		expect(await scanCorpus(directory)).toEqual({ schema_version: 1, articles: [] });
	});
});
