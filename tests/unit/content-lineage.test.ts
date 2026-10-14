import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { hashBytes } from '../../engine/core/editorial-context.ts';
import { renderPromotedArticle } from '../../engine/promotion/gate.ts';
import {
	ContentChangeTypeSchema,
	ContentLineageBundleSchema,
	ContentLineageRecordSchema,
	ContentLineageValidationResultSchema,
	ReviewImpactSchema,
	type ContentChangeType,
	type ContentLineageRecord,
	type ContentLineageTransformation,
	type ReviewImpact,
} from '../../engine/validation/content-lineage-contract.ts';
import {
	applyContentLineageTransformation,
	validateContentLineage,
	type ContentLineageValidationInput,
} from '../../engine/validation/content-lineage.ts';

const authorizationRef = 'docs/plans/completed/test-authorization.md';
const authorization = 'Explicit human authorization fixture.\n';
const candidateHash = hashBytes('candidate fixture');
const promotionAuditRef = 'lab/reports/example-promotion.json';

function record(options: {
	previous: string;
	current: string;
	changeType: ContentChangeType;
	transformation: ContentLineageTransformation;
	reviewImpact?: ReviewImpact;
}): ContentLineageRecord {
	return ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: 'example',
		previousContentHash: hashBytes(options.previous),
		newContentHash: hashBytes(options.current),
		changeType: options.changeType,
		reason: 'Bounded test change.',
		authorizedBy: 'human',
		authorizationRef,
		authorizationHash: hashBytes(authorization),
		timestamp: '2026-10-11T12:00:00Z',
		sourceCandidateHash: candidateHash,
		promotionAuditRef,
		reviewImpact: options.reviewImpact ?? 'REVIEW_STILL_VALID',
		replacementReview: null,
		transformation: options.transformation,
		backfilled: false,
		notes: [],
	});
}

function input(initialContent: string, currentContent: string, records: unknown[]): ContentLineageValidationInput {
	return {
		articleId: 'example',
		initialContent,
		currentContent,
		promotedContentHash: hashBytes(initialContent),
		expectedCandidateHash: candidateHash,
		expectedPromotionAuditRef: promotionAuditRef,
		records,
		evidence: { [authorizationRef]: authorization },
	};
}

