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
const authorizationRef = 'lab/decisions/latest-four-title-humanization.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const timestamp = '2026-10-19T10:36:26Z';

const foundationArticles = [
	{
		topic: 'php-language-foundation',
		slug: 'podstawy-php',
		oldTitle: 'PHP od pierwszego skryptu: wartości, zmienne, typy, operatory i CLI',
		newTitle: 'Podstawy PHP dla początkujących',
	},
	{
		topic: 'javascript-language-foundation',
		slug: 'podstawy-javascript',
		oldTitle: 'JavaScript od pierwszego uruchomienia: wartości, zmienne, typy i operatory',
		newTitle: 'Podstawy JavaScript dla początkujących',
	},
	{
		topic: 'javascript-functions-callbacks',
		slug: 'funkcje-javascript',
		oldTitle: 'Funkcje JavaScript: parametry, return i callbacki',
		newTitle: 'Funkcje w JavaScript dla początkujących',
	},
] as const;

for (const article of foundationArticles) {
	const candidateRef = `lab/candidates/${article.topic}/article.json`;
	const candidateArticleRef = `lab/candidates/${article.topic}/article.md`;
	const decisionRef = `lab/decisions/${article.topic}-publication.json`;
	const promotionAuditRef = `lab/reports/${article.slug}-promotion.json`;
	const lineageRef = `lab/reports/${article.slug}-content-lineage.json`;
	const currentContentRef = `content/articles/${article.slug}.md`;
	const [candidateText, candidateArticle, decisionText, auditText, currentContent] = await Promise.all([
		readFile(resolve(project, candidateRef), 'utf8'),
		readFile(resolve(project, candidateArticleRef), 'utf8'),
		readFile(resolve(project, decisionRef), 'utf8'),
		readFile(resolve(project, promotionAuditRef), 'utf8'),
		readFile(resolve(project, currentContentRef), 'utf8'),
	]);
	const decision = JSON.parse(decisionText);
	const audit = JSON.parse(auditText) as { contentHash: string };
	const initialContent = renderApprovedPublicationContent(decision, candidateArticle).content;
	if (hashBytes(initialContent) !== audit.contentHash) throw new Error(`${article.slug}: promotion content hash mismatch.`);

	let previousBundle: ReturnType<typeof ContentLineageBundleSchema.parse> | null = null;
	try {
		previousBundle = ContentLineageBundleSchema.parse(JSON.parse(await readFile(resolve(project, lineageRef), 'utf8')));
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
	}
	const sourceCandidateHash = hashBytes(candidateText);
	const records: ContentLineageRecord[] = previousBundle
		? previousBundle.records.filter(record => record.authorizationRef !== authorizationRef)
		: [];
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
			{ from: 'updated: 2026-10-16T00:00:00.000Z', to: 'updated: 2026-10-19T00:00:00.000Z' },
		],
	};
	const afterMetadata = applyContentLineageTransformation(previousContent, metadataTransformation);
	if (afterMetadata === null) throw new Error(`${article.slug}: title metadata transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterMetadata),
		changeType: 'METADATA_ONLY',
		reason: 'Replace a formulaic colon-separated title with a simpler reader-facing topic phrase.',
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
	const afterTitleChange = applyContentLineageTransformation(previousContent, headingTransformation);
	if (afterTitleChange === null) throw new Error(`${article.slug}: title heading transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterTitleChange),
		changeType: 'TYPO_FIX',
		reason: 'Keep the visible Markdown heading consistent with the reader-focused metadata title.',
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
	if (afterTitleChange !== currentContent) throw new Error(`${article.slug}: declared title change does not reproduce current CONTENT.`);

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
			...(previousBundle?.notes ?? ['The exact initial promotion remains reproducible from the immutable candidate and publication decision.']),
			'The reader-focused title change is append-only, hash-bound to explicit human authorization and preserves the technical review.',
		],
	});
	const evidence: Record<string, string> = { [authorizationRef]: authorizationText };
	for (const record of records) {
		if (!(record.authorizationRef in evidence)) evidence[record.authorizationRef] = await readFile(resolve(project, record.authorizationRef), 'utf8');
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

const googleContentRef = 'content/articles/google-ai-search-2026.md';
const googleContent = await readFile(resolve(project, googleContentRef), 'utf8');
const googleTransformation = {
	kind: 'exact-replacements',
	replacements: [
		{
			from: 'title: "Google AI Search 2026: jak tworzyć treści widoczne w AI Overviews i AI Mode"',
			to: 'title: "Jak zwiększyć widoczność treści w Google AI Overviews i AI Mode"',
		},
		{ from: 'updated: 2026-10-16T00:00:00.000Z', to: 'updated: 2026-10-19T00:00:00.000Z' },
	],
};
let googlePrevious = googleContent;
for (const replacement of googleTransformation.replacements) {
	if (!googlePrevious.includes(replacement.to) || googlePrevious.includes(replacement.from)) {
		throw new Error('google-ai-search-2026: current title state is not exact.');
	}
	googlePrevious = googlePrevious.replace(replacement.to, replacement.from);
}
const googleReport = {
	schemaVersion: 1,
	status: 'RECORDED',
	articleId: 'google-ai-search-2026',
	authorizationRef,
	authorizationHash,
	timestamp,
	previousContentHash: hashBytes(googlePrevious),
	currentContentRef: googleContentRef,
	currentContentHash: hashBytes(googleContent),
	changeType: 'TITLE_ONLY',
	reviewImpact: 'REVIEW_STILL_VALID',
	transformation: googleTransformation,
	notes: [
		'The manually imported article has no Promotion Gate lifecycle bundle.',
		'Only the front-matter title and updated date changed; article prose, sources and technical meaning are byte-identical.',
	],
};
await writeFile(resolve(project, 'lab/reports/google-ai-search-2026-title-change.json'), stableJson(googleReport), 'utf8');

console.log('Recorded reader-focused title evidence for four published articles.');
