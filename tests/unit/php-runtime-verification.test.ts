import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { verifyRuntimeRecords } from '../../scripts/research/runtime-verification.ts';

// Captured actual CLI results; tests replay validators only, never execute/download PHP.
const captured = JSON.parse(readFileSync(new URL('../../lab/research/php-arrays/runtime-verification.json', import.meta.url), 'utf8'));
function records(family: '8.4' | '8.5') {
	return structuredClone(captured.runs.find((run: { family: string }) => run.family === family).records);
}
describe('PHP runtime approval evidence', () => {
	it.each(['8.4', '8.5'] as const)('validates the genuinely captured %s result', family => {
		const result = verifyRuntimeRecords(records(family), family);
		expect(result.status).toBe('PASS'); expect(result.checks).toHaveLength(60);
	});
	it('does not silently accept different observed results', () => {
		const changed = records('8.5'); changed.find((probe: { id: string }) => probe.id === 'keys').result.negativeAppend = { 0: 'next', '-5': 'negative' };
		expect(verifyRuntimeRecords(changed, '8.5').status).toBe('FAIL');
	});
	it('requires actual version identity instead of relabelling an older run', () => {
		const changed = records('8.4'); changed[0].phpVersion = '8.2.4';
		expect(() => verifyRuntimeRecords(changed, '8.4')).toThrow('actual PHP version');
	});
	it('requires known probe IDs, all probes and unique IDs', () => {
		const missing = records('8.4'); missing.pop(); expect(() => verifyRuntimeRecords(missing, '8.4')).toThrow();
		const unknown = records('8.4'); unknown[0].id = 'ghost'; expect(() => verifyRuntimeRecords(unknown, '8.4')).toThrow('unknown');
		const duplicate = records('8.4'); duplicate[0].id = duplicate[1].id; expect(() => verifyRuntimeRecords(duplicate, '8.4')).toThrow('duplicate');
	});
	it('requires exact code hash provenance', () => {
		const changed = records('8.4'); changed[0].code += '\n// substituted';
		expect(() => verifyRuntimeRecords(changed, '8.4')).toThrow('code hash');
	});
	it('requires both PHP 8.5 null-offset and null-argument deprecations', () => {
		const changed = records('8.5'); changed.find((probe: { id: string }) => probe.id === 'keys').diagnostics.shift();
		changed.find((probe: { id: string }) => probe.id === 'null-key-argument').diagnostics = [];
		const result = verifyRuntimeRecords(changed, '8.5');
		expect(result.status).toBe('FAIL'); expect(result.checks.filter(check => check.status === 'FAIL')).toHaveLength(2);
	});
	it('does not accept unexpected additional warnings as successful execution', () => {
		const changed = records('8.4'); changed.find((probe: { id: string }) => probe.id === 'functional').diagnostics.push({ level: 2, message: 'Unexpected warning' });
		expect(verifyRuntimeRecords(changed, '8.4').status).toBe('FAIL');
	});
});
