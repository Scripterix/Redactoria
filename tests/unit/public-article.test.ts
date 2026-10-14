import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { hashBytes } from '../../engine/core/editorial-context.ts';

const oldAudience = 'Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.';
const newAudience = 'Materiał dla początkujących i osób na poziomie średnim.';

describe('Human-authorized PHP public CONTENT changes', () => {
	it('binds the authorized PHP Arrays beginner rewrite to fresh runtime and Critic evidence', async () => {
		const [candidate, content, authorizationText, runtimeText, reviewText, lineageText] = await Promise.all([
			readFile(new URL('../../lab/candidates/php-arrays/article.md', import.meta.url), 'utf8'),
			readFile(new URL('../../content/articles/tablice-w-php.md', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/decisions/php-arrays-beginner-clarity-pass-2.json', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/research/php-arrays/clarity-pass-2-runtime.json', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/reviews/php-arrays/clarity-pass-2-review.json', import.meta.url), 'utf8'),
			readFile(new URL('../../lab/reports/tablice-w-php-content-lineage.json', import.meta.url), 'utf8'),
		]);
		const body = content.replace(/^---\r?\n[^]*?\r?\n---\r?\n/, '');
		const authorization = JSON.parse(authorizationText) as { status: string; boundaries: { contentMeaningChanged: boolean } };
		const runtime = JSON.parse(runtimeText) as { status: string; articleHash: string; exampleCount: number; executionCount: number };
		const review = JSON.parse(reviewText) as { verdict: string; reviewedContentHash: string; requiredChanges: unknown[] };
		const lineage = JSON.parse(lineageText) as { currentContentHash: string; records: { authorizationRef: string; changeType: string; newContentHash: string }[] };
		const contentHash = hashBytes(content);
		const clarityRecord = lineage.records.find(record => record.authorizationRef === 'lab/decisions/php-arrays-beginner-clarity-pass-2.json');
		expect(body).not.toBe(candidate);
		expect(body).toContain('### Jak uruchamiać przykłady');
		expect(body).toContain('KLUCZ → WARTOŚĆ');
		expect(body).toContain('### Stan tablicy krok po kroku');
		expect(body).not.toContain('Nota redakcyjna: draft w LAB');
		expect(authorization).toMatchObject({ status: 'approved', boundaries: { contentMeaningChanged: true } });
		expect(runtime).toMatchObject({ status: 'PASS', articleHash: clarityRecord?.newContentHash, exampleCount: 23, executionCount: 46 });
		expect(review).toMatchObject({ verdict: 'PASS', reviewedContentHash: clarityRecord?.newContentHash, requiredChanges: [] });
		expect(lineage.currentContentHash).toBe(contentHash);
		expect(lineage.records.at(-1)?.changeType).toBe('METADATA_ONLY');
	});

	it('applies only the authorized reader-facing cleanup to PHP Control Flow', async () => {
		const candidate = await readFile(new URL('../../lab/candidates/php-control-flow/article.md', import.meta.url), 'utf8');
		const content = await readFile(new URL('../../content/articles/instrukcje-sterujace-php.md', import.meta.url), 'utf8');
		const body = content.replace(/^---\r?\n[^]*?\r?\n---\r?\n/, '');
		const note = 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie zgody B2 oraz rzeczywiste wykonania PHP 8.4 i 8.5. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.\n\n';
		expect(candidate.split(note)).toHaveLength(2);
		expect(body).toBe(candidate.replace(oldAudience, newAudience).replace(note, ''));
	});
});
