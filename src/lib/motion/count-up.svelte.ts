/**
 * Animated count-up that starts when the host element scrolls into view.
 * Returns a reactive `.current` value.
 */
export function countUp(target: () => number, duration = 1400) {
	let current = $state(0);
	let started = false;

	function start(node: HTMLElement) {
		if (started) return;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				started = true;
				observer.disconnect();
				const end = target();
				if (reduced) {
					current = end;
					return;
				}
				const t0 = performance.now();
				const tick = (t: number) => {
					const progress = Math.min((t - t0) / duration, 1);
					// easeOutExpo
					const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
					current = Math.round(end * eased);
					if (progress < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			},
			{ threshold: 0.4 }
		);
		observer.observe(node);
	}

	return {
		get current() {
			return current;
		},
		start
	};
}
