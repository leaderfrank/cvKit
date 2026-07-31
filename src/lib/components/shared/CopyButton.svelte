<script lang="ts">
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { cn } from '$lib/utils.js';

	let {
		text,
		label,
		class: className
	}: { text: string; label?: string; class?: string } = $props();

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// Fallback for non-secure contexts
			const textarea = document.createElement('textarea');
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			textarea.remove();
		}
		copied = true;
		clearTimeout(timeout);
		timeout = setTimeout(() => (copied = false), 1800);
	}
</script>

<button
	type="button"
	onclick={copy}
	aria-label={label ? `Copy ${label}` : 'Copy to clipboard'}
	class={cn(
		'inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/60 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground',
		copied && 'border-success/60 text-success hover:text-success',
		className
	)}
>
	{#if copied}
		<Check class="size-3.5" />
		<span>Copied</span>
	{:else}
		<Copy class="size-3.5" />
		<span>Copy</span>
	{/if}
</button>
