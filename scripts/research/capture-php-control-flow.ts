import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DocumentSchema, ResearchBundleSchema } from '../../engine/agents/researcher/contract.ts';
import { writeResearchArtifacts } from '../../engine/core/research-writer.ts';
import { stableJson } from '../../engine/core/serialization.ts';
import { officialText } from './capture-php-arrays.ts';
import { documents, questions } from './php-control-flow-sources.ts';
import { readFile } from 'node:fs/promises';

async function main() {
 if (process.argv.slice(2).join(' ') !== '--capture') throw new Error('Explicit --capture required.');
 const project = fileURLToPath(new URL('../../', import.meta.url));
 const sources = await Promise.all(documents.map(async ([id, path, anchor, locator]) => {
  const url = 'https://www.php.net/manual/en/' + path + '.php';
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
  if (response.status !== 200 || response.url !== url) throw new Error('Unexpected official response: ' + id);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const html = new TextDecoder('utf8', { fatal: true }).decode(bytes);
  if (!officialText(html).includes(anchor)) throw new Error('Missing official anchor: ' + id + ': ' + anchor);
  const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1];
  return DocumentSchema.parse({ id, title, url, kind: id.startsWith('migration') ? 'migration' : 'language-reference',
   sourceType: 'official-documentation', retrievedAt: new Date().toISOString(), documentHash: createHash('sha256').update(bytes).digest('hex'),
   retrieval: { method: 'https-get', httpStatus: 200, finalUrl: response.url, selection: 'official-content-excluding-user-notes' },
   excerpts: [{ id: 'anchor', text: anchor, locator }] });
 }));
 // Ternary and comparisons share one official page: consolidate IDs/evidence, not duplicate documents.
 const comparison = sources.find(source => source.id === 'comparison')!;
 comparison.excerpts.push({ ...sources.find(source => source.id === 'ternary')!.excerpts[0]!, id: 'ternary' });
 const probes = JSON.parse(await readFile(resolve(project, 'lab/research/php-control-flow/probes.json'), 'utf8'));
 const bundle = ResearchBundleSchema.parse({ schemaVersion: 1, topicSlug: 'php-control-flow', asOfDate: '2026-10-10',
  provenance: 'Actual HTTPS capture of official PHP manual only; user notes excluded. Short anchors and byte hashes retained. Semantic interpretation is a separate current-session role. Probes are owned controlled reproductions on verified PHP 8.4/8.5, never SOURCE execution.',
  sources: sources.filter(source => source.id !== 'ternary'), probes,
  questions: questions.map(([id, section, question, cartographerFindingIds]) => ({ id, section, question, cartographerFindingIds })) });
 await writeResearchArtifacts(project, resolve(project, '../temp-ogwo/posts'), { 'research/php-control-flow/sources.json': stableJson(bundle) });
 console.log('Captured ' + bundle.sources.length + ' official PHP documents.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
