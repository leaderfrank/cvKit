/**
 * Single source of truth for portfolio content.
 * Every section reads from here so the site stays consistent and easy to update.
 *
 * Content is derived from the tailored CVs in `static/Tailored CVs`, the Google Play
 * developer listing, the GitHub profile and the Haraj profile. Where sources disagreed,
 * the CVs won — see README notes for the conflicts kept on record.
 */

export const profile = {
	name: 'Mohammed Ghaleb',
	fullName: 'Mohammed Sultan Ahmed Ghaleb',
	title: 'Full Stack Developer',
	location: 'Jeddah, Saudi Arabia',
	email: 'mhd.s.ghaleb@gmail.com',
	github: 'https://github.com/leaderfrank',
	githubHandle: 'leaderfrank',
	linkedin: 'https://www.linkedin.com/in/mhd-ghaleb/',
	haraj: 'https://haraj.com.sa/en/users/koprey/',
	harajHandle: 'koprey',
	playStore: 'https://play.google.com/store/apps/dev?id=7415399730246466855',
	playStoreName: 'Koprey',
	resume: '/Mohammed-Ghaleb-CV.pdf',
	site: 'https://cvkit.vercel.app/',
	summary: `I'm a Full Stack Developer with 2+ years building production platforms in TypeScript, React, Next.js and Node.js on PostgreSQL and Docker. I ship end to end — REST API design, schema and query optimisation, ZATCA-compliant e-invoicing, and cross-platform apps for web, Android and desktop.`
} as const;

/** Every CV states "2+ years" of professional experience. */
export const yearsExperience = 2;

export const achievements = [
	{
		metric: '35%',
		label: 'Faster platform load',
		description:
			'A 40+ component Tailwind system and query-level tuning on the Othouba Line invoicing platform improved load speed by 35%.'
	},
	{
		metric: '365 → 330',
		label: 'Tables migrated',
		description:
			'Migrated the MyERP database from 365 Microsoft SQL Server tables to 330 optimised MySQL tables with a custom ETL tool.'
	},
	{
		metric: '30+',
		label: 'POS devices synced',
		description:
			'Integrated terminals, payment devices, printers and the accounting backend over REST APIs — cutting sync failures by ~40%.'
	},
	{
		metric: '100%',
		label: 'ZATCA Phase 2 compliant',
		description:
			'UBL 2.1 XML e-invoices with cryptographic stamps and TLV/QR encoding, cleared and reported through the Fatoora SDK.'
	},
	{
		metric: '9',
		label: 'Apps on Google Play',
		description:
			'Designed, built and published nine Android apps — owning builds, signing, store listings and review end to end.'
	}
] as const;

export interface SkillCategory {
	id: string;
	label: string;
	items: string[];
}

export const skillCategories: SkillCategory[] = [
	{
		id: 'languages',
		label: 'Languages',
		items: ['TypeScript', 'JavaScript', 'SQL', 'Python', 'Dart', 'PHP', 'HTML5', 'CSS3']
	},
	{
		id: 'frontend',
		label: 'Frontend',
		items: [
			'React',
			'Next.js',
			'Vue.js',
			'Nuxt',
			'SvelteKit',
			'Remix',
			'Tailwind CSS',
			'Vite',
			'SSR / SSG'
		]
	},
	{
		id: 'backend',
		label: 'Backend & APIs',
		items: [
			'Node.js',
			'Express',
			'Django',
			'REST API Design',
			'Auth & RBAC',
			'XML / UBL 2.1',
			'Stripe'
		]
	},
	{
		id: 'mobile',
		label: 'Mobile & Desktop',
		items: ['Flutter', 'Dart', 'Tauri', 'Android', 'Google Play Console']
	},
	{
		id: 'databases',
		label: 'Databases',
		items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Microsoft SQL Server', 'MariaDB']
	},
	{
		id: 'devops',
		label: 'Cloud & DevOps',
		items: ['Docker', 'Git', 'GitHub', 'CI/CD', 'Vercel', 'Cloudflare Workers', 'Linux', 'AWS']
	},
	{
		id: 'practices',
		label: 'Testing & Practices',
		items: [
			'Postman',
			'Playwright',
			'API Testing',
			'Code Reviews',
			'SOLID',
			'Agile / Scrum',
			'Performance Optimisation',
			'Data Migration'
		]
	}
];

export const totalTechCount = skillCategories.reduce((n, c) => n + c.items.length, 0);

