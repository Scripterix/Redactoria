import { readdir, readFile, realpath, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { parseLegacyPost } from './parser.ts';
import type { Inventory } from './types.ts';

export function compareText(a: string, b: string): number {
	return a < b ? -1 : a > b ? 1 : 0;
}

/** Sorted root-relative POSIX paths; symlinks are rejected, never followed. */
export async function listSourceFiles(sourceDirectory: string): Promise<string[]> {
	const root = await realpath(resolve(sourceDirectory));
	if (!(await stat(root)).isDirectory()) throw new Error('Source must be a directory.');
	const files: string[] = [];
	async function walk(directory: string) {
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			if (entry.isSymbolicLink()) throw new Error('Source contains a symbolic link; supply a regular corpus directory.');
			const file = join(directory, entry.name);
			if (entry.isDirectory()) await walk(file);
			else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
				files.push(relative(root, file).split(sep).join('/'));
			}
		}
	}
	await walk(root);
	return files.sort(compareText);
}

export async function scanCorpus(sourceDirectory: string): Promise<Inventory> {
	const root = await realpath(resolve(sourceDirectory));
	const paths = await listSourceFiles(root);
	const articles = await Promise.all(paths.map(async (path) =>
		parseLegacyPost(await readFile(join(root, path)), path),
	));
	const identities = new Map<string, number>();
	for (const record of articles) identities.set(record.source_id, (identities.get(record.source_id) ?? 0) + 1);
	for (const record of articles) {
		if (identities.get(record.source_id)! > 1) {
			record.warnings.push('duplicate:source_id');
			if (record.parse_status === 'ok') record.parse_status = 'needs-review';
		}
	}
	return { schema_version: 1, articles };
}

export function serializeInventory(inventory: Inventory): string {
	return `${JSON.stringify(inventory, null, 2)}\n`;
}
