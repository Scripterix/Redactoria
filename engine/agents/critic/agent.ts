import { z } from 'zod';
import type { LanguageModel, StructuredRequest } from '../../core/language-model.ts';
import { hashJson } from '../../core/serialization.ts';
import { modelContext } from '../../core/editorial-context.ts';
import { CriticAnalysisSchema, CriticReviewSchema } from './contract.ts';
import { optionalImprovements, requiredChanges, validateCriticInput, validateCriticAnalysis, validateCriticReview } from './validation.ts';
export function prepareCriticRequest(raw: unknown, prompt: string) {
 const { input, basis } = validateCriticInput(raw);
 const request: StructuredRequest = { phase: 'critic', instructions: prompt,
  context: { approved: modelContext(basis), draft: input.draft, draftRef: input.draftRef, article: input.article, codeExecution: input.codeExecution },
  jsonSchema: z.toJSONSchema(CriticAnalysisSchema) };
 return { input, request };
}
export async function runCritic(raw: unknown, prompt: string, model: LanguageModel) {
 const { input, request } = prepareCriticRequest(raw, prompt);
 const analysis = validateCriticAnalysis(await model.generateStructured(request), input);
 return validateCriticReview(CriticReviewSchema.parse({ ...analysis, schemaVersion: 1, topic: input.draft.topic,
  draftRef: input.draftRef, articleHash: input.draft.articleHash, draftMetadataHash: hashJson(input.draft),
  researchPacket: input.draft.researchPacket, researchApproval: input.draft.researchApproval,
  requiredChanges: requiredChanges(analysis), optionalImprovements: optionalImprovements(analysis),
  criticExecution: { inputHash: hashJson(input), requestHash: hashJson(request), model: model.identity, modelCalls: 1 } }), input, hashJson(request));
}

