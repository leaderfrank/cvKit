<script lang="ts">
	import Fingerprint from '@lucide/svelte/icons/fingerprint';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import { Button } from '$lib/components/ui/button/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';

	const COUNTS = [1, 5, 10, 25, 50];

	let count = $state(10);
	let uuids = $state<string[]>([]);

	function generate() {
		uuids = Array.from({ length: count }, () => crypto.randomUUID());
	}

	$effect(() => {
		count;
		generate();
	});
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Fingerprint class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">UUID v4 Generator</h3>
			<p class="text-xs text-muted-foreground">
				Cryptographically random UUIDs from crypto.randomUUID().
			</p>
		</div>
	</header>

	<div class="flex flex-wrap items-center gap-2">
		<label for="uuid-count" class="text-xs font-medium">Count</label>
		<select
			id="uuid-count"
			bind:value={count}
			class="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
		>
			{#each COUNTS as c (c)}
				<option value={c}>{c}</option>
			{/each}
		</select>
		<Button size="sm" variant="outline" onclick={generate}>
			<RefreshCw class="size-3.5" />
			Regenerate
		</Button>
		<span class="ml-auto"><CopyButton text={uuids.join('\n')} label="all UUIDs" /></span>
	</div>

	<ul
		class="mt-3 max-h-64 space-y-1 overflow-auto pr-1"
		aria-live="polite"
		aria-label="Generated UUIDs"
	>
		{#each uuids as id (id)}
			<li
				class="group flex items-center gap-2 rounded-md border border-transparent px-2 py-1 transition-colors hover:border-border/60 hover:bg-muted/60"
			>
				<span class="min-w-0 flex-1 truncate font-mono text-xs select-all">{id}</span>
				<CopyButton
					text={id}
					label="UUID"
					class="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-100"
				/>
			</li>
		{/each}
	</ul>
</div>
