<script lang="ts">
	import SquareM from '@lucide/svelte/icons/square-m';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import { Button } from '$lib/components/ui/button/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { renderMarkdown } from '$lib/tools/markdown-lite';

	const SAMPLE = `# Hello, renderer

A **live** preview with *most* of the ~~common~~ markdown you actually write — \`inline code\`, [links](https://ghaleb.dev), lists and more.

- Ships zero dependencies
- Escapes **all** HTML first
- Runs entirely offline

1. Type on the left
2. Preview on the right

> Simplicity is a feature, not a limitation.

\`\`\`ts
const answer: number = 42;
\`\`\`

---

Built by Mohammed Ghaleb`;

	let input = $state(SAMPLE);

	const html = $derived(renderMarkdown(input));
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<SquareM class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Markdown Preview</h3>
			<p class="text-xs text-muted-foreground">
				A dependency-free renderer — headings, lists, code, quotes.
			</p>
		</div>
	</header>

	<div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
		<div>
			<div class="mb-1 flex items-center justify-between">
				<label
					for="md-input"
					class="font-mono text-[11px] tracking-wide text-muted-foreground uppercase"
					>Markdown</label
				>
				<Button
					size="sm"
					variant="ghost"
					class="h-7 gap-1.5 text-xs"
					onclick={() => (input = SAMPLE)}
				>
					<Sparkles class="size-3.5" />
					Sample
				</Button>
			</div>
			<textarea
				id="md-input"
				bind:value={input}
				rows="14"
				spellcheck="false"
				placeholder="# Start typing markdown…"
				class="min-h-48 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
			></textarea>
		</div>
		<div>
			<div class="mb-1 flex items-center justify-between">
				<span class="font-mono text-[11px] tracking-wide text-muted-foreground uppercase"
					>Preview</span
				>
				<CopyButton text={input} label="markdown source" />
			</div>
			<article
				class="min-h-48 space-y-2 overflow-auto rounded-lg border border-border/60 bg-muted/30 p-4 text-sm"
				aria-live="polite"
				aria-label="Rendered markdown preview"
			>
				{@html html}
			</article>
		</div>
	</div>
</div>
