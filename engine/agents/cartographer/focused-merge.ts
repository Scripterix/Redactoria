import { z } from 'zod';
import type { LanguageModel, StructuredRequest } from '../../core/language-model.ts';
import { hashJson } from '../../core/serialization.ts';
import { assertEvidence, validateInput } from '../../validation/cartographer.ts';
import type { SourceReader } from './agent.ts';
import { DeepReadSchema, EvidenceSchema } from './contract.ts';
import type { CartographerInput, DeepRead } from './contract.ts';

const text = z.string().min(1).refine((value) => value.trim().length > 0, 'Nonblank text required');
const confidence = z.number().min(0).max(1);
const evidence = z.array(EvidenceSchema).min(1);
const finding = z.strictObject({ id: text, interpretation: text, evidence, confidence });
const findingKeys = ['sharedTopics', 'uniqueToFirst', 'uniqueToSecond', 'duplicates', 'conflicts',
	'logicalOrder', 'outdatedOrUncertain', 'keep', 'remove', 'needsResearch'] as const;

export const FocusedMergeAnalysisSchema = z.strictObject({
	task: z.literal('MERGE'), artifactName: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*-merge$/),
	recommended: z.boolean(), confidence, reason: text, evidence,
	sharedTopics: z.array(finding), uniqueToFirst: z.array(finding), uniqueToSecond: z.array(finding),
	duplicates: z.array(finding), conflicts: z.array(finding), logicalOrder: z.array(finding),
	outdatedOrUncertain: z.array(finding), keep: z.array(finding), remove: z.array(finding), needsResearch: z.array(finding),
	proposedTitle: text,
	proposedStructure: z.array(z.strictObject({ order: z.number().int().min(1), title: text, purpose: text,
		sourceIds: z.array(text).min(1), evidence, needsResearch: z.boolean() })).min(1),
	limitations: z.array(text).min(1),
});
export type FocusedMergeAnalysis = z.infer<typeof FocusedMergeAnalysisSchema>;
export const FocusedMergeResultSchema = FocusedMergeAnalysisSchema.extend({
	schemaVersion: z.literal(1),
	targets: z.array(z.strictObject({ sourceId: text, sourcePath: text, title: text.nullable(),
		contentHash: z.string().regex(/^[a-f0-9]{64}$/), providedCharacters: z.number().int().min(0), truncated: z.literal(false) })).length(2),
	analysisContext: z.strictObject({ selectedInventoryHash: z.string().regex(/^[a-f0-9]{64}$/),
		requestHash: z.string().regex(/^[a-f0-9]{64}$/),
		model: z.strictObject({ adapter: text, model: text, mode: z.enum(['imported-session-analysis', 'live', 'test']) }) }),
});
export type FocusedMergeResult = z.infer<typeof FocusedMergeResultSchema>;

export const MergeProposalSchema = z.strictObject({
	schemaVersion: z.literal(1), status: z.literal('proposed'), action: z.literal('MERGE'),
	targets: FocusedMergeResultSchema.shape.targets, confidence, reason: text, evidence,
	analysisHash: z.string().regex(/^[a-f0-9]{64}$/),
	analysisRef: z.string().regex(/^lab\/cartography\/[a-z0-9-]+-merge\.json$/),
});

/** Filter first. Excluded corpus metadata is never put in the focused model context. */
export function selectFocusedInput(rawInventory: unknown, focusPaths: string[], limits: unknown): CartographerInput {
	if (focusPaths.length !== 2 || new Set(focusPaths).size !== 2) throw new Error('Focused MERGE requires exactly two distinct source paths.');
	const container = z.strictObject({ schema_version: z.literal(1), articles: z.array(z.unknown()) }).parse(rawInventory);
	const selected = focusPaths.map((path) => {
		const matches = container.articles.filter((article) => article && typeof article === 'object'
			&& 'source_path' in article && article.source_path === path);
		if (matches.length !== 1) throw new Error(`Focus path must identify exactly one inventory article: ${path}`);
		return matches[0];
	});
	return validateInput({ inventory: { schema_version: 1, articles: selected }, limits });
}

