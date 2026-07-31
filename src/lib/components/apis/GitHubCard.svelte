<script lang="ts">
	import { onMount } from 'svelte';
	import ApiCard from '$lib/components/shared/ApiCard.svelte';
	import { getGitHubOverview, type GitHubOverview } from '$lib/apis/github';
	import type { ApiMeta } from '$lib/api/client';
	import { formatNumber, timeAgo } from '$lib/utils/format';
	import { profile } from '$lib/data/portfolio';
	import Github from '@lucide/svelte/icons/github';
	import GitCommitHorizontal from '@lucide/svelte/icons/git-commit-horizontal';
	import Star from '@lucide/svelte/icons/star';

	let data = $state<GitHubOverview | null>(null);
	let meta = $state<ApiMeta | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	async function load(force = false) {
		loading = true;
		error = null;
		const res = await getGitHubOverview(force);
		if (res.ok) {
			data = res.data;
			meta = res.meta;
		} else {
			error = res.error;
		}
		loading = false;
	}

	onMount(() => {
		void load();
	});
</script>

<ApiCard
	title="GitHub"
	source="api.github.com"
	sourceUrl={profile.github}
	{loading}
	{error}
	{meta}
	onRetry={load}
	loadingLabel="Calling api.github.com ×3…"
	class="h-full"
>
	{#snippet icon()}<Github class="size-4" />{/snippet}
	{#if data}
		<div class="flex h-full flex-col gap-4">
			<div class="flex items-center gap-3">
				{#if data.avatarUrl}
					<img
						src={data.avatarUrl}
						alt="Avatar of {data.login}"
						class="size-10 shrink-0 rounded-full ring-2 ring-primary/20"
						loading="lazy"
					/>
				{/if}
				<div class="min-w-0">
					<div class="flex items-baseline gap-2">
						<p class="truncate text-sm font-semibold">{data.name}</p>
						<a
							href={data.profileUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="shrink-0 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
							>@{data.login}</a
						>
					</div>
					{#if data.bio}
						<p class="truncate text-xs text-muted-foreground">{data.bio}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-4 gap-2">
				{#each [{ label: 'Repos', value: data.publicRepos }, { label: 'Stars', value: data.totalStars }, { label: 'Followers', value: data.followers }, { label: 'Following', value: data.following }] as stat (stat.label)}
					<div class="rounded-lg border border-border/60 px-2 py-1.5 text-center">
						<p class="font-mono text-sm font-semibold">{formatNumber(stat.value)}</p>
						<p class="text-[10px] tracking-wide text-muted-foreground uppercase">{stat.label}</p>
					</div>
				{/each}
			</div>

			{#if data.topRepos.length}
				<div>
					<h4 class="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
						Top repositories
					</h4>
					<ul class="flex flex-col gap-2.5">
						{#each data.topRepos as repo (repo.name)}
							<li class="flex flex-col gap-0.5">
								<div class="flex items-center gap-2">
									<a
										href={repo.url}
										target="_blank"
										rel="noopener noreferrer"
										class="truncate text-xs font-medium transition-colors hover:text-primary"
										>{repo.name}</a
									>
									{#if repo.language}
										<span
											class="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground"
										>
											<span class="size-2 rounded-full bg-primary"></span>{repo.language}
										</span>
									{/if}
									<span
										class="ml-auto inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground"
									>
										<Star class="size-3 text-warning" />{formatNumber(repo.stars)}
									</span>
								</div>
								{#if repo.description}
									<p class="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
										{repo.description}
									</p>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<div class="mt-auto">
				<h4 class="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
					Recent activity
				</h4>
				{#if data.recentActivity.length}
					<ul class="flex flex-col gap-1.5">
						{#each data.recentActivity.slice(0, 3) as item (item.type + item.repo + item.createdAt)}
							<li class="flex items-center gap-2 text-xs">
								<GitCommitHorizontal class="size-3.5 shrink-0 text-muted-foreground" />
								<span class="shrink-0">{item.label}</span>
								<span class="truncate font-mono text-[11px] text-muted-foreground">{item.repo}</span
								>
								{#if item.createdAt}
									<span class="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground"
										>{timeAgo(item.createdAt)}</span
									>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-[11px] text-muted-foreground">No recent public events on record.</p>
				{/if}
			</div>
		</div>
	{/if}
</ApiCard>
