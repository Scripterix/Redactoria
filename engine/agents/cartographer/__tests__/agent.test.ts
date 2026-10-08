import { describe, expect, it, vi } from 'vitest';
import { runCartographer, prepareDeepReadRequest, prepareInventoryRequest } from '../agent.ts';
import { createCartographerArtifacts, rankCandidates } from '../report.ts';
import { RecordedLanguageModel } from '../../../adapters/recorded-language-model.ts';
import { hashJson, stableJson } from '../../../core/serialization.ts';
import { FakeLanguageModel, sampleAnalysis, sampleInput, samplePlan, sampleReads } from './helpers.ts';

const prompt = 'Stable test prompt';

describe('two-pass Cartographer and model boundary', () => {
	it('uses only metadata in A, reads only selected articles and validates B with a fake model', async () => {
		const model = new FakeLanguageModel();
		const reader = vi.fn(async () => sampleReads()[0]!);
		const result = await runCartographer(sampleInput(), prompt, model, reader);
		expect(model.requests.map((request) => request.phase)).toEqual(['inventory', 'deep-read']);
		expect(model.requests[0]!.context).not.toHaveProperty('selectedArticles');
		expect(model.requests[1]!.context).toHaveProperty('selectedArticles');
		expect(reader).toHaveBeenCalledTimes(1);
		expect(result.analysisContext.deepReads).toHaveLength(1);
		expect(result.corpusOverview.articleCount).toBe(2);
		expect(result.corpusOverview.mappedArticleCount).toBe(2);
		expect(result.analysisContext.model.mode).toBe('test');
	});
	it('stops on invalid model output, with no downstream agent or I/O writes', async () => {
		const model = new FakeLanguageModel([samplePlan(), { candidates: [{ action: 'PUBLISH' }] }]);
		await expect(runCartographer(sampleInput(), prompt, model, async () => sampleReads()[0]!)).rejects.toThrow();
		expect(model.requests).toHaveLength(2);
	});
	it('does not read sources when budget is zero and accepts an explicit metadata-only run', async () => {
		const input = sampleInput(); input.limits.maxDeepReads = 0;
		const plan = samplePlan(); plan.deepReadRequests = [];
		const reader = vi.fn(async () => sampleReads()[0]!);
		const result = await runCartographer(input, prompt, new FakeLanguageModel([plan, sampleAnalysis()]), reader);
		expect(reader).not.toHaveBeenCalled();
		expect(result.analysisContext.deepReads).toHaveLength(0);
	});
	it('rejects an oversized plan before reading and rejects dishonest reader identities/lengths', async () => {
		const input = sampleInput(); input.limits.maxDeepReads = 0;
		const reader = vi.fn(async () => sampleReads()[0]!);
		await expect(runCartographer(input, prompt, new FakeLanguageModel(), reader)).rejects.toThrow('budget');
		expect(reader).not.toHaveBeenCalled();
		await expect(prepareDeepReadRequest(sampleInput(), prompt, samplePlan(), async () => ({ ...sampleReads()[0]!, sourceId: 'wrong' }))).rejects.toThrow('identity');
		const small = sampleInput(); small.limits.maxBodyCharacters = 2;
		await expect(prepareDeepReadRequest(small, prompt, samplePlan(), reader)).rejects.toThrow('character');
	});
	it('produces stable JSON, report and ranking for the same structured output', async () => {
		const first = await runCartographer(sampleInput(), prompt, new FakeLanguageModel(), async () => sampleReads()[0]!);
		const second = await runCartographer(sampleInput(), prompt, new FakeLanguageModel(), async () => sampleReads()[0]!);
		expect(createCartographerArtifacts(first, sampleInput().inventory)).toEqual(createCartographerArtifacts(second, sampleInput().inventory));
		expect(stableJson({ b: 1, a: { y: 2, x: 3 } })).toBe(stableJson({ a: { x: 3, y: 2 }, b: 1 }));
		const candidates = [{ ...first.candidates[0]!, id: 'b' }, { ...first.candidates[0]!, id: 'a' }];
		expect(rankCandidates(candidates).map((item) => item.id)).toEqual(['a', 'b']);
		expect(candidates[0]!.id).toBe('b');
		const report = createCartographerArtifacts(first, sampleInput().inventory)['reports/cartographer-001.md']!;
		expect(report).toContain('\n\n    - Interpretacja:');
		for (const heading of ['CORPUS OVERVIEW', 'MAJOR KNOWLEDGE DOMAINS', 'TOPIC CLUSTERS', 'STRONG COVERAGE', 'WEAK COVERAGE', 'KNOWLEDGE GAPS', 'POSSIBLE DUPLICATE / MERGE CANDIDATES', 'OUTDATED / REVIEW CANDIDATES', 'TOP 10 EDITORIAL OPPORTUNITIES', 'UNCERTAINTIES', 'LIMITATIONS', 'TOP 5 NEXT ACTIONS']) expect(report).toContain(heading);
	});
	it('imports explicitly labelled session responses only for matching exact requests', async () => {
		const input = sampleInput();
		const requestA = prepareInventoryRequest(input, prompt);
		const deep = await prepareDeepReadRequest(input, prompt, samplePlan(), async () => sampleReads()[0]!);
		const model = new RecordedLanguageModel({ schemaVersion: 1,
			provenance: { mode: 'imported-session-analysis', model: 'Session model', description: 'External session analysis.' },
			inventory: { requestHash: hashJson(requestA), response: samplePlan() },
			'deep-read': { requestHash: hashJson(deep.request), response: sampleAnalysis() } });
		expect((await runCartographer(input, prompt, model, async () => sampleReads()[0]!)).analysisContext.model.mode).toBe('imported-session-analysis');
		await expect(model.generateStructured({ ...requestA, instructions: 'changed' })).rejects.toThrow('hash mismatch');
	});
	it('rejects missing pass B instead of manufacturing a result', async () => {
		const request = prepareInventoryRequest(sampleInput(), prompt);
		const model = new RecordedLanguageModel({ schemaVersion: 1,
			provenance: { mode: 'imported-session-analysis', model: 'Session model', description: 'Pass A only.' },
			inventory: { requestHash: hashJson(request), response: samplePlan() }, 'deep-read': null });
		await expect(runCartographer(sampleInput(), prompt, model, async () => sampleReads()[0]!)).rejects.toThrow('Missing recorded deep-read');
	});
});
