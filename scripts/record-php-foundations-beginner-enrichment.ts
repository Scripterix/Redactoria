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
const articleId = 'podstawy-php';
const candidateRef = 'lab/candidates/php-language-foundation/article.json';
const candidateArticleRef = 'lab/candidates/php-language-foundation/article.md';
const publicationDecisionRef = 'lab/decisions/php-language-foundation-publication.json';
const authorizationRef = 'lab/decisions/php-foundations-beginner-enrichment.json';
const replacementReviewRef = 'lab/reviews/php-language-foundation/beginner-setup-enrichment-review.json';
const runtimeEvidenceRef = 'lab/research/php-language-foundation/beginner-setup-enrichment-runtime.json';
const teachingPlanRef = 'lab/reports/podstawy-php-beginner-teaching-plan.md';
const promotionAuditRef = 'lab/reports/podstawy-php-promotion.json';
const lineageRef = 'lab/reports/podstawy-php-content-lineage.json';
const currentContentRef = 'content/articles/podstawy-php.md';
const timestamp = '2026-10-19T22:15:00Z';

function splitArticle(content: string) {
	const match = /^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/.exec(content);
	if (!match) throw new Error('Article frontmatter boundary is invalid.');
	return {
		opening: match[1]!,
		metadata: match[2]!,
		separator: match[3]!,
		body: match[4]!,
	};
}

const [
	candidateText,
	candidateArticle,
	publicationDecisionText,
	authorizationText,
	replacementReviewText,
	runtimeEvidenceText,
	teachingPlanText,
	promotionAuditText,
	lineageText,
	currentContent,
] = await Promise.all([
	readFile(resolve(project, candidateRef), 'utf8'),
	readFile(resolve(project, candidateArticleRef), 'utf8'),
	readFile(resolve(project, publicationDecisionRef), 'utf8'),
	readFile(resolve(project, authorizationRef), 'utf8'),
	readFile(resolve(project, replacementReviewRef), 'utf8'),
	readFile(resolve(project, runtimeEvidenceRef), 'utf8'),
	readFile(resolve(project, teachingPlanRef), 'utf8'),
	readFile(resolve(project, promotionAuditRef), 'utf8'),
	readFile(resolve(project, lineageRef), 'utf8'),
	readFile(resolve(project, currentContentRef), 'utf8'),
]);

const publicationDecision = JSON.parse(publicationDecisionText);
const audit = JSON.parse(promotionAuditText) as { contentHash: string };
const review = JSON.parse(replacementReviewText) as {
	reviewedContentHash?: string;
	verdict?: string;
	runtimeEvidence?: { sha256?: string };
	teachingPlan?: { sha256?: string };
};
const runtimeEvidence = JSON.parse(runtimeEvidenceText) as { status?: string };
const previousBundle = ContentLineageBundleSchema.parse(JSON.parse(lineageText));
const sourceCandidateHash = hashBytes(candidateText);
const currentContentHash = hashBytes(currentContent);

