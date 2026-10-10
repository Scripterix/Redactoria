import { describe, expect, it } from 'vitest';
import { criticInput, criticAnalysis, FakeLanguageModel, textFile } from '../../../../tests/fixtures/editorial.ts';
import { runCritic, prepareCriticRequest } from '../agent.ts';
import { validateCriticInput, validateCriticAnalysis } from '../validation.ts';
import { reviewArtifacts } from '../report.ts';
import { stableJson } from '../../../core/serialization.ts';
import { RecordedLanguageModel } from '../../../adapters/recorded-language-model.ts';
import { CRITIC_POLICY } from '../policies.ts';
const prompt = textFile('engine/agents/critic/prompt.md');
describe('Critic independent review contract', () => {
 it('rejects unknown or changed draft before model work', async () => {
  const input = criticInput(); input.article += '\nAn untracked edit.';
  const model = new FakeLanguageModel(criticAnalysis());
  await expect(runCritic(input, prompt, model)).rejects.toThrow('draft'); expect(model.requests).toHaveLength(0);
 });
 it('rejects another draft path', () => {
  const input = criticInput(); input.draftRef = 'lab/drafts/unknown/article.md';
  expect(() => validateCriticInput(input)).toThrow('Unknown draft');
 });
 it('requires factual evidence', () => {
  const analysis = criticAnalysis(); analysis.issues[0].evidence = [];
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow('evidence required');
 });
 it('rejects evidence outside approved packet', () => {
  const analysis = criticAnalysis(); analysis.issues[0].evidence[0].id = 'invented-research';
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow('Evidence outside');
 });
 it('rejects forged draft location/quote', () => {
  const analysis = criticAnalysis(); analysis.issues[0].location.quote = 'This text is not in the draft.';
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow('location');
 });
 it.each(['APPROVED', 'PUBLISH', 'DELETE_SOURCE'])('rejects invalid verdict %s', verdict => {
  const analysis = criticAnalysis(); analysis.verdict = verdict;
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow();
 });
 it('rejects publication action or extra rewrite instructions', () => {
  const analysis = criticAnalysis(); analysis.action = 'PUBLISH';
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow();
  expect(() => validateCriticAnalysis({ ...criticAnalysis(), rewrittenArticle: 'Replace it' }, criticInput())).toThrow();
 });
 it('does not allow PASS when required changes remain', () => {
  const analysis = criticAnalysis(); analysis.verdict = 'PASS';
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow('severity');
 });
 it('accepts all three verdicts only with consistent severity', () => {
  expect(validateCriticAnalysis(criticAnalysis(), criticInput()).verdict).toBe('REVISE');
  const block = criticAnalysis(); block.verdict = 'BLOCK'; block.issues[0].severity = 'blocking';
  expect(validateCriticAnalysis(block, criticInput()).verdict).toBe('BLOCK');
  const pass = criticAnalysis(); pass.verdict = 'PASS'; pass.issues.shift(); pass.checks[0].result = 'PASS';
  expect(validateCriticAnalysis(pass, criticInput()).verdict).toBe('PASS');
 });
 it('requires explicit needs-research instead of silent speculation', () => {
  const analysis = criticAnalysis(); analysis.issues[0].status = 'needs-research';
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow('needs-research');
  analysis.checks[0].result = 'NEEDS_RESEARCH'; expect(validateCriticAnalysis(analysis, criticInput()).verdict).toBe('REVISE');
 });
 it.each([-0.01, 1.01, Infinity, NaN])('rejects invalid confidence %s', confidence => {
  const analysis = criticAnalysis(); analysis.issues[0].confidence = confidence;
  expect(() => validateCriticAnalysis(analysis, criticInput())).toThrow();
 });
 it('requires all unique review criteria and grounded failed checks', () => {
  const duplicate = criticAnalysis(); duplicate.checks[0] = duplicate.checks[1];
  expect(() => validateCriticAnalysis(duplicate, criticInput())).toThrow('Duplicate');
  const bad = criticAnalysis(); bad.checks[2].result = 'ISSUES';
  expect(() => validateCriticAnalysis(bad, criticInput())).toThrow('grounded issue');
 });
 it('requires exact actual runtime/code execution provenance', () => {
  const changed = criticInput(); changed.codeExecution.runs[0].version = '8.2.4';
  expect(() => validateCriticInput(changed)).toThrow('runtime');
  const forged = criticInput(); forged.codeExecution.runs[0].examples[0].codeHash = '0'.repeat(64);
  expect(() => validateCriticInput(forged)).toThrow('code/hash');
 });
 it('rejects forged PASS execution status and missing examples', () => {
  const changed = criticInput(); changed.codeExecution.runs[0].examples[0].stdout = 'incorrect output';
  expect(() => validateCriticInput(changed)).toThrow('execution status');
  const missing = criticInput(); missing.codeExecution.runs[0].examples.pop();
  expect(() => validateCriticInput(missing)).toThrow('Missing executed');
 });
 it('never calls Writer or silently revises a REVISE draft', async () => {
  const input = criticInput(), before = stableJson(input.draft), model = new FakeLanguageModel(criticAnalysis());
  const review = await runCritic(input, prompt, model);
  expect(model.requests).toHaveLength(1); expect(model.requests[0]!.phase).toBe('critic');
  expect(review.verdict).toBe('REVISE'); expect(review.requiredChanges).toHaveLength(1);
  expect(stableJson(input.draft)).toBe(before);
 });
 it('same structured review produces identical JSON and Markdown', async () => {
  const a = await runCritic(criticInput(), prompt, new FakeLanguageModel(criticAnalysis()));
  const b = await runCritic(criticInput(), prompt, new FakeLanguageModel(criticAnalysis()));
  expect(stableJson(a)).toBe(stableJson(b)); expect(reviewArtifacts(a)).toEqual(reviewArtifacts(b));
 });
 it('rejects a recorded review for another request', async () => {
  const { request } = prepareCriticRequest(criticInput(), prompt);
  const model = new RecordedLanguageModel({ schemaVersion: 1, provenance: { mode: 'imported-session-analysis', model: 'Fixture', description: 'Offline test.' },
   critic: { requestHash: '0'.repeat(64), response: criticAnalysis() } });
  await expect(model.generateStructured(request)).rejects.toThrow('hash mismatch');
 });
 it('has no rewrite/source/content/publication/other-agent capabilities', () => {
  expect(CRITIC_POLICY.mustNot).toEqual(expect.arrayContaining(['rewrite-draft', 'write-source', 'write-content', 'publish', 'invoke-agent']));
  expect(CRITIC_POLICY.maxModelCalls).toBe(1);
 });
});

