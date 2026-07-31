/**
 * JokeAPI v2 — safe-mode programming jokes.
 * No caching is desired here (every refresh should land a new joke), so the
 * call goes through apiFetch with ttl 0; the stale-fallback path still covers
 * a failed refresh gracefully.
 */

import { apiFetch, type ApiResult } from '$lib/api/client';

export interface JokeApiResponse {
	error: boolean;
	category?: string;
	type?: 'single' | 'twopart';
	joke?: string;
	setup?: string;
	delivery?: string;
	safe?: boolean;
	lang?: string;
}

export type ProgrammingJoke =
	| { kind: 'single'; text: string; category: string }
	| { kind: 'twopart'; setup: string; delivery: string; category: string };

const URL =
	'https://v2.jokeapi.dev/joke/Programming' +
	'?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=any';

export async function getProgrammingJoke(force = false): Promise<ApiResult<ProgrammingJoke>> {
	const res = await apiFetch<JokeApiResponse>(URL, {
		ttl: 0,
		force,
		retries: 1,
		cacheKey: 'joke:programming'
	});
	if (!res.ok) return res;

	const j = res.data;
	if (!j || j.error === true) {
		return {
			ok: false,
			error: 'JokeAPI reported an error',
			status: res.meta.status,
			meta: res.meta
		};
	}

	if (j.type === 'twopart' && typeof j.setup === 'string' && typeof j.delivery === 'string') {
		return {
			ok: true,
			data: {
				kind: 'twopart',
				setup: j.setup,
				delivery: j.delivery,
				category: j.category ?? 'Programming'
			},
			meta: res.meta
		};
	}
	if (j.type === 'single' && typeof j.joke === 'string') {
		return {
			ok: true,
			data: { kind: 'single', text: j.joke, category: j.category ?? 'Programming' },
			meta: res.meta
		};
	}
	return { ok: false, error: 'Unexpected joke payload', status: res.meta.status, meta: res.meta };
}
