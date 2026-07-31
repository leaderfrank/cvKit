<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';

	let nowSec = $state(Math.floor(Date.now() / 1000));

	$effect(() => {
		const timer = setInterval(() => {
			nowSec = Math.floor(Date.now() / 1000);
		}, 1000);
		return () => clearInterval(timer);
	});

	let unixInput = $state(String(Math.floor(Date.now() / 1000)));
	let dateInput = $state('');

	function relative(date: Date, now: number): string {
		const diffSec = Math.round((date.getTime() - now) / 1000);
		const abs = Math.abs(diffSec);
		const units: [string, number][] = [
			['year', 31_556_952],
			['month', 2_629_746],
			['week', 604_800],
			['day', 86_400],
			['hour', 3600],
			['minute', 60]
		];
		if (abs < 45) return diffSec < 0 ? 'just now' : 'in a few seconds';
		for (const [name, secs] of units) {
			if (abs >= secs) {
				const n = Math.round(abs / secs);
				const label = n === 1 ? name : `${name}s`;
				return diffSec < 0 ? `${n} ${label} ago` : `in ${n} ${label}`;
			}
		}
		return 'just now';
	}

	/** Auto-detect seconds vs milliseconds by magnitude. */
	const fromUnix = $derived.by(() => {
		const raw = unixInput.trim();
		if (!/^-?\d+$/.test(raw)) return null;
		const value = Number(raw);
		if (!Number.isSafeInteger(value)) return null;
		const ms = Math.abs(value) >= 1e12 ? value : value * 1000;
		const date = new Date(ms);
		if (Number.isNaN(date.getTime())) return null;
		return { date, wasMs: Math.abs(value) >= 1e12 };
	});

	const fromDate = $derived.by(() => {
		if (!dateInput) return null;
		const ms = new Date(dateInput).getTime();
		if (Number.isNaN(ms)) return null;
		return { s: Math.floor(ms / 1000), ms };
	});
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Clock class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Unix Timestamp</h3>
			<p class="text-xs text-muted-foreground">Live epoch clock with two-way conversion.</p>
		</div>
	</header>

	<div
		class="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted px-3 py-2.5"
	>
		<div>
			<p class="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
				Current unix time
			</p>
			<p class="font-mono text-lg font-semibold tabular-nums" aria-live="off">{nowSec}</p>
		</div>
		<CopyButton text={String(nowSec)} label="current unix time" />
	</div>

	<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<label for="unix-input" class="mb-1 block text-xs font-medium">Unix → date</label>
			<input
				id="unix-input"
				type="text"
				inputmode="numeric"
				bind:value={unixInput}
				placeholder="1752000000"
				class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono text-sm shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
			/>
			<div class="mt-2 space-y-1 text-xs" aria-live="polite">
				{#if fromUnix}
					{@const d = fromUnix.date}
					<div class="flex items-baseline justify-between gap-2">
						<span class="text-muted-foreground">UTC</span>
						<span class="text-right font-mono break-all">{d.toUTCString()}</span>
					</div>
					<div class="flex items-baseline justify-between gap-2">
						<span class="text-muted-foreground">Local</span>
						<span class="text-right font-mono break-all">{d.toLocaleString()}</span>
					</div>
					<div class="flex items-baseline justify-between gap-2">
						<span class="text-muted-foreground">ISO</span>
						<span class="text-right font-mono break-all">{d.toISOString()}</span>
					</div>
					<div class="flex items-baseline justify-between gap-2">
						<span class="text-muted-foreground">Relative</span>
						<span class="text-right font-mono">{relative(d, nowSec * 1000)}</span>
					</div>
					<p class="pt-1 text-[10px] text-muted-foreground">
						Interpreted as {fromUnix.wasMs ? 'milliseconds' : 'seconds'} (auto-detected)
					</p>
				{:else}
					<p class="text-muted-foreground">
						{unixInput.trim()
							? 'Not a valid integer timestamp.'
							: 'Enter unix seconds or milliseconds.'}
					</p>
				{/if}
			</div>
		</div>

		<div>
			<label for="date-input" class="mb-1 block text-xs font-medium">Date → unix</label>
			<input
				id="date-input"
				type="datetime-local"
				bind:value={dateInput}
				class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 font-mono text-sm shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
			/>
			<div class="mt-2 space-y-1 text-xs" aria-live="polite">
				{#if fromDate}
					<div class="flex items-center justify-between gap-2">
						<span class="text-muted-foreground">Seconds</span>
						<span class="flex items-center gap-1.5 font-mono">
							{fromDate.s}
							<CopyButton text={String(fromDate.s)} label="unix seconds" />
						</span>
					</div>
					<div class="flex items-center justify-between gap-2">
						<span class="text-muted-foreground">Milliseconds</span>
						<span class="flex items-center gap-1.5 font-mono">
							{fromDate.ms}
							<CopyButton text={String(fromDate.ms)} label="unix milliseconds" />
						</span>
					</div>
				{:else}
					<p class="text-muted-foreground">Pick a date and time above.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
