import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RecordedLanguageModel } from '../engine/adapters/recorded-language-model.ts';
import { createPilotArtifacts, preparePilotSelection, runPilotSelection } from '../engine/agents/cartographer/pilot-selection.ts';
import { DEFAULT_LIMITS } from '../engine/agents/cartographer/policies.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { createSourceReader } from '../engine/core/source-reader.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
export async function main(args: string[]) {
	if (args.some((arg) => !['--prepare', '--verify', '--help'].includes(arg)) || new Set(args).size !== args.length
		|| (args.includes('--prepare') && args.includes('--verify'))) throw new Error('Use --prepare, --verify, --help or no arguments.');
	if (args.includes('--help')) {
		console.log('B1 Cartographer: --prepare writes a bounded request; default imports current-session responses and writes LAB ranking/report; --verify validates replay without writes. No research, CONTENT, Git or network.');
		return;
	}
	const source = resolve(project, '../temp-ogwo/posts');
	const inventory = JSON.parse(await readFile(resolve(project, 'lab/inventory/inventory.json'), 'utf8'));
	const screening = JSON.parse(await readFile(resolve(project, 'lab/cartography/pilot-selection/screening.json'), 'utf8'));
	const prompt = await readFile(resolve(project, 'engine/agents/cartographer/pilot-selection-prompt.md'), 'utf8');
	const prepared = await preparePilotSelection({ inventory, limits: { ...DEFAULT_LIMITS, maxDeepReads: 19, maxBodyCharacters: 30000 } }, screening, prompt, createSourceReader(source));
	if (args.includes('--prepare')) {
		await writeLabArtifacts(project, source, { 'cartography/pilot-selection/request.json': stableJson({ schemaVersion: 1, requestHash: hashJson(prepared.request), request: prepared.request }) });
		console.log(`Prepared B1: ${inventory.articles.length} inventory records, ${prepared.reads.length} full bodies, request ${hashJson(prepared.request)}.`);
		return;
	}
	const model = new RecordedLanguageModel(JSON.parse(await readFile(resolve(project, 'lab/cartography/pilot-selection/session-responses.json'), 'utf8')));
	const result = await runPilotSelection(prepared, model);
	const artifacts = createPilotArtifacts(result);
	if (args.includes('--verify')) {
		for (const [path, expected] of Object.entries(artifacts)) {
			if (await readFile(resolve(project, 'lab', path), 'utf8') !== expected) throw new Error(`Replay mismatch: ${path}`);
		}
		console.log('B1 read-only replay PASS: exact ranking/report, source and request hashes validated.');
	} else {
		await writeLabArtifacts(project, source, artifacts);
		console.log(`B1: ${result.ranking.length} ranked candidates, ${result.deferred.length} deferred. Imported session analysis; STOP before B2.`);
	}
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main(process.argv.slice(2)).catch((error: unknown) => { console.error(error instanceof Error ? error.message : 'B1 failed'); process.exitCode = 1; });
}
