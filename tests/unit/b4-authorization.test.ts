import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashBytes } from '../../engine/core/editorial-context.ts';
import { B4AuthorizationSchema, validateB4Authorization, validateBatchAuthorization } from '../../engine/core/b4-authorization.ts';

describe('B4 bounded publication authorization', () => {
	it('binds exactly B1 ranks 5–7 and all required publication stages', async () => {
		const text = await readFile(join(process.cwd(), 'lab/decisions/b4-authorization.json'), 'utf8');
		const record = B4AuthorizationSchema.parse(JSON.parse(text));
		expect(record.jobs.map(job => [job.order, job.b1Rank, job.topic, job.origin])).toEqual([
			[1, 5, 'markdown', 'MODERNIZE'],
			[2, 6, 'javascript-calculator', 'MODERNIZE'],
			[3, 7, 'api-http-json', 'MODERNIZE'],
		]);
		expect(record).toMatchObject({ publicationApproved: true, contentWriteApproved: true, gitApproved: true, deploymentApproved: true, otherRanksApproved: false });
		const first = record.jobs[0]!;
		expect(validateB4Authorization(text, hashBytes(text), first.topic, [first.source]).job.b1Rank).toBe(5);
		expect(validateBatchAuthorization('lab/decisions/b4-authorization.json', text, hashBytes(text), first.topic, [first.source]).job.order).toBe(1);
	});

	it('rejects a forged source, hash or unsupported authorization reference', async () => {
		const text = await readFile(join(process.cwd(), 'lab/decisions/b4-authorization.json'), 'utf8');
		const record = B4AuthorizationSchema.parse(JSON.parse(text));
		const first = record.jobs[0]!;
		expect(() => validateB4Authorization(text, hashBytes(text), first.topic, [{ ...first.source, sourceId: 'forged' }])).toThrow(/authorization/);
		expect(() => validateB4Authorization(text, '0'.repeat(64), first.topic, [first.source])).toThrow(/authorization/);
		expect(() => validateBatchAuthorization('lab/decisions/unknown.json', text, hashBytes(text), first.topic, [first.source])).toThrow('Unsupported');
	});
});
