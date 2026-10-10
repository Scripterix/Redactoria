import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { RecordedLanguageModel } from '../engine/adapters/recorded-language-model.ts';
import { prepareFocusedArticle, runFocusedArticle } from '../engine/agents/cartographer/focused-article.ts';
import { InventoryInputSchema } from '../engine/agents/cartographer/contract.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { stableJson, hashJson } from '../engine/core/serialization.ts';
import { createSourceReader } from '../engine/core/source-reader.ts';
import { project, sourceRoot, readLab } from './editorial-input.ts';
import { B2AuthorizationSchema } from '../engine/core/b2-authorization.ts';

const args = process.argv.slice(2);
if (args.length > 1 || (args.length && args[0] !== '--prepare')) throw new Error('Only --prepare or no arguments supported for this B2 job.');
const authorization = B2AuthorizationSchema.parse(JSON.parse(await readLab('lab/decisions/php-control-flow-b2-authorization.json')));
const inventory = InventoryInputSchema.parse(JSON.parse(await readLab('lab/inventory/inventory.json')));
const selected = inventory.articles.filter(item => item.source_id === authorization.source.sourceId && item.source_path === authorization.source.sourcePath && item.content_hash === authorization.source.contentHash);
const input = { inventory: { schema_version: 1, articles: selected }, limits: { maxDeepReads: 1, maxBodyCharacters: 18000, maxSourceBytes: 1048576 } };
const prompt = await readFile(resolve(project, 'engine/agents/cartographer/focused-article-prompt.md'), 'utf8');
const reader = createSourceReader(sourceRoot);
if (args[0] === '--prepare') {
	const { request } = await prepareFocusedArticle(input, prompt, reader);
	await writeLabArtifacts(project, sourceRoot, { 'cartography/requests/php-control-flow-single.json': stableJson({ schemaVersion: 1, requestHash: hashJson(request), request }) });
	console.log('Prepared one-source Cartographer request: ' + hashJson(request));
} else {
	const model = new RecordedLanguageModel(JSON.parse(await readLab('lab/cartography/php-control-flow-session-responses.json')));
	const result = await runFocusedArticle(input, prompt, model, reader);
	await writeLabArtifacts(project, sourceRoot, { ['cartography/' + result.artifactName + '.json']: stableJson(result) });
	console.log('Focused article: ' + result.action + ', confidence ' + result.confidence + '; one source; STOP.');
}
