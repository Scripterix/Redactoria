import { lstat, readFile, realpath } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { FocusedArticleResultSchema, ApprovedArticleDecisionSchema } from '../agents/cartographer/focused-article.ts';
import { FocusedMergeResultSchema } from '../agents/cartographer/focused-merge.ts';
import { CodeExecutionSchema, CriticReviewSchema } from '../agents/critic/contract.ts';
import { ApprovedMergeDecisionSchema, ResearchPacketSchema } from '../agents/researcher/contract.ts';
import { DraftSchema } from '../agents/writer/contract.ts';
import { PublicationCandidateAnySchema } from '../candidates/contract.ts';
import { hashBytes, ResearchApprovalSchema } from '../core/editorial-context.ts';
import { isWithin } from '../core/lab-writer.ts';
import { hashJson, stableJson } from '../core/serialization.ts';
import { AnyPublicationCandidateSchema, AnyPublicationDecisionSchema } from '../promotion/contract.ts';
import { renderApprovedPublicationContent } from '../promotion/gate.ts';
import { ContentLineageBundleSchema } from './content-lineage-contract.ts';
import { validateContentLineage } from './content-lineage.ts';
import {
	ArticleVerificationResultSchema,
	overallVerificationStatus,
	TOTAL_CHECK_COUNT,
	type ArticleVerificationResult,
	type VerificationCheck,
	type VerificationStatus,
} from './article-verification-contract.ts';

export type VerificationFixture = {
	topic: string;
	candidateRef: string;
	publication: null | { decisionRef: string; auditRef: string };
};

export const FROZEN_ARTICLE_FIXTURES: readonly VerificationFixture[] = [
	{ topic: 'php-arrays', candidateRef: 'lab/candidates/php-arrays/article.json', publication: {
		decisionRef: 'lab/decisions/php-arrays-publication.json', auditRef: 'lab/reports/tablice-w-php-promotion.json',
	} },
	{ topic: 'php-control-flow', candidateRef: 'lab/candidates/php-control-flow/article.json', publication: {
		decisionRef: 'lab/decisions/php-control-flow-publication.json', auditRef: 'lab/reports/instrukcje-sterujace-php-promotion.json',
	} },
	{ topic: 'javascript-if-else', candidateRef: 'lab/candidates/javascript-if-else/article.json', publication: {
		decisionRef: 'lab/decisions/javascript-if-else-publication.json', auditRef: 'lab/reports/warunki-w-javascript-promotion.json',
	} },
	{ topic: 'javascript-arrays', candidateRef: 'lab/candidates/javascript-arrays/article.json', publication: {
		decisionRef: 'lab/decisions/javascript-arrays-publication.json', auditRef: 'lab/reports/tablice-w-javascript-promotion.json',
	} },
	{ topic: 'javascript-dom', candidateRef: 'lab/candidates/javascript-dom/article.json', publication: {
		decisionRef: 'lab/decisions/javascript-dom-publication.json', auditRef: 'lab/reports/dom-w-javascript-promotion.json',
	} },
	{ topic: 'markdown', candidateRef: 'lab/candidates/markdown/article.json', publication: {
		decisionRef: 'lab/decisions/markdown-publication.json', auditRef: 'lab/reports/markdown-podstawy-promotion.json',
	} },
	{ topic: 'javascript-calculator', candidateRef: 'lab/candidates/javascript-calculator/article.json', publication: {
		decisionRef: 'lab/decisions/javascript-calculator-publication.json', auditRef: 'lab/reports/kalkulator-w-javascript-promotion.json',
	} },
	{ topic: 'api-http-json', candidateRef: 'lab/candidates/api-http-json/article.json', publication: {
		decisionRef: 'lab/decisions/api-http-json-publication.json', auditRef: 'lab/reports/api-http-json-promotion.json',
	} },
	{ topic: 'git-local-basics', candidateRef: 'lab/candidates/git-local-basics/article.json', publication: {
		decisionRef: 'lab/decisions/git-local-basics-publication.json', auditRef: 'lab/reports/git-lokalnie-promotion.json',
	} },
	{ topic: 'curl-http-basics', candidateRef: 'lab/candidates/curl-http-basics/article.json', publication: {
		decisionRef: 'lab/decisions/curl-http-basics-publication.json', auditRef: 'lab/reports/curl-http-promotion.json',
	} },
	{ topic: 'python-fundamentals', candidateRef: 'lab/candidates/python-fundamentals/article.json', publication: {
		decisionRef: 'lab/decisions/python-fundamentals-publication.json', auditRef: 'lab/reports/podstawy-pythona-promotion.json',
	} },
] as const;

