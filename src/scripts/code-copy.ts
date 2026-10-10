import { copyCodeText } from '../lib/code-copy';

const RESET_DELAY_MS = 2500;

document.querySelectorAll<HTMLElement>('.article__content pre > code').forEach((code, index) => {
	const pre = code.parentElement;
	if (!pre || pre.parentElement?.classList.contains('code-block')) return;

	const blockNumber = index + 1;
	const wrapper = document.createElement('div');
	const button = document.createElement('button');
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	wrapper.className = 'code-block';
	button.type = 'button';
	button.className = 'code-copy';
	button.textContent = 'Copy';
	button.setAttribute('aria-label', `Kopiuj kod z bloku ${blockNumber}`);
	button.setAttribute('aria-live', 'polite');

	pre.before(wrapper);
	wrapper.append(button, pre);

	button.addEventListener('click', async () => {
		if (resetTimer) clearTimeout(resetTimer);

		try {
			if (!navigator.clipboard) throw new Error('Clipboard API is unavailable');
			await copyCodeText(code.textContent ?? '', navigator.clipboard);
			button.textContent = 'Copied';
			button.setAttribute('aria-label', `Kod z bloku ${blockNumber} skopiowany`);
		} catch {
			button.textContent = 'Copy failed';
			button.setAttribute('aria-label', `Nie udało się skopiować kodu z bloku ${blockNumber}`);
		}

		resetTimer = setTimeout(() => {
			button.textContent = 'Copy';
			button.setAttribute('aria-label', `Kopiuj kod z bloku ${blockNumber}`);
		}, RESET_DELAY_MS);
	});
});
