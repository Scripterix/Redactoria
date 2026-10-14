import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { createArticleSchema, topicSchema } from './lib/content-schema.ts';

const articles = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/articles' }),
	schema: ({ image }) => createArticleSchema(reference('topics'), image()),
});

const topics = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './content/topics' }),
	schema: topicSchema,
});

export const collections = { articles, topics };
