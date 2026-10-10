import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('Human-authorized PHP public presentation cleanup', () => {
	it('removes only the two obsolete LAB/draft notes from the exact PASS candidate', async () => {
		const candidate = await readFile(new URL('../../lab/candidates/php-arrays/article.md', import.meta.url), 'utf8');
		const content = await readFile(new URL('../../content/articles/tablice-w-php.md', import.meta.url), 'utf8');
		const body = content.replace(/^---\r?\n[^]*?\r?\n---\r?\n/, '');
		const expected = candidate
			.replace('Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zaakceptowany Research Packet i obowiązkowe uzupełnienie runtime. Mapa evidence oraz provenance znajdują się w article.json.\n\n', '')
			.replace('- To draft, nie zatwierdzona publikacja. Deklarowane wyniki nowych bloków wymagają osobnej rzeczywistej weryfikacji; jej zapis, jeśli powstanie, znajduje się w code-execution.json.\n', '');
		expect(expected).not.toBe(candidate);
		expect(body).toBe(expected);
	});
});
