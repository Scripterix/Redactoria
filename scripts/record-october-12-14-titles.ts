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
const authorizationRef = 'lab/decisions/october-12-14-title-humanization.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const timestamp = '2026-10-19T10:44:00Z';

const articles = [
	{
		topic: 'python-fundamentals', slug: 'podstawy-pythona', oldDate: '2026-10-14',
		oldTitle: 'Podstawy Pythona: wartości, warunki, pętle i funkcje',
		newTitle: 'Podstawy Pythona dla początkujących',
	},
	{
		topic: 'git-local-basics', slug: 'git-lokalnie', oldDate: '2026-10-14',
		oldTitle: 'Git lokalnie: status, staging, commit i historia',
		newTitle: 'Git dla początkujących',
	},
	{
		topic: 'curl-http-basics', slug: 'curl-http', oldDate: '2026-10-14',
		oldTitle: 'curl i HTTP: odpowiedź, nagłówki i lokalny JSON',
		newTitle: 'curl i HTTP dla początkujących',
	},
	{
		topic: 'api-http-json', slug: 'api-http-json', oldDate: '2026-10-12',
		oldTitle: 'API, HTTP i JSON: bezpieczne pobieranie danych przez fetch',
		newTitle: 'API, HTTP i JSON dla początkujących',
	},
	{
		topic: 'javascript-calculator', slug: 'kalkulator-w-javascript', oldDate: '2026-10-12',
		oldTitle: 'Kalkulator w JavaScript: walidacja, funkcja i klasa',
		newTitle: 'Kalkulator w JavaScript krok po kroku',
	},
	{
		topic: 'markdown', slug: 'markdown-podstawy', oldDate: '2026-10-12',
		oldTitle: 'Markdown: nagłówki, linki, listy i bloki kodu',
		newTitle: 'Markdown dla początkujących',
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
	if (afterMetadata === null) throw new Error(`${article.slug}: title metadata transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterMetadata),
		changeType: 'METADATA_ONLY',
		reason: 'Replace a colon-separated content inventory with a simple reader-focused title.',
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
	if (afterHeading === null) throw new Error(`${article.slug}: title heading transformation is not exact.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterHeading),
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
	if (afterHeading !== currentContent) throw new Error(`${article.slug}: declared title change does not reproduce current CONTENT.`);

	const bundle = ContentLineageBundleSchema.parse({
		...previousBundle,
		status: 'RECORDED',
		currentContentHash: hashBytes(currentContent),
		records,
		notes: [
			...previousBundle.notes.filter(note => !note.startsWith('The reader-focused title change')),
			'The reader-focused title change is append-only, hash-bound to explicit human authorization and preserves the technical review.',
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

console.log('Recorded reader-focused title evidence for the six 12/14 October articles.');
