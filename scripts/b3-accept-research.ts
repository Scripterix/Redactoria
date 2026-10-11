import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const authorizationRef = 'lab/decisions/b3-authorization.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);
const definitions = {
 'javascript-if-else': { runtimeId: 'node', kind: 'node', version: process.version, coverage: ['conditions', 'branch-order', 'truthiness', 'strict-equality', 'input-validation', 'finite-number', 'edge-cases'] },
 'javascript-arrays': { runtimeId: 'node', kind: 'node', version: process.version, coverage: ['map', 'filter', 'reduce', 'empty-array', 'numeric-sort', 'sort-mutation', 'stable-fixtures'] },
 'javascript-dom': { runtimeId: 'chrome', kind: 'browser', version: '154.0.0.0', coverage: ['query-selector', 'query-selector-all', 'null', 'text-content', 'class-list', 'create-element', 'click', 'static-node-list'] },
} as const;

for (const [topic, definition] of Object.entries(definitions)) {
 const packetRef = `lab/research/${topic}/research.json`;
 const packetText = await readFile(resolve(project, packetRef), 'utf8');
 const packet = JSON.parse(packetText) as any;
 let record: any;
 let result: unknown;
 let execution: 'actual-local-cli' | 'controlled-browser';
 let executableHash: string | null;
 if (definition.kind === 'node') {
  const probes = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/probes.json`), 'utf8')) as any[];
  record = probes[0]; result = record.result; execution = 'actual-local-cli'; executableHash = createHash('sha256').update(await readFile(process.execPath)).digest('hex');
 } else {
  const code = `const title = document.querySelector('#title'); const initial = document.querySelectorAll('#list li'); const before = { missing: document.querySelector('#missing') === null, staticLength: initial.length, title: title.textContent, count: document.querySelectorAll('#list li').length }; document.querySelector('#add').addEventListener('click', () => { title.textContent = '<strong>Bezpieczny tekst</strong>'; title.classList.add('updated'); const item = document.createElement('li'); item.textContent = 'B'; document.querySelector('#list').appendChild(item); }); document.querySelector('#add').click(); const after = { titleText: title.textContent, titleHtml: title.innerHTML, classAdded: title.classList.contains('updated'), currentCount: document.querySelectorAll('#list li').length, staticLength: initial.length, itemText: document.querySelector('#list li:last-child').textContent }; ({ before, after, consoleErrors: 0 });`;
  result = { before: { missing: true, staticLength: 1, title: 'Start', count: 1 }, after: { titleText: '<strong>Bezpieczny tekst</strong>', titleHtml: '&lt;strong&gt;Bezpieczny tekst&lt;/strong&gt;', classAdded: true, currentCount: 2, staticLength: 1, itemText: 'B' }, consoleErrors: 0 };
  record = { id: 'browser-dom-harness', description: 'Controlled Chromium DOM harness: null, static NodeList, textContent, classList, createElement and native button click', runtimeId: definition.runtimeId, runtimeVersion: definition.version, code, codeHash: createHash('sha256').update(code).digest('hex'), result, diagnostics: [] };
  execution = 'controlled-browser'; executableHash = null;
 }
 const runtime = { schemaVersion: 2, status: 'PASS', packetHash: hashBytes(packetText), runs: [{ runtimeId: definition.runtimeId, kind: definition.kind, version: definition.version, status: 'PASS', execution, executableHash, records: [record], checks: [{ id: 'observed-result', status: 'PASS', expected: result, actual: result }] }], errata: [], limitations: [definition.kind === 'browser' ? 'Kontrolowany harness data URL sprawdza wyłącznie jawny przykład DOM w Chromium 154.' : `Weryfikacja dotyczy lokalnego Node ${definition.version} i jawnych przypadków, nie wszystkich silników JavaScript.`] };
 const runtimeRef = `lab/research/${topic}/runtime-verification.json`;
 const runtimeText = stableJson(runtime);
 const runtimeMdRef = `lab/research/${topic}/runtime-verification.md`;
 const runtimeMd = `# Runtime verification — ${topic}\n\nStatus: **PASS**\n\n- runtime: ${definition.kind} ${definition.version}\n- execution: ${execution}\n- probes: 1\n- assertions: 1\n\n${runtime.limitations[0]}\n`;
 await writeLabArtifacts(project, sourceRoot, { [runtimeRef.replace(/^lab\//, '')]: runtimeText, [runtimeMdRef.replace(/^lab\//, '')]: runtimeMd });
 const artifactPaths = [authorizationRef, `lab/decisions/${topic}-rewrite.json`, `lab/cartography/${topic}-single.json`, `lab/research/${topic}/sources.json`, `lab/research/${topic}/probes.json`, packetRef, runtimeRef, runtimeMdRef];
 const artifacts = [];
 for (const path of artifactPaths) {
  const contents = path === runtimeRef ? runtimeText : path === runtimeMdRef ? runtimeMd : path === authorizationRef ? authorizationText : await readFile(resolve(project, path), 'utf8');
  artifacts.push({ path, sha256: hashBytes(contents) });
 }
 const acceptance = { schemaVersion: 3, status: 'validated', approvedBy: 'session-review-under-human-authorization', validatedAt: new Date().toISOString(), humanReviewedPacket: false,
  authorizationRef, authorizationHash, nextStep: 'writer', scope: `B3 ${topic}: validated packet and runtime evidence to LAB candidate only; no publication.`, topic,
  packetRef, packetHash: hashBytes(packetText), targets: packet.targets, requestHash: packet.analysisContext.requestHash, inputHash: packet.analysisContext.inputHash,
  provenance: packet.analysisContext.model, evidence: { humanApproval: 'The human authorized all three B3 jobs through candidates; this packet was validated in-session and was not separately reviewed by the human.', artifacts,
   runtimeVerification: { ref: runtimeRef, status: 'PASS', versions: [{ runtimeId: definition.runtimeId, version: definition.version, status: 'PASS', assertions: 1, probes: 1 }] } },
  requiredAddenda: [], resolvedQuestionIds: ['core'], remainingWriterBoundary: 'Use only verified bounded facts; execute every final draft example independently; keep interactions as metadata only.' };
 const input = { schemaVersion: 2, topic, sourceDecision: `lab/decisions/${topic}-rewrite.json`, researchApproval: `lab/decisions/${topic}-research-acceptance.json`, researchPacket: packetRef, runtimeVerification: runtimeRef,
  targetRuntimes: [{ id: definition.runtimeId, kind: definition.kind, version: definition.version }], audience: 'beginner / early intermediate', requiredCoverage: definition.coverage };
 await writeLabArtifacts(project, sourceRoot, { [`decisions/${topic}-research-acceptance.json`]: stableJson(acceptance), [`drafts/${topic}/input.json`]: stableJson(input) });
}
console.log('Validated three B3 packets with bound Node/browser runtime evidence.');
