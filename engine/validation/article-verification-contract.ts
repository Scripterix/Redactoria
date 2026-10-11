import { z } from 'zod';
import { Slug, Text } from '../core/editorial-context.ts';

export const VerificationStatusSchema = z.enum(['PASS', 'FAIL', 'NOT_APPLICABLE']);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const VerificationCheckSchema = z.strictObject({
	status: VerificationStatusSchema,
	detail: Text,
});
export type VerificationCheck = z.infer<typeof VerificationCheckSchema>;

const area = <T extends z.ZodRawShape>(checks: T) => z.strictObject({
	status: VerificationStatusSchema,
	checks: z.strictObject(checks),
});

export const VerificationAreasSchema = z.strictObject({
	source: area({
		exists: VerificationCheckSchema,
		reference: VerificationCheckSchema,
		hash: VerificationCheckSchema,
		protection: VerificationCheckSchema,
	}),
	cartography: area({
		decision: VerificationCheckSchema,
		scopeProvenance: VerificationCheckSchema,
		authorization: VerificationCheckSchema,
	}),
	research: area({
		packet: VerificationCheckSchema,
		approval: VerificationCheckSchema,
		evidence: VerificationCheckSchema,
		hashes: VerificationCheckSchema,
	}),
	runtime: area({
		evidence: VerificationCheckSchema,
		exampleBinding: VerificationCheckSchema,
		environment: VerificationCheckSchema,
		results: VerificationCheckSchema,
	}),
	writer: area({
		draft: VerificationCheckSchema,
		hash: VerificationCheckSchema,
		lineage: VerificationCheckSchema,
	}),
	critic: area({
		finalReview: VerificationCheckSchema,
		verdict: VerificationCheckSchema,
		reviewedHash: VerificationCheckSchema,
		unresolvedChanges: VerificationCheckSchema,
	}),
	candidate: area({
		exists: VerificationCheckSchema,
		schema: VerificationCheckSchema,
		integrity: VerificationCheckSchema,
		reviewedVersion: VerificationCheckSchema,
		publicationFlags: VerificationCheckSchema,
	}),
	publication: area({
		decision: VerificationCheckSchema,
		humanApproval: VerificationCheckSchema,
		promotionAudit: VerificationCheckSchema,
		contentLineage: VerificationCheckSchema,
		contentIntegrity: VerificationCheckSchema,
	}),
});

export const ArticleVerificationResultSchema = z.strictObject({
	schemaVersion: z.literal(1),
	topic: Slug,
	candidateRef: z.string().regex(/^lab\/candidates\/[a-z0-9]+(?:-[a-z0-9]+)*\/article\.json$/),
	fixture: z.enum(['frozen-published', 'frozen-pending']),
	areas: VerificationAreasSchema,
	summary: z.strictObject({
		pass: z.number().int().nonnegative(),
		fail: z.number().int().nonnegative(),
		notApplicable: z.number().int().nonnegative(),
		total: z.number().int().positive(),
	}),
	overall: z.enum(['PASS', 'FAIL']),
});

export type ArticleVerificationResult = z.infer<typeof ArticleVerificationResultSchema>;

export const COMMON_CHECK_COUNT = 27;
export const CONDITIONAL_PUBLICATION_CHECK_COUNT = 5;
export const TOTAL_CHECK_COUNT = COMMON_CHECK_COUNT + CONDITIONAL_PUBLICATION_CHECK_COUNT;

export function overallVerificationStatus(checks: VerificationCheck[]): 'PASS' | 'FAIL' {
	return checks.some(check => check.status === 'FAIL') ? 'FAIL' : 'PASS';
}
