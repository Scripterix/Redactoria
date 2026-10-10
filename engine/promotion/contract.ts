import { z } from 'zod';
import { LabRef, PhpVersions, Sha, Slug, Text } from '../core/editorial-context.ts';
import { DraftSchema } from '../agents/writer/contract.ts';
import { createArticleSchema } from '../../src/lib/content-schema.ts';

export const CandidateRef = z.string().regex(/^lab\/candidates\/[a-z0-9]+(?:-[a-z0-9]+)*\/article\.json$/);
export const DecisionRef = z.string().regex(/^lab\/decisions\/[a-z0-9]+(?:-[a-z0-9]+)*\.json$/);
export const ContentMetadataSchema = createArticleSchema(Slug).strict();

/** The immutable M5 artifact stays pending; approval is a separate human record. */
export const PublicationCandidateSchema = z.strictObject({
 schemaVersion: z.literal(1), status: z.literal('publication-candidate'), topic: Slug, title: Text,
 criticVerdict: z.literal('PASS'), targetPhpVersions: PhpVersions,
 mergeDecision: LabRef, researchPacket: LabRef, researchApproval: LabRef, runtimeVerification: LabRef,
 draftRef: LabRef, draftMetadataRef: LabRef, criticReviewRef: LabRef, revisionRef: LabRef,
 articleHash: Sha, draftMetadataHash: Sha, criticReviewHash: Sha, revisionHash: Sha,
 wordCount: z.number().int().positive(), preparedAt: z.iso.datetime(),
 readyForHumanPublicationDecision: z.literal(true), humanPublicationDecision: z.literal('pending'),
 approvedForPublication: z.literal(false), published: z.literal(false), reviewedDraft: DraftSchema,
});

export const PublicationDecisionSchema = z.strictObject({
 schemaVersion: z.literal(1), status: z.literal('approved'), approvedBy: z.literal('human'),
 scope: z.literal('local-publication-test'), approvedAt: z.iso.datetime(), authorization: Text,
 candidateRef: CandidateRef, candidateHash: Sha, articleHash: Sha,
 criticReviewRef: LabRef, criticReviewHash: Sha,
 destination: z.string().regex(/^content\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/),
 metadata: ContentMetadataSchema,
 remotePublicationApproved: z.literal(false),
});
export type PublicationDecision = z.infer<typeof PublicationDecisionSchema>;

export function parsePromotionArguments(args: string[]) {
 let candidate: string | undefined, decision: string | undefined;
 for (let index = 0; index < args.length; index += 2) {
  const flag = args[index], value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error('Promotion argument needs a value.');
  if (flag === '--candidate' && !candidate) candidate = CandidateRef.parse(value);
  else if (flag === '--decision' && !decision) decision = DecisionRef.parse(value);
  else throw new Error('Unknown or duplicate promotion argument.');
 }
 if (!candidate || !decision) throw new Error('--candidate and --decision are required.');
 return { candidate, decision };
}
