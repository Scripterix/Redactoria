import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { ProbeSchema } from '../../engine/agents/researcher/contract.ts';
import { writeResearchArtifacts } from '../../engine/core/research-writer.ts';
import { stableJson } from '../../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../../', import.meta.url));
// Explicit executable, fixed owned probe file; no source article execution, no installation.
const executable = process.argv[2];
if (!executable) throw new Error('Provide the absolute path to an existing PHP CLI.');
const probes = z.array(ProbeSchema).parse(JSON.parse(execFileSync(resolve(executable),
	['-n', resolve(project, 'scripts/research/php-arrays-probes.php')], { encoding: 'utf8', timeout: 15000, maxBuffer: 1048576 })));
await writeResearchArtifacts(project, resolve(project, '../temp-ogwo/posts'), { 'research/php-arrays/probes.json': stableJson(probes) });
console.log(`${probes.length} controlled probes on PHP ${probes[0]?.phpVersion}. No SOURCE snippets executed.`);
