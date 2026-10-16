import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { B6_AUTHORIZATION_REF, B6_TOPICS } from '../engine/core/b6-authorization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!B6_TOPICS.includes(topic as typeof B6_TOPICS[number])) throw new Error('Usage: node scripts/b6-finalize-pass.ts --topic <B6 topic>');
const draft = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/article.json`), 'utf8')) as any;
const revision = {
	schemaVersion: 1, topic, mode: 'critic-pass-no-correction', issueId: null, writerGenerations: 1, additionalWriterGenerations: 0, changedExamples: 0,
	beforeArticleHash: draft.articleHash, afterArticleHash: draft.articleHash, beforeDraftHash: hashJson(draft), afterDraftHash: hashJson(draft), authorizationRef: B6_AUTHORIZATION_REF,
	revisedAt: null, note: 'First full Critic review passed; the conditional correction stage was not entered.',
};
await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/revision.json`]: stableJson(revision) });
console.log(`Recorded no-op B6 revision audit for ${topic}.`);
