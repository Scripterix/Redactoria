import { createHash } from 'node:crypto';
import { parseDocument } from 'yaml';
import type { InventoryRecord } from './types.ts';

/** Calendar check deliberately avoids host timezone and permissive Date parsing. */
export function isSourceDate(value: string): boolean {
	const match = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/.exec(value);
	if (!match) return false;
	const [, yearText, monthText, dayText, hoursText, minutesText, secondsText] = match;
	const year = Number(yearText);
	const month = Number(monthText);
	const day = Number(dayText);
	const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	const monthDays = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return month >= 1 && month <= 12 && day >= 1 && day <= monthDays[month - 1]!
		&& (hoursText === undefined || (Number(hoursText) < 24 && Number(minutesText) < 60 && Number(secondsText) < 60))
		&& !/[+-](?:2[4-9]|[3-9]\d):\d{2}$|[+-]\d{2}:[6-9]\d$/.test(value);
}

export function parseLegacyPost(bytes: Uint8Array, sourcePath: string): InventoryRecord {
	const record: InventoryRecord = {
		source_id: `path:${sourcePath}`, source_path: sourcePath,
		title: null, slug: null, original_url: null, original_date: null, original_author: null,
		categories: [], tags: [], word_count: null,
		content_hash: createHash('sha256').update(bytes).digest('hex'),
		bom_detected: bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf,
		parse_status: 'ok', warnings: [], review_status: 'unreviewed',
	};
	let source: string;
	try {
		source = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
	} catch {
		record.parse_status = 'error';
		record.warnings.push('encoding:invalid_utf8');
		return record;
	}
	if (record.bom_detected) source = source.slice(1);
	const opening = /^---[ \t]*\r?\n/.exec(source);
	if (!opening) {
		record.parse_status = 'needs-review';
		record.warnings.push('frontmatter:missing');
		record.word_count = countWords(source);
		return record;
	}
	const remainder = source.slice(opening[0].length);
	const closing = /^---[ \t]*(?:\r?\n|$)/m.exec(remainder);
	if (!closing) {
		record.parse_status = 'error';
		record.warnings.push('frontmatter:unterminated');
		return record;
	}
	record.word_count = countWords(remainder.slice(closing.index + closing[0].length));
	let metadata: Record<string, unknown>;
	try {
		const document = parseDocument(remainder.slice(0, closing.index), {
			version: '1.2', schema: 'core', resolveKnownTags: false, stringKeys: true,
		});
		for (const warning of document.warnings) record.warnings.push(`yaml:${warning.code}`);
		if (document.errors.length) {
			for (const error of document.errors) record.warnings.push(`yaml:${error.code}`);
			record.parse_status = 'error';
			return record;
		}
		const value: unknown = document.toJS({ maxAliasCount: 100 });
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			record.parse_status = 'error';
			record.warnings.push('frontmatter:not_mapping');
			return record;
		}
		metadata = value as Record<string, unknown>;
	} catch {
		record.parse_status = 'error';
		record.warnings.push('frontmatter:conversion_error');
		return record;
	}

	function text(field: string): string | null {
		const value = metadata[field];
		if (value == null || value === '') {
			record.warnings.push(`missing:${field}`);
			return null;
		}
		if (typeof value !== 'string' || value.trim() === '') {
			record.warnings.push(`invalid:${field}`);
			return null;
		}
		return value;
	}
	function list(field: string): string[] {
		const value = metadata[field];
		if (value == null) {
			record.warnings.push(`missing:${field}`);
			return [];
		}
		if (typeof value === 'string' && value.trim() !== '') {
			record.warnings.push(`scalar_list:${field}`);
			return [value];
		}
		if (!Array.isArray(value)) {
			record.warnings.push(`invalid:${field}`);
			return [];
		}
		const strings = value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
		if (strings.length !== value.length) record.warnings.push(`invalid:${field}`);
		return strings;
	}
	const postId = metadata.post_id;
	if (typeof postId === 'string' && postId.trim() !== '') record.source_id = postId;
	else if (typeof postId === 'number' && Number.isSafeInteger(postId) && postId >= 0) record.source_id = String(postId);
	else record.warnings.push(postId == null || postId === '' ? 'missing:post_id' : 'invalid:post_id');
	record.title = text('title');
	record.slug = text('slug');
	record.original_url = text('original_url');
	record.original_date = text('date');
	record.original_author = text('author');
	record.categories = list('categories');
	record.tags = list('tags');
	if (record.original_date && !isSourceDate(record.original_date)) record.warnings.push('invalid:date');
	if (record.original_url) {
		try {
			if (!['http:', 'https:'].includes(new URL(record.original_url).protocol)) record.warnings.push('invalid:original_url');
		} catch {
			record.warnings.push('invalid:original_url');
		}
	}
	if (record.warnings.length) record.parse_status = 'needs-review';
	return record;
}

function countWords(body: string): number {
	return body.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’_-]*/gu)?.length ?? 0;
}
