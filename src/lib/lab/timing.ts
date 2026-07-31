/**
 * Classic event-taming helpers: trailing-edge debounce and leading-edge
 * throttle. Pure wrappers around `setTimeout` — no framework dependencies,
 * so they can be unit-tested headlessly.
 */

export interface Cancelable {
	/** Abort any pending invocation and reset the internal timer. */
	cancel: () => void;
}

/**
 * Trailing-edge debounce: the wrapped function fires only once `waitMs`
 * have elapsed with NO new calls. Every new call resets the countdown and
 * discards the previous timer, so a burst of events collapses into a
 * single trailing call.
 *
 * Use it when only the FINAL state of a stream matters — auto-save after
 * the user stops typing, re-running a validation, resize handlers.
 *
 * ```ts
 * const onQuery = debounce((q: string) => search(q), 300);
 * onQuery('a'); onQuery('ab'); onQuery('abc'); // → search('abc') fires once
 * onQuery.cancel(); // pending call never fires
 * ```
 */
export function debounce<A extends unknown[]>(
	fn: (...args: A) => void,
	waitMs: number
): ((...args: A) => void) & Cancelable {
	let timer: ReturnType<typeof setTimeout> | null = null;

	const wrapped = (...args: A) => {
		if (timer !== null) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			fn(...args);
		}, waitMs);
	};

	wrapped.cancel = () => {
		if (timer !== null) {
			clearTimeout(timer);
			timer = null;
		}
	};

	return wrapped;
}

/**
 * Leading-edge throttle: the wrapped function fires IMMEDIATELY on the
 * first call, then suppresses further calls for `waitMs`. Once the window
 * closes, the next call fires right away — calls during the window are
 * dropped rather than queued.
 *
 * Use it when a stream needs a steady maximum cadence while events keep
 * flowing — scroll or mousemove handlers, scroll-spy highlighting,
 * rate-limiting analytics pings.
 *
 * ```ts
 * const onScroll = throttleLeading(updateSpy, 250);
 * // 10 scroll events inside 250 ms → updateSpy runs once, instantly.
 * ```
 */
export function throttleLeading<A extends unknown[]>(
	fn: (...args: A) => void,
	waitMs: number
): ((...args: A) => void) & Cancelable {
	let throttleId: ReturnType<typeof setTimeout> | null = null;

	const wrapped = (...args: A) => {
		if (throttleId !== null) return; // inside the cooldown window — drop
		fn(...args); // leading edge: fire now
		throttleId = setTimeout(() => {
			throttleId = null;
		}, waitMs);
	};

	wrapped.cancel = () => {
		if (throttleId !== null) {
			clearTimeout(throttleId);
			throttleId = null;
		}
	};

	return wrapped;
}
