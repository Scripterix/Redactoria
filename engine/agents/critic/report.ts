import type { CriticReview } from './contract.ts';
import { stableJson } from '../../core/serialization.ts';
export function renderReview(review: CriticReview) {
 const lines = ['# Critic 0.1 — ' + review.topic, '', '## VERDICT', '', review.verdict,
  '', '## SUMMARY', '', review.summary, '', 'Draft: ' + review.draftRef,
  'Draft SHA-256: ' + review.articleHash, 'Mode: ' + review.criticExecution.model.mode, ''];
 const groups = { 'FACTUAL ISSUES': ['FACTUAL_ACCURACY', 'SOURCE_ALIGNMENT'], 'UNSUPPORTED CLAIMS': ['UNSUPPORTED_CLAIMS'],
  'CODE ISSUES': ['CODE_CORRECTNESS'], 'SECURITY ISSUES': ['SECURITY'], 'VERSION ISSUES': ['VERSION_CLAIMS'],
  'STRUCTURE ISSUES': ['STRUCTURE', 'RESEARCH_COVERAGE'], 'STYLE / CLARITY': ['CLARITY', 'DUPLICATION'] };
 for (const [heading, categories] of Object.entries(groups)) {
  lines.push('## ' + heading, '');
  const issues = review.issues.filter(issue => categories.includes(issue.category));
  if (!issues.length) lines.push('Brak zgłoszonych problemów.', '');
  for (const issue of issues) lines.push('### ' + issue.id, '', issue.description, '',
   'Severity: ' + issue.severity + '; status: ' + issue.status + '; confidence: ' + issue.confidence,
   'Location: #' + issue.location.sectionId + '; quote: ' + JSON.stringify(issue.location.quote),
   'Evidence: ' + (issue.evidence.map(ref => ref.kind + '/' + ref.id).join(', ') || 'ocena redakcyjna, nie nowy fakt'),
   'Change: ' + issue.change, '');
 }
 for (const [heading, changes] of [['REQUIRED CHANGES', review.requiredChanges], ['OPTIONAL IMPROVEMENTS', review.optionalImprovements]] as const) {
  lines.push('## ' + heading, '', ...(changes.length ? changes.map(change => '- ' + change.issueId + ': ' + change.instruction) : ['Brak.']), '');
 }
 lines.push('## REVIEW COVERAGE', '', ...review.checks.map(check => '- ' + check.criterion + ': ' + check.result + ' — ' + check.note),
  '', '## LIMITATIONS', '', ...review.limitations.map(item => '- ' + item), '',
  'STOP — PASS oznacza gotowość do human review, nie zgodę na CONTENT ani publikację. Nie uruchomiono ponownie Writera.', '');
 return lines.join('\n');
}
export function reviewArtifacts(review: CriticReview) {
 return { ['reviews/' + review.topic + '/critic-review.json']: stableJson(review),
  ['reviews/' + review.topic + '/critic-review.md']: renderReview(review) };
}

