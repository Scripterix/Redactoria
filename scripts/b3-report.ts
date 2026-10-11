import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topics = [
 { topic: 'javascript-if-else', rank: 2, runtime: 'Node v24.16.0' },
 { topic: 'javascript-arrays', rank: 3, runtime: 'Node v24.16.0' },
 { topic: 'javascript-dom', rank: 4, runtime: 'Chromium 154.0.0.0' },
];
const metrics = [];
for (const item of topics) {
 const draftText = await readFile(resolve(project, `lab/drafts/${item.topic}/article.json`), 'utf8');
 const draft = JSON.parse(draftText) as any;
 const article = await readFile(resolve(project, `lab/drafts/${item.topic}/article.md`), 'utf8');
 const candidateArticle = await readFile(resolve(project, `lab/candidates/${item.topic}/article.md`), 'utf8');
 const candidate = JSON.parse(await readFile(resolve(project, `lab/candidates/${item.topic}/article.json`), 'utf8')) as any;
 const research = JSON.parse(await readFile(resolve(project, `lab/research/${item.topic}/research.json`), 'utf8')) as any;
 const execution = JSON.parse(await readFile(resolve(project, `lab/drafts/${item.topic}/code-execution.json`), 'utf8')) as any;
 const metric = { schemaVersion: 1, topic: item.topic, b1Rank: item.rank, sourceCount: 1, cartographerAction: 'REWRITE', officialDocuments: research.sourceRegister.length,
  researchQuestions: research.questionAnswers.length, unresolvedResearchQuestions: research.unresolvedQuestions.length,
  finalExamples: draft.sections.flatMap((section: any) => section.examples).length, runtime: item.runtime, runtimeStatus: execution.status,
  runtimeAssertions: execution.runs.flatMap((run: any) => run.examples).reduce((sum: number, example: any) => sum + example.assertions, 0),
  writerGenerations: 1, criticIterations: 1, limitedCorrections: 0, changedExamplesAfterCritic: 0,
  modelCalls: { cartographer: 1, researcher: 1, writer: 1, critic: 1, total: 4 },
  modelIdentifier: null, modelIdentifierNote: 'Requested model: GPT-5.6 Sol; exact runtime model identifier was not exposed, so it is recorded as unknown.',
  elapsedSeconds: null, elapsedNote: 'No reliable end-to-end timer was started before the first job; value intentionally unknown.', tokenUsage: null,
  humanAuthorizationEvents: 1, additionalHumanInterventions: 0, humanAuthorizationRef: 'lab/decisions/b3-authorization.json',
  finalWordCount: draft.wordCount, hashes: { article: hashBytes(article), draftMetadata: hashJson(draft), candidateArticle: hashBytes(candidateArticle) },
  exactCandidate: article === candidateArticle && candidate.articleHash === hashBytes(article), candidateState: { humanPublicationDecision: candidate.humanPublicationDecision, approvedForPublication: candidate.approvedForPublication, published: candidate.published } };
 metrics.push(metric);
 await writeLabArtifacts(project, sourceRoot, { [`reports/b3-${item.topic}-metrics.json`]: stableJson(metric) });
}

const phpArrays = JSON.parse(await readFile(resolve(project, 'lab/candidates/php-arrays/article.json'), 'utf8')) as any;
const phpFlow = JSON.parse(await readFile(resolve(project, 'lab/candidates/php-control-flow/article.json'), 'utf8')) as any;
const report = {
 schemaVersion: 1, status: 'B3_COMPLETE_LAB_ONLY', generatedAt: new Date().toISOString(), samples: [
  { topic: 'php-arrays', language: 'PHP', sample: 'baseline', wordCount: phpArrays.wordCount, candidateSchema: phpArrays.schemaVersion },
  { topic: 'php-control-flow', language: 'PHP', sample: 'B2', wordCount: phpFlow.wordCount, candidateSchema: phpFlow.schemaVersion },
  ...metrics.map(metric => ({ topic: metric.topic, language: 'JavaScript', sample: 'B3', wordCount: metric.finalWordCount, candidateSchema: 3, criticIterations: metric.criticIterations, corrections: metric.limitedCorrections, exactCandidate: metric.exactCandidate })),
 ],
 comparison: [
  'Wszystkie pięć próbek kończy się recenzowanym artefaktem LAB; tylko wcześniejsze próbki PHP mają kontrakt Promotion Gate.',
  'B3 uogólnia kontrakty runtime z PHP na Node i kontrolowaną przeglądarkę, bez zmiany zachowania historycznych artefaktów.',
  'Trzy joby B3 przeszły pierwszy pełny Critic, więc ścieżka ograniczonej korekty pozostała niewykonana zgodnie z warunkiem.',
 ],
 qualityGaps: [
  'Drafty B3 są krótsze niż obie próbki PHP i przed publikacją mogą wymagać ludzkiej oceny tempa, przykładów oraz języka.',
  'DOM sprawdzono w jednej wersji Chromium; nie ma macierzy cross-browser ani testów wizualnych.',
  'Nie zmierzono czasu całego przebiegu ani tokenów, ponieważ licznik nie został uruchomiony przed startem; pola pozostają null.',
 ],
 knowledgeGaps: [],
 boundaries: { sourceModified: false, contentModified: false, publicationPerformed: false, promotionGateExpandedForSchema3: false, gitCommitOrPush: false, deployment: false },
 totals: { samples: 5, b3Jobs: 3, b3ModelCalls: metrics.reduce((sum, metric) => sum + metric.modelCalls.total, 0), b3CriticIterations: 3, b3Corrections: 0, uniqueHumanAuthorizationEvents: 1 },
};
const markdown = `# B3 — porównanie pięciu próbek\n\nStatus: **COMPLETE IN LAB ONLY**. Nie wykonano publikacji, promocji, commitu, pushu ani deployu.\n\n| Próbka | Język | Słowa | Candidate schema | Critic B3 | Korekty B3 |\n|---|---:|---:|---:|---:|---:|\n${report.samples.map((sample: any) => `| ${sample.topic} | ${sample.language} | ${sample.wordCount} | ${sample.candidateSchema} | ${sample.criticIterations ?? '—'} | ${sample.corrections ?? '—'} |`).join('\n')}\n\n## Wnioski\n\n${report.comparison.map(item => `- ${item}`).join('\n')}\n\n## Quality Gaps\n\n${report.qualityGaps.map(item => `- ${item}`).join('\n')}\n\n## Knowledge Gaps\n\nBrak nierozstrzygniętych pytań w trzech zwalidowanych pakietach B3. To nie znaczy, że zakres został rozszerzony poza pytania tych jobów.\n\n## Metryki B3\n\n- 12 jawnych wywołań ról zapisanych w replayach (po 4 na job).\n- 3 pełne iteracje Critic; 0 korekt; 1 wspólne zdarzenie autoryzacji człowieka.\n- Czas end-to-end i tokeny: nieznane (null), bez estymowania.\n`;
await writeLabArtifacts(project, sourceRoot, { 'reports/b3-five-sample-comparison.json': stableJson(report), 'reports/b3-five-sample-comparison.md': markdown });
console.log('Wrote B3 per-job metrics and the five-sample comparison report.');
