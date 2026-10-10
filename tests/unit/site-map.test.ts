import { describe, expect, it } from 'vitest';
import { STATIC_SITE_PAGES } from '../../src/lib/site-map';

describe('HTML site map contract', () => {
	it('lists the required public page routes exactly once', () => {
		const hrefs = STATIC_SITE_PAGES.map(page => page.href);

		expect(hrefs).toEqual([
			'/',
			'/artykuly/',
			'/tematy/',
			'/o-projekcie/',
			'/szukaj/',
			'/mapa-strony/',
		]);
		expect(new Set(hrefs).size).toBe(hrefs.length);
	});

	it('keeps every static entry navigable and described', () => {
		for (const page of STATIC_SITE_PAGES) {
			expect(page.href === '/' || /^\/.*\/$/.test(page.href)).toBe(true);
			expect(page.title.length).toBeGreaterThan(0);
			expect(page.description.length).toBeGreaterThan(0);
		}
	});
});
