<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import SortVisualizer from '$lib/components/lab/SortVisualizer.svelte';
	import DebounceThrottle from '$lib/components/lab/DebounceThrottle.svelte';
	import EventLoopDemo from '$lib/components/lab/EventLoopDemo.svelte';
	import ApiPlayground from '$lib/components/lab/ApiPlayground.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Braces from '@lucide/svelte/icons/braces';
	import Timer from '@lucide/svelte/icons/timer';
	import Cpu from '@lucide/svelte/icons/cpu';
	import Gauge from '@lucide/svelte/icons/gauge';
	import Wrench from '@lucide/svelte/icons/wrench';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	const nav = [
		{ id: 'sorting', label: 'Sorting', icon: Braces },
		{ id: 'timing', label: 'Debounce & Throttle', icon: Timer },
		{ id: 'event-loop', label: 'Event Loop', icon: Cpu },
		{ id: 'playground', label: 'API Playground', icon: Gauge }
	];
</script>

<svelte:head>
	<title>Code Lab — Mohammed Ghaleb</title>
	<meta
		name="description"
		content="Interactive computer-science demos: sorting algorithm visualizers as generator pipelines, debounce vs throttle live, the JavaScript event loop as a state machine, and a production-grade API playground."
	/>
</svelte:head>

<main id="main" class="min-h-screen">
	<div class="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
		<!-- Hero -->
		<header>
			<p class="font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
				// interactive computer science
			</p>
			<h1 class="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Code Lab.</h1>
			<p class="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
				Small interactive demos built with the platform — no libraries where the browser API
				suffices. Sorting algorithms as generator pipelines, the event loop as a state machine, and
				a live API playground.
			</p>
			<nav class="mt-6 flex flex-wrap gap-2" aria-label="Jump to a demo">
				{#each nav as item (item.id)}
					{@const Icon = item.icon}
					<a
						href="#{item.id}"
						class="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
					>
						<Icon class="size-3.5 text-primary" />{item.label}
					</a>
				{/each}
			</nav>
		</header>

		<div class="mt-14 space-y-16">
			<!-- 01 · Sorting -->
			<section id="sorting" class="scroll-mt-24">
				<div use:reveal>
					<p class="font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
						// demo 01
					</p>
					<h2 class="mt-2 font-display text-2xl font-semibold tracking-tight">
						Sorting, step by step
					</h2>
					<p class="mt-1.5 max-w-2xl text-sm text-muted-foreground">
						Five classics compiled into generator-powered frames — every comparison and write is a
						yield. Shuffle, then play or single-step.
					</p>
				</div>
				<div class="mt-5">
					<SortVisualizer />
				</div>
			</section>

			<!-- 02 · Debounce & throttle -->
			<section id="timing" class="scroll-mt-24">
				<div use:reveal>
					<p class="font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
						// demo 02
					</p>
					<h2 class="mt-2 font-display text-2xl font-semibold tracking-tight">
						Debounce vs. throttle, live
					</h2>
					<p class="mt-1.5 max-w-2xl text-sm text-muted-foreground">
						Every keypress fires an event; only some survive the gates. Watch trailing-edge debounce
						and leading-edge throttle disagree in real time.
					</p>
				</div>
				<div class="mt-5">
					<DebounceThrottle />
				</div>
			</section>

			<!-- 03 · Event loop -->
			<section id="event-loop" class="scroll-mt-24">
				<div use:reveal>
					<p class="font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
						// demo 03
					</p>
					<h2 class="mt-2 font-display text-2xl font-semibold tracking-tight">
						The event loop as a state machine
					</h2>
					<p class="mt-1.5 max-w-2xl text-sm text-muted-foreground">
						Step through real JavaScript ordering: call stack, microtask queue, task queue and
						console — with outputs verified against an actual runtime.
					</p>
				</div>
				<div class="mt-5">
					<EventLoopDemo />
				</div>
			</section>

			<!-- 04 · API playground -->
			<section id="playground" class="scroll-mt-24">
				<div use:reveal>
					<p class="font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
						// demo 04
					</p>
					<h2 class="mt-2 font-display text-2xl font-semibold tracking-tight">API playground</h2>
					<p class="mt-1.5 max-w-2xl text-sm text-muted-foreground">
						A production-grade fetch layer — TTL cache, retries with backoff, abort timeouts —
						pointed at a live endpoint, with the metadata shown under each request.
					</p>
				</div>
				<div class="mt-5">
					<ApiPlayground />
				</div>
			</section>
		</div>

		<!-- Closing nudge -->
		<aside
			class="mt-16 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-5 shadow-xs"
		>
			<div class="flex items-center gap-3">
				<span class="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
					<Wrench class="size-4" />
				</span>
				<div>
					<p class="font-display text-sm font-semibold">Need utilities instead?</p>
					<p class="text-xs text-muted-foreground">
						Formatters, encoders and generators you can copy straight out.
					</p>
				</div>
			</div>
			<Button href="/tools" variant="outline" size="sm">
				Dev Tools<ArrowRight class="size-4" />
			</Button>
		</aside>
	</div>
</main>
