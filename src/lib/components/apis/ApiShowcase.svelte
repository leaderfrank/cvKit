<script lang="ts">
	import Section from '$lib/components/shared/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { Button } from '$lib/components/ui/button';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import GitHubCard from './GitHubCard.svelte';
	import HackerNewsCard from './HackerNewsCard.svelte';
	import WeatherCard from './WeatherCard.svelte';
	import CurrencyCard from './CurrencyCard.svelte';
	import DevToCard from './DevToCard.svelte';
	import JokeCard from './JokeCard.svelte';
	import QuoteCard from './QuoteCard.svelte';
	import NotOnListNote from './NotOnListNote.svelte';

	// Grid order drives the reveal stagger: delay = (i % 3) * 70.
	// i=0 GitHub, 1 HN, 2 Weather, 3 Currency, 4 DevTo, 5 Joke, 6 Quote, 7 note.
</script>

<Section
	id="apis"
	eyebrow="// live integrations"
	title="API work, demonstrated — not claimed."
	description="Every card below calls a real public API at runtime through a shared client layer with TTL caching, retries and graceful fallbacks — the same discipline I use in production apps."
>
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		<div class="md:col-span-2" use:reveal>
			<GitHubCard />
		</div>
		<div use:reveal={{ delay: 70 }}>
			<HackerNewsCard />
		</div>
		<div use:reveal={{ delay: 140 }}>
			<WeatherCard />
		</div>
		<div use:reveal>
			<CurrencyCard />
		</div>
		<div use:reveal={{ delay: 70 }}>
			<DevToCard />
		</div>
		<div use:reveal={{ delay: 140 }}>
			<JokeCard />
		</div>
		<div use:reveal>
			<QuoteCard />
		</div>
		<!-- <div use:reveal={{ delay: 70 }}>
			<NotOnListNote />
		</div> -->
	</div>

	<div class="mt-10 flex justify-center" use:reveal={{ delay: 140 }}>
		<Button variant="outline" href="/lab#playground">
			Open the API Playground
			<ArrowUpRight class="size-4" />
		</Button>
	</div>
</Section>
