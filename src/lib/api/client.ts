/**
 * Reusable API layer.
 *
 * Features demonstrated:
 * - Typed fetch wrapper with timeout (AbortController)
 * - Exponential-backoff retries for network errors / 429 / 5xx
 * - TTL cache: in-memory (session) + localStorage (persistent, survives reloads)
 * - Cache metadata surfaced to the UI (latency, cache hit, fresh/stale, updatedAt)
 * - Graceful error normalization (status, offline, timeout)
 */

export interface ApiMeta {
	durationMs: number;
	fromCache: boolean;
	cacheState: 'fresh' | 'stale-fallback' | 'network';
	updatedAt: number;
	status: number | null;
	attempts: number;
}

export interface ApiSuccess<T> {
	ok: true;
	data: T;
	meta: ApiMeta;
}

export interface ApiFailure {
	ok: false;
	error: string;
	status: number | null;
	meta: ApiMeta;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export interface FetchOptions {
	/** Cache time-to-live in ms. Defaults to 5 minutes. */
	ttl?: number;
	/** Override the cache key (defaults to the URL). */
	cacheKey?: string;
	/** Bypass a fresh cache entry and hit the network. */
	force?: boolean;
	/** Request timeout in ms. Default 10s. */
	timeoutMs?: number;
	/** Max retry attempts. Default 2. */
	retries?: number;
	init?: RequestInit;
}

const DEFAULT_TTL = 5 * 60 * 1000;
const memoryCache = new Map<string, { data: unknown; expiresAt: number; updatedAt: number }>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readStorage<T>(key: string): { data: T; updatedAt: number } | null {
	try {
		const raw = localStorage.getItem(`apix:${key}`);
		if (!raw) return null;
		return JSON.parse(raw) as { data: T; updatedAt: number };
	} catch {
		return null;
	}
}

function writeStorage(key: string, data: unknown, updatedAt: number) {
	try {
		localStorage.setItem(`apix:${key}`, JSON.stringify({ data, updatedAt }));
	} catch {
		/* storage full or unavailable — in-memory cache still works */
	}
}

function normalizeError(err: unknown): string {
	if (err instanceof DOMException && err.name === 'AbortError') return 'Request timed out';
	if (err instanceof TypeError && /fetch|network/i.test(err.message))
		return 'Network error — you may be offline';
	if (err instanceof Error) return err.message;
	return 'Unknown error';
}

/**
 * Fetch JSON with cache + retries. Never throws — returns a discriminated union.
 */
export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<ApiResult<T>> {
	const {
		ttl = DEFAULT_TTL,
		cacheKey = url,
		force = false,
		timeoutMs = 10_000,
		retries = 2,
		init
	} = options;

	const now = Date.now();
	const t0 = performance.now();

	// 1. Fresh in-memory cache
	const cached = memoryCache.get(cacheKey);
	if (!force && cached && cached.expiresAt > now) {
		return {
			ok: true,
			data: cached.data as T,
			meta: {
				durationMs: Math.round(performance.now() - t0),
				fromCache: true,
				cacheState: 'fresh',
				updatedAt: cached.updatedAt,
				status: 200,
				attempts: 0
			}
		};
	}

	// 2. Fresh localStorage cache
	if (!force && typeof localStorage !== 'undefined') {
		const stored = readStorage<T>(cacheKey);
		if (stored && stored.updatedAt + ttl > now) {
			memoryCache.set(cacheKey, {
				data: stored.data,
				expiresAt: stored.updatedAt + ttl,
				updatedAt: stored.updatedAt
			});
			return {
				ok: true,
				data: stored.data,
				meta: {
					durationMs: Math.round(performance.now() - t0),
					fromCache: true,
					cacheState: 'fresh',
					updatedAt: stored.updatedAt,
					status: 200,
					attempts: 0
				}
			};
		}
	}

	// 3. Network with retries
	let lastError = 'Unknown error';
	let status: number | null = null;

	for (let attempt = 0; attempt <= retries; attempt++) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		try {
			const response = await fetch(url, {
				...init,
				signal: controller.signal,
				headers: { Accept: 'application/json', ...init?.headers }
			});
			clearTimeout(timer);
			status = response.status;

			if (response.ok) {
				const data = (await response.json()) as T;
				const updatedAt = Date.now();
				memoryCache.set(cacheKey, { data, expiresAt: updatedAt + ttl, updatedAt });
				if (typeof localStorage !== 'undefined') writeStorage(cacheKey, data, updatedAt);
				return {
					ok: true,
					data,
					meta: {
						durationMs: Math.round(performance.now() - t0),
						fromCache: false,
						cacheState: 'network',
						updatedAt,
						status,
						attempts: attempt + 1
					}
				};
			}

			lastError = `HTTP ${response.status} — ${response.statusText || 'request failed'}`;
			// Retry only on rate-limit/server errors; 4xx is final.
			if (response.status !== 429 && response.status < 500) break;
		} catch (err) {
			clearTimeout(timer);
			lastError = normalizeError(err);
		}
		if (attempt < retries) await sleep(Math.min(500 * 2 ** attempt, 4000));
	}

	// 4. Stale cache as graceful fallback
	const stale = memoryCache.get(cacheKey);
	const staleStored =
		typeof localStorage !== 'undefined' ? readStorage<T>(cacheKey) : null;
	const fallbackData = (stale?.data ?? staleStored?.data) as T | undefined;
	if (fallbackData !== undefined) {
		return {
			ok: true,
			data: fallbackData,
			meta: {
				durationMs: Math.round(performance.now() - t0),
				fromCache: true,
				cacheState: 'stale-fallback',
				updatedAt: stale?.updatedAt ?? staleStored?.updatedAt ?? now,
				status,
				attempts: retries + 1
			}
		};
	}

	return {
		ok: false,
		error: lastError,
		status,
		meta: {
			durationMs: Math.round(performance.now() - t0),
			fromCache: false,
			cacheState: 'network',
			updatedAt: now,
			status,
			attempts: retries + 1
		}
	};
}

/** Demo helper: clear every cached API entry (used by the API playground). */
export function clearApiCache() {
	memoryCache.clear();
	if (typeof localStorage === 'undefined') return;
	const doomed: string[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith('apix:')) doomed.push(key);
	}
	doomed.forEach((k) => localStorage.removeItem(k));
}
