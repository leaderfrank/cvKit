<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import Dashboard from '$lib/components/sections/Dashboard.svelte';
	import About from '$lib/components/sections/About.svelte';
	import Skills from '$lib/components/sections/Skills.svelte';
	import Projects from '$lib/components/sections/Projects.svelte';
	import Apps from '$lib/components/sections/Apps.svelte';
	import Experience from '$lib/components/sections/Experience.svelte';
	import Education from '$lib/components/sections/Education.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import ApiShowcase from '$lib/components/apis/ApiShowcase.svelte';
</script>

<svelte:head>
	<title>Mohammed Ghaleb — Full Stack Developer | TypeScript, React, Node.js</title>
</svelte:head>

<main id="main" class="min-h-screen">
	<Hero />
	<Dashboard />
	<About />
	<Skills />
	<Projects />
	<Apps />
	<Experience />
	<Education />
	<ApiShowcase />
	<Contact />
</main>
