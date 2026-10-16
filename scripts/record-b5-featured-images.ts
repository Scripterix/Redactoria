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
const authorizationRef = 'lab/decisions/b5-featured-images.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const timestamp = '2026-10-16T12:42:53Z';

const articles = [
	{
		topic: 'python-fundamentals',
		slug: 'podstawy-pythona',
		featuredImage: '../../src/assets/podstawy-pythona.webp',
		featuredAlt: 'Dziewczyna prowadzi kolorowego pytona przez stacje wartości, warunku, pętli i funkcji.',
	},
	{
		topic: 'git-local-basics',
		slug: 'git-lokalnie',
		featuredImage: '../../src/assets/git-lokalnie.webp',
		featuredAlt: 'Chłopak przenosi kartę pliku ze stołu roboczego przez staging do rozgałęzionej historii wersji.',
	},
	{
		topic: 'curl-http-basics',
		slug: 'curl-http',
		featuredImage: '../../src/assets/curl-http.webp',
		featuredAlt: 'Dziewczyna odbiera odpowiedź HTTP przesłaną zwiniętym przewodem między terminalem a lokalnym serwerem.',
	},
] as const;

for (const article of articles) {
	const candidateRef = `lab/candidates/${article.topic}/article.json`;
	const candidateArticleRef = `lab/candidates/${article.topic}/article.md`;
	const publicationDecisionRef = `lab/decisions/${article.topic}-publication.json`;
	const promotionAuditRef = `lab/reports/${article.slug}-promotion.json`;
	const lineageRef = `lab/reports/${article.slug}-content-lineage.json`;
	const currentContentRef = `content/articles/${article.slug}.md`;
	const [candidateText, candidateArticle, publicationDecisionText, auditText, currentContent] = await Promise.all([
		readFile(resolve(project, candidateRef), 'utf8'),
		readFile(resolve(project, candidateArticleRef), 'utf8'),
		readFile(resolve(project, publicationDecisionRef), 'utf8'),
		readFile(resolve(project, promotionAuditRef), 'utf8'),
		readFile(resolve(project, currentContentRef), 'utf8'),
	]);
	const publicationDecision = JSON.parse(publicationDecisionText);
	const audit = JSON.parse(auditText) as { contentHash: string };
	const sourceCandidateHash = hashBytes(candidateText);
	const initialContent = renderApprovedPublicationContent(publicationDecision, candidateArticle).content;
	if (hashBytes(initialContent) !== audit.contentHash) throw new Error(`${article.slug}: immutable promotion origin mismatch.`);

	let previousBundle: ReturnType<typeof ContentLineageBundleSchema.parse> | null = null;
	try {
		previousBundle = ContentLineageBundleSchema.parse(JSON.parse(await readFile(resolve(project, lineageRef), 'utf8')));
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
	}
	if (previousBundle && previousBundle.sourceCandidateHash !== sourceCandidateHash) {
		throw new Error(`${article.slug}: candidate binding mismatch.`);
	}
	const records: ContentLineageRecord[] = previousBundle
		? previousBundle.records.filter(record => record.authorizationRef !== authorizationRef)
		: [];
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
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
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
	}));

	const bundle = ContentLineageBundleSchema.parse({
		schemaVersion: 1,
		status: 'RECORDED',
		articleId: article.slug,
		candidateRef,
		sourceCandidateHash,
		promotionAuditRef,
		promotedContentHash: audit.contentHash,
		currentContentRef,
		currentContentHash: hashBytes(currentContent),
		records,
		notes: [
			...(previousBundle?.notes.filter(note => !note.startsWith('Article-specific Featured Image metadata is recorded'))
				?? ['The exact initial promotion remains reproducible from the immutable candidate and publication decision.']),
			'Article-specific Featured Image metadata is recorded append-only and preserves the effective technical review.',
		],
	});
	const evidence: Record<string, string> = { [authorizationRef]: authorizationText };
	for (const record of records) {
		if (!(record.authorizationRef in evidence)) {
			evidence[record.authorizationRef] = await readFile(resolve(project, record.authorizationRef), 'utf8');
		}
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
	if (validation.overall !== 'PASS') throw new Error(`${article.slug}: generated lineage failed validation: ${stableJson(validation)}`);
	await writeFile(resolve(project, lineageRef), stableJson(bundle), 'utf8');
	console.log(`${article.slug}: METADATA_ONLY lineage ${validation.overall}; effective review ${validation.effectiveReview}.`);
}
