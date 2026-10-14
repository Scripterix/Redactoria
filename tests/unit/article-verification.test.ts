import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { hashBytes } from '../../engine/core/editorial-context.ts';
import { stableJson } from '../../engine/core/serialization.ts';
import {
	FROZEN_ARTICLE_FIXTURES,
	loadArticleVerificationSnapshot,
	verifyArticleSnapshot,
	type ArticleVerificationSnapshot,
} from '../../engine/validation/article-verification.ts';
import {
	ArticleVerificationResultSchema,
	COMMON_CHECK_COUNT,
	CONDITIONAL_PUBLICATION_CHECK_COUNT,
	overallVerificationStatus,
	TOTAL_CHECK_COUNT,
} from '../../engine/validation/article-verification-contract.ts';

const projectDirectory = fileURLToPath(new URL('../../', import.meta.url));
const sourceDirectory = resolve(projectDirectory, '../temp-ogwo/posts');
const snapshots = new Map<string, ArticleVerificationSnapshot>();

function clone(topic: string) {
	const snapshot = snapshots.get(topic);
	if (!snapshot) throw new Error('Missing test snapshot: ' + topic);
	return structuredClone(snapshot);
}

function replaceJson(snapshot: ArticleVerificationSnapshot, reference: string, mutate: (value: Record<string, unknown>) => void) {
	const text = snapshot.projectFiles[reference];
	if (!text) throw new Error('Missing fixture JSON: ' + reference);
	const value = JSON.parse(text) as Record<string, unknown>;
	mutate(value);
	snapshot.projectFiles[reference] = stableJson(value);
	return snapshot.projectFiles[reference]!;
}

beforeAll(async () => {
	for (const fixture of FROZEN_ARTICLE_FIXTURES) {
		snapshots.set(fixture.topic, await loadArticleVerificationSnapshot({ projectDirectory, sourceDirectory, fixture }));
	}
});

