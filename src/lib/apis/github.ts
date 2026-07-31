/**
 * GitHub public REST API for `leaderfrank`.
 * Three separately-cached calls (user / repos / events) combined into one
 * shaped overview. Aggregate meta is synthesized from the individual calls.
 */

import { apiFetch, type ApiMeta, type ApiResult } from '$lib/api/client';

export interface GitHubUser {
	login: string;
	name: string | null;
	bio: string | null;
	avatar_url: string;
	html_url: string;
	followers: number;
	following: number;
	public_repos: number;
}

export interface GitHubRepo {
	name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	html_url: string;
	fork: boolean;
}

/** Events are polymorphic: the payload shape depends on `type`. Everything optional. */
export interface GitHubEvent {
	id: string;
	type: string;
	created_at: string | null;
	repo?: { name?: string };
	payload?: {
		action?: string;
		ref_type?: string;
		size?: number;
		commits?: unknown[];
		ref?: string | null;
	};
}

export interface GitHubRepoSummary {
	name: string;
	description: string;
	language: string;
	stars: number;
	url: string;
}

export interface GitHubActivityItem {
	type: string;
	repo: string;
	label: string;
	createdAt: string;
}

export interface GitHubOverview {
	login: string;
	name: string;
	bio: string;
	avatarUrl: string;
	profileUrl: string;
	followers: number;
	following: number;
	publicRepos: number;
	totalStars: number;
	topRepos: GitHubRepoSummary[];
	recentActivity: GitHubActivityItem[];
}

const BASE = 'https://api.github.com';
const USER = 'leaderfrank';
const TTL = 10 * 60 * 1000; // 10 min

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** Human-readable one-liner for a GitHub event, defensive against partial payloads. */
function humanizeEvent(event: GitHubEvent): string {
	switch (event.type) {
		case 'PushEvent': {
			const commits = event.payload?.commits;
			const n = Array.isArray(commits) ? commits.length : (event.payload?.size ?? 0);
			if (n === 1) return 'Pushed 1 commit';
			return n > 1 ? `Pushed ${n} commits` : 'Pushed commits';
		}
		case 'CreateEvent':
			return event.payload?.ref_type === 'repository'
				? 'Created repository'
				: `Created ${event.payload?.ref_type ?? 'branch'}`;
		case 'IssuesEvent':
			return `${capitalize(event.payload?.action ?? 'updated')} issue`;
		case 'IssueCommentEvent':
			return 'Commented on issue';
		case 'PullRequestEvent':
			return `${capitalize(event.payload?.action ?? 'updated')} pull request`;
		case 'PullRequestReviewEvent':
			return 'Reviewed pull request';
		case 'PullRequestReviewCommentEvent':
			return 'Reviewed pull request';
		case 'WatchEvent':
			return 'Starred repository';
		case 'ForkEvent':
			return 'Forked repository';
		case 'DeleteEvent':
			return `Deleted ${event.payload?.ref_type ?? 'branch'}`;
		case 'ReleaseEvent':
			return 'Published release';
		case 'PublicEvent':
			return 'Open sourced a repo';
		default:
			return (event.type ?? 'Activity').replace(/Event$/, '');
	}
}

/** Strip the owner's prefix (`leaderfrank/`) from `owner/repo` for compact display. */
function shortRepoName(fullName: string | undefined): string {
	if (!fullName) return 'unknown';
	return fullName.startsWith(`${USER}/`) ? fullName.slice(USER.length + 1) : fullName;
}

/**
 * Merge per-request metadata: slowest call wins for latency, 'network' if any
 * call hit the network ('stale-fallback' is surfaced rather than hidden),
 * latest updatedAt, summed attempts.
 */
export function mergeGitHubMetas(metas: ApiMeta[]): ApiMeta {
	const slowest = metas.reduce((a, b) => (b.durationMs > a.durationMs ? b : a));
	const anyNetwork = metas.some((m) => m.cacheState === 'network');
	const anyStale = metas.some((m) => m.cacheState === 'stale-fallback');
	return {
		...slowest,
		fromCache: !anyNetwork,
		cacheState: anyNetwork ? 'network' : anyStale ? 'stale-fallback' : 'fresh',
		updatedAt: Math.max(...metas.map((m) => m.updatedAt)),
		attempts: metas.reduce((sum, m) => sum + m.attempts, 0)
	};
}

export async function getGitHubOverview(force = false): Promise<ApiResult<GitHubOverview>> {
	const [userRes, reposRes, eventsRes] = await Promise.all([
		apiFetch<GitHubUser>(`${BASE}/users/${USER}`, { ttl: TTL, force, cacheKey: 'github:user' }),
		apiFetch<GitHubRepo[]>(`${BASE}/users/${USER}/repos?per_page=100&sort=updated`, {
			ttl: TTL,
			force,
			cacheKey: 'github:repos'
		}),
		apiFetch<GitHubEvent[]>(`${BASE}/users/${USER}/events/public?per_page=30`, {
			ttl: TTL,
			force,
			cacheKey: 'github:events'
		})
	]);

	if (!userRes.ok) return userRes;
	if (!reposRes.ok) return reposRes;
	if (!eventsRes.ok) return eventsRes;

	const user = userRes.data;
	const repos = Array.isArray(reposRes.data) ? reposRes.data : [];
	const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];

	const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

	const topRepos: GitHubRepoSummary[] = [...repos]
		.sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
		.slice(0, 3)
		.map((r) => ({
			name: r.name ?? 'unnamed',
			description: r.description ?? '',
			language: r.language ?? '',
			stars: r.stargazers_count ?? 0,
			url: r.html_url ?? `${BASE.replace('api.', '')}/${USER}/${r.name}`
		}));

	const recentActivity: GitHubActivityItem[] = events
		.filter((e) => e && typeof e.type === 'string')
		.slice(0, 4)
		.map((e) => ({
			type: e.type,
			repo: shortRepoName(e.repo?.name),
			label: humanizeEvent(e),
			createdAt: e.created_at ?? ''
		}));

	const data: GitHubOverview = {
		login: user.login ?? USER,
		name: user.name ?? user.login ?? USER,
		bio: user.bio ?? '',
		avatarUrl: user.avatar_url ?? '',
		profileUrl: user.html_url ?? `https://github.com/${USER}`,
		followers: user.followers ?? 0,
		following: user.following ?? 0,
		publicRepos: user.public_repos ?? repos.length,
		totalStars,
		topRepos,
		recentActivity
	};

	return { ok: true, data, meta: mergeGitHubMetas([userRes.meta, reposRes.meta, eventsRes.meta]) };
}
