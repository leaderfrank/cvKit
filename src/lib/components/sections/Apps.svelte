<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { playApps, profile } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Play from '@lucide/svelte/icons/play';
</script>

<Section
	id="apps"
	eyebrow="// published apps"
	title="Nine apps on Google Play."
	description="Everything I've designed, built and shipped under the Koprey developer account — builds, signing, store listings and review, all owned end to end."
	class="border-y border-border/60 bg-muted/30"
>
	<header class="mb-8 flex flex-wrap items-center justify-between gap-4" use:reveal>
		<p class="inline-flex items-center gap-2 text-sm text-muted-foreground">
			<span class="grid size-8 place-items-center rounded-lg bg-success/15 text-success">
				<Play class="size-4" />
			</span>
			<span>
				<span class="font-semibold text-foreground">{playApps.length} of {playApps.length}</span>
				apps listed — verified against the live store page
			</span>
		</p>
		<a
			href={profile.playStore}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
		>
			Google Play developer page <ArrowUpRight class="size-3.5" />
		</a>
	</header>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each playApps as app, i (app.packageId)}
			<a
				href={app.link}
				target="_blank"
				rel="noopener noreferrer"
				class="group flex flex-col rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
				use:reveal={{ delay: (i % 3) * 70 }}
			>
				<div class="flex items-start gap-3.5">
					<img
						src={app.icon}
						alt="{app.name} app icon"
						width="56"
						height="56"
						loading="lazy"
						decoding="async"
						class="size-14 shrink-0 rounded-xl border border-border/50 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
					/>
					<div class="min-w-0">
						<h3 class="font-display text-sm leading-snug font-semibold" dir="auto">{app.name}</h3>
						{#if app.subtitle}
							<p class="mt-0.5 text-xs text-muted-foreground">{app.subtitle}</p>
						{/if}
						<Badge variant="secondary" class="mt-2 font-mono text-[10px]">{app.category}</Badge>
					</div>
				</div>

				<p class="mt-4 grow text-sm leading-relaxed text-muted-foreground">{app.description}</p>

				<span
					class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100"
				>
					View on Google Play <ArrowUpRight class="size-3" />
				</span>
			</a>
		{/each}
	</div>
</Section>
