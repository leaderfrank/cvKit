<script lang="ts">
	import Paintbrush from '@lucide/svelte/icons/paintbrush';
	import Plus from '@lucide/svelte/icons/plus';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import X from '@lucide/svelte/icons/x';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { hexToRgb, randomHex } from '$lib/tools/color';
	import { cn } from '$lib/utils.js';

	let tab = $state('gradient');

	// ---- Gradient ----
	let gradColors = $state<string[]>(['#6d28d9', '#0ea5e9']);
	let angle = $state(135);
	let gradType = $state<'linear' | 'radial'>('linear');

	const gradientCss = $derived(
		gradType === 'linear'
			? `linear-gradient(${angle}deg, ${gradColors.join(', ')})`
			: `radial-gradient(circle, ${gradColors.join(', ')})`
	);
	const gradientDecl = $derived(`background: ${gradientCss};`);

	function addColor() {
		if (gradColors.length < 6) gradColors = [...gradColors, randomHex()];
	}
	function removeColor(i: number) {
		if (gradColors.length > 2) gradColors = gradColors.filter((_, idx) => idx !== i);
	}
	function randomizeGradient() {
		const n = 2 + Math.floor(Math.random() * 2);
		gradColors = Array.from({ length: n }, () => randomHex());
		angle = Math.floor(Math.random() * 361);
	}

	// ---- Shadow ----
	let shX = $state(4);
	let shY = $state(8);
	let shBlur = $state(24);
	let shSpread = $state(0);
	let shOpacity = $state(0.25);
	let shColor = $state('#000000');
	let shInset = $state(false);

	const rgba = $derived.by(() => {
		const rgb = hexToRgb(shColor) ?? { r: 0, g: 0, b: 0 };
		return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Number(shOpacity.toFixed(2))})`;
	});
	const shadowValue = $derived(
		`${shInset ? 'inset ' : ''}${shX}px ${shY}px ${shBlur}px ${shSpread}px ${rgba}`
	);
	const shadowDecl = $derived(`box-shadow: ${shadowValue};`);
	const shadowTw = $derived(
		`shadow-[${shInset ? 'inset_' : ''}${shX}px_${shY}px_${shBlur}px_${shSpread}px_${rgba.replace(/ /g, '')}]`
	);

	const sliderCls = 'w-full accent-primary';
	const colorCls =
		'h-8 w-10 shrink-0 cursor-pointer rounded-md border border-border/60 bg-background p-0.5';
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Paintbrush class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">CSS Playground</h3>
			<p class="text-xs text-muted-foreground">
				Gradients and box-shadows with live preview and copyable CSS.
			</p>
		</div>
	</header>

	<Tabs.Root bind:value={tab}>
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="gradient">Gradient</Tabs.Trigger>
			<Tabs.Trigger value="shadow">Box Shadow</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="gradient" class="mt-3 space-y-3">
			<div
				class="h-28 rounded-lg border border-border/60"
				style="background: {gradientCss}"
				aria-label="Gradient preview"
				role="img"
			></div>

			<div class="flex flex-wrap items-center gap-2">
				{#each gradColors as color, i (i)}
					<span class="relative inline-flex">
						<input
							type="color"
							value={color}
							oninput={(e) => {
								gradColors = gradColors.map((c, idx) => (idx === i ? e.currentTarget.value : c));
							}}
							class={colorCls}
							aria-label="Gradient color {i + 1}"
						/>
						{#if gradColors.length > 2}
							<button
								type="button"
								onclick={() => removeColor(i)}
								aria-label="Remove color {i + 1}"
								class="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-xs transition-transform hover:scale-110"
							>
								<X class="size-2.5" />
							</button>
						{/if}
					</span>
				{/each}
				{#if gradColors.length < 6}
					<Button
						size="icon"
						variant="outline"
						class="size-8"
						onclick={addColor}
						aria-label="Add color"
					>
						<Plus class="size-3.5" />
					</Button>
				{/if}
				<Button size="sm" variant="ghost" class="h-8 gap-1.5 text-xs" onclick={randomizeGradient}>
					<Shuffle class="size-3.5" />
					Random
				</Button>
				<div
					class="ml-auto flex items-center gap-1 rounded-lg border border-border/60 p-0.5"
					role="group"
					aria-label="Gradient type"
				>
					{#each ['linear', 'radial'] as t (t)}
						<button
							type="button"
							aria-pressed={gradType === t}
							onclick={() => (gradType = t as 'linear' | 'radial')}
							class={cn(
								'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors',
								gradType === t
									? 'bg-primary/10 text-primary'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							{t}
						</button>
					{/each}
				</div>
			</div>

			{#if gradType === 'linear'}
				<div class="flex items-center gap-3">
					<label for="grad-angle" class="text-xs font-medium whitespace-nowrap">
						Angle <span class="font-mono text-muted-foreground">({angle}°)</span>
					</label>
					<input
						id="grad-angle"
						type="range"
						min="0"
						max="360"
						bind:value={angle}
						class={sliderCls}
					/>
				</div>
			{/if}

			<div class="relative rounded-lg bg-muted p-3">
				<code class="block pr-14 font-mono text-xs break-all">{gradientDecl}</code>
				<span class="absolute top-2 right-2"
					><CopyButton text={gradientDecl} label="gradient CSS" /></span
				>
			</div>
		</Tabs.Content>

		<Tabs.Content value="shadow" class="mt-3 space-y-3">
			<div
				class="grid h-32 place-items-center rounded-lg border border-border/60 bg-dots bg-muted"
				role="img"
				aria-label="Shadow preview"
			>
				<div class="size-20 rounded-xl bg-card" style="box-shadow: {shadowValue}"></div>
			</div>

			<div class="grid grid-cols-2 gap-x-4 gap-y-2">
				{#each [{ label: 'X offset', key: 'x', min: -50, max: 50 }, { label: 'Y offset', key: 'y', min: -50, max: 50 }, { label: 'Blur', key: 'blur', min: 0, max: 100 }, { label: 'Spread', key: 'spread', min: -50, max: 50 }] as ctrl (ctrl.key)}
					<div>
						<label for="sh-{ctrl.key}" class="mb-0.5 flex justify-between text-xs font-medium">
							{ctrl.label}
							<span class="font-mono text-muted-foreground">
								{ctrl.key === 'x'
									? shX
									: ctrl.key === 'y'
										? shY
										: ctrl.key === 'blur'
											? shBlur
											: shSpread}px
							</span>
						</label>
						{#if ctrl.key === 'x'}
							<input
								id="sh-x"
								type="range"
								min={ctrl.min}
								max={ctrl.max}
								bind:value={shX}
								class={sliderCls}
							/>
						{:else if ctrl.key === 'y'}
							<input
								id="sh-y"
								type="range"
								min={ctrl.min}
								max={ctrl.max}
								bind:value={shY}
								class={sliderCls}
							/>
						{:else if ctrl.key === 'blur'}
							<input
								id="sh-blur"
								type="range"
								min={ctrl.min}
								max={ctrl.max}
								bind:value={shBlur}
								class={sliderCls}
							/>
						{:else}
							<input
								id="sh-spread"
								type="range"
								min={ctrl.min}
								max={ctrl.max}
								bind:value={shSpread}
								class={sliderCls}
							/>
						{/if}
					</div>
				{/each}
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<label for="sh-opacity" class="flex grow items-center gap-2 text-xs font-medium">
					Opacity
					<input
						id="sh-opacity"
						type="range"
						min="0"
						max="1"
						step="0.05"
						bind:value={shOpacity}
						class={sliderCls}
					/>
					<span class="font-mono text-muted-foreground">{shOpacity.toFixed(2)}</span>
				</label>
				<label for="sh-color" class="flex items-center gap-1.5 text-xs font-medium">
					Color
					<input id="sh-color" type="color" bind:value={shColor} class={colorCls} />
				</label>
				<label class="flex cursor-pointer items-center gap-1.5 text-xs font-medium">
					<input
						type="checkbox"
						bind:checked={shInset}
						class="size-4 cursor-pointer appearance-none rounded border border-input bg-background transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
					/>
					Inset
				</label>
			</div>

			<div class="space-y-2">
				<div class="relative rounded-lg bg-muted p-3">
					<code class="block pr-14 font-mono text-xs break-all">{shadowDecl}</code>
					<span class="absolute top-2 right-2"
						><CopyButton text={shadowDecl} label="box-shadow CSS" /></span
					>
				</div>
				<div class="relative rounded-lg bg-muted p-3">
					<code class="block pr-14 font-mono text-[11px] break-all text-muted-foreground"
						>{shadowTw}</code
					>
					<span class="absolute top-2 right-2"
						><CopyButton text={shadowTw} label="Tailwind arbitrary shadow" /></span
					>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
