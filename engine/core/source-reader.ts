import { createHash } from 'node:crypto';
import { lstat, readFile, realpath } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { InventoryRecord } from '../../scripts/legacy/types.ts';
import { isWithin } from './lab-writer.ts';

export function createSourceReader(sourceDirectory: string) {
	return async (article: InventoryRecord, limits: { maxSourceBytes: number; maxBodyCharacters: number }) => {
		const root = await realpath(sourceDirectory);
		const candidate = resolve(root, article.source_path);
		const target = await realpath(candidate);
		if (!isWithin(root, candidate) || !isWithin(root, target)) throw new Error('Source read escapes SOURCE.');
		const stats = await lstat(candidate);
		if (!stats.isFile() || stats.isSymbolicLink()) throw new Error('Source must be a regular file.');
		if (stats.size > limits.maxSourceBytes) throw new Error('Source byte budget exceeded.');
		const bytes = await readFile(target);
		if (bytes.length > limits.maxSourceBytes) throw new Error('Source byte budget exceeded.');
		const contentHash = createHash('sha256').update(bytes).digest('hex');
		if (contentHash !== article.content_hash) throw new Error('Source changed since inventory; rerun the scanner.');
		let body = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/\r\n/g, '\n');
		const opening = /^---[ \t]*\n/.exec(body);
		if (opening) {
			const remainder = body.slice(opening[0].length);
			const closing = /^---[ \t]*(?:\n|$)/m.exec(remainder);
			if (!closing) throw new Error('Cannot locate source body.');
			body = remainder.slice(closing.index + closing[0].length);
		}
		return { sourceId: article.source_id, sourcePath: article.source_path, contentHash,
			body: body.slice(0, limits.maxBodyCharacters), truncated: body.length > limits.maxBodyCharacters };
	};
}
