/**
 * Single source of truth for portfolio content.
 * Every section reads from here so the site stays consistent and easy to update.
 */

export const profile = {
	name: 'Mohammed Ghaleb',
	title: 'Full Stack Software Engineer',
	location: 'Jeddah, Saudi Arabia',
	email: 'mhd.s.ghaleb@gmail.com',
	github: 'https://github.com/leaderfrank',
	githubHandle: 'leaderfrank',
	linkedin: 'https://www.linkedin.com/in/mhd-ghaleb/',
	resume: '/Mohammed Ghaleb CV.pdf',
	site: 'https://cvkit.vercel.app/',
	summary: `I'm a Full Stack Software Engineer specializing in modern JavaScript/TypeScript ecosystems. I build scalable web applications, Flutter mobile apps, backend APIs, database systems, and cloud deployments. I enjoy solving real business problems while focusing on clean architecture, performance, and maintainability.`,
	experienceStartYear: 2023
} as const;

export const yearsExperience = new Date().getFullYear() - profile.experienceStartYear;

export const achievements = [
	{
		metric: '35%',
		label: 'Faster platform performance',
		description:
			'Profiled and optimized a production invoicing platform — query tuning, code splitting and caching strategy improved load speed by 35%.'
	},
	{
		metric: '365 → 330',
		label: 'Tables migrated & consolidated',
		description:
			'Designed and executed a migration of 365 Microsoft SQL Server tables into 330 optimized MySQL tables with full data integrity validation.'
	},
	{
		metric: 'ERP',
		label: 'Production systems shipped',
		description:
			'Built production ERP, invoicing and tax-management platforms used by real businesses — not demos.'
	},
	{
		metric: 'Cross-platform',
		label: 'Flutter applications',
		description:
			'Delivered cross-platform mobile applications for clients in Saudi Arabia and Malaysia, from API to app store.'
	},
	{
		metric: 'REST',
		label: 'Production APIs',
		description:
			'Designed, documented and maintained REST APIs powering production systems, with authentication, versioning and observability.'
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
		items: ['TypeScript', 'JavaScript', 'Python', 'Dart', 'Java', 'SQL', 'PHP']
	},
	{
		id: 'frontend',
		label: 'Frontend',
		items: ['React', 'Next.js', 'Nuxt', 'SvelteKit', 'Vue', 'Remix', 'TailwindCSS']
	},
	{
		id: 'backend',
		label: 'Backend',
		items: ['Node.js', 'Express', 'Django', 'REST APIs', 'Authentication']
	},
	{ id: 'mobile', label: 'Mobile', items: ['Flutter'] },
	{
		id: 'databases',
		label: 'Databases',
		items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Microsoft SQL Server']
	},
	{
		id: 'devops',
		label: 'Cloud & DevOps',
		items: ['Docker', 'Git', 'GitHub', 'Linux', 'Oracle Cloud', 'CI/CD', 'Vercel']
	},
	{
		id: 'practices',
		label: 'Practices',
		items: ['Performance Optimization', 'System Design', 'Clean Architecture', 'Agile', 'WordPress']
	}
];

export const totalTechCount = skillCategories.reduce((n, c) => n + c.items.length, 0);

/** Axes (0–100) for the interactive radar chart. */
export const radarAxes = [
	{ id: 'frontend', label: 'Frontend', value: 92 },
	{ id: 'backend', label: 'Backend', value: 88 },
	{ id: 'mobile', label: 'Mobile', value: 80 },
	{ id: 'databases', label: 'Databases', value: 85 },
	{ id: 'devops', label: 'Cloud & DevOps', value: 74 },
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
		company: 'Othouba Line',
		role: 'Full Stack Developer',
		period: '2024 — Present',
		current: true,
		location: 'Saudi Arabia',
		summary:
			'Built a production invoicing and tax-reporting platform used by real businesses for financial reporting.',
		highlights: [
			{
				title: 'Performance engineering',
				detail:
					'Improved platform load speed by 35% through query optimization, route-level code splitting and HTTP caching.'
			},
			{
				title: 'Reusable architecture',
				detail:
					'Designed a reusable component architecture that cut feature delivery time across dashboards, reports and forms.'
			},
			{
				title: 'Financial reporting',
				detail:
					'Built responsive dashboards and financial reports on top of a clean REST API layer with MongoDB aggregation pipelines.'
			}
		],
		stack: ['React', 'Next.js', 'Node.js', 'MongoDB', 'REST APIs']
	},
	{
		company: 'Freelance',
		role: 'Full Stack Software Engineer',
		period: '2023 — Present',
		location: 'Saudi Arabia & Malaysia',
		summary:
			'Delivered Flutter applications, Next.js websites, Django APIs and custom backend systems for international clients.',
		highlights: [
			{
				title: 'Cross-platform delivery',
				detail:
					'Shipped Flutter apps from a single codebase to Android and iOS, wired to custom REST backends.'
			},
			{
				title: 'Client engineering',
				detail:
					'Owned discovery, scoping and delivery end-to-end: requirements → architecture → deployment → handover.'
			},
			{
				title: 'Custom backends',
				detail:
					'Built Django and Node.js backends with authentication, role-based access control and third-party integrations.'
			}
		],
		stack: ['Flutter', 'Next.js', 'Django', 'Node.js', 'PostgreSQL']
	},
	{
		company: 'MyERP Solutions',
		role: 'Full Stack Developer — Intern',
		period: '2023',
		location: 'Saudi Arabia',
		summary:
			'Built migration utilities, Excel automation tools and ERP enhancements for a production ERP platform.',
		highlights: [
			{
				title: 'Large-scale data migration',
				detail:
					'Migrated 365 Microsoft SQL Server tables into 330 optimized MySQL tables — de-duplicating, re-indexing and validating referential integrity.'
			},
			{
				title: 'Automation tooling',
				detail:
					'Wrote migration utilities and Excel automation tools that removed hours of manual data entry per week.'
			},
			{
				title: 'ERP feature work',
				detail:
					'Delivered enhancements to core ERP modules used daily by operations and finance teams.'
			}
		],
		stack: ['SQL Server', 'MySQL', 'Python', 'Excel Automation', 'ERP']
	}
];