/** Axes (0–100) for the interactive radar chart. */
export const radarAxes = [
	{ id: 'frontend', label: 'Frontend', value: 92 },
	{ id: 'backend', label: 'Backend', value: 88 },
	{ id: 'mobile', label: 'Mobile', value: 84 },
	{ id: 'databases', label: 'Databases', value: 88 },
	{ id: 'devops', label: 'Cloud & DevOps', value: 76 },
	{ id: 'architecture', label: 'Architecture', value: 82 },
	{ id: 'apis', label: 'API Design', value: 90 },
	{ id: 'performance', label: 'Performance', value: 86 }
] as const;

export interface Experience {
	company: string;
	role: string;
	period: string;
	current?: boolean;
	location: string;
	summary: string;
	highlights: { title: string; detail: string }[];
	stack: string[];
}

export const experience: Experience[] = [
	{
		company: 'Abdulwaheed Abdrabbo Abdulkhair Mohammed Est.',
		role: 'Full Stack Developer',
		period: 'Jan 2026 — Present',
		current: true,
		location: 'Jeddah, Saudi Arabia',
		summary:
			'Own the company smart POS platform end to end — device software and the back-office web application — across 30+ deployed terminals.',
		highlights: [
			{
				title: 'ZATCA Phase 2 compliance',
				detail:
					'Took the Integration Phase from scoping to 100% compliant e-invoicing: UBL 2.1 XML with cryptographic stamps and TLV/QR encoding, plus clearance and reporting APIs via the Fatoora SDK.'
			},
			{
				title: 'Device integration',
				detail:
					'Wired POS terminals, payment devices, printers and the accounting backend together over REST APIs, synchronising 30+ devices and cutting data-sync failures by ~40%.'
			},
			{
				title: 'Finance modules',
				detail:
					'Built accounts management — journal entries, 15% VAT calculation, invoice reconciliation and financial reporting — saving the finance team ~10 hours per week.'
			},
			{
				title: 'Field reliability',
				detail:
					'Diagnosed and resolved 100+ POS hardware and software faults, reducing average resolution time by ~30% while sustaining 99.9% uptime.'
			}
		],
		stack: [
			'TypeScript',
			'Node.js',
			'React',
			'PostgreSQL',
			'SQL Server',
			'REST APIs',
			'XML / UBL 2.1',
			'Docker'
		]
	},
	{
		company: 'Othouba Line',
		role: 'Full Stack Developer',
		period: 'Mar 2024 — Jan 2025',
		location: 'Jeddah, Saudi Arabia',
		summary:
			'Built a full-stack invoicing and tax reporting platform in React, Next.js and Node.js, processing 5,000+ invoices per month.',
		highlights: [
			{
				title: 'API architecture',
				detail:
					'Architected and secured 60+ RESTful endpoints with input validation and role-based access control, cutting API errors by ~45%.'
			},
			{
				title: 'Data layer',
				detail:
					'Modelled and optimised a MongoDB schema for multi-GB production datasets, improving query performance by ~50% through indexing and aggregation pipelines.'
			},
			{
				title: 'Component system',
				detail:
					'Designed 40+ reusable UI components with responsive Tailwind CSS layouts, improving load speed by 35%.'
			}
		],
		stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Docker']
	},
	{
		company: 'Koprey',
		role: 'Founder & Full Stack Developer',
		period: '2022 — Present',
		current: true,
		location: 'Remote — Malaysia & Saudi Arabia',
		summary:
			'Founded and run Koprey, an independent web and mobile practice delivering 20+ client projects end to end across e-commerce, education, real estate, hospitality and F&B.',
		highlights: [
			{
				title: 'Cross-platform delivery',
				detail:
					'Designed and shipped Flutter applications for Android and desktop across 10+ client engagements, wired to custom REST backends.'
			},
			{
				title: 'Web performance & SEO',
				detail:
					'Built Next.js applications with SSR and SSG, improving client load performance and search rankings by ~40%.'
			},
			{
				title: 'Commerce & data',
				detail:
					'Delivered Salla, Zid and Shopify storefronts with Stripe integration, maintaining the MySQL and PostgreSQL databases behind them.'
			}
		],
		stack: [
			'Flutter',
			'Dart',
			'Tauri',
			'Next.js',
			'React',
			'Django',
			'Node.js',
			'MySQL',
			'PostgreSQL',
			'Stripe'
		]
	},
	{
		company: 'MyERP Solutions Sdn Bhd',
		role: 'Full Stack Developer — Internship',
		period: 'Jun 2021 — Feb 2022',
		location: 'Kuala Lumpur, Malaysia',
		summary:
			'Migrated a production ERP database and built the tooling that made the move repeatable and verifiable.',
		highlights: [
			{
				title: 'Large-scale data migration',
				detail:
					'Migrated 365 Microsoft SQL Server tables into 330 optimised MySQL tables using a custom Windows migration tool with schema mapping and ETL logic.'
			},
			{
				title: 'ERP enhancements',
				detail:
					'Added bulk export and import to a PHP-based ERP system, cutting routine back-office processing from hours to minutes.'
			},
			{
				title: 'Automation tooling',
				detail:
					'Built Excel-to-database tools in Python and Qt, reducing manual data entry effort by 50%.'
			}
		],
		stack: ['Python', 'Qt', 'PHP', 'SQL Server', 'MySQL', 'ETL']
	}
];

