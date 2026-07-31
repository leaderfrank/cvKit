<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';
	import { reveal } from '$lib/actions/reveal';

	let {
		id,
		eyebrow,
		title,
		description,
		class: className,
		header,
		children
	}: {
		id: string;
		eyebrow: string;
		title: string;
		description?: string;
		class?: string;
		header?: Snippet;
		children: Snippet;
	} = $props();
</script>

<section {id} class={cn('scroll-mt-20 py-20 sm:py-24', className)}>
	<div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
		<div class="mb-12 max-w-2xl" use:reveal>
			<p class="mb-3 font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
				{eyebrow}
			</p>
			<h2 class="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
				{title}
			</h2>
			{#if description}
				<p class="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
			{/if}
			{@render header?.()}
		</div>
		{@render children()}
	</div>
</section>
