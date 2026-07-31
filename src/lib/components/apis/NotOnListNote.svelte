<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
</script>

<!--
	Honesty card: not every platform exposes a usable public API.
	Outline-only styling (not an ApiCard — there is no request behind it).
-->
<article
	class="flex h-full flex-col justify-center gap-3 rounded-xl border border-dashed border-border/80 bg-muted/30 px-5 py-5"
>
	<div class="flex items-center gap-2 text-muted-foreground">
		<Info class="size-4" />
		<h3 class="font-mono text-xs font-semibold tracking-wide uppercase">Not on the list</h3>
	</div>
	<p class="font-mono text-[11px] leading-relaxed text-muted-foreground">
		LeetCode has no public CORS-enabled API and Stack Overflow reputation requires a numeric user id
		— wired quickly once provided. The GitHub, Hacker News, dev.to, Open-Meteo, Frankfurter and
		JokeAPI integrations above are live.
	</p>
</article>
