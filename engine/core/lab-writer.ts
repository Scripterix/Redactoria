import { mkdir, mkdtemp, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export function isWithin(parent: string, target: string): boolean {
	const path = relative(parent, target);
	return path === '' || (!isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`));
}

async function canonicalTarget(target: string): Promise<string> {
	try { return await realpath(target); }
	catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
		const parent = dirname(target);
		if (parent === target) throw error;
		return join(await canonicalTarget(parent), relative(parent, target));
	}
}

/** Only designated LAB subdirectories. Stage + rename prevents hard-link writes. */
export async function writeLabArtifacts(projectDirectory: string, sourceDirectory: string, artifacts: Record<string, string>) {
	const project = await realpath(projectDirectory);
	const source = await realpath(sourceDirectory);
	const lab = join(project, 'lab');
	const targets: { path: string; contents: string }[] = [];
	for (const [path, contents] of Object.entries(artifacts)) {
		if (!/^(cartography|reports|decisions|research|drafts|reviews|candidates)\/[a-zA-Z0-9/_.-]+\.(json|md)$/.test(path) || path.split('/').includes('..')) throw new Error('Invalid LAB artifact path.');
		const target = await canonicalTarget(resolve(lab, path));
		if (!isWithin(lab, target) || isWithin(source, target)) throw new Error('Output must remain inside LAB and outside SOURCE/CONTENT.');
		if (path.startsWith('decisions/') && path.endsWith('.json')) {
			let existing: unknown;
			try { existing = JSON.parse(await readFile(target, 'utf8')); }
			catch (error) {
				if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
			}
			if (existing && typeof existing === 'object' && 'status' in existing && existing.status === 'approved') {
				throw new Error('Approved human decisions cannot be overwritten by Cartographer.');
			}
		}
		targets.push({ path: target, contents });
	}
	// Check all destinations before creating anything. Stage each artifact atomically.
	for (const target of targets) {
		await mkdir(dirname(target.path), { recursive: true });
		const stage = await mkdtemp(join(dirname(target.path), '.cartographer-'));
		try {
			const temporary = join(stage, 'artifact');
			await writeFile(temporary, target.contents, { encoding: 'utf8', flag: 'wx' });
			await rename(temporary, target.path);
		} finally { await rm(stage, { recursive: true, force: true }); }
	}
	return targets.map((target) => target.path);
}
