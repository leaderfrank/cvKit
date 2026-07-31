<script lang="ts">
	import { onMount } from 'svelte';
	import ApiCard from '$lib/components/shared/ApiCard.svelte';
	import { devQuotes, pickQuoteIndex } from '$lib/apis/quotes';
	import Quote from '@lucide/svelte/icons/quote';
	import Database from '@lucide/svelte/icons/database';

	// No network by design: quotes are bundled locally. We still follow the
	// same load/refresh pattern so the card behaves like its API-driven peers.
	let index = $state(-1);
	let quote = $derived(index >= 0 ? devQuotes[index] : null);
	let loading = $state(true);

	function load() {
		index = pickQuoteIndex(index);
	}

	onMount(() => {
		index = pickQuoteIndex(index);
		loading = false;
	});
</script>

<ApiCard
	title="Dev wisdom"
	source="local bundle"
	{loading}
	error={null}
	meta={null}
	onRetry={load}
	loadingLabel="Picking a quote…"
	class="h-full"
>
	{#snippet icon()}<Quote class="size-4" />{/snippet}
	{#if quote}
		<figure class="flex h-full flex-col">
			<Quote class="size-7 text-primary/25" />
			<blockquote class="mt-2 text-sm leading-relaxed italic">{quote.text}</blockquote>
			<figcaption class="mt-2 flex h-full flex-col">
				<span class="font-mono text-xs text-muted-foreground">
					— {quote.author}{#if quote.context}&nbsp;· {quote.context}{/if}
				</span>
				<span
					class="mt-auto inline-flex items-center gap-1.5 pt-3 font-mono text-[10px] text-muted-foreground"
				>
					<Database class="size-3" />bundled · zero network · works offline
				</span>
			</figcaption>
		</figure>
	{/if}
</ApiCard>
