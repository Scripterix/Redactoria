import { compareText } from './inventory.ts';
import { isSourceDate } from './parser.ts';
import type { Inventory, InventoryRecord } from './types.ts';

export function corpusCounts(inventory: Inventory) {
	return {
		files: inventory.articles.length,
		ok: inventory.articles.filter((record) => record.parse_status === 'ok').length,
		review: inventory.articles.filter((record) => record.parse_status === 'needs-review').length,
		errors: inventory.articles.filter((record) => record.parse_status === 'error').length,
	};
}

function md(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/([`*_[\]<>|])/g, '\\$1').replace(/[\r\n]/g, ' ');
}

function frequencies(values: string[]): string[] {
	const counts = new Map<string, number>();
	for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
	return [...counts].sort((a, b) => b[1] - a[1] || compareText(a[0], b[0]))
		.map(([value, count]) => `- ${md(value)}: ${count}`);
}

export function createCorpusSummary(inventory: Inventory): string {
	const records = inventory.articles;
	const counts = corpusCounts(inventory);
	const dated = records.filter((record) => record.original_date && isSourceDate(record.original_date))
		.sort((a, b) => compareText(a.original_date!, b.original_date!) || compareText(a.source_path, b.source_path));
	const lengths = records.flatMap((record) => record.word_count === null ? [] : [record.word_count]).sort((a, b) => a - b);
	const middle = Math.floor(lengths.length / 2);
	const median = lengths.length ? (lengths.length % 2 ? lengths[middle]! : (lengths[middle - 1]! + lengths[middle]!) / 2) : null;
	const missing = (field: 'title' | 'slug' | 'original_url' | 'original_date' | 'original_author') => records.filter((record) => record[field] === null).length;
	const dateLine = (record: InventoryRecord | undefined) => record
		? `${md(record.original_date!)} — ${md(record.title ?? record.source_path)}` : 'None';
	const lines = [
		'# Legacy corpus summary', '',
		'Deterministic metadata report. No editorial or technical quality assessment is made.', '',
		'## Corpus', '',
		`- Source files: ${counts.files}`, `- Parsed OK: ${counts.ok}`,
		`- Review required: ${counts.review}`, `- Parse errors: ${counts.errors}`, '',
		'Counts are mutually exclusive parser statuses. Every record remains editorially unreviewed.', '',
		'## Dates', '',
		`- Oldest: ${dateLine(dated[0])}`, `- Newest: ${dateLine(dated.at(-1))}`,
		`- Missing dates: ${missing('original_date')}`,
		`- Invalid dates: ${records.filter((record) => record.warnings.includes('invalid:date')).length}`, '',
		'Dates are source strings; no timezone is inferred. Range uses valid calendar date/time strings.', '',
		'## Authors', '',
		...frequencies(records.flatMap((record) => record.original_author === null ? [] : [record.original_author])),
		`- Missing author values: ${missing('original_author')}`, '',
		'## Categories', '',
		...frequencies(records.flatMap((record) => [...new Set(record.categories)])), '',
		'## Tags', '',
		...frequencies(records.flatMap((record) => [...new Set(record.tags)])), '',
		'Category/tag counts represent documents containing the exact value, ordered by count then lexicographically (UTF-16).', '',
		'## Length', '',
		`- Minimum word count: ${lengths[0] ?? 'None'}`, `- Median word count: ${median ?? 'None'}`,
		`- Mean word count: ${lengths.length ? (lengths.reduce((sum, count) => sum + count, 0) / lengths.length).toFixed(2) : 'None'}`,
		`- Maximum word count: ${lengths.at(-1) ?? 'None'}`,
		`- Unknown body length: ${records.length - lengths.length}`, '',
		'Word count approximates Unicode letter/number tokens in the body, including code. Front matter is excluded.', '',
		'## Data quality', '',
		`- Missing title: ${missing('title')}`, `- Missing slug: ${missing('slug')}`,
		`- Missing original_url: ${missing('original_url')}`,
		`- UTF-8 BOM: ${records.filter((record) => record.bom_detected).length}`,
		`- Malformed/undecodable documents: ${counts.errors}`, '',
		'### Warnings', '',
		...frequencies(records.flatMap((record) => record.warnings)),
	];
	if (!records.some((record) => record.warnings.length)) lines.push('None.');
	lines.push('', '### Records requiring metadata review or error handling', '');
	const issues = records.filter((record) => record.parse_status !== 'ok');
	for (const record of issues) lines.push(`- ${md(record.source_path)} (${record.parse_status}): ${record.warnings.map(md).join(', ')}`);
	if (!issues.length) lines.push('None.');
	lines.push('', '## Potential duplicates', '', 'Exact source values only; no semantic similarity analysis.', '');
	for (const key of ['title', 'slug', 'content_hash'] as const) {
		lines.push(`### Identical ${key}`, '');
		const groups = new Map<string, string[]>();
		for (const record of records) {
			const value = record[key];
			if (value === null) continue;
			groups.set(value, [...(groups.get(value) ?? []), record.source_path]);
		}
		const duplicates = [...groups].filter(([, paths]) => paths.length > 1).sort((a, b) => compareText(a[0], b[0]));
		for (const [value, paths] of duplicates) lines.push(`- ${md(value)}: ${paths.sort(compareText).map(md).join(', ')}`);
		if (!duplicates.length) lines.push('None.');
		lines.push('');
	}
	return `${lines.join('\n').trimEnd()}\n`;
}
