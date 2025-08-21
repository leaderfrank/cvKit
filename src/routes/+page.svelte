<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toggleMode } from 'mode-watcher';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ProfileImage from '$lib/components/ProfileImage.svelte';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import Github from '@lucide/svelte/icons/github';
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import Mail from '@lucide/svelte/icons/mail';
	import Download from '@lucide/svelte/icons/download';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Calendar from '@lucide/svelte/icons/calendar';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Briefcase from '@lucide/svelte/icons/briefcase';
	import Code2 from '@lucide/svelte/icons/code-2';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	let mounted = $state(false);
	let scrollY = $state(0);
	let mouseX = spring(0, { stiffness: 0.05, damping: 0.95 });
	let mouseY = spring(0, { stiffness: 0.05, damping: 0.95 });
	// Animation states
	let heroVisible = $state(false);
	let aboutVisible = $state(false);
	let experienceVisible = $state(false);
	let skillsVisible = $state(false);
	let projectsVisible = $state(false);
	let contactVisible = $state(false);
	// Track which items are visible
	let visibleExperiences = $state<boolean[]>([]);
	let visibleProjects = $state<boolean[]>([]);
	let visibleSkills = $state<boolean[]>([]);
	// Skills with progress
	const skills = [
		{ name: 'Nuxt + Vue', progress: 90, category: 'Frontend + Backend' },
		{ name: 'SvelteKit + Svelte', progress: 82, category: 'Frontend + Backend' },
		{ name: 'Next + React', progress: 80, category: 'Frontend + Backend' },
		{ name: 'TypeScript / JavaScript', progress: 85, category: 'Backend + Frontend' },
		{ name: 'Node.js', progress: 80, category: 'Backend' },
		{ name: 'Python', progress: 75, category: 'Backend' },
		{ name: 'NoSQL', progress: 75, category: 'Database' },
		{ name: 'SQL/MySQL', progress: 70, category: 'Database' },
		{ name: 'Docker', progress: 65, category: 'DevOps' }
	];

	// Experience data
	const experiences = [
		{
			title: 'Full Stack Developer - React | Nuxt | Next | NoSQL | API',
			company: 'Othouba Line',
			period: '04/2024 - 04/2025',
			location: 'Saudi Arabia',
			description:
				'Developed and maintained a dynamic invoicing and tax reporting platform using Nuxt (Vue 3) and Next with server-side rendering for optimal SEO and fast page loads. Designed scalable UI components, improving load speed and performance by 35%. Built and integrated RESTful APIs to handle customer, product, invoice, and financial statement operations. Architected and managed NoSQL database structure for real-time data updates.',
			technologies: ['Nuxt', 'Next', 'React', 'Node.js', 'NoSQL', 'RESTful APIs', 'Docker']
		},
		{
			title: 'Full Stack Developer - Flutter | Django | Nuxt | Next | API | SQL',
			company: 'Freelance',
			period: '04/2022 - Present',
			location: 'Remote',
			description:
				'Designed and developed cross-platform mobile apps using Flutter. Built and deployed responsive web applications with Nuxt and Next, leveraging SSR and SSG for performance and SEO optimization. Integrated custom APIs for seamless data exchange between mobile, web, and backend services. Created and managed relational databases using SQL, ensuring data integrity.',
			technologies: ['Nuxt', 'Next', 'Flutter', 'Django', 'SQL', 'RESTful APIs']
		},
		{
			title: 'Full Stack Developer - Qt | Python | MySQL | MSSQL',
			company: 'MyERP Solutions Sdn Bhd',
			period: '08/2021 - 02/2022',
			location: 'Malaysia (Internship)',
			description:
				'Migrated 365 SQL Server tables to 330 MySQL tables using a custom Windows application. Enhanced a PHP-based system to support bulk data export/import. Built tools for integrating Excel data into existing databases, reducing manual effort by 50%.',
			technologies: ['Python', 'Qt', 'MySQL', 'MSSQL', 'PHP']
		}
	];

	// Projects data
	const projects = [
		{
			title: 'TaxVerge - Financial Management',
			description:
				'A financial management system for invoices, statements, and tax reports, built with Nuxt and NoSQL. Supports multi-language interface and advanced analytics.',
			technologies: ['Nuxt', 'NoSQL', 'RESTful API', 'Tailwind CSS'],
			github: 'https://taxverge.com',
			demo: 'https://taxverge.com'
		},
		{
			title: 'ResumeGit - Online Resume Builder',
			description:
				'A resume building platform that allows users to create, customize, and share resumes online. Built with Next and Remix, integrated with NoSQL backend.',
			technologies: ['Next', 'Remix', 'NoSQL', 'Tailwind CSS'],
			github: 'https://resumegit.com',
			demo: 'https://resumegit.com'
		},
		{
			title: 'BonYemeni - Online Business Events Tracking',
			description:
				'A WordPress-powered business event tracking platform with custom PHP modules and MySQL database.',
			technologies: ['WordPress', 'PHP', 'MySQL'],
			github: 'https://bonyemeni.com',
			demo: 'https://bonyemeni.com'
		}
	];

	// Initialize visibility arrays
	$effect(() => {
		visibleExperiences = new Array(experiences.length).fill(false);
		visibleProjects = new Array(projects.length).fill(false);
		visibleSkills = new Array(skills.length).fill(false);
	});

	// Create intersection observer for sections
	function observeElement(element: HTMLElement, callback: () => void) {
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						callback();
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		observer.observe(element);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	// Create intersection observer for items with delay
	function observeItem(element: HTMLElement, params: { callback: () => void; delay?: number }) {
		if (!element) return;

		const { callback, delay = 0 } = params;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							callback();
						}, delay);
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -50px 0px'
			}
		);

		observer.observe(element);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	onMount(() => {
		mounted = true;

		setTimeout(() => (heroVisible = true), 100);

		const handleScroll = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', handleScroll);

		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);
		};
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<svelte:head>
	<title>Mohammed Ghaleb - Full Stack Developer & UI/UX Enthusiast</title>
