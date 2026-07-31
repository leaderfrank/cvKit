<script lang="ts">
	import Hash from '@lucide/svelte/icons/hash';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { md5 } from '$lib/tools/md5';

	let input = $state('The quick brown fox jumps over the lazy dog');
	let digests = $state<{ algo: string; hex: string }[]>([]);
	let settled = $state(false);

	function bufferToHex(buf: ArrayBuffer): string {
		return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	async function computeAll(value: string) {
		const encoded = new TextEncoder().encode(value);
		const rows: { algo: string; hex: string }[] = [{ algo: 'MD5', hex: md5(value) }];
		if (crypto?.subtle) {
			for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
				const digest = await crypto.subtle.digest(algo, encoded);
				rows.push({ algo, hex: bufferToHex(digest) });
			}
		} else {
			rows.push({
				algo: 'SHA-*',
				hex: 'Unavailable — crypto.subtle requires a secure context (https/localhost)'
			});
		}
		return rows;
	}

	// Recompute on input change; the token guards against out-of-order async resolves
	let runToken = 0;
	$effect(() => {
		const value = input;
		const token = ++runToken;
		settled = false;
		void computeAll(value).then((rows) => {
			if (token === runToken) {
				digests = rows;
				settled = true;
			}
		});
	});
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Hash class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Hash Generator</h3>
			<p class="text-xs text-muted-foreground">
				MD5 (RFC 1321, implemented from scratch) + WebCrypto SHA digests.
			</p>
		</div>
	</header>

	<label for="hash-input" class="sr-only">Text to hash</label>
	<textarea
		id="hash-input"
		bind:value={input}
		rows="3"
		spellcheck="false"
		placeholder="Text to hash…"
		class="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
	></textarea>

	<ul class="mt-3 space-y-1.5" aria-live="polite" aria-busy={!settled}>
		{#each digests as row (row.algo)}
			<li
				class="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-2"
			>
				<Badge variant="secondary" class="shrink-0 font-mono text-[10px]">{row.algo}</Badge>
				<span
					class="min-w-0 flex-1 overflow-x-auto font-mono text-[11px] whitespace-nowrap text-foreground/90 select-all"
				>
					{row.hex}
				</span>
				<CopyButton text={row.hex} label="{row.algo} digest" class="shrink-0" />
			</li>
		{/each}
	</ul>
</div>
