<script lang="ts">
	import Pilcrow from '@lucide/svelte/icons/pilcrow';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import { Button } from '$lib/components/ui/button/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { generateLorem, type LoremUnit } from '$lib/tools/lorem';
	import { cn } from '$lib/utils.js';

	const UNITS: { id: LoremUnit; label: string }[] = [
		{ id: 'words', label: 'Words' },
		{ id: 'sentences', label: 'Sentences' },
		{ id: 'paragraphs', label: 'Paragraphs' }
	];

	let unit = $state<LoremUnit>('paragraphs');
	let count = $state(3);
	let output = $state('');

	$effect(() => {
		output = generateLorem(unit, count);
	});
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Pilcrow class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Lorem Ipsum</h3>
			<p class="text-xs text-muted-foreground">
				Filler copy for mockups — words, sentences or paragraphs.
			</p>
		</div>
	</header>

	<div class="flex flex-wrap items-center gap-3">
		<div
			class="flex items-center rounded-lg border border-border/60 p-0.5"
			role="group"
			aria-label="Unit"
		>
			{#each UNITS as u (u.id)}
				<button
					type="button"
					aria-pressed={unit === u.id}
					onclick={() => (unit = u.id)}
					class={cn(
						'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
						unit === u.id
							? 'bg-primary/10 text-primary'
							: 'text-muted-foreground hover:text-foreground'
					)}
				>
					{u.label}
				</button>
			{/each}
		</div>
		<Button size="sm" variant="outline" onclick={() => (output = generateLorem(unit, count))}>
			<RefreshCw class="size-3.5" />
			Regenerate
		</Button>
		<span class="ml-auto"><CopyButton text={output} label="lorem ipsum" /></span>
	</div>

	<div class="mt-3 flex items-center gap-3">
		<label for="lorem-count" class="text-xs font-medium whitespace-nowrap">
			Count <span class="font-mono text-muted-foreground">({count})</span>
		</label>
		<input
			id="lorem-count"
			type="range"
			min="1"
			max="20"
			bind:value={count}
			class="w-full accent-primary"
		/>
	</div>

	<div
		class="mt-3 max-h-64 overflow-auto rounded-lg bg-muted p-3 text-sm leading-relaxed text-foreground/90"
		aria-live="polite"
	>
		{#each output.split('\n\n') as para, i (i)}
			<p class="mb-3 last:mb-0">{para}</p>
		{/each}
	</div>
</div>
