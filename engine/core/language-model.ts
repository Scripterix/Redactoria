export interface ModelIdentity {
	adapter: string;
	model: string;
	mode: 'imported-session-analysis' | 'live' | 'test';
}

export interface StructuredRequest {
	phase: 'inventory' | 'deep-read' | 'focused-merge' | 'focused-article' | 'pilot-selection' | 'research' | 'writer' | 'critic';
	instructions: string;
	context: unknown;
	jsonSchema: Record<string, unknown>;
}

/** Providers return unknown. Only agent-owned validation can accept the output. */
export interface LanguageModel {
	readonly identity: ModelIdentity;
	generateStructured(request: StructuredRequest): Promise<unknown>;
}
