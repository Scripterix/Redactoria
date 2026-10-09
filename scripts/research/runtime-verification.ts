import { createHash } from 'node:crypto';
import { z } from 'zod';
import { ProbeSchema } from '../../engine/agents/researcher/contract.ts';
import { stableJson } from '../../engine/core/serialization.ts';

export const TARGET_RUNTIMES = {
	'8.4': { version: '8.4.26', archiveSha256: 'da68394f9193b7f6b89d0c76861a4034ae10efee7fd55a7255d8118c2acf70d7',
		archiveUrl: 'https://downloads.php.net/~windows/releases/archives/php-8.4.26-nts-Win32-vs17-x64.zip',
		checksumSource: 'https://www.php.net/downloads.php?os=windows&version=8.4' },
	'8.5': { version: '8.5.11', archiveSha256: '0ea96e0d2b9b737a6036f05cf4e95c49313faa6d0f27bd97edb2742503f0c043',
		archiveUrl: 'https://downloads.php.net/~windows/releases/archives/php-8.5.11-nts-Win32-vs17-x64.zip',
		checksumSource: 'https://www.php.net/downloads.php?os=windows&version=8.5' },
} as const;
export const PROBE_IDS = ['keys', 'presence', 'operations', 'iteration', 'merge', 'sorting', 'functional',
	'extract', 'forms-menu', 'null-key-argument', 'key-types', 'functional-edge-cases'] as const;

/** Pure deterministic assertions, not an interpreter or simulator. Requires actual captured records. */
export function verifyRuntimeRecords(raw: unknown, family: keyof typeof TARGET_RUNTIMES) {
	const records = z.array(ProbeSchema).length(PROBE_IDS.length).parse(raw);
	if (new Set(records.map(record => record.id)).size !== records.length
		|| PROBE_IDS.some(id => !records.some(record => record.id === id))) throw new Error('Missing, duplicate or unknown runtime probe.');
	for (const record of records) {
		if (record.phpVersion !== TARGET_RUNTIMES[family].version) throw new Error('Wrong actual PHP version.');
		if (createHash('sha256').update(record.code).digest('hex') !== record.codeHash) throw new Error('Probe code hash mismatch.');
	}
	const byId = new Map(records.map(record => [record.id, record]));
	const checks: { id: string; probeId: string; status: 'PASS' | 'FAIL'; expected: unknown; actual: unknown }[] = [];
	function check(id: string, probeId: string, actual: unknown, expected: unknown) {
		checks.push({ id, probeId, status: stableJson(actual) === stableJson(expected) ? 'PASS' : 'FAIL', expected, actual });
	}
	function result(probeId: string) { return byId.get(probeId)!.result as Record<string, unknown>; }
	function value(probeId: string, key: string, expected: unknown) { check(`${probeId}/${key}`, probeId, result(probeId)[key], expected); }
	function diagnostic(probeId: string, levels: number[]) {
		check(`${probeId}/diagnostic-levels`, probeId, byId.get(probeId)!.diagnostics.map(item => item.level), levels);
	}
	value('keys', 'castKeys', { 0: 'string', 1: 'float', '': 'null' });
	value('keys', 'castKeyOrder', [0, 1, '']); value('keys', 'appendAfterUnset', { 11: 'next' });
	value('keys', 'negativeAppend', { '-5': 'negative', '-4': 'next' }); diagnostic('keys', family === '8.5' ? [8192, 8192] : [8192]);
	value('presence', 'checks', {
		missing: { isset: false, keyExists: false, coalesce: 'fallback', empty: true },
		null: { isset: false, keyExists: true, coalesce: 'fallback', empty: true },
		zero: { isset: true, keyExists: true, coalesce: 0, empty: true },
		'text-zero': { isset: true, keyExists: true, coalesce: '0', empty: true },
		false: { isset: true, keyExists: true, coalesce: false, empty: true },
		empty: { isset: true, keyExists: true, coalesce: '', empty: true },
	}); value('presence', 'directMissing', null); diagnostic('presence', [2]);
	for (const [key, expected] of Object.entries({ last: 5, first: 1, afterShift: [2, 3, 4], afterUnset: { 0: 2, 2: 4 },
		removed: [4], numbers: [2], fruits: ['peach', 'apple', 'pear', 'plum', 'cherry'], pushSize: 4, unshiftSize: 5 })) value('operations', key, expected);
	diagnostic('operations', []);
	value('iteration', 'pairs', [['x', 1], [4, 2]]); value('iteration', 'afterReferenceLoop', { x: 2, 4: 4 }); diagnostic('iteration', []);
	value('merge', 'merge', { 0: 'left-number', 1: 'right-number', 2: 'seven', x: 'right' });
	value('merge', 'union', { 2: 'left-number', x: 'left', 7: 'seven' });
	value('merge', 'replace', { 2: 'right-number', x: 'right', 7: 'seven' });
	value('merge', 'leftUnchanged', { 2: 'left-number', x: 'left' }); diagnostic('merge', []);
	for (const [name, array, keyOrder] of [
		['sort', [1, 2, 3], [0, 1, 2]], ['rsort', [3, 2, 1], [0, 1, 2]],
		['asort', { a: 3, b: 2, c: 1 }, ['c', 'b', 'a']], ['arsort', { a: 3, b: 2, c: 1 }, ['a', 'b', 'c']],
		['ksort', { a: 3, b: 2, c: 1 }, ['a', 'b', 'c']], ['krsort', { a: 3, b: 2, c: 1 }, ['c', 'b', 'a']],
	] as const) value('sorting', name, { array, keyOrder, return: true });
	diagnostic('sorting', []);
	value('functional', 'numbers', [1, 2, 3, 4, 5]); value('functional', 'map', [2, 4, 6, 8, 10]);
	value('functional', 'filter', { 1: 2, 3: 4 }); value('functional', 'reduce', 15);
	value('functional', 'counts', { apple: 2, pear: 2, cherry: 1 }); diagnostic('functional', []);
	value('extract', 'name', 'overwritten'); value('extract', 'createdVariables', 1); diagnostic('extract', []);
	value('forms-menu', 'emailIsString', false); value('forms-menu', 'validEmail', 'user@example.com');
	value('forms-menu', 'invalidEmail', false); value('forms-menu', 'escaped', '&lt;b&gt;name&lt;/b&gt;');
	value('forms-menu', 'active', null); diagnostic('forms-menu', [2]);
	value('null-key-argument', 'nullArgument', true); value('null-key-argument', 'emptyStringArgument', true);
	diagnostic('null-key-argument', family === '8.5' ? [8192] : []);
	check('key-types/exact-types', 'key-types', byId.get('key-types')!.result, [
		{ key: 0, type: 'integer', value: 'zero' }, { key: '08', type: 'string', value: 'padded' },
		{ key: 1, type: 'integer', value: 'boolean' }, { key: '', type: 'string', value: 'null' },
	]); diagnostic('key-types', family === '8.5' ? [8192] : []);
	value('functional-edge-cases', 'singleMap', { x: 2, y: 4 }); value('functional-edge-cases', 'multipleMap', [2, 4]);
	value('functional-edge-cases', 'emptyReduce', 0); value('functional-edge-cases', 'withoutInitial', null);
	value('functional-edge-cases', 'invalidCounts', { 1: 1, one: 1 }); value('functional-edge-cases', 'filtered', { 5: 'keep' });
	diagnostic('functional-edge-cases', [2, 2]);
	return { status: checks.every(item => item.status === 'PASS') ? 'PASS' as const : 'FAIL' as const, records, checks };
}
