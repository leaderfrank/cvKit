<script lang="ts">
	import { onDestroy } from 'svelte';
	import { debounce, throttleLeading } from '$lib/lab/timing';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Search from '@lucide/svelte/icons/search';

	const MAX_TICKS = 28;
	const DEBOUNCE_MS = 400;
	const THROTTLE_MS = 250;

	let query = $state('');
	let keystrokes = $state(0);
	let debouncedCount = $state(0);
	let throttledCount = $state(0);
	let inputLane = $state<number[]>([]);
	let debouncedLane = $state<number[]>([]);
	let throttledLane = $state<number[]>([]);
	let lastDebounced = $state<string | null>(null);
	let lastThrottled = $state<string | null>(null);

	let tickSeq = 0;
	function pushTick(lane: number[]): number[] {
		return [...lane, ++tickSeq].slice(-MAX_TICKS);
	}

	// One wrapped function each — created per component instance, cancelled on destroy.
	const debouncedFire = debounce((value: string) => {
		debouncedCount++;
		debouncedLane = pushTick(debouncedLane);
		lastDebounced = value;
	}, DEBOUNCE_MS);

	const throttledFire = throttleLeading((value: string) => {
		throttledCount++;
		throttledLane = pushTick(throttledLane);
		lastThrottled = value;
	}, THROTTLE_MS);

	onDestroy(() => {
		debouncedFire.cancel();
		throttledFire.cancel();
	});

	function handleInput(e: Event) {
		const v = (e.currentTarget as HTMLInputElement).value;
		query = v;
		keystrokes++;
		inputLane = pushTick(inputLane);
		debouncedFire(v);
		throttledFire(v);
	}

	function reset() {
		debouncedFire.cancel();
		throttledFire.cancel();
		query = '';
		keystrokes = 0;
		debouncedCount = 0;
		throttledCount = 0;
		inputLane = [];
		debouncedLane = [];
		throttledLane = [];
		lastDebounced = null;
		lastThrottled = null;
	}

	/** Share of input events that actually became debounced calls. */
	const debounceRatio = $derived(
		keystrokes === 0 ? 0 : Math.round((debouncedCount / keystrokes) * 100)
	);

	const lanes = $derived([
		{
			label: 'Input events',
			hint: 'every keypress, unfiltered',
			ticks: inputLane,
			dot: 'bg-muted-foreground/60',
			count: keystrokes
		},
		{
			label: `Debounced · ${DEBOUNCE_MS}ms`,
			hint: lastDebounced === null ? 'fires when you pause' : `fired: "${lastDebounced}"`,
			ticks: debouncedLane,
			dot: 'bg-primary',
			count: debouncedCount
		},
		{
			label: `Throttled · ${THROTTLE_MS}ms`,
			hint: lastThrottled === null ? 'fires at once, then paces' : `last: "${lastThrottled}"`,
			ticks: throttledLane,
			dot: 'bg-chart-2',
			count: throttledCount
		}
	]);
</script>

<div class="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
	<!-- Search box + reset -->
	<div class="flex flex-wrap items-center gap-3">
		<div class="relative min-w-52 flex-1">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				class="ps-9"
				value={query}
				oninput={handleInput}
				placeholder="Type fast…"
				aria-label="Type fast to simulate search events"
			/>
		</div>
		<Button variant="outline" size="sm" onclick={reset} aria-label="Reset counters and lanes">
			<RotateCcw class="size-4" />Reset
		</Button>
	</div>

	<!-- Counters + insight -->
	<div
		class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground"
	>
		<span>keystrokes: <span class="text-foreground tabular-nums">{keystrokes}</span></span>
		<span>debounced calls: <span class="text-primary tabular-nums">{debouncedCount}</span></span>
		<span>throttled calls: <span class="text-chart-2 tabular-nums">{throttledCount}</span></span>
	</div>
	<p class="mt-2 text-xs text-muted-foreground" role="status" aria-live="polite">
		{#if keystrokes === 0}
			Start typing — each keystroke is an event; only some survive the gates.
		{:else if query !== lastDebounced && debouncedCount < keystrokes}
			Waiting for you to pause… debounce cut downstream calls to
			<span class="font-semibold text-foreground">{debounceRatio}%</span> of input events.
		{:else}
			Debounce cut downstream calls to
			<span class="font-semibold text-foreground">{debounceRatio}%</span> of input events.
		{/if}
	</p>

	<!-- Event lanes -->
	<div class="mt-4 space-y-2">
		{#each lanes as lane (lane.label)}
			<div
				class="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
			>
				<div class="w-36 shrink-0 sm:w-44">
					<p class="font-mono text-[11px] font-semibold">{lane.label}</p>
					<p class="truncate text-[11px] text-muted-foreground">{lane.hint}</p>
				</div>
				<div class="flex h-6 min-w-0 flex-1 items-center gap-1 overflow-hidden">
					{#if lane.ticks.length === 0}
						<span class="text-[11px] text-muted-foreground">—</span>
					{/if}
					{#each lane.ticks as t (t)}
						<span class={cn('tick size-2.5 shrink-0 rounded-full', lane.dot)}></span>
					{/each}
				</div>
				<span class="w-8 shrink-0 text-right font-mono text-sm tabular-nums">{lane.count}</span>
			</div>
		{/each}
	</div>

	<!-- When to use which -->
	<p class="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
		Use <span class="font-medium text-foreground">debounce</span> when only the final state matters
		— search-as-you-type after the user pauses, auto-save, resize handlers. Use
		<span class="font-medium text-foreground">throttle</span> when a stream needs a steady maximum cadence
		while it flows — scroll spies, mousemove, rate-limited analytics pings.
	</p>
</div>

<style>
	/* Only the newest dot pops in: the keyed {#each} re-creates just that node. */
	.tick {
		transform-origin: center;
	}
	@media (prefers-reduced-motion: no-preference) {
		.tick {
			animation: tick-pop 0.3s ease-out;
		}
	}
	@keyframes tick-pop {
		0% {
			transform: scale(2.2);
			opacity: 0.4;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
