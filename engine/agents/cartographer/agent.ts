import { z } from 'zod';
import type { InventoryRecord } from '../../../scripts/legacy/types.ts';
import type { LanguageModel, StructuredRequest } from '../../core/language-model.ts';
import { hashJson } from '../../core/serialization.ts';
import { validateAnalysis, validateCoarsePlan, validateInput } from '../../validation/cartographer.ts';
import { AnalysisSchema, CartographerResultSchema, CoarsePlanSchema, DeepReadSchema } from './contract.ts';
import type { CartographerInput, DeepRead } from './contract.ts';
import type { CartographerLimits } from './policies.ts';

export type SourceReader = (article: InventoryRecord, limits: CartographerLimits) => Promise<DeepRead>;

export function prepareInventoryRequest(input: CartographerInput, prompt: string): StructuredRequest {
	const checked = validateInput(input);
	return {
		phase: 'inventory', instructions: prompt + '\nCurrent pass: A. Return the coarse plan only.',
		context: { site: 'Redactoria EDU: educational programming and related web/AI knowledge', ...checked },
		jsonSchema: z.toJSONSchema(CoarsePlanSchema),
	};
}

export async function prepareDeepReadRequest(input: CartographerInput, prompt: string, rawPlan: unknown, reader: SourceReader) {
	const checked = validateInput(input);
	const plan = validateCoarsePlan(rawPlan, checked);
	const reads: DeepRead[] = [];
	for (const request of plan.deepReadRequests) {
		const article = checked.inventory.articles.find((item) => item.source_id === request.sourceId)!;
		const read = DeepReadSchema.parse(await reader(article, checked.limits));
		if (read.sourceId !== article.source_id || read.sourcePath !== article.source_path || read.contentHash !== article.content_hash) {
			throw new Error('Deep-read identity/hash does not match inventory.');
		}
		if (read.body.length > checked.limits.maxBodyCharacters) throw new Error('Body character budget exceeded.');
		reads.push(read);
	}
	const request: StructuredRequest = {
		phase: 'deep-read', instructions: prompt + '\nCurrent pass: B. Return the refined analysis only.',
		context: { site: 'Redactoria EDU: educational programming and related web/AI knowledge', ...checked, coarsePlan: plan, selectedArticles: reads },
		jsonSchema: z.toJSONSchema(AnalysisSchema),
	};
	return { request, reads, plan };
}

/** No filesystem writes, provider imports, tools, or other agents inside the module. */
export async function runCartographer(input: CartographerInput, prompt: string, model: LanguageModel, reader: SourceReader) {
	const checked = validateInput(input);
	const coarse = await model.generateStructured(prepareInventoryRequest(checked, prompt));
	const deep = await prepareDeepReadRequest(checked, prompt, coarse, reader);
	const analysis = validateAnalysis(await model.generateStructured(deep.request), checked, deep.reads);
	const mapped = new Set(analysis.domains.flatMap((domain) => domain.articleIds));
	const articles = checked.inventory.articles;
	return CartographerResultSchema.parse({
		...analysis, schemaVersion: 1, uncertainties: deep.plan.uncertainties,
		corpusOverview: {
			articleCount: articles.length, parsedOk: articles.filter((item) => item.parse_status === 'ok').length,
			reviewRequired: articles.filter((item) => item.parse_status === 'needs-review').length,
			parseErrors: articles.filter((item) => item.parse_status === 'error').length,
			mappedArticleCount: mapped.size, unmappedArticleIds: articles.filter((item) => !mapped.has(item.source_id)).map((item) => item.source_id),
		},
		analysisContext: {
			inventoryHash: hashJson(checked.inventory), limits: checked.limits, model: model.identity,
			deepReads: deep.reads.map(({ body, ...read }) => ({ ...read, providedCharacters: body.length })),
		},
	});
}
