import { z } from 'zod';
import type { LanguageModel, StructuredRequest } from '../../core/language-model.ts';
import { hashJson } from '../../core/serialization.ts';
import { hashBytes, modelContext } from '../../core/editorial-context.ts';
import { DraftSchema, WriterAnalysisSchema } from './contract.ts';
import { validateWriterInput, validateWriterAnalysis, validateDraft } from './validation.ts';
import { renderArticle, wordCount } from './report.ts';
export function prepareWriterRequest(raw: unknown, prompt: string) {
 const basis = validateWriterInput(raw);
 const request: StructuredRequest = { phase: 'writer', instructions: prompt,
  context: modelContext(basis), jsonSchema: z.toJSONSchema(WriterAnalysisSchema) };
 return { basis, request };
}
export async function runWriter(raw: unknown, prompt: string, model: LanguageModel) {
 const { basis, request } = prepareWriterRequest(raw, prompt);
 const analysis = validateWriterAnalysis(await model.generateStructured(request), basis);
 const article = renderArticle(analysis);
 const draft = DraftSchema.parse({ ...analysis, schemaVersion: 1, status: 'draft',
  topic: basis.input.config.topic, audience: basis.input.config.audience,
  sourceDecision: basis.input.config.sourceDecision, researchPacket: basis.input.config.researchPacket,
  researchApproval: basis.input.config.researchApproval, runtimeVerification: basis.input.config.runtimeVerification,
  sources: basis.decision.targets, approvedArtifacts: basis.approval.evidence.artifacts,
  wordCount: wordCount(article), articleHash: hashBytes(article),
  writerExecution: { inputHash: hashJson(basis.input), requestHash: hashJson(request), model: model.identity, modelCalls: 1 } });
 return validateDraft(draft, basis.input);
}

