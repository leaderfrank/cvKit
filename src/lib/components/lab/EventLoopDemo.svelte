<script lang="ts">
	import { SCENARIOS, GOLDEN_RULE } from '$lib/lab/event-loop';
	import { cn } from '$lib/utils.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Zap from '@lucide/svelte/icons/zap';

	let scenarioId = $state(SCENARIOS[0].id);
	let stepIdx = $state(0);
	let playing = $state(false);

	const scenario = $derived(SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]);
	const total = $derived(scenario.steps.length);
	const step = $derived(scenario.steps[stepIdx]);

	// Scenario switch restarts the walkthrough.
	$effect(() => {
		void scenarioId;
		stepIdx = 0;
		playing = false;
	});

	// Auto-play: one beat every 1.4 s, stopping on the last step.
	$effect(() => {
		if (!playing) return;
		const idx = stepIdx; // tracked: advancing re-arms this timer
		const id = setTimeout(() => {
			if (idx < total - 1) stepIdx++;
			else playing = false;
		}, 1400);
		return () => clearTimeout(id);
	});

	function prev() {
		playing = false;
		if (stepIdx > 0) stepIdx--;
	}

	function next() {
		if (stepIdx < total - 1) {
			stepIdx++;
		} else {
			playing = false;
		}
	}

	function togglePlay() {
		if (playing) {
			playing = false;
			return;
		}
		if (stepIdx >= total - 1) stepIdx = 0; // replay from the top
		playing = true;
	}

	function reset() {
		playing = false;
		stepIdx = 0;
	}
</script>

{#snippet chip(text: string, active: boolean)}
	<span
		class={cn(
			'rounded-md bg-muted px-2 py-1 font-mono text-[11px] leading-tight break-all text-foreground/90',
			active && 'bg-primary/15 text-foreground ring-1 ring-primary/40'
		)}>{text}</span
	>
{/snippet}

<div class="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
	<Tabs.Root bind:value={scenarioId}>
		<Tabs.List aria-label="Event loop scenario" class="h-auto w-full flex-wrap justify-start">
			{#each SCENARIOS as s (s.id)}
				<Tabs.Trigger
					value={s.id}
					class="h-auto min-w-0 flex-1 basis-36 px-2 py-1.5 text-center text-xs leading-tight whitespace-normal"
					>{s.title}</Tabs.Trigger
				>
			{/each}
		</Tabs.List>
	</Tabs.Root>

	<div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
		<!-- Code under test -->
		<div class="overflow-hidden rounded-lg border border-border/60 bg-muted/30">
			<div class="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-1.5">
				<span class="font-mono text-[11px] text-muted-foreground">main.js</span>
				<Badge variant="outline" class="font-mono text-[10px] font-normal">
					expected: {scenario.expected}
				</Badge>
			</div>
			<ol class="overflow-x-auto p-2 font-mono text-xs leading-6">
				{#each scenario.codeLines as lineText, i (i)}
					<li
						class={cn(
							'flex gap-3 rounded px-2 whitespace-pre',
							i === step.line && 'bg-primary/10 font-semibold text-primary ring-1 ring-primary/25'
						)}
					>
						<span class="w-4 shrink-0 text-right text-muted-foreground/50 select-none">{i + 1}</span
						><code>{lineText}</code>
					</li>
				{/each}
			</ol>
		</div>

		<!-- Explanation -->
		<div class="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4">
			<p class="text-sm text-muted-foreground">{scenario.summary}</p>
			<p class="min-h-28 text-sm leading-relaxed sm:min-h-20" role="status" aria-live="polite">
				{step.description}
			</p>
			<p
				class="mt-auto rounded-md border border-warning/30 bg-warning/10 px-3 py-2 font-mono text-[11px] leading-relaxed text-warning"
			>
				<Zap class="me-1 inline size-3.5 -translate-y-px" />{GOLDEN_RULE}
			</p>
		</div>
	</div>

	<!-- The four queues -->
	<div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
		<div class="rounded-lg border border-border/60 bg-muted/30 p-3">
			<p
				class="mb-2 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
			>
				Call Stack
			</p>
			<div class="flex flex-col gap-1.5">
				{#each [...step.stack].reverse() as frame, i (frame + i)}
					{@render chip(frame, i === 0 && step.stack.length > 0)}
				{:else}
					<span class="text-[11px] text-muted-foreground">empty</span>
				{/each}
			</div>
		</div>
		<div class="rounded-lg border border-border/60 bg-muted/30 p-3">
			<p
				class="mb-2 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
			>
				Microtask Queue
			</p>
			<div class="flex flex-col gap-1.5">
				{#each step.micro as m, i (m + i)}
					{@render chip(m, i === 0)}
				{:else}
					<span class="text-[11px] text-muted-foreground">empty</span>
				{/each}
			</div>
		</div>
		<div class="rounded-lg border border-border/60 bg-muted/30 p-3">
			<p
				class="mb-2 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
			>
				Task Queue
			</p>
			<div class="flex flex-col gap-1.5">
				{#each step.macro as m, i (m + i)}
					{@render chip(m, i === 0)}
				{:else}
					<span class="text-[11px] text-muted-foreground">empty</span>
				{/each}
			</div>
		</div>
		<div class="rounded-lg border border-border/60 bg-muted/30 p-3">
			<p
				class="mb-2 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
			>
				Console
			</p>
			<div class="flex flex-col gap-1.5">
				{#each step.output as o, i (o + i)}
					{@render chip(o, i === step.output.length - 1)}
				{:else}
					<span class="text-[11px] text-muted-foreground">no output yet</span>
				{/each}
			</div>
		</div>
	</div>

	<!-- Transport controls -->
	<div class="mt-5 flex flex-wrap items-center gap-3">
		<div class="flex gap-2">
			<Button
				variant="outline"
				size="sm"
				onclick={prev}
				disabled={stepIdx === 0}
				aria-label="Previous step"
			>
				<ChevronLeft class="size-4" />Prev
			</Button>
			<Button
				size="sm"
				onclick={togglePlay}
				aria-label={playing ? 'Pause auto-play' : 'Play auto-play'}
			>
				{#if playing}
					<Pause class="size-4" />Pause
				{:else}
					<Play class="size-4" />Play
				{/if}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={next}
				disabled={stepIdx >= total - 1}
				aria-label="Next step"
			>
				Next<ChevronRight class="size-4" />
			</Button>
			<Button variant="ghost" size="sm" onclick={reset} aria-label="Reset to first step">
				<RotateCcw class="size-4" />Reset
			</Button>
		</div>
		<div
			class="ms-auto flex min-w-40 flex-1 items-center gap-3 sm:max-w-72"
			aria-label="Step progress"
		>
			<div class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
				<div
					class="h-full rounded-full bg-primary transition-[width] duration-300"
					style:width="{((stepIdx + 1) / total) * 100}%"
				></div>
			</div>
			<span class="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums"
				>step {stepIdx + 1}/{total}</span
			>
		</div>
	</div>
</div>
