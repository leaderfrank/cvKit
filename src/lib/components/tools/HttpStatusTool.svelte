<script lang="ts">
	import Globe from '@lucide/svelte/icons/globe';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { HTTP_STATUSES, type HttpStatus, type StatusClass } from '$lib/tools/http-status';
	import { cn } from '$lib/utils.js';

	let query = $state('');
	let selected = $state<HttpStatus>(HTTP_STATUSES.find((s) => s.code === 404) ?? HTTP_STATUSES[0]);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return HTTP_STATUSES;
		return HTTP_STATUSES.filter(
			(s) =>
				String(s.code).includes(q) ||
				s.name.toLowerCase().includes(q) ||
				s.summary.toLowerCase().includes(q)
		);
	});

	const classColor: Record<StatusClass, string> = {
		'1xx': 'text-muted-foreground',
		'2xx': 'text-success',
		'3xx': 'text-chart-2',
		'4xx': 'text-warning',
		'5xx': 'text-destructive'
	};
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Globe class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">HTTP Status Codes</h3>
			<p class="text-xs text-muted-foreground">
				A searchable field guide to {HTTP_STATUSES.length} status codes.
			</p>
		</div>
	</header>

	<Input
		bind:value={query}
		type="search"
		placeholder="Filter by code or phrase — try 404, redirect, teapot…"
		aria-label="Filter status codes"
	/>

	<div class="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.4fr]">
		<ul class="max-h-56 space-y-0.5 overflow-auto pr-1 lg:max-h-72" aria-label="Status codes">
			{#each filtered as status (status.code)}
				<li>
					<button
						type="button"
						onclick={() => (selected = status)}
						aria-current={selected.code === status.code}
						class={cn(
							'flex w-full items-baseline gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent',
							selected.code === status.code && 'bg-accent'
						)}
					>
						<span class={cn('font-mono font-semibold tabular-nums', classColor[status.class])}
							>{status.code}</span
						>
						<span class="truncate text-foreground/90">{status.name}</span>
					</button>
				</li>
			{:else}
				<li class="px-2 py-4 text-center text-xs text-muted-foreground">
					No status code matches “{query}”.
				</li>
			{/each}
		</ul>

		<div class="rounded-lg border border-border/60 bg-muted/40 p-4" aria-live="polite">
			<div class="flex items-baseline gap-2">
				<span
					class={cn(
						'font-display text-4xl font-bold tracking-tight tabular-nums',
						classColor[selected.class]
					)}
				>
					{selected.code}
				</span>
				<span class="font-display text-sm font-semibold">{selected.name}</span>
				<span class="ml-auto font-mono text-[10px] text-muted-foreground uppercase"
					>{selected.class}</span
				>
			</div>
			<p class="mt-2 text-sm text-foreground/90">{selected.summary}</p>
			<p class="mt-1.5 text-xs leading-relaxed text-muted-foreground">{selected.detail}</p>
			<div class="relative mt-3">
				<pre
					class="overflow-x-auto rounded-md bg-background p-2.5 font-mono text-[11px] whitespace-pre-wrap border border-border/50">{selected.example}</pre>
				<span class="absolute top-1.5 right-1.5"
					><CopyButton text={selected.example} label="example" /></span
				>
			</div>
		</div>
	</div>
</div>
