import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RecordedLanguageModel } from '../../../adapters/recorded-language-model.ts';
import { hashJson, stableJson } from '../../../core/serialization.ts';
import { createPilotArtifacts, pilotScore, preparePilotSelection, runPilotSelection, validatePilotAnalysis } from '../pilot-selection.ts';
import type { PreparedPilot } from '../pilot-selection.ts';
import { FakeLanguageModel, sampleInput } from './helpers.ts';

const scores = { educationalValue: 5, outdatedRisk: 1, researchCost: 1, codeTestability: 5,
	securityRisk: 1, scopeClarity: 5, internalLinking: 5, beginnerUsefulness: 5 };
function input() {
	const base = sampleInput();
	return { ...base, limits: { ...base.limits, maxDeepReads: 11 }, inventory: { ...base.inventory,
		articles: Array.from({ length: 12 }, (_, index) => ({ ...base.inventory.articles[0]!,
			source_id: String(index), source_path: `source-${String(index).padStart(2, '0')}.md` })) } };
}
function screening() {
	return { schemaVersion: 1 as const, shortlist: input().inventory.articles.slice(0, 11).map((source) => ({ sourceId: source.source_id, reason: 'Potential small lesson.' })),
		exclusions: [{ sourceId: '11', reason: 'Already modernized.' }] };
}
const reader = async (source: ReturnType<typeof input>['inventory']['articles'][number]) => ({
	sourceId: source.source_id, sourcePath: source.source_path, contentHash: source.content_hash, body: 'Exact supplied body.', truncated: false,
});
async function prepare() { return preparePilotSelection(input(), screening(), 'B1 only', reader); }
function analysis() {
	return { assessments: input().inventory.articles.slice(0, 11).map((source, index) => ({
		sourceId: source.source_id, disposition: index < 10 ? 'select' as const : 'defer' as const,
		proposedTitle: `Lesson ${index}`, domain: 'JavaScript' as const, scores: { ...scores },
		recommendedScope: 'One small pure example.', reason: 'Reviewable scope.', researchNeeds: ['Verify against official docs.'], internalLinkSourceIds: ['11'],
		evidence: [{ sourceId: source.source_id, sourcePath: source.source_path, field: 'body' as const, value: 'Exact supplied body.' }],
	})), limitations: ['No research or publication.'] };
}

