import { hashBytes } from '../core/editorial-context.ts';
import {
	ContentLineageRecordSchema,
	ContentLineageValidationResultSchema,
	type ContentLineageRecord,
	type ContentLineageTransformation,
	type ContentLineageValidationResult,
} from './content-lineage-contract.ts';

export type ContentLineageValidationInput = {
	articleId: string;
	initialContent: string;
	currentContent: string;
	promotedContentHash: string;
	expectedCandidateHash: string;
	expectedPromotionAuditRef: string;
	records: unknown[];
	evidence: Record<string, string | undefined>;
};

type Check = { status: 'PASS' | 'FAIL'; detail: string };

function check(condition: boolean, pass: string, fail: string): Check {
	return { status: condition ? 'PASS' : 'FAIL', detail: condition ? pass : fail };
}

function splitArticle(content: string): { opening: string; metadata: string; separator: string; body: string } | null {
	const match = /^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/.exec(content);
	return match ? { opening: match[1]!, metadata: match[2]!, separator: match[3]!, body: match[4]! } : null;
}

function replaceExactlyOnce(value: string, replacements: { from: string; to: string }[]): string | null {
	let result = value;
	for (const replacement of replacements) {
		if (result.split(replacement.from).length !== 2) return null;
		result = result.replace(replacement.from, replacement.to);
	}
	return result;
}

function removeExactlyOnce(value: string, removals: string[]): string | null {
	return replaceExactlyOnce(value, removals.map(from => ({ from, to: '' })));
}

function isLink(value: string): boolean {
	return /^(?:https?:\/\/|\/|#)/.test(value);
}

/** Replays one declared operation. A classification is valid only when replay yields the recorded bytes. */
export function applyContentLineageTransformation(previous: string, transformation: ContentLineageTransformation): string | null {
	if (transformation.kind === 'presentation-normalization') {
		if (transformation.mode === 'normalize-lf') return previous.replace(/\r\n/g, '\n');
		return previous.split(/\r?\n/).map(line => line.replace(/[ \t]+$/g, '')).join(previous.includes('\r\n') ? '\r\n' : '\n');
	}
	const article = splitArticle(previous);
	if (!article) return null;
	if (transformation.kind === 'metadata-replacements') {
		const metadata = replaceExactlyOnce(article.metadata, transformation.replacements);
		return metadata === null ? null : article.opening + metadata + article.separator + article.body;
	}
	if (transformation.kind === 'remove-body-exact') {
		const body = removeExactlyOnce(article.body, transformation.removals);
		return body === null ? null : article.opening + article.metadata + article.separator + body;
	}
	if (transformation.kind === 'link-replacements') {
		if (transformation.replacements.some(item => !isLink(item.from) || !isLink(item.to))) return null;
		const body = replaceExactlyOnce(article.body, transformation.replacements);
		return body === null ? null : article.opening + article.metadata + article.separator + body;
	}
	if (transformation.kind === 'navigation-insertions') {
		const body = replaceExactlyOnce(article.body, transformation.insertions.map(item => ({
			from: item.after,
			to: item.after + item.content,
		})));
		return body === null ? null : article.opening + article.metadata + article.separator + body;
	}
	const body = replaceExactlyOnce(article.body, transformation.replacements);
	return body === null ? null : article.opening + article.metadata + article.separator + body;
}

function replacementReviewValid(record: ContentLineageRecord, contentHash: string, evidence: Record<string, string | undefined>): boolean {
	const review = record.replacementReview;
	return review !== null && review.reviewedContentHash === contentHash
		&& evidence[review.ref] !== undefined && hashBytes(evidence[review.ref]!) === review.sha256;
}

/** Pure, read-only validation. It never repairs records or CONTENT. */
export function validateContentLineage(input: ContentLineageValidationInput): ContentLineageValidationResult {
	const parsed = input.records.map(record => ContentLineageRecordSchema.safeParse(record));
	const records = parsed.flatMap(result => result.success ? [result.data] : []);
	const schemaValid = records.length === input.records.length;
	const originValid = hashBytes(input.initialContent) === input.promotedContentHash;
	const candidateValid = schemaValid && records.every(record => record.articleId === input.articleId
		&& record.sourceCandidateHash === input.expectedCandidateHash);
	const auditValid = schemaValid && records.every(record => record.promotionAuditRef === input.expectedPromotionAuditRef);
	const authorizationValid = schemaValid && records.every(record => input.evidence[record.authorizationRef] !== undefined
		&& hashBytes(input.evidence[record.authorizationRef]!) === record.authorizationHash);

	let content = input.initialContent;
	let declaredChainHash = input.promotedContentHash;
	let chainValid = schemaValid;
	let transformationValid = schemaValid;
	let reviewValid = true;
	for (const record of records) {
		if (record.previousContentHash !== declaredChainHash) chainValid = false;
		declaredChainHash = record.newContentHash;
		const transformed = applyContentLineageTransformation(content, record.transformation);
		if (transformed === null || hashBytes(transformed) !== record.newContentHash) {
			transformationValid = false;
			continue;
		}
		content = transformed;
		if (record.reviewImpact !== 'REVIEW_STILL_VALID') reviewValid = replacementReviewValid(record, record.newContentHash, input.evidence);
	}
	const currentValid = hashBytes(input.currentContent) === declaredChainHash && content === input.currentContent;
	const checks = {
		recordSchema: check(schemaValid, 'Every lineage record matches the closed contract.', 'A lineage record is missing, malformed or uses an unknown enum value.'),
		originHash: check(originValid, 'Initial bytes match the promotion content hash.', 'Initial bytes do not match the promotion content hash.'),
		candidateBinding: check(candidateValid, 'Every record is bound to the expected article and candidate.', 'A record is bound to another article or candidate.'),
		promotionAuditBinding: check(auditValid, 'Every record is bound to the expected promotion audit.', 'A record is bound to another promotion audit.'),
		authorization: check(authorizationValid, 'Every change has hash-bound human authorization evidence.', 'Human authorization evidence is missing or does not match its hash.'),
		hashChain: check(chainValid, 'Previous/new hashes form one ordered chain.', 'The previous/new hash chain is broken.'),
		transformation: check(transformationValid, 'Every declared transformation replays to its new hash.', 'A declared transformation cannot reproduce its new hash.'),
		currentHash: check(currentValid, 'Current CONTENT is the exact end of the replayed chain.', 'Current CONTENT is not the exact end of the replayed chain.'),
		reviewValidity: check(reviewValid, 'The effective Critic review remains valid.', 'The preceding Critic review is invalidated or requires an unproven recheck.'),
	};
	const overall = Object.values(checks).some(item => item.status === 'FAIL') ? 'FAIL' : 'PASS';
	return ContentLineageValidationResultSchema.parse({
		schemaVersion: 1,
		articleId: input.articleId,
		checks,
		effectiveReview: reviewValid ? 'VALID' : 'INVALIDATED',
		overall,
	});
}
