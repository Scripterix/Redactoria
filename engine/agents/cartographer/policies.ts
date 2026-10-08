import { z } from 'zod';

export const ALLOWED_ACTIONS = ['KEEP', 'UPDATE', 'MERGE', 'SPLIT', 'ARCHIVE', 'REVIEW', 'NEW_CONTENT'] as const;
export const CARTOGRAPHER_POLICY = Object.freeze({
	may: ['read_inventory', 'read_selected_source', 'produce_analysis', 'write_lab'],
	mustNot: ['modify_source', 'modify_content', 'publish', 'merge_to_main', 'invoke_other_agent'],
});

/** Defaults are configuration, not embedded decisions inside the agent. */
export const DEFAULT_LIMITS = Object.freeze({ maxDeepReads: 8, maxBodyCharacters: 18000, maxSourceBytes: 1048576 });
export const LimitsSchema = z.strictObject({
	maxDeepReads: z.number().int().min(0).max(25),
	maxBodyCharacters: z.number().int().min(1).max(100000),
	maxSourceBytes: z.number().int().min(1).max(10485760),
});
export type CartographerLimits = z.infer<typeof LimitsSchema>;
