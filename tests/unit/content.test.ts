import { describe, expect, it } from 'vitest';
import {
	filterArticlesByTopic,
	filterPublished,
	sortArticlesNewestFirst,
} from '../../src/lib/content';

describe('content selection', () => {
	it('keeps published entries and excludes non-published entries', () => {
		const entries = [
			{ id: 'published', data: { status: 'published' } },
			{ id: 'draft', data: { status: 'draft' } },
			{ id: 'review', data: { status: 'review' } },
		];

		expect(filterPublished(entries).map((entry) => entry.id)).toEqual(['published']);
	});

	it('sorts articles newest-first without mutating the input', () => {
		const older = { id: 'older', data: { created: new Date('2025-01-01T00:00:00Z') } };
		const newer = { id: 'newer', data: { created: new Date('2026-01-01T00:00:00Z') } };
		const input = [older, newer];

		expect(sortArticlesNewestFirst(input).map((entry) => entry.id)).toEqual(['newer', 'older']);
		expect(input).toEqual([older, newer]);
	});

	it('selects only articles assigned to the requested topic', () => {
		const entries = [
			{ id: 'astro', data: { topic: { id: 'web-development' } } },
			{ id: 'prompts', data: { topic: { id: 'ai' } } },
			{ id: 'typescript', data: { topic: { id: 'web-development' } } },
		];

		expect(filterArticlesByTopic(entries, 'web-development').map((entry) => entry.id)).toEqual([
			'astro',
			'typescript',
		]);
	});
});
