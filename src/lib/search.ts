import { STATIC_SITE_PAGES } from './site-map';

export interface SearchDocument {
	url: string;
	meta: { title?: string };
	excerpt: string;
}

export interface PagefindSearch {
	search(query: string): Promise<{ results: { data(): Promise<SearchDocument> }[] }>;
}

export type SearchState =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'error' }
	| { status: 'ready'; query: string; results: SearchDocument[] };

/** Search links must stay within this public website. */
export function publicSearchPath(value: string, origin: string): string | undefined {
	try {
		const url = new URL(value, origin);
		if (url.origin !== new URL(origin).origin) return undefined;
		const path = url.pathname;
		const isStaticPage = STATIC_SITE_PAGES.some(page => page.href === path && path !== '/szukaj/');
		const isContentPage = /^\/(artykuly|tematy)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(path);
		return isStaticPage || isContentPage ? path : undefined;
	} catch {
		return undefined;
	}
}

/** An older request must never replace a newer query or a cleared form. */
export function createSearchController(
	load: () => Promise<PagefindSearch>,
	update: (state: SearchState) => void,
) {
	let request = 0;
	return async (input: string): Promise<void> => {
		const current = ++request;
		const query = input.trim();
		if (!query) {
			update({ status: 'idle' });
			return;
		}
		update({ status: 'loading' });
		try {
			const pagefind = await load();
			if (current !== request) return;
			const response = await pagefind.search(query);
			if (current !== request) return;
			const results = await Promise.all(response.results.map(result => result.data()));
			if (current === request) update({ status: 'ready', query, results });
		} catch {
			if (current === request) update({ status: 'error' });
		}
	};
}
