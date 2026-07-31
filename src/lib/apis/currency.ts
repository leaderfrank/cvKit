/**
 * Frankfurter currency API — USD/SAR spot + 7-day comparison.
 *
 * Endpoint reality (verified): the legacy frankfurter.app base and the frozen
 * v1 routes (`/v1/latest`, `/v1/{date}`) now return 404. The live API is v2:
 *   GET https://api.frankfurter.dev/v2/rate/USD/SAR            -> latest
 *   GET https://api.frankfurter.dev/v2/rate/USD/SAR?date=...   -> historical
 * Response shape: { date, base, quote, rate } — rates are blended across
 * central-bank feeds (ECB does not publish USD/SAR directly).
 */

import { apiFetch, type ApiMeta, type ApiResult } from '$lib/api/client';

export interface FrankfurterRate {
	date: string;
	base: string;
	quote: string;
	rate: number;
}

export interface UsdSarRate {
	base: string;
	quote: string;
	rate: number;
	inverseRate: number;
	date: string;
	previousRate: number;
	previousDate: string;
	/** Percentage change vs. 7 days ago. */
	deltaPct: number;
}

const PAIR_URL = 'https://api.frankfurter.dev/v2/rate/USD/SAR';
const TTL = 30 * 60 * 1000; // 30 min

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

export async function getUsdSarRate(force = false): Promise<ApiResult<UsdSarRate>> {
	const previousDate = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

	const [latestRes, previousRes] = await Promise.all([
		apiFetch<FrankfurterRate>(PAIR_URL, { ttl: TTL, force, cacheKey: 'fx:usd-sar:latest' }),
		apiFetch<FrankfurterRate>(`${PAIR_URL}?date=${previousDate}`, {
			ttl: TTL,
			force,
			cacheKey: `fx:usd-sar:${previousDate}`
		})
	]);

	if (!latestRes.ok) return latestRes;
	if (!previousRes.ok) return previousRes;

	const rate = latestRes.data?.rate;
	const previousRate = previousRes.data?.rate;
	const valid =
		typeof rate === 'number' &&
		Number.isFinite(rate) &&
		rate > 0 &&
		typeof previousRate === 'number' &&
		Number.isFinite(previousRate) &&
		previousRate > 0;

	if (!valid) {
		return {
			ok: false,
			error: 'Malformed rate payload',
			status: latestRes.meta.status,
			meta: mergeMetas([latestRes.meta, previousRes.meta])
		};
	}

	return {
		ok: true,
		data: {
			base: latestRes.data.base ?? 'USD',
			quote: latestRes.data.quote ?? 'SAR',
			rate,
			inverseRate: 1 / rate,
			date: latestRes.data.date ?? '',
			previousRate,
			previousDate: previousRes.data.date ?? previousDate,
			deltaPct: ((rate - previousRate) / previousRate) * 100
		},
		meta: mergeMetas([latestRes.meta, previousRes.meta])
	};
}
