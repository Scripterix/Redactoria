import { describe, expect, it, vi } from 'vitest';
import { createSearchController, publicSearchPath, type PagefindSearch, type SearchDocument, type SearchState } from '../../src/lib/search';

const origin = 'https://redactoria.pages.dev';
const document: SearchDocument = {
	url: '/artykuly/tablice-w-php/', meta: { title: 'Tablice w PHP' }, excerpt: 'Klucze i wartości.',
};

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (error: Error) => void;
	const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
	return { promise, resolve, reject };
}

describe('Public search result links', () => {
	it.each(['/', '/artykuly/', '/tematy/php/', '/artykuly/tablice-w-php/', '/o-projekcie/', '/mapa-strony/'])('accepts %s', path => {
		expect(publicSearchPath(path, origin)).toBe(path);
	});
	it('accepts same-origin absolute links and removes query/hash', () => {
		expect(publicSearchPath(`${origin}/artykuly/tablice-w-php/?q=x#arrays`, origin)).toBe('/artykuly/tablice-w-php/');
		expect(publicSearchPath('/tematy/php/', 'http://localhost:4322')).toBe('/tematy/php/');
	});
	it.each(['/lab/drafts/php/', '/docs/STATUS.md', '/candidates/php/', '/internal/', '/szukaj/', 'javascript:alert(1)', 'https://example.com/artykuly/php/', '//example.com/'])('rejects %s', path => {
		expect(publicSearchPath(path, origin)).toBeUndefined();
	});
});

describe('Search request lifecycle', () => {
	it('does not load Pagefind for an empty or whitespace query', async () => {
		const load = vi.fn();
		const states: SearchState[] = [];
		await createSearchController(load, state => states.push(state))('  ');
		expect(load).not.toHaveBeenCalled();
		expect(states).toEqual([{ status: 'idle' }]);
	});
	it('trims queries and loads exact Pagefind documents', async () => {
		const data = vi.fn(async () => document);
		const search = vi.fn(async () => ({ results: [{ data }] }));
		const states: SearchState[] = [];
		await createSearchController(async () => ({ search }), state => states.push(state))('  PHP  ');
		expect(search).toHaveBeenCalledWith('PHP');
		expect(data).toHaveBeenCalledOnce();
		expect(states).toEqual([{ status: 'loading' }, { status: 'ready', query: 'PHP', results: [document] }]);
	});
	it('reports an empty result set', async () => {
		const update = vi.fn();
		await createSearchController(async () => ({ search: async () => ({ results: [] }) }), update)('absent');
		expect(update).toHaveBeenLastCalledWith({ status: 'ready', query: 'absent', results: [] });
	});
	it('does not let a slow result overwrite a newer query', async () => {
		const old = deferred<SearchDocument>();
		const data = vi.fn(() => old.promise);
		const update = vi.fn();
		const run = createSearchController(async () => ({ search: async query => ({ results: query === 'old' ? [{ data }] : [] }) }), update);
		const first = run('old');
		await vi.waitFor(() => expect(data).toHaveBeenCalledOnce());
		await run('new');
		old.resolve(document);
		await first;
		expect(update).toHaveBeenLastCalledWith({ status: 'ready', query: 'new', results: [] });
	});
	it('invalidates a pending request when the reader clears or edits the query', async () => {
		const pending = deferred<PagefindSearch>();
		const search = vi.fn();
		const update = vi.fn();
		const run = createSearchController(() => pending.promise, update);
		const first = run('PHP');
		await run('');
		pending.resolve({ search });
		await first;
		expect(search).not.toHaveBeenCalled();
		expect(update).toHaveBeenLastCalledWith({ status: 'idle' });
	});
	it('reports failed loading and permits a subsequent retry', async () => {
		const load = vi.fn<() => Promise<PagefindSearch>>()
			.mockRejectedValueOnce(new Error('index unavailable'))
			.mockResolvedValueOnce({ search: async () => ({ results: [] }) });
		const update = vi.fn();
		const run = createSearchController(load, update);
		await run('PHP');
		expect(update).toHaveBeenLastCalledWith({ status: 'error' });
		await run('PHP');
		expect(update).toHaveBeenLastCalledWith({ status: 'ready', query: 'PHP', results: [] });
	});
	it('reports document download failures without displaying partial results', async () => {
		const update = vi.fn();
		await createSearchController(async () => ({ search: async () => ({ results: [{ data: async () => { throw new Error('fragment unavailable'); } }] }) }), update)('PHP');
		expect(update).toHaveBeenLastCalledWith({ status: 'error' });
	});
	it('does not let an old failure replace the new successful result', async () => {
		const old = deferred<{ results: { data(): Promise<SearchDocument> }[] }>();
		const search = vi.fn().mockReturnValueOnce(old.promise).mockResolvedValueOnce({ results: [] });
		const update = vi.fn();
		const run = createSearchController(async () => ({ search }), update);
		const first = run('old');
		await vi.waitFor(() => expect(search).toHaveBeenCalledOnce());
		await run('new');
		old.reject(new Error('old failure'));
		await first;
		expect(update).toHaveBeenLastCalledWith({ status: 'ready', query: 'new', results: [] });
	});
});
