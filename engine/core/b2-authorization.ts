import { createHash } from 'node:crypto';
import { z } from 'zod';

/** Bounded authorization, not a human review of a future Research Packet. */
export const B2AuthorizationSchema = z.strictObject({
 schemaVersion: z.literal(1), status: z.literal('approved'), approvedBy: z.literal('human'),
 approvedAt: z.iso.datetime().nullable(), recordedAt: z.iso.datetime(), scope: z.string().min(1),
 source: z.strictObject({ sourceId: z.literal('1308'), sourcePath: z.literal('1308-post-60-instrukcje-sterujace-php.md'),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/), originalUrl: z.url(), title: z.string().min(1) }),
 b1RankingRef: z.literal('lab/cartography/pilot-selection/ranking.json'), authorization: z.string().min(1),
 researchAcceptance: z.strictObject({ mode: z.literal('validation-under-human-task-authorization'),
  humanReviewedPacket: z.literal(false), writerAfterValidatedPacket: z.literal(true), clarification: z.string().min(1) }),
 allowedStages: z.array(z.string().min(1)), publicationApproved: z.literal(false), gitApproved: z.literal(false), otherRanksApproved: z.literal(false),
});
export function validateB2Authorization(contents: string, expectedHash: string,
 targets: { sourceId: string; sourcePath: string; contentHash: string }[]) {
 const record = B2AuthorizationSchema.parse(JSON.parse(contents));
 if (createHash('sha256').update(contents).digest('hex') !== expectedHash || targets.length !== 1
  || targets[0]!.sourceId !== record.source.sourceId || targets[0]!.sourcePath !== record.source.sourcePath
  || targets[0]!.contentHash !== record.source.contentHash
  || ['research', 'writer', 'critic', 'publication-candidate'].some(stage => !record.allowedStages.includes(stage))) {
  throw new Error('B2 authorization hash, target or allowed stages mismatch.');
 }
 return record;
}
