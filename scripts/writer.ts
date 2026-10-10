import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RecordedLanguageModel } from '../engine/adapters/recorded-language-model.ts';
import { prepareWriterRequest, runWriter } from '../engine/agents/writer/agent.ts';
import { draftArtifacts } from '../engine/agents/writer/report.ts';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { loadEditorialInput, parseEditorialArguments, project, readLab, sourceRoot } from './editorial-input.ts';
export async function main() {
 const args = parseEditorialArguments(process.argv.slice(2), '--topic');
 const input = await loadEditorialInput(args.selected);
 const prompt = await readFile(new URL(input.sources.length === 1 ? '../engine/agents/writer/prompt-single.md' : '../engine/agents/writer/prompt.md', import.meta.url), 'utf8');
 if (args.prepare) {
  const { request } = prepareWriterRequest(input, prompt);
  await writeEditorialArtifacts(project, sourceRoot, 'writer', { ['drafts/' + input.config.topic + '/request.json']:
   stableJson({ schemaVersion: 1, inputHash: hashJson(input), requestHash: hashJson(request), request }) });
  console.log('Prepared Writer request; no model call. ' + hashJson(request)); return;
 }
 const model = new RecordedLanguageModel(JSON.parse(await readLab(args.responses ?? 'lab/drafts/' + input.config.topic + '/session-responses.json')));
 const draft = await runWriter(input, prompt, model);
 await writeEditorialArtifacts(project, sourceRoot, 'writer', draftArtifacts(draft));
 console.log('Writer: DRAFT, ' + draft.wordCount + ' prose words; one model call; ' + model.identity.mode + '; ' + draft.articleHash);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });

