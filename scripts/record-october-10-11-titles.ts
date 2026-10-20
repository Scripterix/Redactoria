import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { stableJson } from '../engine/core/serialization.ts';
import { renderApprovedPublicationContent } from '../engine/promotion/gate.ts';
import {
	ContentLineageBundleSchema,
	ContentLineageRecordSchema,
	type ContentLineageRecord,
} from '../engine/validation/content-lineage-contract.ts';
import {
	applyContentLineageTransformation,
	validateContentLineage,
} from '../engine/validation/content-lineage.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const authorizationRef = 'lab/decisions/october-10-11-colon-free-titles.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const timestamp = '2026-10-19T11:08:00Z';

const articles = [
	{
		topic: 'javascript-dom', slug: 'dom-w-javascript', oldDate: '2026-10-11',
		oldTitle: 'DOM w JavaScript: selektory, bezpieczny tekst i zdarzenia',
		newTitle: 'DOM w JavaScript z selektorami, bezpiecznym tekstem i zdarzeniami',
	},
	{
		topic: 'javascript-arrays', slug: 'tablice-w-javascript', oldDate: '2026-10-11',
		oldTitle: 'Tablice JavaScript: map, filter, reduce i sort bez mutowania danych',
		newTitle: 'Tablice JavaScript z metodami map, filter i reduce oraz sortowaniem bez mutacji',
	},
	{
		topic: 'javascript-if-else', slug: 'warunki-w-javascript', oldDate: '2026-10-11',
		oldTitle: 'Warunki w JavaScript: if, else i bezpieczna walidacja liczby',
		newTitle: 'Warunki w JavaScript z if, else i bezpieczną walidacją liczb',
	},
	{
		topic: 'php-control-flow', slug: 'instrukcje-sterujace-php', oldDate: '2026-10-10',
		oldTitle: 'Instrukcje sterujące PHP: warunki i pętle',
		newTitle: 'Instrukcje sterujące w PHP z warunkami i pętlami',
	},
] as const;

for (const article of articles) {
	const candidateRef = `lab/candidates/${article.topic}/article.json`;
	const candidateArticleRef = `lab/candidates/${article.topic}/article.md`;
	const decisionRef = `lab/decisions/${article.topic}-publication.json`;
	const promotionAuditRef = `lab/reports/${article.slug}-promotion.json`;
	const lineageRef = `lab/reports/${article.slug}-content-lineage.json`;
	const currentContentRef = `content/articles/${article.slug}.md`;
	const [candidateText, candidateArticle, decisionText, auditText, lineageText, currentContent] = await Promise.all([
		readFile(resolve(project, candidateRef), 'utf8'),
		readFile(resolve(project, candidateArticleRef), 'utf8'),
		readFile(resolve(project, decisionRef), 'utf8'),
		readFile(resolve(project, promotionAuditRef), 'utf8'),
		readFile(resolve(project, lineageRef), 'utf8'),
		readFile(resolve(project, currentContentRef), 'utf8'),
	]);
	const decision = JSON.parse(decisionText);
	const audit = JSON.parse(auditText) as { contentHash: string };
	const previousBundle = ContentLineageBundleSchema.parse(JSON.parse(lineageText));
	const initialContent = renderApprovedPublicationContent(decision, candidateArticle).content;
	if (hashBytes(initialContent) !== audit.contentHash) throw new Error(`${article.slug}: promotion content hash mismatch.`);
	const sourceCandidateHash = hashBytes(candidateText);
	if (previousBundle.sourceCandidateHash !== sourceCandidateHash) throw new Error(`${article.slug}: candidate hash mismatch.`);

	const records: ContentLineageRecord[] = previousBundle.records
		.filter(record => record.authorizationRef !== authorizationRef);
	let previousContent = initialContent;
	for (const record of records) {
		const next = applyContentLineageTransformation(previousContent, record.transformation);
		if (next === null || hashBytes(next) !== record.newContentHash) throw new Error(`${article.slug}: existing lineage cannot replay.`);
		previousContent = next;
	}

	const metadataTransformation = {
		kind: 'metadata-replacements' as const,
		replacements: [
			{ from: `title: "${article.oldTitle}"`, to: `title: "${article.newTitle}"` },
			{ from: `updated: ${article.oldDate}T00:00:00.000Z`, to: 'updated: 2026-10-19T00:00:00.000Z' },
		],
	};
	const afterMetadata = applyContentLineageTransformation(previousContent, metadataTransformation);
	if (afterMetadata === null) throw new Error(`${article.slug}: colon-free title metadata transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterMetadata),
		changeType: 'METADATA_ONLY',
		reason: 'Replace a colon-separated title with one natural grammatical phrase.',
		authorizedBy: 'human',
		authorizationRef,
		authorizationHash,
		timestamp,
		sourceCandidateHash,
		promotionAuditRef,
		reviewImpact: 'REVIEW_STILL_VALID',
		replacementReview: null,
		transformation: metadataTransformation,
		backfilled: false,
		notes: ['Only the front-matter title and updated date changed in this record.'],
	}));
	previousContent = afterMetadata;

	const headingTransformation = {
		kind: 'body-replacements' as const,
		replacements: [{ from: `# ${article.oldTitle}`, to: `# ${article.newTitle}` }],
		meaningUnchanged: true,
	};
	const afterHeading = applyContentLineageTransformation(previousContent, headingTransformation);
	if (afterHeading === null) throw new Error(`${article.slug}: colon-free heading transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterHeading),
		changeType: 'TYPO_FIX',
		reason: 'Keep the visible Markdown heading consistent with the colon-free metadata title.',
		authorizedBy: 'human',
		authorizationRef,
		authorizationHash,
		timestamp,
		sourceCandidateHash,
		promotionAuditRef,
		reviewImpact: 'REVIEW_STILL_VALID',
		replacementReview: null,
		transformation: headingTransformation,
		backfilled: false,
		notes: ['Only the Markdown H1 changed; technical prose and code are byte-identical.'],
	}));
	if (afterHeading !== currentContent) throw new Error(`${article.slug}: declared colon-free title does not reproduce current CONTENT.`);

	const bundle = ContentLineageBundleSchema.parse({
		...previousBundle,
		status: 'RECORDED',
		currentContentHash: hashBytes(currentContent),
		records,
		notes: [
			...previousBundle.notes.filter(note => !note.startsWith('The colon-free title change')),
			'The colon-free title change is append-only, hash-bound to explicit authorization and preserves the technical review.',
		],
	});
	const evidence: Record<string, string> = { [authorizationRef]: authorizationText };
	for (const record of records) {
		if (!(record.authorizationRef in evidence)) evidence[record.authorizationRef] = await readFile(resolve(project, record.authorizationRef), 'utf8');
		if (record.replacementReview && !(record.replacementReview.ref in evidence)) {
			evidence[record.replacementReview.ref] = await readFile(resolve(project, record.replacementReview.ref), 'utf8');
		}
	}
	const validation = validateContentLineage({
		articleId: article.slug,
		initialContent,
		currentContent,
		promotedContentHash: audit.contentHash,
		expectedCandidateHash: sourceCandidateHash,
		expectedPromotionAuditRef: promotionAuditRef,
		records,
		evidence,
	});
	if (validation.overall !== 'PASS') throw new Error(`${article.slug}: generated lineage failed validation.`);
	await writeFile(resolve(project, lineageRef), stableJson(bundle), 'utf8');
}

console.log('Recorded colon-free titles for the four 10/11 October articles.');