export interface Project {
	name: string;
	tagline: string;
	period: string;
	description: string;
	stack: string[];
	link: string;
	icon: 'file-text' | 'git-branch' | 'globe' | 'truck' | 'store' | 'wrench';
	accent: 'violet' | 'cyan' | 'amber' | 'emerald';
	highlights: { title: string; detail: string }[];
	metrics: { label: string; value: string }[];
}

export const projects: Project[] = [
	{
		name: 'TaxVerge',
		tagline: 'Tax & financial management SaaS',
		period: 'Aug 2024 — Oct 2024',
		description:
			'A financial management platform for tax preparation, invoicing and reporting with real-time analytics, discounts, taxes and payment tracking — shipped as a multi-platform SaaS across Android, Windows, Linux and web.',
		stack: ['Nuxt', 'Vue', 'MariaDB', 'SSR'],
		link: 'https://taxverge.pages.dev',
		icon: 'file-text',
		accent: 'violet',
		highlights: [
			{
				title: 'Architecture',
				detail:
					'SSR-first Nuxt front end over a MariaDB data layer, packaged once and shipped to Android, Windows, Linux and the browser.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Keeping tax maths consistent across four platforms — the calculation and reporting logic lives in one shared module rather than per-client.'
			},
			{
				title: 'Outcome',
				detail:
					'36 active users at 99.9% uptime, with tax preparation reported 40% faster than the manual workflow it replaced.'
			}
		],
		metrics: [
			{ label: 'Active users', value: '36' },
			{ label: 'Uptime', value: '99.9%' },
			{ label: 'Tax prep', value: '40% faster' }
		]
	},
	{
		name: 'Zam Logix',
		tagline: 'Logistics workflow platform',
		period: 'Jun 2026 — Aug 2026',
		description:
			'Logistics and workflow management tooling on a serverless edge architecture — Cloudflare Workers with PostgreSQL persistence — digitising eight operational workflows for daily dispatch users.',
		stack: ['Cloudflare Workers', 'Svelte 5', 'PostgreSQL'],
		link: 'https://zam-logix.kayat.workers.dev',
		icon: 'truck',
		accent: 'cyan',
		highlights: [
			{
				title: 'Architecture',
				detail:
					'Designed the workflow and data model from scratch, then ran it at the edge so requests never wait on a single origin region.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Edge runtimes have no long-lived process — connection pooling and per-request PostgreSQL access had to be rethought.'
			},
			{
				title: 'Outcome',
				detail:
					'Eight operational workflows digitised, holding ~200 ms edge response times for 106 daily operations users.'
			}
		],
		metrics: [
			{ label: 'Workflows', value: '8' },
			{ label: 'Edge latency', value: '~200 ms' },
			{ label: 'Daily users', value: '106' }
		]
	},
	{
		name: 'Taif',
		tagline: 'Khayyat Al-Taif — tailoring business platform',
		period: 'Nov 2025 — Feb 2026',
		description:
			'A Svelte/Vite progressive web app, a Tauri/Rust Android app and an Electron/Node.js management system built for a Jeddah tailoring business — plus the growth work that put them to use.',
		stack: ['Svelte', 'Vite', 'PWA', 'Tauri', 'Rust', 'Electron'],
		link: 'https://taif.kayat.site',
		icon: 'globe',
		accent: 'amber',
		highlights: [
			{
				title: 'Three surfaces, one business',
				detail:
					'Customer-facing PWA for bookings and enquiries, a Tauri/Rust Android companion, and a desktop management system in Electron and Node.js.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Hitting a 96/100 Lighthouse score on a media-heavy booking journey — image budgets, route splitting and near-zero JavaScript on first paint.'
			},
			{
				title: 'Outcome',
				detail:
					'Google reviews grew from 3.9 (91 reviews) to 4.2 (124) in three months while generating 281 leads per month.'
			}
		],
		metrics: [
			{ label: 'Lighthouse', value: '96/100' },
			{ label: 'Reviews', value: '3.9 → 4.2' },
			{ label: 'Leads', value: '281 / mo' }
		]
	},
	{
		name: 'Bon Yemeni',
		tagline: 'E-commerce store',
		period: 'Apr 2024 — May 2024',
		description:
			'A full e-commerce site in WordPress and PHP with a MySQL product catalogue, cart and customer accounts for a Yemeni coffee brand based in Rotterdam.',
		stack: ['WordPress', 'PHP', 'MySQL'],
		link: 'https://bonyemeni.com',
		icon: 'store',
		accent: 'emerald',
		highlights: [
			{
				title: 'Architecture',
				detail:
					'Hand-written PHP templates and custom WordPress plugins instead of page-builder bloat, with tuned MySQL queries behind the catalogue.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Seven payment methods — Visa, Mastercard, Amex, Google Pay, Apple Pay and iDEAL — had to coexist on one checkout without duplicating order logic.'
			},
			{
				title: 'Outcome',
				detail:
					'A content-managed store the client edits without developer help, plus WhatsApp customer chat wired into the same flow.'
			}
		],
		metrics: [
			{ label: 'Payment methods', value: '7' },
			{ label: 'Stack', value: 'LAMP' },
			{ label: 'Market', value: 'NL' }
		]
	},
	{
		name: 'ResumeGit',
		tagline: 'Portfolio & résumé builder',
		period: 'Jan 2024 — Feb 2024',
		description:
			'A React and Remix application with server-side rendering for customisable portfolio and résumé templates, project showcases and digital certificate display.',
		stack: ['React', 'Remix', 'MariaDB', 'SSR'],
		link: 'https://rsmegit.vercel.app',
		icon: 'git-branch',
		accent: 'violet',
		highlights: [
			{
				title: 'Architecture',
				detail:
					'Remix nested routes and loaders make every template edit a URL-addressable state, so previews are shareable and deep-linkable.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Version control UX for non-developers: diff-friendly snapshots with optimistic updates and conflict-safe autosave.'
			},
			{
				title: 'Outcome',
				detail: '30 registered users and 12 portfolios created, at a 95/100 Lighthouse score.'
			}
		],
		metrics: [
			{ label: 'Users', value: '30' },
			{ label: 'Portfolios', value: '12' },
			{ label: 'Lighthouse', value: '95/100' }
		]
	}
];

