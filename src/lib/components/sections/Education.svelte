<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { education, certifications, spokenLanguages } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import Languages from '@lucide/svelte/icons/languages';
</script>

<Section
	id="education"
	eyebrow="// education & credentials"
	title="Formal training, current."
	description="A computer science foundation, an MBA in progress, and the cloud and AI certifications that keep the toolchain honest."
>
	<div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr]">
		<!-- Education -->
		<div class="space-y-4">
			{#each education as item, i (item.degree)}
				<article
					class="rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
					use:reveal={{ delay: i * 80 }}
				>
					<div class="flex items-start gap-4">
						<span
							class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
						>
							<GraduationCap class="size-5" />
						</span>
						<div class="min-w-0">
							<p class="font-mono text-xs text-primary">{item.period}</p>
							<h3 class="mt-1.5 font-display text-base leading-snug font-bold">{item.degree}</h3>
							<p class="mt-1 text-sm text-muted-foreground">{item.institution}</p>
							<p class="text-sm text-muted-foreground">{item.location}</p>
							<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
						</div>
					</div>
				</article>
			{/each}

			<div class="rounded-xl border border-dashed border-border bg-card/50 p-5" use:reveal>
				<div class="flex items-center gap-2 text-sm font-semibold">
					<Languages class="size-4 text-primary" /> Languages spoken
				</div>
				<ul class="mt-3 space-y-1.5">
					{#each spokenLanguages as lang (lang.name)}
						<li class="flex flex-wrap items-baseline gap-x-2 text-sm">
							<span class="font-medium">{lang.name}</span>
							<span class="text-muted-foreground">— {lang.level}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Certifications -->
		<div
			class="rounded-xl border border-border/70 bg-card p-6 shadow-xs"
			use:reveal={{ delay: 120 }}
		>
			<div class="flex items-center gap-2">
				<span class="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
					<BadgeCheck class="size-4.5" />
				</span>
				<h3 class="font-display text-base font-bold">Certifications</h3>
				<span class="ml-auto font-mono text-xs text-muted-foreground"
					>{certifications.length.toString().padStart(2, '0')}</span
				>
			</div>

			<ul class="mt-5 divide-y divide-border/60">
				{#each certifications as cert, i (cert.name)}
					<li
						class="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
						use:reveal={{ delay: i * 50 }}
					>
						<span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
						<div class="min-w-0">
							<p class="text-sm leading-snug font-medium">{cert.name}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</Section>
