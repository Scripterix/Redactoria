import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RecordedLanguageModel } from '../../../adapters/recorded-language-model.ts';
import { hashJson, stableJson } from '../../../core/serialization.ts';
import { createSourceReader } from '../../../core/source-reader.ts';
import { writeResearchArtifacts } from '../../../core/research-writer.ts';
import { parseResearcherArguments } from '../../../../scripts/researcher.ts';
import { officialText } from '../../../../scripts/research/capture-php-arrays.ts';
import { prepareResearchRequest, runResearcher } from '../agent.ts';
import { ResearchPacketSchema } from '../contract.ts';
import { SOURCE_AUTHORITY_HOSTS, sourceAuthorityForUrl } from '../policies.ts';
import { createResearchArtifacts } from '../report.ts';
import { validateResearchAnalysis, validateResearchInput, validateResearchPacket } from '../validation.ts';
import { analysisFixture, authorityAnalysisFixture, authorityInputFixture, FakeLanguageModel, fixturesDirectory, inputFixture, readerFixture } from './helpers.ts';

const directories: string[] = [];
afterEach(async () => { for (const directory of directories.splice(0)) await rm(directory, { recursive: true, force: true }); });
const run = () => runResearcher(inputFixture(), 'Prompt', new FakeLanguageModel([analysisFixture()]), readerFixture);
describe('Researcher deterministic boundaries', () => {
	it('accepts a human-approved decision, exactly two full reads and one model branch', async () => {
		const reader = vi.fn(readerFixture); const model = new FakeLanguageModel([analysisFixture()]);
		const packet = await runResearcher(inputFixture(), 'Prompt', model, reader);
		expect(packet.targets).toHaveLength(2); expect(reader).toHaveBeenCalledTimes(2);
		expect(model.requests.map(request => request.phase)).toEqual(['research']);
		expect(ResearchPacketSchema.parse(packet)).toEqual(packet);
	});
	it.each(['proposed', 'rejected', 'unapproved'])('rejects %s decisions before reading or calling the model', async status => {
		const input = { ...inputFixture(), decision: { ...inputFixture().decision, status } };
		const reader = vi.fn(readerFixture), model = new FakeLanguageModel([analysisFixture()]);
		await expect(runResearcher(input as never, 'Prompt', model, reader)).rejects.toThrow();
		expect(reader).not.toHaveBeenCalled(); expect(model.requests).toHaveLength(0);
	});
	it('rejects missing, duplicate, extra, unknown or changed targets and altered cartography', () => {
		for (const mutate of [
			(input: ReturnType<typeof inputFixture>) => input.decision.targets.pop(),
			(input: ReturnType<typeof inputFixture>) => input.decision.targets.push(input.decision.targets[0]!),
			(input: ReturnType<typeof inputFixture>) => { input.decision.targets[1] = input.decision.targets[0]!; },
			(input: ReturnType<typeof inputFixture>) => { input.decision.targets[0]!.sourceId = 'unknown'; },
			(input: ReturnType<typeof inputFixture>) => { input.cartography.reason = 'Changed analysis'; },
			(input: ReturnType<typeof inputFixture>) => { input.inventory.articles[0]!.content_hash = '3'.repeat(64); },
		]) { const input = inputFixture(); mutate(input); expect(() => validateResearchInput(input)).toThrow(); }
	});
	it('requires documentation for every verified finding', () => {
		const analysis = analysisFixture(); analysis.verifiedFacts[0]!.evidence = [];
		expect(() => validateResearchAnalysis(analysis, inputFixture(), [])).toThrow();
		const other = analysisFixture(); other.ambiguousClaims = [{ ...other.verifiedFacts[0]!, id: 'other', evidence: [], articleEvidence: [{ sourceId: 'missing', sourcePath: 'missing.md', field: 'body', value: 'x' }] }];
		expect(() => validateResearchAnalysis(other, inputFixture(), [])).toThrow('requires documentation');
	});
	it('classifies every approved Source Authority Ladder host', () => {
		expect(SOURCE_AUTHORITY_HOSTS.length).toBeGreaterThan(20);
		for (const host of SOURCE_AUTHORITY_HOSTS) expect(sourceAuthorityForUrl(`https://${host}/reference`).tier).toBeGreaterThanOrEqual(1);
		expect(sourceAuthorityForUrl('https://tc39.es/ecma262/')).toMatchObject({ tier: 1, authorityClass: 'specification-standard' });
		expect(sourceAuthorityForUrl('https://developer.mozilla.org/docs/Web/API/Fetch_API')).toMatchObject({ tier: 3, evidenceRole: 'practical-reference' });
		expect(sourceAuthorityForUrl('https://stackoverflow.com/questions/1/example')).toEqual({ tier: 7, authorityClass: 'real-world-problem', evidenceRole: 'problem-signal' });
		expect(() => sourceAuthorityForUrl('https://example.invalid/reference')).toThrow('not classified');
	});
	it('accepts ladder evidence while keeping the historical bundle valid', () => {
		expect(validateResearchInput(inputFixture()).research.schemaVersion).toBe(1);
		const input = validateResearchInput(authorityInputFixture());
		const analysis = authorityAnalysisFixture();
		analysis.verifiedFacts[0]!.evidence.push({ documentId: 'problem', excerptId: 'symptom' });
		expect(validateResearchAnalysis(analysis, input, []).verifiedFacts[0]!.evidence).toHaveLength(2);
	});
	it('preserves ladder metadata in the packet register and human report', async () => {
		const input = authorityInputFixture(), analysis = authorityAnalysisFixture();
		analysis.verifiedFacts[0]!.evidence.push({ documentId: 'problem', excerptId: 'symptom' });
		const packet = await runResearcher(input, 'Prompt', new FakeLanguageModel([analysis]), readerFixture);
		expect(packet.sourceRegister.map(source => source.id)).toEqual(['manual', 'problem']);
		expect(packet.sourceRegister[1]).toMatchObject({ authorityTier: 7, evidenceRole: 'problem-signal' });
		const report = createResearchArtifacts(packet, input.research.questions)['research/fixture/research.md'];
		expect(report).toContain('tier 7 / real-world-problem / problem-signal');
	});
	it('rejects forged ladder metadata and Stack Overflow-only verified facts', () => {
		const forged = authorityInputFixture();
		if (forged.research.schemaVersion !== 3) throw new Error('Expected authority bundle fixture.');
		forged.research.sources[0]!.authorityTier = 1;
		expect(() => validateResearchInput(forged)).toThrow('metadata');
		const wrongCapture = authorityInputFixture();
		if (wrongCapture.research.schemaVersion !== 3) throw new Error('Expected authority bundle fixture.');
		wrongCapture.research.sources[0]!.retrieval.selection = 'practical-content';
		expect(() => validateResearchInput(wrongCapture)).toThrow('capture selection');

		const input = validateResearchInput(authorityInputFixture());
		const analysis = authorityAnalysisFixture();
		analysis.verifiedFacts[0]!.evidence = [{ documentId: 'problem', excerptId: 'symptom' }];
		expect(() => validateResearchAnalysis(analysis, input, [])).toThrow('cannot rely only');
	});
	it.each(['unknown-document', 'unknown-excerpt'])('rejects %s reference', type => {
		const analysis = analysisFixture(); const evidence = analysis.verifiedFacts[0]!.evidence[0]!;
		if (type === 'unknown-document') evidence.documentId = 'ghost'; else evidence.excerptId = 'ghost';
		expect(() => validateResearchAnalysis(analysis, inputFixture(), [])).toThrow('Unknown document');
	});
	it.each([-0.01, 1.01, NaN, Infinity])('enforces confidence bounds: %s', confidence => {
		const analysis = analysisFixture(); analysis.verifiedFacts[0]!.confidence = confidence;
		expect(() => validateResearchAnalysis(analysis, inputFixture(), [])).toThrow();
	});
	it.each(['PUBLISH', 'APPROVE', 'MERGE_FILES', 'WRITE_CONTENT', 'WRITE_SOURCE', 'CALL_WRITER'])('rejects action %s', action => {
		expect(() => validateResearchAnalysis({ ...analysisFixture(), action }, inputFixture(), [])).toThrow();
	});
	it('accepts uncertainty only when explicitly marked and reflected in question answers', () => {
		const analysis = analysisFixture(), input = inputFixture();
		analysis.ambiguousClaims = [{ ...analysis.verifiedFacts[0]!, id: 'uncertain', status: 'needs-review', evidence: [], confidence: 0.2,
			articleEvidence: [{ sourceId: input.inventory.articles[0]!.source_id, sourcePath: input.inventory.articles[0]!.source_path, field: 'title', value: input.inventory.articles[0]!.title! }] }];
		analysis.questionAnswers[0] = { questionId: 'question', status: 'needs-review', findingIds: ['uncertain'], note: 'Not resolved.' };
		analysis.unresolvedQuestions = [{ questionId: 'question', status: 'needs-review', reason: 'Needs testing.' }];
		expect(validateResearchAnalysis(analysis, input, []).ambiguousClaims[0]!.status).toBe('needs-review');
		analysis.unresolvedQuestions = []; expect(() => validateResearchAnalysis(analysis, input, [])).toThrow('explicitly marked');
	});
	it('rejects forged code/article evidence and unexecuted probes', async () => {
		const input = inputFixture(), reads = await Promise.all(input.inventory.articles.map(readerFixture));
		const analysis = analysisFixture(); analysis.codeReview = [{ ...analysis.verifiedFacts[0]!, id: 'code',
			articleEvidence: [{ sourceId: reads[0]!.sourceId, sourcePath: reads[0]!.sourcePath, field: 'body', value: 'Invented code' }],
			verification: 'documentation-reviewed', probeIds: [] }];
		expect(() => validateResearchAnalysis(analysis, input, reads)).toThrow('Body evidence');
		analysis.codeReview[0]!.articleEvidence[0]!.value = reads[0]!.body;
		expect(validateResearchAnalysis(analysis, input, reads).codeReview).toHaveLength(1);
		analysis.codeReview[0]!.probeIds = ['not-executed']; analysis.codeReview[0]!.verification = 'executed-probe';
		expect(() => validateResearchAnalysis(analysis, input, reads)).toThrow('Unknown code probe');
	});
	it('rejects fabricated source register entries, evidence IDs and packet targets', async () => {
		const packet = await run(); const input = inputFixture(), reads = await Promise.all(input.inventory.articles.map(readerFixture));
		packet.sourceRegister[0]!.evidenceIds.push('orphan');
		expect(() => validateResearchPacket(packet, input, reads)).toThrow('orphan');
		const target = await run(); target.targets[0]!.sourceId = 'ghost';
		expect(() => validateResearchPacket(target, input, reads)).toThrow('Unknown packet target');
	});
	it('rejects an unsupported article in code evidence and invalid probe provenance', async () => {
		const input = inputFixture(), reads = await Promise.all(input.inventory.articles.map(readerFixture));
		const analysis = analysisFixture(); analysis.codeReview = [{ ...analysis.verifiedFacts[0]!, id: 'code',
			articleEvidence: [{ sourceId: 'excluded', sourcePath: 'excluded.md', field: 'body', value: 'not supplied' }],
			verification: 'documentation-reviewed', probeIds: [] }];
		expect(() => validateResearchAnalysis(analysis, input, reads)).toThrow('Evidence source');
		if (input.research.schemaVersion !== 1) throw new Error('Expected historical PHP fixture.');
		input.research.probes.push({ id: 'fake-probe', description: 'Incorrect hash', phpVersion: '8.2.4', code: 'return [];', codeHash: '0'.repeat(64), result: [], diagnostics: [] });
		expect(() => validateResearchInput(input)).toThrow('Probe code hash');
	});
	it('validates the request hash and rejects missing/source-register metadata substitution', async () => {
		const packet = await run(), input = inputFixture(), reads = await Promise.all(input.inventory.articles.map(readerFixture));
		expect(() => validateResearchPacket(packet, input, reads, '0'.repeat(64))).toThrow('request hash');
		packet.sourceRegister[0]!.title = 'Substituted source';
		expect(() => validateResearchPacket(packet, input, reads)).toThrow('forged');
	});
	it('requires coverage of Cartographer research questions and all handoff references', () => {
		const input = inputFixture(); input.cartography.needsResearch.push({ id: 'uncovered', interpretation: 'Needs review', confidence: 0.5, evidence: input.cartography.evidence });
		input.decision.analysisHash = hashJson(input.cartography);
		expect(() => validateResearchInput(input)).toThrow('not covered');
		const analysis = analysisFixture(); analysis.writerHandoff.correct.push({ instruction: 'Wrong reference', findingIds: ['unknown'] });
		expect(() => validateResearchAnalysis(analysis, inputFixture(), [])).toThrow('Unknown finding');
	});
	it('document capture excludes user notes and rejects absent official boundaries', () => {
		const html = '<section id="layout-content"><p>Official &amp; exact &#39;rule&#39;</p><section id="usernotes"><p>Untrusted user note</p></section><footer>footer</footer>';
		const text = officialText(html); expect(text).toContain("Official & exact 'rule'"); expect(text).not.toContain('Untrusted');
		expect(() => officialText('<p>No official section</p>')).toThrow('official document');
	});
	it('rejects unsafe document URLs and malformed/extra fields', () => {
		for (const url of ['https://example.invalid/fake', 'http://www.php.net/manual', 'https://user:password@www.php.net/manual']) {
			const input = inputFixture(); input.research.sources[0]!.url = url;
			expect(() => validateResearchInput(input)).toThrow();
		}
		expect(() => ResearchPacketSchema.parse({ schemaVersion: 1 })).toThrow();
		expect(() => validateResearchAnalysis({ ...analysisFixture(), contentPath: 'content/evil.md' }, inputFixture(), [])).toThrow();
	});
	it('rejects truncation, changed reads and missing question coverage', async () => {
		await expect(prepareResearchRequest(inputFixture(), 'Prompt', async article => ({ ...await readerFixture(article), truncated: true }))).rejects.toThrow('full bodies');
		await expect(prepareResearchRequest(inputFixture(), 'Prompt', async article => ({ ...await readerFixture(article), contentHash: '3'.repeat(64) }))).rejects.toThrow('identity');
		const analysis = analysisFixture(); analysis.questionAnswers = [];
		expect(() => validateResearchAnalysis(analysis, inputFixture(), [])).toThrow();
	});
	it('binds recorded replay to the exact prompt, evidence snapshot, limits and inputs', async () => {
		const input = inputFixture(); const { request } = await prepareResearchRequest(input, 'Prompt', readerFixture);
		const raw = { schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'Session', description: 'Explicit recorded research.' },
			research: { requestHash: hashJson(request), response: analysisFixture() } };
		const replay = () => runResearcher(input, 'Prompt', new RecordedLanguageModel(raw), readerFixture);
		expect(stableJson(await replay())).toBe(stableJson(await replay()));
		await expect(runResearcher(input, 'Changed', new RecordedLanguageModel(raw), readerFixture)).rejects.toThrow('hash mismatch');
		input.research.sources[0]!.documentHash = '4'.repeat(64); await expect(replay()).rejects.toThrow('hash mismatch');
	});
	it('excludes unused documents from the source register', async () => {
		const input = inputFixture();
		if (input.research.schemaVersion !== 1) throw new Error('Expected historical PHP fixture.');
		input.research.sources.push({ ...input.research.sources[0]!, id: 'unused', url: 'https://www.php.net/manual/en/function.isset.php',
			retrieval: { ...input.research.sources[0]!.retrieval, finalUrl: 'https://www.php.net/manual/en/function.isset.php' } });
		const packet = await runResearcher(input, 'Prompt', new FakeLanguageModel([analysisFixture()]), readerFixture);
		expect(packet.sourceRegister.map(source => source.id)).toEqual(['manual']);
	});
	it('CLI requires an explicit decision and forbids publication/extra options', () => {
		expect(parseResearcherArguments(['--decision', 'decision.json', '--prepare']).prepare).toBe(true);
		for (const args of [[], ['--decision'], ['--decision', 'decision.json', '--publish'], ['--decision', 'decision.json', '--decision', 'other.json']]) expect(() => parseResearcherArguments(args)).toThrow();
	});
	it('writes stable LAB output without mutating SOURCE or CONTENT; rejects prohibited writes and junctions', async () => {
		const project = await mkdtemp(join(tmpdir(), 'redactoria-research-test-')); directories.push(project);
		const source = join(project, 'source'); await mkdir(source); await mkdir(join(project, 'content'));
		const input = inputFixture();
		for (const article of input.inventory.articles) await cp(join(fixturesDirectory, article.source_path), join(source, article.source_path));
		const content = join(project, 'content/accepted.md'); await writeFile(content, 'Keep content.');
		const protectedPaths = [content, ...input.inventory.articles.map(article => join(source, article.source_path))];
		const before = await Promise.all(protectedPaths.map(path => readFile(path)));
		const packet = await runResearcher(input, 'Prompt', new FakeLanguageModel([analysisFixture()]), createSourceReader(source));
		const artifacts = createResearchArtifacts(packet, input.research.questions);
		const paths = await writeResearchArtifacts(project, source, artifacts);
		const first = await Promise.all(paths.map(path => readFile(path, 'utf8')));
		await writeResearchArtifacts(project, source, artifacts); expect(await Promise.all(paths.map(path => readFile(path, 'utf8')))).toEqual(first);
		for (const path of ['../source/valid-post.md', '../content/accepted.md', 'decisions/approve.json', 'research/fixture/../../content/evil.md']) {
			await expect(writeResearchArtifacts(project, source, { [path]: 'evil' })).rejects.toThrow('LAB only');
		}
		await rm(join(project, 'lab/research'), { recursive: true }); await symlink(join(project, 'content'), join(project, 'lab/research'), 'junction');
		await expect(writeResearchArtifacts(project, source, artifacts)).rejects.toThrow('inside LAB');
		expect(await Promise.all(protectedPaths.map(path => readFile(path)))).toEqual(before);
	});
});
