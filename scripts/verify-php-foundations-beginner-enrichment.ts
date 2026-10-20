import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stableJson } from '../engine/core/serialization.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const articleRef = 'content/articles/podstawy-php.md';
const reportRef = 'lab/research/php-language-foundation/beginner-setup-enrichment-runtime.json';
const article = await readFile(resolve(project, articleRef), 'utf8');

type ValidCase = {
	id: string;
	articleCode: string;
	expectedStdout: string;
};

const validCases: ValidCase[] = [
	{
		id: 'first-output',
		articleCode: '<?php\necho "Start PHP\\n";',
		expectedStdout: 'Start PHP\n',
	},
	{
		id: 'edited-output',
		articleCode: '<?php\necho "Uczę się PHP\\n";',
		expectedStdout: 'Uczę się PHP\n',
	},
	{
		id: 'named-value',
		articleCode: '<?php\n$name = \'Ada\';\necho "Cześć, ", $name, "!\\n";',
		expectedStdout: 'Cześć, Ada!\n',
	},
	{
		id: 'scalar-types',
		articleCode: '<?php\n$name = \'Ada\';\n$count = 2;\n$ready = true;\necho get_debug_type($name), "\\n";\necho get_debug_type($count), "\\n";\necho get_debug_type($ready), "\\n";',
		expectedStdout: 'string\nint\nbool\n',
	},
	{
		id: 'pages-total',
		articleCode: '<?php\n$yesterday = 8;\n$today = 12;\n$totalPages = $yesterday + $today;\necho "Przeczytane strony: ", $totalPages, "\\n";',
		expectedStdout: 'Przeczytane strony: 20\n',
	},
	{
		id: 'fixed-semicolon',
		articleCode: '<?php\necho "Brakuje średnika\\n";',
		expectedStdout: 'Brakuje średnika\n',
	},
	{
		id: 'shopping-total',
		articleCode: '<?php\n$product = \'Notatnik\';\n$price = 12;\n$quantity = 3;\n$total = $price * $quantity;\n\necho "Produkt: ", $product, "\\n";\necho "Liczba sztuk: ", $quantity, "\\n";\necho "Razem: ", $total, " zł\\n";',
		expectedStdout: 'Produkt: Notatnik\nLiczba sztuk: 3\nRazem: 36 zł\n',
	},
];

const results = validCases.map(testCase => {
	const fence = `\`\`\`php\n${testCase.articleCode}\n\`\`\``;
	if (!article.includes(fence)) throw new Error(`${testCase.id}: exact article code fence not found.`);
	const runtimeCode = testCase.articleCode.replace(/^<\?php\n/, '');
	const execution = spawnSync('php', ['-r', runtimeCode], { encoding: 'utf8' });
	const passed = execution.status === 0
		&& execution.stdout === testCase.expectedStdout
		&& execution.stderr === '';
	if (!passed) {
		throw new Error(`${testCase.id}: runtime mismatch: ${JSON.stringify({
			status: execution.status,
			stdout: execution.stdout,
			stderr: execution.stderr,
		})}`);
	}
	return {
		id: testCase.id,
		status: 'PASS',
		exitCode: execution.status,
		expectedStdout: testCase.expectedStdout,
		actualStdout: execution.stdout,
		stderr: execution.stderr,
	};
});

const invalidCode = '<?php\necho "Brakuje średnika\\n"';
if (!article.includes(`\`\`\`php\n${invalidCode}\n\`\`\``)) {
	throw new Error('intentional-parse-error: exact article code fence not found.');
}
const invalidExecution = spawnSync('php', ['-r', invalidCode.replace(/^<\?php\n/, '')], { encoding: 'utf8' });
const diagnostic = `${invalidExecution.stdout}\n${invalidExecution.stderr}`;
if (invalidExecution.status === 0 || !/(?:Parse error|syntax error)/i.test(diagnostic)) {
	throw new Error(`intentional-parse-error: expected a PHP syntax failure: ${JSON.stringify({
		status: invalidExecution.status,
		stdout: invalidExecution.stdout,
		stderr: invalidExecution.stderr,
	})}`);
}

const version = spawnSync('php', ['--version'], { encoding: 'utf8' });
if (version.status !== 0) throw new Error('Unable to read local PHP version.');

const report = {
	schemaVersion: 1,
	status: 'PASS',
	topic: 'php-language-foundation',
	articleRef,
	executedAt: '2026-10-19T22:00:00Z',
	runtime: version.stdout.split(/\r?\n/, 1)[0],
	execution: 'actual-local-cli',
	validExamples: {
		status: 'PASS',
		count: results.length,
		results,
	},
	intentionalError: {
		id: 'intentional-parse-error',
		status: 'PASS',
		exitCode: invalidExecution.status,
		assertion: 'Non-zero exit with a PHP parse or syntax diagnostic.',
		stdout: invalidExecution.stdout,
		stderr: invalidExecution.stderr,
	},
	limitations: [
		'Execution covers the exact complete PHP examples in this article and one intentional syntax error.',
		'It verifies local PHP CLI behavior only; no web server, browser, database or cross-version parity is claimed.',
	],
};

await writeFile(resolve(project, reportRef), stableJson(report), 'utf8');
console.log(`PHP foundations runtime: PASS (${results.length}/${results.length} valid examples + intentional error).`);
