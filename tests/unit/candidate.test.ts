import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { runCritic } from '../../engine/agents/critic/agent.ts';
import { candidateArtifacts, createPublicationCandidate, type CandidateInput } from '../../engine/candidates/candidate.ts';
import { PublicationCandidateV2Schema } from '../../engine/candidates/contract.ts';
import { hashJson, stableJson } from '../../engine/core/serialization.ts';
import { criticAnalysis, criticInput, FakeLanguageModel, textFile } from '../fixtures/editorial.ts';

const prompt = textFile('engine/agents/critic/prompt.md');

async function fixture(): Promise<CandidateInput> {
	const input = criticInput();
	const analysis = criticAnalysis();
	analysis.verdict = 'PASS';
	analysis.issues = [];
	for (const check of analysis.checks) check.result = 'PASS';
	const review = await runCritic(input, prompt, new FakeLanguageModel(analysis));
	return {
		editorial: input.editorial,
		draftRef: input.draftRef,
		draftText: stableJson(input.draft),
		article: input.article,
		codeExecution: input.codeExecution,
		criticReviewRef: `lab/reviews/${input.draft.topic}/critic-review.json`,
		criticReviewText: stableJson(review),
		revisionRef: `lab/drafts/${input.draft.topic}/revision.json`,
		revisionText: stableJson({
			afterArticleHash: input.draft.articleHash,
			afterDraftHash: hashJson(input.draft),
			additionalWriterGenerations: 0,
			changedExamples: 0,
		}),
		preparedAt: '2026-10-10T20:00:00.000Z',
	};
}

describe('publication candidate v2 gate', () => {
	it('creates an exact pending LAB candidate only after Critic PASS', async () => {
		const input = await fixture();
		const candidate = createPublicationCandidate(input);
		expect(candidate.status).toBe('publication-candidate');
		expect(candidate.criticVerdict).toBe('PASS');
		expect(candidate.readyForHumanPublicationDecision).toBe(true);
		expect(candidate.approvedForPublication).toBe(false);
		expect(candidate.published).toBe(false);
		expect(candidate.reviewedDraft).toEqual(JSON.parse(input.draftText));
		const artifacts = candidateArtifacts(candidate, input.article);
		expect(artifacts['article.md']).toBe(input.article);
		expect(PublicationCandidateV2Schema.parse(JSON.parse(artifacts['article.json']))).toEqual(candidate);
		expect(z.fromJSONSchema(JSON.parse(artifacts['candidate.schema.json'])).parse(candidate)).toEqual(candidate);
	});

	it('rejects REVISE, a forged revision, changed Markdown and an approval flag', async () => {
		const input = await fixture();
		const reviseInput = criticInput();
		const revise = await runCritic(reviseInput, prompt, new FakeLanguageModel(criticAnalysis()));
		expect(() => createPublicationCandidate({ ...input, criticReviewText: stableJson(revise) })).toThrow();
		expect(() => createPublicationCandidate({ ...input, revisionText: stableJson({ afterArticleHash: '0'.repeat(64), afterDraftHash: hashJson(JSON.parse(input.draftText)), additionalWriterGenerations: 0, changedExamples: 0 }) })).toThrow('Revision audit');
		expect(() => createPublicationCandidate({ ...input, article: input.article + '\nchanged' })).toThrow();
		const candidate = createPublicationCandidate(input);
		expect(() => PublicationCandidateV2Schema.parse({ ...candidate, approvedForPublication: true })).toThrow();
	});
});
