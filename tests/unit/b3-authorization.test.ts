import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashBytes } from '../../engine/core/editorial-context.ts';
import { B3AuthorizationSchema, validateB3Authorization } from '../../engine/core/b3-authorization.ts';

describe('B3 bounded authorization', () => {
 it('binds exactly three ordered topics and refuses a different source', async () => {
  const text = await readFile(join(process.cwd(), 'lab/decisions/b3-authorization.json'), 'utf8');
  const record = B3AuthorizationSchema.parse(JSON.parse(text));
  expect(record.jobs.map(job => [job.order, job.topic])).toEqual([
   [1, 'javascript-if-else'], [2, 'javascript-arrays'], [3, 'javascript-dom'],
  ]);
  expect(record).toMatchObject({ publicationApproved: false, contentWriteApproved: false, otherRanksApproved: false });
  expect(validateB3Authorization(text, hashBytes(text), record.jobs[0]!.topic, [record.jobs[0]!.source]).job.order).toBe(1);
  expect(() => validateB3Authorization(text, hashBytes(text), record.jobs[0]!.topic,
   [{ ...record.jobs[0]!.source, sourceId: 'forged' }])).toThrow(/authorization/);
 });
});
