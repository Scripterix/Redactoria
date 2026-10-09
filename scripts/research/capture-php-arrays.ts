import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ResearchBundleSchema, DocumentSchema } from '../../engine/agents/researcher/contract.ts';
import { writeResearchArtifacts } from '../../engine/core/research-writer.ts';
import { stableJson } from '../../engine/core/serialization.ts';
import { documents, questions } from './php-arrays-sources.ts';

export function officialText(html: string) {
	const start = html.indexOf('id="layout-content"');
	if (start < 0) throw new Error('Cannot locate official document content.');
	const notes = html.indexOf('id="usernotes"', start);
	const footer = html.indexOf('<footer', start);
	const ends = [notes, footer].filter(index => index >= 0);
	if (!ends.length) throw new Error('Cannot locate official content boundary.');
	return html.slice(start, Math.min(...ends)).replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
		.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, ' ')
		.replace(/&#(x[\da-f]+|\d+);/gi, (_match, value: string) => String.fromCodePoint(value.startsWith('x') ? parseInt(value.slice(1), 16) : Number(value)))
		.replace(/&(nbsp|quot|apos|lt|gt|amp);/g, (_match, entity: string) => ({ nbsp: ' ', quot: '"', apos: "'", lt: '<', gt: '>', amp: '&' }[entity]!))
		.replace(/\s+/g, ' ').trim();
}
async function main() {
	// Explicit refresh only. The normal Researcher run never fetches or refreshes evidence.
	if (!process.argv.includes('--refresh')) throw new Error('Use --refresh explicitly; this replaces the pilot evidence snapshot and invalidates recorded request hashes.');
	const project = fileURLToPath(new URL('../../', import.meta.url));
	const probes = JSON.parse(await readFile(resolve(project, 'lab/research/php-arrays/probes.json'), 'utf8')) as unknown;
	const sources = [];
	const errors: string[] = [];
	for (const [id, path, kind, excerpts] of documents) {
		const url = `https://www.php.net/${path}`;
		const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
		if (response.status !== 200) throw new Error(`Cannot verify ${url}: HTTP ${response.status}`);
		const bytes = new Uint8Array(await response.arrayBuffer());
		const html = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
		const normalized = officialText(html);
		const selected = excerpts.map(([excerptId, excerpt, locator]) => {
			if (!normalized.includes(excerpt)) errors.push(`Official excerpt not found: ${id}/${excerptId}: ${excerpt}`);
			return { id: excerptId, text: excerpt, locator };
		});
		const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1];
		if (!title) throw new Error('Document title missing.');
		sources.push(DocumentSchema.parse({ id, title, url, kind, sourceType: 'official-documentation',
			retrievedAt: new Date().toISOString(), documentHash: createHash('sha256').update(bytes).digest('hex'),
			retrieval: { method: 'https-get', httpStatus: 200, finalUrl: response.url, selection: 'official-content-excluding-user-notes' }, excerpts: selected }));
		console.log(`Captured HTTP 200: ${id}`);
	}
	if (errors.length) throw new Error(errors.join('\n'));
	const bundle = ResearchBundleSchema.parse({ schemaVersion: 1, topicSlug: 'php-arrays', asOfDate: '2026-10-09',
		provenance: 'Primary PHP documentation captured by explicit HTTPS GET. Only short exact anchors and hashes retained; user notes excluded. Interpretation is a separate current Codex session import. Local probes are controlled reproductions, not execution of SOURCE.',
		questions: questions.map(([id, section, question, cartographerFindingIds]) => ({ id, section, question, cartographerFindingIds })), sources, probes });
	await writeResearchArtifacts(project, resolve(project, '../temp-ogwo/posts'), { 'research/php-arrays/sources.json': stableJson(bundle) });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : 'Capture failed'); process.exitCode = 1;
});