describe('B1 selection boundaries', () => {
	it('prepares exactly the bounded full shortlist, keeps all inventory and complete screening', async () => {
		const prepared = await prepare();
		expect(prepared.reads).toHaveLength(11);
		expect(prepared.input.inventory.articles).toHaveLength(12);
		expect(prepared.request.phase).toBe('pilot-selection');
	});
	it.each(['duplicate', 'missing', 'unknown'] as const)('rejects %s screening before reads', async (kind) => {
		const changed = screening();
		if (kind === 'duplicate') changed.shortlist.push(changed.shortlist[0]!);
		if (kind === 'missing') changed.exclusions = [];
		if (kind === 'unknown') changed.exclusions[0]!.sourceId = 'unknown';
		await expect(preparePilotSelection(input(), changed, 'B1', reader)).rejects.toThrow('exactly once');
	});
	it('rejects budget excess before reads', async () => {
		const changed = input(); changed.limits.maxDeepReads = 10;
		await expect(preparePilotSelection(changed, screening(), 'B1', reader)).rejects.toThrow('budget');
	});
	it.each(['truncated', 'hash', 'identity', 'oversized'] as const)('rejects %s source reads', async (kind) => {
		await expect(preparePilotSelection(input(), screening(), 'B1', async (source) => {
			const read = await reader(source);
			if (kind === 'truncated') read.truncated = true;
			if (kind === 'hash') read.contentHash = '0'.repeat(64);
			if (kind === 'identity') read.sourceId = 'unknown';
			if (kind === 'oversized') read.body = 'x'.repeat(18001);
			return read;
		})).rejects.toThrow();
	});
	it('rejects parse-error shortlist', async () => {
		const changed = input(); changed.inventory.articles[0]!.parse_status = 'error';
		await expect(preparePilotSelection(changed, screening(), 'B1', reader)).rejects.toThrow('parse-error');
	});
	it.each(['duplicate', 'excluded', 'missing', 'nine', 'eleven', 'quote', 'path', 'wrong-source', 'no-body', 'links', 'self-link', 'fraction', 'extra-field'] as const)(
		'rejects invalid %s output', async (kind) => {
			const prepared = await prepare(); const changed = analysis(); const first = changed.assessments[0]!;
			if (kind === 'duplicate') changed.assessments[1]!.sourceId = '0';
			if (kind === 'excluded') first.sourceId = '11';
			if (kind === 'missing') changed.assessments.pop();
			if (kind === 'nine') first.disposition = 'defer';
			if (kind === 'eleven') changed.assessments[10]!.disposition = 'select';
			if (kind === 'quote') first.evidence[0]!.value = 'Invented body quote';
			if (kind === 'path') first.evidence[0]!.sourcePath = 'other.md';
			if (kind === 'wrong-source') first.evidence = changed.assessments[1]!.evidence;
			if (kind === 'no-body') first.evidence = [{ ...first.evidence[0]!, field: 'title' as 'body', value: input().inventory.articles[0]!.title! }];
			if (kind === 'links') first.internalLinkSourceIds = ['unknown'];
			if (kind === 'self-link') first.internalLinkSourceIds = ['0'];
			if (kind === 'fraction') first.scores.educationalValue = 2.5;
			if (kind === 'extra-field') Object.assign(first, { publicationApproved: true });
			expect(() => validatePilotAnalysis(changed, prepared.input, prepared.reads)).toThrow();
		});
	it('uses one model call, ranks ties by source path, retains provenance and never approves', async () => {
		const model = new FakeLanguageModel([analysis()]);
		const result = await runPilotSelection(await prepare(), model);
		expect(model.requests).toHaveLength(1);
		expect(result.ranking.map((entry) => entry.sourceId)).toEqual(Array.from({ length: 10 }, (_, i) => String(i)));
		expect(result.ranking.map((entry) => entry.recommendedOrder)).toEqual([1,2,3,4,5,6,7,8,9,10]);
		expect(result.publicationApproved).toBe(false);
		expect(result.measuredUsage).toEqual({ tokens: null, modelCost: null, researchHours: null });
		expect(createPilotArtifacts(result)).toEqual(createPilotArtifacts(result));
	});
	it('weights benefit/risk directions explicitly', () => {
		expect(pilotScore(scores)).toBe(100);
		expect(pilotScore({ ...scores, educationalValue: 1 })).toBe(84);
		expect(pilotScore({ ...scores, researchCost: 5 })).toBe(92);
		expect(pilotScore({ ...scores, securityRisk: 5 })).toBe(96);
	});
	it('recorded import is bound to the exact current request and cannot substitute another phase', async () => {
		const prepared = await prepare();
		const recorded = { schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'Fixture session', description: 'Test only.' },
			'pilot-selection': { requestHash: hashJson(prepared.request), response: analysis() } };
		const model = new RecordedLanguageModel(recorded);
		await expect(runPilotSelection(prepared, model)).resolves.toHaveProperty('status', 'selection-only');
		await expect(model.generateStructured({ ...prepared.request, instructions: 'Changed' })).rejects.toThrow('hash mismatch');
		await expect(model.generateStructured({ ...prepared.request, phase: 'focused-merge' })).rejects.toThrow('Missing');
	});
	it('replays the real B1 artifacts offline; it is not new inference or source execution', async () => {
		const root = new URL('../../../../lab/', import.meta.url);
		const readJson = (path: string) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
		const { request, requestHash } = readJson('cartography/pilot-selection/request.json');
		expect(hashJson(request)).toBe(requestHash);
		const prepared: PreparedPilot = { input: request.context.input, screening: request.context.screening, reads: request.context.selectedArticles, request };
		const result = await runPilotSelection(prepared, new RecordedLanguageModel(readJson('cartography/pilot-selection/session-responses.json')));
		for (const [path, output] of Object.entries(createPilotArtifacts(result))) expect(output).toBe(readFileSync(new URL(path, root), 'utf8'));
		expect(result.ranking[0]!.sourceId).toBe('1308');
		expect(result.ranking.some((entry) => ['1324', '1356'].includes(entry.sourceId))).toBe(false);
		expect(result.ranking).toHaveLength(10);
		expect(stableJson(result)).not.toContain('approved-for-publication');
	});
});
