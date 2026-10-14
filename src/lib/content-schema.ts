import { z } from 'astro/zod';

const nullableText = z.string().nullable().optional();
const featuredImagePath = z.string().trim().min(1);

/** One schema for Astro and the deterministic promotion boundary. */
export function createArticleSchema<
	T extends z.ZodType,
	I extends z.ZodType = typeof featuredImagePath,
>(topic: T, featuredImage?: I) {
	const featuredImageSchema = featuredImage ?? featuredImagePath;
	return z.object({
		title: z.string().min(1), description: z.string().min(1), slug: z.string().min(1),
		featuredImage: featuredImageSchema.optional(),
		featuredAlt: z.string().trim().min(1).optional(),
		status: z.enum(['draft', 'review', 'published', 'archived']),
		created: z.coerce.date(), updated: z.coerce.date(), domain: z.string().min(1), topic,
		author: z.object({ type: z.enum(['human', 'ai-assisted']), name: z.string().min(1) }),
		sources: z.array(z.object({ title: z.string().min(1), url: z.url(), publisher: nullableText,
			accessed: z.coerce.date().optional() })).default([]),
		origin: z.object({ type: z.enum(['native', 'wordpress-export']),
			source_id: z.union([z.string(), z.number()]).nullable().optional(),
			original_url: z.url().nullable().optional(), original_date: z.coerce.date().nullable().optional(),
			original_author: nullableText }),
		review: z.object({ status: z.enum(['pending', 'approved', 'rejected']), reviewer: nullableText,
			confidence: z.number().min(0).max(1).optional() }),
		automation: z.object({ generated: z.boolean().default(false),
			last_checked: z.coerce.date().nullable().optional(),
			update_priority: z.enum(['low', 'normal', 'high']).default('normal') }),
		redactoria: z.object({ decision: z.enum(['keep', 'update', 'merge', 'split', 'rewrite', 'archive', 'review']),
			modernization: z.enum(['none', 'minor', 'major']).default('none') }).optional(),
	});
}

export const topicSchema = z.object({ name: z.string().min(1), slug: z.string().min(1),
	description: z.string().min(1), order: z.number().int().nonnegative().default(0),
	status: z.enum(['draft', 'published']).default('published') });
