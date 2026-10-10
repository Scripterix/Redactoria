export const READING_RATE = {
	proseWordsPerMinute: 220,
	codeLinesPerMinute: 12,
} as const;

export interface ReadingTimeEstimate {
	minutes: number;
	proseWords: number;
	codeLines: number;
}

function splitMarkdown(markdown: string): { prose: string; codeLines: number } {
	const proseLines: string[] = [];
	let fence: { marker: '`' | '~'; length: number } | undefined;
	let codeLines = 0;

	for (const line of markdown.split(/\r?\n/)) {
		if (fence) {
			const closingFence = new RegExp(`^ {0,3}\\${fence.marker}{${fence.length},}\\s*$`);
			if (closingFence.test(line)) {
				fence = undefined;
			} else if (line.trim().length > 0) {
				codeLines += 1;
			}
			continue;
		}

		const openingFence = line.match(/^ {0,3}(`{3,}|~{3,})/);
		if (openingFence) {
			const token = openingFence[1]!;
			fence = { marker: token[0] as '`' | '~', length: token.length };
			continue;
		}

		proseLines.push(line);
	}

	return { prose: proseLines.join('\n'), codeLines };
}

function countProseWords(markdown: string): number {
	const readableText = markdown
		.replace(/<!--[^]*?-->/g, ' ')
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]*>/g, ' ')
		.replace(/`[^`]+`/g, ' kod ');

	return readableText.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function estimateReadingTime(markdown: string): ReadingTimeEstimate {
	const { prose, codeLines } = splitMarkdown(markdown);
	const proseWords = countProseWords(prose);
	const rawMinutes = proseWords / READING_RATE.proseWordsPerMinute
		+ codeLines / READING_RATE.codeLinesPerMinute;

	return {
		minutes: Math.max(1, Math.ceil(rawMinutes)),
		proseWords,
		codeLines,
	};
}
