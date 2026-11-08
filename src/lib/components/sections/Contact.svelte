<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { profile, services } from '$lib/data/portfolio';
	import { reveal } from '$lib/actions/reveal';
	import { Button } from '$lib/components/ui/button/index.js';
	import Mail from '@lucide/svelte/icons/mail';
	import Github from '@lucide/svelte/icons/github';
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import Download from '@lucide/svelte/icons/download';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Store from '@lucide/svelte/icons/store';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
</script>

<Section id="contact" eyebrow="// let's talk" title="Build something solid with me.">
	<div
		class="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs"
		use:reveal
	>
		<div
			class="absolute inset-0 -z-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
		></div>
		<div class="relative grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
			<div>
				<h3 class="font-display text-2xl font-bold tracking-tight sm:text-3xl">
					Have a project, a role, or a hard problem?
				</h3>
				<p class="mt-3 max-w-md leading-relaxed text-muted-foreground">
					I reply within a day. Fastest path is email — include what you're building, the stack, and
					the timeline. Full-time roles and select freelance engagements.
				</p>

				<div class="mt-8 space-y-3">
					<div
						class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3"
					>
						<span class="inline-flex items-center gap-2.5 text-sm">
							<Mail class="size-4 text-primary" />
							<span class="font-mono text-[13px]">{profile.email}</span>
						</span>
						<CopyButton text={profile.email} label="email address" />
					</div>
					<div
						class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3"
					>
						<span class="inline-flex items-center gap-2.5 text-sm">
							<Github class="size-4 text-primary" />
							<span class="font-mono text-[13px]">github.com/{profile.githubHandle}</span>
						</span>
						<CopyButton text={profile.github} label="GitHub URL" />
					</div>
					<div
						class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3"
					>
						<span class="inline-flex items-center gap-2.5 text-sm">
							<Linkedin class="size-4 text-primary" />
							<span class="font-mono text-[13px]">linkedin.com/in/mhd-ghaleb</span>
						</span>
						<CopyButton text={profile.linkedin} label="LinkedIn URL" />
					</div>
					<div
						class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3"
					>
						<span class="inline-flex items-center gap-2.5 text-sm">
							<Store class="size-4 text-primary" />
							<span class="font-mono text-[13px]">haraj.com.sa/en/users/{profile.harajHandle}</span>
						</span>
						<CopyButton text={profile.haraj} label="Haraj profile URL" />
					</div>
				</div>

				<p class="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin class="size-4 text-primary" />
					{profile.location} · UTC+3 · remote-friendly
				</p>
			</div>

			<div class="flex flex-col justify-center gap-3">
				<Button
					href="mailto:{profile.email}?subject=Opportunity%20for%20Mohammed"
					size="lg"
					class="gap-2"
				>
					<MessageSquare class="size-4" /> Send an email
				</Button>
				<Button href={profile.resume} variant="outline" size="lg" class="gap-2">
					<Download class="size-4" /> Download résumé (PDF)
				</Button>
				<div class="grid grid-cols-2 gap-3">
					<Button
						href={profile.github}
						target="_blank"
						rel="noopener noreferrer"
						variant="secondary"
						class="gap-2"
					>
						<Github class="size-4" /> GitHub
					</Button>
					<Button
						href={profile.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						variant="secondary"
						class="gap-2"
					>
						<Linkedin class="size-4" /> LinkedIn
					</Button>
					<Button
						href={profile.playStore}
						target="_blank"
						rel="noopener noreferrer"
						variant="secondary"
						class="gap-2"
					>
						<Smartphone class="size-4" /> Play Store
					</Button>
					<Button
						href={profile.haraj}
						target="_blank"
						rel="noopener noreferrer"
						variant="secondary"
						class="gap-2"
					>
						<Store class="size-4" /> Haraj
					</Button>
				</div>
				<p class="mt-2 font-mono text-center text-[11px] text-muted-foreground">
					// response time: &lt; 24h · timezone: Asia/Riyadh
				</p>
			</div>
		</div>
	</div>

	<!-- Services offered via Koprey (from the Haraj profile) -->
	<div class="mt-10" use:reveal>
		<div class="flex flex-wrap items-end justify-between gap-3">
			<div>
				<p class="mb-2 font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
					// services
				</p>
				<h3 class="font-display text-xl font-bold tracking-tight">
					Freelance work, through Koprey.
				</h3>
			</div>
			<a
				href={profile.haraj}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
			>
				See the listings on Haraj <ArrowUpRight class="size-3.5" />
			</a>
		</div>

		<div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each services as service, i (service.title)}
				<div
					class="rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-colors hover:border-primary/40"
					use:reveal={{ delay: i * 60 }}
				>
					<h4 class="font-display text-sm font-semibold">{service.title}</h4>
					<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{service.detail}</p>
				</div>
			{/each}
			<div
				class="flex flex-col justify-center rounded-xl border border-dashed border-border bg-card/50 p-4"
			>
				<p class="text-sm leading-relaxed text-muted-foreground">
					All engagements are quoted per project. Email is the fastest way in — I usually reply the
					same day.
				</p>
				<a
					href="mailto:{profile.email}?subject=Project%20enquiry"
					class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
				>
					Start a project <ArrowUpRight class="size-3.5" />
				</a>
			</div>
		</div>
	</div>
</Section>
