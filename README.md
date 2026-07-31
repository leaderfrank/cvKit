# Mohammed Ghaleb — Portfolio & Engineering Showcase

Live at [cvkit.vercel.app](https://cvkit.vercel.app/).

A SvelteKit single-page app that is less an online résumé and more a working product:
live API integrations, a developer-tools suite, and interactive computer-science demos —
all statically exported and deployed on Vercel.

## Stack

- **SvelteKit 2 + Svelte 5** (runes), TypeScript strict
- **Tailwind CSS v4** with a semantic token theme (dark default, light supported via `mode-watcher`)
- **bits-ui / shadcn-svelte** primitives, **lucide** icons, **d3-scale/shape** for the skills radar
- `@sveltejs/adapter-static` SPA (`ssr = false`, prerendered shell) + service worker

## Structure

```
src/
├─ routes/
│  ├─ +page.svelte          Home: hero, dashboard, about, skills radar, projects, timeline, live APIs, contact
│  ├─ tools/+page.svelte    16 client-side developer tools (JSON, JWT, hashes, regex, diff, CSS…)
│  └─ lab/+page.svelte      Code Lab: sorting visualizer, debounce/throttle, event loop, API playground
├─ lib/
│  ├─ api/client.ts         Shared API layer: TTL cache (memory + localStorage), retry/backoff, abort timeouts
│  ├─ apis/*.ts             Typed wrappers: GitHub, Hacker News, dev.to, Open-Meteo, Frankfurter v2, JokeAPI
│  ├─ data/portfolio.ts     Single source of truth for all content
│  ├─ tools/*.ts            Pure logic for tools (MD5, LCS diff, case, color…), no deps
│  ├─ lab/*.ts              Sorting generators, debounce/throttle, event-loop scripts
│  ├─ actions/reveal.ts     Scroll-reveal action (IntersectionObserver, reduced-motion aware)
│  └─ components/
│     ├─ layout/            Navbar, Footer
│     ├─ sections/          Home page sections
│     ├─ shared/            Section, ApiCard, StatCard, CopyButton, ThemeToggle, RoleRotator
│     ├─ apis/              Live API widget cards
│     ├─ tools/ lab/ ui/    Tool cards, lab demos, shadcn-svelte primitives
```

## Scripts

```sh
npm run dev       # develop
npm run check     # svelte-kit sync + svelte-check (0 errors policy)
npm run build     # static build → /build
npm run preview   # preview the build
```

## Notes

- All content edits go through `src/lib/data/portfolio.ts` (including testimonial placeholders).
- External APIs are consumed client-side via `src/lib/api/client.ts` — graceful skeletons,
  retries, caching and error states are demonstrated in the UI itself.
