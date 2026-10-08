import { describe, expect, it } from 'vitest';
import { parseLegacyPost } from '../../scripts/legacy/parser.ts';
import { createCorpusSummary } from '../../scripts/legacy/summary.ts';
import type { Inventory } from '../../scripts/legacy/types.ts';

function record(path: string, title: string, slug: string, body: string, date: string) {
	return parseLegacyPost(Buffer.from(
		`---\ntitle: "${title}"\nslug: ${slug}\ndate: ${date}\nauthor: Test\n` +
		'post_id: 1\ncategories: [Coding, Coding]\ntags: [javascript]\noriginal_url: https://example.test/\n---\n' + body,
	), path);
}

describe('deterministic corpus summary', () => {
	it('reports dates, exact duplicates, and length statistics without semantic scores', () => {
		const first = record('a.md', 'Title', 'first', 'one two', '2025-01-01');
		const second = record('b.md', 'Title', 'first', 'one two three four', '2025-01-03');
		const inventory: Inventory = { schema_version: 1, articles: [first, second] };
		const summary = createCorpusSummary(inventory);
		expect(summary).toContain('Source files: 2');
		expect(summary).toContain('Oldest: 2025-01-01');
		expect(summary).toContain('Newest: 2025-01-03');
		expect(summary).toContain('Median word count: 3');
		expect(summary).toContain('Mean word count: 3.00');
		expect(summary).toContain('Maximum word count: 4');
		expect(summary).toContain('- Coding: 2');
		expect(summary).toContain('- Title: a.md, b.md');
		expect(summary).toContain('- first: a.md, b.md');
		expect(summary).not.toContain('modernization_score');
	});

	it('reports identical original bytes as duplicate hashes', () => {
		const first = record('a.md', 'Title', 'first', 'body', '2025-01-01');
		const second = { ...first, source_path: 'b.md' };
		expect(createCorpusSummary({ schema_version: 1, articles: [first, second] }))
			.toContain(`${first.content_hash}: a.md, b.md`);
	});

	it('reports empty corpora and excludes invalid dates from the range', () => {
		expect(createCorpusSummary({ schema_version: 1, articles: [] })).toContain('Median word count: None');
		const invalidDate = record('a.md', 'Invalid date', 'a', 'body', '2025-02-30');
		const summary = createCorpusSummary({ schema_version: 1, articles: [invalidDate] });
		expect(summary).toContain('Oldest: None');
		expect(summary).toContain('Invalid dates: 1');
		expect(summary).toContain('Review required: 1');
	});
});
