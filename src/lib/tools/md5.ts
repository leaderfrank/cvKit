/**
 * MD5 message digest (RFC 1321), implemented from scratch.
 *
 * NOTE: MD5 is cryptographically broken and must never be used for
 * security purposes. It remains handy for checksums, etags and
 * content-integrity comparisons of legacy systems.
 */

const HEX = '0123456789abcdef';

/** Rotate a 32-bit integer left by `c` bits. */
function rol(n: number, c: number): number {
	return (n << c) | (n >>> (32 - c));
}

/** 32-bit-safe addition (wraps without losing low bits). */
function add32(a: number, b: number): number {
	const lsw = (a & 0xffff) + (b & 0xffff);
	const msw = (a >>> 16) + (b >>> 16) + (lsw >>> 16);
	return ((msw & 0xffff) << 16) | (lsw & 0xffff);
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
	return add32(rol(add32(add32(a, q), add32(x, t)), s), b);
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
	return cmn((b & c) | (~b & d), a, b, x, s, t);
}

function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
	return cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
	return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
	return cmn(c ^ (b | ~d), a, b, x, s, t);
}

/** One full MD5 compression round over a sixteen-word block. */
function md5cycle(state: number[], x: number[]): void {
	let a = state[0];
	let b = state[1];
	let c = state[2];
	let d = state[3];

	/* Round 1 — F function */
	a = ff(a, b, c, d, x[0], 7, -680876936);
	d = ff(d, a, b, c, x[1], 12, -389564586);
	c = ff(c, d, a, b, x[2], 17, 606105819);
	b = ff(b, c, d, a, x[3], 22, -1044525330);
	a = ff(a, b, c, d, x[4], 7, -176418897);
	d = ff(d, a, b, c, x[5], 12, 1200080426);
	c = ff(c, d, a, b, x[6], 17, -1473231341);
	b = ff(b, c, d, a, x[7], 22, -45705983);
	a = ff(a, b, c, d, x[8], 7, 1770035416);
	d = ff(d, a, b, c, x[9], 12, -1958414417);
	c = ff(c, d, a, b, x[10], 17, -42063);
	b = ff(b, c, d, a, x[11], 22, -1990404162);
	a = ff(a, b, c, d, x[12], 7, 1804603682);
	d = ff(d, a, b, c, x[13], 12, -40341101);
	c = ff(c, d, a, b, x[14], 17, -1502002290);
	b = ff(b, c, d, a, x[15], 22, 1236535329);

	/* Round 2 — G function */
	a = gg(a, b, c, d, x[1], 5, -165796510);
	d = gg(d, a, b, c, x[6], 9, -1069501632);
	c = gg(c, d, a, b, x[11], 14, 643717713);
	b = gg(b, c, d, a, x[0], 20, -373897302);
	a = gg(a, b, c, d, x[5], 5, -701558691);
	d = gg(d, a, b, c, x[10], 9, 38016083);
	c = gg(c, d, a, b, x[15], 14, -660478335);
	b = gg(b, c, d, a, x[4], 20, -405537848);
	a = gg(a, b, c, d, x[9], 5, 568446438);
	d = gg(d, a, b, c, x[14], 9, -1019803690);
	c = gg(c, d, a, b, x[3], 14, -187363961);
	b = gg(b, c, d, a, x[8], 20, 1163531501);
	a = gg(a, b, c, d, x[13], 5, -1444681467);
	d = gg(d, a, b, c, x[2], 9, -51403784);
	c = gg(c, d, a, b, x[7], 14, 1735328473);
	b = gg(b, c, d, a, x[12], 20, -1926607734);

	/* Round 3 — H function */
	a = hh(a, b, c, d, x[5], 4, -378558);
	d = hh(d, a, b, c, x[8], 11, -2022574463);
	c = hh(c, d, a, b, x[11], 16, 1839030562);
	b = hh(b, c, d, a, x[14], 23, -35309556);
	a = hh(a, b, c, d, x[1], 4, -1530992060);
	d = hh(d, a, b, c, x[4], 11, 1272893353);
	c = hh(c, d, a, b, x[7], 16, -155497632);
	b = hh(b, c, d, a, x[10], 23, -1094730640);
	a = hh(a, b, c, d, x[13], 4, 681279174);
	d = hh(d, a, b, c, x[0], 11, -358537222);
	c = hh(c, d, a, b, x[3], 16, -722521979);
	b = hh(b, c, d, a, x[6], 23, 76029189);
	a = hh(a, b, c, d, x[9], 4, -640364487);
	d = hh(d, a, b, c, x[12], 11, -421815835);
	c = hh(c, d, a, b, x[15], 16, 530742520);
	b = hh(b, c, d, a, x[2], 23, -995338651);

	/* Round 4 — I function */
	a = ii(a, b, c, d, x[0], 6, -198630844);
	d = ii(d, a, b, c, x[7], 10, 1126891415);
	c = ii(c, d, a, b, x[14], 15, -1416354905);
	b = ii(b, c, d, a, x[5], 21, -57434055);
	a = ii(a, b, c, d, x[12], 6, 1700485571);
	d = ii(d, a, b, c, x[3], 10, -1894986606);
	c = ii(c, d, a, b, x[10], 15, -1051523);
	b = ii(b, c, d, a, x[1], 21, -2054922799);
	a = ii(a, b, c, d, x[8], 6, 1873313359);
	d = ii(d, a, b, c, x[15], 10, -30611744);
	c = ii(c, d, a, b, x[6], 15, -1560198380);
	b = ii(b, c, d, a, x[13], 21, 1309151649);
	a = ii(a, b, c, d, x[4], 6, -145523070);
	d = ii(d, a, b, c, x[11], 10, -1120210379);
	c = ii(c, d, a, b, x[2], 15, 718787259);
	b = ii(b, c, d, a, x[9], 21, -343485551);

	state[0] = add32(a, state[0]);
	state[1] = add32(b, state[1]);
	state[2] = add32(c, state[2]);
	state[3] = add32(d, state[3]);
}

