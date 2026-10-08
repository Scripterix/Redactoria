import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseLegacyPost } from '../../scripts/legacy/parser.ts';

function fixture(name: string) {
	return readFileSync(new URL(`../fixtures/legacy-posts/${name}`, import.meta.url));
}

describe('legacy metadata parser', () => {
	it('extracts source metadata and counts only body words', () => {
		const record = parseLegacyPost(fixture('valid-post.md'), 'valid-post.md');
		expect(record).toMatchObject({
			source_id: '101', source_path: 'valid-post.md', title: 'Podstawy funkcji',
			slug: 'podstawy-funkcji', original_date: '2025-02-06 07:12:46',
			original_author: 'Scripterix', categories: ['Programming'],
			tags: ['javascript', 'functions'],
			original_url: 'https://example.test/posts/podstawy-funkcji/',
			word_count: 5, bom_detected: false, parse_status: 'ok',
			warnings: [], review_status: 'unreviewed',
		});
	});

	it('handles a real UTF-8 BOM while hashing the original bytes', () => {
		const bytes = fixture('bom-prefixed.md');
		expect([...bytes.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
		const record = parseLegacyPost(bytes, 'bom-prefixed.md');
		expect(record.bom_detected).toBe(true);
		expect(record.title).toBe('Tekst z BOM');
		expect(record.parse_status).toBe('ok');
		expect(record.content_hash).toBe(createHash('sha256').update(bytes).digest('hex'));
		expect(record.content_hash).not.toBe(createHash('sha256').update(bytes.subarray(3)).digest('hex'));
	});

	it('preserves Polish Unicode in all fields', () => {
		const record = parseLegacyPost(fixture('unicode-polish.md'), 'unicode-polish.md');
		expect(record.title).toBe('Zażółć gęślą jaźń — ą ć ę ł ń ó ś ź ż');
		expect(record.original_author).toBe('Łukasz');
		expect(record.tags).toEqual(['źródła', 'żółć']);
		expect(record.word_count).toBe(5);
	});

	it('preserves percent-encoded slugs and URLs verbatim', () => {
		const record = parseLegacyPost(fixture('encoded-slug.md'), 'encoded-slug.md');
		expect(record.slug).toBe('wersje-v16%e2%86%92v20');
		expect(record.original_url).toBe('https://example.test/posts/wersje-v16%e2%86%92v20/');
	});

	it.each([
		['missing-author.md', 'original_author', 'missing:author'],
		['missing-date.md', 'original_date', 'missing:date'],
	] as const)('records missing metadata in %s instead of inventing it', (name, field, warning) => {
		const record = parseLegacyPost(fixture(name), name);
		expect(record[field]).toBeNull();
		expect(record.warnings).toContain(warning);
		expect(record.parse_status).toBe('needs-review');
	});

	it('returns a controlled error record for malformed YAML', () => {
		const record = parseLegacyPost(fixture('malformed-frontmatter.md'), 'malformed-frontmatter.md');
		expect(record.parse_status).toBe('error');
		expect(record.source_id).toBe('path:malformed-frontmatter.md');
		expect(record.title).toBeNull();
		expect(record.warnings.some((warning) => warning.startsWith('yaml:'))).toBe(true);
		expect(record.content_hash).toMatch(/^[a-f0-9]{64}$/);
	});

	it('uses a stable relative path identity when post_id is missing', () => {
		const source = fixture('valid-post.md').toString('utf8').replace(/^post_id: 101\r?\n/m, '');
		const record = parseLegacyPost(Buffer.from(source), 'nested/no-id.md');
		expect(record.source_id).toBe('path:nested/no-id.md');
		expect(record.warnings).toContain('missing:post_id');
	});

	it.each([
		['plain body without metadata', 'frontmatter:missing'],
		['---\njust plain text\n---\nbody', 'frontmatter:not_mapping'],
		['---\ntitle: one\ntitle: two\n---\nbody', 'yaml:'],
	])('controls malformed front matter: %s', (source, warning) => {
		const record = parseLegacyPost(Buffer.from(source), 'broken.md');
		expect(record.parse_status).toBe(warning === 'frontmatter:missing' ? 'needs-review' : 'error');
		expect(record.warnings.some((item) => item.startsWith(warning))).toBe(true);
	});

	it('distinguishes missing front matter from an unterminated block', () => {
		const record = parseLegacyPost(Buffer.from('---\ntitle: missing end\nbody'), 'unfinished.md');
		expect(record.parse_status).toBe('error');
		expect(record.warnings).toContain('frontmatter:unterminated');
	});

	it('rejects invalid metadata types without coercing them into invented values', () => {
		const source = '---\ntitle: true\nauthor: [person]\ndate: 2025-02-30\npost_id: 1.2\n' +
			'categories: 42\ntags: [good, 42]\nslug: okay\noriginal_url: javascript:alert(1)\n---\nBody';
		const record = parseLegacyPost(Buffer.from(source), 'types.md');
		expect(record.title).toBeNull();
		expect(record.original_author).toBeNull();
		expect(record.original_date).toBe('2025-02-30');
		expect(record.categories).toEqual([]);
		expect(record.tags).toEqual(['good']);
		expect(record.warnings).toEqual(expect.arrayContaining([
			'invalid:title', 'invalid:author', 'invalid:date', 'invalid:post_id',
			'invalid:categories', 'invalid:tags', 'invalid:original_url',
		]));
	});

	it('retains legacy scalar categories without splitting or inventing values', () => {
		const source = fixture('valid-post.md').toString('utf8').replace('categories: [Programming]', 'categories: coding corner');
		const record = parseLegacyPost(Buffer.from(source), 'scalar-category.md');
		expect(record.categories).toEqual(['coding corner']);
		expect(record.warnings).toContain('scalar_list:categories');
		expect(record.parse_status).toBe('needs-review');
	});

	it('controls invalid UTF-8 while retaining the source hash', () => {
		const bytes = Buffer.from([0xff, 0xfe, 0x80]);
		const record = parseLegacyPost(bytes, 'invalid-encoding.md');
		expect(record.parse_status).toBe('error');
		expect(record.warnings).toContain('encoding:invalid_utf8');
		expect(record.word_count).toBeNull();
	});

	it('accepts CRLF delimiters and preserves string post IDs', () => {
		const source = fixture('valid-post.md').toString('utf8')
			.replace('post_id: 101', 'post_id: "00101"').replace(/\r?\n/g, '\r\n');
		expect(parseLegacyPost(Buffer.from(source), 'crlf.md').source_id).toBe('00101');
	});
});
