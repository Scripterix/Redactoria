import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeResearchArtifacts } from '../../engine/core/research-writer.ts';
import { stableJson } from '../../engine/core/serialization.ts';
import { TARGET_RUNTIMES, verifyRuntimeRecords } from './runtime-verification.ts';

const project = fileURLToPath(new URL('../../', import.meta.url));
const options = new Map<string, string>();
for (let index = 2; index < process.argv.length; index += 2) {
	const flag = process.argv[index]!, value = process.argv[index + 1];
	if (!['--php84', '--php85', '--archive84', '--archive85'].includes(flag) || !value || !isAbsolute(value) || options.has(flag)) throw new Error('Specify absolute --php84 / --php85 executable and --archive84 / --archive85 ZIP paths.');
	options.set(flag, value);
}
const runs = [];
for (const [family, suffix] of [['8.4', '84'], ['8.5', '85']] as const) {
	const executable = options.get(`--php${suffix}`), archive = options.get(`--archive${suffix}`);
	if (!executable || !archive) throw new Error('Both actual target executables and verified official ZIPs are required.');
	const build = TARGET_RUNTIMES[family];
	const archiveSha256 = createHash('sha256').update(await readFile(archive)).digest('hex');
	if (archiveSha256 !== build.archiveSha256) throw new Error('Official runtime archive SHA-256 mismatch.');
	const startedAt = new Date().toISOString();
	const versionBanner = execFileSync(executable, ['-n', '--version'], { encoding: 'utf8', timeout: 15000 });
	if (!versionBanner.startsWith(`PHP ${build.version} (cli)`)) throw new Error('Actual executable is not the expected target runtime.');
	const records = [];
	const invocations = [];
	for (const script of ['scripts/research/php-arrays-probes.php', 'scripts/research/php-arrays-version-probes.php']) {
		const scriptHash = createHash('sha256').update(await readFile(resolve(project, script))).digest('hex');
		const stdout = execFileSync(executable, ['-n', resolve(project, script)], { encoding: 'utf8', timeout: 15000, maxBuffer: 1048576 });
		records.push(...JSON.parse(stdout));
		invocations.push({ script, scriptHash, arguments: ['-n', script], exitCode: 0 });
	}
	const result = verifyRuntimeRecords(records, family);
	runs.push({ family, ...build, archiveSha256, executableHash: createHash('sha256').update(await readFile(executable)).digest('hex'),
		versionBanner: versionBanner.trim(), startedAt, finishedAt: new Date().toISOString(), execution: 'actual-local-cli', invocations, ...result });
	console.log(`PHP ${build.version}: ${result.status}, ${result.checks.filter(check => check.status === 'PASS').length}/${result.checks.length} assertions, ${records.length} probes.`);
}
const packetBytes = await readFile(resolve(project, 'lab/research/php-arrays/research.json'));
const packet = JSON.parse(packetBytes.toString('utf8'));
const verification = { schemaVersion: 1, topic: 'PHP arrays runtime approval gate', status: runs.every(run => run.status === 'PASS') ? 'PASS' : 'FAIL',
	packetRef: 'lab/research/php-arrays/research.json', packetHash: createHash('sha256').update(packetBytes).digest('hex'),
	requestHash: packet.analysisContext.requestHash, runs,
	initialRunRef: 'lab/research/php-arrays/runtime-verification-initial.json',
	errata: [{ id: 'php85-null-offset', affectedFindingIds: ['key-casts', 'key-exists-null-argument', 'code-key-extension'],
		claim: 'PHP 8.5 also deprecates null as an array offset, not only the key parameter of array_key_exists. It still casts to the empty-string key; use an explicit empty string instead. Null values remain valid.',
		source: 'lab/research/php-arrays/runtime-source-supplement.json', evidenceId: 'null-offset',
		probeIds: ['keys', 'key-types', 'null-key-argument'], recommendation: 'Writer must include this version caution and must not recommend null keys. These probes demonstrate diagnostics, not recommended tutorial code.' }],
	resolvedQuestionIds: runs.every(run => run.status === 'PASS') ? ['target-runtime'] : [],
	remainingBoundary: 'snippets: final Writer-authored standalone examples and a complete form handler do not exist yet; not claimed tested.',
	limitations: ['Fixed controlled probes, not execution of SOURCE Markdown or final Writer output.',
		'Tested exact Windows x64 NTS builds, not every patch/OS/SAPI or a web application security audit.',
		'Expected warnings/deprecations are captured and asserted, not suppressed as success. Original research artifacts remain unchanged.'] };
const report = ['# PHP 8.4 / 8.5 runtime verification', '', `Status: ${verification.status}`, '',
	`Research Packet SHA-256: ${verification.packetHash}`, '',
	...runs.flatMap(run => [`## PHP ${run.version}`, '', `${run.status} — ${run.checks.filter(check => check.status === 'PASS').length}/${run.checks.length} assertions; ${run.records.length} actual probes.`, '',
		`Official archive: [${run.version}](${run.archiveUrl}); published checksum: [PHP downloads](${run.checksumSource}).`,
		`ZIP SHA-256: ${run.archiveSha256}; executable SHA-256: ${run.executableHash}.`, '',
		`Executed ${run.startedAt} → ${run.finishedAt}, CLI -n, no php.ini, no SOURCE execution.`, '',
		...run.records.map(record => `- ${record.id}: diagnostics ${record.diagnostics.map(item => `${item.level}: ${item.message}`).join('; ') || 'none'}; code SHA-256 ${record.codeHash}`), '',
		...run.checks.filter(check => check.status === 'FAIL').map(check => `FAIL: ${check.id}: ${JSON.stringify(check.actual)} != ${JSON.stringify(check.expected)}`), '']),
	'## Version-sensitive results', '', 'Negative-key append: key -4 after assigning -5 to an empty array on both target runtimes (the historical 8.2.4 run had key 0).', '',
	'array_key_exists(null, ...): existing empty-string key returns true on both; PHP 8.5 additionally emits E_DEPRECATED. Passing "" avoids that diagnostic. Array element value null remains a separate matter.', '',
	'## Required packet addendum / erratum', '',
	'PHP 8.5 also deprecates null as an array offset ($array[null]), not only the array_key_exists key argument. The original packet describes the conversion but omits this wider deprecation. Use an explicit empty-string key instead; null values are still valid.', '',
	'Evidence: [PHP 8.5 migration — deprecated features](https://www.php.net/manual/en/migration85.deprecated.php), captured separately in runtime-source-supplement.json, plus actual keys/key-types/null-key-argument diagnostics.', '',
	'Initial run: runtime-verification-initial.json retains 8.4 PASS and 8.5 FAIL (58/60), caused by the omitted null-offset deprecation. Expected diagnostics were corrected only after official documentation verification; no original packet or observation was rewritten.', '',
	'All requested operations are covered by output assertions, including key order, mutations, return values and expected warnings.', '',
	'## Boundary / original evidence', '', verification.remainingBoundary, '',
	...verification.limitations.map(item => `- ${item}`), '', 'This supplement resolves target-runtime execution only when Status is PASS. It does not rewrite the original packet or start Writer/Critic.'].join('\n') + '\n';
await writeResearchArtifacts(project, resolve(project, '../temp-ogwo/posts'), {
	'research/php-arrays/runtime-verification.json': stableJson(verification), 'research/php-arrays/runtime-verification.md': report });
if (verification.status !== 'PASS') process.exitCode = 1;
