import { readFile, realpath } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RecordedLanguageModel } from '../engine/adapters/recorded-language-model.ts';
import { prepareResearchRequest, runResearcher } from '../engine/agents/researcher/agent.ts';
import { ApprovedMergeDecisionSchema, ResearchBundleSchema } from '../engine/agents/researcher/contract.ts';
import { DEFAULT_RESEARCH_LIMITS } from '../engine/agents/researcher/policies.ts';
import { createResearchArtifacts } from '../engine/agents/researcher/report.ts';
import { validateResearchInput } from '../engine/agents/researcher/validation.ts';
import { isWithin } from '../engine/core/lab-writer.ts';
import { writeResearchArtifacts } from '../engine/core/research-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { createSourceReader } from '../engine/core/source-reader.ts';
import { InventoryInputSchema } from '../engine/agents/cartographer/contract.ts';
import { FocusedMergeResultSchema } from '../engine/agents/cartographer/focused-merge.ts';
import { ApprovedArticleDecisionSchema, FocusedArticleResultSchema } from '../engine/agents/cartographer/focused-article.ts';
import { z } from 'zod';
import { validateB2Authorization } from '../engine/core/b2-authorization.ts';
import { validateB3Authorization } from '../engine/core/b3-authorization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
export function parseResearcherArguments(args: string[]) {
	const options = new Map<string, string>();
	const allowed = new Set(['--decision', '--sources', '--responses', '--inventory', '--source']);
	let prepare = false;
	for (let index = 0; index < args.length; index++) {
		const flag = args[index]!;
		if (flag === '--prepare' && !prepare) { prepare = true; continue; }
		const value = args[++index];
		if (!allowed.has(flag) || options.has(flag) || !value || value.startsWith('--')) throw new Error('Invalid Researcher CLI options.');
		options.set(flag, value);
	}
	if (!options.has('--decision')) throw new Error('--decision is required; human approval is never inferred.');
	return { options, prepare };
}
async function main() {
	if (process.argv.includes('--help')) {
		console.log('npm run researcher -- --decision lab/decisions/<proposal>.json [--prepare] [--sources bundle.json] [--responses recorded.json] [--inventory inventory.json] [--source directory]\nPrepare captures a hash-bound request. Default execution replays explicitly imported session analysis; no live API. Writes only lab/research/<topic>/.'); return;
	}
	const { options, prepare } = parseResearcherArguments(process.argv.slice(2));
	const json = async (path: string) => JSON.parse(await readFile(path, 'utf8')) as unknown;
	const decision = z.union([ApprovedMergeDecisionSchema, ApprovedArticleDecisionSchema]).parse(await json(resolve(options.get('--decision')!)));
	if (decision.action !== 'MERGE') {
		const authorization = await readFile(resolve(project, decision.authorizationRef), 'utf8');
		if (decision.schemaVersion === 2) validateB2Authorization(authorization, decision.authorizationHash, decision.targets);
		else validateB3Authorization(authorization, decision.authorizationHash, decision.topic, decision.targets);
	}
	if (!/^lab\/cartography\/[a-z0-9-]+\.json$/.test(decision.analysisRef)) throw new Error('Invalid Cartographer analysis reference.');
	const analysisPath = await realpath(resolve(project, decision.analysisRef));
	if (!isWithin(await realpath(resolve(project, 'lab/cartography')), analysisPath)) throw new Error('Analysis escapes LAB cartography.');
	const cartography = z.union([FocusedMergeResultSchema, FocusedArticleResultSchema]).parse(await json(analysisPath));
	const slug = cartography.artifactName.replace(/-(merge|single)$/, '');
	const source = resolve(options.get('--source') ?? resolve(project, '../temp-ogwo/posts'));
	const inventory = InventoryInputSchema.parse(await json(resolve(options.get('--inventory') ?? resolve(project, 'lab/inventory/inventory.json'))));
	const research = ResearchBundleSchema.parse(await json(resolve(options.get('--sources') ?? resolve(project, `lab/research/${slug}/sources.json`))));
	if (research.topicSlug !== slug) throw new Error('Evidence topic differs from approved Cartographer topic.');
	const selected = decision.targets.map(target => {
		const article = inventory.articles.find(item => item.source_id === target.sourceId && item.source_path === target.sourcePath);
		if (!article) throw new Error('Unknown approved target.'); return article;
	});
	const input = validateResearchInput({ decision, cartography, inventory: { schema_version: 1, articles: selected }, research, limits: DEFAULT_RESEARCH_LIMITS });
	const prompt = await readFile(new URL('../engine/agents/researcher/prompt.md', import.meta.url), 'utf8');
	const reader = createSourceReader(source);
	if (prepare) {
		const { request } = await prepareResearchRequest(input, prompt, reader);
		await writeResearchArtifacts(project, source, { [`research/${slug}/request.json`]: stableJson({ schemaVersion: 1, inputHash: hashJson(input), requestHash: hashJson(request), request }) });
		console.log(`Prepared Researcher: ${selected.length} full bodies, ${research.sources.length} captured official documents; request ${hashJson(request)}.`); return;
	}
	const model = new RecordedLanguageModel(await json(resolve(options.get('--responses') ?? resolve(project, `lab/research/${slug}/session-responses.json`))));
	const packet = await runResearcher(input, prompt, model, reader);
	const paths = await writeResearchArtifacts(project, source, createResearchArtifacts(packet, research.questions));
	console.log(`Researcher: ${packet.targets.length} full articles; ${packet.sourceRegister.length} sources; ${packet.verifiedFacts.length} facts; ${packet.incorrectClaims.length} corrections; ${packet.unresolvedQuestions.length} unresolved.\nMode: ${model.identity.mode}\n${paths.join('\n')}`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error: unknown) => {
	console.error(`Researcher failed: ${error instanceof Error ? error.message : 'unknown error'}`); process.exitCode = 1;
});