export async function prepareFocusedMerge(input: CartographerInput, prompt: string, reader: SourceReader) {
	const checked = validateInput(input);
	if (checked.inventory.articles.length !== 2) throw new Error('Focused MERGE requires exactly two targets.');
	if (checked.limits.maxDeepReads < 2) throw new Error('Focused MERGE needs a budget of two full reads.');
	const reads: DeepRead[] = [];
	for (const article of checked.inventory.articles) {
		if (article.parse_status === 'error') throw new Error('Cannot merge a source with a parse error.');
		const read = DeepReadSchema.parse(await reader(article, checked.limits));
		if (read.sourceId !== article.source_id || read.sourcePath !== article.source_path || read.contentHash !== article.content_hash) throw new Error('Focused read identity/hash mismatch.');
		if (read.truncated || read.body.length > checked.limits.maxBodyCharacters) throw new Error('Focused MERGE requires full bodies; increase the body budget instead of truncating.');
		reads.push(read);
	}
	const request: StructuredRequest = {
		phase: 'focused-merge',
		instructions: prompt + '\nFocused MERGE only: do not perform corpus cartography. Read both supplied bodies in full. Compare shared topics, repeated passages, unique material in first/second, conflicts, order, uncertain/version-sensitive claims, keep/remove/research needs. Propose an ordered outline, not an article. Every finding needs exact evidence. Shared topics cite both targets; unique findings cite their respective target. Do not research externally, publish, or approve the decision. Return the focused schema only.',
		context: { task: 'MERGE', scope: 'exactly-two-full-articles', ...checked, selectedArticles: reads },
		jsonSchema: z.toJSONSchema(FocusedMergeAnalysisSchema),
	};
	return { input: checked, request, reads };
}

export function validateFocusedMerge(raw: unknown, input: CartographerInput, reads: DeepRead[]) {
	const result = FocusedMergeAnalysisSchema.parse(raw);
	const targets = input.inventory.articles.map((article) => article.source_id);
	if (targets.length !== 2) throw new Error('Focused MERGE requires exactly two targets.');
	assertEvidence(result.evidence, input, reads);
	if (targets.some((id) => !result.evidence.some((item) => item.sourceId === id))) throw new Error('Both targets require evidence.');
	const allFindings = findingKeys.flatMap((key) => result[key]);
	if (new Set(allFindings.map((item) => item.id)).size !== allFindings.length) throw new Error('Duplicate focused finding ID.');
	for (const item of allFindings) assertEvidence(item.evidence, input, reads);
	for (const item of result.sharedTopics) if (targets.some((id) => !item.evidence.some((entry) => entry.sourceId === id))) throw new Error('Shared topics require both sources.');
	for (const [key, index] of [['uniqueToFirst', 0], ['uniqueToSecond', 1]] as const) {
		for (const item of result[key]) if (item.evidence.some((entry) => entry.sourceId !== targets[index])) throw new Error('Unique material cites the wrong target.');
	}
	for (const [index, section] of result.proposedStructure.entries()) {
		if (section.order !== index + 1) throw new Error('Outline order must be contiguous from one.');
		if (new Set(section.sourceIds).size !== section.sourceIds.length || section.sourceIds.some((id) => !targets.includes(id))) throw new Error('Outline has an invalid source reference.');
		assertEvidence(section.evidence, input, reads);
		if (section.evidence.some((item) => !section.sourceIds.includes(item.sourceId))
			|| section.sourceIds.some((id) => !section.evidence.some((item) => item.sourceId === id))) throw new Error('Outline sources require matching evidence.');
	}
	return result;
}

export async function runFocusedMerge(input: CartographerInput, prompt: string, model: LanguageModel, reader: SourceReader) {
	const prepared = await prepareFocusedMerge(input, prompt, reader);
	const analysis = validateFocusedMerge(await model.generateStructured(prepared.request), prepared.input, prepared.reads);
	return FocusedMergeResultSchema.parse({ ...analysis, schemaVersion: 1,
		targets: prepared.reads.map((read, index) => ({ sourceId: read.sourceId, sourcePath: read.sourcePath,
			title: prepared.input.inventory.articles[index]!.title, contentHash: read.contentHash,
			providedCharacters: read.body.length, truncated: false })),
		analysisContext: { selectedInventoryHash: hashJson(prepared.input.inventory), requestHash: hashJson(prepared.request), model: model.identity },
	});
}
