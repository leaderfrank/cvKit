<script lang="ts">
	import { profile, yearsExperience, totalTechCount } from '$lib/data/portfolio';
	import ProfileImage from '$lib/components/ProfileImage.svelte';
	import RoleRotator from '$lib/components/shared/RoleRotator.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { reveal } from '$lib/actions/reveal';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import Github from '@lucide/svelte/icons/github';
	import Linkedin from '@lucide/svelte/icons/linkedin';

	const roles = [
		'Full Stack Software Engineer',
		'TypeScript Specialist',
		'API Architect',
		'Flutter Developer',
		'Performance Obsessive'
	];

	const chips = [
		{ value: `${yearsExperience}+`, label: 'years experience' },
		{ value: `${totalTechCount}`, label: 'technologies' },
		{ value: '35%', label: 'faster platforms' }
	];
</script>

<section id="home" class="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
	<!-- Decorative background -->
	<div
		class="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]"
	></div>
	<div
		class="absolute -top-44 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
	></div>

	<div
		class="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]"
	>
		<div class="text-center lg:text-left">
			<div use:reveal>
				<span
					class="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
				>
					<span class="relative flex size-2">
						<span
							class="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-success opacity-75"
						></span>
						<span class="relative inline-flex size-2 rounded-full bg-success"></span>
					</span>
					Open to new opportunities
				</span>
			</div>

			<h1
				class="mt-6 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl"
				use:reveal={{ delay: 80 }}
			>
				{profile.name}
			</h1>

			<p
				class="mt-3 font-display text-xl font-semibold text-gradient sm:text-2xl"
				use:reveal={{ delay: 150 }}
			>
				<RoleRotator {roles} />
			</p>

			<p
				class="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground lg:mx-0"
				use:reveal={{ delay: 220 }}
			>
				{profile.summary}
			</p>

			<div
				class="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start"
				use:reveal={{ delay: 260 }}
			>
				<MapPin class="size-4 text-primary" />
				{profile.location}
			</div>

			<div
				class="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
				use:reveal={{ delay: 320 }}
			>
				<Button href="#projects" size="lg" class="gap-2">
					View projects <ArrowRight class="size-4" />
				</Button>
				<Button href="#contact" variant="outline" size="lg">Get in touch</Button>
				<div class="flex items-center gap-1">
					<Button
						href={profile.github}
						target="_blank"
						rel="noopener noreferrer"
						variant="ghost"
						size="icon"
						aria-label="GitHub profile"><Github class="size-4.5" /></Button
					>
					<Button
						href={profile.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						variant="ghost"
						size="icon"
						aria-label="LinkedIn profile"><Linkedin class="size-4.5" /></Button
					>
				</div>
			</div>

			<dl class="mt-10 grid max-w-md grid-cols-3 gap-3 max-lg:mx-auto" use:reveal={{ delay: 400 }}>
				{#each chips as chip (chip.label)}
					<div class="glass rounded-xl px-3 py-2.5 text-center lg:text-left">
						<dt class="sr-only">{chip.label}</dt>
						<dd class="font-display text-lg font-bold">{chip.value}</dd>
						<dd class="text-[11px] text-muted-foreground">{chip.label}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<!-- Portrait -->
		<div class="relative mx-auto" use:reveal={{ delay: 200 }}>
			<div class="absolute inset-0 -z-10 scale-110 rounded-full bg-dots opacity-60"></div>
			<div class="animate-float">
				<ProfileImage src="/profile.webp" alt="Portrait of {profile.name}" />
			</div>
			<p class="mt-6 text-center font-mono text-[11px] text-balance text-muted-foreground">
				// psst — you can grab &amp; spin the photo
			</p>
		</div>
	</div>

	<a
		href="#dashboard"
		aria-label="Scroll to dashboard"
		class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary sm:block"
	>
		<ArrowDown class="size-5 animate-bounce" />
	</a>
</section>
