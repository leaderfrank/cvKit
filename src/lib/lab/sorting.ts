/**
 * Sorting algorithms as generator "step engines".
 *
 * Each algorithm yields a {@link SortStep} after every meaningful operation
 * (a comparison, a swap/write, or an index becoming final). Steps are pure
 * snapshots — the array is cloned per step, which is plenty cheap for the
 * visualizer's n <= 60.
 *
 * The UI consumes a generator one `.next()` at a time; when it reports
 * `done: true` the previous step already carried a fully-`done` array.
 */

export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge';

export interface SortStep {
	/** Snapshot of the working array at this step. */
	array: number[];
	/** Indices currently being compared. */
	comparing: number[];
	/** Indices just written to (a swap or an overwrite). */
	swapped: number[];
	/** Indices known to be in their final sorted position. */
	done: number[];
	/** Running count of element comparisons. */
	comparisons: number;
	/** Running count of writes into the array. */
	writes: number;
}

/** Build an immutable step snapshot from the live working state. */
function snapshot(
	arr: number[],
	comparing: number[],
	swapped: number[],
	done: ReadonlySet<number>,
	comparisons: number,
	writes: number
): SortStep {
	return {
		array: [...arr],
		comparing: [...comparing],
		swapped: [...swapped],
		done: [...done].sort((a, b) => a - b),
		comparisons,
		writes
	};
}

/** Terminal step: every index is in its final position. */
function finish(arr: number[], comparisons: number, writes: number): SortStep {
	return {
		array: [...arr],
		comparing: [],
		swapped: [],
		done: arr.map((_, i) => i),
		comparisons,
		writes
	};
}

function swap(arr: number[], i: number, j: number) {
	const t = arr[i];
	arr[i] = arr[j];
	arr[j] = t;
}

/** Random bar values in [5, 100] so `height = value%` maps 1:1 to the chart. */
export function randomArray(size: number, min = 5, max = 100): number[] {
	return Array.from({ length: size }, () => Math.floor(min + Math.random() * (max - min + 1)));
}

/** Bubble sort with early exit when a pass makes no swaps. O(n²) average. */
export function* bubbleSort(input: number[]): Generator<SortStep, void, unknown> {
	const arr = [...input];
	const n = arr.length;
	const done = new Set<number>();
	let comparisons = 0;
	let writes = 0;

	for (let i = 0; i < n - 1; i++) {
		let swappedThisPass = false;
		for (let j = 0; j < n - 1 - i; j++) {
			comparisons++;
			yield snapshot(arr, [j, j + 1], [], done, comparisons, writes);
			if (arr[j] > arr[j + 1]) {
				swap(arr, j, j + 1);
				writes += 2;
				swappedThisPass = true;
				yield snapshot(arr, [], [j, j + 1], done, comparisons, writes);
			}
		}
		done.add(n - 1 - i); // largest of the unsorted region bubbled to its slot
		yield snapshot(arr, [], [], done, comparisons, writes);
		if (!swappedThisPass) break; // already sorted — bail out early
	}

	yield finish(arr, comparisons, writes);
}

/** Selection sort: one swap per pass, min hunting. O(n²), but few writes. */
export function* selectionSort(input: number[]): Generator<SortStep, void, unknown> {
	const arr = [...input];
	const n = arr.length;
	const done = new Set<number>();
	let comparisons = 0;
	let writes = 0;

	for (let i = 0; i < n - 1; i++) {
		let min = i;
		for (let j = i + 1; j < n; j++) {
			comparisons++;
			yield snapshot(arr, [min, j], [], done, comparisons, writes);
			if (arr[j] < arr[min]) min = j;
		}
		if (min !== i) {
			swap(arr, i, min);
			writes += 2;
			yield snapshot(arr, [], [i, min], done, comparisons, writes);
		}
		done.add(i);
		yield snapshot(arr, [], [], done, comparisons, writes);
	}

	yield finish(arr, comparisons, writes);
}

