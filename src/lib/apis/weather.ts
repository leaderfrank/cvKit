/**
 * Open-Meteo forecast API for Jeddah (no key required).
 * Endpoint reality: `/v0/forecast` 404s — `/v1/forecast` is the live route.
 */

import type { Component } from 'svelte';
import { apiFetch, type ApiResult } from '$lib/api/client';
import Sun from '@lucide/svelte/icons/sun';
import Moon from '@lucide/svelte/icons/moon';
import CloudSun from '@lucide/svelte/icons/cloud-sun';
import CloudMoon from '@lucide/svelte/icons/cloud-moon';
import Cloud from '@lucide/svelte/icons/cloud';
import CloudFog from '@lucide/svelte/icons/cloud-fog';
import CloudDrizzle from '@lucide/svelte/icons/cloud-drizzle';
import CloudRain from '@lucide/svelte/icons/cloud-rain';
import CloudSnow from '@lucide/svelte/icons/cloud-snow';
import CloudLightning from '@lucide/svelte/icons/cloud-lightning';

/** Raw Open-Meteo response (fields we care about, all defensive). */
export interface OpenMeteoResponse {
	timezone?: string;
	current?: {
		time?: string; // local ISO without offset, e.g. "2026-07-31T18:15"
		interval?: number;
		temperature_2m?: number;
		relative_humidity_2m?: number;
		apparent_temperature?: number;
		weather_code?: number; // WMO
		wind_speed_10m?: number;
		is_day?: 0 | 1;
	};
}

export interface WeatherCondition {
	label: string;
	icon: Component;
}

export interface JeddahWeather {
	temperature: number;
	apparentTemperature: number;
	humidity: number;
	windSpeed: number;
	weatherCode: number;
	isDay: boolean;
	condition: WeatherCondition;
	localTime: string; // "HH:MM"
	timezone: string;
}

const URL =
	'https://api.open-meteo.com/v1/forecast?latitude=21.4858&longitude=39.1925' +
	'&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day' +
	'&timezone=Asia%2FRiyadh';
const TTL = 10 * 60 * 1000; // 10 min

/** WMO weather-code → label + lucide icon. */
export function describeWeatherCode(code: number, isDay: boolean): WeatherCondition {
	if (code === 0) return { label: isDay ? 'Clear sky' : 'Clear night', icon: isDay ? Sun : Moon };
	if (code === 1) return { label: 'Mostly clear', icon: isDay ? Sun : Moon };
	if (code === 2) return { label: 'Partly cloudy', icon: isDay ? CloudSun : CloudMoon };
	if (code === 3) return { label: 'Overcast', icon: Cloud };
	if (code === 45) return { label: 'Fog', icon: CloudFog };
	if (code === 48) return { label: 'Icy fog', icon: CloudFog };
	if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: CloudDrizzle };
	if (code >= 61 && code <= 67) return { label: 'Rain', icon: CloudRain };
	if (code >= 71 && code <= 77) return { label: 'Snow', icon: CloudSnow };
	if (code === 80 || code === 81) return { label: 'Rain showers', icon: CloudDrizzle };
	if (code === 82) return { label: 'Heavy showers', icon: CloudRain };
	if (code === 85 || code === 86) return { label: 'Snow showers', icon: CloudSnow };
	if (code >= 95 && code <= 99) return { label: 'Thunderstorm', icon: CloudLightning };
	return { label: 'Unknown', icon: isDay ? CloudSun : CloudMoon };
}

export async function getJeddahWeather(force = false): Promise<ApiResult<JeddahWeather>> {
	const res = await apiFetch<OpenMeteoResponse>(URL, {
		ttl: TTL,
		force,
		cacheKey: 'weather:jeddah'
	});
	if (!res.ok) return res;

	const current = res.data?.current;
	const temperature = current?.temperature_2m;
	if (!current || typeof temperature !== 'number') {
		return {
			ok: false,
			error: 'Malformed weather payload',
			status: res.meta.status,
			meta: res.meta
		};
	}

	const isDay = current.is_day !== 0;
	const weatherCode = typeof current.weather_code === 'number' ? current.weather_code : 0;

	return {
		ok: true,
		data: {
			temperature,
			apparentTemperature: current.apparent_temperature ?? temperature,
			humidity: current.relative_humidity_2m ?? 0,
			windSpeed: current.wind_speed_10m ?? 0,
			weatherCode,
			isDay,
			condition: describeWeatherCode(weatherCode, isDay),
			localTime: typeof current.time === 'string' ? current.time.slice(11, 16) : '',
			timezone: res.data?.timezone ?? 'Asia/Riyadh'
		},
		meta: res.meta
	};
}
