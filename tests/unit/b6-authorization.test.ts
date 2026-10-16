import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateBatchAuthorization } from '../../engine/core/b4-authorization.ts';
import { B6AuthorizationSchema, validateB6Authorization } from '../../engine/core/b6-authorization.ts';
import { hashBytes } from '../../engine/core/editorial-context.ts';

describe('B6 bounded foundation authorization', () => {
	it('binds exactly three LAB-only foundation jobs and distinguishes new content from a rewrite', async () => {
		const text = await readFile(join(process.cwd(), 'lab/decisions/b6-authorization.json'), 'utf8');
		const record = B6AuthorizationSchema.parse(JSON.parse(text));
		expect(record.jobs.map((job) => [job.order, job.topic, job.origin, job.cartographerActionExpected])).toEqual([
			[1, 'php-language-foundation', 'CREATE_NEW', 'NEW_CONTENT'],
			[2, 'javascript-language-foundation', 'CREATE_NEW', 'NEW_CONTENT'],
			[3, 'javascript-functions-callbacks', 'MODERNIZE', 'REWRITE'],
		]);
		expect(record).toMatchObject({
			publicationApproved: false,
			contentWriteApproved: false,
			gitApproved: false,
			deploymentApproved: false,
			otherTopicsApproved: false,
		});
		const first = record.jobs[0]!;
		expect(validateB6Authorization(text, hashBytes(text), first.topic, [first.source]).job.order).toBe(1);
		expect(validateBatchAuthorization('lab/decisions/b6-authorization.json', text, hashBytes(text), first.topic, [first.source]).job.order).toBe(1);
	});

	it('rejects a forged context source, hash, topic or publication authority', async () => {
		const text = await readFile(join(process.cwd(), 'lab/decisions/b6-authorization.json'), 'utf8');
		const record = B6AuthorizationSchema.parse(JSON.parse(text));
		const first = record.jobs[0]!;
		expect(() => validateB6Authorization(text, hashBytes(text), first.topic, [{ ...first.source, sourcePath: 'forged.md' }])).toThrow(/authorization/);
		expect(() => validateB6Authorization(text, '0'.repeat(64), first.topic, [first.source])).toThrow(/authorization/);
		expect(() => validateB6Authorization(text, hashBytes(text), 'not-authorized', [first.source])).toThrow(/authorization/);
		expect(() => B6AuthorizationSchema.parse({ ...record, publicationApproved: true })).toThrow();
	});
});