if (sourceCandidateHash !== previousBundle.sourceCandidateHash) throw new Error('Candidate binding changed.');
if (runtimeEvidence.status !== 'PASS') throw new Error('Runtime evidence is not PASS.');
if (review.verdict !== 'PASS' || review.reviewedContentHash !== currentContentHash) {
	throw new Error('Replacement review is not PASS or is not bound to current CONTENT.');
}
if (review.runtimeEvidence?.sha256 !== hashBytes(runtimeEvidenceText)) {
	throw new Error('Replacement review runtime-evidence binding is invalid.');
}
if (review.teachingPlan?.sha256 !== hashBytes(teachingPlanText)) {
	throw new Error('Replacement review Teaching Plan binding is invalid.');
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
const expectedPreviousHash = priorRecords.at(-1)?.newContentHash ?? previousBundle.promotedContentHash;
if (hashBytes(previousContent) !== expectedPreviousHash) throw new Error('Existing lineage end hash is inconsistent.');

const previousArticle = splitArticle(previousContent);
const currentArticle = splitArticle(currentContent);
const bodyTransformation = {
	kind: 'body-replacements' as const,
	replacements: [{ from: previousArticle.body, to: currentArticle.body }],
	meaningUnchanged: false,
};
const afterBody = applyContentLineageTransformation(previousContent, bodyTransformation);
if (afterBody === null) throw new Error('Body transformation cannot be applied.');

const oldDescription = 'description: "Pierwszy skrypt PHP w terminalu: echo, wartości, zmienne, podstawowe typy scalar i prosty operator arytmetyczny."';
const newDescription = 'description: "Jak przygotować PHP i VS Code, utworzyć pierwszy plik, uruchamiać i poprawiać kod oraz poznać echo, zmienne, typy i proste obliczenia."';
const oldSourcesStart = 'sources:\n  - title: "PHP Manual — Basics: Variables"';
const newSourcesStart = `sources:
  - title: "PHP Manual — General Installation Considerations"
    url: https://www.php.net/manual/en/install.general.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP Manual — Running PHP on the command line on Windows systems"
    url: https://www.php.net/install.windows.commandline.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP Manual — Command line usage"
    url: https://www.php.net/manual/en/features.commandline.usage.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP Manual — Basic syntax"
    url: https://www.php.net/manual/en/language.basic-syntax.php
    publisher: PHP Documentation
    accessed: 2026-10-19
  - title: "PHP in Visual Studio Code"
    url: https://code.visualstudio.com/docs/languages/php
    publisher: Visual Studio Code Documentation
    accessed: 2026-10-19
  - title: "PHP Manual — Basics: Variables"`;
const metadataTransformation = {
	kind: 'metadata-replacements' as const,
	replacements: [
		{ from: oldDescription, to: newDescription },
		{ from: oldSourcesStart, to: newSourcesStart },
	],
};
const afterMetadata = applyContentLineageTransformation(afterBody, metadataTransformation);
if (afterMetadata !== currentContent) {
	const limit = Math.min(afterMetadata?.length ?? 0, currentContent.length);
	let mismatch = 0;
	while (mismatch < limit && afterMetadata?.[mismatch] === currentContent[mismatch]) mismatch += 1;
	throw new Error(`Declared transformations do not reproduce current CONTENT at byte ${mismatch}: ${JSON.stringify({
		after: afterMetadata?.slice(Math.max(0, mismatch - 80), mismatch + 160),
		current: currentContent.slice(Math.max(0, mismatch - 80), mismatch + 160),
		afterLength: afterMetadata?.length,
		currentLength: currentContent.length,
	})}`);
}

const bodyRecord = ContentLineageRecordSchema.parse({
	schemaVersion: 1,
	recordType: 'CONTENT_LINEAGE_RECORD',
	articleId,
	previousContentHash: hashBytes(previousContent),
	newContentHash: hashBytes(afterBody),
	changeType: 'CONTENT_CHANGE',
	reason: 'Expand the PHP foundation lesson from three terse examples into a beginner-first setup, edit-run-observe, error-recovery and independent-practice sequence.',
	authorizedBy: 'human',
	authorizationRef,
	authorizationHash: hashBytes(authorizationText),
	timestamp,
	sourceCandidateHash,
	promotionAuditRef,
	reviewImpact: 'REVIEW_INVALIDATED',
	replacementReview: null,
	transformation: bodyTransformation,
	backfilled: false,
	notes: [
		'The substantive body expansion invalidates the preceding effective review.',
		'The next metadata record binds a fresh replacement PASS review to the complete final CONTENT bytes.',
		'The immutable candidate, original draft, earlier reviews, promotion audit and preceding lineage records remain unchanged.',
	],
});

const metadataRecord = ContentLineageRecordSchema.parse({
	schemaVersion: 1,
	recordType: 'CONTENT_LINEAGE_RECORD',
	articleId,
	previousContentHash: hashBytes(afterBody),
	newContentHash: currentContentHash,
	changeType: 'METADATA_ONLY',
	reason: 'Update the article description and add official PHP and VS Code sources that support the newly authorized setup guidance.',
	authorizedBy: 'human',
	authorizationRef,
	authorizationHash: hashBytes(authorizationText),
	timestamp,
	sourceCandidateHash,
	promotionAuditRef,
	reviewImpact: 'REVIEW_RECHECK_REQUIRED',
	replacementReview: {
		ref: replacementReviewRef,
		sha256: hashBytes(replacementReviewText),
		reviewedContentHash: currentContentHash,
		verdict: 'PASS',
	},
	transformation: metadataTransformation,
	backfilled: false,
	notes: [
		'The description and source list changed together with the reviewed body enrichment.',
		'Seven complete examples and one intentional syntax error passed actual local PHP 8.2.4 CLI execution.',
		'The fresh review covers official-source alignment, pedagogical order, productive difficulty, code correctness and scope boundaries.',
	],
});

const records = [...priorRecords, bodyRecord, metadataRecord];
const bundle = ContentLineageBundleSchema.parse({
	...previousBundle,
	currentContentHash,
	records,
	notes: [
		...previousBundle.notes.filter(note => !note.startsWith('Beginner setup enrichment is recorded')),
		'Beginner setup enrichment is recorded as a substantive CONTENT_CHANGE followed by reviewed metadata evidence; the effective replacement review is VALID.',
	],
});

const evidence: Record<string, string> = {
	[authorizationRef]: authorizationText,
	[replacementReviewRef]: replacementReviewText,
};
for (const record of records) {
	if (!(record.authorizationRef in evidence)) {
		evidence[record.authorizationRef] = await readFile(resolve(project, record.authorizationRef), 'utf8');
	}
	if (record.replacementReview && !(record.replacementReview.ref in evidence)) {
		evidence[record.replacementReview.ref] = await readFile(resolve(project, record.replacementReview.ref), 'utf8');
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
if (validation.overall !== 'PASS') {
	throw new Error(`Generated lineage failed validation: ${stableJson(validation)}`);
}

await writeFile(resolve(project, lineageRef), stableJson(bundle), 'utf8');
console.log(`Recorded PHP beginner enrichment: ${validation.overall}; effective review ${validation.effectiveReview}.`);
