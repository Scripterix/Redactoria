import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { createArticleSchema } from '../../src/lib/content-schema';
import {
	GENERIC_FEATURED_IMAGE_ALT,
	resolveArticleFeaturedImage,
} from '../../src/lib/featured-image';

const featuredImageSchema = createArticleSchema(z.string()).pick({
	featuredImage: true,
	featuredAlt: true,
});

describe('article featured image', () => {
	it('uses the shared image and article title when optional metadata is absent', () => {
		expect(resolveArticleFeaturedImage({ title: 'Tytuł artykułu' }, '/fallback.webp')).toEqual({
			src: '/fallback.webp',
			alt: 'Tytuł artykułu',
		});
	});

	it('uses an article-specific image and alt text when provided', () => {
		expect(resolveArticleFeaturedImage({
			title: 'Tytuł artykułu',
			featuredImage: ' /images/articles/custom.webp ',
			featuredAlt: ' Opis ilustracji ',
		}, '/fallback.webp')).toEqual({
			src: '/images/articles/custom.webp',
			alt: 'Opis ilustracji',
		});
	});

	it('preserves imported Astro image metadata for local optimized assets', () => {
		const featuredImage = { src: '/_astro/tablice.hash.webp', width: 1600, height: 900, format: 'webp' } as const;
		expect(resolveArticleFeaturedImage({
			title: 'Tablice w PHP',
			featuredImage,
			featuredAlt: 'Opis lokalnej ilustracji',
		}, '/fallback.webp')).toEqual({
			src: featuredImage,
			alt: 'Opis lokalnej ilustracji',
		});
	});

	it('falls back safely when optional strings and the title are blank', () => {
		expect(resolveArticleFeaturedImage({
			title: ' ',
			featuredImage: ' ',
			featuredAlt: ' ',
		}, '/fallback.webp')).toEqual({
			src: '/fallback.webp',
			alt: GENERIC_FEATURED_IMAGE_ALT,
		});
	});

	it('keeps both content fields optional for existing articles', () => {
		expect(featuredImageSchema.parse({})).toEqual({});
	});

	it('accepts future image metadata and rejects blank values', () => {
		expect(featuredImageSchema.parse({
			featuredImage: '/images/articles/custom.webp',
			featuredAlt: 'Opis ilustracji',
		})).toEqual({
			featuredImage: '/images/articles/custom.webp',
			featuredAlt: 'Opis ilustracji',
		});
		expect(featuredImageSchema.safeParse({ featuredImage: ' ' }).success).toBe(false);
		expect(featuredImageSchema.safeParse({ featuredAlt: ' ' }).success).toBe(false);
	});
});
