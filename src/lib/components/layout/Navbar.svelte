<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { cn } from '$lib/utils.js';
	import { navLinks, pageLinks, profile } from '$lib/data/portfolio';
	import ThemeToggle from '$lib/components/shared/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Menu from '@lucide/svelte/icons/menu';
	import Terminal from '@lucide/svelte/icons/terminal';

	let scrolled = $state(false);
	let activeSection = $state('');
	let menuOpen = $state(false);

	const isHome = $derived(page.url.pathname === '/');

	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 12);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		const sections = ['about', 'skills', 'projects', 'apps', 'experience', 'contact']
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) activeSection = `#${entry.target.id}`;
				}
			},
			{ rootMargin: '-30% 0px -60% 0px' }
		);
		sections.forEach((s) => observer.observe(s));

		return () => {
			window.removeEventListener('scroll', onScroll);
			observer.disconnect();
		};
	});

	function linkActive(href: string): boolean {
		const [path, hash] = href.split('#');
		if (hash) return isHome && activeSection === `#${hash}`;
		return page.url.pathname === path;
	}
</script>

<svelte:head>
	<meta name="author" content="Mohammed Ghaleb" />
</svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
>
	Skip to content
</a>

<header
	class={cn(
		'fixed inset-x-0 top-0 z-50 transition-all duration-300',
		scrolled ? 'glass shadow-sm' : 'border-b border-transparent bg-transparent'
	)}
>
	<nav
		aria-label="Primary"
		class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6"
	>
		<a href="/" class="group flex items-center gap-2.5" aria-label="{profile.name} — home">
			<span
				class="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105"
			>
				<Terminal class="size-4.5" />
			</span>
			<span class="font-display text-sm font-semibold tracking-tight sm:text-base">
				{profile.name}
			</span>
		</a>

		<!-- Desktop links -->
		<ul class="hidden items-center gap-1 lg:flex">
			{#each navLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						class={cn(
							'relative rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
							linkActive(link.href) && 'text-foreground'
						)}
						aria-current={linkActive(link.href) ? 'true' : undefined}
					>
						{link.label}
						<span
							class={cn(
								'absolute inset-x-3 -bottom-px h-0.5 origin-center rounded-full bg-primary transition-transform duration-300',
								linkActive(link.href) ? 'scale-x-100' : 'scale-x-0'
							)}
						></span>
					</a>
				</li>
			{/each}
			<li class="mx-2 h-5 w-px bg-border" aria-hidden="true"></li>
			{#each pageLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						class={cn(
							'rounded-md px-3 py-2 text-sm font-medium transition-colors',
							linkActive(link.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
						)}>{link.label}</a
					>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-1.5">
			<Button href={profile.resume} variant="outline" size="sm" class="hidden sm:inline-flex">
				Résumé
			</Button>
			<ThemeToggle />
			<!-- Mobile menu -->
			<div class="lg:hidden">
				<Sheet.Root bind:open={menuOpen}>
					<Sheet.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="icon" aria-label="Open menu">
								<Menu class="size-5" />
							</Button>
						{/snippet}
					</Sheet.Trigger>
					<Sheet.Content side="right" class="w-72">
						<Sheet.Header>
							<Sheet.Title class="font-display">Navigation</Sheet.Title>
							<Sheet.Description class="sr-only">Site navigation links</Sheet.Description>
						</Sheet.Header>
						<nav aria-label="Mobile" class="mt-6 flex flex-col gap-1 px-1">
							{#each [...navLinks, ...pageLinks] as link (link.href)}
								<a
									href={link.href}
									onclick={() => (menuOpen = false)}
									class={cn(
										'rounded-lg px-3 py-2.5 text-sm transition-colors',
										linkActive(link.href)
											? 'bg-accent font-medium text-accent-foreground'
											: 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
									)}>{link.label}</a
								>
							{/each}
							<a
								href={profile.resume}
								class="mt-3 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
							>
								Download Résumé
							</a>
						</nav>
					</Sheet.Content>
				</Sheet.Root>
			</div>
		</div>
	</nav>
</header>
