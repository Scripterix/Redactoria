import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LanguageModel, StructuredRequest } from '../../engine/core/language-model.ts';
import { EditorialInputSchema } from '../../engine/core/editorial-context.ts';
import { stableJson } from '../../engine/core/serialization.ts';
export const project = fileURLToPath(new URL('../../', import.meta.url));
export function textFile(path: string) { return readFileSync(resolve(project, path), 'utf8'); }
export function jsonFile(path: string) { return JSON.parse(textFile(path)); }
const config = jsonFile('lab/drafts/php-arrays/input.json');
const approval = jsonFile(config.researchApproval);
const paths = [...new Set<string>([config.sourceDecision, config.researchApproval, config.researchPacket, config.runtimeVerification,
 config.runtimeVerification.replace(/\.json$/, '.md'), ...approval.evidence.artifacts.map((entry: {path: string}) => entry.path),
 ...approval.requiredAddenda.map((entry: {ref: string}) => entry.ref)])];
const captured = EditorialInputSchema.parse({ config, artifacts: paths.map(path => ({ path, contents: textFile(path) })),
 sources: jsonFile('lab/drafts/php-arrays/request.json').request.context.sources });
export function inputFixture() { return structuredClone(captured); }
export function writerAnalysis() { return jsonFile('lab/drafts/php-arrays/session-responses.json').writer.response; }
// Contract regressions deliberately replay the original REVISE scenario, not mutable latest editorial state.
export function criticAnalysis() { return jsonFile('lab/reviews/php-arrays/session-responses-001.json').critic.response; }
export function criticInput() {
 return { editorial: inputFixture(), draft: jsonFile('lab/drafts/php-arrays/article-001.json'), draftRef: 'lab/drafts/php-arrays/article.md',
  article: textFile('lab/drafts/php-arrays/article-001.md'), codeExecution: jsonFile('lab/drafts/php-arrays/code-execution-001.json') };
}
export function mutateArtifact(input: ReturnType<typeof inputFixture>, path: string, update: (raw: any) => void) {
 const artifact = input.artifacts.find(item => item.path === path)!;
 const raw = JSON.parse(artifact.contents); update(raw); artifact.contents = stableJson(raw);
}
export class FakeLanguageModel implements LanguageModel {
 readonly identity = { adapter: 'fake', model: 'Offline editorial fixture', mode: 'test' as const };
 readonly requests: StructuredRequest[] = [];
 constructor(private readonly response: unknown) {}
 async generateStructured(request: StructuredRequest) { this.requests.push(request); return structuredClone(this.response); }
}

