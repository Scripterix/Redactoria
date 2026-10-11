import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EditorialInputSchema, LabRef, ResearchApprovalSchema, Slug, TopicConfigSchema } from '../engine/core/editorial-context.ts';
import { isWithin } from '../engine/core/lab-writer.ts';
import { createSourceReader } from '../engine/core/source-reader.ts';
import { InventoryInputSchema } from '../engine/agents/cartographer/contract.ts';
export const project = fileURLToPath(new URL('../', import.meta.url));
export const sourceRoot = resolve(project, '../temp-ogwo/posts');
export async function readLab(path: string) {
 LabRef.parse(path);
 const target = await realpath(resolve(project, path)), lab = await realpath(resolve(project, 'lab'));
 if (!isWithin(lab, target) || (await stat(target)).size > 1500000) throw new Error('LAB read escapes scope or exceeds budget.');
 return readFile(target, 'utf8');
}
export function parseEditorialArguments(args: string[], selector: '--topic' | '--draft') {
 let selected: string | undefined, responses: string | undefined, prepare = false;
 for (let index = 0; index < args.length; index++) {
  const flag = args[index]!;
  if (flag === '--prepare' && !prepare) { prepare = true; continue; }
  const value = args[++index];
  if (!value || value.startsWith('--')) throw new Error('CLI argument needs a value.');
  if (flag === selector && !selected) selected = value;
  else if (flag === '--responses' && !responses) responses = value;
  else throw new Error('Unknown or duplicate editorial CLI argument.');
 }
 if (!selected) throw new Error(selector + ' is required.');
 if (selector === '--topic') Slug.parse(selected);
 else if (!/^lab\/drafts\/[a-z0-9]+(?:-[a-z0-9]+)*\/article\.md$/.test(selected)) throw new Error('Unknown draft path.');
 if (responses) LabRef.parse(responses);
 return { selected, responses, prepare };
}
export async function loadEditorialInput(topic: string) {
 Slug.parse(topic);
 const config = TopicConfigSchema.parse(JSON.parse(await readLab('lab/drafts/' + topic + '/input.json')));
 if (config.topic !== topic) throw new Error('Topic configuration mismatch.');
 const approvalText = await readLab(config.researchApproval);
 const approval = ResearchApprovalSchema.parse(JSON.parse(approvalText));
 const paths = new Set([config.sourceDecision, config.researchApproval, config.researchPacket, config.runtimeVerification,
  config.runtimeVerification.replace(/\.json$/, '.md'), ...approval.evidence.artifacts.map(item => item.path),
  ...approval.requiredAddenda.map(item => item.ref), ...((approval.schemaVersion === 2 || approval.schemaVersion === 3) ? [approval.authorizationRef] : [])]);
 const artifacts = await Promise.all([...paths].map(async path => ({ path, contents: path === config.researchApproval ? approvalText : await readLab(path) })));
 const inventory = InventoryInputSchema.parse(JSON.parse(await readLab('lab/inventory/inventory.json')));
 const reader = createSourceReader(sourceRoot);
 const sources = [];
 for (const target of approval.targets) {
  const article = inventory.articles.find(item => item.source_id === target.sourceId && item.source_path === target.sourcePath && item.content_hash === target.contentHash);
  if (!article) throw new Error('Unknown approved source target.');
  sources.push(await reader(article, { maxSourceBytes: 262144, maxBodyCharacters: 131072 }));
 }
 return EditorialInputSchema.parse({ config, artifacts, sources });
}

