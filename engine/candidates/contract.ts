import { z } from 'zod';
import { DraftSchema, DraftV2Schema } from '../agents/writer/contract.ts';
import { LabRef, PhpVersions, RuntimeTargetsSchema, Sha, Slug, Text } from '../core/editorial-context.ts';

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

/** Schema 3 records runtime-neutral B3 candidates; publication still requires a separate human decision. */
export const PublicationCandidateV3Schema = z.strictObject({
	schemaVersion: z.literal(3), status: z.literal('publication-candidate'), topic: Slug, title: Text,
	criticVerdict: z.literal('PASS'), targetRuntimes: RuntimeTargetsSchema,
	sourceDecision: LabRef, researchPacket: LabRef, researchApproval: LabRef, runtimeVerification: LabRef,
	draftRef: LabRef, draftMetadataRef: LabRef, criticReviewRef: LabRef, revisionRef: LabRef,
	articleHash: Sha, draftMetadataHash: Sha, criticReviewHash: Sha, revisionHash: Sha,
	wordCount: z.number().int().positive(), preparedAt: z.iso.datetime(),
	readyForHumanPublicationDecision: z.literal(true), humanPublicationDecision: z.literal('pending'),
	approvedForPublication: z.literal(false), published: z.literal(false), reviewedDraft: DraftV2Schema,
});
export type PublicationCandidateV3 = z.infer<typeof PublicationCandidateV3Schema>;
export const PublicationCandidateAnySchema = z.union([PublicationCandidateV2Schema, PublicationCandidateV3Schema]);
export type PublicationCandidateAny = z.infer<typeof PublicationCandidateAnySchema>;
