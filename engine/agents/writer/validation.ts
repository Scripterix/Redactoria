import { editorialBasis, hashBytes, unique } from '../../core/editorial-context.ts';
import type { EditorialInput, EditorialBasis } from '../../core/editorial-context.ts';
import { hashJson, stableJson } from '../../core/serialization.ts';
import { DraftSchema, WriterAnalysisSchema } from './contract.ts';
import { renderArticle, wordCount } from './report.ts';
export function validateWriterInput(raw: unknown) { return editorialBasis(raw); }
export function validateWriterAnalysis(raw: unknown, basis: EditorialBasis) {
 const analysis = WriterAnalysisSchema.parse(raw);
 if (stableJson(analysis.targetPhpVersions) !== stableJson(basis.input.config.targetPhpVersions)) throw new Error('Unsupported PHP scope.');
 unique(analysis.sections.map(section => section.id), 'section IDs');
 unique(analysis.sections.flatMap(section => section.examples.map(example => example.id)), 'example IDs');
 const covered = analysis.sections.flatMap(section => section.coverage);
 if (covered.some(id => !basis.input.config.requiredCoverage.includes(id))
  || basis.input.config.requiredCoverage.some(id => !covered.includes(id))) throw new Error('Missing or unknown required coverage.');
 for (const section of analysis.sections) {
  basis.evidence(section.evidence);
  if (section.body.includes('```')) throw new Error('Code must be structured examples, not hidden in prose.');
  for (const example of section.examples) if (!example.code.startsWith('<?php\n') || example.code.includes('?>')) throw new Error('Standalone PHP block required.');
 }
 for (const addendum of basis.approval.requiredAddenda) if (!analysis.sections.some(section => section.evidence.some(ref => ref.kind === 'addendum' && ref.id === addendum.findingId))) throw new Error('Mandatory runtime addendum omitted.');
 return analysis;
}
export function validateDraft(raw: unknown, input: EditorialInput, article?: string) {
 const basis = editorialBasis(input), draft = DraftSchema.parse(raw);
 validateWriterAnalysis({ action: draft.action, title: draft.title, targetPhpVersions: draft.targetPhpVersions, sections: draft.sections, limitations: draft.limitations }, basis);
 const rendered = renderArticle(draft);
 if (draft.topic !== input.config.topic || draft.audience !== input.config.audience
  || draft.sourceDecision !== input.config.sourceDecision || draft.researchPacket !== input.config.researchPacket
  || draft.researchApproval !== input.config.researchApproval || draft.runtimeVerification !== input.config.runtimeVerification
  || stableJson(draft.sources) !== stableJson(basis.decision.targets)
  || stableJson(draft.approvedArtifacts) !== stableJson(basis.approval.evidence.artifacts)
  || draft.writerExecution.inputHash !== hashJson(input)
  || draft.articleHash !== hashBytes(rendered) || draft.wordCount !== wordCount(rendered)
  || (article !== undefined && article !== rendered)) throw new Error('Unknown/changed draft or provenance mismatch.');
 return draft;
}

