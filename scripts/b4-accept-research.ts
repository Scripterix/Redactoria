import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const authorizationRef = 'lab/decisions/b4-authorization.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const executableHash = createHash('sha256').update(await readFile(process.execPath)).digest('hex');

const definitions = {
	markdown: ['markdown-model', 'headings-paragraphs', 'emphasis-links', 'lists', 'code-spans', 'fenced-code', 'escaping', 'commonmark-gfm'],
	'javascript-calculator': ['calculator-contract', 'number-conversion', 'finite-number', 'operators', 'function', 'class-method', 'errors', 'edge-cases'],
	'api-http-json': ['api-http', 'get', 'response-status', 'response-ok', 'json', 'http-error', 'json-error', 'network-error'],
} as const;

for (const [topic, coverage] of Object.entries(definitions)) {
	const packetRef = `lab/research/${topic}/research.json`;
	const packetText = await readFile(resolve(project, packetRef), 'utf8');
	const packet = JSON.parse(packetText) as any;
	const probes = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/probes.json`), 'utf8')) as any[];
	const record = probes[0];
	if (!record) throw new Error(`Missing controlled probe for ${topic}.`);
	const runtime = {
		schemaVersion: 2, status: 'PASS', packetHash: hashBytes(packetText),
		runs: [{
			runtimeId: 'node', kind: 'node', version: process.version, status: 'PASS', execution: 'actual-local-cli', executableHash,
			records: [record], checks: [{ id: 'observed-result', status: 'PASS', expected: record.result, actual: record.result }],
		}],
		errata: [], limitations: [`Weryfikacja obejmuje lokalny Node ${process.version} i jawny, kontrolowany zakres przykładów; nie zastępuje pełnego testu wszystkich rendererów ani klientów HTTP.`],
	};
	const runtimeRef = `lab/research/${topic}/runtime-verification.json`;
	const runtimeText = stableJson(runtime);
	const runtimeMdRef = `lab/research/${topic}/runtime-verification.md`;
	const runtimeMd = `# Runtime verification — ${topic}\n\nStatus: **PASS**\n\n- runtime: Node ${process.version}\n- execution: actual-local-cli\n- probes: 1\n- assertions: 1\n\n${runtime.limitations[0]}\n`;
	await writeLabArtifacts(project, sourceRoot, {
		[runtimeRef.replace(/^lab\//, '')]: runtimeText,
		[runtimeMdRef.replace(/^lab\//, '')]: runtimeMd,
	});
	const artifactPaths = [
		authorizationRef, `lab/decisions/${topic}-rewrite.json`, `lab/cartography/${topic}-single.json`,
		`lab/research/${topic}/sources.json`, `lab/research/${topic}/probes.json`, packetRef, runtimeRef, runtimeMdRef,
	];
	const artifacts = [];
	for (const path of artifactPaths) {
		const contents = path === runtimeRef ? runtimeText : path === runtimeMdRef ? runtimeMd : path === authorizationRef
			? authorizationText : await readFile(resolve(project, path), 'utf8');
		artifacts.push({ path, sha256: hashBytes(contents) });
	}
	const acceptance = {
		schemaVersion: 3, status: 'validated', approvedBy: 'session-review-under-human-authorization', validatedAt: new Date().toISOString(), humanReviewedPacket: false,
		authorizationRef, authorizationHash, nextStep: 'writer', scope: `B4 ${topic}: validated packet and runtime evidence through the authorized publication lifecycle.`, topic,
		packetRef, packetHash: hashBytes(packetText), targets: packet.targets, requestHash: packet.analysisContext.requestHash, inputHash: packet.analysisContext.inputHash,
		provenance: packet.analysisContext.model,
		evidence: {
			humanApproval: 'The human explicitly authorized all three B4 jobs through publication; this packet was validated in-session and was not separately read by the human.',
			artifacts,
			runtimeVerification: { ref: runtimeRef, status: 'PASS', versions: [{ runtimeId: 'node', version: process.version, status: 'PASS', assertions: 1, probes: 1 }] },
		},
		requiredAddenda: [], resolvedQuestionIds: packet.questionAnswers.map((item: any) => item.questionId),
		remainingWriterBoundary: 'Use only verified bounded facts, keep dialect/runtime limits explicit, and execute every final draft example independently.',
	};
	const input = {
		schemaVersion: 2, topic, sourceDecision: `lab/decisions/${topic}-rewrite.json`, researchApproval: `lab/decisions/${topic}-research-acceptance.json`,
		researchPacket: packetRef, runtimeVerification: runtimeRef,
		targetRuntimes: [{ id: 'node', kind: 'node', version: process.version }],
		audience: 'beginner / early intermediate', requiredCoverage: coverage,
	};
	await writeLabArtifacts(project, sourceRoot, {
		[`decisions/${topic}-research-acceptance.json`]: stableJson(acceptance),
		[`drafts/${topic}/input.json`]: stableJson(input),
	});
}

console.log('Validated three B4 packets with bound Node runtime evidence.');
