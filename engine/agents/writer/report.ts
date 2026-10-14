import type { WriterAnalysis, Draft } from './contract.ts';
import { stableJson } from '../../core/serialization.ts';
type RenderableAnalysis = WriterAnalysis & { interactionOpportunities?: Draft['interactionOpportunities'] };
const CURRENT_AUDIENCE = 'Materiał dla początkujących i osób na poziomie średnim.';
const LEGACY_AUDIENCE = 'Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.';
function renderArticleWithAudience(analysis: RenderableAnalysis, audience: string) {
 const scope = 'targetPhpVersions' in analysis
  ? 'PHP ' + analysis.targetPhpVersions.join('–')
  : analysis.targetRuntimes.map(runtime => `${runtime.kind} ${runtime.version}`).join(', ');
 const lines = ['# ' + analysis.title, '', 'Zakres: ' + scope + '. ' + audience, ''];
 for (const section of analysis.sections) {
  lines.push('<a id="' + section.id + '"></a>', '', '## ' + section.heading, '', section.body, '');
  for (const example of section.examples) lines.push('### ' + example.purpose, '', '```' + (example.language ?? 'php'), example.code, '```', '',
   'Oczekiwany wynik:', '', '```text', example.expectedOutput.trimEnd(), '```', '',
   ...(example.expectedDiagnostics.length ? ['Oczekiwane diagnostyki: ' + example.expectedDiagnostics.join('; '), ''] : []));
 }
 const note = analysis.interactionOpportunities
  ? ('targetPhpVersions' in analysis
    ? 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie zgody B2 oraz rzeczywiste wykonania PHP 8.4 i 8.5. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.'
    : 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.')
  : 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zaakceptowany Research Packet i obowiązkowe uzupełnienie runtime. Mapa evidence oraz provenance znajdują się w article.json.';
 lines.push('---', '', note, '',
  ...analysis.limitations.map(item => '- ' + item), '');
 return lines.join('\n');
}
export function renderArticle(analysis: RenderableAnalysis) {
 return renderArticleWithAudience(analysis, CURRENT_AUDIENCE);
}
/** Replays immutable pre-cleanup drafts without changing their recorded hashes. */
export function renderLegacyArticle(analysis: RenderableAnalysis) {
 return renderArticleWithAudience(analysis, LEGACY_AUDIENCE);
}
export function wordCount(article: string) {
 const prose = article.replace(/\`\`\`[\s\S]*?\`\`\`/g, '').replace(/<[^>]*>/g, '');
 return (prose.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu) ?? []).length;
}
export function draftArtifacts(draft: Draft) {
 return { ['drafts/' + draft.topic + '/article.json']: stableJson(draft),
  ['drafts/' + draft.topic + '/article.md']: renderArticle(draft) };
}

