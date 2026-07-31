<script lang="ts">
	import { untrack } from 'svelte';
	import Lock from '@lucide/svelte/icons/lock';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import { Button } from '$lib/components/ui/button/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { cn } from '$lib/utils.js';

	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
	const DIGITS = '0123456789';
	const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/~';

	let length = $state(24);
	let useUpper = $state(true);
	let useLower = $state(true);
	let useDigits = $state(true);
	let useSymbols = $state(true);
	let password = $state('');
	let history = $state<string[]>([]);

	const charset = $derived(
		(useUpper ? UPPERCASE : '') +
			(useLower ? LOWERCASE : '') +
			(useDigits ? DIGITS : '') +
			(useSymbols ? SYMBOLS : '')
	);
	const entropy = $derived(charset.length > 0 ? Math.round(length * Math.log2(charset.length)) : 0);
	const strength = $derived.by(() => {
		if (charset.length === 0)
			return { label: 'No charset', cls: 'text-muted-foreground', bar: 'bg-muted', pct: 0 };
		if (entropy < 40)
			return { label: 'Weak', cls: 'text-destructive', bar: 'bg-destructive', pct: 25 };
		if (entropy < 60) return { label: 'Fair', cls: 'text-warning', bar: 'bg-warning', pct: 50 };
		if (entropy < 90) return { label: 'Strong', cls: 'text-chart-4', bar: 'bg-chart-4', pct: 75 };
		return { label: 'Excellent', cls: 'text-success', bar: 'bg-success', pct: 100 };
	});

	/** Unbiased random index in [0, max) via rejection sampling. */
	function randomBelow(max: number): number {
		const limit = Math.floor(256 / max) * max;
		const buf = new Uint8Array(1);
		do {
			crypto.getRandomValues(buf);
		} while (buf[0] >= limit);
		return buf[0] % max;
	}

	function generate() {
		if (!charset.length) {
			password = '';
			return;
		}
		const required = [
			useUpper && UPPERCASE,
			useLower && LOWERCASE,
			useDigits && DIGITS,
			useSymbols && SYMBOLS
		].filter(Boolean) as string[];
		let value = '';
		// Re-roll until every selected class is represented (bounded, practically instant)
		for (let attempt = 0; attempt < 200; attempt++) {
			value = Array.from({ length }, () => charset[randomBelow(charset.length)]).join('');
			if (required.every((cls) => [...cls].some((c) => value.includes(c)))) break;
		}
		password = value;
		// untrack: reading history here must not create an effect dependency (would loop)
		const previous = untrack(() => history);
		history = [value, ...previous.filter((p) => p !== value)].slice(0, 5);
	}

	$effect(() => {
		// Regenerate whenever the recipe changes
		length;
		useUpper;
		useLower;
		useDigits;
		useSymbols;
		generate();
	});

	const checkboxCls =
		'size-4 shrink-0 cursor-pointer appearance-none rounded border border-input bg-background transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Lock class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Password Generator</h3>
			<p class="text-xs text-muted-foreground">
				CSPRNG passwords with rejection sampling — no modulo bias.
			</p>
		</div>
	</header>

	<div class="flex items-center gap-2 rounded-lg border border-border/60 bg-muted px-3 py-2.5">
		<span class="min-w-0 flex-1 truncate font-mono text-sm select-all" aria-live="polite">
			{password || 'Select at least one character class'}
		</span>
		<Button
			size="icon"
			variant="ghost"
			onclick={generate}
			aria-label="Regenerate password"
			class="size-7"
		>
			<RefreshCw class="size-3.5" />
		</Button>
		<CopyButton text={password} label="password" />
	</div>

	<div class="mt-3">
		<div class="h-1.5 overflow-hidden rounded-full bg-muted">
			<div
				class={cn('h-full rounded-full transition-all duration-500', strength.bar)}
				style="width: {strength.pct}%"
			></div>
		</div>
		<p class="mt-1.5 font-mono text-[11px] text-muted-foreground">
			<span class={cn('font-semibold', strength.cls)}>{strength.label}</span>
			<span aria-hidden="true"> · </span>{entropy} bits of entropy
		</p>
	</div>

	<div class="mt-4 space-y-3">
		<div>
			<div class="mb-1 flex items-center justify-between">
				<label for="pw-length" class="text-xs font-medium">Length</label>
				<span class="font-mono text-xs text-muted-foreground">{length}</span>
			</div>
			<input
				id="pw-length"
				type="range"
				min="8"
				max="64"
				bind:value={length}
				class="w-full accent-primary"
			/>
		</div>
		<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
			<label class="flex cursor-pointer items-center gap-2 text-xs">
				<input type="checkbox" bind:checked={useUpper} class={checkboxCls} /> A–Z
			</label>
			<label class="flex cursor-pointer items-center gap-2 text-xs">
				<input type="checkbox" bind:checked={useLower} class={checkboxCls} /> a–z
			</label>
			<label class="flex cursor-pointer items-center gap-2 text-xs">
				<input type="checkbox" bind:checked={useDigits} class={checkboxCls} /> 0–9
			</label>
			<label class="flex cursor-pointer items-center gap-2 text-xs">
				<input type="checkbox" bind:checked={useSymbols} class={checkboxCls} /> #$&amp;
			</label>
		</div>
	</div>

	{#if history.length > 1}
		<div class="mt-4">
			<p class="mb-1.5 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
				Recent
			</p>
			<div class="flex flex-wrap gap-1.5">
				{#each history as pw (pw)}
					<button
						type="button"
						onclick={() => (password = pw)}
						title="Reuse this password"
						class={cn(
							'max-w-full truncate rounded-md border border-border/60 bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground',
							pw === password && 'border-primary/50 text-foreground'
						)}
					>
						{pw}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
