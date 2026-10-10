import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RecordedLanguageModel } from '../engine/adapters/recorded-language-model.ts';
import { prepareCriticRequest, runCritic } from '../engine/agents/critic/agent.ts';
import { reviewArtifacts } from '../engine/agents/critic/report.ts';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { loadEditorialInput, parseEditorialArguments, project, readLab, sourceRoot } from './editorial-input.ts';
export async function main() {
 const args = parseEditorialArguments(process.argv.slice(2), '--draft');
 const topic = args.selected.split('/')[2]!;
 const editorial = await loadEditorialInput(topic);
 let codeExecution: unknown = null;
 try { codeExecution = JSON.parse(await readLab('lab/drafts/' + topic + '/code-execution.json')); }
 catch (error) { if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error; }
 const input = { editorial, draftRef: args.selected, article: await readLab(args.selected),
  draft: JSON.parse(await readLab(args.selected.replace(/\.md$/, '.json'))), codeExecution };
 const prompt = await readFile(new URL('../engine/agents/critic/prompt.md', import.meta.url), 'utf8');
 if (args.prepare) {
  const { request } = prepareCriticRequest(input, prompt);
  await writeEditorialArtifacts(project, sourceRoot, 'critic', { ['reviews/' + topic + '/request.json']:
   stableJson({ schemaVersion: 1, inputHash: hashJson(input), requestHash: hashJson(request), request }) });
  console.log('Prepared Critic request; no model call. ' + hashJson(request)); return;
 }
 const model = new RecordedLanguageModel(JSON.parse(await readLab(args.responses ?? 'lab/reviews/' + topic + '/session-responses.json')));
 const review = await runCritic(input, prompt, model);
 await writeEditorialArtifacts(project, sourceRoot, 'critic', reviewArtifacts(review));
 console.log('Critic: ' + review.verdict + '; ' + review.requiredChanges.length + ' required changes; one model call; ' + model.identity.mode + '; STOP.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });

