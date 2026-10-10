import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { candidateArtifacts, createPublicationCandidate } from '../engine/candidates/candidate.ts';
import { writeCandidateArtifacts } from '../engine/candidates/writer.ts';
import { loadEditorialInput, project, readLab, sourceRoot } from './editorial-input.ts';

async function main() {
	const args = process.argv.slice(2);
	if (args.length !== 2 || args[0] !== '--topic') throw new Error('Usage: npm run candidate -- --topic <slug>');
	const topic = args[1]!;
	const draftRef = `lab/drafts/${topic}/article.md`;
	const criticReviewRef = `lab/reviews/${topic}/critic-review.json`;
	const revisionRef = `lab/drafts/${topic}/revision.json`;
	const candidate = createPublicationCandidate({
		editorial: await loadEditorialInput(topic),
		draftRef,
		draftText: await readLab(draftRef.replace(/\.md$/, '.json')),
		article: await readLab(draftRef),
		codeExecution: JSON.parse(await readLab(`lab/drafts/${topic}/code-execution.json`)),
		criticReviewRef,
		criticReviewText: await readLab(criticReviewRef),
		revisionRef,
		revisionText: await readLab(revisionRef),
		preparedAt: new Date().toISOString(),
	});
	await writeCandidateArtifacts(project, sourceRoot, topic, candidateArtifacts(candidate, await readLab(draftRef)));
	console.log(`Candidate: ${candidate.topic}; exact Critic PASS; publication pending/false; LAB only; STOP.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
}
