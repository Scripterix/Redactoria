import { writeLabArtifacts } from './lab-writer.ts';
/** Only the selected agent's narrow LAB subtree, never decisions or other results. */
export async function writeEditorialArtifacts(project: string, source: string, role: 'writer' | 'critic', artifacts: Record<string, string>) {
 const root = role === 'writer' ? 'drafts' : 'reviews';
 const allowed = new RegExp('^' + root + '/[a-z0-9]+(?:-[a-z0-9]+)*/[a-z0-9]+(?:-[a-z0-9]+)*\\.(json|md)$');
 if (!Object.keys(artifacts).length || Object.keys(artifacts).some(path => !allowed.test(path))) throw new Error('Agent may write only its own LAB ' + root + ' subtree.');
 return writeLabArtifacts(project, source, artifacts);
}

