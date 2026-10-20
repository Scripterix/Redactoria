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
const authorizationRef = 'lab/decisions/human-selected-article-titles.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const timestamp = '2026-10-19T10:58:00Z';

const articles = [
	{
		topic: 'javascript-functions-callbacks', slug: 'funkcje-javascript',
		oldTitle: 'Funkcje w JavaScript dla początkujących',
		newTitle: 'Jak działają funkcje w JavaScript',
	},
	{
		topic: 'python-fundamentals', slug: 'podstawy-pythona',
		oldTitle: 'Podstawy Pythona dla początkujących',
		newTitle: 'Python od podstaw',
	},
	{
		topic: 'api-http-json', slug: 'api-http-json',
		oldTitle: 'API, HTTP i JSON dla początkujących',
		newTitle: 'Jak pobierać dane z API przez fetch',
	},
	{
		topic: 'javascript-calculator', slug: 'kalkulator-w-javascript',
		oldTitle: 'Kalkulator w JavaScript krok po kroku',
		newTitle: 'Jak napisać prosty kalkulator w JavaScript',
	},
	{
		topic: 'markdown', slug: 'markdown-podstawy',
		oldTitle: 'Markdown dla początkujących',
		newTitle: 'Składnia Markdown na prostych przykładach',
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
		replacements: [{ from: `title: "${article.oldTitle}"`, to: `title: "${article.newTitle}"` }],
	};
	const afterMetadata = applyContentLineageTransformation(previousContent, metadataTransformation);
	if (afterMetadata === null) throw new Error(`${article.slug}: selected title metadata transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterMetadata),
		changeType: 'METADATA_ONLY',
		reason: 'Apply the exact reader-facing title selected by the human in the title review.',
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
		notes: ['Only the front-matter title changed in this record.'],
	}));
	previousContent = afterMetadata;

	const headingTransformation = {
		kind: 'body-replacements' as const,
		replacements: [{ from: `# ${article.oldTitle}`, to: `# ${article.newTitle}` }],
		meaningUnchanged: true,
	};
	const afterHeading = applyContentLineageTransformation(previousContent, headingTransformation);
	if (afterHeading === null) throw new Error(`${article.slug}: selected title heading transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterHeading),
		changeType: 'TYPO_FIX',
		reason: 'Keep the visible Markdown heading consistent with the human-selected metadata title.',
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
	if (afterHeading !== currentContent) throw new Error(`${article.slug}: declared selected title does not reproduce current CONTENT.`);

	const bundle = ContentLineageBundleSchema.parse({
		...previousBundle,
		status: 'RECORDED',
		currentContentHash: hashBytes(currentContent),
		records,
		notes: [
			...previousBundle.notes.filter(note => !note.startsWith('The human-selected title change')),
			'The human-selected title change is append-only, hash-bound to explicit authorization and preserves the technical review.',
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

console.log('Recorded the five human-selected article titles.');
