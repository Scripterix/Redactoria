import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Slug } from '../core/editorial-context.ts';
import { writeLabArtifacts } from '../core/lab-writer.ts';

/** Candidate preparation is an explicit LAB operation, not a Publisher or agent capability. */
export async function writeCandidateArtifacts(project: string, source: string, topic: string, artifacts: Record<string, string>) {
	Slug.parse(topic);
	const names = Object.keys(artifacts);
	const required = ['article.json', 'article.md', 'candidate.schema.json', 'README.md'];
	if (names.length !== required.length || required.some(name => !names.includes(name))) {
		throw new Error('Candidate writer accepts only the exact candidate artifact set.');
	}
	for (const name of names) {
		try { await access(resolve(project, 'lab', 'candidates', topic, name)); throw new Error('Candidate artifact already exists: ' + name); }
		catch (error) { if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error; }
	}
	const prefixed = Object.fromEntries(Object.entries(artifacts).map(([name, contents]) => [`candidates/${topic}/${name}`, contents]));
	return writeLabArtifacts(project, source, prefixed);
}
