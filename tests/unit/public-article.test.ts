import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const oldAudience = 'Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.';
const newAudience = 'Materiał dla początkujących i osób na poziomie średnim.';

describe('Human-authorized PHP public presentation cleanup', () => {
	it('applies only the authorized reader-facing cleanup to the exact PHP Arrays candidate', async () => {
		const candidate = await readFile(new URL('../../lab/candidates/php-arrays/article.md', import.meta.url), 'utf8');
		const content = await readFile(new URL('../../content/articles/tablice-w-php.md', import.meta.url), 'utf8');
		const body = content.replace(/^---\r?\n[^]*?\r?\n---\r?\n/, '');
		const expected = candidate
			.replace(oldAudience, newAudience)
			.replace('Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zaakceptowany Research Packet i obowiązkowe uzupełnienie runtime. Mapa evidence oraz provenance znajdują się w article.json.\n\n', '')
			.replace('- To draft, nie zatwierdzona publikacja. Deklarowane wyniki nowych bloków wymagają osobnej rzeczywistej weryfikacji; jej zapis, jeśli powstanie, znajduje się w code-execution.json.\n', '');
		expect(expected).not.toBe(candidate);
		expect(body).toBe(expected);
	});

	it('applies only the authorized reader-facing cleanup to PHP Control Flow', async () => {
		const candidate = await readFile(new URL('../../lab/candidates/php-control-flow/article.md', import.meta.url), 'utf8');
		const content = await readFile(new URL('../../content/articles/instrukcje-sterujace-php.md', import.meta.url), 'utf8');
		const body = content.replace(/^---\r?\n[^]*?\r?\n---\r?\n/, '');
		const note = 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie zgody B2 oraz rzeczywiste wykonania PHP 8.4 i 8.5. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.\n\n';
		expect(candidate.split(note)).toHaveLength(2);
		expect(body).toBe(candidate.replace(oldAudience, newAudience).replace(note, ''));
	});
});
