import { describe, expect, it } from 'vitest';
import { estimateReadingTime } from '../../src/lib/reading-time';

describe('reading time', () => {
	it('returns a minimum of one minute for empty or very short content', () => {
		expect(estimateReadingTime('').minutes).toBe(1);
		expect(estimateReadingTime('Krótki tekst.').minutes).toBe(1);
	});

	it('uses 220 prose words per minute and rounds up', () => {
		expect(estimateReadingTime(Array(220).fill('słowo').join(' ')).minutes).toBe(1);
		expect(estimateReadingTime(Array(221).fill('słowo').join(' ')).minutes).toBe(2);
	});

	it('counts non-empty fenced code lines separately from prose words', () => {
		const markdown = [
			Array(220).fill('słowo').join(' '),
			'```php',
			...Array.from({ length: 12 }, (_, index) => `$wartosc${index} = ${index};`),
			'',
			'```',
		].join('\n');

		expect(estimateReadingTime(markdown)).toEqual({
			minutes: 2,
			proseWords: 220,
			codeLines: 12,
		});
	});

	it('supports tilde fences and does not count fence labels as prose', () => {
		const estimate = estimateReadingTime('Wstęp\n~~~typescript\nconst answer = 42;\n~~~\nKoniec');

		expect(estimate).toEqual({ minutes: 1, proseWords: 2, codeLines: 1 });
	});

	it('keeps readable link labels and alt text without counting destinations or HTML', () => {
		const estimate = estimateReadingTime(
			'# Tytuł\n[Czytaj dokumentację](https://example.test/very/long/url)\n' +
			'![Schemat tablicy](/images/array-map.svg)\n<a id="model"></a> `array_map()`',
		);

		expect(estimate.proseWords).toBe(6);
		expect(estimate.codeLines).toBe(0);
	});
});
