import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RecordedLanguageModel } from '../engine/adapters/recorded-language-model.ts';
import { prepareFocusedArticle, runFocusedArticle } from '../engine/agents/cartographer/focused-article.ts';
import { InventoryInputSchema } from '../engine/agents/cartographer/contract.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { createSourceReader } from '../engine/core/source-reader.ts';
import { B3AuthorizationSchema, validateB3Authorization } from '../engine/core/b3-authorization.ts';
import { B4_AUTHORIZATION_REF, B4AuthorizationSchema, B4_TOPICS, validateB4Authorization } from '../engine/core/b4-authorization.ts';
import { B5_AUTHORIZATION_REF, B5AuthorizationSchema, B5_TOPICS, validateB5Authorization } from '../engine/core/b5-authorization.ts';
import { B6_AUTHORIZATION_REF, B6AuthorizationSchema, B6_TOPICS, validateB6Authorization } from '../engine/core/b6-authorization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');

export function parseB3CartographerArguments(args: string[]) {
	let topic: string | undefined;
	let prepare = false;
	for (let index = 0; index < args.length; index++) {
		const flag = args[index]!;
		if (flag === '--prepare' && !prepare) { prepare = true; continue; }
		const value = args[++index];
		if (flag !== '--topic' || topic || !value || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error('Usage: npm run b3:cartographer -- --topic <slug> [--prepare]');
		topic = value;
	}
	if (!topic) throw new Error('--topic is required.');
	return { topic, prepare };
}

async function main() {
	const { topic, prepare } = parseB3CartographerArguments(process.argv.slice(2));
	const isB4 = B4_TOPICS.includes(topic as typeof B4_TOPICS[number]);
	const isB5 = B5_TOPICS.includes(topic as typeof B5_TOPICS[number]);
	const isB6 = B6_TOPICS.includes(topic as typeof B6_TOPICS[number]);
	const authorizationRef = isB6 ? B6_AUTHORIZATION_REF : isB5 ? B5_AUTHORIZATION_REF : isB4 ? B4_AUTHORIZATION_REF : 'lab/decisions/b3-authorization.json';
	const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
	const rawAuthorization = JSON.parse(authorizationText);
	const b6Authorization = isB6 ? B6AuthorizationSchema.parse(rawAuthorization) : null;
	const legacyAuthorization = isB6 ? null : isB5
		? B5AuthorizationSchema.parse(rawAuthorization)
		: isB4 ? B4AuthorizationSchema.parse(rawAuthorization) : B3AuthorizationSchema.parse(rawAuthorization);
	const job = (b6Authorization ?? legacyAuthorization)?.jobs.find((item) => item.topic === topic);
	if (!job) throw new Error('Topic is outside the authorized bounded jobs.');
	if (b6Authorization) {
		const selectionText = await readFile(resolve(project, b6Authorization.selectionRef), 'utf8');
		if (hashBytes(selectionText) !== b6Authorization.selectionHash) throw new Error('B6 selection hash changed.');
		validateB6Authorization(authorizationText, hashBytes(authorizationText), topic, [job.source]);
	} else {
		if (!legacyAuthorization) throw new Error('Missing historical batch authorization.');
		const rankingText = await readFile(resolve(project, legacyAuthorization.b1RankingRef), 'utf8');
		if (hashBytes(rankingText) !== legacyAuthorization.b1RankingHash) throw new Error('B1 ranking hash changed.');
		const ranking = JSON.parse(rankingText) as { ranking: { recommendedOrder: number; source: { sourceId: string; sourcePath: string; contentHash: string } }[] };
		const expectedRank = 'b1Rank' in job ? job.b1Rank : job.order + 1;
		const ranked = ranking.ranking.find((item) => item.recommendedOrder === expectedRank);
		if (!ranked || ranked.source.sourceId !== job.source.sourceId || ranked.source.sourcePath !== job.source.sourcePath || ranked.source.contentHash !== job.source.contentHash) throw new Error('Bounded job no longer matches its B1 rank.');
		if (isB5) validateB5Authorization(authorizationText, hashBytes(authorizationText), topic, [job.source]);
		else if (isB4) validateB4Authorization(authorizationText, hashBytes(authorizationText), topic, [job.source]);
		else validateB3Authorization(authorizationText, hashBytes(authorizationText), topic, [job.source]);
	}

	const inventory = InventoryInputSchema.parse(JSON.parse(await readFile(resolve(project, 'lab/inventory/inventory.json'), 'utf8')));
	const selected = inventory.articles.filter((item) => item.source_id === job.source.sourceId
		&& item.source_path === job.source.sourcePath && item.content_hash === job.source.contentHash);
	if (selected.length !== 1) throw new Error('Authorized bounded source is absent or changed in inventory.');
	const input = { inventory: { schema_version: 1, articles: selected }, limits: { maxDeepReads: 1, maxBodyCharacters: 40000, maxSourceBytes: 1048576 } };
	const prompt = await readFile(resolve(project, 'engine/agents/cartographer/focused-article-prompt.md'), 'utf8');
	const reader = createSourceReader(sourceRoot);
	if (prepare) {
		const { request } = await prepareFocusedArticle(input, prompt, reader);
		await writeLabArtifacts(project, sourceRoot, { [`cartography/requests/${topic}-single.json`]: stableJson({ schemaVersion: 1, requestHash: hashJson(request), request }) });
		console.log(`Prepared focused request: ${topic}; ${hashJson(request)}; STOP.`);
		return;
	}
	const responses = JSON.parse(await readFile(resolve(project, `lab/cartography/${topic}-session-responses.json`), 'utf8'));
	const model = new RecordedLanguageModel(responses);
	const result = await runFocusedArticle(input, prompt, model, reader);
	if (result.artifactName !== `${topic}-single`) throw new Error('Recorded response belongs to another bounded topic.');
	const b6Job = b6Authorization?.jobs.find((item) => item.topic === topic);
	if (b6Job && result.action !== b6Job.cartographerActionExpected) throw new Error('B6 Cartographer action differs from the authorized selection.');
	await writeLabArtifacts(project, sourceRoot, { [`cartography/${topic}-single.json`]: stableJson(result) });
	console.log(`Cartographer: ${topic}; ${result.action}; one full source; STOP.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
}
