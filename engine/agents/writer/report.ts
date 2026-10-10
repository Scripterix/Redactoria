import type { WriterAnalysis, Draft } from './contract.ts';
import { stableJson } from '../../core/serialization.ts';
export function renderArticle(analysis: WriterAnalysis & { interactionOpportunities?: Draft['interactionOpportunities'] }) {
 const lines = ['# ' + analysis.title, '', 'Zakres: PHP ' + analysis.targetPhpVersions.join('–') + '. Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.', ''];
 for (const section of analysis.sections) {
  lines.push('<a id="' + section.id + '"></a>', '', '## ' + section.heading, '', section.body, '');
  for (const example of section.examples) lines.push('### ' + example.purpose, '', '```php', example.code, '```', '',
   'Oczekiwany wynik:', '', '```text', example.expectedOutput.trimEnd(), '```', '',
   ...(example.expectedDiagnostics.length ? ['Oczekiwane diagnostyki: ' + example.expectedDiagnostics.join('; '), ''] : []));
 }
 lines.push('---', '', analysis.interactionOpportunities ? 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie zgody B2 oraz rzeczywiste wykonania PHP 8.4 i 8.5. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.' : 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zaakceptowany Research Packet i obowiązkowe uzupełnienie runtime. Mapa evidence oraz provenance znajdują się w article.json.', '',
  ...analysis.limitations.map(item => '- ' + item), '');
 return lines.join('\n');
}
export function wordCount(article: string) {
 const prose = article.replace(/\`\`\`[\s\S]*?\`\`\`/g, '').replace(/<[^>]*>/g, '');
 return (prose.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu) ?? []).length;
}
export function draftArtifacts(draft: Draft) {
 return { ['drafts/' + draft.topic + '/article.json']: stableJson(draft),
  ['drafts/' + draft.topic + '/article.md']: renderArticle(draft) };
}

