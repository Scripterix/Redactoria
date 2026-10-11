import { editorialBasis, hashBytes, runtimeTargets, unique } from '../../core/editorial-context.ts';
import { hashJson, stableJson } from '../../core/serialization.ts';
import { validateDraft } from '../writer/validation.ts';
import { CRITERIA, CriticAnalysisSchema, CriticInputSchema, CriticReviewSchema } from './contract.ts';
import type { CriticAnalysis, CriticInput } from './contract.ts';
export function validateCriticInput(raw: unknown) {
 const input = CriticInputSchema.parse(raw), basis = editorialBasis(input.editorial);
 validateDraft(input.draft, basis.input, input.article);
 if (input.draftRef !== 'lab/drafts/' + input.draft.topic + '/article.md') throw new Error('Unknown draft reference.');
 const execution = input.codeExecution;
 if (execution) {
  if (execution.articleHash !== input.draft.articleHash) throw new Error('Code execution is for an unknown draft.');
  const examples = input.draft.sections.flatMap(section => section.examples);
  if (execution.schemaVersion === 1) {
   unique(execution.runs.map(run => run.family), 'execution families');
   for (const run of execution.runs) {
    if (basis.runtime.schemaVersion !== 1) throw new Error('PHP execution requires PHP runtime evidence.');
    const runtime = basis.runtime.runs.find(item => item.family === run.family);
    if (!runtime || runtime.version !== run.version || runtime.executableHash !== run.executableHash) throw new Error('Unknown executed PHP runtime.');
    unique(run.examples.map(item => item.id), 'executed examples');
    if (run.examples.length !== examples.length) throw new Error('Missing executed draft examples.');
    for (const example of examples) {
     const record = run.examples.find(item => item.id === example.id);
     if (!record || record.codeHash !== hashBytes(example.code)) throw new Error('Unknown executed code/hash.');
     const matches = record.exitCode === 0 && record.stdout === example.expectedOutput
      && (example.expectedDiagnostics.length ? example.expectedDiagnostics.join('\n') + '\n' : '') === record.stderr;
     if ((record.status === 'PASS') !== matches) throw new Error('Incorrect code execution status.');
    }
   }
  } else {
   unique(execution.runs.map(run => run.runtimeId), 'execution runtimes');
   const expectedRuntimes = runtimeTargets(basis.input.config);
   if (execution.runs.length !== expectedRuntimes.length || basis.runtime.schemaVersion !== 2) throw new Error('Missing JavaScript execution runtime.');
   for (const run of execution.runs) {
    const target = expectedRuntimes.find(item => item.id === run.runtimeId);
    const runtime = basis.runtime.runs.find(item => item.runtimeId === run.runtimeId);
    if (!target || !runtime || target.kind !== run.kind || target.version !== run.version
     || runtime.version !== run.version || runtime.executableHash !== run.executableHash) throw new Error('Unknown executed JavaScript runtime.');
    unique(run.examples.map(item => item.id), 'executed examples');
    if (run.examples.length !== examples.length) throw new Error('Missing executed draft examples.');
    for (const example of examples) {
     const record = run.examples.find(item => item.id === example.id);
     if (!record || record.codeHash !== hashBytes(example.code)) throw new Error('Unknown executed code/hash.');
     const matches = record.stdout === example.expectedOutput
      && (example.expectedDiagnostics.length ? example.expectedDiagnostics.join('\n') + '\n' : '') === record.stderr
      && (run.kind === 'browser' ? record.exitCode === null : record.exitCode === 0);
     if ((record.status === 'PASS') !== matches) throw new Error('Incorrect JavaScript execution status.');
    }
   }
  }
  if ((execution.status === 'PASS') !== execution.runs.every(run => run.examples.every(record => record.status === 'PASS'))) throw new Error('Incorrect aggregate execution status.');
 }
 return { input, basis };
}
export function requiredChanges(analysis: CriticAnalysis) {
 return analysis.issues.filter(issue => issue.severity !== 'optional' || issue.status === 'needs-research').map(issue => ({ issueId: issue.id, instruction: issue.change }));
}
export function optionalImprovements(analysis: CriticAnalysis) {
 return analysis.issues.filter(issue => issue.severity === 'optional' && issue.status !== 'needs-research').map(issue => ({ issueId: issue.id, instruction: issue.change }));
}
export function validateCriticAnalysis(raw: unknown, input: CriticInput) {
 const { basis } = validateCriticInput(input), analysis = CriticAnalysisSchema.parse(raw);
 unique(analysis.checks.map(check => check.criterion), 'review criteria');
 unique(analysis.issues.map(issue => issue.id), 'issue IDs');
 for (const criterion of CRITERIA) if (!analysis.checks.some(check => check.criterion === criterion)) throw new Error('Missing review criterion.');
 for (const issue of analysis.issues) {
  const section = input.draft.sections.find(item => item.id === issue.location.sectionId);
  if (!section || ![section.heading, section.body, ...section.examples.flatMap(item => [item.code, item.purpose, item.expectedOutput])].some(text => text.includes(issue.location.quote))) throw new Error('Unknown draft location/quote.');
  if (!['STRUCTURE', 'CLARITY', 'DUPLICATION'].includes(issue.category) || issue.evidence.length) basis.evidence(issue.evidence);
  const check = analysis.checks.find(item => item.criterion === issue.category)!;
  if (check.result === 'PASS') throw new Error('Issue conflicts with PASS criterion.');
  if (issue.status === 'needs-research' && check.result !== 'NEEDS_RESEARCH') throw new Error('Missing needs-research criterion.');
 }
 for (const check of analysis.checks) if (check.result !== 'PASS' && !analysis.issues.some(issue => issue.category === check.criterion)) throw new Error('Non-PASS criterion needs a grounded issue.');
 const expected = analysis.issues.some(issue => issue.severity === 'blocking') ? 'BLOCK'
  : requiredChanges(analysis).length ? 'REVISE' : 'PASS';
 if (analysis.verdict !== expected) throw new Error('Verdict contradicts issue severity.');
 if (analysis.verdict === 'PASS' && input.draft.sections.some(section => section.examples.length) && input.codeExecution?.status !== 'PASS') throw new Error('PASS requires actual passing draft example execution.');
 return analysis;
}
export function validateCriticReview(raw: unknown, input: CriticInput, expectedRequestHash?: string) {
 const review = CriticReviewSchema.parse(raw);
 const { schemaVersion: _version, topic: _topic, draftRef: _ref, articleHash: _article, draftMetadataHash: _metadata,
  researchPacket: _packet, researchApproval: _approval, requiredChanges: _required, optionalImprovements: _optional,
  criticExecution: _execution, ...rawAnalysis } = review;
 const analysis = validateCriticAnalysis(rawAnalysis, input);
 if (review.topic !== input.draft.topic || review.draftRef !== input.draftRef || review.articleHash !== input.draft.articleHash
  || review.draftMetadataHash !== hashJson(input.draft) || review.researchPacket !== input.draft.researchPacket
  || review.researchApproval !== input.draft.researchApproval || review.criticExecution.inputHash !== hashJson(input)
  || (expectedRequestHash !== undefined && review.criticExecution.requestHash !== expectedRequestHash)
  || stableJson(review.requiredChanges) !== stableJson(requiredChanges(analysis))
  || stableJson(review.optionalImprovements) !== stableJson(optionalImprovements(analysis))) throw new Error('Review provenance or changes mismatch.');
 return review;
}

