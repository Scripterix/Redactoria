import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateBatchAuthorization } from '../../engine/core/b4-authorization.ts';
import { B5AuthorizationSchema, validateB5Authorization } from '../../engine/core/b5-authorization.ts';
import { hashBytes, RuntimeTargetSchema } from '../../engine/core/editorial-context.ts';
import { CodeExampleSchema } from '../../engine/agents/writer/contract.ts';

describe('B5 bounded candidate authorization', () => {
	it('binds exactly B1 ranks 8–10 without publication authority', async () => {
		const text = await readFile(join(process.cwd(), 'lab/decisions/b5-authorization.json'), 'utf8');
		const record = B5AuthorizationSchema.parse(JSON.parse(text));
		expect(record.jobs.map(job => [job.order, job.b1Rank, job.topic, job.origin])).toEqual([
			[1, 8, 'git-local-basics', 'MODERNIZE'],
			[2, 9, 'curl-http-basics', 'MODERNIZE'],
			[3, 10, 'python-fundamentals', 'MODERNIZE'],
		]);
		expect(record).toMatchObject({
			publicationApproved: false,
			contentWriteApproved: false,
			gitApproved: false,
			deploymentApproved: false,
			otherRanksApproved: false,
		});
		const first = record.jobs[0]!;
		expect(validateB5Authorization(text, hashBytes(text), first.topic, [first.source]).job.b1Rank).toBe(8);
		expect(validateBatchAuthorization('lab/decisions/b5-authorization.json', text, hashBytes(text), first.topic, [first.source]).job.order).toBe(1);
	});

	it('rejects a forged source, hash or added publication stage', async () => {
		const text = await readFile(join(process.cwd(), 'lab/decisions/b5-authorization.json'), 'utf8');
		const record = B5AuthorizationSchema.parse(JSON.parse(text));
		const first = record.jobs[0]!;
		expect(() => validateB5Authorization(text, hashBytes(text), first.topic, [{ ...first.source, sourceId: 'forged' }])).toThrow(/authorization/);
		expect(() => validateB5Authorization(text, '0'.repeat(64), first.topic, [first.source])).toThrow(/authorization/);
		const forged = JSON.stringify({ ...record, publicationApproved: true });
		expect(() => B5AuthorizationSchema.parse(JSON.parse(forged))).toThrow();
	});

	it('accepts bounded CLI runtimes and shell/Python examples', () => {
		expect(RuntimeTargetSchema.parse({ id: 'git', kind: 'cli', version: '2.21.0.windows.1' })).toEqual({
			id: 'git', kind: 'cli', version: '2.21.0.windows.1',
		});
		expect(CodeExampleSchema.parse({ id: 'shell-example', purpose: 'Git status', code: 'git status --short', expectedOutput: '', expectedDiagnostics: [], language: 'shell' }).language).toBe('shell');
		expect(CodeExampleSchema.parse({ id: 'python-example', purpose: 'Python output', code: 'print(1)', expectedOutput: '1\n', expectedDiagnostics: [], language: 'python' }).language).toBe('python');
	});
});
