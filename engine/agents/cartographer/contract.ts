import { z } from 'zod';
import { ALLOWED_ACTIONS, LimitsSchema } from './policies.ts';

const text = z.string().min(1).refine((value) => value.trim().length > 0, 'Nonblank text required');
const id = z.string().min(1);
const ids = z.array(id).min(1);
const confidence = z.number().min(0).max(1);
const priority = z.enum(['low', 'medium', 'high']);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);

export const InventoryInputSchema = z.strictObject({
	schema_version: z.literal(1),
	articles: z.array(z.strictObject({
		source_id: id, source_path: text, title: text.nullable(), slug: text.nullable(),
		original_url: text.nullable(), original_date: text.nullable(), original_author: text.nullable(),
		categories: z.array(text), tags: z.array(text), word_count: z.number().int().min(0).nullable(),
		content_hash: sha256, bom_detected: z.boolean(), parse_status: z.enum(['ok', 'needs-review', 'error']),
		warnings: z.array(text), review_status: z.literal('unreviewed'),
	})),
});

export const CartographerInputSchema = z.strictObject({ inventory: InventoryInputSchema, limits: LimitsSchema });
export type CartographerInput = z.infer<typeof CartographerInputSchema>;

export const EvidenceSchema = z.strictObject({
	sourceId: id, sourcePath: text,
	field: z.enum(['title', 'categories', 'tags', 'original_date', 'original_author', 'original_url', 'slug', 'word_count', 'parse_status', 'warnings', 'body']),
	/** Scalars are exact text; arrays are compact JSON; body evidence is an exact excerpt. */
	value: text,
});
const evidence = z.array(EvidenceSchema).min(1);
export type Evidence = z.infer<typeof EvidenceSchema>;

export const CoarsePlanSchema = z.strictObject({
	possibleDomains: z.array(z.strictObject({ name: text, articleIds: ids, confidence })),
	initialClusters: z.array(z.strictObject({ name: text, articleIds: ids, confidence })),
	deepReadRequests: z.array(z.strictObject({ sourceId: id, reason: text })),
	uncertainties: z.array(text),
});
export type CoarsePlan = z.infer<typeof CoarsePlanSchema>;

export const AnalysisSchema = z.strictObject({
	domains: z.array(z.strictObject({
		id, name: text, parentId: id.nullable(), articleIds: ids, interpretation: text, evidence, confidence,
	})),
	clusters: z.array(z.strictObject({
		id, domainId: id, name: text, articleIds: ids,
		coverage: z.enum(['strong', 'partial', 'weak', 'unknown']), interpretation: text, evidence, confidence,
	})),
	gaps: z.array(z.strictObject({ id, domainId: id, description: text, reason: text, evidence, confidence, priority })),
	candidates: z.array(z.strictObject({
		id, target: z.strictObject({ kind: z.enum(['articles', 'new-content']), sourceIds: z.array(id),
			domainId: id.nullable(), proposedTitle: text.nullable() }),
		action: z.enum(ALLOWED_ACTIONS), reason: text, evidence, confidence, priority,
	})),
	observations: z.array(z.strictObject({ id, interpretation: text, evidence, confidence })),
	limitations: z.array(text).min(1),
});
export type CartographerAnalysis = z.infer<typeof AnalysisSchema>;
export type EditorialCandidate = CartographerAnalysis['candidates'][number];

export const DeepReadSchema = z.strictObject({
	sourceId: id, sourcePath: text, contentHash: sha256, body: z.string(), truncated: z.boolean(),
});
export type DeepRead = z.infer<typeof DeepReadSchema>;

export const CartographerResultSchema = AnalysisSchema.extend({
	schemaVersion: z.literal(1),
	uncertainties: z.array(text),
	corpusOverview: z.strictObject({
		articleCount: z.number().int().min(0), parsedOk: z.number().int().min(0),
		reviewRequired: z.number().int().min(0), parseErrors: z.number().int().min(0),
		mappedArticleCount: z.number().int().min(0), unmappedArticleIds: z.array(id),
	}),
	analysisContext: z.strictObject({
		inventoryHash: sha256, limits: LimitsSchema,
		model: z.strictObject({ adapter: text, model: text, mode: z.enum(['imported-session-analysis', 'live', 'test']) }),
		deepReads: z.array(DeepReadSchema.omit({ body: true }).extend({ providedCharacters: z.number().int().min(0) })),
	}),
});
export type CartographerResult = z.infer<typeof CartographerResultSchema>;
