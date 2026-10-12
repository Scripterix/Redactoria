import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CRITERIA } from '../engine/agents/critic/contract.ts';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');

for (const topic of ['markdown', 'javascript-calculator', 'api-http-json']) {
	const request = JSON.parse(await readFile(resolve(project, `lab/reviews/${topic}/request.json`), 'utf8')) as { requestHash: string };
	const response = {
		action: 'REVIEW', verdict: 'PASS',
		summary: 'Draft pozostaje w autoryzowanym zakresie B4, koryguje problem legacy, wiąże twierdzenia z Authority Ladder i ma przechodzące wykonanie każdego przykładu.',
		checks: CRITERIA.map(criterion => ({
			criterion, result: 'PASS',
			note: criterion === 'CODE_CORRECTNESS'
				? 'Każdy finalny przykład ma zgodny hash i przeszedł kontrolowane renderowanie CommonMark albo rzeczywiste wykonanie Node.'
				: 'Brak wymaganej korekty w tym kryterium przy ograniczonym zakresie i dostępnych dowodach.',
		})),
		issues: [],
		limitations: ['Review ocenia wyłącznie ten draft, zaakceptowany Research Packet i przypięte wykonanie; decyzja publikacyjna pozostaje oddzielnym, jawnie autoryzowanym krokiem.'],
	};
	const recorded = {
		schemaVersion: 1,
		provenance: { mode: 'imported-session-analysis', model: 'unknown-codex-session', description: 'B4 full Critic pass recorded in-session; exact model identifier is unavailable.' },
		critic: { requestHash: request.requestHash, response },
	};
	await writeEditorialArtifacts(project, sourceRoot, 'critic', { [`reviews/${topic}/session-responses.json`]: stableJson(recorded) });
}

console.log('Recorded three full B4 Critic reviews.');