/** Smaller shipped work, shown as a strip under the main project cards. */
export const supportingWork = [
	{
		title: 'Koprey — digital services platform',
		description:
			'React platform with a service catalogue, pricing packages and a portfolio showcase across six industries, using GSAP animation and Arabic-first localisation for the Saudi market. Generated 73+ client inquiries.',
		link: 'https://koprey.kayat.site',
		linkLabel: 'koprey.kayat.site',
		icon: 'layout' as const
	},
	{
		title: 'cvKit — this website',
		description:
			'SvelteKit + Tailwind v4, statically exported, 98/100 Lighthouse across live GitHub, Hacker News and weather API integrations. The tools and the code lab are the demos.',
		link: 'https://github.com/leaderfrank/cvKit',
		linkLabel: 'github.com/leaderfrank/cvKit',
		icon: 'gauge' as const
	}
];

export interface Repo {
	name: string;
	description: string;
	stack: string[];
	link: string;
	stars: number;
}

/** Public GitHub repositories not already covered by the apps or project cards. */
export const repos: Repo[] = [
	{
		name: 'cvKit',
		description:
			'Animated SvelteKit CV and portfolio kit with shadcn styling, deployed to Vercel and Cloudflare Pages.',
		stack: ['SvelteKit', 'Tailwind CSS', 'TypeScript'],
		link: 'https://github.com/leaderfrank/cvKit',
		stars: 2
	},
	{
		name: 'DexieConvex',
		description:
			'Local-first PWA that keeps working offline on an IndexedDB store and reconciles with a Convex backend.',
		stack: ['Svelte', 'Dexie', 'Convex'],
		link: 'https://github.com/leaderfrank/DexieConvex',
		stars: 5
	},
	{
		name: 'tinyCMS',
		description:
			'Offline customer-management desktop app built with Nuxt, SQLite compiled to WebAssembly and Tauri.',
		stack: ['Nuxt', 'Tauri', 'SQLite WASM'],
		link: 'https://github.com/leaderfrank/tinyCMS',
		stars: 1
	},
	{
		name: 'Shopify-Custom-Floating-Bar',
		description:
			'Shopify app showing admin Remix code driving a storefront app-embed UI through GraphQL metafields.',
		stack: ['Remix', 'Shopify', 'GraphQL'],
		link: 'https://github.com/leaderfrank/Shopify-Custom-Floating-Bar',
		stars: 4
	},
	{
		name: 'Food-Ordering-Expo-React-Native',
		description:
			'React Native app built with Expo that lets users search for food items and place orders.',
		stack: ['React Native', 'Expo'],
		link: 'https://github.com/leaderfrank/Food-Ordering-Expo-React-Native',
		stars: 6
	},
	{
		name: 'Custom-Corona-Tracker-using-PHP',
		description: 'A COVID-19 case tracker built with PHP and JavaScript.',
		stack: ['PHP', 'JavaScript'],
		link: 'https://github.com/leaderfrank/Custom-Corona-Tracker-using-PHP',
		stars: 10
	}
];

