<script lang="ts">
	import { onMount } from 'svelte';

	let { roles, class: className }: { roles: string[]; class?: string } = $props();

	let index = $state(0);
	let charCount = $state(roles[0].length);
	let deleting = $state(false);

	const text = $derived(roles[index].slice(0, charCount));

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			// Static: cycle without typewriter effect
			const id = setInterval(() => {
				index = (index + 1) % roles.length;
				charCount = roles[index].length;
			}, 4000);
			return () => clearInterval(id);
		}

		let timeout: ReturnType<typeof setTimeout>;
		const tick = () => {
			const word = roles[index];
			if (!deleting) {
				if (charCount < word.length) {
					charCount++;
					timeout = setTimeout(tick, 55 + Math.random() * 45);
				} else {
					deleting = true;
					timeout = setTimeout(tick, 2200);
				}
			} else {
				if (charCount > 0) {
					charCount--;
					timeout = setTimeout(tick, 28);
				} else {
					deleting = false;
					index = (index + 1) % roles.length;
					timeout = setTimeout(tick, 350);
				}
			}
		};
		timeout = setTimeout(tick, 1800);
		return () => clearTimeout(timeout);
	});
</script>

<span class={className} aria-label={roles.join(' / ')}>
	{text}<span
		class="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle"
		style="height: 1em"
	></span>
</span>