describe('verify:article contract spike', () => {
	it('defines exact tri-state and overall semantics', () => {
		expect(TOTAL_CHECK_COUNT).toBe(32);
		expect(COMMON_CHECK_COUNT).toBe(27);
		expect(CONDITIONAL_PUBLICATION_CHECK_COUNT).toBe(5);
		expect(overallVerificationStatus([
			{ status: 'PASS', detail: 'required check passed' },
			{ status: 'NOT_APPLICABLE', detail: 'conditional check does not apply' },
		])).toBe('PASS');
		expect(overallVerificationStatus([
			{ status: 'PASS', detail: 'required check passed' },
			{ status: 'FAIL', detail: 'required check failed' },
		])).toBe('FAIL');
	});

	it.each(FROZEN_ARTICLE_FIXTURES)('validates frozen fixture $topic without hardcoded PASS', fixture => {
		const result = verifyArticleSnapshot(clone(fixture.topic));
		expect(ArticleVerificationResultSchema.parse(result)).toEqual(result);
		expect(result.summary.total).toBe(TOTAL_CHECK_COUNT);
		if (fixture.publication === null) {
			expect(result.areas.publication.status).toBe('NOT_APPLICABLE');
			expect(result.summary.notApplicable).toBe(5);
		} else {
			expect(result.summary.notApplicable).toBe(0);
		}
	});

	it('reports PASS for all fixtures after composing post-promotion CONTENT lineage', () => {
		const results = FROZEN_ARTICLE_FIXTURES.map(fixture => verifyArticleSnapshot(clone(fixture.topic)));
		expect(results.map(result => [result.topic, result.overall])).toEqual([
			['php-arrays', 'PASS'],
			['php-control-flow', 'PASS'],
			['javascript-if-else', 'PASS'],
			['javascript-arrays', 'PASS'],
			['javascript-dom', 'PASS'],
			['markdown', 'PASS'],
			['javascript-calculator', 'PASS'],
			['api-http-json', 'PASS'],
			['git-local-basics', 'PASS'],
			['curl-http-basics', 'PASS'],
			['python-fundamentals', 'PASS'],
		]);
		expect(results[0]!.areas.publication.checks.contentLineage.status).toBe('PASS');
		expect(results[0]!.areas.publication.checks.contentIntegrity.status).toBe('PASS');
		expect(results[1]!.areas.publication.checks.contentLineage.status).toBe('PASS');
	});

	it('detects a changed SOURCE hash', () => {
		const snapshot = clone('javascript-if-else');
		const source = Object.keys(snapshot.sourceFiles)[0]!;
		snapshot.sourceFiles[source] += '\nchanged';
		expect(verifyArticleSnapshot(snapshot).areas.source.checks.hash.status).toBe('FAIL');
	});

	it('detects Critic != PASS even when the new review bytes are rebound in candidate metadata', () => {
		const snapshot = clone('javascript-if-else');
		const candidateRef = snapshot.fixture.candidateRef;
		const candidate = JSON.parse(snapshot.projectFiles[candidateRef]!) as Record<string, unknown>;
		const reviewRef = candidate.criticReviewRef as string;
		const reviewText = replaceJson(snapshot, reviewRef, review => { review.verdict = 'REVISE'; });
		replaceJson(snapshot, candidateRef, value => { value.criticReviewHash = hashBytes(reviewText); });
		expect(verifyArticleSnapshot(snapshot).areas.critic.checks.verdict.status).toBe('FAIL');
	});

	it('detects a candidate hash mismatch', () => {
		const snapshot = clone('javascript-arrays');
		replaceJson(snapshot, snapshot.fixture.candidateRef, candidate => { candidate.articleHash = '0'.repeat(64); });
		expect(verifyArticleSnapshot(snapshot).areas.candidate.checks.integrity.status).toBe('FAIL');
	});

	it('detects Markdown changed after review', () => {
		const snapshot = clone('javascript-dom');
		const articleRef = snapshot.fixture.candidateRef.replace(/\.json$/, '.md');
		snapshot.projectFiles[articleRef] += '\nchanged after review\n';
		expect(verifyArticleSnapshot(snapshot).areas.candidate.checks.reviewedVersion.status).toBe('FAIL');
	});

	it('detects missing required runtime evidence', () => {
		const snapshot = clone('php-control-flow');
		const candidate = JSON.parse(snapshot.projectFiles[snapshot.fixture.candidateRef]!) as Record<string, unknown>;
		snapshot.projectFiles[candidate.runtimeVerification as string] = undefined;
		expect(verifyArticleSnapshot(snapshot).areas.runtime.checks.evidence.status).toBe('FAIL');
	});

	it('detects a false publication flag', () => {
		const snapshot = clone('javascript-if-else');
		replaceJson(snapshot, snapshot.fixture.candidateRef, candidate => { candidate.approvedForPublication = true; });
		const result = verifyArticleSnapshot(snapshot);
		expect(result.areas.candidate.checks.schema.status).toBe('FAIL');
		expect(result.areas.candidate.checks.publicationFlags.status).toBe('FAIL');
	});

	it('detects a publication decision bound to a different candidate', () => {
		const snapshot = clone('php-control-flow');
		const decisionRef = snapshot.fixture.publication!.decisionRef;
		replaceJson(snapshot, decisionRef, decision => { decision.candidateHash = '0'.repeat(64); });
		expect(verifyArticleSnapshot(snapshot).areas.publication.checks.decision.status).toBe('FAIL');
	});

	it('detects a broken post-promotion CONTENT lineage', () => {
		const snapshot = clone('php-arrays');
		const lineageRef = 'lab/reports/tablice-w-php-content-lineage.json';
		replaceJson(snapshot, lineageRef, lineage => {
			const records = lineage.records as Record<string, unknown>[];
			records[0]!.newContentHash = '0'.repeat(64);
		});
		const result = verifyArticleSnapshot(snapshot);
		expect(result.areas.publication.checks.contentLineage.status).toBe('FAIL');
		expect(result.overall).toBe('FAIL');
	});
});
