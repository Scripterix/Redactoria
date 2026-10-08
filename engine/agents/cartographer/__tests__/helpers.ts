import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseLegacyPost } from '../../../../scripts/legacy/parser.ts';
import type { LanguageModel, StructuredRequest } from '../../../core/language-model.ts';
import type { CartographerAnalysis, CartographerInput, CoarsePlan, DeepRead, Evidence } from '../contract.ts';
import { DEFAULT_LIMITS } from '../policies.ts';

export const fixturesDirectory = fileURLToPath(new URL('../../../../tests/fixtures/legacy-posts/', import.meta.url));
export function sampleInput(): CartographerInput {
	return { inventory: { schema_version: 1 as const, articles: ['valid-post.md', 'unicode-polish.md'].map((name) =>
		parseLegacyPost(readFileSync(new URL(name, new URL('../../../../tests/fixtures/legacy-posts/', import.meta.url))), name)) },
		limits: { ...DEFAULT_LIMITS } };
}

export function titleEvidence(index = 0): Evidence {
	const article = sampleInput().inventory.articles[index]!;
	return { sourceId: article.source_id, sourcePath: article.source_path, field: 'title', value: article.title! };
}

export function samplePlan(): CoarsePlan {
	const ids = sampleInput().inventory.articles.map((article) => article.source_id);
	return { possibleDomains: [{ name: 'Sample domain', articleIds: ids, confidence: 0.8 }],
		initialClusters: [{ name: 'Sample cluster', articleIds: ids, confidence: 0.7 }],
		deepReadRequests: [{ sourceId: ids[0]!, reason: 'Check body, not only title.' }], uncertainties: ['Metadata is incomplete coverage evidence.'] };
}

export function sampleAnalysis(): CartographerAnalysis {
	const ids = sampleInput().inventory.articles.map((article) => article.source_id);
	return {
		domains: [{ id: 'domain', name: 'Sample domain', parentId: null, articleIds: ids,
			interpretation: 'Tentative relationship.', evidence: [titleEvidence()], confidence: 0.8 }],
		clusters: [{ id: 'cluster', domainId: 'domain', name: 'Sample cluster', articleIds: ids,
			coverage: 'partial', interpretation: 'Needs review.', evidence: [titleEvidence()], confidence: 0.7 }],
		gaps: [{ id: 'gap', domainId: 'domain', description: 'Verify prerequisite coverage.', reason: 'Titles are not a syllabus.',
			evidence: [titleEvidence()], confidence: 0.5, priority: 'medium' }],
		candidates: [{ id: 'candidate', target: { kind: 'articles', sourceIds: [ids[0]!], domainId: 'domain', proposedTitle: null },
			action: 'REVIEW', reason: 'Verify scope before editing.', evidence: [titleEvidence()], confidence: 0.8, priority: 'high' }],
		observations: [{ id: 'observation', interpretation: 'Only a sample was deeply read.', evidence: [titleEvidence()], confidence: 1 }],
		limitations: ['No claim of comprehensive technical validation.'],
	};
}

export function sampleReads(): DeepRead[] {
	const article = sampleInput().inventory.articles[0]!;
	return [{ sourceId: article.source_id, sourcePath: article.source_path, contentHash: article.content_hash,
		body: 'Verified body about arrays.', truncated: false }];
}

export class FakeLanguageModel implements LanguageModel {
	readonly identity = { adapter: 'fake', model: 'fixture-model', mode: 'test' as const };
	readonly requests: StructuredRequest[] = [];
	constructor(private responses: unknown[] = [samplePlan(), sampleAnalysis()]) {}
	async generateStructured(request: StructuredRequest): Promise<unknown> {
		this.requests.push(structuredClone(request));
		if (!this.responses.length) throw new Error('Unexpected model call.');
		return structuredClone(this.responses.shift());
	}
}
