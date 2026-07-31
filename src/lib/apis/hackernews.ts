/**
 * Hacker News via the official Firebase-backed public API.
 * Top-story ids are fetched once; each item is fetched (and cached) individually.
 */

import { apiFetch, type ApiMeta, type ApiResult } from '$lib/api/client';

export interface HnItem {
	id: number;
	type?: string;
	by?: string;
	time?: number; // unix seconds
	title?: string;
	url?: string;
	score?: number;
	descendants?: number;
	deleted?: boolean;
	dead?: boolean;
}

export interface HnStory {
	id: number;
	rank: number;
	title: string;
	url: string | null;
	domain: string | null;
	score: number;
	comments: number;
	by: string;
	timeMs: number;
}

const BASE = 'https://hacker-news.firebaseio.com/v0';
const TTL = 3 * 60 * 1000; // 3 min
const STORY_COUNT = 5;

function domainOf(url: string | undefined): string | null {
	if (!url) return null;
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return null;
	}
}

function mergeMetas(metas: ApiMeta[]): ApiMeta {
	const slowest = metas.reduce((a, b) => (b.durationMs > a.durationMs ? b : a));
	const anyNetwork = metas.some((m) => m.cacheState === 'network');
	const anyStale = metas.some((m) => m.cacheState === 'stale-fallback');
	return {
		...slowest,
		fromCache: !anyNetwork,
		cacheState: anyNetwork ? 'network' : anyStale ? 'stale-fallback' : 'fresh',
		updatedAt: Math.max(...metas.map((m) => m.updatedAt)),
		attempts: metas.reduce((sum, m) => sum + m.attempts, 0)
	};
}

export async function getTopStories(force = false): Promise<ApiResult<HnStory[]>> {
	const listRes = await apiFetch<number[]>(`${BASE}/topstories.json`, {
		ttl: TTL,
		force,
		cacheKey: 'hn:topstories'
	});
	if (!listRes.ok) return listRes;

	const ids = (Array.isArray(listRes.data) ? listRes.data : []).slice(0, STORY_COUNT);
	const itemResults = await Promise.all(
		ids.map((id) =>
			apiFetch<HnItem>(`${BASE}/item/${id}.json`, { ttl: TTL, force, cacheKey: `hn:item:${id}` })
		)
	);

	const stories: HnStory[] = [];
	for (const [index, res] of itemResults.entries()) {
		if (!res.ok) continue; // a single flaky item shouldn't sink the widget
		const item = res.data;
		if (!item || item.deleted || item.dead || typeof item.title !== 'string') continue;
		const url = typeof item.url === 'string' ? item.url : null;
		stories.push({
			id: item.id,
			rank: index + 1,
			title: item.title,
			url,
			domain: domainOf(url ?? undefined),
			score: item.score ?? 0,
			comments: item.descendants ?? 0,
			by: item.by ?? 'unknown',
			timeMs: (item.time ?? 0) * 1000
		});
	}

	if (stories.length === 0) {
		const firstFailure = itemResults.find((r) => !r.ok);
		if (firstFailure && !firstFailure.ok) return firstFailure;
	}

	const metas = [listRes.meta, ...itemResults.map((r) => r.meta)];
	return { ok: true, data: stories, meta: mergeMetas(metas) };
}