export interface PlayApp {
	name: string;
	subtitle?: string;
	description: string;
	category: string;
	icon: string;
	link: string;
	packageId: string;
}

/**
 * Every app on the Google Play developer page
 * https://play.google.com/store/apps/dev?id=7415399730246466855 — 9 of 9, no omissions.
 * Names, short descriptions and categories are taken verbatim from the store listings.
 */
export const playApps: PlayApp[] = [
	{
		name: 'FindX - Proportion Solver',
		description: 'Solve proportions a/b = c/d instantly. Offline ratio calculator for math.',
		category: 'Education',
		icon: '/apps/site.koprey.findx.png',
		link: 'https://play.google.com/store/apps/details?id=site.koprey.findx',
		packageId: 'site.koprey.findx'
	},
	{
		name: 'Dusklit Outpost Hardcore',
		description: 'Offline hardcore tower defense: build, branch turrets, hold every sector.',
		category: 'Strategy',
		icon: '/apps/site.koprey.dusklitoutpost.png',
		link: 'https://play.google.com/store/apps/details?id=site.koprey.dusklitoutpost',
		packageId: 'site.koprey.dusklitoutpost'
	},
	{
		name: 'Imagen – AI Photo Editor',
		description: 'AI photo editor to retouch, remove objects and swap backgrounds.',
		category: 'Photography',
		icon: '/apps/site.koprey.imagen.png',
		link: 'https://play.google.com/store/apps/details?id=site.koprey.imagen',
		packageId: 'site.koprey.imagen'
	},
	{
		name: 'Voicair - AI HD Voice Recorder',
		description: 'AI voice recorder: audio transcription, speaker detection & meeting summaries.',
		category: 'Tools',
		icon: '/apps/com.koprey.aivoicerecorder.png',
		link: 'https://play.google.com/store/apps/details?id=com.koprey.aivoicerecorder',
		packageId: 'com.koprey.aivoicerecorder'
	},
	{
		name: 'Email Keyword Matcher',
		description: 'Never miss critical email. On-device AI, keywords & urgent reminders.',
		category: 'Productivity',
		icon: '/apps/site.kayat.emailkeywordmatcher.png',
		link: 'https://play.google.com/store/apps/details?id=site.kayat.emailkeywordmatcher',
		packageId: 'site.kayat.emailkeywordmatcher'
	},
	{
		name: 'Notification Keyword Forwarder',
		description: 'Automatically forward matching notifications to WhatsApp or SMS.',
		category: 'Tools',
		icon: '/apps/site.kayat.smsforward.png',
		link: 'https://play.google.com/store/apps/details?id=site.kayat.smsforward',
		packageId: 'site.kayat.smsforward'
	},
	{
		name: 'PromptPocket - Offline AI Chat',
		description: 'Offline AI companion. Chat, prompts & voice. Private, fast, no cloud.',
		category: 'Productivity',
		icon: '/apps/site.kayat.promptpocket.png',
		link: 'https://play.google.com/store/apps/details?id=site.kayat.promptpocket',
		packageId: 'site.kayat.promptpocket'
	},
	{
		name: 'Localkey - Password Manager',
		description: 'Local-first password manager with strong encryption, generator & cloud backup.',
		category: 'Tools',
		icon: '/apps/site.koprey.passwordmanager.png',
		link: 'https://play.google.com/store/apps/details?id=site.koprey.passwordmanager',
		packageId: 'site.koprey.passwordmanager'
	},
	{
		name: 'إتقان - قدرات وتحصيلي',
		subtitle: 'Itqan — GAT & Achievement Test Prep',
		description:
			'Prepare for aptitude and achievement tests with thousands of smart questions and tests.',
		category: 'Education',
		icon: '/apps/site.kayat.itqan.png',
		link: 'https://play.google.com/store/apps/details?id=site.kayat.itqan',
		packageId: 'site.kayat.itqan'
	}
];

