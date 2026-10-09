import { writeLabArtifacts } from './lab-writer.ts';

/** Researcher gets a narrower capability than the shared LAB writer. */
export async function writeResearchArtifacts(project: string, source: string, artifacts: Record<string, string>) {
	if (!Object.keys(artifacts).length || Object.keys(artifacts).some(path =>
		!/^research\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:json|md)$/.test(path))) {
		throw new Error('Researcher may write research artifacts inside LAB only.');
	}
	return writeLabArtifacts(project, source, artifacts);
}
