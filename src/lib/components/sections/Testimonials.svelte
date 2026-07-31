<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { testimonials } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import Quote from '@lucide/svelte/icons/quote';
</script>

<Section
	id="testimonials"
	eyebrow="// what people say"
	title="Trusted with production."
	description="Content below is placeholder-ready — swap in real references with a single data edit."
>
	<div class="grid grid-cols-1 gap-5 md:grid-cols-3">
		{#each testimonials as item, i (item.role)}
			<figure
				class="flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
				use:reveal={{ delay: i * 90 }}
			>
				<Quote class="size-6 text-primary/60" />
				<blockquote class="mt-4 grow text-sm leading-relaxed text-foreground">
					"{item.quote}"
				</blockquote>
				<figcaption class="mt-5 border-t border-border/60 pt-4">
					<p class="font-display text-sm font-semibold">{item.name}</p>
					<p class="mt-0.5 text-xs text-muted-foreground">{item.role}</p>
					{#if item.placeholder}
						<p class="mt-2 font-mono text-[10px] text-muted-foreground/70">
							// sample copy — replace via $lib/data/portfolio.ts
						</p>
					{/if}
				</figcaption>
			</figure>
		{/each}
	</div>
</Section>
