import type { Action } from 'svelte/action';

/**
 * Scroll-reveal action: adds CSS classes that transition the element in
 * when it enters the viewport. Respects prefers-reduced-motion.
 *
 * Usage: <div use:reveal>...</div> or with stagger: <div use:reveal={{ delay: 120 }}>
 */
export const reveal: Action<HTMLElement, { delay?: number; once?: boolean } | undefined> = (
	node,
	params
) => {
	node.classList.add('reveal');
	const apply = (p?: { delay?: number; once?: boolean }) => {
		node.style.setProperty('--reveal-delay', `${p?.delay ?? 0}ms`);
	};
	apply(params);

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduced) {
		node.classList.add('revealed');
		return { update: apply, destroy: () => node.classList.remove('reveal', 'revealed') };
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('revealed');
					if (params?.once !== false) observer.unobserve(node);
				} else if (params?.once === false) {
					node.classList.remove('revealed');
				}
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);
	observer.observe(node);

	return {
		update: apply,
		destroy: () => {
			observer.disconnect();
			node.classList.remove('reveal', 'revealed');
		}
	};
};
