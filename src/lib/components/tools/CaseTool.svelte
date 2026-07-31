<script lang="ts">
	import CaseSensitive from '@lucide/svelte/icons/case-sensitive';
	import { Button } from '$lib/components/ui/button/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { caseConversions } from '$lib/tools/case';

	const SAMPLE = 'the quick brownFox_jumps-over 13 lazyDogs';

	let input = $state('user profile settings page');
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<CaseSensitive class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Case Converter</h3>
			<p class="text-xs text-muted-foreground">
				camel, Pascal, snake, kebab and friends — tokenized correctly.
			</p>
		</div>
	</header>

	<label for="case-input" class="sr-only">Text to convert</label>
	<input
		id="case-input"
		type="text"
		bind:value={input}
		placeholder="Type something like userProfile settings…"
		class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono text-sm shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
	/>
	<div class="mt-2">
		<Button size="sm" variant="ghost" class="h-7 text-xs" onclick={() => (input = SAMPLE)}
			>Try a tricky sample</Button
		>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-live="polite">
		{#each caseConversions as conv (conv.id)}
			{@const value = conv.convert(input)}
			<div class="rounded-lg border border-border/60 bg-muted/50 px-3 py-2">
				<div class="flex items-center justify-between gap-2">
					<span class="font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
						>{conv.label}</span
					>
					{#if value}
						<CopyButton text={value} label={conv.label} />
					{/if}
				</div>
				<p class="mt-1 font-mono text-xs break-all text-foreground/90">{value || ' '}</p>
			</div>
		{/each}
	</div>
</div>
