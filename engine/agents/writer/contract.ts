import { z } from 'zod';
import { EditorialInputSchema, EvidenceRefSchema, ModelIdentitySchema, PhpVersions, Sha, Slug, Text, LabRef } from '../../core/editorial-context.ts';
export const WriterInputSchema = EditorialInputSchema;
export const CodeExampleSchema = z.strictObject({ id: Slug, purpose: Text, code: Text,
 expectedOutput: z.string(), expectedDiagnostics: z.array(Text) });
export const WriterAnalysisSchema = z.strictObject({
 action: z.literal('DRAFT'), title: Text, targetPhpVersions: PhpVersions,
 sections: z.array(z.strictObject({ id: Slug, heading: Text, body: Text,
  coverage: z.array(Slug), evidence: z.array(EvidenceRefSchema).min(1), examples: z.array(CodeExampleSchema) })).min(1).max(30),
 limitations: z.array(Text).min(1),
});
export type WriterAnalysis = z.infer<typeof WriterAnalysisSchema>;
export const InteractionOpportunitySchema = z.strictObject({ id: Slug, sectionId: Slug,
 type: z.enum(['mini-quiz', 'show-output', 'hint', 'exercise', 'next-step']), purpose: Text, prompt: Text, expectedConcept: Text,
 implemented: z.literal(false) });
export const SingleWriterAnalysisSchema = WriterAnalysisSchema.extend({ interactionOpportunities: z.array(InteractionOpportunitySchema).min(2).max(4) });
export const DraftSchema = WriterAnalysisSchema.extend({
 schemaVersion: z.literal(1), status: z.literal('draft'), topic: Slug, audience: Text,
 sourceDecision: LabRef, researchPacket: LabRef, researchApproval: LabRef, runtimeVerification: LabRef,
 sources: z.array(z.strictObject({ sourceId: Text, sourcePath: Text, contentHash: Sha, title: Text.nullable(), providedCharacters: z.number().int().positive(), truncated: z.literal(false) })).min(1).max(2),
 interactionOpportunities: z.array(InteractionOpportunitySchema).min(2).max(4).optional(),
 approvedArtifacts: z.array(z.strictObject({ path: LabRef, sha256: Sha })).min(1),
 wordCount: z.number().int().positive(), articleHash: Sha,
 writerExecution: z.strictObject({ inputHash: Sha, requestHash: Sha, model: ModelIdentitySchema, modelCalls: z.literal(1) }),
});
export type Draft = z.infer<typeof DraftSchema>;

