<script lang="ts">
	import QrCode from '@lucide/svelte/icons/qr-code';
	import Download from '@lucide/svelte/icons/download';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	let input = $state('https://ghaleb.dev');
	let url = $state<string | null>(null);
	let loading = $state(false);
	let failed = $state(false);

	function buildUrl(value: string): string {
		return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(value)}`;
	}

	$effect(() => {
		const value = input.trim();
		if (!value) {
			url = null;
			loading = false;
			failed = false;
			return;
		}
		const timer = setTimeout(() => {
			url = buildUrl(value);
			loading = true;
			failed = false;
		}, 500);
		return () => clearTimeout(timer);
	});
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<QrCode class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">QR Code Generator</h3>
			<p class="text-xs text-muted-foreground">
				Text or URL → scannable QR, debounced as you type.
			</p>
		</div>
	</header>

	<Input
		bind:value={input}
		type="text"
		placeholder="https://your.link/anything"
		aria-label="QR code content"
	/>

	<div class="mt-3 flex justify-center" aria-live="polite">
		{#if url}
			<div class="relative">
				{#if loading}
					<Skeleton class="size-[220px] rounded-xl" />
				{/if}
				{#key url}
					<img
						src={url}
						alt="QR code for the entered text"
						width="220"
						height="220"
						class={loading || failed ? 'hidden' : 'rounded-xl border border-border/60 bg-white p-1'}
						onload={() => (loading = false)}
						onerror={() => {
							loading = false;
							failed = true;
						}}
					/>
				{/key}
			</div>
		{:else}
			<div
				class="grid size-[220px] place-items-center rounded-xl border border-dashed border-border bg-muted/40"
			>
				<div class="text-center">
					<QrCode class="mx-auto size-10 text-muted-foreground/50" />
					<p class="mt-2 text-xs text-muted-foreground">Enter text to generate a QR code</p>
				</div>
			</div>
		{/if}
	</div>

	{#if failed}
		<p
			class="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center font-mono text-xs text-destructive"
			role="alert"
		>
			QR API unreachable — check connection
		</p>
	{:else if url && !loading}
		<div class="mt-2 flex justify-center">
			<Button size="sm" variant="outline" href={url} target="_blank" rel="noopener noreferrer">
				<Download class="size-3.5" />
				Download PNG
			</Button>
		</div>
	{/if}

	<p class="mt-3 text-center font-mono text-[10px] text-muted-foreground">
		Image rendered by the goqr.me API — the only network call in this toolbox.
	</p>
</div>
