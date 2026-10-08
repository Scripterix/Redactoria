import { describe, expect, it } from 'vitest';
import { CartographerResultSchema } from '../contract.ts';
import { ALLOWED_ACTIONS, CARTOGRAPHER_POLICY } from '../policies.ts';
import { validateAnalysis, validateCoarsePlan, validateInput } from '../../../validation/cartographer.ts';
import { sampleAnalysis, sampleInput, samplePlan, sampleReads, titleEvidence } from './helpers.ts';

describe('Cartographer contracts and grounded policies', () => {
	it('accepts a grounded analysis and keeps proposals distinct from execution permissions', () => {
		expect(validateAnalysis(sampleAnalysis(), sampleInput(), sampleReads()).candidates[0]!.action).toBe('REVIEW');
		expect(CARTOGRAPHER_POLICY.mustNot).toContain('invoke_other_agent');
		expect(CARTOGRAPHER_POLICY.mustNot).toContain('modify_content');
	});
	it.each(['PUBLISH', 'MERGE_TO_MAIN', 'DELETE_SOURCE'])('rejects forbidden action %s', (action) => {
		const analysis = sampleAnalysis();
		Object.assign(analysis.candidates[0]!, { action });
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow();
	});
	it.each(ALLOWED_ACTIONS)('accepts only a well-formed %s proposal', (action) => {
		const analysis = sampleAnalysis();
		const candidate = analysis.candidates[0]!;
		candidate.action = action;
		if (action === 'MERGE') { candidate.target.sourceIds.push(titleEvidence(1).sourceId); candidate.evidence.push(titleEvidence(1)); }
		if (action === 'NEW_CONTENT') candidate.target = { kind: 'new-content', sourceIds: [], domainId: 'domain', proposedTitle: 'A prerequisite' };
		expect(validateAnalysis(analysis, sampleInput(), []).candidates[0]!.action).toBe(action);
	});
	it.each([-0.1, 1.1, NaN, Infinity])('rejects invalid confidence %s', (confidence) => {
		const analysis = sampleAnalysis(); analysis.candidates[0]!.confidence = confidence;
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow();
	});
	it('requires nonempty evidence, nonblank reasons and known priorities', () => {
		const analysis = sampleAnalysis(); analysis.candidates[0]!.evidence = [];
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow();
		analysis.candidates[0]!.evidence = [titleEvidence()]; analysis.candidates[0]!.reason = ' ';
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow();
		analysis.candidates[0]!.reason = 'Valid'; Object.assign(analysis.candidates[0]!, { priority: 'urgent' });
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow();
	});
	it('rejects invented metadata, paths and article IDs', () => {
		for (const change of [{ value: 'Invented title' }, { sourcePath: 'invented.md' }, { sourceId: 'missing' }]) {
			const analysis = sampleAnalysis(); Object.assign(analysis.candidates[0]!.evidence[0]!, change);
			expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow();
		}
	});
	it('requires body evidence to be an exact excerpt of a supplied selected body', () => {
		const analysis = sampleAnalysis(); Object.assign(analysis.candidates[0]!.evidence[0]!, { field: 'body', value: 'body about arrays' });
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow('not supplied');
		expect(validateAnalysis(analysis, sampleInput(), sampleReads())).toBeTruthy();
		analysis.candidates[0]!.evidence[0]!.value = 'Invented quote';
		expect(() => validateAnalysis(analysis, sampleInput(), sampleReads())).toThrow('not supplied');
	});
	it('checks every MERGE target and distinguishes NEW_CONTENT from article actions', () => {
		const analysis = sampleAnalysis(); const candidate = analysis.candidates[0]!;
		candidate.action = 'MERGE';
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow('at least two');
		candidate.target.sourceIds.push(titleEvidence(1).sourceId);
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow('requires evidence');
		candidate.action = 'NEW_CONTENT';
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow('new-content');
	});
	it('rejects unknown references, duplicate IDs, hierarchy cycles and out-of-domain clusters', () => {
		const unknown = sampleAnalysis(); unknown.candidates[0]!.target.sourceIds = ['unknown'];
		expect(() => validateAnalysis(unknown, sampleInput(), [])).toThrow('Unknown source');
		const duplicate = sampleAnalysis(); duplicate.domains.push(structuredClone(duplicate.domains[0]!));
		expect(() => validateAnalysis(duplicate, sampleInput(), [])).toThrow('Duplicate');
		const cycle = sampleAnalysis(); cycle.domains[0]!.parentId = 'domain';
		expect(() => validateAnalysis(cycle, sampleInput(), [])).toThrow('cycle');
		const outside = sampleAnalysis(); outside.clusters[0]!.domainId = 'unknown';
		expect(() => validateAnalysis(outside, sampleInput(), [])).toThrow('outside');
	});
	it('requires child membership to be a subset of the parent', () => {
		const analysis = sampleAnalysis(); analysis.domains[0]!.articleIds = [titleEvidence().sourceId];
		analysis.domains.push({ ...analysis.domains[0]!, id: 'child', parentId: 'domain', articleIds: [titleEvidence(1).sourceId], evidence: [titleEvidence(1)] });
		expect(() => validateAnalysis(analysis, sampleInput(), [])).toThrow('subset');
	});
	it('rejects unsupported inventory schemas, duplicate source IDs and unsafe source paths', () => {
		const input = sampleInput(); Object.assign(input.inventory, { schema_version: 2 });
		expect(() => validateInput(input)).toThrow();
		for (const sourcePath of ['../escape.md', '/absolute.md', 'C:/source.md', 'nested\\post.md', 'a/./b.md']) {
			const item = sampleInput(); item.inventory.articles[0]!.source_path = sourcePath;
			expect(() => validateInput(item)).toThrow('relative POSIX');
		}
		const duplicate = sampleInput(); duplicate.inventory.articles[1]!.source_id = duplicate.inventory.articles[0]!.source_id;
		expect(() => validateInput(duplicate)).toThrow('Duplicate');
	});
	it('rejects invalid final schema version and unknown output properties', () => {
		expect(() => CartographerResultSchema.parse({ schemaVersion: 2 })).toThrow();
		expect(() => validateAnalysis({ ...sampleAnalysis(), publish: true }, sampleInput(), [])).toThrow();
	});
	it('rejects oversized or duplicate read plans before opening any source', () => {
		const input = sampleInput(); input.limits.maxDeepReads = 0;
		expect(() => validateCoarsePlan(samplePlan(), input)).toThrow('budget');
		const plan = samplePlan(); plan.deepReadRequests.push(plan.deepReadRequests[0]!);
		expect(() => validateCoarsePlan(plan, sampleInput())).toThrow('Duplicate');
	});
});
