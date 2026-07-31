<script lang="ts">
	import { navLinks, pageLinks, profile } from '$lib/data/portfolio';
	import Github from '@lucide/svelte/icons/github';
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import Mail from '@lucide/svelte/icons/mail';
	import Terminal from '@lucide/svelte/icons/terminal';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-border/60 bg-muted/30">
	<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
			<div>
				<div class="flex items-center gap-2.5">
					<span
						class="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"
					>
						<Terminal class="size-4" />
					</span>
					<span class="font-display font-semibold">{profile.name}</span>
				</div>
				<p class="mt-3 max-w-sm text-sm text-muted-foreground">
					{profile.title} building production software — web, mobile and everything in between.
				</p>
			</div>

			<nav aria-label="Footer" class="flex flex-wrap gap-x-5 gap-y-2 text-sm">
				{#each [...navLinks, ...pageLinks] as link (link.href)}
					<a href={link.href} class="text-muted-foreground transition-colors hover:text-foreground"
						>{link.label}</a
					>
				{/each}
			</nav>

			<div class="flex items-center gap-2">
				<a
					href={profile.github}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub profile"
					class="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
				>
					<Github class="size-4.5" />
				</a>
				<a
					href={profile.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn profile"
					class="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
				>
					<Linkedin class="size-4.5" />
				</a>
				<a
					href="mailto:{profile.email}"
					aria-label="Send email"
					class="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
				>
					<Mail class="size-4.5" />
				</a>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center"
		>
			<p>© {year} {profile.name}. Designed & engineered with SvelteKit + Tailwind CSS.</p>
			<p class="font-mono">v2.0.0 · deployed on Vercel · zero tracking</p>
		</div>
	</div>
</footer>
