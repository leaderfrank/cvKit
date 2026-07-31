<script lang="ts">
	import { onMount } from 'svelte';
	import ApiCard from '$lib/components/shared/ApiCard.svelte';
	import { getJeddahWeather, type JeddahWeather } from '$lib/apis/weather';
	import type { ApiMeta } from '$lib/api/client';
	import { profile } from '$lib/data/portfolio';
	import CloudSun from '@lucide/svelte/icons/cloud-sun';
	import Thermometer from '@lucide/svelte/icons/thermometer';
	import Droplets from '@lucide/svelte/icons/droplets';
	import Wind from '@lucide/svelte/icons/wind';
	import MapPin from '@lucide/svelte/icons/map-pin';

	let data = $state<JeddahWeather | null>(null);
	let meta = $state<ApiMeta | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	async function load(force = false) {
		loading = true;
		error = null;
		const res = await getJeddahWeather(force);
		if (res.ok) {
			data = res.data;
			meta = res.meta;
		} else {
			error = res.error;
		}
		loading = false;
	}

	onMount(() => {
		void load();
	});
</script>

<ApiCard
	title="Weather — Jeddah"
	source="open-meteo.com"
	sourceUrl="https://open-meteo.com"
	{loading}
	{error}
	{meta}
	onRetry={load}
	loadingLabel="Reading the sky over Jeddah…"
	class="h-full"
>
	{#snippet icon()}<CloudSun class="size-4" />{/snippet}
	{#if data}
		{@const ConditionIcon = data.condition.icon}
		<div class="flex h-full flex-col">
			<div class="flex items-center gap-4">
				<ConditionIcon class="size-10 shrink-0 text-primary" />
				<div>
					<p class="font-display text-4xl font-bold tracking-tight">
						{Math.round(data.temperature)}<span class="text-2xl">°C</span>
					</p>
					<p class="text-xs text-muted-foreground">
						{data.condition.label} · {data.isDay ? 'daytime' : 'night'}
					</p>
				</div>
			</div>

			<div class="mt-4 grid grid-cols-3 gap-2">
				<div class="rounded-lg border border-border/60 px-2.5 py-2">
					<p
						class="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase"
					>
						<Thermometer class="size-3" />Feels like
					</p>
					<p class="mt-0.5 font-mono text-sm font-semibold">
						{Math.round(data.apparentTemperature)}°C
					</p>
				</div>
				<div class="rounded-lg border border-border/60 px-2.5 py-2">
					<p
						class="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase"
					>
						<Droplets class="size-3" />Humidity
					</p>
					<p class="mt-0.5 font-mono text-sm font-semibold">{data.humidity}%</p>
				</div>
				<div class="rounded-lg border border-border/60 px-2.5 py-2">
					<p
						class="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase"
					>
						<Wind class="size-3" />Wind
					</p>
					<p class="mt-0.5 font-mono text-sm font-semibold">
						{data.windSpeed.toFixed(1)} <span class="text-[10px] font-normal">km/h</span>
					</p>
				</div>
			</div>

			<p
				class="mt-auto inline-flex items-center gap-1.5 pt-3 font-mono text-[10px] text-muted-foreground"
			>
				<MapPin class="size-3" />{profile.location}{#if data.localTime}&nbsp;· local time {data.localTime}{/if}
			</p>
		</div>
	{/if}
</ApiCard>
