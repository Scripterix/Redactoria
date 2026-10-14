import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
	FROZEN_ARTICLE_FIXTURES,
	loadArticleVerificationSnapshot,
	verifyArticle,
	verifyArticleSnapshot,
	type ArticleVerificationSnapshot,
} from '../../engine/validation/article-verification.ts';
import { ArticleVerificationResultSchema } from '../../engine/validation/article-verification-contract.ts';
import { runVerifyArticleCli, VERIFY_ARTICLE_EXIT } from '../../engine/validation/article-verification-cli.ts';

const projectDirectory = fileURLToPath(new URL('../../', import.meta.url));
const sourceDirectory = resolve(projectDirectory, '../temp-ogwo/posts');
const snapshots = new Map<string, ArticleVerificationSnapshot>();
const verify = (topic: string) => verifyArticle({ projectDirectory, sourceDirectory, topic });

beforeAll(async () => {
	for (const fixture of FROZEN_ARTICLE_FIXTURES) {
		snapshots.set(fixture.topic, await loadArticleVerificationSnapshot({ projectDirectory, sourceDirectory, fixture }));
	}
});

describe('verify:article operator CLI', () => {
	it.each(FROZEN_ARTICLE_FIXTURES)('returns exit 0 for real lifecycle $topic', async fixture => {
		const result = await runVerifyArticleCli(['--topic', fixture.topic], verify);
		expect(result.exitCode).toBe(VERIFY_ARTICLE_EXIT.PASS);
		expect(result.stderr).toBe('');
		expect(result.stdout).toContain(`Article: ${fixture.topic}`);
		expect(result.stdout).toContain('OVERALL\n  PASS');
	});

	it('returns exit 2 and a concise usage error for an unknown topic', async () => {
		const result = await runVerifyArticleCli(['--topic', 'unknown-topic'], verify);
		expect(result.exitCode).toBe(VERIFY_ARTICLE_EXIT.INPUT_ERROR);
		expect(result.stdout).toBe('');
		expect(result.stderr).toContain('Unknown article topic: unknown-topic.');
		expect(result.stderr).toContain('Usage: npm run verify:article');
		expect(result.stderr).not.toContain(' at ');
	});

	it('returns exit 1 for a schema-valid failed verification', async () => {
		const snapshot = structuredClone(snapshots.get('javascript-arrays')!);
		const source = Object.keys(snapshot.sourceFiles)[0]!;
		snapshot.sourceFiles[source] += '\nbroken fixture';
		const failed = verifyArticleSnapshot(snapshot);
		const result = await runVerifyArticleCli(['--topic', 'javascript-arrays'], async () => failed);
		expect(failed.overall).toBe('FAIL');
		expect(result.exitCode).toBe(VERIFY_ARTICLE_EXIT.FAIL);
		expect(result.stdout).toContain('FAILURES');
		expect(result.stdout).toContain('SOURCE.hash');
	});

	it('--json returns only deterministic schema-valid contract JSON', async () => {
		const first = await runVerifyArticleCli(['--topic', 'javascript-dom', '--json'], verify);
		const second = await runVerifyArticleCli(['--json', '--topic', 'javascript-dom'], verify);
		expect(first.exitCode).toBe(0);
		expect(first.stderr).toBe('');
		expect(first.stdout).toBe(second.stdout);
		const parsed = ArticleVerificationResultSchema.parse(JSON.parse(first.stdout));
		expect(parsed.topic).toBe('javascript-dom');
		expect(parsed.overall).toBe('PASS');
	});

	it('validates a published JavaScript candidate through current CONTENT lineage', async () => {
		const result = ArticleVerificationResultSchema.parse(JSON.parse((await runVerifyArticleCli([
			'--topic', 'javascript-if-else', '--json',
		], verify)).stdout));
		expect(result.areas.publication.status).toBe('PASS');
		expect(Object.values(result.areas.publication.checks).every(check => check.status === 'PASS')).toBe(true);
		expect(result.areas.publication.checks.contentLineage.detail).toContain('3 post-promotion lineage record(s)');
		expect(result.overall).toBe('PASS');
	});

	it('validates PHP Arrays through the backfilled lineage and current CONTENT', async () => {
		const result = ArticleVerificationResultSchema.parse(JSON.parse((await runVerifyArticleCli([
			'--topic', 'php-arrays', '--json',
		], verify)).stdout));
		expect(result.areas.publication.checks.promotionAudit.status).toBe('PASS');
		expect(result.areas.publication.checks.contentLineage.status).toBe('PASS');
		expect(result.areas.publication.checks.contentIntegrity.status).toBe('PASS');
		expect(result.areas.publication.checks.contentLineage.detail).toContain('5 post-promotion lineage record(s)');
	});

	it('does not change loaded pipeline bytes', async () => {
		const fixture = FROZEN_ARTICLE_FIXTURES[0]!;
		const before = await loadArticleVerificationSnapshot({ projectDirectory, sourceDirectory, fixture });
		await runVerifyArticleCli(['--topic', fixture.topic], verify);
		const after = await loadArticleVerificationSnapshot({ projectDirectory, sourceDirectory, fixture });
		expect(after).toEqual(before);
	});

	it('is exposed by the npm scripts contract', async () => {
		const packageJson = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8')) as { scripts: Record<string, string> };
		expect(packageJson.scripts['verify:article']).toBe('node --experimental-strip-types scripts/verify-article.ts');
	});
});
