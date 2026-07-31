<script lang="ts">
	import { onMount } from 'svelte';
	import { scaleLinear } from 'd3-scale';
	import { lineRadial, curveLinearClosed } from 'd3-shape';
	import Section from '$lib/components/shared/Section.svelte';
	import { radarAxes, skillCategories } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Radar from '@lucide/svelte/icons/radar';

	// ---------- Radar geometry ----------
	const SIZE = 420;
	const CENTER = SIZE / 2;
	const RADIUS = SIZE / 2 - 58;
	const RINGS = 5;

	const radius = scaleLinear().domain([0, 100]).range([0, RADIUS]);
	const angleFor = (i: number) => (i / radarAxes.length) * Math.PI * 2 - Math.PI / 2;

	const point = (i: number, value: number): [number, number] => {
		const r = radius(value);
		const a = angleFor(i);
		return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)];
	};

	const pathGen = lineRadial<[number, number]>()
		.radius((d) => d[0])
		.angle((d) => d[1])
		.curve(curveLinearClosed);

	// Animated polygon: interpolates from center on mount
	let progress = $state(0);
	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			progress = 1;
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					observer.disconnect();
					const t0 = performance.now();
					const tick = (t: number) => {
						const p = Math.min((t - t0) / 900, 1);
						progress = 1 - (1 - p) ** 3;
						if (p < 1) requestAnimationFrame(tick);
					};
					requestAnimationFrame(tick);
				}
			},
			{ threshold: 0.3 }
		);
		if (chartEl) observer.observe(chartEl);
		return () => observer.disconnect();
	});

	let chartEl: SVGSVGElement;
	const polygonPath = $derived(
		pathGen(
			radarAxes.map((axis, i) => [radius(axis.value * progress), angleFor(i) + Math.PI / 2])
		) ?? ''
	);
	const gridPath = $derived(
		Array.from({ length: RINGS }, (_, ring) => {
			const v = ((ring + 1) / RINGS) * 100;
			return pathGen(radarAxes.map((_, i) => [radius(v), angleFor(i) + Math.PI / 2])) ?? '';
		})
	);

	let hoveredAxis = $state<number | null>(null);

	// ---------- Category filtering ----------
	let activeCategory = $state<string>('all');
	const visibleCategories = $derived(
		activeCategory === 'all'
			? skillCategories
			: skillCategories.filter((c) => c.id === activeCategory)
	);
</script>

<Section
	id="skills"
	eyebrow="// capabilities"
	title="A full stack, measured honestly."
	description="The radar shows where I'm strongest; the grid shows the exact tools. Filter by discipline — everything is real, production-tested experience."
	class="border-y border-border/60 bg-muted/30"
>
	<div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
		<!-- Radar chart -->
		<figure
			class="relative mx-auto w-full max-w-[26rem] rounded-2xl border border-border/70 bg-card p-4 shadow-xs"
			use:reveal
		>
			<svg
				bind:this={chartEl}
				viewBox="0 0 {SIZE} {SIZE}"
				class="h-auto w-full"
				role="img"
				aria-label="Radar chart of skill levels across {radarAxes.length} disciplines"
			>
				<!-- radial paths are generated around (0,0): translate to chart center -->
				<g transform="translate({CENTER} {CENTER})">
					<!-- grid rings -->
					{#each gridPath as ring, i (i)}
						<path d={ring} fill="none" class="stroke-border" stroke-width="1" />
					{/each}
					<!-- value polygon -->
					<path
						d={polygonPath}
						class="fill-primary/20 stroke-primary"
						stroke-width="2"
						stroke-linejoin="round"
					/>
				</g>
				<!-- spokes -->
				{#each radarAxes as _, i (i)}
					{@const [x, y] = point(i, 100)}
					<line x1={CENTER} y1={CENTER} x2={x} y2={y} class="stroke-border" stroke-width="1" />
				{/each}
				<!-- vertices + labels -->
				{#each radarAxes as axis, i (axis.id)}
					{@const [x, y] = point(i, axis.value * progress)}
					{@const [lx, ly] = point(i, 118)}
					<circle
						cx={x}
						cy={y}
						r={hoveredAxis === i ? 5.5 : 3.5}
						class="fill-primary transition-all"
					/>
					<text
						x={lx}
						y={ly}
						text-anchor="middle"
						dominant-baseline="middle"
						class={cn(
							'fill-muted-foreground text-[11px] font-medium transition-colors',
							hoveredAxis === i && 'fill-foreground'
						)}
					>
						{axis.label}
					</text>
					<!-- generous hover targets -->
					{@const [hx, hy] = point(i, 72)}
					<circle
						cx={hx}
						cy={hy}
						r="34"
						fill="transparent"
						role="presentation"
						onmouseenter={() => (hoveredAxis = i)}
						onmouseleave={() => (hoveredAxis = null)}
					/>
				{/each}
			</svg>

			<!-- tooltip -->
			{#if hoveredAxis !== null}
				{@const axis = radarAxes[hoveredAxis]}
				<div
					class="glass pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-lg px-3 py-1.5 text-center shadow-md"
				>
					<span class="font-display text-sm font-bold">{axis.label}</span>
					<span class="ml-2 font-mono text-sm text-primary">{axis.value}/100</span>
				</div>
			{/if}

			<figcaption
				class="flex items-center justify-center gap-1.5 border-t border-border/60 pt-3 font-mono text-[11px] text-muted-foreground"
			>
				<Radar class="size-3.5 text-primary" /> hover an axis · SVG rendered with d3 scales — no chart
				library needed
			</figcaption>
		</figure>

		<!-- Filterable tech grid -->
		<div>
			<div
				class="flex flex-wrap gap-2"
				role="group"
				aria-label="Filter skills by discipline"
				use:reveal
			>
				<button
					type="button"
					onclick={() => (activeCategory = 'all')}
					class={cn(
						'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
						activeCategory === 'all'
							? 'border-primary bg-primary text-primary-foreground shadow-xs'
							: 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
					)}
				>
					All
				</button>
				{#each skillCategories as category (category.id)}
					<button
						type="button"
						onclick={() => (activeCategory = category.id)}
						class={cn(
							'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
							activeCategory === category.id
								? 'border-primary bg-primary text-primary-foreground shadow-xs'
								: 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
						)}
					>
						{category.label}
						<span class="ml-1 font-mono opacity-60">{category.items.length}</span>
					</button>
				{/each}
			</div>

			<div class="mt-6 space-y-6" aria-live="polite">
				{#each visibleCategories as category (category.id)}
					<div>
						<h3
							class="font-mono text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
						>
							{category.label}
						</h3>
						<div class="mt-2.5 flex flex-wrap gap-2">
							{#each category.items as item, i (item)}
								<Badge
									variant="secondary"
									class={cn(
										'px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 hover:bg-primary/15 hover:text-foreground',
										activeCategory !== 'all' && 'animate-float-subtle'
									)}
									style="transition-delay: {i * 25}ms"
								>
									{item}
								</Badge>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<p class="mt-8 border-l-2 border-primary/40 pl-4 text-sm text-muted-foreground" use:reveal>
				Frameworks rotate; fundamentals compound. Every technology above has shipped production code
				— from SQL Server migrations to Flutter builds for clients abroad.
			</p>
		</div>
	</div>
</Section>

<style>
	.animate-float-subtle {
		animation: chip-in 0.4s ease-out both;
	}
	@keyframes chip-in {
		from {
			opacity: 0;
			transform: translateY(6px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.animate-float-subtle {
			animation: none;
		}
	}
</style>
