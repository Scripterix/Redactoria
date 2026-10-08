import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RecordedLanguageModel } from '../../../adapters/recorded-language-model.ts';
import { writeLabArtifacts } from '../../../core/lab-writer.ts';
import { createSourceReader } from '../../../core/source-reader.ts';
import { hashJson } from '../../../core/serialization.ts';
import { prepareFocusedMerge, runFocusedMerge, selectFocusedInput, validateFocusedMerge, MergeProposalSchema } from '../focused-merge.ts';
import type { FocusedMergeAnalysis } from '../focused-merge.ts';
import { createFocusedMergeArtifacts } from '../focused-merge-report.ts';
import { parseCartographerArguments } from '../../../../scripts/cartographer.ts';
import { FakeLanguageModel, fixturesDirectory, sampleInput, titleEvidence } from './helpers.ts';

function analysis(): FocusedMergeAnalysis {
	const first = titleEvidence(), second = titleEvidence(1);
	return { task: 'MERGE', artifactName: 'sample-topic-merge', recommended: true, confidence: 0.8,
		reason: 'Complementary examples, not identical texts.', evidence: [first, second],
		sharedTopics: [{ id: 'shared', interpretation: 'Shared domain.', confidence: 0.7, evidence: [first, second] }],
		uniqueToFirst: [{ id: 'first', interpretation: 'First example.', confidence: 0.7, evidence: [first] }],
		uniqueToSecond: [{ id: 'second', interpretation: 'Second example.', confidence: 0.7, evidence: [second] }],
		duplicates: [], conflicts: [], logicalOrder: [], outdatedOrUncertain: [], keep: [], remove: [], needsResearch: [],
		proposedTitle: 'Combined lesson', limitations: ['No code correctness audit.'],
		proposedStructure: [{ order: 1, title: 'Shared introduction', purpose: 'Explain the common context.',
			sourceIds: [first.sourceId, second.sourceId], evidence: [first, second], needsResearch: false }],
	};
}
const reader = async (article: ReturnType<typeof sampleInput>['inventory']['articles'][number]) => ({
	sourceId: article.source_id, sourcePath: article.source_path, contentHash: article.content_hash,
	body: 'Complete selected fixture body.', truncated: false,
});
const directories: string[] = [];
afterEach(async () => { for (const directory of directories.splice(0)) await rm(directory, { recursive: true, force: true }); });