/** Pack a 64-byte chunk of the byte string into sixteen little-endian words. */
function md5blk(s: string): number[] {
	const blks: number[] = [];
	for (let i = 0; i < 64; i += 4) {
		blks[i >> 2] =
			s.charCodeAt(i) +
			(s.charCodeAt(i + 1) << 8) +
			(s.charCodeAt(i + 2) << 16) +
			(s.charCodeAt(i + 3) << 24);
	}
	return blks;
}

/** Hex-encode one word, least-significant byte first. */
function rhex(n: number): string {
	let s = '';
	for (let j = 0; j < 4; j++) {
		s += HEX[(n >> (j * 8 + 4)) & 0x0f] + HEX[(n >> (j * 8)) & 0x0f];
	}
	return s;
}

/**
 * Compute the MD5 hex digest of a string.
 * The input is UTF-8 encoded first, so arbitrary unicode is safe.
 */
export function md5(input: string): string {
	// UTF-8 byte string (each charCode < 256 afterwards)
	let s = unescape(encodeURIComponent(input));
	const n = s.length;
	const state = [1732584193, -271733879, -1732584194, 271733878];

	let i: number;
	for (i = 64; i <= n; i += 64) {
		md5cycle(state, md5blk(s.substring(i - 64, i)));
	}

	s = s.substring(i - 64);
	const tail = new Array<number>(16).fill(0);
	for (i = 0; i < s.length; i++) {
		tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
	}
	tail[i >> 2] |= 0x80 << (i % 4 << 3);
	if (i > 55) {
		md5cycle(state, tail);
		tail.fill(0);
	}
	// Length in bits as a 64-bit little-endian value (low word is enough here)
	tail[14] = (n << 3) >>> 0;
	tail[15] = Math.floor(n / 0x20000000);
	md5cycle(state, tail);

	return state.map(rhex).join('');
}
