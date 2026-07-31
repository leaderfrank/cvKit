<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={toggleMode}
	aria-label="Toggle color theme"
	class="relative"
>
	<Sun
		class="size-[1.15rem] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90"
	/>
	<Moon
		class="absolute size-[1.15rem] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
