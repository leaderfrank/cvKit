<script lang="ts">
	import Regex from '@lucide/svelte/icons/regex';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { cn } from '$lib/utils.js';

	const FLAG_IDS = ['g', 'i', 'm', 's', 'u', 'y'] as const;
	type Flag = (typeof FLAG_IDS)[number];
	const FLAG_HINTS: Record<Flag, string> = {
		g: 'global',
		i: 'case-insensitive',
		m: 'multiline',
		s: 'dotAll',
		u: 'unicode',
		y: 'sticky'
	};

	const PRESETS: { label: string; pattern: string; flags: Flag[]; sample: string }[] = [
		{
			label: 'Email',
			pattern: String.raw`[\w.+-]+@[\w-]+\.[\w.]+`,
			flags: ['g'],
			sample: 'Reach me at hello@ghaleb.dev or backup+tag@mail.example.org — not @broken.'
		},
		{
			label: 'URL',
			pattern: String.raw`https?:\/\/[^\s/$.?#].[^\s]*`,
			flags: ['g', 'i'],
			sample: 'Docs at https://svelte.dev/docs and http://example.com/path?x=1 plain text.'
		},
		{
			label: 'ISO date',
			pattern: String.raw`\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?)?`,
			flags: ['g'],
			sample: 'Released 2024-05-17, meeting at 2030-01-01 09:30, short 24-1-1 misses.'
		},
		{
			label: 'IPv4',
			pattern: String.raw`\b(?:\d{1,3}\.){3}\d{1,3}\b`,
			flags: ['g'],
			sample: 'Servers 10.0.0.1 and 192.168.1.254 answer; 999.1.1.1 is not a real address.'
		},
		{
			label: 'Hex color',
			pattern: String.raw`#[0-9a-fA-F]{6}\b`,
			flags: ['g'],
			sample: 'Brand colors #6d28d9, #0ea5e9 and the invalid #12345g or #abc.'
		}
	];

	let pattern = $state(String.raw`(\w+)@(\w+\.\w+)`);
	let flags = $state<Flag[]>(['g']);
	let testText = $state('Contact: hello@ghaleb.dev, admin@example.org');

	function toggleFlag(f: Flag) {
		flags = flags.includes(f) ? flags.filter((x) => x !== f) : [...flags, f];
	}

	const compiled = $derived.by((): { re: RegExp | null; error: string | null } => {
		if (!pattern) return { re: null, error: null };
		try {
			return { re: new RegExp(pattern, flags.join('')), error: null };
		} catch (err) {
			return { re: null, error: err instanceof Error ? err.message : String(err) };
		}
	});

	interface MatchRow {
		index: number;
		text: string;
		groups: string[];
	}

	const matches = $derived.by((): { rows: MatchRow[]; total: number } => {
		const { re } = compiled;
		if (!re || !testText) return { rows: [], total: 0 };
		const rows: MatchRow[] = [];
		let total = 0;
		if (re.global) {
			for (const m of testText.matchAll(re)) {
				total++;
				if (rows.length < 20) {
					rows.push({ index: m.index, text: m[0], groups: m.slice(1).map((g) => g ?? '∅') });
				}
				if (total >= 1000) break; // perf guard
			}
		} else {
			const m = re.exec(testText);
			if (m) {
				total = 1;
				rows.push({ index: m.index, text: m[0], groups: m.slice(1).map((g) => g ?? '∅') });
			}
		}
		return { rows, total };
	});

	function escapeHtml(s: string): string {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	/** Highlighted copy of the test text: escape each slice, wrap matches in <mark>. */
	const highlighted = $derived.by(() => {
		const { re } = compiled;
		if (!re || !testText) return escapeHtml(testText);
		const ranges: [number, number][] = [];
		if (re.global) {
			let count = 0;
			for (const m of testText.matchAll(re)) {
				if (m[0].length > 0) ranges.push([m.index, m.index + m[0].length]);
				if (++count >= 500) break;
			}
		} else {
			const m = re.exec(testText);
			if (m && m[0].length > 0) ranges.push([m.index, m.index + m[0].length]);
		}
		let html = '';
		let cursor = 0;
		for (const [start, end] of ranges) {
			html += escapeHtml(testText.slice(cursor, start));
			html += `<mark class="rounded-sm bg-warning/60 px-0.5">${escapeHtml(testText.slice(start, end))}</mark>`;
			cursor = end;
		}
		html += escapeHtml(testText.slice(cursor));
		return html;
	});

	function applyPreset(p: (typeof PRESETS)[number]) {
		pattern = p.pattern;
		flags = [...p.flags];
		testText = p.sample;
	}

	const checkboxCls =
		'size-3.5 shrink-0 cursor-pointer appearance-none rounded border border-input bg-background transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<Regex class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">Regex Tester</h3>
			<p class="text-xs text-muted-foreground">
				Live matches, capture groups and inline highlighting.
			</p>
		</div>
	</header>

	<div class="flex flex-wrap gap-1.5" role="group" aria-label="Preset patterns">
		{#each PRESETS as preset (preset.label)}
			<button
				type="button"
				onclick={() => applyPreset(preset)}
				class="rounded-md border border-border/60 bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
			>
				{preset.label}
			</button>
		{/each}
	</div>

	<div class="mt-3 flex items-stretch gap-1.5">
		<span
			class="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-2 font-mono text-sm text-muted-foreground select-none"
			>/</span
		>
		<label for="regex-pattern" class="sr-only">Regular expression pattern</label>
		<input
			id="regex-pattern"
			type="text"
			bind:value={pattern}
			spellcheck="false"
			placeholder="pattern"
			class="h-9 min-w-0 flex-1 border-y border-input bg-background px-2 py-1 font-mono text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
		/>
		<span
			class="flex items-center gap-2 rounded-r-md border border-l-0 border-input bg-muted px-2 font-mono text-sm text-muted-foreground"
		>
			/
			{#each FLAG_IDS as f (f)}
				<label class="flex cursor-pointer items-center gap-1 text-xs" title={FLAG_HINTS[f]}>
					<input
						type="checkbox"
						checked={flags.includes(f)}
						onchange={() => toggleFlag(f)}
						class={checkboxCls}
					/>
					{f}
				</label>
			{/each}
		</span>
	</div>

	<label for="regex-test" class="sr-only">Test string</label>
	<textarea
		id="regex-test"
		bind:value={testText}
		rows="3"
		spellcheck="false"
		placeholder="Text to test against…"
		class="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
	></textarea>

	<div aria-live="polite">
		{#if compiled.error}
			<p
				class="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive"
				role="alert"
			>
				{compiled.error}
			</p>
		{:else if compiled.re}
			<p class="mt-2 font-mono text-[11px] text-muted-foreground">
				{#if matches.total === 0}
					No matches{testText ? '' : ' — enter some test text'}
				{:else}
					<span class="font-semibold text-success"
						>{matches.total}{matches.total >= 1000 ? '+' : ''}</span
					>
					{matches.total === 1 ? 'match' : 'matches'}{matches.total > 20
						? ' — showing first 20'
						: ''}
				{/if}
			</p>

			{#if testText && matches.total > 0}
				<div
					class="mt-2 max-h-32 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap"
				>
					{@html highlighted}
				</div>

				<div class="mt-2 overflow-x-auto">
					<table class="w-full text-left text-xs">
						<thead>
							<tr
								class="border-b border-border/60 font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
							>
								<th class="py-1 pr-2 font-medium">#</th>
								<th class="py-1 pr-2 font-medium">Index</th>
								<th class="py-1 pr-2 font-medium">Match</th>
								<th class="py-1 font-medium">Groups</th>
							</tr>
						</thead>
						<tbody>
							{#each matches.rows as m, i (i)}
								<tr class="border-b border-border/40 last:border-0">
									<td class="py-1 pr-2 font-mono text-muted-foreground">{i + 1}</td>
									<td class="py-1 pr-2 font-mono text-muted-foreground">{m.index}</td>
									<td class="max-w-40 truncate py-1 pr-2 font-mono text-warning" title={m.text}
										>{m.text || '(empty)'}</td
									>
									<td class="max-w-40 truncate py-1 font-mono text-foreground/80">
										{m.groups.length ? m.groups.join(' | ') : '—'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{/if}
	</div>

	<div class="mt-2 flex justify-end">
		<CopyButton text={`/${pattern}/${flags.join('')}`} label="regex literal" />
	</div>
</div>
