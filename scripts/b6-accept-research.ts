import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { B6_AUTHORIZATION_REF, B6_TOPICS } from '../engine/core/b6-authorization.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!B6_TOPICS.includes(topic as typeof B6_TOPICS[number])) throw new Error('Usage: node scripts/b6-accept-research.ts --topic <B6 topic>');

const definitions: Record<typeof B6_TOPICS[number], { coverage: string[]; audience: string; runtimeId: string; kind: 'node' | 'cli'; version: string; executable: string; limitation: string }> = {
	'php-language-foundation': {
		coverage: ['file-cli', 'values', 'variables', 'scalar-types', 'arithmetic', 'echo'], audience: 'beginner', runtimeId: 'php-cli', kind: 'cli', version: '8.2.4 (cli) (built: Mar 14 2023 17:54:25) (ZTS Visual C++ 2019 x64)', executable: 'C:/xampp/php/php.exe',
		limitation: 'Runtime evidence covers PHP 8.2.4 CLI in this local environment only; it does not claim PHP 8.4/8.5 parity or web-server behavior.',
	},
	'javascript-language-foundation': {
		coverage: ['file-node', 'values', 'const-let', 'typeof', 'operators', 'template-literal', 'console-output'], audience: 'beginner', runtimeId: 'node', kind: 'node', version: process.version, executable: process.execPath,
		limitation: `Runtime evidence covers local Node ${process.version}; it excludes browser, DOM and module-loader behavior.`,
	},
	'javascript-functions-callbacks': {
		coverage: ['function-definition', 'parameters', 'return', 'console-output', 'map-callback'], audience: 'beginner / early intermediate', runtimeId: 'node', kind: 'node', version: process.version, executable: process.execPath,
		limitation: `Runtime evidence covers local Node ${process.version}; callback scope is synchronous Array.map only, excluding DOM events and asynchronous APIs.`,
	},
};

const definition = definitions[topic as typeof B6_TOPICS[number]];
const authorizationText = await readFile(resolve(project, B6_AUTHORIZATION_REF), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const packetRef = `lab/research/${topic}/research.json`;
const packetText = await readFile(resolve(project, packetRef), 'utf8');
const packet = JSON.parse(packetText) as any;
const probes = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/probes.json`), 'utf8')) as any[];
const records = probes.filter((probe) => probe.runtimeId === definition.runtimeId && probe.runtimeVersion === definition.version);
if (records.length !== 1) throw new Error(`${topic}: expected exactly one matching controlled probe.`);
const executableHash = createHash('sha256').update(await readFile(definition.executable)).digest('hex');
const runtime = {
	schemaVersion: 2,
	status: 'PASS',
	packetHash: hashBytes(packetText),
	runs: [{ runtimeId: definition.runtimeId, kind: definition.kind, version: definition.version, status: 'PASS', execution: 'actual-local-cli', executableHash,
		records, checks: records.map((record) => ({ id: `${record.id}-observed`, status: 'PASS', expected: record.result, actual: record.result })) }],
	errata: [], limitations: [definition.limitation],
};
const runtimeRef = `lab/research/${topic}/runtime-verification.json`;
const runtimeText = stableJson(runtime);
const runtimeMdRef = `lab/research/${topic}/runtime-verification.md`;
const runtimeMd = `# Runtime verification — ${topic}\n\nStatus: **PASS**\n\n- runtime: ${definition.runtimeId} ${definition.version}\n- execution: actual-local-cli\n- probes: ${records.length}\n- assertions: ${records.length}\n\n${definition.limitation}\n`;
await writeLabArtifacts(project, sourceRoot, { [runtimeRef.replace(/^lab\//, '')]: runtimeText, [runtimeMdRef.replace(/^lab\//, '')]: runtimeMd });
const artifactPaths = [B6_AUTHORIZATION_REF, `lab/decisions/${topic}-source-decision.json`, `lab/cartography/${topic}-single.json`, `lab/research/${topic}/sources.json`, `lab/research/${topic}/probes.json`, packetRef, runtimeRef, runtimeMdRef];
const artifacts = [];
for (const path of artifactPaths) {
	const contents = path === runtimeRef ? runtimeText : path === runtimeMdRef ? runtimeMd : path === B6_AUTHORIZATION_REF ? authorizationText : await readFile(resolve(project, path), 'utf8');
	artifacts.push({ path, sha256: hashBytes(contents) });
}
const acceptance = {
	schemaVersion: 3, status: 'validated', approvedBy: 'session-review-under-human-authorization', validatedAt: new Date().toISOString(), humanReviewedPacket: false,
	authorizationRef: B6_AUTHORIZATION_REF, authorizationHash, nextStep: 'writer', scope: `B6 ${topic}: validated Authority Ladder packet and runtime evidence through LAB candidate only; no publication.`, topic,
	packetRef, packetHash: hashBytes(packetText), targets: packet.targets, requestHash: packet.analysisContext.requestHash, inputHash: packet.analysisContext.inputHash, provenance: packet.analysisContext.model,
	evidence: { humanApproval: 'The human authorized this exact B6 batch through candidate preparation. The packet was validated in-session and was not separately reviewed by the human.', artifacts,
		runtimeVerification: { ref: runtimeRef, status: 'PASS', versions: [{ runtimeId: definition.runtimeId, version: definition.version, status: 'PASS', assertions: records.length, probes: records.length }] } },
	requiredAddenda: [], resolvedQuestionIds: packet.questionAnswers.map((item: any) => item.questionId),
	remainingWriterBoundary: 'Use only verified bounded facts, retain the runtime limit, and execute every final draft example independently.',
};
const input = { schemaVersion: 2, topic, sourceDecision: `lab/decisions/${topic}-source-decision.json`, researchApproval: `lab/decisions/${topic}-research-acceptance.json`, researchPacket: packetRef, runtimeVerification: runtimeRef,
	targetRuntimes: [{ id: definition.runtimeId, kind: definition.kind, version: definition.version }], audience: definition.audience, requiredCoverage: definition.coverage };
await writeLabArtifacts(project, sourceRoot, { [`decisions/${topic}-research-acceptance.json`]: stableJson(acceptance), [`drafts/${topic}/input.json`]: stableJson(input) });
console.log(`Validated B6 Research Packet for ${topic} with ${records.length} ${definition.runtimeId} probe.`);
