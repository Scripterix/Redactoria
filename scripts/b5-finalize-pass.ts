import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!topic) throw new Error('Usage: node scripts/b5-finalize-pass.ts --topic <slug>');
const draft = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/article.json`), 'utf8')) as any;
const revision = {
	schemaVersion: 1,
	topic,
	mode: 'critic-pass-no-correction',
	issueId: null,
	writerGenerations: 1,
	additionalWriterGenerations: 0,
	changedExamples: 0,
	beforeArticleHash: draft.articleHash,
	afterArticleHash: draft.articleHash,
	beforeDraftHash: hashJson(draft),
	afterDraftHash: hashJson(draft),
	authorizationRef: 'lab/decisions/b5-authorization.json',
	revisedAt: null,
	note: 'First full Critic review passed; the conditional correction stage was not entered.',
};
await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/revision.json`]: stableJson(revision) });
console.log(`Recorded no-op revision audit for ${topic} Critic PASS.`);