describe('CONTENT lineage contract spike', () => {
	it('distinguishes historical backfills from current append-only records', () => {
		expect(ContentLineageBundleSchema.shape.status.options).toEqual(['BACKFILLED', 'RECORDED']);
	});

	it('keeps the change and review enums closed', () => {
		expect(ContentChangeTypeSchema.options).toEqual([
			'TECHNICAL_CLEANUP', 'METADATA_ONLY', 'LINK_FIX', 'TYPO_FIX', 'PRESENTATION_ONLY', 'CONTENT_CHANGE',
		]);
		expect(ReviewImpactSchema.options).toEqual([
			'REVIEW_STILL_VALID', 'REVIEW_RECHECK_REQUIRED', 'REVIEW_INVALIDATED',
		]);
	});

	it('accepts exact promoted CONTENT without a post-promotion record', () => {
		const article = '---\ntitle: Example\n---\nExact reviewed body.\n';
		const result = validateContentLineage(input(article, article, []));
		expect(ContentLineageValidationResultSchema.parse(result)).toEqual(result);
		expect(result.overall).toBe('PASS');
		expect(result.effectiveReview).toBe('VALID');
	});

	it('accepts an exact technical cleanup and preserves the review', () => {
		const initial = '---\ntitle: Example\n---\nInternal draft note.\n\nReviewed body.\n';
		const current = '---\ntitle: Example\n---\nReviewed body.\n';
		const transformation: ContentLineageTransformation = { kind: 'remove-body-exact', removals: ['Internal draft note.\n\n'] };
		expect(applyContentLineageTransformation(initial, transformation)).toBe(current);
		expect(validateContentLineage(input(initial, current, [record({
			previous: initial, current, changeType: 'TECHNICAL_CLEANUP', transformation,
		})])).overall).toBe('PASS');
	});

	it('accepts metadata-only replacement only when the body is byte-identical', () => {
		const initial = '---\ntitle: Old\n---\nReviewed body.\n';
		const current = '---\ntitle: New\n---\nReviewed body.\n';
		const transformation: ContentLineageTransformation = { kind: 'metadata-replacements', replacements: [{ from: 'title: Old', to: 'title: New' }] };
		expect(validateContentLineage(input(initial, current, [record({
			previous: initial, current, changeType: 'METADATA_ONLY', transformation,
		})])).overall).toBe('PASS');
	});

	it('accepts a typo fix with an explicit no-meaning-change attestation', () => {
		const initial = '---\ntitle: Example\n---\nThis is teh example.\n';
		const current = '---\ntitle: Example\n---\nThis is the example.\n';
		const transformation: ContentLineageTransformation = {
			kind: 'body-replacements', replacements: [{ from: 'teh', to: 'the' }], meaningUnchanged: true,
		};
		expect(validateContentLineage(input(initial, current, [record({
			previous: initial, current, changeType: 'TYPO_FIX', transformation,
		})])).overall).toBe('PASS');
	});

	it('accepts an append-only internal navigation insertion without invalidating review', () => {
		const initial = '---\ntitle: Example\n---\nReviewed body.\n';
		const addition = '\nDalej: [Następny artykuł](/artykuly/nastepny/).\n';
		const current = initial + addition;
		const transformation: ContentLineageTransformation = {
			kind: 'navigation-insertions',
			insertions: [{ after: 'Reviewed body.\n', content: addition }],
		};
		expect(applyContentLineageTransformation(initial, transformation)).toBe(current);
		expect(validateContentLineage(input(initial, current, [record({
			previous: initial, current, changeType: 'LINK_FIX', transformation,
		})])).overall).toBe('PASS');
	});

	it('accepts deterministic presentation-only line-ending normalization', () => {
		const initial = '---\r\ntitle: Example\r\n---\r\nReviewed body.\r\n';
		const current = initial.replace(/\r\n/g, '\n');
		const transformation = { kind: 'presentation-normalization', mode: 'normalize-lf' } as const;
		expect(validateContentLineage(input(initial, current, [record({
			previous: initial, current, changeType: 'PRESENTATION_ONLY', transformation,
		})])).overall).toBe('PASS');
	});

	it('rejects a missing previous hash', () => {
		const article = '---\ntitle: Example\n---\nBody.\n';
		const changed = article.replace('Body.', 'Body!');
		const value = structuredClone(record({ previous: article, current: changed, changeType: 'TYPO_FIX',
			transformation: { kind: 'body-replacements', replacements: [{ from: 'Body.', to: 'Body!' }], meaningUnchanged: true } }));
		delete (value as Partial<ContentLineageRecord>).previousContentHash;
		expect(validateContentLineage(input(article, changed, [value])).checks.recordSchema.status).toBe('FAIL');
	});

	it('rejects a broken hash chain', () => {
		const article = '---\ntitle: Example\n---\nBody.\n';
		const changed = article.replace('Body.', 'Body!');
		const value = structuredClone(record({ previous: article, current: changed, changeType: 'TYPO_FIX',
			transformation: { kind: 'body-replacements', replacements: [{ from: 'Body.', to: 'Body!' }], meaningUnchanged: true } }));
		value.previousContentHash = '0'.repeat(64);
		expect(validateContentLineage(input(article, changed, [value])).checks.hashChain.status).toBe('FAIL');
	});

	it('rejects an unknown change type', () => {
		const article = '---\ntitle: Example\n---\nBody.\n';
		const value = { ...record({ previous: article, current: article, changeType: 'PRESENTATION_ONLY',
			transformation: { kind: 'presentation-normalization', mode: 'normalize-lf' } }), changeType: 'MAGIC_REWRITE' };
		expect(validateContentLineage(input(article, article, [value])).checks.recordSchema.status).toBe('FAIL');
	});

	it('rejects missing hash-bound authorization evidence', () => {
		const article = '---\ntitle: Example\n---\nBody.\n';
		const changed = article.replace('Body.', 'Body!');
		const fixture = input(article, changed, [record({ previous: article, current: changed, changeType: 'TYPO_FIX',
			transformation: { kind: 'body-replacements', replacements: [{ from: 'Body.', to: 'Body!' }], meaningUnchanged: true } })]);
		fixture.evidence = {};
		expect(validateContentLineage(fixture).checks.authorization.status).toBe('FAIL');
	});

	it('rejects body drift falsely classified as metadata-only', () => {
		const initial = '---\ntitle: Old\n---\nReviewed body.\n';
		const current = '---\ntitle: New\n---\nChanged body.\n';
		const value = record({ previous: initial, current, changeType: 'METADATA_ONLY',
			transformation: { kind: 'metadata-replacements', replacements: [{ from: 'title: Old', to: 'title: New' }] } });
		expect(validateContentLineage(input(initial, current, [value])).checks.transformation.status).toBe('FAIL');
	});

	it('invalidates the old Critic PASS for a content change without re-review', () => {
		const initial = '---\ntitle: Example\n---\nClaim A.\n';
		const current = '---\ntitle: Example\n---\nClaim B.\n';
		const value = record({ previous: initial, current, changeType: 'CONTENT_CHANGE', reviewImpact: 'REVIEW_INVALIDATED',
			transformation: { kind: 'body-replacements', replacements: [{ from: 'Claim A.', to: 'Claim B.' }], meaningUnchanged: false } });
		const result = validateContentLineage(input(initial, current, [value]));
		expect(result.checks.reviewValidity.status).toBe('FAIL');
		expect(result.effectiveReview).toBe('INVALIDATED');
		expect(result.overall).toBe('FAIL');
	});

	it('rejects a record bound to another candidate', () => {
		const article = '---\ntitle: Example\n---\nBody.\n';
		const value = structuredClone(record({ previous: article, current: article, changeType: 'PRESENTATION_ONLY',
			transformation: { kind: 'presentation-normalization', mode: 'normalize-lf' } }));
		value.sourceCandidateHash = '0'.repeat(64);
		expect(validateContentLineage(input(article, article, [value])).checks.candidateBinding.status).toBe('FAIL');
	});

	it('rejects current CONTENT that is not the chain end', () => {
		const initial = '---\ntitle: Example\n---\nBody.\n';
		const recorded = initial.replace('Body.', 'Body!');
		const actual = initial.replace('Body.', 'Different.');
		const value = record({ previous: initial, current: recorded, changeType: 'TYPO_FIX',
			transformation: { kind: 'body-replacements', replacements: [{ from: 'Body.', to: 'Body!' }], meaningUnchanged: true } });
		expect(validateContentLineage(input(initial, actual, [value])).checks.currentHash.status).toBe('FAIL');
	});

	it('detects a tampered intermediate even when adjacent hash fields are made consistent', () => {
		const initial = '---\ntitle: Example\n---\nRemove one.\nRemove two.\nBody.\n';
		const middle = initial.replace('Remove one.\n', '');
		const current = middle.replace('Remove two.\n', '');
		const first = structuredClone(record({ previous: initial, current: middle, changeType: 'TECHNICAL_CLEANUP',
			transformation: { kind: 'remove-body-exact', removals: ['Remove one.\n'] } }));
		const second = structuredClone(record({ previous: middle, current, changeType: 'TECHNICAL_CLEANUP',
			transformation: { kind: 'remove-body-exact', removals: ['Remove two.\n'] } }));
		first.newContentHash = hashBytes('tampered intermediate');
		second.previousContentHash = first.newContentHash;
		const result = validateContentLineage(input(initial, current, [first, second]));
		expect(result.checks.hashChain.status).toBe('PASS');
		expect(result.checks.transformation.status).toBe('FAIL');
		expect(result.overall).toBe('FAIL');
	});

	it('reconstructs and validates the real PHP Arrays post-promotion chain', async () => {
		const [candidateArticle, candidateRecord, decisionRecord, auditRecord, current, lineageText, plan009, plan010, readerCopyAuthorization] = await Promise.all([
			readFile(new URL('../../lab/candidates/php-arrays/article.md', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/candidates/php-arrays/article.json', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/decisions/php-arrays-publication.json', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/reports/tablice-w-php-promotion.json', import.meta.url), 'utf8'),
			readFile(new URL('../../content/articles/tablice-w-php.md', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/reports/tablice-w-php-content-lineage.json', import.meta.url), 'utf8'),
			readFile(new URL('../../docs/plans/completed/009-reading-time-and-website-utilities.md', import.meta.url), 'utf8'),
			readFile(new URL('../../docs/plans/completed/010-pagefind-search-public-checkpoint.md', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/decisions/public-article-reader-copy-cleanup.json', import.meta.url), 'utf8'),
		]);
		const decision = JSON.parse(decisionRecord) as { metadata: unknown };
		const audit = JSON.parse(auditRecord) as { contentHash: string };
		const bundle = ContentLineageBundleSchema.parse(JSON.parse(lineageText));
		const initial = renderPromotedArticle(decision.metadata, candidateArticle);
		expect(hashBytes(initial)).toBe(audit.contentHash);
		expect(hashBytes(candidateRecord)).toBe(bundle.sourceCandidateHash);
		expect(hashBytes(current)).toBe(bundle.currentContentHash);
		const result = validateContentLineage({
			articleId: bundle.articleId,
			initialContent: initial,
			currentContent: current,
			promotedContentHash: bundle.promotedContentHash,
			expectedCandidateHash: bundle.sourceCandidateHash,
			expectedPromotionAuditRef: bundle.promotionAuditRef,
			records: bundle.records,
			evidence: {
				'docs/plans/completed/009-reading-time-and-website-utilities.md': plan009,
				'docs/plans/completed/010-pagefind-search-public-checkpoint.md': plan010,
				'lab/decisions/public-article-reader-copy-cleanup.json': readerCopyAuthorization,
			},
		});
		expect(result.overall).toBe('PASS');
		expect(result.effectiveReview).toBe('VALID');
		expect(bundle.records.map(item => item.changeType)).toEqual(['METADATA_ONLY', 'TECHNICAL_CLEANUP', 'TYPO_FIX']);
	});
});
