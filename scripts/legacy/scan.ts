import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanCorpus, serializeInventory } from './inventory.ts';
import { corpusCounts, createCorpusSummary } from './summary.ts';
import type { Inventory } from './types.ts';

function isWithin(parent: string, target: string): boolean {
	const path = relative(parent, target);
	return path === '' || (!isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`));
}

/** Resolve existing ancestor links before any mkdir/write, even for new files. */
async function canonicalTarget(target: string): Promise<string> {
	try {
		return await realpath(target);
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
		const parent = dirname(target);
		if (parent === target) throw error;
		return join(await canonicalTarget(parent), relative(parent, target));
	}
}

export async function writeInventoryArtifacts(inventory: Inventory, sourceDirectory: string, labDirectory: string) {
	const source = await realpath(resolve(sourceDirectory));
	const inventoryPath = await canonicalTarget(resolve(labDirectory, 'inventory/inventory.json'));
	const reportPath = await canonicalTarget(resolve(labDirectory, 'reports/corpus-summary.md'));
	if ([inventoryPath, reportPath].some((path) => isWithin(source, path))) {
		throw new Error('Output must remain outside the read-only source directory.');
	}
	await mkdir(dirname(inventoryPath), { recursive: true });
	await mkdir(dirname(reportPath), { recursive: true });
	await writeFile(inventoryPath, serializeInventory(inventory), 'utf8');
	await writeFile(reportPath, createCorpusSummary(inventory), 'utf8');
	return { inventoryPath, reportPath };
}

async function main() {
	const args = process.argv.slice(2);
	if (args.includes('--help')) {
		console.log('Usage: npm run inventory -- [source-directory] [--output lab-directory]\nDefault source: ../temp-ogwo/posts; output: project lab/');
		return;
	}
	let sourceDirectory = '../temp-ogwo/posts';
	let labDirectory = fileURLToPath(new URL('../../lab/', import.meta.url));
	let sourceProvided = false;
	for (let index = 0; index < args.length; index++) {
		const argument = args[index]!;
		if (argument === '--output') {
			const output = args[++index];
			if (!output || output.startsWith('--')) throw new Error('--output requires a directory.');
			labDirectory = output;
		} else if (argument.startsWith('--') || sourceProvided) {
			throw new Error('Expected one source directory and optional --output directory. Use --help.');
		} else {
			sourceDirectory = argument;
			sourceProvided = true;
		}
	}
	const inventory = await scanCorpus(sourceDirectory);
	const output = await writeInventoryArtifacts(inventory, sourceDirectory, labDirectory);
	const counts = corpusCounts(inventory);
	console.log(`Source files: ${counts.files}; parsed OK: ${counts.ok}; review required: ${counts.review}; parse errors: ${counts.errors}`);
	console.log(`Inventory: ${output.inventoryPath}\nSummary: ${output.reportPath}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error: unknown) => {
		console.error(`Inventory failed: ${error instanceof Error ? error.message : 'unknown error'}`);
		process.exitCode = 1;
	});
}
