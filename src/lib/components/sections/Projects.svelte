<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { projects } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import FileText from '@lucide/svelte/icons/file-text';
	import GitBranch from '@lucide/svelte/icons/git-branch';
	import Globe from '@lucide/svelte/icons/globe';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';
	import Gauge from '@lucide/svelte/icons/gauge';

	const projectIcons = [FileText, GitBranch, Globe];

	const accentStyles: Record<string, string> = {
		violet: 'from-chart-1/90 to-primary',
		cyan: 'from-chart-2/90 to-chart-2/60',
		amber: 'from-chart-3/90 to-warning/70',
		emerald: 'from-chart-2/90 to-success/70'
	};
</script>

<Section
	id="projects"
	eyebrow="// featured work"
	title="Projects with production scars."
	description="Not tutorial clones — each of these solved a real problem for real users. Architecture, challenges and outcomes included."
>
	<div class="space-y-8">
		{#each projects as project, i (project.name)}
			{@const Icon = projectIcons[i]}
			<article
				class="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:shadow-lg"
				use:reveal
			>
				<div class="grid lg:grid-cols-[1fr_1.4fr]">
					<!-- Visual panel -->
					<div
						class={cn(
							'relative flex min-h-56 flex-col justify-between overflow-hidden bg-linear-to-br p-6 text-primary-foreground lg:min-h-full',
							accentStyles[project.accent]
						)}
					>
						<div class="absolute inset-0 bg-dots opacity-20"></div>
						<div class="relative flex items-start justify-between">
							<span class="grid size-11 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
								<Icon class="size-5.5 text-white" />
							</span>
							<span class="font-mono text-[10px] tracking-widest text-white/70 uppercase">
								{String(i + 1).padStart(2, '0')}
							</span>
						</div>
						<div class="relative">
							<h3 class="font-display text-2xl font-bold text-white">{project.name}</h3>
							<p class="mt-1 text-sm text-white/85">{project.tagline}</p>
							<div class="mt-4 flex flex-wrap gap-2">
								{#each project.metrics as metric (metric.label)}
									<div class="rounded-lg bg-black/20 px-2.5 py-1.5 backdrop-blur-sm">
										<span class="font-display text-sm font-bold text-white">{metric.value}</span>
										<span class="ml-1.5 text-[10px] text-white/70">{metric.label}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Detail panel -->
					<div class="p-6 sm:p-8">
						<p class="leading-relaxed text-muted-foreground">{project.description}</p>

						<div class="mt-5 flex flex-wrap gap-2">
							{#each project.stack as tech (tech)}
								<Badge variant="outline" class="font-mono text-[11px]">{tech}</Badge>
							{/each}
						</div>

						<div class="mt-6 space-y-3.5">
							{#each project.highlights as highlight (highlight.title)}
								<div class="flex gap-3">
									<span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
									<div>
										<h4 class="text-sm font-semibold">{highlight.title}</h4>
										<p class="mt-0.5 text-sm leading-relaxed text-muted-foreground">
											{highlight.detail}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<!-- Supporting work strip -->
	<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" use:reveal>
		<div
			class="flex items-start gap-4 rounded-xl border border-dashed border-border bg-card/50 p-5"
		>
			<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
				<LayoutTemplate class="size-4.5" />
			</span>
			<div>
				<h3 class="font-display text-sm font-semibold">Excel automation suite</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
					Python utilities at MyERP that automated migration verification and weekly reporting —
					replacing manual spreadsheet work with auditable scripts.
				</p>
			</div>
		</div>
		<div
			class="flex items-start gap-4 rounded-xl border border-dashed border-border bg-card/50 p-5"
		>
			<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
				<Gauge class="size-4.5" />
			</span>
			<div>
				<h3 class="font-display text-sm font-semibold">This website</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
					SvelteKit + Tailwind v4, statically exported, ~0 config. The live API widgets, the
					<a href="/tools" class="text-primary underline-offset-4 hover:underline">tools</a> and the
					<a href="/lab" class="text-primary underline-offset-4 hover:underline">code lab</a> are the
					demos.
				</p>
			</div>
		</div>
	</div>
</Section>
