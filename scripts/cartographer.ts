import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RecordedLanguageModel } from '../engine/adapters/recorded-language-model.ts';
import { prepareDeepReadRequest, prepareInventoryRequest, runCartographer } from '../engine/agents/cartographer/agent.ts';
import { DEFAULT_LIMITS } from '../engine/agents/cartographer/policies.ts';
import { createCartographerArtifacts } from '../engine/agents/cartographer/report.ts';
import { prepareFocusedMerge, runFocusedMerge, selectFocusedInput } from '../engine/agents/cartographer/focused-merge.ts';
import { createFocusedMergeArtifacts } from '../engine/agents/cartographer/focused-merge-report.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';
import { createSourceReader } from '../engine/core/source-reader.ts';
import { validateInput } from '../engine/validation/cartographer.ts';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));

export function parseCartographerArguments(args: string[]) {
	const allowed = new Set(['--prepare', '--responses', '--inventory', '--source', '--max-deep-reads', '--max-body-characters', '--focus', '--task']);
	const options = new Map<string, string>();
	const focus: string[] = [];
	for (let index = 0; index < args.length; index++) {
		const flag = args[index]!;
		const value = args[++index];
		if (!allowed.has(flag) || (flag !== '--focus' && options.has(flag)) || !value || value.startsWith('--')) throw new Error('Invalid CLI options; use --help.');
		if (flag === '--focus') focus.push(value); else options.set(flag, value);
	}
	const prepare = options.get('--prepare');
	if (focus.length || options.has('--task')) {
		if (options.get('--task') !== 'merge' || focus.length !== 2 || new Set(focus).size !== 2) throw new Error('Use --task merge and exactly two distinct --focus paths.');
		if (prepare && prepare !== 'merge') throw new Error('Focused preparation requires --prepare merge.');
	} else if (prepare && !['inventory', 'deep-read'].includes(prepare)) throw new Error('--prepare must be inventory or deep-read.');
	return { options, focus };
}

async function main() {
	const args = process.argv.slice(2);
	if (args.includes('--help')) {
		console.log('Usage: npm run cartographer -- [--prepare inventory|deep-read] [--responses file.json] [--inventory file.json] [--source directory] [--max-deep-reads N] [--max-body-characters N]\nFocused: --task merge --focus first.md --focus second.md [--prepare merge]\nDefault: imported, explicitly labelled session analysis; no live API calls. Outputs only to project lab/.');
		return;
	}
	const { options, focus } = parseCartographerArguments(args);
	const prepare = options.get('--prepare');
	function numeric(flag: string, fallback: number) {
		const value = options.get(flag);
		if (value !== undefined && !/^\d+$/.test(value)) throw new Error(`${flag} requires a nonnegative integer.`);
		return value === undefined ? fallback : Number(value);
	}
	const inventoryPath = options.get('--inventory') ?? resolve(projectDirectory, 'lab/inventory/inventory.json');
	const sourceDirectory = resolve(options.get('--source') ?? '../temp-ogwo/posts');
	const inventory: unknown = JSON.parse(await readFile(inventoryPath, 'utf8'));
	const limits = {
		...DEFAULT_LIMITS, maxDeepReads: numeric('--max-deep-reads', DEFAULT_LIMITS.maxDeepReads),
		maxBodyCharacters: numeric('--max-body-characters', DEFAULT_LIMITS.maxBodyCharacters),
	};
	const input = focus.length ? selectFocusedInput(inventory, focus, limits) : validateInput({ inventory, limits });
	const prompt = await readFile(new URL('../engine/agents/cartographer/prompt.md', import.meta.url), 'utf8');
	const reader = createSourceReader(sourceDirectory);
	if (prepare === 'merge') {
		const prepared = await prepareFocusedMerge(input, prompt, reader);
		const paths = await writeLabArtifacts(projectDirectory, sourceDirectory, {
			'cartography/requests/focused-merge.json': stableJson({ schemaVersion: 1, requestHash: hashJson(prepared.request), request: prepared.request }),
		});
		console.log(`Prepared focused MERGE: exactly ${prepared.reads.length} full source bodies.\n${paths.join('\n')}`);
		return;
	}
	const initialRequest = focus.length ? null : prepareInventoryRequest(input, prompt);
	if (prepare === 'inventory') {
		const paths = await writeLabArtifacts(projectDirectory, sourceDirectory, {
			'cartography/requests/pass-a.json': stableJson({ schemaVersion: 1, requestHash: hashJson(initialRequest), request: initialRequest }),
		});
		console.log(`Prepared inventory-only analysis for ${input.inventory.articles.length} articles.\n${paths.join('\n')}`);
		return;
	}
	const responsesPath = options.get('--responses') ?? resolve(projectDirectory, focus.length
		? 'lab/cartography/focused-merge-session-responses.json' : 'lab/cartography/session-responses.json');
	let responses: unknown;
	try { responses = JSON.parse(await readFile(responsesPath, 'utf8')); }
	catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			throw new Error(`No model responses configured. Use --prepare ${focus.length ? 'merge with the same --focus/--task arguments' : 'inventory'}, analyze that request in your model session, then provide --responses file.json. No mock or live model is used implicitly.`);
		}
		throw error;
	}
	const model = new RecordedLanguageModel(responses);
	if (focus.length) {
		const result = await runFocusedMerge(input, prompt, model, reader);
		const paths = await writeLabArtifacts(projectDirectory, sourceDirectory, createFocusedMergeArtifacts(result));
		console.log(`Focused MERGE: ${result.targets.length} full articles; recommended: ${result.recommended}; confidence: ${result.confidence}.\nMode: ${model.identity.mode}\n${paths.join('\n')}`);
		return;
	}
	if (prepare === 'deep-read') {
		const coarse = await model.generateStructured(initialRequest!);
		const deep = await prepareDeepReadRequest(input, prompt, coarse, reader);
		const paths = await writeLabArtifacts(projectDirectory, sourceDirectory, {
			'cartography/requests/pass-b.json': stableJson({ schemaVersion: 1, requestHash: hashJson(deep.request), request: deep.request }),
		});
		console.log(`Prepared selective analysis: ${deep.reads.length} deep reads.\n${paths.join('\n')}`);
		return;
	}
	const result = await runCartographer(input, prompt, model, reader);
	const paths = await writeLabArtifacts(projectDirectory, sourceDirectory, createCartographerArtifacts(result, input.inventory));
	console.log(`Cartographer: ${result.corpusOverview.articleCount} articles; deep reads: ${result.analysisContext.deepReads.length}; domains: ${result.domains.length}; clusters: ${result.clusters.length}; gaps: ${result.gaps.length}; candidates: ${result.candidates.length}.\nMode: ${model.identity.mode}\n${paths.join('\n')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error: unknown) => {
		console.error(`Cartographer failed: ${error instanceof Error ? error.message : 'unknown error'}`);
		process.exitCode = 1;
	});
}
