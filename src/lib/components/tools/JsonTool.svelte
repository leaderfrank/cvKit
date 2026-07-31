<script lang="ts">
	import Braces from '@lucide/svelte/icons/braces';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import { Button } from '$lib/components/ui/button/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';

	const SAMPLE = `{
  "name": "Mohammed Ghaleb",
  "role": "Full Stack Software Engineer",
  "stack": ["SvelteKit", "TypeScript", "Node.js", "Docker"],
  "openToWork": true,
  "experienceYears": 4,
  "contact": { "email": "hello@example.com", "remote": true },
  "proudOf": null
}`;

	type Result =
		| { kind: 'ok'; text: string; html: string; bytes: number; keys: number }
		| { kind: 'error'; message: string };

	let input = $state(SAMPLE);
	let result = $state<Result | null>(null);

	function escapeHtml(s: string): string {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	/** Tiny JSON tokenizer → syntax-highlighted HTML. Every token is escaped. */
	function highlightJson(src: string): string {
		const token =
			/("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([{}\[\]:,])|(\s+)|(.)/g;
		return src.replace(
			token,
			(
				_m,
				str: string,
				colon: string,
				num: string,
				kw: string,
				punct: string,
				ws: string,
				other: string
			) => {
				if (str !== undefined) {
					const cls = colon ? 'text-primary' : 'text-success';
					return `<span class="${cls}">${escapeHtml(str)}</span>${colon ? `<span class="text-muted-foreground">${escapeHtml(colon)}</span>` : ''}`;
				}
				if (num !== undefined) return `<span class="text-warning">${escapeHtml(num)}</span>`;
				if (kw !== undefined) return `<span class="text-chart-1">${escapeHtml(kw)}</span>`;
				if (punct !== undefined)
					return `<span class="text-muted-foreground">${escapeHtml(punct)}</span>`;
				if (ws !== undefined) return ws;
				return escapeHtml(other ?? '');
			}
		);
	}

	function countKeys(value: unknown): number {
		if (Array.isArray(value)) return value.reduce((acc, v) => acc + countKeys(v), 0);
		if (value !== null && typeof value === 'object') {
			return Object.values(value).reduce((acc, v) => acc + countKeys(v), Object.keys(value).length);
		}
		return 0;
	}

	/** Surface browser-specific JSON error positions as line/column when available. */
	function locateError(message: string, src: string): string {
		const posMatch = /position\s+(\d+)/i.exec(message);
		if (posMatch) {
			const pos = Number(posMatch[1]);
			const upto = src.slice(0, pos);
			const line = upto.split('\n').length;
			const col = pos - upto.lastIndexOf('\n');
			return `${message} — line ${line}, column ${col}`;
		}
		return message;
	}

	function run(mode: 'format' | 'minify' | 'validate') {
		const src = input.trim();
		if (!src) {
			result = { kind: 'error', message: 'Nothing to parse — paste some JSON first.' };
			return;
		}
		try {
			const parsed: unknown = JSON.parse(src);
			const text = mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
			result = {
				kind: 'ok',
				text,
				html: highlightJson(text),
				bytes: new TextEncoder().encode(text).length,
				keys: countKeys(parsed)
			};
		} catch (err) {
			result = {
				kind: 'error',
				message: locateError(err instanceof Error ? err.message : String(err), src)
			};
		}
	}
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Braces class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">JSON Formatter</h3>
			<p class="text-xs text-muted-foreground">
				Format, minify and validate JSON with instant feedback.
			</p>
		</div>
	</header>

	<label for="json-input" class="sr-only">JSON input</label>
	<textarea
		id="json-input"
		bind:value={input}
		rows="6"
		spellcheck="false"
		placeholder="Paste JSON here…"
		class="min-h-32 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
	></textarea>

	<div class="mt-3 flex flex-wrap items-center gap-2">
		<Button size="sm" onclick={() => run('format')}>Format</Button>
		<Button size="sm" variant="outline" onclick={() => run('minify')}>Minify</Button>
		<Button size="sm" variant="outline" onclick={() => run('validate')}>Validate</Button>
		<Button size="sm" variant="secondary" onclick={() => (input = SAMPLE)}>
			<Sparkles class="size-3.5" />
			Sample
		</Button>
		<Button
			size="sm"
			variant="ghost"
			onclick={() => {
				input = '';
				result = null;
			}}>Clear</Button
		>
		{#if result?.kind === 'ok'}
			<span class="ml-auto"><CopyButton text={result.text} label="JSON output" /></span>
		{/if}
	</div>

	<div aria-live="polite">
		{#if result?.kind === 'error'}
			<p
				class="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive"
				role="alert"
			>
				{result.message}
			</p>
		{:else if result?.kind === 'ok'}
			<div class="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
				<span class="inline-flex items-center gap-1.5">
					<span class="size-1.5 rounded-full bg-success"></span>Valid JSON
				</span>
				<span aria-hidden="true">·</span>
				<span>{result.bytes} bytes</span>
				<span aria-hidden="true">·</span>
				<span>{result.keys} keys</span>
			</div>
			<pre
				class="mt-2 max-h-72 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">{@html result.html}</pre>
		{/if}
	</div>
</div>
