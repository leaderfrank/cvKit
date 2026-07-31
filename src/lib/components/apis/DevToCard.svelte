<script lang="ts">
	import { onMount } from 'svelte';
	import ApiCard from '$lib/components/shared/ApiCard.svelte';
	import { getTopArticles, type DevToStory } from '$lib/apis/devto';
	import type { ApiMeta } from '$lib/api/client';
	import { formatNumber, timeAgo } from '$lib/utils/format';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Heart from '@lucide/svelte/icons/heart';
	import MessageCircle from '@lucide/svelte/icons/message-circle';

	let data = $state<DevToStory[] | null>(null);
	let meta = $state<ApiMeta | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	async function load(force = false) {
		loading = true;
		error = null;
		const res = await getTopArticles(force);
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
	title="dev.to — this week's top"
	source="dev.to"
	sourceUrl="https://dev.to"
	{loading}
	{error}
	{meta}
	onRetry={load}
	loadingLabel="Fetching trending articles…"
	class="h-full"
>
	{#snippet icon()}<BookOpen class="size-4" />{/snippet}
	{#if data}
		<ul class="flex flex-col gap-3">
			{#each data as article (article.id)}
				<li class="flex flex-col gap-1">
					<a
						href={article.url}
						target="_blank"
						rel="noopener noreferrer"
						class="line-clamp-2 text-xs leading-snug font-medium transition-colors hover:text-primary"
						>{article.title}</a
					>
					{#if article.tags.length}
						<div class="flex flex-wrap gap-1">
							{#each article.tags.slice(0, 3) as tag (tag)}
								<span
									class="rounded-full border border-border/60 px-1.5 py-px font-mono text-[9px] text-muted-foreground"
									>#{tag}</span
								>
							{/each}
						</div>
					{/if}
					<div class="flex items-center gap-x-3 font-mono text-[10px] text-muted-foreground">
						<span class="inline-flex items-center gap-0.5"
							><Heart class="size-3 text-destructive" />{formatNumber(article.reactions)}</span
						>
						<span class="inline-flex items-center gap-0.5"
							><MessageCircle class="size-3" />{formatNumber(article.comments)}</span
						>
						{#if article.readingTime}
							<span>{article.readingTime} min read</span>
						{/if}
						{#if article.publishedAt}
							<span class="ml-auto">{timeAgo(article.publishedAt)}</span>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</ApiCard>
