<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/shared/Section.svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { apiFetch } from '$lib/api/client';
	import { dashboardStats, yearsExperience, profile } from '$lib/data/portfolio';
	import Clock from '@lucide/svelte/icons/clock';
	import Rocket from '@lucide/svelte/icons/rocket';
	import Layers from '@lucide/svelte/icons/layers';
	import Github from '@lucide/svelte/icons/github';
	import CodeXml from '@lucide/svelte/icons/code-xml';
	import Braces from '@lucide/svelte/icons/braces';
	import Coffee from '@lucide/svelte/icons/coffee';
	import Cloud from '@lucide/svelte/icons/cloud';
	import Plug from '@lucide/svelte/icons/plug';

	// Live repo count from GitHub (shares the apiFetch cache with the GitHub widget)
	let repos = $state(19);

	onMount(async () => {
		const res = await apiFetch<{ public_repos?: number }>(
			`https://api.github.com/users/${profile.githubHandle}`,
			{ ttl: 10 * 60 * 1000, cacheKey: 'github:user' }
		);
		if (res.ok && typeof res.data.public_repos === 'number') repos = res.data.public_repos;
	});

	const stats = $derived([
		{
			value: yearsExperience,
			suffix: '+',
			label: 'Years experience',
			hint: 'production systems',
			icon: 'clock'
		},
		{
			value: dashboardStats.projectsCompleted,
			suffix: '+',
			label: 'Projects completed',
			hint: 'web · mobile · backend',
			icon: 'rocket'
		},
		{
			value: dashboardStats.technologies,
			suffix: '',
			label: 'Technologies used',
			hint: 'across the stack',
			icon: 'layers'
		},
		{
			value: repos,
			suffix: '',
			label: 'GitHub repositories',
			hint: 'live from GitHub API',
			icon: 'github',
			live: true
		},
		{
			value: dashboardStats.languages,
			suffix: '',
			label: 'Languages',
			hint: 'TS · JS · Python · Dart…',
			icon: 'code'
		},
		{
			value: dashboardStats.linesOfCode,
			suffix: '+',
			label: 'Lines of code',
			hint: 'estimated',
			icon: 'braces'
		},
		{
			value: dashboardStats.deployments,
			suffix: '+',
			label: 'Deployments',
			hint: 'CI/CD pipelines',
			icon: 'cloud'
		},
		{
			value: dashboardStats.apiIntegrations,
			suffix: '+',
			label: 'API integrations',
			hint: 'REST · auth · webhooks',
			icon: 'plug'
		},
		{
			value: dashboardStats.coffees,
			suffix: '',
			label: 'Cups of coffee',
			hint: 'fuel for shipping',
			icon: 'coffee'
		}
	]);

	const iconMap: Record<string, typeof Clock> = {
		clock: Clock,
		rocket: Rocket,
		layers: Layers,
		github: Github,
		code: CodeXml,
		braces: Braces,
		coffee: Coffee,
		cloud: Cloud,
		plug: Plug
	};
</script>

<Section
	id="dashboard"
	eyebrow="// engineering dashboard"
	title="The numbers behind the work."
	description="A snapshot of my engineering footprint — the repository count below is fetched live from the GitHub API when you load this page."
	class="border-y border-border/60 bg-muted/30"
>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
		{#each stats as stat, i (stat.label)}
			{@const Icon = iconMap[stat.icon]}
			<StatCard
				value={stat.value}
				suffix={stat.suffix}
				label={stat.label}
				hint={stat.hint}
				live={stat.live ?? false}
				delay={(i % 3) * 70}
			>
				{#snippet icon()}<Icon class="size-4" />{/snippet}
			</StatCard>
		{/each}
	</div>
</Section>
