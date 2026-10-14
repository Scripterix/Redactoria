import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { stableJson } from '../engine/core/serialization.ts';
import { renderApprovedPublicationContent } from '../engine/promotion/gate.ts';
import {
	ContentLineageBundleSchema,
	ContentLineageRecordSchema,
} from '../engine/validation/content-lineage-contract.ts';
import {
	applyContentLineageTransformation,
	validateContentLineage,
} from '../engine/validation/content-lineage.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const articleId = 'tablice-w-php';
const candidateRef = 'lab/candidates/php-arrays/article.json';
const candidateArticleRef = 'lab/candidates/php-arrays/article.md';
const publicationDecisionRef = 'lab/decisions/php-arrays-publication.json';
const authorizationRef = 'lab/decisions/php-arrays-beginner-clarity-pass-2.json';
const replacementReviewRef = 'lab/reviews/php-arrays/clarity-pass-2-review.json';
const promotionAuditRef = 'lab/reports/tablice-w-php-promotion.json';
const lineageRef = 'lab/reports/tablice-w-php-content-lineage.json';
const currentContentRef = 'content/articles/tablice-w-php.md';

function splitArticle(content: string) {
	const match = /^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/.exec(content);
	if (!match) throw new Error('Article frontmatter boundary is invalid.');
	return { prefix: match[1]! + match[2]! + match[3]!, body: match[4]! };
}

const [
	candidateText,
	candidateArticle,
	publicationDecisionText,
	authorizationText,
	replacementReviewText,
	promotionAuditText,
	lineageText,
	currentContent,
] = await Promise.all([
	readFile(resolve(project, candidateRef), 'utf8'),
	readFile(resolve(project, candidateArticleRef), 'utf8'),
	readFile(resolve(project, publicationDecisionRef), 'utf8'),
	readFile(resolve(project, authorizationRef), 'utf8'),
	readFile(resolve(project, replacementReviewRef), 'utf8'),
	readFile(resolve(project, promotionAuditRef), 'utf8'),
	readFile(resolve(project, lineageRef), 'utf8'),
	readFile(resolve(project, currentContentRef), 'utf8'),
]);

const publicationDecision = JSON.parse(publicationDecisionText);
const audit = JSON.parse(promotionAuditText) as { contentHash: string };
const review = JSON.parse(replacementReviewText) as { reviewedContentHash?: string; verdict?: string };
const previousBundle = ContentLineageBundleSchema.parse(JSON.parse(lineageText));
const sourceCandidateHash = hashBytes(candidateText);
const currentContentHash = hashBytes(currentContent);
if (sourceCandidateHash !== previousBundle.sourceCandidateHash) throw new Error('Candidate binding changed.');
if (review.verdict !== 'PASS' || review.reviewedContentHash !== currentContentHash) {
	throw new Error('Replacement review is not PASS or is not bound to current CONTENT.');
}

const initialContent = renderApprovedPublicationContent(publicationDecision, candidateArticle).content;
if (hashBytes(initialContent) !== audit.contentHash || audit.contentHash !== previousBundle.promotedContentHash) {
	throw new Error('Promotion origin does not match the immutable audit.');
}

const priorRecords = previousBundle.records.filter(record => record.authorizationRef !== authorizationRef);
let previousContent = initialContent;
for (const record of priorRecords) {
	const next = applyContentLineageTransformation(previousContent, record.transformation);
	if (next === null || hashBytes(next) !== record.newContentHash) throw new Error('Existing lineage cannot replay.');
	previousContent = next;
}
if (hashBytes(previousContent) !== previousBundle.records.filter(record => record.authorizationRef !== authorizationRef).at(-1)?.newContentHash) {
	throw new Error('Existing lineage end hash does not match its final prior record.');
}

const previousArticle = splitArticle(previousContent);
const currentArticle = splitArticle(currentContent);
if (previousArticle.prefix !== currentArticle.prefix) {
	throw new Error('This CONTENT_CHANGE is body-only; frontmatter changed unexpectedly.');
}
const transformation = {
	kind: 'body-replacements' as const,
	replacements: [{ from: previousArticle.body, to: currentArticle.body }],
	meaningUnchanged: false,
};
const transformed = applyContentLineageTransformation(previousContent, transformation);
if (transformed !== currentContent) throw new Error('Declared body replacement does not reproduce current CONTENT.');

const record = ContentLineageRecordSchema.parse({
	schemaVersion: 1,
	recordType: 'CONTENT_LINEAGE_RECORD',
	articleId,
	previousContentHash: hashBytes(previousContent),
	newContentHash: currentContentHash,
	changeType: 'CONTENT_CHANGE',
	reason: 'Reorder and rewrite the PHP arrays lesson for beginner clarity, explicit key/value modeling and visible before/after state while preserving the approved technical scope.',
	authorizedBy: 'human',
	authorizationRef,
	authorizationHash: hashBytes(authorizationText),
	timestamp: '2026-10-14T11:09:39Z',
	sourceCandidateHash,
	promotionAuditRef,
	reviewImpact: 'REVIEW_INVALIDATED',
	replacementReview: {
		ref: replacementReviewRef,
		sha256: hashBytes(replacementReviewText),
		reviewedContentHash: currentContentHash,
		verdict: 'PASS',
	},
	transformation,
	backfilled: false,
	notes: [
		'The preceding Critic review is invalidated by the substantive rewrite and replaced by a fresh hash-bound PASS review.',
		'All 23 fenced examples were executed independently on PHP 8.4.26 and PHP 8.5.11; 46/46 exact stdout checks passed.',
		'The immutable candidate, original draft, original Critic reviews and preceding lineage records remain unchanged.',
	],
});
const records = [...priorRecords, record];
const bundle = ContentLineageBundleSchema.parse({
	...previousBundle,
	currentContentHash,
	records,
	notes: [
		...previousBundle.notes.filter(note => !note.startsWith('Beginner clarity pass 2 is recorded')),
		'Beginner clarity pass 2 is recorded as a substantive CONTENT_CHANGE with fresh runtime evidence and replacement Critic PASS.',
	],
});

const evidence: Record<string, string> = {
	[authorizationRef]: authorizationText,
	[replacementReviewRef]: replacementReviewText,
};
for (const existing of records) {
	if (!(existing.authorizationRef in evidence)) {
		evidence[existing.authorizationRef] = await readFile(resolve(project, existing.authorizationRef), 'utf8');
	}
	if (existing.replacementReview && !(existing.replacementReview.ref in evidence)) {
		evidence[existing.replacementReview.ref] = await readFile(resolve(project, existing.replacementReview.ref), 'utf8');
	}
}
const validation = validateContentLineage({
	articleId,
	initialContent,
	currentContent,
	promotedContentHash: audit.contentHash,
	expectedCandidateHash: sourceCandidateHash,
	expectedPromotionAuditRef: promotionAuditRef,
	records,
	evidence,
});
if (validation.overall !== 'PASS') throw new Error(`Generated lineage failed validation: ${stableJson(validation)}`);

await writeFile(resolve(project, lineageRef), stableJson(bundle), 'utf8');
console.log(`Recorded ${record.changeType} lineage: ${validation.overall}; effective review ${validation.effectiveReview}.`);
