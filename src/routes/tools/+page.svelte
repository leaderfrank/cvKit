<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { reveal } from '$lib/actions/reveal';
	import Search from '@lucide/svelte/icons/search';
	import { cn } from '$lib/utils.js';

	import JsonTool from '$lib/components/tools/JsonTool.svelte';
	import JwtDecoder from '$lib/components/tools/JwtDecoder.svelte';
	import CryptoTool from '$lib/components/tools/CryptoTool.svelte';
	import UuidTool from '$lib/components/tools/UuidTool.svelte';
	import HashTool from '$lib/components/tools/HashTool.svelte';
	import EncodingTool from '$lib/components/tools/EncodingTool.svelte';
	import CaseTool from '$lib/components/tools/CaseTool.svelte';
	import TimestampTool from '$lib/components/tools/TimestampTool.svelte';
	import LoremTool from '$lib/components/tools/LoremTool.svelte';
	import PaletteTool from '$lib/components/tools/PaletteTool.svelte';
	import HttpStatusTool from '$lib/components/tools/HttpStatusTool.svelte';
	import RegexTool from '$lib/components/tools/RegexTool.svelte';
	import DiffTool from '$lib/components/tools/DiffTool.svelte';
	import CssTool from '$lib/components/tools/CssTool.svelte';
	import QrTool from '$lib/components/tools/QrTool.svelte';
	import MarkdownTool from '$lib/components/tools/MarkdownTool.svelte';
	import type { Component } from 'svelte';

	const CATEGORIES = ['All', 'Encode/Decode', 'Security', 'Data', 'Text', 'CSS', 'Web'] as const;
	type Category = (typeof CATEGORIES)[number];

	interface ToolEntry {
		id: string;
		title: string;
		tagline: string;
		keywords: string;
		category: Exclude<Category, 'All'>;
		component: Component;
	}

	const TOOLS: ToolEntry[] = [
		{
			id: 'json',
			title: 'JSON Formatter',
			tagline: 'Format, minify and validate JSON',
			keywords: 'json format minify validate pretty syntax',
			category: 'Data',
			component: JsonTool
		},
		{
			id: 'jwt',
			title: 'JWT Decoder',
			tagline: 'Inspect token headers and payloads',
			keywords: 'jwt token decode base64 claims',
			category: 'Security',
			component: JwtDecoder
		},
		{
			id: 'crypto',
			title: 'Password Generator',
			tagline: 'CSPRNG passwords with entropy meter',
			keywords: 'password generator random secure entropy crypto',
			category: 'Security',
			component: CryptoTool
		},
		{
			id: 'uuid',
			title: 'UUID v4 Generator',
			tagline: 'Random UUIDs in bulk',
			keywords: 'uuid guid random identifier',
			category: 'Security',
			component: UuidTool
		},
		{
			id: 'hash',
			title: 'Hash Generator',
			tagline: 'MD5 and SHA digests',
			keywords: 'hash md5 sha sha256 checksum digest',
			category: 'Security',
			component: HashTool
		},
		{
			id: 'encoding',
			title: 'Base64 / URL Codec',
			tagline: 'Unicode-safe encode and decode',
			keywords: 'base64 url encode decode percent',
			category: 'Encode/Decode',
			component: EncodingTool
		},
		{
			id: 'case',
			title: 'Case Converter',
			tagline: 'camel, Pascal, snake, kebab…',
			keywords: 'case camel snake kebab pascal naming',
			category: 'Text',
			component: CaseTool
		},
		{
			id: 'timestamp',
			title: 'Unix Timestamp',
			tagline: 'Epoch clock and converters',
			keywords: 'unix timestamp epoch time date converter',
			category: 'Text',
			component: TimestampTool
		},
		{
			id: 'lorem',
			title: 'Lorem Ipsum',
			tagline: 'Filler copy for mockups',
			keywords: 'lorem ipsum placeholder text filler',
			category: 'Text',
			component: LoremTool
		},
		{
			id: 'palette',
			title: 'Color Palette',
			tagline: 'Harmonies with WCAG contrast',
			keywords: 'color palette harmony contrast swatch wcag',
			category: 'CSS',
			component: PaletteTool
		},
		{
			id: 'http',
			title: 'HTTP Status Codes',
			tagline: 'A searchable field guide',
			keywords: 'http status code 404 500 response',
			category: 'Web',
			component: HttpStatusTool
		},
		{
			id: 'regex',
			title: 'Regex Tester',
			tagline: 'Live matches and groups',
			keywords: 'regex regular expression match test pattern',
			category: 'Text',
			component: RegexTool
		},
		{
			id: 'diff',
			title: 'Text Diff',
			tagline: 'Unified line-by-line diff',
			keywords: 'diff compare lines changes',
			category: 'Text',
			component: DiffTool
		},
		{
			id: 'css',
			title: 'CSS Playground',
			tagline: 'Gradients and box-shadows',
			keywords: 'css gradient box shadow generator',
			category: 'CSS',
			component: CssTool
		},
		{
			id: 'qr',
			title: 'QR Code Generator',
			tagline: 'Text to scannable QR',
			keywords: 'qr code barcode scan image',
			category: 'Web',
			component: QrTool
		},
		{
			id: 'markdown',
			title: 'Markdown Preview',
			tagline: 'Dependency-free live renderer',
			keywords: 'markdown preview render md',
			category: 'Data',
			component: MarkdownTool
		}
	];

	let search = $state('');
	let category = $state<Category>('All');

	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return TOOLS.filter((tool) => {
			if (category !== 'All' && tool.category !== category) return false;
			if (!q) return true;
			return (
				tool.title.toLowerCase().includes(q) ||
				tool.tagline.toLowerCase().includes(q) ||
				tool.keywords.toLowerCase().includes(q) ||
				tool.category.toLowerCase().includes(q)
			);
		});
	});

	function clearFilters() {
		search = '';
		category = 'All';
	}
