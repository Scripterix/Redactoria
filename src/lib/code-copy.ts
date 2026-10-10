export interface ClipboardWriter {
	writeText(text: string): Promise<void>;
}

export async function copyCodeText(text: string, clipboard: ClipboardWriter): Promise<void> {
	await clipboard.writeText(text);
}
