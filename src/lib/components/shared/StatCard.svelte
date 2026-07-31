<script lang="ts">
	import type { Snippet } from 'svelte';
	import { countUp } from '$lib/motion/count-up.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { formatNumber } from '$lib/utils/format';

	let {
		value,
		suffix = '',
		label,
		hint,
		live = false,
		delay = 0,
		icon
	}: {
		value: number;
		suffix?: string;
		label: string;
		hint?: string;
		live?: boolean;
		delay?: number;
		icon?: Snippet;
	} = $props();

	const counter = countUp(() => value);
</script>

<div
	class="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
	use:reveal={{ delay }}
	use:counter.start
>
	<div
		class="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-primary/8 blur-2xl transition-opacity duration-300 group-hover:bg-primary/15"
	></div>
	<div class="flex items-center justify-between">
		<span class="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
			{#if icon}{@render icon()}{/if}
		</span>
		{#if live}
			<span class="relative flex size-2" title="Live value from GitHub API">
				<span
					class="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-success opacity-75"
				></span>
				<span class="relative inline-flex size-2 rounded-full bg-success"></span>
			</span>
		{/if}
	</div>
	<p class="mt-3 font-display text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
		{formatNumber(counter.current)}{suffix}
	</p>
	<p class="mt-1 text-xs font-medium text-foreground">{label}</p>
	{#if hint}
		<p class="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
	{/if}
</div>
