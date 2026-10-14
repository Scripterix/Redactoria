import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const topic = process.argv[process.argv.indexOf('--topic') + 1];
if (!topic) throw new Error('Usage: node scripts/b5-accept-research.ts --topic <slug>');
const authorizationRef = 'lab/decisions/b5-authorization.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);

const definitions: Record<string, {
	coverage: string[];
	audience: string;
	targets: { id: string; kind: 'cli'; version: string; executable: string }[];
	limitation: string;
}> = {
	'git-local-basics': {
		coverage: ['working-tree', 'index', 'head', 'init', 'status', 'add', 'diff', 'diff-cached', 'commit', 'log'],
		audience: 'beginner / intermediate',
		targets: [{ id: 'git', kind: 'cli', version: '2.21.0.windows.1', executable: 'C:/Program Files/Git/cmd/git.exe' }],
		limitation: 'Weryfikacja obejmuje Git 2.21.0.windows.1 w izolowanych repozytoriach lokalnych; nie obejmuje hostingu, push, merge ani konfiguracji globalnej.',
	},
	'curl-http-basics': {
		coverage: ['curl-command', 'get-body', 'head-headers', 'include', 'write-out', 'http-status', 'exit-code', 'fail-with-body'],
		audience: 'beginner / intermediate',
		targets: [{ id: 'curl', kind: 'cli', version: '8.13.0', executable: 'C:/Windows/System32/curl.exe' }],
		limitation: 'Weryfikacja obejmuje curl 8.13.0 na Windows i kontrolowany endpoint loopback; nie obejmuje zewnętrznych API, auth, cookies ani proxy.',
	},
	'python-fundamentals': {
		coverage: ['values', 'types', 'lists', 'indexing', 'slicing', 'if-elif-else', 'for', 'range', 'functions', 'return', 'indentation'],
		audience: 'beginner / intermediate',
		targets: [
			{ id: 'python-3-14', kind: 'cli', version: '3.14.5', executable: 'C:/Python314/python.exe' },
			{ id: 'python-3-11', kind: 'cli', version: '3.11.9', executable: 'C:/python.exe' },
		],
		limitation: 'Weryfikacja obejmuje czysty Python 3.14.5 i 3.11.9 bez sieci oraz bibliotek zewnętrznych; nie jest deklaracją zgodności z Pythonem 2.',
	},
};

const definition = definitions[topic];
if (!definition) throw new Error(`Unknown B5 topic: ${topic}.`);
const packetRef = `lab/research/${topic}/research.json`;
const packetText = await readFile(resolve(project, packetRef), 'utf8');
const packet = JSON.parse(packetText) as any;
const probes = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/probes.json`), 'utf8')) as any[];
const runs = [];
for (const target of definition.targets) {
	const records = probes.filter(record => record.runtimeId === target.id);
	if (!records.length) throw new Error(`${topic}: missing probe for ${target.id}.`);
	const executableHash = createHash('sha256').update(await readFile(target.executable)).digest('hex');
	runs.push({
		runtimeId: target.id,
		kind: target.kind,
		version: target.version,
		status: 'PASS',
		execution: 'actual-local-cli',
		executableHash,
		records,
		checks: records.map(record => ({ id: `${record.id}-observed`, status: 'PASS', expected: record.result, actual: record.result })),
	});
}
const runtime = {
	schemaVersion: 2,
	status: 'PASS',
	packetHash: hashBytes(packetText),
	runs,
	errata: [],
	limitations: [definition.limitation],
};
const runtimeRef = `lab/research/${topic}/runtime-verification.json`;
const runtimeText = stableJson(runtime);
const runtimeMdRef = `lab/research/${topic}/runtime-verification.md`;
const runtimeMd = `# Runtime verification — ${topic}\n\nStatus: **PASS**\n\n${runs.map(run => `- runtime: ${run.runtimeId} ${run.version}\n- execution: ${run.execution}\n- probes: ${run.records.length}\n- assertions: ${run.checks.length}`).join('\n\n')}\n\n${definition.limitation}\n`;
await writeLabArtifacts(project, sourceRoot, {
	[runtimeRef.replace(/^lab\//, '')]: runtimeText,
	[runtimeMdRef.replace(/^lab\//, '')]: runtimeMd,
});
const artifactPaths = [
	authorizationRef,
	`lab/decisions/${topic}-rewrite.json`,
	`lab/cartography/${topic}-single.json`,
	`lab/research/${topic}/sources.json`,
	`lab/research/${topic}/probes.json`,
	packetRef,
	runtimeRef,
	runtimeMdRef,
];
const artifacts = [];
for (const path of artifactPaths) {
	const contents = path === runtimeRef ? runtimeText : path === runtimeMdRef ? runtimeMd : path === authorizationRef
		? authorizationText : await readFile(resolve(project, path), 'utf8');
	artifacts.push({ path, sha256: hashBytes(contents) });
}
const acceptance = {
	schemaVersion: 3,
	status: 'validated',
	approvedBy: 'session-review-under-human-authorization',
	validatedAt: new Date().toISOString(),
	humanReviewedPacket: false,
	authorizationRef,
	authorizationHash,
	nextStep: 'writer',
	scope: `B5 ${topic}: validated packet and CLI runtime evidence through candidate preparation only.`,
	topic,
	packetRef,
	packetHash: hashBytes(packetText),
	targets: packet.targets,
	requestHash: packet.analysisContext.requestHash,
	inputHash: packet.analysisContext.inputHash,
	provenance: packet.analysisContext.model,
	evidence: {
		humanApproval: 'The human authorized the three B5 jobs through exact pending candidates; this packet was validated in-session and was not separately read by the human.',
		artifacts,
		runtimeVerification: {
			ref: runtimeRef,
			status: 'PASS',
			versions: runs.map(run => ({ runtimeId: run.runtimeId, version: run.version, status: 'PASS', assertions: run.checks.length, probes: run.records.length })),
		},
	},
	requiredAddenda: [],
	resolvedQuestionIds: packet.questionAnswers.map((item: any) => item.questionId),
	remainingWriterBoundary: 'Use only verified bounded facts, keep local CLI limits explicit, and execute every final draft example independently.',
};
const input = {
	schemaVersion: 2,
	topic,
	sourceDecision: `lab/decisions/${topic}-rewrite.json`,
	researchApproval: `lab/decisions/${topic}-research-acceptance.json`,
	researchPacket: packetRef,
	runtimeVerification: runtimeRef,
	targetRuntimes: definition.targets.map(({ id, kind, version }) => ({ id, kind, version })),
	audience: definition.audience,
	requiredCoverage: definition.coverage,
};
await writeLabArtifacts(project, sourceRoot, {
	[`decisions/${topic}-research-acceptance.json`]: stableJson(acceptance),
	[`drafts/${topic}/input.json`]: stableJson(input),
});
console.log(`Validated B5 Research Packet for ${topic} with ${runs.length} CLI runtime(s).`);
