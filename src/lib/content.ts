import { getCollection } from 'astro:content';

interface PublishableEntry {
	data: {
		status: string;
	};
}

interface DatedEntry {
	data: {
		created: Date;
	};
}

interface TopicEntry {
	data: {
		topic: {
			id: string;
		};
	};
}

export function filterPublished<T extends PublishableEntry>(entries: readonly T[]): T[] {
	return entries.filter((entry) => entry.data.status === 'published');
}

export function sortArticlesNewestFirst<T extends DatedEntry>(entries: readonly T[]): T[] {
	return [...entries].sort((a, b) => b.data.created.getTime() - a.data.created.getTime());
}

export function filterArticlesByTopic<T extends TopicEntry>(entries: readonly T[], topicId: string): T[] {
	return entries.filter((entry) => entry.data.topic.id === topicId);
}

export async function getPublishedArticles() {
	const articles = await getCollection('articles');

	return sortArticlesNewestFirst(filterPublished(articles));
}

export async function getPublishedTopics() {
	const topics = filterPublished(await getCollection('topics'));

	return [...topics].sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'pl'));
}
