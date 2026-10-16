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
const authorizationRef = 'lab/decisions/next-featured-images.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const timestamp = '2026-10-16T10:50:28Z';

const articles = [
	{
		articleId: 'markdown-podstawy',
		candidateRef: 'lab/candidates/markdown/article.json',
		candidateArticleRef: 'lab/candidates/markdown/article.md',
		publicationDecisionRef: 'lab/decisions/markdown-publication.json',
		slug: 'markdown-podstawy',
		featuredImage: '../../src/assets/markdown-podstawy.webp',
		featuredAlt: 'Dziewczyna przekłada karty składni Markdown w gotową, wyrenderowaną stronę.',
	},
	{
		articleId: 'kalkulator-w-javascript',
		candidateRef: 'lab/candidates/javascript-calculator/article.json',
		candidateArticleRef: 'lab/candidates/javascript-calculator/article.md',
		publicationDecisionRef: 'lab/decisions/javascript-calculator-publication.json',
		slug: 'kalkulator-w-javascript',
		featuredImage: '../../src/assets/kalkulator-w-javascript.webp',
		featuredAlt: 'Chłopak wkłada dane do maszyny, która sprawdza je i oblicza wynik.',
	},
	{
		articleId: 'api-http-json',
		candidateRef: 'lab/candidates/api-http-json/article.json',
		candidateArticleRef: 'lab/candidates/api-http-json/article.md',
		publicationDecisionRef: 'lab/decisions/api-http-json-publication.json',
		slug: 'api-http-json',
		featuredImage: '../../src/assets/api-http-json.webp',
		featuredAlt: 'Dziewczyna odbiera sprawdzoną paczkę danych przesłaną między serwerem a stroną.',
	},
] as const;

for (const article of articles) {
	const promotionAuditRef = `lab/reports/${article.slug}-promotion.json`;
	const lineageRef = `lab/reports/${article.slug}-content-lineage.json`;
	const currentContentRef = `content/articles/${article.slug}.md`;
	const [candidateText, candidateArticle, publicationDecisionText, auditText, lineageText, currentContent] = await Promise.all([
		readFile(resolve(project, article.candidateRef), 'utf8'),
		readFile(resolve(project, article.candidateArticleRef), 'utf8'),
		readFile(resolve(project, article.publicationDecisionRef), 'utf8'),
		readFile(resolve(project, promotionAuditRef), 'utf8'),
		readFile(resolve(project, lineageRef), 'utf8'),
		readFile(resolve(project, currentContentRef), 'utf8'),
	]);
	const publicationDecision = JSON.parse(publicationDecisionText);
	const audit = JSON.parse(auditText) as { contentHash: string };
	const previousBundle = ContentLineageBundleSchema.parse(JSON.parse(lineageText));
	const sourceCandidateHash = hashBytes(candidateText);
	const initialContent = renderApprovedPublicationContent(publicationDecision, candidateArticle).content;
	if (hashBytes(initialContent) !== audit.contentHash || audit.contentHash !== previousBundle.promotedContentHash) {
		throw new Error(`${article.slug}: immutable promotion origin mismatch.`);
	}
	if (sourceCandidateHash !== previousBundle.sourceCandidateHash) throw new Error(`${article.slug}: candidate binding mismatch.`);

	const records = previousBundle.records.filter(record => record.authorizationRef !== authorizationRef);
	let previousContent = initialContent;
	for (const record of records) {
		const next = applyContentLineageTransformation(previousContent, record.transformation);
		if (next === null || hashBytes(next) !== record.newContentHash) throw new Error(`${article.slug}: existing lineage cannot replay.`);
		previousContent = next;
	}
	const transformation = {
		kind: 'metadata-replacements' as const,
		replacements: [{
			from: `slug: ${article.slug}`,
			to: `slug: ${article.slug}\nfeaturedImage: ${article.featuredImage}\nfeaturedAlt: ${article.featuredAlt}`,
		}],
	};
	const transformed = applyContentLineageTransformation(previousContent, transformation);
	if (transformed !== currentContent) throw new Error(`${article.slug}: featured-image metadata transformation is not exact.`);
	const recordsWithImage = [
		...records,
		ContentLineageRecordSchema.parse({
			schemaVersion: 1,
			recordType: 'CONTENT_LINEAGE_RECORD',
			articleId: article.articleId,
			previousContentHash: hashBytes(previousContent),
			newContentHash: hashBytes(currentContent),
			changeType: 'METADATA_ONLY',
			reason: 'Assign the human-approved article-specific illustration and descriptive alternative text to the published article.',
			authorizedBy: 'human',
			authorizationRef,
			authorizationHash,
			timestamp,
			sourceCandidateHash,
			promotionAuditRef,
			reviewImpact: 'REVIEW_STILL_VALID',
			replacementReview: null,
			transformation,
			backfilled: false,
			notes: [
				'Only featuredImage and featuredAlt frontmatter fields changed; the reviewed article body is byte-identical.',
				'The same Astro-managed local source is rendered as the article hero and listing thumbnail.',
			],
		}),
	];
	const bundle = ContentLineageBundleSchema.parse({
		...previousBundle,
		currentContentHash: hashBytes(currentContent),
		records: recordsWithImage,
		notes: [
			...previousBundle.notes.filter(note => !note.startsWith('Article-specific Featured Image metadata is recorded')),
			'Article-specific Featured Image metadata is recorded append-only and preserves the effective technical review.',
		],
	});
	const evidence: Record<string, string> = { [authorizationRef]: authorizationText };
	for (const record of recordsWithImage) {
		if (!(record.authorizationRef in evidence)) {
			evidence[record.authorizationRef] = await readFile(resolve(project, record.authorizationRef), 'utf8');
		}
		if (record.replacementReview && !(record.replacementReview.ref in evidence)) {
			evidence[record.replacementReview.ref] = await readFile(resolve(project, record.replacementReview.ref), 'utf8');
		}
	}
	const validation = validateContentLineage({
		articleId: article.articleId,
		initialContent,
		currentContent,
		promotedContentHash: audit.contentHash,
		expectedCandidateHash: sourceCandidateHash,
		expectedPromotionAuditRef: promotionAuditRef,
		records: recordsWithImage,
		evidence,
	});
	if (validation.overall !== 'PASS') throw new Error(`${article.slug}: generated lineage failed validation: ${stableJson(validation)}`);
	await writeFile(resolve(project, lineageRef), stableJson(bundle), 'utf8');
	console.log(`${article.slug}: METADATA_ONLY lineage ${validation.overall}; effective review ${validation.effectiveReview}.`);
}
