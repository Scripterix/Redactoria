import { z } from 'zod';
import type { LanguageModel, StructuredRequest } from '../../core/language-model.ts';
import { hashJson } from '../../core/serialization.ts';
import { assertEvidence, validateInput } from '../../validation/cartographer.ts';
import { DeepReadSchema, EvidenceSchema } from './contract.ts';
import { FocusedMergeResultSchema } from './focused-merge.ts';
import type { CartographerInput, DeepRead } from './contract.ts';
import type { SourceReader } from './agent.ts';

const text = z.string().trim().min(1);
const sha = z.string().regex(/^[a-f0-9]{64}$/);
const confidence = z.number().min(0).max(1);
const finding = z.strictObject({ id: text, interpretation: text, evidence: z.array(EvidenceSchema).min(1), confidence });
export const FocusedArticleAnalysisSchema = z.strictObject({
	task: z.literal('SINGLE_ARTICLE'), artifactName: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*-single$/),
	action: z.enum(['REWRITE', 'MERGE', 'SPLIT', 'KEEP_AND_UPDATE']), recommended: z.boolean(), confidence, reason: text,
	evidence: z.array(EvidenceSchema).min(1), scope: text,
	keep: z.array(finding), correct: z.array(finding), outdatedOrUncertain: z.array(finding),
	remove: z.array(finding), missing: z.array(finding), needsResearch: z.array(finding),
	prerequisites: z.array(text).min(1),
	relationships: z.array(z.strictObject({ publicPath: z.string().regex(/^\/artykuly\/[a-z0-9-]+\/$/), reason: text })),
	proposedTitle: text, proposedStructure: FocusedMergeResultSchema.shape.proposedStructure,
	limitations: z.array(text).min(1),
});
export const FocusedArticleResultSchema = FocusedArticleAnalysisSchema.extend({
	schemaVersion: z.literal(1), targets: z.array(FocusedMergeResultSchema.shape.targets.element).length(1),
	analysisContext: FocusedMergeResultSchema.shape.analysisContext,
});
export const ApprovedArticleDecisionV2Schema = z.strictObject({
	schemaVersion: z.literal(2), status: z.literal('approved'), approvedBy: z.literal('human'),
	action: z.enum(['REWRITE', 'KEEP_AND_UPDATE']), nextStep: z.literal('research'),
	targets: FocusedArticleResultSchema.shape.targets, confidence, reason: text, evidence: z.array(EvidenceSchema).min(1),
	analysisHash: sha, analysisRef: z.string().regex(/^lab\/cartography\/[a-z0-9-]+-single\.json$/),
	authorizationRef: z.string().regex(/^lab\/decisions\/[a-z0-9-]+-b2-authorization\.json$/), authorizationHash: sha,
});
export const ApprovedArticleDecisionV3Schema = z.strictObject({
	schemaVersion: z.literal(3), status: z.literal('approved'), approvedBy: z.literal('human'),
	action: z.enum(['REWRITE', 'KEEP_AND_UPDATE']), nextStep: z.literal('research'),
	targets: FocusedArticleResultSchema.shape.targets, confidence, reason: text, evidence: z.array(EvidenceSchema).min(1),
	analysisHash: sha, analysisRef: z.string().regex(/^lab\/cartography\/[a-z0-9-]+-single\.json$/),
	authorizationRef: z.literal('lab/decisions/b3-authorization.json'), authorizationHash: sha,
	topic: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
export const ApprovedArticleDecisionSchema = z.union([ApprovedArticleDecisionV2Schema, ApprovedArticleDecisionV3Schema]);

export async function prepareFocusedArticle(raw: unknown, prompt: string, reader: SourceReader) {
	const input = validateInput(raw);
	if (input.inventory.articles.length !== 1 || input.limits.maxDeepReads !== 1) throw new Error('Focused article requires exactly one source/read.');
	const source = input.inventory.articles[0]!;
	if (source.parse_status === 'error') throw new Error('Cannot analyze a parse-error source.');
	const read = DeepReadSchema.parse(await reader(source, input.limits));
	if (read.sourceId !== source.source_id || read.sourcePath !== source.source_path || read.contentHash !== source.content_hash
		|| read.truncated || read.body.length > input.limits.maxBodyCharacters) throw new Error('Focused article needs exact full source/hash.');
	const request: StructuredRequest = { phase: 'focused-article', instructions: prompt,
		context: { ...input, selectedArticles: [read] }, jsonSchema: z.toJSONSchema(FocusedArticleAnalysisSchema) };
	return { input, reads: [read], request };
}
export function validateFocusedArticle(raw: unknown, input: CartographerInput, reads: DeepRead[]) {
	const analysis = FocusedArticleAnalysisSchema.parse(raw);
	if (input.inventory.articles.length !== 1 || reads.length !== 1) throw new Error('Exactly one source required.');
	const groups = [analysis.keep, analysis.correct, analysis.outdatedOrUncertain, analysis.remove, analysis.missing, analysis.needsResearch];
	const all = groups.flat();
	if (new Set(all.map(item => item.id)).size !== all.length) throw new Error('Duplicate focused finding ID.');
	for (const evidence of [analysis.evidence, ...all.map(item => item.evidence), ...analysis.proposedStructure.map(item => item.evidence)]) assertEvidence(evidence, input, reads);
	for (const [index, section] of analysis.proposedStructure.entries()) {
		if (section.order !== index + 1 || section.sourceIds.length !== 1 || section.sourceIds[0] !== reads[0]!.sourceId) throw new Error('Invalid focused outline/source order.');
	}
	return analysis;
}
export async function runFocusedArticle(raw: unknown, prompt: string, model: LanguageModel, reader: SourceReader) {
	const prepared = await prepareFocusedArticle(raw, prompt, reader);
	const analysis = validateFocusedArticle(await model.generateStructured(prepared.request), prepared.input, prepared.reads);
	return FocusedArticleResultSchema.parse({ ...analysis, schemaVersion: 1,
		targets: prepared.reads.map(read => ({ sourceId: read.sourceId, sourcePath: read.sourcePath, contentHash: read.contentHash,
			title: prepared.input.inventory.articles[0]!.title, providedCharacters: read.body.length, truncated: false })),
		analysisContext: { selectedInventoryHash: hashJson(prepared.input.inventory), requestHash: hashJson(prepared.request), model: model.identity } });
}
