import { createSearchController, publicSearchPath, type PagefindSearch } from '../lib/search';

const form = document.querySelector<HTMLFormElement>('[data-search-form]');
const input = document.querySelector<HTMLInputElement>('#search-query');
const status = document.querySelector<HTMLElement>('[data-search-status]');
const results = document.querySelector<HTMLUListElement>('[data-search-results]');

if (form && input && status && results) {
	let module: Promise<PagefindSearch> | undefined;
	const search = createSearchController(() => {
		// Generated after Astro builds; load only when a reader searches.
		const path = '/pagefind/pagefind.js';
		module ??= import(/* @vite-ignore */ path).catch(error => {
			module = undefined;
			throw error;
		});
		return module;
	}, state => {
		results.replaceChildren();
		results.setAttribute('aria-busy', String(state.status === 'loading'));
		if (state.status === 'idle') {
			status.textContent = 'Wpisz hasło, aby przeszukać Redactorię.';
		} else if (state.status === 'loading') {
			status.textContent = 'Szukam…';
		} else if (state.status === 'error') {
			status.textContent = 'Nie udało się uruchomić wyszukiwania. Odśwież stronę i spróbuj ponownie.';
		} else {
			for (const result of state.results) {
				const path = publicSearchPath(result.url, location.origin);
				if (!path) continue;
				const item = document.createElement('li');
				const heading = document.createElement('h2');
				const link = document.createElement('a');
				const excerpt = document.createElement('p');
				const url = document.createElement('small');
				link.href = path;
				link.textContent = result.meta.title ?? path;
				// Pagefind excerpts contain <mark>; keep only inert plain text.
				const template = document.createElement('template');
				template.innerHTML = result.excerpt;
				excerpt.textContent = template.content.textContent;
				url.textContent = path;
				heading.append(link);
				item.append(heading, excerpt, url);
				results.append(item);
			}
			status.textContent = results.children.length
				? `Liczba wyników: ${results.children.length}. Hasło: „${state.query}”.`
				: `Brak wyników dla „${state.query}”. Spróbuj innego hasła.`;
		}
	});
	form.addEventListener('submit', event => {
		event.preventDefault();
		void search(input.value);
	});
	input.addEventListener('input', () => {
		// Invalidate any previous request while a reader edits their query.
		void search('');
	});
	input.disabled = false;
	form.querySelector<HTMLButtonElement>('button')!.disabled = false;
}
