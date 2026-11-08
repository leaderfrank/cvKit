<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { achievements, profile } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import Zap from '@lucide/svelte/icons/zap';
	import Database from '@lucide/svelte/icons/database';
	import Boxes from '@lucide/svelte/icons/boxes';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Braces from '@lucide/svelte/icons/braces';

	const icons = [Zap, Database, Boxes, Smartphone, Braces];

	const principles = [
		{
			title: 'Clean architecture over clever code',
			body: 'Systems outlive their authors. I optimize for the person reading the code in six months: explicit boundaries, small modules, boring where it should be.'
		},
		{
			title: 'Measure, then optimize',
			body: 'Performance work starts with a profile, not a hunch. The 35% speedup on the Othouba platform came from measuring first: slow queries, bloated bundles, chatty endpoints.'
		},
		{
			title: 'Ship with intent',
			body: 'Every deploy should move a metric that matters to a user or a business. Features are means; outcomes are the point.'
		}
	];
</script>

<Section id="about" eyebrow="// about me" title="Engineer first, framework second.">
	<div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
		<div use:reveal>
			<p class="text-lg leading-relaxed text-foreground">
				I'm {profile.name}, a {profile.title} based in {profile.location}. Over the past two years
				I've built
				<span class="font-semibold text-primary">scalable web applications</span>,
				<span class="font-semibold text-primary">Flutter and Tauri apps</span>,
				<span class="font-semibold text-primary">backend services</span>,
				<span class="font-semibold text-primary">ERP and POS systems</span>,
				<span class="font-semibold text-primary">fintech &amp; SaaS platforms</span>, and the
				<span class="font-semibold text-primary">REST APIs</span> that tie them together.
			</p>
			<p class="mt-4 leading-relaxed text-muted-foreground">
				My happy place is where a real business problem meets a clean technical solution — like
				turning 365 tangled SQL Server tables into 330 sane MySQL ones, or cutting a production
				platform's load time by more than a third.
			</p>

			<div class="mt-8 space-y-4">
				{#each principles as principle, i (principle.title)}
					<div class="flex gap-3.5" use:reveal={{ delay: i * 90 }}>
						<span
							class="mt-1 grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 font-mono text-xs font-bold text-primary"
						>
							{i + 1}
						</span>
						<div>
							<h3 class="font-display text-sm font-semibold">{principle.title}</h3>
							<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			{#each achievements as achievement, i (achievement.label)}
				{@const Icon = icons[i]}
				<article
					class="group flex gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
					use:reveal={{ delay: i * 80 }}
				>
					<span
						class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
					>
						<Icon class="size-5" />
					</span>
					<div>
						<p class="font-display text-lg leading-tight font-bold">{achievement.metric}</p>
						<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
							{achievement.label}
						</p>
						<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
							{achievement.description}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</Section>
