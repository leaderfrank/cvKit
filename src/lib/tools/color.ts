/**
 * Color math for the palette tool: hex ↔ RGB ↔ HSL conversions,
 * harmony palettes and WCAG contrast ratios.
 */

export interface Rgb {
	r: number;
	g: number;
	b: number;
}

export interface Hsl {
	h: number; // 0–360
	s: number; // 0–100
	l: number; // 0–100
}

export type Harmony = 'analogous' | 'complementary' | 'triadic' | 'split' | 'monochrome';

export const HARMONIES: { id: Harmony; label: string }[] = [
	{ id: 'analogous', label: 'Analogous' },
	{ id: 'complementary', label: 'Complementary' },
	{ id: 'triadic', label: 'Triadic' },
	{ id: 'split', label: 'Split-Complementary' },
	{ id: 'monochrome', label: 'Monochrome' }
];

export function hexToRgb(hex: string): Rgb | null {
	const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
	if (!m) return null;
	const v = parseInt(m[1], 16);
	return { r: (v >> 16) & 0xff, g: (v >> 8) & 0xff, b: v & 0xff };
}

export function rgbToHex({ r, g, b }: Rgb): string {
	const c = (n: number) =>
		Math.max(0, Math.min(255, Math.round(n)))
			.toString(16)
			.padStart(2, '0');
	return `#${c(r)}${c(g)}${c(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return { h: 0, s: 0, l: l * 100 };
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h: number;
	switch (max) {
		case rn:
			h = (gn - bn) / d + (gn < bn ? 6 : 0);
			break;
		case gn:
			h = (bn - rn) / d + 2;
			break;
		default:
			h = (rn - gn) / d + 4;
	}
	return { h: h * 60, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
	const hn = (((h % 360) + 360) % 360) / 360;
	const sn = Math.max(0, Math.min(100, s)) / 100;
	const ln = Math.max(0, Math.min(100, l)) / 100;
	if (sn === 0) {
		const v = Math.round(ln * 255);
		return { r: v, g: v, b: v };
	}
	const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
	const p = 2 * ln - q;
	const hue2rgb = (t0: number): number => {
		let t = t0;
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	return {
		r: Math.round(hue2rgb(hn + 1 / 3) * 255),
		g: Math.round(hue2rgb(hn) * 255),
		b: Math.round(hue2rgb(hn - 1 / 3) * 255)
	};
}

export function hexToHsl(hex: string): Hsl | null {
	const rgb = hexToRgb(hex);
	return rgb ? rgbToHsl(rgb) : null;
}

export function hslToHex(hsl: Hsl): string {
	return rgbToHex(hslToRgb(hsl));
}

function clampL(l: number): number {
	return Math.max(8, Math.min(92, l));
}

/** Build a five-swatch harmony palette from a base hex color. */
export function buildPalette(baseHex: string, harmony: Harmony): string[] {
	const base = hexToHsl(baseHex);
	if (!base) return [baseHex];
	const { h, s, l } = base;
	const hex = (hh: number, ss: number, ll: number) =>
		hslToHex({ h: (hh + 360) % 360, s: Math.max(0, Math.min(100, ss)), l: clampL(ll) });

	switch (harmony) {
		case 'analogous':
			return [
				hex(h - 30, s, l),
				hex(h - 15, s, l),
				hex(h, s, l),
				hex(h + 15, s, l),
				hex(h + 30, s, l)
			];
		case 'complementary':
			return [
				hex(h, s, clampL(l - 18)),
				hex(h, s, l),
				hex(h, s * 0.85, clampL(l + 22)),
				hex(h + 180, s, l),
				hex(h + 180, s * 0.85, clampL(l + 22))
			];
		case 'triadic':
			return [
				hex(h, s, l),
				hex(h + 120, s, l),
				hex(h + 240, s, l),
				hex(h, s * 0.8, clampL(l + 20)),
				hex(h + 240, s, clampL(l - 18))
			];
		case 'split':
			return [
				hex(h, s, l),
				hex(h + 150, s, l),
				hex(h + 210, s, l),
				hex(h + 150, s * 0.8, clampL(l + 20)),
				hex(h + 210, s * 0.8, clampL(l - 18))
			];
		case 'monochrome':
			return [
				hex(h, s, l - 28),
				hex(h, s, l - 14),
				hex(h, s, l),
				hex(h, s * 0.92, l + 14),
				hex(h, s * 0.82, l + 28)
			];
	}
}

/** WCAG relative luminance of a hex color (0–1). */
export function relativeLuminance(hex: string): number {
	const rgb = hexToRgb(hex);
	if (!rgb) return 0;
	const f = (c: number) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	};
	return 0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b);
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(hexA: string, hexB: string): number {
	const la = relativeLuminance(hexA);
	const lb = relativeLuminance(hexB);
	const lighter = Math.max(la, lb);
	const darker = Math.min(la, lb);
	return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG conformance grade for normal text. */
export function contrastGrade(ratio: number): 'AAA' | 'AA' | 'Fail' {
	if (ratio >= 7) return 'AAA';
	if (ratio >= 4.5) return 'AA';
	return 'Fail';
}

export function randomHex(): string {
	const bytes = new Uint8Array(3);
	crypto.getRandomValues(bytes);
	return rgbToHex({ r: bytes[0], g: bytes[1], b: bytes[2] });
}