describe('focused MERGE branch', () => {
	it('accepts repeated --focus without enabling other actions or ambiguous scopes', () => {
		const args = ['--focus', 'first.md', '--focus', 'second.md', '--task', 'merge'];
		expect(parseCartographerArguments(args).focus).toEqual(['first.md', 'second.md']);
		for (const invalid of [args.slice(0, 4), [...args, '--focus', 'third.md'], ['--task', 'publish', '--focus', 'first.md', '--focus', 'second.md'], ['--task', 'merge'], [...args, '--prepare', 'inventory']]) {
			expect(() => parseCartographerArguments(invalid)).toThrow();
		}
	});
	it('selects only two ordered records and never includes excluded corpus data in the request', async () => {
		const input = sampleInput();
		const inventory = { ...input.inventory, articles: [...input.inventory.articles, { source_path: 'excluded.md', title: 'Must not be analyzed' }] };
		const focused = selectFocusedInput(inventory, input.inventory.articles.map((article) => article.source_path).reverse(), input.limits);
		expect(focused.inventory.articles.map((article) => article.source_id)).toEqual(input.inventory.articles.map((article) => article.source_id).reverse());
		const selected = selectFocusedInput(inventory, input.inventory.articles.map((article) => article.source_path), input.limits);
		const model = new FakeLanguageModel([analysis()]); const read = vi.fn(reader);
		const result = await runFocusedMerge(selected, 'Prompt', model, read);
		expect(result.targets).toHaveLength(2); expect(read).toHaveBeenCalledTimes(2);
		expect(model.requests.map((request) => request.phase)).toEqual(['focused-merge']);
		expect(JSON.stringify(model.requests[0]!.context)).not.toContain('excluded.md');
	});
	it('rejects missing, duplicate or more than two targets', () => {
		const input = sampleInput(); const paths = input.inventory.articles.map((article) => article.source_path);
		for (const focus of [[], [paths[0]!], [paths[0]!, paths[0]!], [...paths, 'third.md'], [paths[0]!, 'missing.md']]) {
			expect(() => selectFocusedInput(input.inventory, focus, input.limits)).toThrow();
		}
	});
	it.each(['PUBLISH', 'UPDATE', 'DELETE_SOURCE'])('rejects non-MERGE task %s', (task) => {
		expect(() => validateFocusedMerge({ ...analysis(), task }, sampleInput(), [])).toThrow();
	});
	it.each([-0.1, 1.1, NaN, Infinity])('rejects invalid confidence %s', (confidence) => {
		expect(() => validateFocusedMerge({ ...analysis(), confidence }, sampleInput(), [])).toThrow();
	});
	it('requires evidence for both targets and a real ordered outline', () => {
		const empty = analysis(); empty.evidence = [];
		expect(() => validateFocusedMerge(empty, sampleInput(), [])).toThrow();
		const missing = analysis(); missing.evidence = [titleEvidence()];
		expect(() => validateFocusedMerge(missing, sampleInput(), [])).toThrow('Both targets');
		const noOutline = analysis(); noOutline.proposedStructure = [];
		expect(() => validateFocusedMerge(noOutline, sampleInput(), [])).toThrow();
		const wrongOrder = analysis(); wrongOrder.proposedStructure[0]!.order = 2;
		expect(() => validateFocusedMerge(wrongOrder, sampleInput(), [])).toThrow('contiguous');
	});
	it('rejects forged citations and wrongly assigned unique material', () => {
		const forged = analysis(); forged.evidence[0]!.value = 'Invented';
		expect(() => validateFocusedMerge(forged, sampleInput(), [])).toThrow('Metadata evidence');
		const wrong = analysis(); wrong.uniqueToFirst[0]!.evidence = [titleEvidence(1)];
		expect(() => validateFocusedMerge(wrong, sampleInput(), [])).toThrow('wrong target');
	});
	it('rejects truncation or insufficient read budget instead of pretending to read in full', async () => {
		const input = sampleInput(); input.limits.maxDeepReads = 1;
		const read = vi.fn(reader);
		await expect(prepareFocusedMerge(input, 'Prompt', read)).rejects.toThrow('budget'); expect(read).not.toHaveBeenCalled();
		await expect(prepareFocusedMerge(sampleInput(), 'Prompt', async (article) => ({ ...await reader(article), truncated: true }))).rejects.toThrow('full bodies');
	});
	it('uses a hash-bound recorded focused response, never the old full-corpus answer', async () => {
		const input = sampleInput(); const prepared = await prepareFocusedMerge(input, 'Prompt', reader);
		const model = new RecordedLanguageModel({ schemaVersion: 1,
			provenance: { mode: 'imported-session-analysis', model: 'Session', description: 'Two-article analysis.' },
			'focused-merge': { requestHash: hashJson(prepared.request), response: analysis() } });
		expect((await runFocusedMerge(input, 'Prompt', model, reader)).task).toBe('MERGE');
		await expect(runFocusedMerge(input, 'Changed prompt', model, reader)).rejects.toThrow('hash mismatch');
	});
	it('creates only a proposed decision and omits a proposal if merging is not recommended', async () => {
		const result = await runFocusedMerge(sampleInput(), 'Prompt', new FakeLanguageModel([analysis()]), reader);
		const artifacts = createFocusedMergeArtifacts(result);
		const proposal = JSON.parse(artifacts['decisions/sample-topic-merge-proposal.json']!);
		expect(proposal.status).toBe('proposed'); expect(proposal.action).toBe('MERGE');
		expect(() => MergeProposalSchema.parse({ ...proposal, status: 'approved' })).toThrow();
		expect(Object.keys(createFocusedMergeArtifacts({ ...result, recommended: false }))).toHaveLength(2);
	});
	it('writes stable focused outputs to LAB only, preserving actual source and CONTENT bytes', async () => {
		const project = await mkdtemp(join(tmpdir(), 'redactoria-focused-test-')); directories.push(project);
		const source = join(project, 'source'); await mkdir(source); await mkdir(join(project, 'content'));
		const input = sampleInput();
		for (const article of input.inventory.articles) await cp(join(fixturesDirectory, article.source_path), join(source, article.source_path));
		const content = join(project, 'content/accepted.md'); await writeFile(content, 'Keep this content.');
		const protectedPaths = [content, ...input.inventory.articles.map((article) => join(source, article.source_path))];
		const before = await Promise.all(protectedPaths.map((path) => readFile(path)));
		const run = async () => {
			const result = await runFocusedMerge(input, 'Prompt', new FakeLanguageModel([analysis()]), createSourceReader(source));
			return writeLabArtifacts(project, source, createFocusedMergeArtifacts(result));
		};
		const firstPaths = await run(); const first = await Promise.all(firstPaths.map((path) => readFile(path, 'utf8')));
		const secondPaths = await run();
		expect(await Promise.all(secondPaths.map((path) => readFile(path, 'utf8')))).toEqual(first);
		expect(await Promise.all(protectedPaths.map((path) => readFile(path)))).toEqual(before);
		await rm(join(project, 'lab/decisions'), { recursive: true });
		await symlink(join(project, 'content'), join(project, 'lab/decisions'), 'junction');
		await expect(run()).rejects.toThrow('inside LAB');
		expect(await Promise.all(protectedPaths.map((path) => readFile(path)))).toEqual(before);
	});
});