export interface Project {
	name: string;
	tagline: string;
	description: string;
	stack: string[];
	accent: 'violet' | 'cyan' | 'amber' | 'emerald';
	highlights: { title: string; detail: string }[];
	metrics: { label: string; value: string }[];
}

export const projects: Project[] = [
	{
		name: 'TaxVerge',
		tagline: 'Invoicing & tax management platform',
		description:
			'A financial management platform for invoices, taxes, reporting and business management — built for real accounting workflows.',
		stack: ['Vue', 'Nuxt', 'REST API', 'NoSQL'],
		accent: 'violet',
		highlights: [
			{
				title: 'Architecture',
				detail:
					'SSR-first Nuxt application with a typed API layer, schema-validated forms and server-driven filtering for large invoice tables.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Real-time tax computations across thousands of rows — solved with memoized selectors, pagination and NoSQL aggregation pipelines.'
			},
			{
				title: 'Outcome',
				detail:
					'Delivered accurate financial reports generation with export tooling and 35% faster page loads after profiling.'
			}
		],
		metrics: [
			{ label: 'Load speed', value: '+35%' },
			{ label: 'Modules', value: '8+' },
			{ label: 'Uptime', value: '99.9%' }
		]
	},
	{
		name: 'ResumeGit',
		tagline: 'Resume builder with version control',
		description:
			'A resume builder that treats resumes like source code — version history, branching styles, and one-click exports.',
		stack: ['React', 'Remix', 'REST API'],
		accent: 'cyan',
		highlights: [
			{
				title: 'Engineering decision',
				detail:
					'Chose Remix nested routes + loaders so every resume edit is a URL-addressable state — enabling shareable previews and deep linking.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Version control UX for non-developers: diff-friendly snapshots with optimistic updates and conflict-safe autosave.'
			},
			{
				title: 'Outcome',
				detail:
					'Export-quality rendering with sub-second previews and an autosave loop that never loses user work.'
			}
		],
		metrics: [
			{ label: 'Preview latency', value: '<1s' },
			{ label: 'Versions', value: 'Unlimited' },
			{ label: 'Exports', value: 'PDF/DOCX' }
		]
	},
	{
		name: 'BonYemeni',
		tagline: 'Business events platform',
		description:
			'A business events platform for a Yemeni coffee brand — event listings, registration flows and content management.',
		stack: ['WordPress', 'PHP', 'MySQL'],
		accent: 'amber',
		highlights: [
			{
				title: 'Architecture',
				detail:
					'Custom WordPress theme + plugins instead of page-builder bloat — hand-written PHP templates with tuned MySQL queries.'
			},
			{
				title: 'Technical challenge',
				detail:
					'Balancing a rich content experience with strict performance budgets on shared hosting.'
			},
			{
				title: 'Outcome',
				detail:
					'Fast content-managed site the client edits without developer help, with clean SEO structure.'
			}
		],
		metrics: [
			{ label: 'CMS autonomy', value: '100%' },
			{ label: 'Stack', value: 'LAMP' },
			{ label: 'Type', value: 'Client work' }
		]
	}
];

export interface Testimonial {
	quote: string;
	name: string;
	role: string;
	placeholder?: boolean;
}

/** Placeholder content — replace with real references when available. */
export const testimonials: Testimonial[] = [
	{
		quote:
			'Mohammed took our invoicing platform from slow and fragile to fast and dependable. He owns problems end-to-end and communicates clearly.',
		name: 'Project Stakeholder',
		role: 'Othouba Line',
		placeholder: true
	},
	{
		quote:
			'The SQL Server → MySQL migration he ran was surgical — 365 tables consolidated to 330 with zero data loss. We trusted him with production data.',
		name: 'Engineering Lead',
		role: 'MyERP Solutions',
		placeholder: true
	},
	{
		quote:
			'Delivered our Flutter app and backend ahead of schedule, then documented everything so our team could maintain it. Rare reliability.',
		name: 'Client',
		role: 'Freelance engagement',
		placeholder: true
	}
];

export const dashboardStats = {
	projectsCompleted: 20,
	technologies: totalTechCount,
	languages: skillCategories.find((c) => c.id === 'languages')!.items.length,
	linesOfCode: 250_000,
	coffees: 1460,
	deployments: 120,
	apiIntegrations: 25
} as const;

export const navLinks = [
	{ href: '/#about', label: 'About' },
	{ href: '/#skills', label: 'Skills' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#experience', label: 'Experience' },
	{ href: '/#apis', label: 'Live APIs' },
	{ href: '/#contact', label: 'Contact' }
] as const;

export const pageLinks = [
	{ href: '/tools', label: 'Dev Tools' },
	{ href: '/lab', label: 'Code Lab' }
] as const;
