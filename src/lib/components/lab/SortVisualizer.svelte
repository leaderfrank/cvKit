<script lang="ts">
	import { ALGORITHMS, randomArray, type SortAlgorithm, type SortStep } from '$lib/lab/sorting';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import StepForward from '@lucide/svelte/icons/step-forward';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	type Status = 'idle' | 'running' | 'paused' | 'done';

	const idleStep = (arr: number[]): SortStep => ({
		array: [...arr],
		comparing: [],
		swapped: [],
		done: [],
		comparisons: 0,
		writes: 0
	});

	let algorithm = $state<SortAlgorithm>('bubble');
	let size = $state(32);
	let speed = $state(60);
	const initial = randomArray(32);
	let base = $state<number[]>(initial);
	let current = $state<SortStep>(idleStep(initial));
	let status = $state<Status>('idle');
	let steps = $state(0);

	// Non-reactive engine handle — generator objects must not be proxied by $state.
	let gen: Generator<SortStep, void, unknown> | null = null;

	/** Speed slider 1–100 mapped to a 400–5 ms delay between steps. */
	const delayMs = $derived(Math.round(400 - ((speed - 1) * 395) / 99));
	const active = $derived(ALGORITHMS[algorithm]);

	function reset() {
		gen = null;
		current = idleStep(base);
		steps = 0;
		status = 'idle';
	}

	function shuffle() {
		base = randomArray(size);
		reset();
	}

	/** Pull one frame out of the generator. Returns false when the sort finished. */
	function advance(): boolean {
		gen ??= active.run(base);
		const r = gen.next();
		if (r.done) {
			status = 'done'; // generator's last yielded step already marks every bar done
			return false;
		}
		current = r.value;
		steps++;
		return true;
	}

	function togglePlay() {
		if (status === 'running') {
			status = 'paused';
			return;
		}
		if (status === 'done') reset(); // replay the same array
		gen ??= active.run(base);
		status = 'running';
	}

	function stepOnce() {
		if (status === 'running' || status === 'done') return;
		const more = advance();
		if (more) status = 'paused';
	}

	// Auto-play loop: re-arms itself, fully cleaned up on status change / destroy.
	$effect(() => {
		if (status !== 'running') return;
		let cancelled = false;
		let id: ReturnType<typeof setTimeout> | undefined;
		const loop = () => {
			if (cancelled) return;
			const more = advance();
			if (more && !cancelled) id = setTimeout(loop, delayMs);
		};
		id = setTimeout(loop, delayMs);
		return () => {
			cancelled = true;
			if (id !== undefined) clearTimeout(id);
		};
	});

	function barClass(i: number): string {
		if (current.done.includes(i)) return 'bg-success';
		if (current.swapped.includes(i)) return 'bg-destructive';
		if (current.comparing.includes(i)) return 'bg-primary';
		return 'bg-muted-foreground/30';
	}
</script>

<div class="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
	<!-- Controls -->
	<div class="flex flex-wrap items-end gap-x-5 gap-y-4">
		<div class="flex flex-col gap-1.5">
			<label
				for="sort-algorithm"
				class="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
				>Algorithm</label
			>
			<select
				id="sort-algorithm"
				value={algorithm}
				onchange={(e) => {
					algorithm = e.currentTarget.value as SortAlgorithm;
					reset();
				}}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm"
			>
				{#each Object.entries(ALGORITHMS) as [key, def] (key)}
					<option value={key}>{def.label}</option>
				{/each}
			</select>
		</div>

		<div class="flex min-w-32 flex-col gap-1.5">
			<label
				for="sort-size"
				class="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
				>Size · <span class="text-foreground tabular-nums">{size}</span></label
			>
			<input
				id="sort-size"
				type="range"
				min="10"
				max="60"
				step="1"
				value={size}
				oninput={(e) => {
					size = Number(e.currentTarget.value);
					base = randomArray(size);
					reset();
				}}
				class="h-9 accent-primary"
			/>
		</div>

		<div class="flex min-w-32 flex-col gap-1.5">
			<label
				for="sort-speed"
				class="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
				>Speed · <span class="text-foreground tabular-nums">~{delayMs}ms</span></label
			>
			<input
				id="sort-speed"
				type="range"
				min="1"
				max="100"
				step="1"
				bind:value={speed}
				class="h-9 accent-primary"
			/>
		</div>

		<div class="ms-auto flex flex-wrap gap-2">
			<Button variant="outline" size="sm" onclick={shuffle} aria-label="Shuffle the array">
				<Shuffle class="size-4" />Shuffle
			</Button>
			<Button size="sm" onclick={togglePlay} aria-label={status === 'running' ? 'Pause' : 'Play'}>
				{#if status === 'running'}
					<Pause class="size-4" />Pause
				{:else}
					<Play class="size-4" />{status === 'done' ? 'Replay' : 'Play'}
				{/if}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={stepOnce}
				disabled={status === 'running' || status === 'done'}
				aria-label="Step forward once"
			>
				<StepForward class="size-4" />Step
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onclick={reset}
				disabled={status === 'idle'}
				aria-label="Reset to the unsorted array"
			>
				<RotateCcw class="size-4" />Reset
			</Button>
		</div>
	</div>

	<p class="mt-3 font-mono text-[11px] text-muted-foreground">
		{active.complexity} · bars are random values 5–100 · every frame is a generator step
	</p>

	<!-- Bar chart -->
	<div
		class="mt-4 flex h-56 items-end gap-[2px]"
		role="img"
		aria-label="Bar chart of the {current.array.length} values being sorted with {active.label}"
	>
		{#each current.array as v, i (i)}
			<div
				aria-hidden="true"
				class={cn('flex-1 rounded-t transition-all duration-150', barClass(i))}
				style:height="{v}%"
			></div>
		{/each}
	</div>

	<!-- Legend -->
	<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
		<span class="inline-flex items-center gap-1.5"
			><span class="size-2.5 rounded-full bg-muted-foreground/30"></span>untouched</span
		>
		<span class="inline-flex items-center gap-1.5"
			><span class="size-2.5 rounded-full bg-primary"></span>comparing</span
		>
		<span class="inline-flex items-center gap-1.5"
			><span class="size-2.5 rounded-full bg-destructive"></span>swapped / written</span
		>
		<span class="inline-flex items-center gap-1.5"
			><span class="size-2.5 rounded-full bg-success"></span>final position</span
		>
	</div>

	<!-- Stats -->
	<div class="mt-4 border-t border-border/60 pt-4" aria-live="polite">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div>
				<p class="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
					Comparisons
				</p>
				<p class="font-mono text-lg tabular-nums">{current.comparisons}</p>
			</div>
			<div>
				<p class="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Writes</p>
				<p class="font-mono text-lg tabular-nums">{current.writes}</p>
			</div>
			<div>
				<p class="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Steps</p>
				<p class="font-mono text-lg tabular-nums">{steps}</p>
			</div>
			<div>
				<p class="mb-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
					Status
				</p>
				{#if status === 'done'}
					<Badge variant="secondary" class="border-success/30 bg-success/10 text-success"
						>Sorted ✓</Badge
					>
				{:else if status === 'running'}
					<Badge>Running</Badge>
				{:else if status === 'paused'}
					<Badge variant="outline" class="border-warning/40 text-warning">Paused</Badge>
				{:else}
					<Badge variant="outline">Idle</Badge>
				{/if}
			</div>
		</div>
	</div>
</div>
