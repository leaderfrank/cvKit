/**
 * Unified line diff via longest-common-subsequence dynamic programming.
 */

export type DiffLine = { type: 'same' | 'add' | 'del'; text: string };

/** Hard cap per side so the O(m·n) table stays cheap in the browser. */
export const DIFF_LINE_LIMIT = 400;

export interface DiffResult {
	lines: DiffLine[];
	added: number;
	removed: number;
	truncated: boolean;
}

export function diffLines(a: string, b: string): DiffResult {
	let aLines = a.replace(/\r\n?/g, '\n').split('\n');
	let bLines = b.replace(/\r\n?/g, '\n').split('\n');

	// A trailing newline should not produce a phantom empty final row
	if (aLines.length > 1 && aLines[aLines.length - 1] === '') aLines = aLines.slice(0, -1);
	if (bLines.length > 1 && bLines[bLines.length - 1] === '') bLines = bLines.slice(0, -1);

	let truncated = false;
	if (aLines.length > DIFF_LINE_LIMIT) {
		aLines = aLines.slice(0, DIFF_LINE_LIMIT);
		truncated = true;
	}
	if (bLines.length > DIFF_LINE_LIMIT) {
		bLines = bLines.slice(0, DIFF_LINE_LIMIT);
		truncated = true;
	}

	const m = aLines.length;
	const n = bLines.length;

	// dp[i][j] = LCS length of aLines[i..] and bLines[j..]
	const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
	for (let i = m - 1; i >= 0; i--) {
		const row = dp[i];
		const below = dp[i + 1];
		const aLine = aLines[i];
		for (let j = n - 1; j >= 0; j--) {
			row[j] = aLine === bLines[j] ? below[j + 1] + 1 : Math.max(below[j], row[j + 1]);
		}
	}

	const lines: DiffLine[] = [];
	let added = 0;
	let removed = 0;
	let i = 0;
	let j = 0;
	while (i < m && j < n) {
		if (aLines[i] === bLines[j]) {
			lines.push({ type: 'same', text: aLines[i] });
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			lines.push({ type: 'del', text: aLines[i] });
			removed++;
			i++;
		} else {
			lines.push({ type: 'add', text: bLines[j] });
			added++;
			j++;
		}
	}
	while (i < m) {
		lines.push({ type: 'del', text: aLines[i] });
		removed++;
		i++;
	}
	while (j < n) {
		lines.push({ type: 'add', text: bLines[j] });
		added++;
		j++;
	}

	return { lines, added, removed, truncated };
}
