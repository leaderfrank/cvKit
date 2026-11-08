import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// SPA fallback for unknown routes. Using 404.html keeps the prerendered
			// index.html intact instead of overwriting it (adapter-static warning).
			fallback: '404.html'
		})
	}
};

export default config;
