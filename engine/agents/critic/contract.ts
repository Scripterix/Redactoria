import { z } from 'zod';
import { EditorialInputSchema, EvidenceRefSchema, LabRef, ModelIdentitySchema, Sha, Slug, Text } from '../../core/editorial-context.ts';
import { DraftSchema } from '../writer/contract.ts';
export const CRITERIA = ['FACTUAL_ACCURACY', 'SOURCE_ALIGNMENT', 'CODE_CORRECTNESS', 'RESEARCH_COVERAGE', 'STRUCTURE', 'CLARITY', 'DUPLICATION', 'SECURITY', 'VERSION_CLAIMS', 'UNSUPPORTED_CLAIMS'] as const;
export const CodeExecutionSchema = z.strictObject({
 schemaVersion: z.literal(1), status: z.enum(['PASS', 'FAIL']), articleHash: Sha, executedAt: z.iso.datetime(),
 runs: z.array(z.strictObject({ family: z.enum(['8.4', '8.5']), version: Text, executableHash: Sha, execution: z.literal('actual-local-cli'),
  examples: z.array(z.strictObject({ id: Slug, codeHash: Sha, stdout: z.string(), stderr: z.string(), exitCode: z.number().int(),
   status: z.enum(['PASS', 'FAIL']) })) })).length(2),
});
export const CriticInputSchema = z.strictObject({
 editorial: EditorialInputSchema, draft: DraftSchema, draftRef: LabRef, article: z.string().min(1),
 codeExecution: CodeExecutionSchema.nullable(),
});
export type CriticInput = z.infer<typeof CriticInputSchema>;
export const CriticAnalysisSchema = z.strictObject({
 action: z.literal('REVIEW'), verdict: z.enum(['PASS', 'REVISE', 'BLOCK']), summary: Text,
 checks: z.array(z.strictObject({ criterion: z.enum(CRITERIA), result: z.enum(['PASS', 'ISSUES', 'NEEDS_RESEARCH']), note: Text })).length(CRITERIA.length),
 issues: z.array(z.strictObject({ id: Slug, category: z.enum(CRITERIA), severity: z.enum(['optional', 'required', 'blocking']),
  status: z.enum(['confirmed', 'needs-research']), location: z.strictObject({ sectionId: Slug, quote: Text }),
  description: Text, evidence: z.array(EvidenceRefSchema), change: Text, confidence: z.number().min(0).max(1) })),
 limitations: z.array(Text).min(1),
});
export type CriticAnalysis = z.infer<typeof CriticAnalysisSchema>;
export const CriticReviewSchema = CriticAnalysisSchema.extend({
 schemaVersion: z.literal(1), topic: Slug, draftRef: LabRef, articleHash: Sha, draftMetadataHash: Sha,
 researchPacket: LabRef, researchApproval: LabRef,
 requiredChanges: z.array(z.strictObject({ issueId: Slug, instruction: Text })),
 optionalImprovements: z.array(z.strictObject({ issueId: Slug, instruction: Text })),
 criticExecution: z.strictObject({ inputHash: Sha, requestHash: Sha, model: ModelIdentitySchema, modelCalls: z.literal(1) }),
});
export type CriticReview = z.infer<typeof CriticReviewSchema>;

