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
const authorizationRef = 'lab/decisions/public-article-reader-copy-cleanup.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const timestamp = '2026-10-13T19:25:37Z';
const oldAudience = 'Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.';
const newAudience = 'Materiał dla początkujących i osób na poziomie średnim.';

const articles = [
	{ topic: 'api-http-json', slug: 'api-http-json', batch: 'B4', navigationAfterNote: false },
	{ topic: 'javascript-dom', slug: 'dom-w-javascript', batch: 'B3', navigationAfterNote: true },
	{ topic: 'php-control-flow', slug: 'instrukcje-sterujace-php' },
	{ topic: 'javascript-calculator', slug: 'kalkulator-w-javascript', batch: 'B4', navigationAfterNote: false },
	{ topic: 'markdown', slug: 'markdown-podstawy', batch: 'B4', navigationAfterNote: false },
	{ topic: 'javascript-arrays', slug: 'tablice-w-javascript', batch: 'B3', navigationAfterNote: true },
	{ topic: 'php-arrays', slug: 'tablice-w-php' },
	{ topic: 'javascript-if-else', slug: 'warunki-w-javascript', batch: 'B3', navigationAfterNote: true },
] as const;

for (const article of articles) {
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
	if (previousBundle && previousBundle.sourceCandidateHash !== sourceCandidateHash) {
		throw new Error(`${article.slug}: candidate hash mismatch.`);
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

	const audienceTransformation = {
		kind: 'body-replacements' as const,
		replacements: [{ from: oldAudience, to: newAudience }],
		meaningUnchanged: true,
	};
	const afterAudience = applyContentLineageTransformation(previousContent, audienceTransformation);
	if (afterAudience === null) throw new Error(`${article.slug}: audience wording is missing or not unique.`);
	records.push(ContentLineageRecordSchema.parse({
		schemaVersion: 1,
		recordType: 'CONTENT_LINEAGE_RECORD',
		articleId: article.slug,
		previousContentHash: hashBytes(previousContent),
		newContentHash: hashBytes(afterAudience),
		changeType: 'TYPO_FIX',
		reason: 'Simplify the reader-facing audience label without changing any technical claim or example.',
		authorizedBy: 'human',
		authorizationRef,
		authorizationHash,
		timestamp,
		sourceCandidateHash,
		promotionAuditRef,
		reviewImpact: 'REVIEW_STILL_VALID',
		replacementReview: null,
		transformation: audienceTransformation,
		backfilled: false,
		notes: ['The audience wording is editorial; reviewed technical statements and code examples are byte-identical.'],
	}));
	previousContent = afterAudience;

	if ('batch' in article) {
		const note = article.batch === 'B4'
			? '- Materiał obejmuje wyłącznie autoryzowany zakres B4, wskazane źródła i runtime Node; metadane interakcji nie są zaimplementowanym UI.\n'
			: '- Materiał obejmuje wyłącznie autoryzowany zakres B3 i wskazany runtime; metadane interakcji nie są zaimplementowanym UI.\n';
		const removal = `${article.navigationAfterNote ? '' : '\n'}---\n\n${note}${article.navigationAfterNote ? '\n' : ''}`;
		const cleanupTransformation = { kind: 'remove-body-exact' as const, removals: [removal] };
		const afterCleanup = applyContentLineageTransformation(previousContent, cleanupTransformation);
		if (afterCleanup === null) throw new Error(`${article.slug}: internal public note is missing or not unique.`);
		records.push(ContentLineageRecordSchema.parse({
			schemaVersion: 1,
			recordType: 'CONTENT_LINEAGE_RECORD',
			articleId: article.slug,
			previousContentHash: hashBytes(previousContent),
			newContentHash: hashBytes(afterCleanup),
			changeType: 'TECHNICAL_CLEANUP',
			reason: 'Remove an internal batch-authorization and interaction-metadata note from the reader-facing article.',
			authorizedBy: 'human',
			authorizationRef,
			authorizationHash,
			timestamp,
			sourceCandidateHash,
			promotionAuditRef,
			reviewImpact: 'REVIEW_STILL_VALID',
			replacementReview: null,
			transformation: cleanupTransformation,
			backfilled: false,
			notes: ['Internal workflow copy only; reviewed educational content and code examples are unchanged.'],
		}));
		previousContent = afterCleanup;
	}
	if (previousContent !== currentContent) throw new Error(`${article.slug}: declared cleanup does not reproduce current CONTENT.`);

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
			...(previousBundle?.notes.filter(note => !note.startsWith('Reader-copy cleanup is append-only'))
				?? ['The exact initial promotion remains reproducible from the immutable candidate and publication decision.']),
			'Reader-copy cleanup is append-only, hash-bound to explicit human authorization and preserves the effective Critic review.',
		],
	});
	const evidence: Record<string, string> = { [authorizationRef]: authorizationText };
	for (const record of records) {
		if (!(record.authorizationRef in evidence)) evidence[record.authorizationRef] = await readFile(resolve(project, record.authorizationRef), 'utf8');
		if (record.replacementReview && !(record.replacementReview.ref in evidence)) evidence[record.replacementReview.ref] = await readFile(resolve(project, record.replacementReview.ref), 'utf8');
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

console.log('Recorded reader-copy CONTENT lineage for eight published articles.');
