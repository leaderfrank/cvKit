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
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Award from '@lucide/svelte/icons/award';

	// Live repo count from GitHub (shares the apiFetch cache with the GitHub widget).
	// The fallback matches the public count at the time of writing, so the card still
	// reads correctly when the unauthenticated API is rate-limited.
	let repos = $state(29);

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
			value: dashboardStats.clientProjects,
			suffix: '+',
			label: 'Client projects',
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
			value: dashboardStats.playApps,
			suffix: '',
			label: 'Apps on Google Play',
			hint: 'published & maintained',
			icon: 'mobile'
		},
		{
			value: dashboardStats.certifications,
			suffix: '',
			label: 'Certifications',
			hint: 'Oracle · AWS · Vercel',
			icon: 'award'
		}
	]);

	const iconMap: Record<string, typeof Clock> = {
		clock: Clock,
		rocket: Rocket,
		layers: Layers,
		github: Github,
		mobile: Smartphone,
		award: Award
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
