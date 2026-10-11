import { describe, expect, it } from 'vitest';
import { inputFixture, writerAnalysis, FakeLanguageModel, mutateArtifact, textFile } from '../../../../tests/fixtures/editorial.ts';
import { runWriter, prepareWriterRequest } from '../agent.ts';
import { validateWriterInput, validateWriterAnalysis, validateDraft } from '../validation.ts';
import { DraftSchema } from '../contract.ts';
import { draftArtifacts, renderArticle, wordCount } from '../report.ts';
import { hashJson, stableJson } from '../../../core/serialization.ts';
import { RecordedLanguageModel } from '../../../adapters/recorded-language-model.ts';
import { WRITER_POLICY } from '../policies.ts';
const prompt = textFile('engine/agents/writer/prompt.md');
describe('Writer contract and single-step boundaries', () => {
 it('requires human-approved research before model work', async () => {
  const input = inputFixture(); mutateArtifact(input, input.config.researchApproval, raw => { raw.status = 'proposed'; });
  const model = new FakeLanguageModel(writerAnalysis());
  await expect(runWriter(input, prompt, model)).rejects.toThrow(); expect(model.requests).toHaveLength(0);
 });
 it('requires an approved MERGE', async () => {
  const input = inputFixture(); mutateArtifact(input, input.config.sourceDecision, raw => { raw.status = 'proposed'; });
  const model = new FakeLanguageModel(writerAnalysis());
  await expect(runWriter(input, prompt, model)).rejects.toThrow(); expect(model.requests).toHaveLength(0);
 });
 it('rejects an unknown target without a model call', async () => {
  const input = inputFixture(); input.sources[0]!.sourceId = 'ghost';
  const model = new FakeLanguageModel(writerAnalysis()); await expect(runWriter(input, prompt, model)).rejects.toThrow('source'); expect(model.requests).toHaveLength(0);
 });
 it('rejects a truncated source', () => {
  const input = inputFixture(); input.sources[0]!.truncated = true; expect(() => validateWriterInput(input)).toThrow();
 });
 it('rejects changed evidence bytes', () => {
  const input = inputFixture(); input.artifacts.find(item => item.path === input.config.researchPacket)!.contents += ' ';
  expect(() => validateWriterInput(input)).toThrow('hash mismatch');
 });
 it('requires input and output PHP 8.4–8.5 scope', () => {
  const input = inputFixture();
  if (input.config.schemaVersion !== 1) throw new Error('Expected historical PHP fixture.');
  input.config.targetPhpVersions[0] = '8.2' as '8.4'; expect(() => validateWriterInput(input)).toThrow();
  const response = writerAnalysis(); response.targetPhpVersions = ['8.2', '8.5'];
  expect(() => validateWriterAnalysis(response, validateWriterInput(inputFixture()))).toThrow();
 });
 it('returns a draft after one provider-neutral model call', async () => {
  const input = inputFixture(), model = new FakeLanguageModel(writerAnalysis());
  const draft = await runWriter(input, prompt, model);
  expect(model.requests).toHaveLength(1); expect(model.requests[0]!.phase).toBe('writer');
  expect(draft.status).toBe('draft'); expect(draft.writerExecution.inputHash).toBe(hashJson(input));
  expect(draft.writerExecution.model).toEqual(model.identity); expect(draft.sources).toEqual(validateWriterInput(input).decision.targets);
  expect(draft.wordCount).toBe(wordCount(renderArticle(draft)));
 });
 it.each(['PUBLISH', 'MERGE_TO_MAIN', 'APPROVE'])('rejects %s instead of DRAFT', action => {
  const response = writerAnalysis(); response.action = action;
  expect(() => validateWriterAnalysis(response, validateWriterInput(inputFixture()))).toThrow();
 });
 it('requires preserved provenance', async () => {
  const draft = await runWriter(inputFixture(), prompt, new FakeLanguageModel(writerAnalysis()));
  expect(() => DraftSchema.parse({ ...draft, writerExecution: undefined })).toThrow();
  expect(() => validateDraft({ ...draft, sources: [] }, inputFixture())).toThrow();
 });
 it('rejects unknown evidence and missing required coverage', () => {
  const response = writerAnalysis(); response.sections[0].evidence[0].id = 'unknown';
  expect(() => validateWriterAnalysis(response, validateWriterInput(inputFixture()))).toThrow('Evidence outside');
  const missing = writerAnalysis(); missing.sections[0].coverage = [];
  expect(() => validateWriterAnalysis(missing, validateWriterInput(inputFixture()))).toThrow('coverage');
 });
 it('rejects omitted mandatory runtime addendum', () => {
  const response = writerAnalysis(); for (const section of response.sections) section.evidence = section.evidence.filter((ref: {kind: string}) => ref.kind !== 'addendum');
  expect(() => validateWriterAnalysis(response, validateWriterInput(inputFixture()))).toThrow('addendum');
 });
 it('rejects hidden or non-standalone code', () => {
  const response = writerAnalysis(); response.sections[0].body += '\n```php\necho 1;\n```';
  expect(() => validateWriterAnalysis(response, validateWriterInput(inputFixture()))).toThrow('structured');
  const bad = writerAnalysis(); bad.sections[1].examples[0].code = 'echo 1;';
  expect(() => validateWriterAnalysis(bad, validateWriterInput(inputFixture()))).toThrow('Standalone');
 });
 it('same model output gives identical JSON and Markdown', async () => {
  const a = await runWriter(inputFixture(), prompt, new FakeLanguageModel(writerAnalysis()));
  const b = await runWriter(inputFixture(), prompt, new FakeLanguageModel(writerAnalysis()));
  expect(stableJson(a)).toBe(stableJson(b)); expect(draftArtifacts(a)).toEqual(draftArtifacts(b));
 });
 it('rejects a recorded response for another input/request', async () => {
  const { request } = prepareWriterRequest(inputFixture(), prompt);
  const model = new RecordedLanguageModel({ schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'Fixture', description: 'Offline test.' },
   writer: { requestHash: '0'.repeat(64), response: writerAnalysis() } });
  await expect(model.generateStructured(request)).rejects.toThrow('hash mismatch');
 });
 it('has no research, source/content/publication/other-agent capabilities', () => {
  expect(WRITER_POLICY.mustNot).toEqual(expect.arrayContaining(['research', 'write-source', 'write-content', 'publish', 'invoke-agent']));
  expect(WRITER_POLICY.maxModelCalls).toBe(1);
 });
});

