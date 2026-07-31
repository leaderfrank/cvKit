<script lang="ts">
	import { onMount } from 'svelte';
	import ApiCard from '$lib/components/shared/ApiCard.svelte';
	import { getUsdSarRate, type UsdSarRate } from '$lib/apis/currency';
	import type { ApiMeta } from '$lib/api/client';
	import { cn } from '$lib/utils.js';
	import Banknote from '@lucide/svelte/icons/banknote';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import TrendingDown from '@lucide/svelte/icons/trending-down';

	let data = $state<UsdSarRate | null>(null);
	let meta = $state<ApiMeta | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	async function load(force = false) {
		loading = true;
		error = null;
		const res = await getUsdSarRate(force);
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
	title="USD → SAR"
	source="frankfurter.dev/v2"
	sourceUrl="https://frankfurter.dev"
	{loading}
	{error}
	{meta}
	onRetry={load}
	loadingLabel="Converting dollars to riyals…"
	class="h-full"
>
	{#snippet icon()}<Banknote class="size-4" />{/snippet}
	{#if data}
		<div class="flex h-full flex-col">
			<p class="text-[11px] text-muted-foreground">1 {data.base} equals</p>
			<p class="mt-0.5 font-mono text-3xl font-bold tracking-tight">
				{data.rate.toFixed(4)}
				<span class="text-base font-medium text-muted-foreground">{data.quote}</span>
			</p>

			<div class="mt-2.5 flex flex-wrap items-center gap-2">
				<span
					class={cn(
						'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium',
						data.deltaPct >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
					)}
				>
					{#if data.deltaPct >= 0}<TrendingUp class="size-3" />{:else}<TrendingDown
							class="size-3"
						/>{/if}
					{data.deltaPct >= 0 ? '+' : ''}{data.deltaPct.toFixed(2)}%
				</span>
				<span class="font-mono text-[10px] text-muted-foreground">
					vs {data.previousDate} · {data.previousRate.toFixed(4)}
				</span>
			</div>

			<p class="mt-3 font-mono text-[11px] text-muted-foreground">
				1 {data.quote} ≈ {data.inverseRate.toFixed(4)}
				{data.base}
			</p>
			<p class="mt-auto pt-2 text-[10px] text-muted-foreground/80">
				References: central-bank feeds blended daily{#if data.date}&nbsp;· as of {data.date}{/if}
			</p>
		</div>
	{/if}
</ApiCard>