export function verificationFixtureForTopic(topic: string): VerificationFixture | undefined {
	return FROZEN_ARTICLE_FIXTURES.find(fixture => fixture.topic === topic);
}

export type ArticleVerificationSnapshot = {
	fixture: VerificationFixture;
	projectFiles: Record<string, string | undefined>;
	sourceFiles: Record<string, string | undefined>;
	sourceOutsideProject: boolean;
};

const projectRef = /^(?:(?:lab|content)\/[a-zA-Z0-9/_.-]+|docs\/plans\/(?:active|completed)\/[a-zA-Z0-9_.-]+\.md)$/;
const sourceRef = /^[^/\\]+\.md$/;

function contentLineageRef(destination: string | null): string | null {
	const match = /^content\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/.exec(destination ?? '');
	return match ? `lab/reports/${match[1]}-content-lineage.json` : null;
}

function record(value: unknown): Record<string, unknown> | null {
	return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function json(value: string | undefined): unknown {
	if (value === undefined) return null;
	try { return JSON.parse(value); } catch { return null; }
}
function field(object: unknown, name: string): unknown { return record(object)?.[name]; }
function textField(object: unknown, name: string): string | null {
	const value = field(object, name);
	return typeof value === 'string' ? value : null;
}
function listField(object: unknown, name: string): unknown[] { return Array.isArray(field(object, name)) ? field(object, name) as unknown[] : []; }

async function readScoped(root: string, reference: string, pattern: RegExp): Promise<string | undefined> {
	if (!pattern.test(reference) || reference.split('/').some(part => part === '.' || part === '..')) throw new Error('Invalid verification reference: ' + reference);
	const target = resolve(root, ...reference.split('/'));
	try {
		const canonical = await realpath(target);
		if (!isWithin(root, canonical)) throw new Error('Verification reference escapes its root: ' + reference);
		const info = await lstat(canonical);
		if (!info.isFile() || info.size > 1_500_000) throw new Error('Invalid verification input file/budget: ' + reference);
		return readFile(canonical, 'utf8');
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined;
		throw error;
	}
}

/** Reads only references required by one frozen fixture. It never writes or repairs artifacts. */
export async function loadArticleVerificationSnapshot(options: {
	projectDirectory: string;
	sourceDirectory: string;
	fixture: VerificationFixture;
}): Promise<ArticleVerificationSnapshot> {
	const project = await realpath(options.projectDirectory);
	const source = await realpath(options.sourceDirectory);
	const projectFiles: Record<string, string | undefined> = {};
	const sourceFiles: Record<string, string | undefined> = {};
	const refs = new Set<string>([
		options.fixture.candidateRef,
		options.fixture.candidateRef.replace(/\.json$/, '.md'),
		`lab/drafts/${options.fixture.topic}/code-execution.json`,
	]);
	const load = async (reference: string) => {
		if (!(reference in projectFiles)) projectFiles[reference] = await readScoped(project, reference, projectRef);
		return projectFiles[reference];
	};
	const addStringRef = (value: unknown) => { if (typeof value === 'string' && projectRef.test(value)) refs.add(value); };

	const candidateRaw = json(await load(options.fixture.candidateRef));
	for (const key of ['draftRef', 'draftMetadataRef', 'criticReviewRef', 'revisionRef', 'researchPacket', 'researchApproval', 'runtimeVerification', 'mergeDecision', 'sourceDecision']) {
		addStringRef(field(candidateRaw, key));
	}
	await Promise.all([...refs].map(load));

	const draftRaw = json(projectFiles[textField(candidateRaw, 'draftMetadataRef') ?? '']);
	for (const item of listField(draftRaw, 'approvedArtifacts')) addStringRef(textField(item, 'path'));
	const approvalRaw = json(projectFiles[textField(candidateRaw, 'researchApproval') ?? '']);
	addStringRef(textField(approvalRaw, 'authorizationRef'));
	for (const item of listField(field(approvalRaw, 'evidence'), 'artifacts')) addStringRef(textField(item, 'path'));
	const decisionRef = textField(candidateRaw, 'mergeDecision') ?? textField(candidateRaw, 'sourceDecision');
	const decisionRaw = json(projectFiles[decisionRef ?? '']);
	addStringRef(textField(decisionRaw, 'analysisRef'));

	if (options.fixture.publication) {
		refs.add(options.fixture.publication.decisionRef);
		refs.add(options.fixture.publication.auditRef);
		const publicationRaw = json(await load(options.fixture.publication.decisionRef));
		const destination = textField(publicationRaw, 'destination');
		addStringRef(destination);
		const lineageRef = contentLineageRef(destination);
		if (lineageRef) refs.add(lineageRef);
		await Promise.all([...refs].map(load));
		const lineageRaw = json(lineageRef ? projectFiles[lineageRef] : undefined);
		for (const lineageRecord of listField(lineageRaw, 'records')) {
			addStringRef(textField(lineageRecord, 'authorizationRef'));
			addStringRef(textField(field(lineageRecord, 'replacementReview'), 'ref'));
		}
	}
	await Promise.all([...refs].map(load));

	for (const sourceItem of listField(draftRaw, 'sources')) {
		const path = textField(sourceItem, 'sourcePath');
		if (path && sourceRef.test(path)) sourceFiles[path] = await readScoped(source, path, sourceRef);
	}
	return { fixture: options.fixture, projectFiles, sourceFiles, sourceOutsideProject: !isWithin(project, source) };
}

/** Production read-only entry point used by Operator Mode. */
export async function verifyArticle(options: {
	projectDirectory: string;
	sourceDirectory: string;
	topic: string;
}): Promise<ArticleVerificationResult> {
	const fixture = verificationFixtureForTopic(options.topic);
	if (!fixture) throw new Error(`Unknown article topic: ${options.topic}. Known topics: ${FROZEN_ARTICLE_FIXTURES.map(item => item.topic).join(', ')}.`);
	return verifyArticleSnapshot(await loadArticleVerificationSnapshot({
		projectDirectory: options.projectDirectory,
		sourceDirectory: options.sourceDirectory,
		fixture,
	}));
}

function check(condition: boolean, pass: string, fail: string): VerificationCheck {
	return { status: condition ? 'PASS' : 'FAIL', detail: condition ? pass : fail };
}
function notApplicable(detail: string): VerificationCheck { return { status: 'NOT_APPLICABLE', detail }; }
function areaStatus(checks: Record<string, VerificationCheck>): VerificationStatus {
	const values = Object.values(checks);
	if (values.some(item => item.status === 'FAIL')) return 'FAIL';
	if (values.every(item => item.status === 'NOT_APPLICABLE')) return 'NOT_APPLICABLE';
	return 'PASS';
}
function area<T extends Record<string, VerificationCheck>>(checks: T): { status: VerificationStatus; checks: T } {
	return { status: areaStatus(checks), checks };
}
function sourceIdentity(value: unknown) {
	return listField(value, 'sources').map(item => ({
		sourceId: textField(item, 'sourceId'), sourcePath: textField(item, 'sourcePath'), contentHash: textField(item, 'contentHash'),
	}));
}
function targetIdentity(value: unknown) {
	return listField(value, 'targets').map(item => ({
		sourceId: textField(item, 'sourceId'), sourcePath: textField(item, 'sourcePath'), contentHash: textField(item, 'contentHash'),
	}));
}
function artifactEntries(value: unknown): { path: string; sha256: string }[] {
	return listField(value, 'approvedArtifacts').flatMap(item => {
		const path = textField(item, 'path'), sha256 = textField(item, 'sha256');
		return path && sha256 ? [{ path, sha256 }] : [];
	});
}
function evidenceEntries(value: unknown): { path: string; sha256: string }[] {
	return listField(field(value, 'evidence'), 'artifacts').flatMap(item => {
		const path = textField(item, 'path'), sha256 = textField(item, 'sha256');
		return path && sha256 ? [{ path, sha256 }] : [];
	});
}

/** Pure verification over a loaded snapshot. All statuses are data; no artifact is changed. */
export function verifyArticleSnapshot(snapshot: ArticleVerificationSnapshot): ArticleVerificationResult {
	const files = snapshot.projectFiles;
	const fixture = snapshot.fixture;
	const candidateText = files[fixture.candidateRef];
	const candidateRaw = json(candidateText);
	const candidateVersion = field(candidateRaw, 'schemaVersion');
	const candidateResult = candidateVersion === 1
		? AnyPublicationCandidateSchema.safeParse(candidateRaw)
		: PublicationCandidateAnySchema.safeParse(candidateRaw);
	const candidateArticleRef = fixture.candidateRef.replace(/\.json$/, '.md');
	const candidateArticle = files[candidateArticleRef];
	const draftRef = textField(candidateRaw, 'draftRef');
	const draftMetadataRef = textField(candidateRaw, 'draftMetadataRef');
	const reviewRef = textField(candidateRaw, 'criticReviewRef');
	const revisionRef = textField(candidateRaw, 'revisionRef');
	const decisionRef = textField(candidateRaw, 'mergeDecision') ?? textField(candidateRaw, 'sourceDecision');
	const packetRef = textField(candidateRaw, 'researchPacket');
	const approvalRef = textField(candidateRaw, 'researchApproval');
	const runtimeRef = textField(candidateRaw, 'runtimeVerification');
	const draftText = draftMetadataRef ? files[draftMetadataRef] : undefined;
	const draftArticle = draftRef ? files[draftRef] : undefined;
	const reviewText = reviewRef ? files[reviewRef] : undefined;
	const revisionText = revisionRef ? files[revisionRef] : undefined;
	const decisionText = decisionRef ? files[decisionRef] : undefined;
	const packetText = packetRef ? files[packetRef] : undefined;
	const approvalText = approvalRef ? files[approvalRef] : undefined;
	const runtimeText = runtimeRef ? files[runtimeRef] : undefined;
	const codeExecutionRef = `lab/drafts/${fixture.topic}/code-execution.json`;
	const codeExecutionText = files[codeExecutionRef];
	const draftRaw = json(draftText), reviewRaw = json(reviewText), revisionRaw = json(revisionText);
	const decisionRaw = json(decisionText), packetRaw = json(packetText), approvalRaw = json(approvalText), runtimeRaw = json(runtimeText);
	const codeExecutionRaw = json(codeExecutionText);
	const draftResult = DraftSchema.safeParse(draftRaw);
	const reviewResult = CriticReviewSchema.safeParse(reviewRaw);
	const decisionResult = z.union([ApprovedMergeDecisionSchema, ApprovedArticleDecisionSchema]).safeParse(decisionRaw);
	const packetResult = ResearchPacketSchema.safeParse(packetRaw);
	const approvalResult = ResearchApprovalSchema.safeParse(approvalRaw);
	const executionResult = CodeExecutionSchema.safeParse(codeExecutionRaw);

	const draftSources = sourceIdentity(draftRaw);
	const sourcePathsSafe = draftSources.length > 0 && draftSources.every(item => item.sourcePath && sourceRef.test(item.sourcePath));
	const sourceExists = sourcePathsSafe && draftSources.every(item => snapshot.sourceFiles[item.sourcePath!] !== undefined);
	const allSourceHashes = sourceExists && draftSources.every(item => hashBytes(snapshot.sourceFiles[item.sourcePath!]!) === item.contentHash);
	const decisionTargets = targetIdentity(decisionRaw), packetTargets = targetIdentity(packetRaw), approvalTargets = targetIdentity(approvalRaw);
	const candidateSources = sourceIdentity(field(candidateRaw, 'reviewedDraft'));
	const sourceReferenceValid = draftSources.length > 0
		&& [decisionTargets, packetTargets, approvalTargets, candidateSources].every(items => stableJson(items) === stableJson(draftSources));

	const sourceChecks = {
		exists: check(sourceExists, `${draftSources.length} SOURCE file(s) exist.`, 'A referenced SOURCE file is missing.'),
		reference: check(sourceReferenceValid, 'SOURCE identities agree across decision, research, draft and candidate.', 'SOURCE identity differs across pipeline artifacts.'),
		hash: check(allSourceHashes, 'Current SOURCE bytes match every recorded SHA-256.', 'Current SOURCE bytes do not match recorded SHA-256.'),
		protection: check(snapshot.sourceOutsideProject && sourcePathsSafe, 'SOURCE root is external and all reads use filename-only references.', 'SOURCE boundary is not external or a reference is unsafe.'),
	};

	const analysisRef = textField(decisionRaw, 'analysisRef');
	const analysisText = analysisRef ? files[analysisRef] : undefined;
	const analysisRaw = json(analysisText);
	const analysisResult = z.union([FocusedMergeResultSchema, FocusedArticleResultSchema]).safeParse(analysisRaw);
	const expectedArtifactName = `${fixture.topic}-${field(decisionRaw, 'action') === 'MERGE' ? 'merge' : 'single'}`;
	const cartographyScope = decisionResult.success && analysisResult.success && analysisText !== undefined
		&& textField(candidateRaw, candidateVersion === 1 ? 'mergeDecision' : 'sourceDecision') === decisionRef
		&& textField(draftRaw, 'sourceDecision') === decisionRef
		&& textField(analysisRaw, 'artifactName') === expectedArtifactName
		&& textField(decisionRaw, 'analysisHash') === hashJson(analysisRaw)
		&& stableJson(targetIdentity(analysisRaw)) === stableJson(draftSources);
	const authorizationRef = textField(decisionRaw, 'authorizationRef');
	const authorizationText = authorizationRef ? files[authorizationRef] : undefined;
	const mergeAuthorization = field(decisionRaw, 'action') === 'MERGE'
		&& field(decisionRaw, 'approvedBy') === 'human' && field(decisionRaw, 'status') === 'approved';
	const singleAuthorization = field(decisionRaw, 'action') !== 'MERGE' && authorizationRef !== null
		&& authorizationText !== undefined && textField(decisionRaw, 'authorizationHash') === hashBytes(authorizationText)
		&& field(decisionRaw, 'approvedBy') === 'human' && field(decisionRaw, 'status') === 'approved';
	const cartographyChecks = {
		decision: check(decisionText !== undefined && decisionResult.success, 'Approved Cartographer decision exists and validates.', 'Cartographer decision is missing or invalid.'),
		scopeProvenance: check(cartographyScope, 'Decision, analysis, topic and SOURCE targets are hash-bound.', 'Cartography scope or provenance is inconsistent.'),
		authorization: check(mergeAuthorization || singleAuthorization, 'Required human authorization exists and is hash-bound.', 'Required human authorization is missing or inconsistent.'),
	};

	const approvedArtifacts = artifactEntries(draftRaw);
	const approvalEvidence = evidenceEntries(approvalRaw);
	const researchEvidenceExists = approvalEvidence.length > 0 && approvedArtifacts.length > 0
		&& [...approvalEvidence, ...approvedArtifacts].every(item => files[item.path] !== undefined);
	const researchHashes = packetText !== undefined && approvalResult.success
		&& textField(approvalRaw, 'packetRef') === packetRef && textField(approvalRaw, 'packetHash') === hashBytes(packetText)
		&& textField(candidateRaw, 'researchPacket') === packetRef && textField(draftRaw, 'researchPacket') === packetRef
		&& textField(candidateRaw, 'researchApproval') === approvalRef && textField(draftRaw, 'researchApproval') === approvalRef
		&& [...approvalEvidence, ...approvedArtifacts].every(item => files[item.path] !== undefined && hashBytes(files[item.path]!) === item.sha256);
	const researchChecks = {
		packet: check(packetText !== undefined && packetResult.success, 'Research Packet exists and validates.', 'Research Packet is missing or invalid.'),
		approval: check(approvalText !== undefined && approvalResult.success, 'Required research approval/validation exists.', 'Research approval/validation is missing or invalid.'),
		evidence: check(researchEvidenceExists, `${approvalEvidence.length} approved evidence reference(s) exist.`, 'Referenced research evidence is missing.'),
		hashes: check(researchHashes, 'Packet, approval and all approved evidence hashes match.', 'Research or approved-evidence hash mismatch.'),
	};

	const runtimeRuns = listField(runtimeRaw, 'runs');
	const executionRuns = listField(codeExecutionRaw, 'runs');
	const draftExamples = draftResult.success ? draftResult.data.sections.flatMap(section => section.examples) : [];
	const exampleBinding = executionResult.success && draftExamples.length > 0 && executionRuns.length > 0
		&& executionRuns.every(run => {
			const examples = listField(run, 'examples');
			return examples.length === draftExamples.length && draftExamples.every(example => examples.some(execution =>
				textField(execution, 'id') === example.id && textField(execution, 'codeHash') === hashBytes(example.code)));
		});
	const environmentMatches = runtimeRuns.length > 0 && runtimeRuns.length === executionRuns.length && runtimeRuns.every(runtimeRun => executionRuns.some(executionRun => {
		const runtimeId = textField(runtimeRun, 'runtimeId') ?? textField(runtimeRun, 'family');
		const executionId = textField(executionRun, 'runtimeId') ?? textField(executionRun, 'family');
		return runtimeId === executionId && textField(runtimeRun, 'version') === textField(executionRun, 'version')
			&& textField(runtimeRun, 'execution') === textField(executionRun, 'execution');
	}));
	const runtimeResults = field(runtimeRaw, 'status') === 'PASS' && executionResult.success && executionResult.data.status === 'PASS'
		&& runtimeRuns.every(run => field(run, 'status') === 'PASS'
			&& listField(run, 'checks').length > 0
			&& listField(run, 'checks').every(item => field(item, 'status') === 'PASS' && stableJson(field(item, 'actual')) === stableJson(field(item, 'expected'))))
		&& executionRuns.every(run => listField(run, 'examples').every(item => field(item, 'status') === 'PASS'));
	const runtimeChecks = {
		evidence: check(runtimeText !== undefined && codeExecutionText !== undefined && executionResult.success, 'Research runtime and final-example evidence exist.', 'Required runtime or final-example evidence is missing/invalid.'),
		exampleBinding: check(exampleBinding, `${draftExamples.length} draft example(s) are bound by code hashes in every execution run.`, 'Execution evidence does not bind every exact draft example.'),
		environment: check(environmentMatches, 'Recorded research and final execution environments agree.', 'Runtime/browser environment is missing or inconsistent.'),
		results: check(runtimeResults, 'Runtime checks and final example results are PASS.', 'A runtime assertion or final example is not PASS.'),
	};

	const revisionArticleHash = textField(revisionRaw, 'revisedArticleHash') ?? textField(revisionRaw, 'afterArticleHash');
	const revisionDraftHash = textField(revisionRaw, 'revisedDraftHash') ?? textField(revisionRaw, 'afterDraftHash');
	const draftHashValid = draftResult.success && draftArticle !== undefined && draftText !== undefined
		&& draftResult.data.articleHash === hashBytes(draftArticle)
		&& textField(candidateRaw, 'draftMetadataHash') === hashBytes(draftText);
	const writerLineage = draftResult.success && draftText !== undefined && revisionText !== undefined && revisionArticleHash === draftResult.data.articleHash
		&& revisionDraftHash === hashBytes(draftText)
		&& textField(candidateRaw, 'revisionHash') === hashBytes(revisionText)
		&& draftRef === `lab/drafts/${fixture.topic}/article.md`
		&& draftMetadataRef === `lab/drafts/${fixture.topic}/article.json`
		&& decisionRef === draftResult.data.sourceDecision && packetRef === draftResult.data.researchPacket
		&& approvalRef === draftResult.data.researchApproval && runtimeRef === draftResult.data.runtimeVerification;
	const writerChecks = {
		draft: check(draftResult.success && draftArticle !== undefined, 'Expected structured draft and Markdown exist.', 'Draft metadata or Markdown is missing/invalid.'),
		hash: check(draftHashValid, 'Draft metadata and Markdown hashes match.', 'Draft metadata or Markdown hash mismatch.'),
		lineage: check(writerLineage, 'Draft lineage, revision and approved inputs are complete.', 'Draft lineage or revision binding is inconsistent.'),
	};

	const reviewHashValid = reviewResult.success && draftResult.success && reviewText !== undefined && draftText !== undefined
		&& reviewResult.data.articleHash === draftResult.data.articleHash
		&& reviewResult.data.draftMetadataHash === hashBytes(draftText)
		&& reviewResult.data.draftRef === draftRef
		&& textField(candidateRaw, 'criticReviewHash') === hashBytes(reviewText);
	const noUnresolvedChanges = reviewResult.success && reviewResult.data.requiredChanges.length === 0
		&& !reviewResult.data.issues.some(issue => issue.severity === 'required' || issue.severity === 'blocking');
	const criticChecks = {
		finalReview: check(reviewResult.success, 'Final Critic review exists and validates.', 'Final Critic review is missing or invalid.'),
		verdict: check(reviewResult.success && reviewResult.data.verdict === 'PASS' && textField(candidateRaw, 'criticVerdict') === 'PASS', 'Final Critic verdict is PASS.', 'Final Critic verdict is not PASS.'),
		reviewedHash: check(reviewHashValid, 'Critic review binds the exact draft metadata and article hash.', 'Critic review does not bind the exact reviewed draft.'),
		unresolvedChanges: check(noUnresolvedChanges, 'No unresolved required or blocking change remains.', 'Required or blocking Critic changes remain unresolved.'),
	};

	const candidateIntegrity = candidateArticle !== undefined && candidateText !== undefined
		&& textField(candidateRaw, 'topic') === fixture.topic
		&& textField(candidateRaw, 'articleHash') === hashBytes(candidateArticle)
		&& draftText !== undefined && reviewText !== undefined && revisionText !== undefined
		&& textField(candidateRaw, 'draftMetadataHash') === hashBytes(draftText)
		&& textField(candidateRaw, 'criticReviewHash') === hashBytes(reviewText)
		&& textField(candidateRaw, 'revisionHash') === hashBytes(revisionText);
	const reviewedVersion = candidateArticle !== undefined && draftArticle !== undefined && candidateArticle === draftArticle
		&& draftResult.success && stableJson(field(candidateRaw, 'reviewedDraft')) === stableJson(draftResult.data);
	const publicationFlags = field(candidateRaw, 'readyForHumanPublicationDecision') === true
		&& field(candidateRaw, 'humanPublicationDecision') === 'pending'
		&& field(candidateRaw, 'approvedForPublication') === false && field(candidateRaw, 'published') === false;
	const candidateChecks = {
		exists: check(candidateText !== undefined && candidateArticle !== undefined, 'Candidate metadata and Markdown exist.', 'Candidate metadata or Markdown is missing.'),
		schema: check(candidateResult.success, `Candidate schema v${String(candidateVersion)} validates.`, 'Candidate metadata schema is invalid.'),
		integrity: check(candidateIntegrity, 'Candidate hashes match article, draft, review and revision bytes.', 'Candidate hash or referenced artifact hash mismatch.'),
		reviewedVersion: check(reviewedVersion, 'Candidate is the exact Critic-reviewed draft version.', 'Candidate differs from the reviewed draft version.'),
		publicationFlags: check(publicationFlags, 'Immutable candidate flags remain pending/false.', 'Candidate publication flags are false or inconsistent.'),
	};

	let publicationChecks: Record<'decision' | 'humanApproval' | 'promotionAudit' | 'contentLineage' | 'contentIntegrity', VerificationCheck>;
	if (!fixture.publication) {
		publicationChecks = {
			decision: notApplicable('Candidate is pending; no publication decision is required for OVERALL PASS.'),
			humanApproval: notApplicable('Candidate is pending; publication approval does not apply.'),
			promotionAudit: notApplicable('Candidate has not entered Promotion Gate.'),
			contentLineage: notApplicable('Candidate has no post-promotion CONTENT lineage.'),
			contentIntegrity: notApplicable('Candidate has no expected CONTENT destination.'),
		};
	} else {
		const publicationDecisionText = files[fixture.publication.decisionRef];
		const publicationDecisionRaw = json(publicationDecisionText);
		const publicationDecisionResult = AnyPublicationDecisionSchema.safeParse(publicationDecisionRaw);
		const auditText = files[fixture.publication.auditRef];
		const auditRaw = json(auditText);
		const destination = textField(publicationDecisionRaw, 'destination');
		const content = destination ? files[destination] : undefined;
		const decisionBinding = publicationDecisionResult.success && candidateText !== undefined && reviewText !== undefined
			&& textField(publicationDecisionRaw, 'candidateRef') === fixture.candidateRef
			&& textField(publicationDecisionRaw, 'candidateHash') === hashBytes(candidateText)
			&& textField(publicationDecisionRaw, 'articleHash') === textField(candidateRaw, 'articleHash')
			&& textField(publicationDecisionRaw, 'criticReviewRef') === reviewRef
			&& textField(publicationDecisionRaw, 'criticReviewHash') === hashBytes(reviewText);
		const humanApproval = publicationDecisionResult.success && field(publicationDecisionRaw, 'status') === 'approved'
			&& field(publicationDecisionRaw, 'approvedBy') === 'human';
		const auditBinding = auditText !== undefined && record(auditRaw) !== null && publicationDecisionText !== undefined && candidateText !== undefined
			&& textField(auditRaw, 'candidateRef') === fixture.candidateRef
			&& textField(auditRaw, 'candidateHash') === hashBytes(candidateText)
			&& textField(auditRaw, 'decisionRef') === fixture.publication.decisionRef
			&& textField(auditRaw, 'decisionHash') === hashBytes(publicationDecisionText)
			&& textField(auditRaw, 'articleHash') === textField(candidateRaw, 'articleHash')
			&& textField(auditRaw, 'criticReviewHash') === textField(candidateRaw, 'criticReviewHash')
			&& textField(auditRaw, 'destination') === destination;
		const lineageRef = contentLineageRef(destination);
		const lineageText = lineageRef ? files[lineageRef] : undefined;
		const lineageRaw = json(lineageText);
		const lineageBundle = ContentLineageBundleSchema.safeParse(lineageRaw);
		let initialContent: string | undefined;
		if (publicationDecisionResult.success && candidateArticle !== undefined) {
			try { initialContent = renderApprovedPublicationContent(publicationDecisionResult.data, candidateArticle).content; } catch { /* reported as FAIL */ }
		}
		const promotedContentHash = textField(auditRaw, 'contentHash');
		const currentHash = content === undefined ? null : hashBytes(content);
		const exactPromotion = initialContent !== undefined && content !== undefined && promotedContentHash !== null
			&& hashBytes(initialContent) === promotedContentHash && currentHash === promotedContentHash;
		const lineageDocumentValid = lineageText === undefined
			? exactPromotion
			: lineageBundle.success && candidateText !== undefined && destination !== null && currentHash !== null
				&& lineageBundle.data.articleId === textField(field(publicationDecisionRaw, 'metadata'), 'slug')
				&& lineageBundle.data.candidateRef === fixture.candidateRef
				&& lineageBundle.data.sourceCandidateHash === hashBytes(candidateText)
				&& lineageBundle.data.promotionAuditRef === fixture.publication.auditRef
				&& lineageBundle.data.promotedContentHash === promotedContentHash
				&& lineageBundle.data.currentContentRef === destination
				&& lineageBundle.data.currentContentHash === currentHash;
		const lineageEvidence: Record<string, string | undefined> = {};
		if (lineageBundle.success) for (const lineageRecord of lineageBundle.data.records) {
			lineageEvidence[lineageRecord.authorizationRef] = files[lineageRecord.authorizationRef];
			if (lineageRecord.replacementReview) lineageEvidence[lineageRecord.replacementReview.ref] = files[lineageRecord.replacementReview.ref];
		}
		const articleId = textField(field(publicationDecisionRaw, 'metadata'), 'slug');
		const lineageResult = initialContent !== undefined && content !== undefined && promotedContentHash !== null
			&& candidateText !== undefined && articleId !== null
			? validateContentLineage({
				articleId,
				initialContent,
				currentContent: content,
				promotedContentHash,
				expectedCandidateHash: hashBytes(candidateText),
				expectedPromotionAuditRef: fixture.publication.auditRef,
				records: lineageBundle.success ? lineageBundle.data.records : [],
				evidence: lineageEvidence,
			})
			: null;
		const contentLineage = lineageDocumentValid && lineageResult?.overall === 'PASS';
		const contentIntegrity = content !== undefined && lineageResult?.checks.currentHash.status === 'PASS';
		publicationChecks = {
			decision: check(decisionBinding, 'Publication decision binds the exact candidate and review.', 'Publication decision does not bind the exact candidate/review.'),
			humanApproval: check(humanApproval, 'Publication decision contains explicit human approval.', 'Explicit human publication approval is missing or invalid.'),
			promotionAudit: check(auditBinding, 'Promotion audit binds decision, candidate, review and destination.', 'Promotion audit is missing or inconsistent.'),
			contentLineage: check(contentLineage,
				lineageBundle.success ? `${lineageBundle.data.records.length} post-promotion lineage record(s) replay and preserve review validity.` : 'Current CONTENT exactly matches the reconstructed initial promotion; no later record is required.',
				'Initial promotion or post-promotion CONTENT lineage is missing, broken or review-invalid.'),
			contentIntegrity: check(contentIntegrity, 'Current CONTENT is the exact valid end of the publication lineage.', 'Current CONTENT is missing or does not match the valid lineage end.'),
		};
	}

	const areas = {
		source: area(sourceChecks), cartography: area(cartographyChecks), research: area(researchChecks), runtime: area(runtimeChecks),
		writer: area(writerChecks), critic: area(criticChecks), candidate: area(candidateChecks), publication: area(publicationChecks),
	};
	const allChecks = Object.values(areas).flatMap(item => Object.values(item.checks));
	if (allChecks.length !== TOTAL_CHECK_COUNT) throw new Error('Verification contract check count changed unexpectedly.');
	const result = {
		schemaVersion: 1 as const,
		topic: fixture.topic,
		candidateRef: fixture.candidateRef,
		fixture: fixture.publication ? 'frozen-published' as const : 'frozen-pending' as const,
		areas,
		summary: {
			pass: allChecks.filter(item => item.status === 'PASS').length,
			fail: allChecks.filter(item => item.status === 'FAIL').length,
			notApplicable: allChecks.filter(item => item.status === 'NOT_APPLICABLE').length,
			total: allChecks.length,
		},
		overall: overallVerificationStatus(allChecks),
	};
	return ArticleVerificationResultSchema.parse(result);
}