</script>

<svelte:head>
	<title>Dev Tools — Mohammed Ghaleb</title>
	<meta
		name="description"
		content="A toolbox of fast, client-side developer utilities: JSON formatter, JWT decoder, hash and password generators, regex tester, diff viewer, CSS generators and more — all running in your browser."
	/>
</svelte:head>

<main id="main" class="min-h-screen">
	<div class="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
		<header>
			<p class="font-mono text-xs text-primary">// developer utilities</p>
			<h1 class="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
				Tools I actually use.
			</h1>
			<p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
				A growing toolbox of client-side utilities for everyday engineering chores — formatting
				JSON, decoding tokens, testing regex, generating palettes. Everything runs in your browser:
				nothing you type is sent to a server (the QR image preview is the single exception, and it
				asks politely).
			</p>
		</header>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
			<div class="relative grow sm:max-w-sm">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					bind:value={search}
					type="search"
					placeholder="Search tools…"
					class="pl-9"
					aria-label="Search tools"
				/>
			</div>
			<p class="font-mono text-xs text-muted-foreground" aria-live="polite">
				{filtered.length === TOOLS.length
					? `${TOOLS.length} tools`
					: `${filtered.length} of ${TOOLS.length} tools`}
			</p>
		</div>

		<div class="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
			{#each CATEGORIES as c (c)}
				<button
					type="button"
					aria-pressed={category === c}
					onclick={() => (category = c)}
					class={cn(
						'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
						category === c
							? 'border-primary/50 bg-primary/10 text-primary'
							: 'border-border/70 text-muted-foreground hover:border-primary/30 hover:text-foreground'
					)}
				>
					{c}
				</button>
			{/each}
		</div>

		{#if filtered.length > 0}
			<div class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
				{#each filtered as tool, i (tool.id)}
					<div use:reveal={{ delay: (i % 2) * 60 }}>
						<tool.component />
					</div>
				{/each}
			</div>
		{:else}
			<div
				class="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center"
			>
				<Search class="size-8 text-muted-foreground/50" />
				<p class="text-sm text-muted-foreground">No tools match</p>
				<Button size="sm" variant="outline" onclick={clearFilters}>Clear filters</Button>
			</div>
		{/if}

		<footer class="mt-12 text-center">
			<p class="font-mono text-xs text-muted-foreground">
				// everything client-side · zero tracking · ctrl+c friendly
			</p>
		</footer>
	</div>
</main>
