<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { projects, repos, supportingWork, profile } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import FileText from '@lucide/svelte/icons/file-text';
	import GitBranch from '@lucide/svelte/icons/git-branch';
	import Globe from '@lucide/svelte/icons/globe';
	import Truck from '@lucide/svelte/icons/truck';
	import Store from '@lucide/svelte/icons/store';
	import Wrench from '@lucide/svelte/icons/wrench';
	import Gauge from '@lucide/svelte/icons/gauge';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';
	import Star from '@lucide/svelte/icons/star';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Github from '@lucide/svelte/icons/github';

	const projectIcons: Record<string, typeof FileText> = {
		'file-text': FileText,
		'git-branch': GitBranch,
		globe: Globe,
		truck: Truck,
		store: Store,
		wrench: Wrench
	};

	const supportIcons: Record<string, typeof Gauge> = {
		layout: LayoutTemplate,
		gauge: Gauge
	};

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
		{#each projects as project (project.name)}
			{@const Icon = projectIcons[project.icon] ?? Globe}
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
								{project.period}
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

						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
						>
							Visit {project.name}
							<ArrowUpRight class="size-3.5" />
						</a>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<!-- Supporting work strip -->
	<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" use:reveal>
		{#each supportingWork as item (item.title)}
			{@const Icon = supportIcons[item.icon] ?? Gauge}
			<div
				class="flex items-start gap-4 rounded-xl border border-dashed border-border bg-card/50 p-5"
			>
				<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
					<Icon class="size-4.5" />
				</span>
				<div>
					<h3 class="font-display text-sm font-semibold">{item.title}</h3>
					<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
					<a
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						class="mt-2 inline-block font-mono text-[11px] text-primary underline-offset-4 hover:underline"
						>{item.linkLabel}</a
					>
				</div>
			</div>
		{/each}
	</div>

	<!-- Open source -->
	<div class="mt-16" use:reveal>
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="mb-2 font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
					// open source
				</p>
				<h3 class="font-display text-2xl font-bold tracking-tight">Also on GitHub.</h3>
				<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
					Public repositories that aren't covered by the apps or the case studies above — libraries,
					experiments and tools I actually use.
				</p>
			</div>
			<a
				href={profile.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
			>
				<Github class="size-4" /> @{profile.githubHandle}
			</a>
		</div>

		<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each repos as repo, i (repo.name)}
				<a
					href={repo.link}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex flex-col rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
					use:reveal={{ delay: i * 60 }}
				>
					<div class="flex items-start justify-between gap-2">
						<h4 class="font-display text-sm font-semibold break-all">{repo.name}</h4>
						<span
							class="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground"
						>
							<Star class="size-3" />{repo.stars}
						</span>
					</div>
					<p class="mt-2 grow text-sm leading-relaxed text-muted-foreground">{repo.description}</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each repo.stack as tech (tech)}
							<Badge variant="secondary" class="font-mono text-[10px]">{tech}</Badge>
						{/each}
					</div>
					<span
						class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
					>
						View repo <ArrowUpRight class="size-3" />
					</span>
				</a>
			{/each}
		</div>
	</div>
</Section>
