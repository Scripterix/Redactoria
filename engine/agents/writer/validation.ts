import { editorialBasis, hashBytes, runtimeTargets, unique } from '../../core/editorial-context.ts';
import type { EditorialInput, EditorialBasis } from '../../core/editorial-context.ts';
import { hashJson, stableJson } from '../../core/serialization.ts';
import { DraftSchema, WriterAnalysisV1Schema, WriterAnalysisV2Schema, SingleWriterAnalysisSchema } from './contract.ts';
import { renderArticle, renderLegacyArticle, wordCount } from './report.ts';
export function validateWriterInput(raw: unknown) { return editorialBasis(raw); }
export function validateWriterAnalysis(raw: unknown, basis: EditorialBasis) {
 const baseSchema = basis.input.config.schemaVersion === 1 ? WriterAnalysisV1Schema : WriterAnalysisV2Schema;
 const analysis = (basis.decision.action === 'MERGE' ? baseSchema : SingleWriterAnalysisSchema).parse(raw);
 if (basis.decision.action !== 'MERGE') {
  const interactions = SingleWriterAnalysisSchema.parse(raw).interactionOpportunities;
  unique(interactions.map(item => item.id), 'interaction IDs');
  if (interactions.some(item => !analysis.sections.some(section => section.id === item.sectionId))) throw new Error('Unknown interaction section.');
 }
 const analysisRuntimes = 'targetPhpVersions' in analysis
  ? analysis.targetPhpVersions.map(version => ({ id: 'php-' + version.replace('.', '-'), kind: 'node', version }))
  : analysis.targetRuntimes;
 if (stableJson(analysisRuntimes) !== stableJson(runtimeTargets(basis.input.config))) throw new Error('Unsupported runtime scope.');
 unique(analysis.sections.map(section => section.id), 'section IDs');
 unique(analysis.sections.flatMap(section => section.examples.map(example => example.id)), 'example IDs');
 const covered = analysis.sections.flatMap(section => section.coverage);
 if (covered.some(id => !basis.input.config.requiredCoverage.includes(id))
  || basis.input.config.requiredCoverage.some(id => !covered.includes(id))) throw new Error('Missing or unknown required coverage.');
 for (const section of analysis.sections) {
  basis.evidence(section.evidence);
  if (section.body.includes('```')) throw new Error('Code must be structured examples, not hidden in prose.');
  for (const example of section.examples) {
   if (basis.input.config.schemaVersion === 1 && (!example.code.startsWith('<?php\n') || example.code.includes('?>'))) throw new Error('Standalone PHP block required.');
  const phpCliTarget = basis.input.config.schemaVersion === 2 && runtimeTargets(basis.input.config).some(target => target.id === 'php-cli' && target.kind === 'cli');
  if (basis.input.config.schemaVersion === 2 && (!example.language || (example.language === 'php' && !phpCliTarget))) throw new Error('Runtime-neutral examples require an explicit non-PHP language unless the approved target is php-cli.');
  }
 }
 for (const addendum of basis.approval.requiredAddenda) if (!analysis.sections.some(section => section.evidence.some(ref => ref.kind === 'addendum' && ref.id === addendum.findingId))) throw new Error('Mandatory runtime addendum omitted.');
 return analysis;
}
export function validateDraft(raw: unknown, input: EditorialInput, article?: string) {
 const basis = editorialBasis(input), draft = DraftSchema.parse(raw);
 validateWriterAnalysis({ action: draft.action, title: draft.title,
  ...(draft.schemaVersion === 1 ? { targetPhpVersions: draft.targetPhpVersions } : { targetRuntimes: draft.targetRuntimes }),
  sections: draft.sections, limitations: draft.limitations,
  ...(draft.interactionOpportunities ? { interactionOpportunities: draft.interactionOpportunities } : {}) }, basis);
 const rendered = [renderArticle(draft), renderLegacyArticle(draft)].find(candidate =>
  draft.articleHash === hashBytes(candidate)
  && draft.wordCount === wordCount(candidate)
  && (article === undefined || article === candidate));
 if (draft.topic !== input.config.topic || draft.audience !== input.config.audience
  || draft.sourceDecision !== input.config.sourceDecision || draft.researchPacket !== input.config.researchPacket
  || draft.researchApproval !== input.config.researchApproval || draft.runtimeVerification !== input.config.runtimeVerification
  || stableJson(draft.sources) !== stableJson(basis.decision.targets)
  || stableJson(draft.approvedArtifacts) !== stableJson(basis.approval.evidence.artifacts)
  || draft.writerExecution.inputHash !== hashJson(input)
  || rendered === undefined) throw new Error('Unknown/changed draft or provenance mismatch.');
 return draft;
}

