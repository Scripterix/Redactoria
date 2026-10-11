import { z } from 'zod';
import { Sha, Slug, Text } from '../core/editorial-context.ts';

export const ContentChangeTypeSchema = z.enum([
	'TECHNICAL_CLEANUP',
	'METADATA_ONLY',
	'LINK_FIX',
	'TYPO_FIX',
	'PRESENTATION_ONLY',
	'CONTENT_CHANGE',
]);
export type ContentChangeType = z.infer<typeof ContentChangeTypeSchema>;

export const ReviewImpactSchema = z.enum([
	'REVIEW_STILL_VALID',
	'REVIEW_RECHECK_REQUIRED',
	'REVIEW_INVALIDATED',
]);
export type ReviewImpact = z.infer<typeof ReviewImpactSchema>;

const ExactReplacementSchema = z.strictObject({
	from: z.string().min(1),
	to: z.string(),
});

export const ContentLineageTransformationSchema = z.discriminatedUnion('kind', [
	z.strictObject({
		kind: z.literal('metadata-replacements'),
		replacements: z.array(ExactReplacementSchema).min(1),
	}),
	z.strictObject({
		kind: z.literal('remove-body-exact'),
		removals: z.array(z.string().min(1)).min(1),
	}),
	z.strictObject({
		kind: z.literal('link-replacements'),
		scope: z.enum(['navigation', 'citation', 'evidence']),
		replacements: z.array(ExactReplacementSchema).min(1),
	}),
	z.strictObject({
		kind: z.literal('body-replacements'),
		replacements: z.array(ExactReplacementSchema).min(1),
		meaningUnchanged: z.boolean(),
	}),
	z.strictObject({
		kind: z.literal('presentation-normalization'),
		mode: z.enum(['normalize-lf', 'trim-trailing-whitespace']),
	}),
]);
export type ContentLineageTransformation = z.infer<typeof ContentLineageTransformationSchema>;

const EvidenceRefSchema = z.string().regex(/^(?:docs\/plans\/(?:active|completed)|lab\/(?:decisions|reports|reviews))\/[a-zA-Z0-9/_.-]+$/);
const PromotionAuditRefSchema = z.string().regex(/^lab\/reports\/[a-zA-Z0-9/_-]+-promotion\.json$/);

const ReplacementReviewSchema = z.strictObject({
	ref: z.string().regex(/^lab\/reviews\/[a-zA-Z0-9/_-]+\.json$/),
	sha256: Sha,
	reviewedContentHash: Sha,
	verdict: z.literal('PASS'),
});

export const ContentLineageRecordSchema = z.strictObject({
	schemaVersion: z.literal(1),
	recordType: z.enum(['CONTENT_LINEAGE_RECORD', 'BACKFILLED_LINEAGE_RECORD']),
	articleId: Slug,
	previousContentHash: Sha,
	newContentHash: Sha,
	changeType: ContentChangeTypeSchema,
	reason: Text,
	authorizedBy: z.literal('human'),
	authorizationRef: EvidenceRefSchema,
	authorizationHash: Sha,
	timestamp: z.iso.datetime(),
	sourceCandidateHash: Sha,
	promotionAuditRef: PromotionAuditRefSchema,
	reviewImpact: ReviewImpactSchema,
	replacementReview: ReplacementReviewSchema.nullable(),
	transformation: ContentLineageTransformationSchema,
	backfilled: z.boolean(),
	notes: z.array(Text),
}).superRefine((record, context) => {
	const expectedKind: Record<ContentChangeType, ContentLineageTransformation['kind']> = {
		TECHNICAL_CLEANUP: 'remove-body-exact',
		METADATA_ONLY: 'metadata-replacements',
		LINK_FIX: 'link-replacements',
		TYPO_FIX: 'body-replacements',
		PRESENTATION_ONLY: 'presentation-normalization',
		CONTENT_CHANGE: 'body-replacements',
	};
	if (record.transformation.kind !== expectedKind[record.changeType]) {
		context.addIssue({ code: 'custom', path: ['transformation'], message: 'Transformation does not match changeType.' });
	}
	if (record.changeType === 'TYPO_FIX' && record.transformation.kind === 'body-replacements'
		&& !record.transformation.meaningUnchanged) {
		context.addIssue({ code: 'custom', path: ['transformation', 'meaningUnchanged'], message: 'A typo fix requires an explicit no-meaning-change attestation.' });
	}
	if (record.changeType === 'CONTENT_CHANGE' && record.transformation.kind === 'body-replacements'
		&& record.transformation.meaningUnchanged) {
		context.addIssue({ code: 'custom', path: ['transformation', 'meaningUnchanged'], message: 'A content change cannot be declared meaning-unchanged.' });
	}
	if (record.changeType === 'CONTENT_CHANGE' && record.reviewImpact !== 'REVIEW_INVALIDATED') {
		context.addIssue({ code: 'custom', path: ['reviewImpact'], message: 'A content change invalidates the preceding review.' });
	}
	if (record.changeType === 'LINK_FIX' && record.transformation.kind === 'link-replacements'
		&& record.transformation.scope !== 'navigation' && record.reviewImpact === 'REVIEW_STILL_VALID') {
		context.addIssue({ code: 'custom', path: ['reviewImpact'], message: 'Citation/evidence link changes require review recheck.' });
	}
});
export type ContentLineageRecord = z.infer<typeof ContentLineageRecordSchema>;

export const ContentLineageBundleSchema = z.strictObject({
	schemaVersion: z.literal(1),
	status: z.literal('BACKFILLED'),
	articleId: Slug,
	candidateRef: z.string().regex(/^lab\/candidates\/[a-z0-9]+(?:-[a-z0-9]+)*\/article\.json$/),
	sourceCandidateHash: Sha,
	promotionAuditRef: PromotionAuditRefSchema,
	promotedContentHash: Sha,
	currentContentRef: z.string().regex(/^content\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/),
	currentContentHash: Sha,
	records: z.array(ContentLineageRecordSchema),
	notes: z.array(Text),
});
export type ContentLineageBundle = z.infer<typeof ContentLineageBundleSchema>;

export const LineageCheckSchema = z.strictObject({
	status: z.enum(['PASS', 'FAIL']),
	detail: Text,
});

export const ContentLineageValidationResultSchema = z.strictObject({
	schemaVersion: z.literal(1),
	articleId: Slug,
	checks: z.strictObject({
		recordSchema: LineageCheckSchema,
		originHash: LineageCheckSchema,
		candidateBinding: LineageCheckSchema,
		promotionAuditBinding: LineageCheckSchema,
		authorization: LineageCheckSchema,
		hashChain: LineageCheckSchema,
		transformation: LineageCheckSchema,
		currentHash: LineageCheckSchema,
		reviewValidity: LineageCheckSchema,
	}),
	effectiveReview: z.enum(['VALID', 'INVALIDATED']),
	overall: z.enum(['PASS', 'FAIL']),
});
export type ContentLineageValidationResult = z.infer<typeof ContentLineageValidationResultSchema>;
