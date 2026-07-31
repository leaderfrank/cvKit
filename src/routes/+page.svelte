<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import Dashboard from '$lib/components/sections/Dashboard.svelte';
	import About from '$lib/components/sections/About.svelte';
	import Skills from '$lib/components/sections/Skills.svelte';
	import Projects from '$lib/components/sections/Projects.svelte';
	import Experience from '$lib/components/sections/Experience.svelte';
	import Testimonials from '$lib/components/sections/Testimonials.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import ApiShowcase from '$lib/components/apis/ApiShowcase.svelte';
</script>

<svelte:head>
	<title>Mohammed Ghaleb — Full Stack Software Engineer</title>
</svelte:head>

<main id="main" class="min-h-screen">
	<Hero />
	<Dashboard />
	<About />
	<Skills />
	<Projects />
	<Experience />
	<ApiShowcase />
	<Testimonials />
	<Contact />
</main>
