import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { hashBytes } from '../../engine/core/editorial-context.ts';
import { stableJson } from '../../engine/core/serialization.ts';
import { ProbeSchema, ResearchPacketSchema } from '../../engine/agents/researcher/contract.ts';
import { validateDraft } from '../../engine/agents/writer/validation.ts';
import { CodeExecutionSchema } from '../../engine/agents/critic/contract.ts';
import { writeResearchArtifacts } from '../../engine/core/research-writer.ts';
import { writeEditorialArtifacts } from '../../engine/core/editorial-writer.ts';
import { loadEditorialInput, sourceRoot, project, readLab } from '../editorial-input.ts';
import { TARGET_RUNTIMES } from './runtime-verification.ts';
import { probes } from './php-control-flow-probes.ts';

const installed = 'C:/Users/mujlo/AppData/Local/Temp/redactoria-php-gate-7ae9460296e94c299983ccd57fdeec58';
const binaryHashes = { '8.4': '9c9c7cdb2ec112cf39498dd1a77b56eacac482487182066920f1bcd209091898', '8.5': 'd256e5d6bfd86905f336bf39b2f4a68d3fde0faabbce3080330de9600cd8e6c4' } as const;
const cli = ['-n', '-d', 'error_reporting=32767', '-d', 'display_errors=stderr', '-d', 'memory_limit=32M', '-d', 'max_execution_time=2'];
function execute(executable: string, code: string) {
 const start = performance.now();
 const result = spawnSync(executable, cli, { input: code, encoding: 'utf8', timeout: 5000, maxBuffer: 1048576, windowsHide: true });
 if (result.error || result.signal || result.status === null) throw new Error('PHP process failed: ' + (result.error?.message ?? result.signal));
 return { stdout: result.stdout.replace(/\r\n/g, '\n'), stderr: result.stderr.replace(/\r\n/g, '\n'), exitCode: result.status, elapsedMs: Math.round(performance.now() - start) };
}
async function runtimes() {
 return Promise.all((['8.4', '8.5'] as const).map(async family => {
  const target = TARGET_RUNTIMES[family];
  const executable = resolve(installed, 'php-' + target.version, 'php.exe');
  const archiveHash = hashBytes(await readFile(resolve(installed, 'php-' + target.version + '.zip')));
  const executableHash = hashBytes(await readFile(executable));
  const version = spawnSync(executable, ['-n', '-r', 'echo PHP_VERSION;'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
  if (archiveHash !== target.archiveSha256 || executableHash !== binaryHashes[family] || version.status !== 0 || version.stdout !== target.version || version.stderr) throw new Error('Runtime archive, executable or version mismatch.');
  return { family, version: target.version, executable, executableHash, archiveHash, archiveUrl: target.archiveUrl, execution: 'actual-local-cli' as const };
 }));
}
async function main() {
 const flag = process.argv.slice(2).join(' ');
 if (!['--probes', '--bind-packet', '--draft'].includes(flag)) throw new Error('Explicit --probes, --bind-packet or --draft required. Each stage stops.');
 if (flag === '--bind-packet') {
  const packetText = await readLab('lab/research/php-control-flow/research.json');
  const packet = ResearchPacketSchema.parse(JSON.parse(packetText));
  const measured = JSON.parse(await readLab('lab/research/php-control-flow/probe-execution.json'));
  if (measured.status !== 'PASS' || measured.runs.some((run: { records: unknown[] }) => !run.records.length)
   || stableJson(measured.runs.flatMap((run: { records: unknown[] }) => run.records)) !== stableJson(JSON.parse(await readLab('lab/research/php-control-flow/probes.json')))
   || stableJson(packet.analysisContext.probes) !== stableJson(measured.runs.flatMap((run: { records: Record<string, unknown>[] }) => run.records.map(({ code: _code, ...record }) => record)))) throw new Error('Probe evidence differs from packet.');
  const runtime = { ...measured, packetHash: hashBytes(packetText), errata: [] };
  await writeResearchArtifacts(project, sourceRoot, { 'research/php-control-flow/runtime-verification.json': stableJson(runtime),
   'research/php-control-flow/runtime-verification.md': '# B2 runtime verification\n\nPASS: PHP 8.4.26 and 8.5.11, 8 owned probes per version, 24 exact assertions per version.\n\nActual local CLI; archives, binaries and PHP_VERSION checked. SOURCE not executed. stdin; -n, E_ALL, stderr diagnostics; 5s timeout, 32M memory. Checks: exact stdout (JSON result), empty stderr, exit 0. Results do not prove all PHP behaviour. No errata or unresolved runtime findings. See JSON for code hashes, timestamps, invocations and results.\n' });
  return;
 }
 const verified = await runtimes();
 if (flag === '--probes') {
  const runs = verified.map(runtime => {
   const executions = probes.map(probe => {
    const code = '<?php\n' + probe.body.trim() + '\necho json_encode($result, JSON_THROW_ON_ERROR), "\\n";\n';
    const measured = execute(runtime.executable, code);
    return { probe, code, measured };
   });
   const records = executions.map(({ probe, code, measured }) => ProbeSchema.parse({ id: probe.id + '-' + runtime.family.replace('.', ''), description: probe.description, phpVersion: runtime.version,
    code, codeHash: hashBytes(code), result: JSON.parse(measured.stdout), diagnostics: measured.stderr ? [{ level: 0, message: measured.stderr }] : [] }));
   const checks = executions.flatMap(({ probe, measured }) => [
    { id: probe.id + '/stdout', expected: JSON.stringify(probe.expected) + '\n', actual: measured.stdout },
    { id: probe.id + '/stderr', expected: '', actual: measured.stderr }, { id: probe.id + '/exit', expected: 0, actual: measured.exitCode },
   ]).map(check => ({ ...check, status: stableJson(check.expected) === stableJson(check.actual) ? 'PASS' : 'FAIL' }));
   return { ...runtime, cli, records, checks, processTimingsMs: executions.map(item => item.measured.elapsedMs), status: checks.every(check => check.status === 'PASS') ? 'PASS' : 'FAIL' };
  });
  const output = { schemaVersion: 1, executedAt: new Date().toISOString(), status: runs.every(run => run.status === 'PASS') ? 'PASS' : 'FAIL', runs };
  await writeResearchArtifacts(project, sourceRoot, { 'research/php-control-flow/probes.json': stableJson(runs.flatMap(run => run.records)), 'research/php-control-flow/probe-execution.json': stableJson(output) });
  console.log('Actual PHP probes: ' + output.status + '; 16 executions / 48 exact assertions.');
  if (output.status !== 'PASS') process.exitCode = 1;
  return;
 }
 const input = await loadEditorialInput('php-control-flow');
 const article = await readLab('lab/drafts/php-control-flow/article.md');
 const draft = validateDraft(JSON.parse(await readLab('lab/drafts/php-control-flow/article.json')), input, article);
 const examples = draft.sections.flatMap(section => section.examples);
 const runs = verified.map(runtime => ({ family: runtime.family, version: runtime.version, executableHash: runtime.executableHash, execution: runtime.execution,
  examples: examples.map(example => {
   const measured = execute(runtime.executable, example.code);
   const status = measured.exitCode === 0 && measured.stdout === example.expectedOutput && measured.stderr === (example.expectedDiagnostics.length ? example.expectedDiagnostics.join('\n') + '\n' : '') ? 'PASS' : 'FAIL';
   return { id: example.id, codeHash: hashBytes(example.code), stdout: measured.stdout, stderr: measured.stderr, exitCode: measured.exitCode, status };
  }) }));
 const evidence = CodeExecutionSchema.parse({ schemaVersion: 1, status: runs.every(run => run.examples.every(example => example.status === 'PASS')) ? 'PASS' : 'FAIL', articleHash: draft.articleHash, executedAt: new Date().toISOString(), runs });
 await writeEditorialArtifacts(project, sourceRoot, 'writer', { 'drafts/php-control-flow/code-execution.json': stableJson(evidence) });
 console.log('Actual draft examples: ' + evidence.status + '; ' + examples.length + ' per version.');
 if (evidence.status !== 'PASS') process.exitCode = 1;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
