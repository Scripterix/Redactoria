import { describe, expect, it, vi } from 'vitest';
import { copyCodeText } from '../../src/lib/code-copy';

describe('code copy', () => {
	it('passes the exact block text to the clipboard without trimming or rewriting it', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		const code = "<?php\n$items = ['a', 'b'];\n\nprint_r($items);\n";

		await copyCodeText(code, { writeText });

		expect(writeText).toHaveBeenCalledOnce();
		expect(writeText).toHaveBeenCalledWith(code);
	});

	it('reports clipboard failures to the caller', async () => {
		const failure = new Error('denied');
		const writeText = vi.fn().mockRejectedValue(failure);

		await expect(copyCodeText('echo 1;', { writeText })).rejects.toBe(failure);
	});
});
