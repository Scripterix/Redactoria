export const GENERIC_FEATURED_IMAGE_ALT = 'Ilustracja artykułu';

interface ArticleImageData {
	title?: string | null;
	featuredImage?: string | null;
	featuredAlt?: string | null;
}

export function resolveArticleFeaturedImage<T>(data: ArticleImageData, fallbackImage: T) {
	const featuredImage = data.featuredImage?.trim();
	const featuredAlt = data.featuredAlt?.trim();
	const title = data.title?.trim();

	return {
		src: featuredImage || fallbackImage,
		alt: featuredAlt || title || GENERIC_FEATURED_IMAGE_ALT,
	};
}
