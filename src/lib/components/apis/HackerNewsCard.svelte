<script lang="ts">
	import { onMount } from 'svelte';
	import ApiCard from '$lib/components/shared/ApiCard.svelte';
	import { getTopStories, type HnStory } from '$lib/apis/hackernews';
	import type { ApiMeta } from '$lib/api/client';
	import { formatNumber, timeAgo } from '$lib/utils/format';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import MessageCircle from '@lucide/svelte/icons/message-circle';

	let data = $state<HnStory[] | null>(null);
	let meta = $state<ApiMeta | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	async function load(force = false) {
		loading = true;
		error = null;
		const res = await getTopStories(force);
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
	title="Hacker News — top 5"
	source="firebaseio.com/v0"
	sourceUrl="https://news.ycombinator.com"
	{loading}
	{error}
	{meta}
	onRetry={load}
	loadingLabel="Fetching top stories…"
	class="h-full"
>
	{#snippet icon()}<Newspaper class="size-4" />{/snippet}
	{#if data}
		<ol class="flex flex-col gap-3">
			{#each data as story (story.id)}
				<li class="flex gap-2.5">
					<span class="w-4 shrink-0 pt-px font-mono text-xs text-muted-foreground"
						>{story.rank}</span
					>
					<div class="min-w-0">
						<a
							href={story.url ?? `https://news.ycombinator.com/item?id=${story.id}`}
							target="_blank"
							rel="noopener noreferrer"
							class="line-clamp-2 text-xs leading-snug font-medium transition-colors hover:text-primary"
							>{story.title}</a
						>
						<div
							class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted-foreground"
						>
							<span class="inline-flex items-center gap-0.5"
								><ArrowUpRight class="size-3 text-success" />{formatNumber(story.score)}</span
							>
							<span class="inline-flex items-center gap-0.5"
								><MessageCircle class="size-3" />{formatNumber(story.comments)}</span
							>
							{#if story.domain}
								<span class="rounded bg-muted px-1.5 py-px">{story.domain}</span>
							{/if}
							{#if story.timeMs}
								<span>{timeAgo(story.timeMs)}</span>
							{/if}
						</div>
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</ApiCard>