export interface Education {
	degree: string;
	institution: string;
	location: string;
	period: string;
	detail: string;
	grade: string;
}

export const education: Education[] = [
	{
		degree: 'Master of Business Administration',
		institution: 'INTI International University',
		location: 'Kuala Lumpur, Malaysia',
		period: 'Oct 2025 — Oct 2027 (expected)',
		detail: 'CGPA 3.76 / 4.00',
		grade: 'MBA'
	},
	{
		degree: 'BSc Computer Science (Hons) Software Engineering',
		institution: 'INTI International University / Coventry University',
		location: 'Kuala Lumpur, Malaysia',
		period: 'Jan 2019 — Dec 2021',
		detail:
			'CGPA 3.56 / 4.00 · Final year project: Handwriting Pattern Recognition System Using Neural Network',
		grade: 'BSc'
	}
];

export const certifications = [
	{
		name: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional',
		issuer: 'Oracle',
		date: 'Sep 2025'
	},
	{
		name: 'Getting Started with DevOps on AWS',
		issuer: 'Amazon Web Services',
		date: 'Sep 2025'
	},
	{
		name: 'AWS Educate Introduction to Generative AI',
		issuer: 'AWS Training Badge',
		date: 'Oct 2025'
	},
	{
		name: 'Next.js App Router Fundamentals',
		issuer: 'Vercel',
		date: 'Aug 2025'
	},
	{
		name: 'Build Your Generative AI Productivity Skills',
		issuer: 'Microsoft',
		date: 'May 2025'
	},
	{
		name: 'Oracle Cloud Infrastructure AI Foundations Associate',
		issuer: 'Oracle',
		date: 'Sep 2023'
	}
];

export const spokenLanguages = [
	{ name: 'Arabic', level: 'Native' },
	{ name: 'English', level: 'Professional — TOEFL iBT 104/120 (Aug 2025)' }
];

/** Services advertised on the Haraj profile — the professional subset only. */
export const services = [
	{
		title: 'Landing pages & marketing sites',
		detail: 'Design-to-deploy Next.js builds with technical SEO and Core Web Vitals in mind.'
	},
	{
		title: 'E-commerce on Salla, Zid & Shopify',
		detail: 'Store setup, customisation and Stripe payment integration for Saudi merchants.'
	},
	{
		title: 'Website speed & technical performance',
		detail: 'Profiling, query tuning and bundle work — measured before and after.'
	},
	{
		title: 'Flutter & API application development',
		detail: 'Cross-platform apps wired to custom REST backends, from schema to store release.'
	},
	{
		title: 'Google Play release support',
		detail: 'Closed testing, signing, store listing and review handling for Android apps.'
	}
];

export const dashboardStats = {
	clientProjects: 20,
	technologies: totalTechCount,
	playApps: playApps.length,
	certifications: certifications.length,
	spokenLanguages: spokenLanguages.length
} as const;

export const navLinks = [
	{ href: '/#about', label: 'About' },
	{ href: '/#skills', label: 'Skills' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#apps', label: 'Apps' },
	{ href: '/#experience', label: 'Experience' },
	{ href: '/#contact', label: 'Contact' }
] as const;

export const pageLinks = [
	{ href: '/tools', label: 'Dev Tools' },
	{ href: '/lab', label: 'Code Lab' }
] as const;
