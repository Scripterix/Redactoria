import { z } from 'zod';
import type { CriticInput } from '../agents/critic/contract.ts';
import { validateCriticReview } from '../agents/critic/validation.ts';
import { DraftSchema } from '../agents/writer/contract.ts';
import { validateDraft } from '../agents/writer/validation.ts';
import type { EditorialInput } from '../core/editorial-context.ts';
import { hashBytes } from '../core/editorial-context.ts';
import { hashJson, stableJson } from '../core/serialization.ts';
import { PublicationCandidateV2Schema, type PublicationCandidateV2 } from './contract.ts';

export type CandidateInput = {
	editorial: EditorialInput;
	draftRef: string;
	draftText: string;
	article: string;
	codeExecution: CriticInput['codeExecution'];
	criticReviewRef: string;
	criticReviewText: string;
	revisionRef: string;
	revisionText: string;
	preparedAt: string;
};

export function createPublicationCandidate(input: CandidateInput): PublicationCandidateV2 {
	const draft = DraftSchema.parse(JSON.parse(input.draftText));
	validateDraft(draft, input.editorial, input.article);
	const criticInput: CriticInput = {
		editorial: input.editorial,
		draft,
		draftRef: input.draftRef,
		article: input.article,
		codeExecution: input.codeExecution,
	};
	const review = validateCriticReview(JSON.parse(input.criticReviewText), criticInput);
	if (review.verdict !== 'PASS' || review.requiredChanges.length) throw new Error('Publication candidate requires an exact Critic PASS with no required changes.');
	const revision = z.object({
		afterArticleHash: z.string(),
		afterDraftHash: z.string(),
		additionalWriterGenerations: z.literal(0),
		changedExamples: z.literal(0),
	}).parse(JSON.parse(input.revisionText));
	if (revision.afterArticleHash !== draft.articleHash || revision.afterDraftHash !== hashJson(draft)) {
		throw new Error('Revision audit does not bind the reviewed draft.');
	}
	if (input.draftRef !== `lab/drafts/${draft.topic}/article.md`
		|| input.criticReviewRef !== `lab/reviews/${draft.topic}/critic-review.json`
		|| input.revisionRef !== `lab/drafts/${draft.topic}/revision.json`) throw new Error('Unexpected candidate provenance paths.');
	const candidate = {
		schemaVersion: 2 as const,
		status: 'publication-candidate' as const,
		topic: draft.topic,
		title: draft.title,
		criticVerdict: 'PASS' as const,
		targetPhpVersions: draft.targetPhpVersions,
		sourceDecision: draft.sourceDecision,
		researchPacket: draft.researchPacket,
		researchApproval: draft.researchApproval,
		runtimeVerification: draft.runtimeVerification,
		draftRef: input.draftRef,
		draftMetadataRef: input.draftRef.replace(/\.md$/, '.json'),
		criticReviewRef: input.criticReviewRef,
		revisionRef: input.revisionRef,
		articleHash: hashBytes(input.article),
		draftMetadataHash: hashBytes(input.draftText),
		criticReviewHash: hashBytes(input.criticReviewText),
		revisionHash: hashBytes(input.revisionText),
		wordCount: draft.wordCount,
		preparedAt: input.preparedAt,
		readyForHumanPublicationDecision: true as const,
		humanPublicationDecision: 'pending' as const,
		approvedForPublication: false as const,
		published: false as const,
		reviewedDraft: draft,
	};
	if (candidate.articleHash !== draft.articleHash || candidate.sourceDecision !== input.editorial.config.sourceDecision
		|| candidate.researchPacket !== input.editorial.config.researchPacket
		|| candidate.researchApproval !== input.editorial.config.researchApproval
		|| candidate.runtimeVerification !== input.editorial.config.runtimeVerification) throw new Error('Candidate does not match approved editorial input.');
	return PublicationCandidateV2Schema.parse(candidate);
}

export function candidateArtifacts(candidate: PublicationCandidateV2, article: string) {
	const schema = z.toJSONSchema(PublicationCandidateV2Schema);
	const readme = `# ${candidate.title} — publication candidate\n\n`
		+ `State: **AWAIT HUMAN PUBLICATION DECISION**. LAB only; no CONTENT, promotion, commit, push or deploy.\n\n`
		+ `\`article.md\` is byte-identical to the Critic-PASS Writer draft. SHA-256: \`${candidate.articleHash}\`.\n`
		+ `The candidate is bound to the exact draft metadata, final Critic review and revision audit.\n\n`
		+ `Status: \`publication-candidate\`; Critic: \`PASS\`; human decision: \`pending\`; `
		+ `approvedForPublication: \`false\`; published: \`false\`.\n`;
	return {
		'article.json': stableJson(candidate),
		'article.md': article,
		'candidate.schema.json': stableJson(schema),
		'README.md': readme,
	};
}
