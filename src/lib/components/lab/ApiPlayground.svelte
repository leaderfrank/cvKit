<script lang="ts">
	import { onDestroy } from 'svelte';
	import { apiFetch, clearApiCache, type ApiMeta } from '$lib/api/client';
	import { debounce } from '$lib/lab/timing';
	import { cn } from '$lib/utils.js';
	import { formatTime } from '$lib/utils/format';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import Users from '@lucide/svelte/icons/users';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Search from '@lucide/svelte/icons/search';
	import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
	import CircleX from '@lucide/svelte/icons/circle-x';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Clock from '@lucide/svelte/icons/clock';
	import Database from '@lucide/svelte/icons/database';
	import Wifi from '@lucide/svelte/icons/wifi';

	interface RandomUser {
		login: { uuid: string };
		name: { first: string; last: string };
		email: string;
		picture: { medium: string };
		location: { city: string; country: string };
		gender: string;
		nat: string;
	}
	interface RandomUserResponse {
		results: RandomUser[];
	}

	type GenderFilter = 'all' | 'female' | 'male';

	const TOTAL_PAGES = 10; // seed='portfolio' makes pages stable; randomuser.me has no real total
	const TTL_MS = 60_000;
	const GENDER_OPTIONS: { value: GenderFilter; label: string }[] = [
		{ value: 'all', label: 'all' },
		{ value: 'female', label: 'female' },
		{ value: 'male', label: 'male' }
	];
	const TECHNIQUES = [
		'TTL cache (60s)',
		'Retries with backoff',
		'Abort timeout',
		'Debounced search (300ms)',
		'Skeleton loading',
		'Graceful error handling'
	];

	let page = $state(1);
	let perPage = $state(12);
	let gender = $state<GenderFilter>('all');
	let users = $state<RandomUser[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let meta = $state<ApiMeta | null>(null);
	let search = $state('');
	let debouncedSearch = $state('');
	let cacheNotice = $state(false);

	const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

	const applySearch = debounce((v: string) => {
		debouncedSearch = v;
	}, 300);
	onDestroy(() => applySearch.cancel());

	const filtered = $derived.by(() => {
		const q = debouncedSearch.trim().toLowerCase();
		if (!q) return users;
		return users.filter(
			(u) =>
				`${u.name.first} ${u.name.last}`.toLowerCase().includes(q) ||
				u.email.toLowerCase().includes(q)
		);
	});

	// Guards against out-of-order responses when controls change fast.
	let reqSeq = 0;

	async function load(opts: { force?: boolean } = {}) {
		const my = ++reqSeq;
		loading = true;
		error = null;
		cacheNotice = false;

		const params = new URLSearchParams({
			seed: 'portfolio',
			page: String(page),
			results: String(perPage)
		});
		if (gender !== 'all') params.set('gender', gender);

		const res = await apiFetch<RandomUserResponse>(`https://randomuser.me/api/?${params}`, {
			ttl: TTL_MS,
			retries: 2,
			timeoutMs: 8000,
			force: opts.force ?? false
		});

		if (my !== reqSeq) return; // a newer request superseded this one
		loading = false;
		if (res.ok) {
			users = res.data.results;
			meta = res.meta;
		} else {
			users = [];
			error = res.error;
			meta = res.meta;
		}
	}

	$effect(() => {
		void page;
		void perPage;
		void gender; // watch the controls, reload on change
		load();
	});

	function setGender(g: GenderFilter) {
		if (g === gender) return;
		gender = g;
		page = 1;
	}

	function setPerPage(e: Event) {
		perPage = Number((e.currentTarget as HTMLSelectElement).value);
		page = 1;
	}

	function onSearch(e: Event) {
		const v = (e.currentTarget as HTMLInputElement).value;
		search = v;
		applySearch(v);
	}

	function clearCache() {
		clearApiCache();
		cacheNotice = true;
	}
</script>

<div class="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
	<!-- Header -->
	<header
		class="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3"
	>
		<div class="flex items-center gap-2.5">
			<span class="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
				<Users class="size-4" />
			</span>
			<h3 class="font-display text-sm font-semibold">People directory</h3>
			<a
				href="https://randomuser.me"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
				>randomuser.me</a
			>
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => load({ force: true })}
				disabled={loading}
				aria-label="Refresh, bypassing the cache"
			>
				<RefreshCw class={cn('size-4', loading && 'animate-spin')} />Refresh
			</Button>
			<Button variant="outline" size="sm" onclick={clearCache} aria-label="Clear the API cache">
				<Trash2 class="size-4" />Clear API cache
			</Button>
		</div>
	</header>

	<!-- Techniques demonstrated -->
	<div class="flex flex-wrap gap-x-4 gap-y-1.5 border-b border-border/60 px-4 py-2.5">
		{#each TECHNIQUES as t (t)}
			<span class="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
				<CircleCheckBig class="size-3.5 text-success" />{t}
			</span>
		{/each}
	</div>

	<!-- Controls -->
	<div class="flex flex-wrap items-center gap-3 border-b border-border/60 px-4 py-3">
		<div
			class="flex overflow-hidden rounded-md border border-input"
			role="group"
			aria-label="Gender filter"
		>
			{#each GENDER_OPTIONS as g (g.value)}
				<button
					type="button"
					onclick={() => setGender(g.value)}
					aria-pressed={gender === g.value}
					class={cn(
						'px-3 py-1.5 text-xs font-medium transition-colors',
						gender === g.value
							? 'bg-primary text-primary-foreground'
							: 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
					)}>{g.label}</button
				>
			{/each}
		</div>

		<label class="flex items-center gap-2 text-xs text-muted-foreground" for="per-page">
			Per page
			<select
				id="per-page"
				value={perPage}
				onchange={setPerPage}
				class="rounded-md border border-input bg-background px-2 py-1.5 text-xs"
			>
				{#each [6, 12, 24] as n (n)}
					<option value={n}>{n}</option>
				{/each}
			</select>
		</label>

		<div class="relative ms-auto min-w-48 max-w-72 flex-1">
			<Search
				class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				class="h-8 ps-8 text-xs"
				value={search}
				oninput={onSearch}
				placeholder="Filter loaded users by name or email…"
				aria-label="Filter loaded users by name or email"
			/>
		</div>
		{#if search !== debouncedSearch}
			<span class="font-mono text-[10px] text-muted-foreground" aria-hidden="true">typing…</span>
		{/if}
	</div>

	{#if cacheNotice}
		<p class="border-b border-border/60 bg-success/10 px-4 py-1.5 text-[11px] text-success">
			API cache cleared — the next request hits the network.
		</p>
	{/if}

	<!-- Body -->
	<div class="min-h-40 p-4">
		{#if loading}
			<div
				class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
				aria-busy="true"
				aria-live="polite"
			>
				{#each Array.from({ length: perPage }) as _, i (i)}
					<div class="flex items-center gap-3 rounded-lg border border-border/60 p-3">
						<Skeleton class="size-12 shrink-0 rounded-full" />
						<div class="min-w-0 flex-1 space-y-2">
							<Skeleton class="h-3 w-3/4" />
							<Skeleton class="h-3 w-full" />
							<Skeleton class="h-3 w-1/2" />
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-3 font-mono text-[11px] text-muted-foreground">Fetching users…</p>
		{:else if error}
			<div class="flex flex-col items-start gap-3 py-6" role="alert">
				<div class="flex items-center gap-2 text-sm text-destructive">
					<CircleX class="size-4" />
					<p class="font-medium">Couldn't load users</p>
				</div>
				<p class="font-mono text-xs text-muted-foreground">{error}</p>
				<Button variant="outline" size="sm" onclick={() => load({ force: true })}>
					<RefreshCw class="size-4" />Try again
				</Button>
			</div>
		{:else if filtered.length === 0}
			<div class="flex flex-col items-start gap-2 py-6">
				<p class="text-sm text-muted-foreground">
					No matches for “{debouncedSearch}” among the {users.length} users loaded on this page.
				</p>
				<Button variant="outline" size="sm" onclick={() => ((search = ''), applySearch(''))}>
					Clear search
				</Button>
			</div>
		{:else}
			<p class="mb-3 text-[11px] text-muted-foreground" aria-live="polite">
				Showing {filtered.length} of {users.length} loaded users{#if debouncedSearch}
					matching “{debouncedSearch}”{/if}.
			</p>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each filtered as user (user.login.uuid)}
					<article
						class="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:border-primary/30"
					>
						<img
							src={user.picture.medium}
							alt="{user.name.first} {user.name.last}"
							width="48"
							height="48"
							loading="lazy"
							class="size-12 shrink-0 rounded-full ring-1 ring-border"
						/>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium">{user.name.first} {user.name.last}</p>
							<p class="truncate font-mono text-[11px] text-muted-foreground" title={user.email}>
								{user.email}
							</p>
							<p class="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
								<MapPin class="size-3 shrink-0" />{user.location.city}, {user.location.country}
							</p>
						</div>
						<div class="flex shrink-0 flex-col items-end gap-1">
							<Badge variant="outline" class="px-1.5 py-0 text-[10px]">{user.gender}</Badge>
							<Badge variant="secondary" class="px-1.5 py-0 font-mono text-[10px]">{user.nat}</Badge
							>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	<div class="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3">
		<Button
			variant="outline"
			size="sm"
			disabled={page <= 1 || loading}
			onclick={() => page--}
			aria-label="Previous page"
		>
			<ChevronLeft class="size-4" />Prev
		</Button>
		<div class="flex flex-wrap gap-1" role="group" aria-label="Pages">
			{#each pages as p (p)}
				<button
					type="button"
					onclick={() => (page = p)}
					aria-label="Page {p}"
					aria-current={p === page ? 'page' : undefined}
					class={cn(
						'h-8 min-w-8 rounded-md border px-2 font-mono text-xs tabular-nums transition-colors',
						p === page
							? 'border-primary/50 bg-primary/10 text-primary'
							: 'border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
					)}>{p}</button
				>
			{/each}
		</div>
		<Button
			variant="outline"
			size="sm"
			disabled={page >= TOTAL_PAGES || loading}
			onclick={() => page++}
			aria-label="Next page"
		>
			Next<ChevronRight class="size-4" />
		</Button>
	</div>

	<!-- Meta strip: what apiFetch reports under the hood -->
	<footer
		class="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 bg-muted/40 px-4 py-2 font-mono text-[10px] text-muted-foreground"
	>
		{#if meta}
			<span class="inline-flex items-center gap-1" title="Request latency"
				><Clock class="size-3" />{meta.durationMs}ms</span
			>
			{#if meta.fromCache}
				<span
					class={cn(
						'inline-flex items-center gap-1',
						meta.cacheState === 'stale-fallback' && 'text-warning'
					)}
					title="Served from cache"
					><Database class="size-3" />{meta.cacheState === 'stale-fallback'
						? 'stale cache'
						: 'cached'}</span
				>
			{:else}
				<span class="inline-flex items-center gap-1 text-success" title="Fresh from the network"
					><Wifi class="size-3" />live</span
				>
			{/if}
			<span title="Attempts made, including retries">attempts {meta.attempts}</span>
			<span title="HTTP status">status {meta.status ?? '—'}</span>
			<span class="ms-auto" title="Last updated">updated {formatTime(meta.updatedAt)}</span>
		{:else}
			<span>no requests yet</span>
		{/if}
	</footer>
</div>
