import { z } from 'zod';
import type { LanguageModel, StructuredRequest } from '../core/language-model.ts';
import { hashJson } from '../core/serialization.ts';

const response = z.strictObject({ requestHash: z.string().regex(/^[a-f0-9]{64}$/), response: z.unknown() });
const common = {
	schemaVersion: z.literal(1),
	provenance: z.strictObject({ mode: z.literal('imported-session-analysis'), model: z.string().min(1), description: z.string().min(1) }),
};
export const RecordedResponsesSchema = z.union([z.strictObject({
	...common,
	inventory: response,
	'deep-read': response.nullable(),
}), z.strictObject({ ...common, 'focused-merge': response })]);

/** An explicit import, not live inference. Bind both answers to exact requests. */
export class RecordedLanguageModel implements LanguageModel {
	readonly identity;
	private readonly responses;
	constructor(raw: unknown) {
		this.responses = RecordedResponsesSchema.parse(raw);
		this.identity = { adapter: 'recorded-json', model: this.responses.provenance.model, mode: this.responses.provenance.mode };
	}
	async generateStructured(request: StructuredRequest): Promise<unknown> {
		const entry = request.phase === 'focused-merge'
			? ('focused-merge' in this.responses ? this.responses['focused-merge'] : null)
			: ('inventory' in this.responses ? this.responses[request.phase] : null);
		if (!entry) throw new Error(`Missing recorded ${request.phase} analysis; prepare and analyze that request first.`);
		if (entry.requestHash !== hashJson(request)) throw new Error(`Recorded ${request.phase} request hash mismatch; analysis must match current inputs, prompt and limits.`);
		return structuredClone(entry.response);
	}
}
