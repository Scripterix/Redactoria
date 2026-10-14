import { z } from 'zod';
import { EditorialInputSchema, EvidenceRefSchema, ModelIdentitySchema, PhpVersions, RuntimeTargetsSchema, Sha, Slug, Text, LabRef } from '../../core/editorial-context.ts';
export const WriterInputSchema = EditorialInputSchema;
export const CodeExampleSchema = z.strictObject({ id: Slug, purpose: Text, code: Text,
 expectedOutput: z.string(), expectedDiagnostics: z.array(Text), language: z.enum(['php', 'js', 'html', 'markdown', 'shell', 'python']).optional() });
const section = z.strictObject({ id: Slug, heading: Text, body: Text,
 coverage: z.array(Slug), evidence: z.array(EvidenceRefSchema).min(1), examples: z.array(CodeExampleSchema) });
const analysisFields = {
 action: z.literal('DRAFT'), title: Text, sections: z.array(section).min(1).max(30), limitations: z.array(Text).min(1),
};
export const WriterAnalysisV1Schema = z.strictObject({
 ...analysisFields,
 action: z.literal('DRAFT'), title: Text, targetPhpVersions: PhpVersions,
});
export const WriterAnalysisV2Schema = z.strictObject({ ...analysisFields, targetRuntimes: RuntimeTargetsSchema });
export const WriterAnalysisSchema = z.union([WriterAnalysisV1Schema, WriterAnalysisV2Schema]);
export type WriterAnalysis = z.infer<typeof WriterAnalysisSchema>;
export const InteractionOpportunitySchema = z.strictObject({ id: Slug, sectionId: Slug,
 type: z.enum(['mini-quiz', 'predict-output', 'show-output', 'hint', 'exercise', 'compare', 'next-step']), purpose: Text, prompt: Text, expectedConcept: Text,
 implemented: z.literal(false) });
const interactions = z.array(InteractionOpportunitySchema).min(2).max(4);
export const SingleWriterAnalysisSchema = z.union([
 WriterAnalysisV1Schema.extend({ interactionOpportunities: interactions }),
 WriterAnalysisV2Schema.extend({ interactionOpportunities: interactions }),
]);
const draftFields = {
 status: z.literal('draft'), topic: Slug, audience: Text,
 sourceDecision: LabRef, researchPacket: LabRef, researchApproval: LabRef, runtimeVerification: LabRef,
 sources: z.array(z.strictObject({ sourceId: Text, sourcePath: Text, contentHash: Sha, title: Text.nullable(), providedCharacters: z.number().int().positive(), truncated: z.literal(false) })).min(1).max(2),
 interactionOpportunities: interactions.optional(),
 approvedArtifacts: z.array(z.strictObject({ path: LabRef, sha256: Sha })).min(1),
 wordCount: z.number().int().positive(), articleHash: Sha,
 writerExecution: z.strictObject({ inputHash: Sha, requestHash: Sha, model: ModelIdentitySchema, modelCalls: z.literal(1) }),
};
export const DraftV1Schema = WriterAnalysisV1Schema.extend({ schemaVersion: z.literal(1), ...draftFields });
export const DraftV2Schema = WriterAnalysisV2Schema.extend({ schemaVersion: z.literal(2), ...draftFields });
export const DraftSchema = z.union([DraftV1Schema, DraftV2Schema]);
export type Draft = z.infer<typeof DraftSchema>;

