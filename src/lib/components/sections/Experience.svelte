<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { experience } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Building2 from '@lucide/svelte/icons/building-2';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Award from '@lucide/svelte/icons/award';
</script>

<Section
	id="experience"
	eyebrow="// career timeline"
	title="Where I've shipped."
	description="Three chapters so far — each one ending with measurably better systems than I found."
	class="border-y border-border/60 bg-muted/30"
>
	<div class="relative mx-auto max-w-3xl">
		<!-- timeline spine -->
		<div
			class="absolute top-0 bottom-0 left-[19px] w-px bg-linear-to-b from-primary via-border to-transparent sm:left-1/2"
			aria-hidden="true"
		></div>

		<ol class="space-y-10">
			{#each experience as job, i (job.company)}
				{@const left = i % 2 === 0}
				<li class="relative" use:reveal={{ delay: 60 }}>
					<!-- node marker -->
					<span
						class={cn(
							'absolute top-6 left-[11px] z-10 grid size-4.5 place-items-center rounded-full border-2 border-primary bg-background sm:left-1/2 sm:-translate-x-1/2',
							job.current && 'border-success'
						)}
						aria-hidden="true"
					>
						{#if job.current}
							<span class="size-1.5 animate-pulse rounded-full bg-success"></span>
						{/if}
					</span>

					<div
						class={cn('ml-12 sm:ml-0 sm:w-[calc(50%-2.5rem)]', left ? 'sm:mr-auto' : 'sm:ml-auto')}
					>
						<article
							class="rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
						>
							<div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
								<span class="font-mono text-xs text-primary">{job.period}</span>
								{#if job.current}
									<Badge class="bg-success/15 text-success hover:bg-success/15">Current</Badge>
								{/if}
							</div>

							<h3 class="mt-2 font-display text-lg font-bold">{job.role}</h3>
							<p
								class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground"
							>
								<span class="inline-flex items-center gap-1"
									><Building2 class="size-3.5" />{job.company}</span
								>
								<span class="inline-flex items-center gap-1"
									><MapPin class="size-3.5" />{job.location}</span
								>
							</p>

							<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>

							<ul class="mt-4 space-y-2.5">
								{#each job.highlights as highlight (highlight.title)}
									<li class="flex gap-2.5 text-sm">
										<Award class="mt-0.5 size-3.5 shrink-0 text-primary" />
										<span
											><span class="font-medium">{highlight.title}:</span>
											<span class="text-muted-foreground">{highlight.detail}</span></span
										>
									</li>
								{/each}
							</ul>

							<div class="mt-4 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
								{#each job.stack as tech (tech)}
									<Badge variant="secondary" class="font-mono text-[10px]">{tech}</Badge>
								{/each}
							</div>
						</article>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</Section>