/** Insertion sort: shift a growing sorted prefix right to seat each key. */
export function* insertionSort(input: number[]): Generator<SortStep, void, unknown> {
	const arr = [...input];
	const n = arr.length;
	const done = new Set<number>();
	let comparisons = 0;
	let writes = 0;

	for (let i = 1; i < n; i++) {
		const key = arr[i];
		let j = i - 1;
		while (j >= 0) {
			comparisons++;
			yield snapshot(arr, [j, j + 1], [], done, comparisons, writes);
			if (arr[j] <= key) break;
			arr[j + 1] = arr[j]; // shift right
			writes++;
			yield snapshot(arr, [], [j + 1, j], done, comparisons, writes);
			j--;
		}
		if (j + 1 !== i) {
			arr[j + 1] = key; // seat the key in its gap
			writes++;
			yield snapshot(arr, [], [j + 1], done, comparisons, writes);
		}
	}

	yield finish(arr, comparisons, writes);
}

/** Quicksort with Lomuto partitioning — last element is always the pivot. */
export function* quickSort(input: number[]): Generator<SortStep, void, unknown> {
	const arr = [...input];
	const done = new Set<number>();
	let comparisons = 0;
	let writes = 0;

	function* partition(lo: number, hi: number): Generator<SortStep, void, unknown> {
		if (lo > hi) return;
		if (lo === hi) {
			done.add(lo);
			yield snapshot(arr, [], [], done, comparisons, writes);
			return;
		}
		const pivotIdx = hi;
		let i = lo - 1; // fence between "< pivot" and ">= pivot" regions
		for (let j = lo; j < hi; j++) {
			comparisons++;
			yield snapshot(arr, [j, pivotIdx], [], done, comparisons, writes);
			if (arr[j] < arr[pivotIdx]) {
				i++;
				if (i !== j) {
					swap(arr, i, j);
					writes += 2;
					yield snapshot(arr, [], [i, j], done, comparisons, writes);
				}
			}
		}
		const p = i + 1; // pivot's final home
		if (p !== pivotIdx) {
			swap(arr, p, pivotIdx);
			writes += 2;
			yield snapshot(arr, [], [p, pivotIdx], done, comparisons, writes);
		}
		done.add(p);
		yield snapshot(arr, [], [], done, comparisons, writes);
		yield* partition(lo, p - 1);
		yield* partition(p + 1, hi);
	}

	yield* partition(0, arr.length - 1);
	yield finish(arr, comparisons, writes);
}

/** Merge sort: split by index, merge back with an auxiliary buffer. O(n log n) always. */
export function* mergeSort(input: number[]): Generator<SortStep, void, unknown> {
	const arr = [...input];
	const done = new Set<number>(); // positions are final only at the end
	let comparisons = 0;
	let writes = 0;

	function* sort(lo: number, hi: number): Generator<SortStep, void, unknown> {
		if (lo >= hi) return;
		const mid = lo + ((hi - lo) >> 1);
		yield* sort(lo, mid);
		yield* sort(mid + 1, hi);

		const left = arr.slice(lo, mid + 1);
		const right = arr.slice(mid + 1, hi + 1);
		let i = 0;
		let j = 0;
		let k = lo;

		while (i < left.length && j < right.length) {
			comparisons++;
			yield snapshot(arr, [lo + i, mid + 1 + j], [], done, comparisons, writes);
			if (left[i] <= right[j]) {
				arr[k] = left[i];
				i++;
			} else {
				arr[k] = right[j];
				j++;
			}
			writes++;
			yield snapshot(arr, [], [k], done, comparisons, writes);
			k++;
		}
		while (i < left.length) {
			arr[k] = left[i];
			writes++;
			i++;
			yield snapshot(arr, [], [k], done, comparisons, writes);
			k++;
		}
		while (j < right.length) {
			arr[k] = right[j];
			writes++;
			j++;
			yield snapshot(arr, [], [k], done, comparisons, writes);
			k++;
		}
	}

	yield* sort(0, arr.length - 1);
	yield finish(arr, comparisons, writes);
}

export const ALGORITHMS: Record<
	SortAlgorithm,
	{
		label: string;
		complexity: string;
		run: (input: number[]) => Generator<SortStep, void, unknown>;
	}
> = {
	bubble: { label: 'Bubble sort', complexity: 'O(n²) avg', run: bubbleSort },
	selection: { label: 'Selection sort', complexity: 'O(n²) avg', run: selectionSort },
	insertion: { label: 'Insertion sort', complexity: 'O(n²) avg', run: insertionSort },
	quick: { label: 'Quicksort (Lomuto)', complexity: 'O(n log n) avg', run: quickSort },
	merge: { label: 'Merge sort', complexity: 'O(n log n) worst', run: mergeSort }
};
