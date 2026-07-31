/** dev.to Forem public API — top articles from the last 3 days. */

import { apiFetch, type ApiResult } from '$lib/api/client';

export interface DevToArticle {
	id: number;
	title: string;
	url: string;
	tag_list?: string[];
	published_at?: string;
	positive_reactions_count?: number;
	public_reactions_count?: number;
	comments_count?: number;
	reading_time_minutes?: number;
	user?: { name?: string; username?: string };
}

export interface DevToStory {
	id: number;
	title: string;
	url: string;
	tags: string[];
	reactions: number;
	comments: number;
	readingTime: number | null;
	author: string;
	publishedAt: string;
}

const URL = 'https://dev.to/api/articles?top=3&per_page=4';
const TTL = 10 * 60 * 1000; // 10 min

export async function getTopArticles(force = false): Promise<ApiResult<DevToStory[]>> {
	const res = await apiFetch<DevToArticle[]>(URL, { ttl: TTL, force, cacheKey: 'devto:top' });
	if (!res.ok) return res;

	const articles = Array.isArray(res.data) ? res.data : [];
	const stories: DevToStory[] = articles
		.filter((a) => a && typeof a.title === 'string' && typeof a.url === 'string')
		.map((a) => ({
			id: a.id,
			title: a.title,
			url: a.url,
			tags: Array.isArray(a.tag_list) ? a.tag_list.filter((t) => typeof t === 'string') : [],
			reactions: a.positive_reactions_count ?? a.public_reactions_count ?? 0,
			comments: a.comments_count ?? 0,
			readingTime: typeof a.reading_time_minutes === 'number' ? a.reading_time_minutes : null,
			author: a.user?.name ?? a.user?.username ?? '',
			publishedAt: a.published_at ?? ''
		}));

	return { ok: true, data: stories, meta: res.meta };
}
