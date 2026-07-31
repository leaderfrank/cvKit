<script lang="ts">
	import { onMount } from 'svelte';
	import ApiCard from '$lib/components/shared/ApiCard.svelte';
	import { getProgrammingJoke, type ProgrammingJoke } from '$lib/apis/jokeapi';
	import type { ApiMeta } from '$lib/api/client';
	import { cn } from '$lib/utils.js';
	import Laugh from '@lucide/svelte/icons/laugh';

	let data = $state<ProgrammingJoke | null>(null);
	let meta = $state<ApiMeta | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);
	let showPunchline = $state(false);

	async function load(force = false) {
		loading = true;
		error = null;
		const res = await getProgrammingJoke(force);
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

	// Two-part jokes: reveal the delivery with a small delay. Keyed on the
	// setup text so every new joke re-hides the punchline; timer is cleaned
	// up when the joke changes or the component unmounts.
	$effect(() => {
		const setup = data?.kind === 'twopart' ? data.setup : null;
		if (!setup) return;
		showPunchline = false;
		const timer = setTimeout(() => {
			showPunchline = true;
		}, 500);
		return () => clearTimeout(timer);
	});
</script>

<ApiCard
	title="Programming humor"
	source="v2.jokeapi.dev"
	sourceUrl="https://jokeapi.dev"
	{loading}
	{error}
	{meta}
	onRetry={() => load(true)}
	loadingLabel="Summoning a fresh joke…"
	class="h-full"
>
	{#snippet icon()}<Laugh class="size-4" />{/snippet}
	{#if data}
		<div class="flex h-full flex-col gap-2.5">
			<span
				class="w-fit rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
				>{data.category}</span
			>
			{#if data.kind === 'single'}
				<p class="text-sm leading-relaxed">{data.text}</p>
			{:else}
				<p class="text-sm leading-relaxed">{data.setup}</p>
				<p
					class={cn(
						'text-sm leading-relaxed text-muted-foreground transition-opacity duration-500',
						showPunchline ? 'opacity-100' : 'opacity-0'
					)}
				>
					{data.delivery}
				</p>
			{/if}
		</div>
	{/if}
</ApiCard>
