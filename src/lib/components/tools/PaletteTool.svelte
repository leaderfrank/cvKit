<script lang="ts">
	import Palette from '@lucide/svelte/icons/palette';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		buildPalette,
		contrastGrade,
		contrastRatio,
		randomHex,
		HARMONIES,
		type Harmony
	} from '$lib/tools/color';
	import { cn } from '$lib/utils.js';

	let base = $state('#6d28d9');
	let harmony = $state<Harmony>('analogous');
	let copiedHex = $state<string | null>(null);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;

	const palette = $derived(buildPalette(base, harmony));

	function row(hex: string) {
		const vsWhite = contrastRatio(hex, '#ffffff');
		const vsBlack = contrastRatio(hex, '#000000');
		return {
			hex,
			vsWhite,
			vsBlack,
			whiteGrade: contrastGrade(vsWhite),
			blackGrade: contrastGrade(vsBlack),
			fg: vsBlack >= vsWhite ? '#000000' : '#ffffff'
		};
	}

	async function copyHex(hex: string) {
		try {
			await navigator.clipboard.writeText(hex);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = hex;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			ta.remove();
		}
		copiedHex = hex;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copiedHex = null), 1500);
	}

	const gradeCls = (g: string) =>
		g === 'AAA'
			? 'border-success/40 bg-success/10 text-success'
			: g === 'AA'
				? 'border-warning/40 bg-warning/10 text-warning'
				: 'border-destructive/40 bg-destructive/10 text-destructive';
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Palette class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Color Palette</h3>
			<p class="text-xs text-muted-foreground">
				Harmonies from one base color, with WCAG contrast grades.
			</p>
		</div>
	</header>

	<div class="flex flex-wrap items-center gap-2">
		<label for="palette-base" class="sr-only">Base color</label>
		<input
			id="palette-base"
			type="color"
			bind:value={base}
			class="h-9 w-12 cursor-pointer rounded-md border border-border/60 bg-background p-1"
		/>
		<span class="font-mono text-xs text-muted-foreground">{base}</span>
		<label for="palette-harmony" class="sr-only">Harmony</label>
		<select
			id="palette-harmony"
			bind:value={harmony}
			class="h-9 rounded-md border border-input bg-background px-2 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
		>
			{#each HARMONIES as h (h.id)}
				<option value={h.id}>{h.label}</option>
			{/each}
		</select>
		<Button size="sm" variant="outline" onclick={() => (base = randomHex())}>
			<Shuffle class="size-3.5" />
			Random
		</Button>
	</div>

	<div class="mt-3 space-y-1.5" aria-live="polite">
		{#each palette.map(row) as swatch (swatch.hex)}
			<div
				class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-2.5"
				style="background: {swatch.hex}; color: {swatch.fg}"
			>
				<button
					type="button"
					onclick={() => copyHex(swatch.hex)}
					class="cursor-pointer font-mono text-sm font-semibold tracking-wide underline-offset-2 hover:underline"
					style="color: inherit"
					title="Copy {swatch.hex}"
					aria-label="Copy color {swatch.hex}"
				>
					{copiedHex === swatch.hex ? 'Copied!' : swatch.hex}
				</button>
				<span
					class="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium opacity-90"
				>
					<span
						>vs white {swatch.vsWhite.toFixed(2)}
						<Badge
							variant="outline"
							class={cn('ml-1 px-1 py-0 text-[9px]', gradeCls(swatch.whiteGrade))}
						>
							{swatch.whiteGrade}
						</Badge>
					</span>
					<span
						>vs black {swatch.vsBlack.toFixed(2)}
						<Badge
							variant="outline"
							class={cn('ml-1 px-1 py-0 text-[9px]', gradeCls(swatch.blackGrade))}
						>
							{swatch.blackGrade}
						</Badge>
					</span>
				</span>
			</div>
		{/each}
	</div>
	<p class="mt-2 text-[11px] text-muted-foreground">
		Click a hex value to copy it. Grades per WCAG 2.1 normal text.
	</p>
</div>
