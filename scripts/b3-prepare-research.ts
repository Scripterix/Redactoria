import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { hashJson, stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const retrievedAt = new Date().toISOString();
const asOfDate = retrievedAt.slice(0, 10);
const authorizationRef = 'lab/decisions/b3-authorization.json';
const authorizationText = await readFile(resolve(project, authorizationRef), 'utf8');
const authorizationHash = hashBytes(authorizationText);

type SourceDef = { id: string; title: string; url: string; excerpts: { id: string; text: string; locator: string }[] };
type TopicDef = { sources: SourceDef[]; question: string; probe?: { id: string; description: string; code: string } };
const definitions: Record<string, TopicDef> = {
 'javascript-if-else': {
  question: 'Jak poprawnie opisać kolejność gałęzi, truthiness, ścisłe porównanie i walidację tekstu jako skończonej liczby?',
  sources: [
   { id: 'mdn-if-else', title: 'MDN: if...else', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else', excerpts: [{ id: 'if-order', text: 'The first truthy condition selects its statement; later branches are not evaluated.', locator: 'Description' }] },
   { id: 'mdn-boolean', title: 'MDN: Boolean', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean', excerpts: [{ id: 'falsy-values', text: 'Boolean conversion has a defined set of falsy values; other values convert to true.', locator: 'Description' }] },
   { id: 'mdn-number', title: 'MDN: Number', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number', excerpts: [{ id: 'finite', text: 'Number.isFinite tests whether a value is a finite number without coercing it.', locator: 'Static methods' }] },
  ],
  probe: { id: 'node-if-boundaries', description: 'Whitespace, finite numbers, Infinity, NaN and ordered branches', code: `const analyze = raw => { if (raw === null || raw === undefined || String(raw).trim() === '') return 'empty'; const n = Number(raw); if (!Number.isFinite(n)) return 'invalid'; if (n > 0) return 'positive'; if (n < 0) return 'negative'; return 'zero'; }; console.log(JSON.stringify([' ', '12', 'Infinity', 'abc', '0', '-2'].map(analyze)));` },
 },
 'javascript-arrays': {
  question: 'Jak map, filter, reduce i sort wpływają na dane, pustą tablicę, kolejność oraz mutację?',
  sources: [
   { id: 'mdn-array-map', title: 'MDN: Array.prototype.map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map', excerpts: [{ id: 'map-new-array', text: 'map creates a new array from callback results for elements in the receiver.', locator: 'Description' }] },
   { id: 'mdn-array-reduce', title: 'MDN: Array.prototype.reduce', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce', excerpts: [{ id: 'reduce-empty', text: 'reduce without an initial value throws when called on an empty array.', locator: 'Exceptions' }] },
   { id: 'mdn-array-sort', title: 'MDN: Array.prototype.sort', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort', excerpts: [{ id: 'sort-mutates', text: 'sort operates in place; numeric ordering needs a comparator such as (a, b) => a - b.', locator: 'Description' }, { id: 'sort-stable', text: 'Array sorting is specified as stable in modern ECMAScript.', locator: 'Sort stability' }] },
  ],
  probe: { id: 'node-array-behavior', description: 'map/filter/reduce, empty average and non-mutating numeric sort', code: `const values = [10, 2, 30]; const mapped = values.map(x => x * 2); const filtered = values.filter(x => x >= 10); const sum = values.reduce((a, x) => a + x, 0); const average = xs => xs.length ? xs.reduce((a, x) => a + x, 0) / xs.length : null; const sorted = [...values].sort((a, b) => a - b); console.log(JSON.stringify({mapped, filtered, sum, emptyAverage: average([]), sorted, original: values}));` },
 },
 'javascript-dom': {
  question: 'Jak bezpiecznie wybierać elementy, obsłużyć null, zmieniać tekst/klasy, tworzyć węzły i reagować na click?',
  sources: [
   { id: 'mdn-query-selector', title: 'MDN: Document.querySelector', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector', excerpts: [{ id: 'query-null', text: 'querySelector returns the first matching Element or null when there is no match.', locator: 'Return value' }] },
   { id: 'mdn-query-selector-all', title: 'MDN: Document.querySelectorAll', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll', excerpts: [{ id: 'static-nodelist', text: 'querySelectorAll returns a static, non-live NodeList.', locator: 'Return value' }] },
   { id: 'mdn-text-content', title: 'MDN: Node.textContent', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent', excerpts: [{ id: 'text-not-html', text: 'textContent represents text content and does not parse a string as HTML.', locator: 'Differences from innerHTML' }] },
   { id: 'mdn-class-list', title: 'MDN: Element.classList', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/classList', excerpts: [{ id: 'class-token', text: 'classList exposes a token list with add, remove, replace and toggle operations.', locator: 'Examples' }] },
   { id: 'mdn-create-element', title: 'MDN: Document.createElement', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement', excerpts: [{ id: 'create-element', text: 'createElement creates an element for the given local name.', locator: 'Return value' }] },
  ],
 },
};

for (const [topic, definition] of Object.entries(definitions)) {
 const cartographyRef = `lab/cartography/${topic}-single.json`;
 const cartography = JSON.parse(await readFile(resolve(project, cartographyRef), 'utf8'));
 const decision = { schemaVersion: 3, status: 'approved', approvedBy: 'human', action: cartography.action, nextStep: 'research', targets: cartography.targets,
  confidence: cartography.confidence, reason: cartography.reason, evidence: cartography.evidence, analysisHash: hashJson(cartography), analysisRef: cartographyRef,
  authorizationRef, authorizationHash, topic };
 const sources = [];
 for (const item of definition.sources) {
  const response = await fetch(item.url, { redirect: 'error', headers: { 'user-agent': 'Redactoria-B3-research/1.0' } });
  if (response.status !== 200) throw new Error(`${item.url}: HTTP ${response.status}`);
  const body = await response.text();
  sources.push({ ...item, sourceType: 'official-documentation', kind: item.id.startsWith('mdn') ? 'language-reference' : 'manual', retrievedAt,
   documentHash: createHash('sha256').update(body).digest('hex'), retrieval: { method: 'https-get', httpStatus: 200, finalUrl: response.url, selection: 'official-content-excluding-user-notes' } });
 }
 const probes = [];
 if (definition.probe) {
  const executed = spawnSync(process.execPath, ['-e', definition.probe.code], { encoding: 'utf8' });
  if (executed.status !== 0) throw new Error(executed.stderr);
  probes.push({ ...definition.probe, runtimeId: 'node', runtimeVersion: process.version, codeHash: createHash('sha256').update(definition.probe.code).digest('hex'), result: JSON.parse(executed.stdout), diagnostics: [] });
 }
 const research = { schemaVersion: 2, topicSlug: topic, asOfDate, provenance: 'Official MDN HTTPS snapshots plus locally executed Node probe where applicable.',
  questions: [{ id: 'core', section: 'bounded-scope', question: definition.question, cartographerFindingIds: ['research-' + (topic === 'javascript-if-else' ? 'conversion' : topic === 'javascript-arrays' ? 'arrays' : 'dom')] }], sources, probes };
 await writeLabArtifacts(project, sourceRoot, { [`decisions/${topic}-rewrite.json`]: stableJson(decision), [`research/${topic}/sources.json`]: stableJson(research), [`research/${topic}/probes.json`]: stableJson(probes) });
}
console.log('Prepared B3 decisions, official source snapshots and executable Node probes.');
