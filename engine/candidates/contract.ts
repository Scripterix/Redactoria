import { z } from 'zod';
import { DraftSchema } from '../agents/writer/contract.ts';
import { LabRef, PhpVersions, Sha, Slug, Text } from '../core/editorial-context.ts';

/** Schema 2 names the editorial decision generically so a single-source REWRITE is not mislabeled as MERGE. */
export const PublicationCandidateV2Schema = z.strictObject({
	schemaVersion: z.literal(2), status: z.literal('publication-candidate'), topic: Slug, title: Text,
	criticVerdict: z.literal('PASS'), targetPhpVersions: PhpVersions,
	sourceDecision: LabRef, researchPacket: LabRef, researchApproval: LabRef, runtimeVerification: LabRef,
	draftRef: LabRef, draftMetadataRef: LabRef, criticReviewRef: LabRef, revisionRef: LabRef,
	articleHash: Sha, draftMetadataHash: Sha, criticReviewHash: Sha, revisionHash: Sha,
	wordCount: z.number().int().positive(), preparedAt: z.iso.datetime(),
	readyForHumanPublicationDecision: z.literal(true), humanPublicationDecision: z.literal('pending'),
	approvedForPublication: z.literal(false), published: z.literal(false), reviewedDraft: DraftSchema,
});

export type PublicationCandidateV2 = z.infer<typeof PublicationCandidateV2Schema>;