</svelte:head>

<svelte:window bind:scrollY />

<div class="min-h-screen bg-background relative overflow-x-hidden">
	<!-- Animated background gradient -->
	<div
		class="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"
		style="transform: translate({$mouseX * 0.01}px, {$mouseY * 0.01}px)"
	></div>

	<!-- Floating orbs -->
	<div class="fixed inset-0 pointer-events-none">
		<div
			class="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
			style="animation-delay: 0s"
		></div>
		<div
			class="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
			style="animation-delay: 2s"
		></div>
	</div>

	<!-- Navigation -->
	<nav class="fixed top-0 w-full backdrop-blur-md bg-background/80 border-b z-50">
		<div class="container mx-auto px-6 py-4 flex justify-between items-center">
			<Button
				class="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
				variant="link"
				href="/"
			>
				Mohammed Ghaleb
			</Button>

			<Button onclick={toggleMode} variant="outline" size="icon" aria-label="Toggle theme">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="min-h-screen flex items-center justify-center relative">
		{#if heroVisible}
			<div class="container mx-auto px-6 text-center" in:fade={{ duration: 700 }}>
				<!-- Profile Image -->
				<div class="mb-8" in:scale={{ duration: 700, delay: 100 }}>
					<ProfileImage src="/profile.jpg" alt="Mohammed Ghaleb Profile" />
				</div>

				<div class="mb-6" in:fly={{ y: 20, duration: 600, delay: 200 }}>
					<Badge variant="secondary" class="mb-4 text-md">
						<Sparkles class="w-3 h-3 mr-1" />
						Available for hire
					</Badge>
				</div>

				<h1
					class="text-6xl md:text-8xl font-bold mb-6 text-black dark:text-white"
					in:fly={{ y: 30, duration: 700, delay: 400 }}
				>
					Mohammed Ghaleb
				</h1>

				<p
					class="text-2xl md:text-3xl text-muted-foreground mb-8"
					in:fly={{ y: 30, duration: 700, delay: 600 }}
				>
					Full Stack Developer & UI/UX Enthusiast
				</p>

				<div class="flex gap-4 justify-center mb-12" in:fly={{ y: 30, duration: 700, delay: 800 }}>
					<Button
						size="lg"
						class="group"
						href="/Mohammed Ghaleb CV.pdf"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Download CV"
					>
						<Download class="w-4 h-4 mr-2 group-hover:animate-bounce" />
						Download CV
					</Button>
					<Button
						size="lg"
						variant="outline"
						href="mailto:mhd.s.ghaleb@gmail.com"
						aria-label="Contact Me"
					>
						<Mail class="w-4 h-4 mr-2" />
						Contact Me
					</Button>
				</div>

				<div class="flex gap-4 justify-center" in:scale={{ duration: 600, delay: 1000 }}>
					<Button
						variant="ghost"
						size="icon"
						class="hover:scale-110 transition-transform"
						href="https://github.com/leaderfrank"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub Profile"
					>
						<Github class="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="hover:scale-110 transition-transform"
						href="https://www.linkedin.com/in/mhd-ghaleb/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn Profile"
					>
						<Linkedin class="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="hover:scale-110 transition-transform"
						href="mailto:mhd.s.ghaleb@gmail.com"
						aria-label="Send Email"
					>
						<Mail class="w-5 h-5" />
					</Button>
				</div>
			</div>
		{/if}

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
			<div class="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
				<div class="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-scroll"></div>
			</div>
		</div>
	</section>

	<!-- About Section -->
	<section id="about" class="py-20" use:observeElement={() => (aboutVisible = true)}>
		{#if aboutVisible}
			<div class="container mx-auto px-6" in:fade={{ duration: 600 }}>
				<h2 class="text-4xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 600 }}>
					About Me
				</h2>

				<div class="max-w-3xl mx-auto" in:scale={{ duration: 600, delay: 200 }}>
					<Card class="backdrop-blur-sm bg-card/50 border-primary/20">
						<CardContent class="p-8">
							<p class="text-lg leading-relaxed text-muted-foreground">
								Results-driven Software Engineer with 2+ years of experience in building scalable
								web applications and backend services using JavaScript, Node.js, and cloud-native
								technologies. Passionate about clean code, performance optimization, and solving
								real-world problems through technology. Seeking to contribute to a fast-paced,
								product-driven environment where I can lead impactful engineering projects and grow
								alongside a world-class team.
							</p>

							<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
								{#each [{ value: '2+', label: 'Years Experience' }, { value: '20+', label: 'Projects Completed' }, { value: '15+', label: 'Happy Clients' }, { value: '5+', label: 'Certifications Earned' }] as stat, i}
									<div class="text-center" in:scale={{ duration: 400, delay: 400 + i * 100 }}>
										<div class="text-3xl font-bold text-primary">{stat.value}</div>
										<div class="text-sm text-muted-foreground">{stat.label}</div>
									</div>
								{/each}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		{/if}
	</section>

	<!-- Experience Section -->
	<section id="experience" class="py-20" use:observeElement={() => (experienceVisible = true)}>
		{#if experienceVisible}
			<div class="container mx-auto px-6">
				<h2 class="text-4xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 600 }}>
					Experience
				</h2>

				<div class="max-w-3xl mx-auto space-y-6">
					{#each experiences as exp, i}
						<div
							use:observeItem={{
								callback: () => {
									visibleExperiences[i] = true;
									visibleExperiences = visibleExperiences;
								},
								delay: i * 300
							}}
						>
							{#if visibleExperiences[i]}
								<div in:fly={{ x: -50, duration: 700 }}>
									<Card
										class="backdrop-blur-sm bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
									>
										<CardHeader>
											<div class="flex justify-between items-start">
												<div>
													<CardTitle class="text-xl flex items-center gap-2">
														<Briefcase class="w-5 h-5 text-primary" />
														{exp.title}
													</CardTitle>
													<CardDescription class="text-base mt-1">{exp.company}</CardDescription>
												</div>
												<Badge variant="secondary">
													<Calendar class="w-3 h-3 mr-1" />
													{exp.period}
												</Badge>
											</div>
											<div class="flex items-center gap-2 text-sm text-muted-foreground mt-2">
												<MapPin class="w-4 h-4" />
												{exp.location}
											</div>
										</CardHeader>
										<CardContent>
											<p class="text-muted-foreground mb-4">{exp.description}</p>
											<div class="flex flex-wrap gap-2">
												{#each exp.technologies as tech}
													<Badge variant="outline">{tech}</Badge>
												{/each}
											</div>
										</CardContent>
									</Card>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>

	<!-- Skills Section -->
	<section id="skills" class="py-20" use:observeElement={() => (skillsVisible = true)}>
		{#if skillsVisible}
			<div class="container mx-auto px-6">
				<h2 class="text-4xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 600 }}>
					Skills
				</h2>

				<div class="max-w-3xl mx-auto">
					<div class="grid gap-6">
						{#each skills as skill, i}
							<div
								use:observeItem={{
									callback: () => {
										visibleSkills[i] = true;
										visibleSkills = visibleSkills;
									},
									delay: i * 200
								}}
							>
								{#if visibleSkills[i]}
									<div class="space-y-2" in:fly={{ x: 50, duration: 600 }}>
										<div class="flex justify-between items-center">
											<div class="flex items-center gap-2">
												<Code2 class="w-4 h-4 text-primary" />
												<span class="font-medium">{skill.name}</span>
												<Badge variant="secondary" class="text-xs">{skill.category}</Badge>
											</div>
											<span class="text-sm text-muted-foreground">{skill.progress}%</span>
										</div>
										<div class="relative h-2 bg-secondary rounded-full overflow-hidden">
											<div
												class="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out"
												style="width: {skill.progress}%"
											></div>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</section>

	<!-- Projects Section -->
	<section id="projects" class="py-20" use:observeElement={() => (projectsVisible = true)}>
		{#if projectsVisible}
			<div class="container mx-auto px-6">
				<h2 class="text-4xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 600 }}>
					Projects
				</h2>

				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{#each projects as project, i}
						<div
							use:observeItem={{
								callback: () => {
									visibleProjects[i] = true;
									visibleProjects = visibleProjects;
								},
								delay: i * 300
							}}
						>
							{#if visibleProjects[i]}
								<div in:scale={{ duration: 700 }}>
									<Card
										class="backdrop-blur-sm bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group h-full"
									>
										<CardHeader>
											<CardTitle class="text-lg">{project.title}</CardTitle>
											<CardDescription>{project.description}</CardDescription>
										</CardHeader>
										<CardContent>
											<div class="flex flex-wrap gap-2 mb-4">
												{#each project.technologies as tech}
													<Badge variant="secondary" class="text-xs">{tech}</Badge>
												{/each}
											</div>
											<div class="flex gap-2">
												<Button
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
													variant="outline"
													size="sm"
													class="flex-1 group/btn"
													aria-label={`View code for ${project.title}`}
												>
													<Github
														class="w-4 h-4 mr-1 group-hover/btn:rotate-12 transition-transform"
													/>
													Code
												</Button>
												<Button
													href={project.demo}
													target="_blank"
													rel="noopener noreferrer"
													variant="outline"
													size="sm"
													class="flex-1 group/btn"
													aria-label={`View demo for ${project.title}`}
												>
													<ExternalLink
														class="w-4 h-4 mr-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
													/>
													Demo
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>

	<!-- Contact Section -->
	<section id="contact" class="py-20" use:observeElement={() => (contactVisible = true)}>
		{#if contactVisible}
			<div class="container mx-auto px-6 text-center" in:fade={{ duration: 600 }}>
				<h2 class="text-4xl font-bold mb-8" in:fly={{ y: 20, duration: 600 }}>Let's Connect</h2>
				<p
					class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
					in:fly={{ y: 20, duration: 600, delay: 200 }}
				>
					I'm always interested in hearing about new projects and opportunities.
				</p>
				<div in:scale={{ duration: 600, delay: 400 }}>
					<Button
						size="lg"
						class="group"
						href="mailto:mhd.s.ghaleb@gmail.com"
						aria-label="Get in touch via email"
					>
						<Mail class="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
						Get In Touch
					</Button>
				</div>
			</div>
		{/if}
	</section>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-20px) scale(1.05);
		}
	}

	@keyframes scroll {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(100%);
		}
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	.animate-scroll {
		animation: scroll 1.5s ease-in-out infinite;
	}

	/* Custom scrollbar */
	:global(html) {
		scrollbar-width: thin;
		scrollbar-color: hsl(var(--primary)) hsl(var(--background));
	}

	:global(html::-webkit-scrollbar) {
		width: 8px;
	}

	:global(html::-webkit-scrollbar-track) {
		background: hsl(var(--background));
	}

	:global(html::-webkit-scrollbar-thumb) {
		background: hsl(var(--primary));
		border-radius: 4px;
	}

	:global(html::-webkit-scrollbar-thumb:hover) {
		background: hsl(var(--primary) / 0.8);
	}
</style>
