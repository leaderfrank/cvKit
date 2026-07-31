<script lang="ts">
	import GitCompare from '@lucide/svelte/icons/git-compare';
	import Play from '@lucide/svelte/icons/play';
	import { Button } from '$lib/components/ui/button/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { diffLines, DIFF_LINE_LIMIT, type DiffResult } from '$lib/tools/diff';
	import { cn } from '$lib/utils.js';

	const SAMPLE_A = `export function greet(name) {
	console.log('Hello ' + name);
	return true;
}

const user = 'world';
greet(user);`;

	const SAMPLE_B = `export function greet(name: string): boolean {
	console.log(\`Hello, \${name}!\`);
	return true;
}

const user = 'Mohammed';
greet(user);
greet('again');`;

	let original = $state(SAMPLE_A);
	let changed = $state(SAMPLE_B);
	let result = $state<DiffResult | null>(null);

	function compute() {
		result = diffLines(original, changed);
	}

	function asText(): string {
		if (!result) return '';
		return result.lines
			.map((l) =>
				l.type === 'add' ? `+ ${l.text}` : l.type === 'del' ? `- ${l.text}` : `  ${l.text}`
			)
			.join('\n');
	}

	const textareaCls =
		'min-h-28 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

	const needsTruncation = $derived(
		original.split('\n').length > DIFF_LINE_LIMIT || changed.split('\n').length > DIFF_LINE_LIMIT
	);
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<GitCompare class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Text Diff</h3>
			<p class="text-xs text-muted-foreground">
				Unified line diff via LCS — capped at {DIFF_LINE_LIMIT} lines per side.
			</p>
		</div>
	</header>

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
		<div>
			<label for="diff-original" class="mb-1 block text-xs font-medium text-muted-foreground"
				>Original</label
			>
			<textarea
				id="diff-original"
				bind:value={original}
				rows="5"
				spellcheck="false"
				class={textareaCls}
			></textarea>
		</div>
		<div>
			<label for="diff-changed" class="mb-1 block text-xs font-medium text-muted-foreground"
				>Changed</label
			>
			<textarea
				id="diff-changed"
				bind:value={changed}
				rows="5"
				spellcheck="false"
				class={textareaCls}
			></textarea>
		</div>
	</div>

	<div class="mt-3 flex flex-wrap items-center gap-2">
		<Button size="sm" onclick={compute}>
			<Play class="size-3.5" />
			Compute diff
		</Button>
		<Button
			size="sm"
			variant="secondary"
			onclick={() => {
				original = SAMPLE_A;
				changed = SAMPLE_B;
			}}>Sample</Button
		>
		{#if result}
			<span class="ml-auto flex items-center gap-2">
				<span class="font-mono text-xs">
					<span class="text-success">+{result.added}</span>
					<span class="text-muted-foreground"> / </span>
					<span class="text-destructive">−{result.removed}</span>
				</span>
				<CopyButton text={asText()} label="diff" />
			</span>
		{/if}
	</div>

	{#if needsTruncation}
		<p class="mt-2 font-mono text-[11px] text-warning">
			Input exceeds {DIFF_LINE_LIMIT} lines on one side — it will be truncated before diffing.
		</p>
	{/if}

	<div aria-live="polite">
		{#if result}
			{#if result.added === 0 && result.removed === 0 && !result.truncated}
				<p
					class="mt-3 rounded-md border border-success/30 bg-success/10 px-3 py-2 font-mono text-xs text-success"
				>
					Identical — no differences found.
				</p>
			{:else}
				<div
					class="mt-3 max-h-72 overflow-auto rounded-lg border border-border/60 font-mono text-xs leading-relaxed"
				>
					{#each result.lines as line, i (i)}
						<div
							class={cn(
								'flex gap-2 px-2 whitespace-pre',
								line.type === 'add' && 'bg-success/10 text-success',
								line.type === 'del' && 'bg-destructive/10 text-destructive',
								line.type === 'same' && 'text-muted-foreground'
							)}
						>
							<span class="w-4 shrink-0 text-right select-none" aria-hidden="true">
								{line.type === 'add' ? '+' : line.type === 'del' ? '−' : ''}
							</span>
							<span>{line.text === '' ? ' ' : line.text}</span>
						</div>
					{/each}
				</div>
				{#if result.truncated}
					<p class="mt-1 font-mono text-[11px] text-warning">
						Output truncated to {DIFF_LINE_LIMIT} lines per side.
					</p>
				{/if}
			{/if}
		{/if}
	</div>
</div>
