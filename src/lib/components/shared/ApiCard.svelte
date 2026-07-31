<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ApiMeta } from '$lib/api/client';
	import { cn } from '$lib/utils.js';
	import { formatTime } from '$lib/utils/format';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import Wifi from '@lucide/svelte/icons/wifi';
	import WifiOff from '@lucide/svelte/icons/wifi-off';
	import Database from '@lucide/svelte/icons/database';
	import Clock from '@lucide/svelte/icons/clock';

	let {
		title,
		source,
		sourceUrl,
		loading = false,
		error = null,
		meta = null,
		onRetry,
		loadingLabel = 'Fetching live data…',
		icon,
		children,
		class: className
	}: {
		title: string;
		source: string;
		sourceUrl?: string;
		loading?: boolean;
		error?: string | null;
		meta?: ApiMeta | null;
		onRetry?: () => void;
		loadingLabel?: string;
		icon?: Snippet;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<article
	class={cn(
		'flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs transition-shadow duration-300 hover:shadow-md',
		className
	)}
>
	<header class="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
		<div class="flex items-center gap-2.5">
			{#if icon}
				<span class="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
					{@render icon()}
				</span>
			{/if}
			<h3 class="font-display text-sm font-semibold">{title}</h3>
			{#if sourceUrl}
				<a
					href={sourceUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="hidden rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
					>{source}</a
				>
			{:else}
				<span
					class="hidden rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block"
					>{source}</span
				>
			{/if}
		</div>
		{#if onRetry}
			<button
				type="button"
				onclick={onRetry}
				disabled={loading}
				aria-label="Refresh {title}"
				class="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
			>
				<RefreshCw class={cn('size-3.5', loading && 'animate-spin')} />
			</button>
		{/if}
	</header>

	<div class="min-h-[9rem] grow px-4 py-4">
		{#if loading}
			<div class="flex h-full flex-col justify-center gap-3" aria-busy="true" aria-live="polite">
				<div class="h-3.5 w-3/4 animate-pulse rounded-md bg-muted"></div>
				<div class="h-3.5 w-1/2 animate-pulse rounded-md bg-muted"></div>
				<div class="h-3.5 w-5/6 animate-pulse rounded-md bg-muted"></div>
				<p class="mt-1 font-mono text-[11px] text-muted-foreground">{loadingLabel}</p>
			</div>
		{:else if error}
			<div class="flex h-full flex-col items-start justify-center gap-3" role="alert">
				<div class="flex items-center gap-2 text-sm text-destructive">
					<WifiOff class="size-4" />
					<p class="font-medium">Couldn't load {title.toLowerCase()}</p>
				</div>
				<p class="font-mono text-[11px] text-muted-foreground">{error}</p>
				{#if onRetry}
					<button
						type="button"
						onclick={onRetry}
						class="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
					>
						Try again
					</button>
				{/if}
			</div>
		{:else}
			{@render children()}
		{/if}
	</div>

	{#if meta && !error}
		<footer
			class="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 bg-muted/40 px-4 py-2 font-mono text-[10px] text-muted-foreground"
		>
			<span class="inline-flex items-center gap-1" title="Network latency">
				<Clock class="size-3" />{meta.durationMs}ms
			</span>
			{#if meta.fromCache}
				<span
					class={cn(
						'inline-flex items-center gap-1',
						meta.cacheState === 'stale-fallback' && 'text-warning'
					)}
					title="Served from cache"
				>
					<Database class="size-3" />{meta.cacheState === 'stale-fallback'
						? 'stale cache'
						: 'cached'}
				</span>
			{:else}
				<span class="inline-flex items-center gap-1 text-success" title="Fresh from network">
					<Wifi class="size-3" />live
				</span>
			{/if}
			<span class="ml-auto" title="Last updated">{formatTime(meta.updatedAt)}</span>
		</footer>
	{/if}
</article>
