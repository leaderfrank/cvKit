<script lang="ts">
	import Binary from '@lucide/svelte/icons/binary';
	import ArrowRightLeft from '@lucide/svelte/icons/arrow-right-left';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { cn } from '$lib/utils.js';

	let tab = $state('base64');

	let b64Input = $state('Hello, مرحبا — unicode ✓');
	let b64Direction = $state<'encode' | 'decode'>('encode');

	let urlInput = $state('https://ghaleb.dev/search?q=svelte kit&lang=en');
	let urlDirection = $state<'encode' | 'decode'>('encode');

	function b64Encode(s: string): string {
		const bytes = new TextEncoder().encode(s);
		let bin = '';
		for (const b of bytes) bin += String.fromCharCode(b);
		return btoa(bin);
	}

	function b64Decode(s: string): string {
		const bin = atob(s.trim().replace(/\s+/g, ''));
		const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	}

	function process(
		value: string,
		direction: 'encode' | 'decode',
		kind: 'base64' | 'url'
	): { ok: boolean; text: string } {
		if (!value) return { ok: true, text: '' };
		try {
			if (kind === 'base64') {
				return { ok: true, text: direction === 'encode' ? b64Encode(value) : b64Decode(value) };
			}
			return {
				ok: true,
				text: direction === 'encode' ? encodeURIComponent(value) : decodeURIComponent(value)
			};
		} catch {
			return {
				ok: false,
				text:
					kind === 'base64'
						? 'Invalid Base64 input — check padding and stray characters.'
						: 'Malformed percent-encoding (e.g. a dangling %).'
			};
		}
	}

	const b64Result = $derived(process(b64Input, b64Direction, 'base64'));
	const urlResult = $derived(process(urlInput, urlDirection, 'url'));

	function swapBase64() {
		if (!b64Result.ok) return;
		b64Input = b64Result.text;
		b64Direction = b64Direction === 'encode' ? 'decode' : 'encode';
	}

	function swapUrl() {
		if (!urlResult.ok) return;
		urlInput = urlResult.text;
		urlDirection = urlDirection === 'encode' ? 'decode' : 'encode';
	}

	const dirBtn = (active: boolean) =>
		cn(
			'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors',
			active
				? 'bg-primary/10 text-primary'
				: 'text-muted-foreground hover:bg-accent hover:text-foreground'
		);
	const textareaCls =
		'w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed break-all shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Binary class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Base64 / URL Codec</h3>
			<p class="text-xs text-muted-foreground">
				Unicode-safe encoding and decoding, both directions.
			</p>
		</div>
	</header>

	<Tabs.Root bind:value={tab}>
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="base64">Base64</Tabs.Trigger>
			<Tabs.Trigger value="url">URL</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="base64" class="mt-3 space-y-2">
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-1" role="group" aria-label="Base64 direction">
					<button
						type="button"
						class={dirBtn(b64Direction === 'encode')}
						aria-pressed={b64Direction === 'encode'}
						onclick={() => (b64Direction = 'encode')}>Encode</button
					>
					<button
						type="button"
						class={dirBtn(b64Direction === 'decode')}
						aria-pressed={b64Direction === 'decode'}
						onclick={() => (b64Direction = 'decode')}>Decode</button
					>
				</div>
				<span class="ml-auto">
					<Button
						size="sm"
						variant="ghost"
						class="h-7 gap-1.5 text-xs"
						onclick={swapBase64}
						disabled={!b64Result.ok}
					>
						<ArrowRightLeft class="size-3.5" />
						Swap
					</Button>
				</span>
			</div>
			<label for="b64-input" class="sr-only">Base64 input</label>
			<textarea
				id="b64-input"
				rows="3"
				spellcheck="false"
				bind:value={b64Input}
				placeholder={b64Direction === 'encode' ? 'Text to encode…' : 'Base64 to decode…'}
				class={textareaCls}
			></textarea>
			<div aria-live="polite">
				{#if !b64Result.ok}
					<p
						class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive"
						role="alert"
					>
						{b64Result.text}
					</p>
				{:else if b64Result.text}
					<div class="relative rounded-lg bg-muted p-3">
						<p class="pr-14 font-mono text-xs leading-relaxed break-all">{b64Result.text}</p>
						<span class="absolute top-2 right-2"
							><CopyButton text={b64Result.text} label="Base64 output" /></span
						>
					</div>
				{/if}
			</div>
		</Tabs.Content>

		<Tabs.Content value="url" class="mt-3 space-y-2">
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-1" role="group" aria-label="URL direction">
					<button
						type="button"
						class={dirBtn(urlDirection === 'encode')}
						aria-pressed={urlDirection === 'encode'}
						onclick={() => (urlDirection = 'encode')}>Encode</button
					>
					<button
						type="button"
						class={dirBtn(urlDirection === 'decode')}
						aria-pressed={urlDirection === 'decode'}
						onclick={() => (urlDirection = 'decode')}>Decode</button
					>
				</div>
				<span class="ml-auto">
					<Button
						size="sm"
						variant="ghost"
						class="h-7 gap-1.5 text-xs"
						onclick={swapUrl}
						disabled={!urlResult.ok}
					>
						<ArrowRightLeft class="size-3.5" />
						Swap
					</Button>
				</span>
			</div>
			<label for="url-input" class="sr-only">URL input</label>
			<textarea
				id="url-input"
				rows="3"
				spellcheck="false"
				bind:value={urlInput}
				placeholder={urlDirection === 'encode'
					? 'Text to encode…'
					: 'Percent-encoded text to decode…'}
				class={textareaCls}
			></textarea>
			<div aria-live="polite">
				{#if !urlResult.ok}
					<p
						class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive"
						role="alert"
					>
						{urlResult.text}
					</p>
				{:else if urlResult.text}
					<div class="relative rounded-lg bg-muted p-3">
						<p class="pr-14 font-mono text-xs leading-relaxed break-all">{urlResult.text}</p>
						<span class="absolute top-2 right-2"
							><CopyButton text={urlResult.text} label="URL output" /></span
						>
					</div>
				{/if}
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
