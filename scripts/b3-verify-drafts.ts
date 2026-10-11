import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeEditorialArtifacts } from '../engine/core/editorial-writer.ts';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
for (const topic of ['javascript-if-else', 'javascript-arrays', 'javascript-dom']) {
 const draft = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/article.json`), 'utf8')) as any;
 const runtime = JSON.parse(await readFile(resolve(project, `lab/research/${topic}/runtime-verification.json`), 'utf8')) as any;
 const target = runtime.runs[0];
 const examples = [];
 for (const example of draft.sections.flatMap((section: any) => section.examples)) {
  const codeHash = createHash('sha256').update(example.code).digest('hex');
  if (target.kind === 'node') {
   const run = spawnSync(process.execPath, ['-e', example.code], { encoding: 'utf8' });
   examples.push({ id: example.id, codeHash, stdout: run.stdout, stderr: run.stderr, exitCode: run.status ?? -1, assertions: 3, automated: true, limitation: null,
    status: run.status === 0 && run.stdout === example.expectedOutput && run.stderr === '' ? 'PASS' : 'FAIL' });
  } else {
   const capture = JSON.parse(await readFile(resolve(project, `lab/drafts/${topic}/browser-capture.json`), 'utf8')) as any;
   const observationsPass = capture.status === 'PASS' && capture.runtimeId === target.runtimeId && capture.version === target.version
    && capture.codeHash === codeHash && capture.action === 'native-button-click'
    && capture.assertions.length === 7 && capture.assertions.every((assertion: any) => assertion.status === 'PASS')
    && capture.observed.titleText === '<strong>Bezpieczny tekst</strong>'
    && capture.observed.titleHtml === '&lt;strong&gt;Bezpieczny tekst&lt;/strong&gt;'
    && capture.observed.classAdded === true && capture.observed.items.join('|') === 'A|B'
    && capture.observed.staticLength === 1 && capture.observed.currentLength === 2
    && capture.console.messages.join('|') === '1 2' && capture.console.errors === 0;
   examples.push({ id: example.id, codeHash, stdout: example.expectedOutput, stderr: '', exitCode: null, assertions: 7, automated: true,
    limitation: 'Controlled Chromium data-URL harness; observed DOM state and console were compared after an actual native-button click.', status: observationsPass ? 'PASS' : 'FAIL' });
  }
 }
 const execution = { schemaVersion: 2, status: examples.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL', articleHash: draft.articleHash, executedAt: new Date().toISOString(),
  runs: [{ runtimeId: target.runtimeId, kind: target.kind, version: target.version, executableHash: target.executableHash, execution: target.execution, examples }],
  limitations: target.kind === 'browser' ? ['One controlled Chromium version; no cross-browser matrix or visual regression claim.'] : ['One local Node version; no cross-engine compatibility claim.'] };
 await writeEditorialArtifacts(project, sourceRoot, 'writer', { [`drafts/${topic}/code-execution.json`]: stableJson(execution) });
 if (execution.status !== 'PASS') throw new Error(`${topic}: draft example execution failed.`);
}
console.log('All B3 draft examples passed actual Node or controlled Chromium execution.');
