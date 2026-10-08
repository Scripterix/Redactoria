import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const nullableText = z.string().nullable().optional();

const originSchema = z.object({
	type: z.enum(['native', 'wordpress-export']),
	source_id: z.union([z.string(), z.number()]).nullable().optional(),
	original_url: z.url().nullable().optional(),
	original_date: z.coerce.date().nullable().optional(),
	original_author: nullableText,
});

const articles = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/articles' }),
	schema: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		slug: z.string().min(1),
		status: z.enum(['draft', 'review', 'published', 'archived']),
		created: z.coerce.date(),
		updated: z.coerce.date(),
		domain: z.string().min(1),
		topic: reference('topics'),
		author: z.object({
			type: z.enum(['human', 'ai-assisted']),
			name: z.string().min(1),
		}),
		sources: z.array(
			z.object({
				title: z.string().min(1),
				url: z.url(),
				publisher: nullableText,
				accessed: z.coerce.date().optional(),
			}),
		).default([]),
		origin: originSchema,
		review: z.object({
			status: z.enum(['pending', 'approved', 'rejected']),
			reviewer: nullableText,
			confidence: z.number().min(0).max(1).optional(),
		}),
		automation: z.object({
			generated: z.boolean().default(false),
			last_checked: z.coerce.date().nullable().optional(),
			update_priority: z.enum(['low', 'normal', 'high']).default('normal'),
		}),
		redactoria: z.object({
			decision: z.enum(['keep', 'update', 'merge', 'split', 'rewrite', 'archive', 'review']),
			modernization: z.enum(['none', 'minor', 'major']).default('none'),
		}).optional(),
	}),
});

const topics = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './content/topics' }),
	schema: z.object({
		name: z.string().min(1),
		slug: z.string().min(1),
		description: z.string().min(1),
		order: z.number().int().nonnegative().default(0),
		status: z.enum(['draft', 'published']).default('published'),
	}),
});

export const collections = { articles, topics };
