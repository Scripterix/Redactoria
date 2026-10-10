import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviseRequiredProse } from '../engine/agents/writer/targeted-revision.ts';
import { validateCriticReview } from '../engine/agents/critic/validation.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { loadEditorialInput, project, readLab, sourceRoot } from './editorial-input.ts';

async function main() {
 if (process.argv.slice(2).join(' ') !== '--required-only') throw new Error('Explicit --required-only required; not an automatic loop.');
 const revisionPath = 'lab/drafts/php-control-flow/revision.json';
 try { await access(resolve(project, revisionPath)); throw new Error('B2 revision already exists; stop.'); }
 catch (error) { if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error; }
 const editorial = await loadEditorialInput('php-control-flow');
 const article = await readLab('lab/drafts/php-control-flow/article.md');
 const draftText = await readLab('lab/drafts/php-control-flow/article.json');
 const draft = JSON.parse(draftText);
 const executionText = await readLab('lab/drafts/php-control-flow/code-execution.json');
 const codeExecution = JSON.parse(executionText);
 const request = JSON.parse(await readLab('lab/reviews/php-control-flow/request.json'));
 const review = validateCriticReview(JSON.parse(await readLab('lab/reviews/php-control-flow/critic-review.json')),
  { editorial, draft, article, draftRef: 'lab/drafts/php-control-flow/article.md', codeExecution }, request.requestHash);
 // Targeted Writer correction under the human's full B2 authorization. Code is deliberately unchanged.
 const result = reviseRequiredProse(draft, review, editorial, 'integer-zero-boundary',
  'Drugie ćwiczenie wykorzystuje to do pominięcia dzielenia przez zero przy dzielniku typu `int`. Ścisły test `$denominator !== 0` rozpoznaje tutaj całkowite zero; nie jest ogólnym testem zera numerycznego. Na przykład `0.0 !== 0` daje `true`, ponieważ typy się różnią. Jeśli zmieniasz typ danych w swoim wariancie, musisz też dobrać odpowiedni test wartości.');
 const archive = { writer: ['article.json', 'article.md', 'code-execution.json'], critic: ['request.json', 'session-responses.json', 'critic-review.json', 'critic-review.md'] } as const;
 const archived: { path: string; sha256: string }[] = [];
 for (const role of ['writer', 'critic'] as const) {
  const root = role === 'writer' ? 'drafts' : 'reviews';
  const artifacts: Record<string, string> = {};
  for (const file of archive[role]) {
   const contents = await readLab('lab/' + root + '/php-control-flow/' + file);
   const path = root + '/php-control-flow/original-' + file;
   try { await access(resolve(project, 'lab', path)); throw new Error('Archive already exists: ' + path); }
   catch (error) { if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error; }
   artifacts[path] = contents; archived.push({ path: 'lab/' + path, sha256: hashBytes(contents) });
  }
  await writeEditorialArtifacts(project, sourceRoot, role, artifacts);
 }
 const revision = { schemaVersion: 1, mode: 'human-authorized-required-prose-only', topic: 'php-control-flow', revisedAt: new Date().toISOString(),
  authorizationRef: 'lab/decisions/php-control-flow-b2-authorization.json', issueId: result.issueId, sectionId: result.sectionId,
  beforeArticleHash: result.beforeArticleHash, beforeDraftHash: result.beforeDraftHash, afterArticleHash: result.draft.articleHash,
  afterDraftHash: hashJson(result.draft), quote: result.quote, replacement: result.replacement, archived,
  writerGenerations: 1, additionalWriterGenerations: 0, changedExamples: 0, newPhpExecutions: 0,
  executionReuse: { source: 'lab/drafts/php-control-flow/original-code-execution.json', sourceHash: hashBytes(executionText),
   reason: 'All 16 code strings/expectations unchanged; original actual captures rebound only to the corrected prose article hash. executedAt, runtime identities and every example record unchanged.' } };
 codeExecution.articleHash = result.draft.articleHash;
 await writeEditorialArtifacts(project, sourceRoot, 'writer', { 'drafts/php-control-flow/article.json': stableJson(result.draft),
  'drafts/php-control-flow/article.md': result.article, 'drafts/php-control-flow/revision.json': stableJson(revision),
  'drafts/php-control-flow/code-execution.json': stableJson(codeExecution) });
 console.log('Applied one required prose correction; archived REVISE; code unchanged; actual execution evidence reused. STOP before full Critic review.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
