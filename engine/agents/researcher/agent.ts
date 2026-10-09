import { z } from 'zod';
import type { LanguageModel, StructuredRequest } from '../../core/language-model.ts';
import { hashJson } from '../../core/serialization.ts';
import type { createSourceReader } from '../../core/source-reader.ts';
import { DeepReadSchema } from '../cartographer/contract.ts';
import type { DeepRead } from '../cartographer/contract.ts';
import { ResearchAnalysisSchema } from './contract.ts';
import type { ResearcherInput } from './contract.ts';
import { sourceRegister, validateResearchAnalysis, validateResearchInput, validateResearchPacket } from './validation.ts';

export async function prepareResearchRequest(raw: ResearcherInput, prompt: string, reader: ReturnType<typeof createSourceReader>) {
	const input = validateResearchInput(raw);
	const reads: DeepRead[] = [];
	for (const target of input.decision.targets) {
		const article = input.inventory.articles.find(item => item.source_id === target.sourceId)!;
		const read = DeepReadSchema.parse(await reader(article, input.limits));
		if (read.sourceId !== target.sourceId || read.sourcePath !== target.sourcePath || read.contentHash !== target.contentHash) throw new Error('Read identity/hash mismatch.');
		if (read.truncated || read.body.length > input.limits.maxBodyCharacters) throw new Error('Researcher requires both full bodies within the read budget.');
		reads.push(read);
	}
	const request: StructuredRequest = { phase: 'research', instructions: prompt,
		context: { ...input, selectedArticles: reads }, jsonSchema: z.toJSONSchema(ResearchAnalysisSchema) };
	return { input, reads, request };
}

/** Only injected read/model ports: no filesystem writes, subprocesses or agent calls. */
export async function runResearcher(raw: ResearcherInput, prompt: string, model: LanguageModel, reader: ReturnType<typeof createSourceReader>) {
	const { input, reads, request } = await prepareResearchRequest(raw, prompt, reader);
	const analysis = validateResearchAnalysis(await model.generateStructured(request), input, reads);
	return validateResearchPacket({ ...analysis, schemaVersion: 1, targets: input.decision.targets,
		sourceRegister: sourceRegister(input, analysis), analysisContext: {
			inputHash: hashJson(input), requestHash: hashJson(request), decisionHash: hashJson(input.decision),
			cartographyHash: hashJson(input.cartography), researchBundleHash: hashJson(input.research),
			topicSlug: input.research.topicSlug, model: model.identity, fullReadCount: 2,
			probes: input.research.probes.map(({ code: _code, ...probe }) => probe),
		} }, input, reads, hashJson(request));
}
