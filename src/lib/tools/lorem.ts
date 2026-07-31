/**
 * Placeholder-text generator with a latin word bank.
 * Deterministic-free filler copy for mockups and layout testing.
 */

const WORDS = [
	'lorem',
	'ipsum',
	'dolor',
	'sit',
	'amet',
	'consectetur',
	'adipiscing',
	'elit',
	'sed',
	'do',
	'eiusmod',
	'tempor',
	'incididunt',
	'ut',
	'labore',
	'et',
	'dolore',
	'magna',
	'aliqua',
	'enim',
	'ad',
	'minim',
	'veniam',
	'quis',
	'nostrud',
	'exercitation',
	'ullamco',
	'laboris',
	'nisi',
	'aliquip',
	'ex',
	'ea',
	'commodo',
	'consequat',
	'duis',
	'aute',
	'irure',
	'in',
	'reprehenderit',
	'voluptate',
	'velit',
	'esse',
	'cillum',
	'fugiat',
	'nulla',
	'pariatur',
	'excepteur',
	'sint',
	'occaecat',
	'cupidatat',
	'non',
	'proident',
	'sunt',
	'culpa',
	'qui',
	'officia',
	'deserunt',
	'mollit',
	'anim',
	'id',
	'est',
	'laborum',
	'perspiciatis',
	'unde',
	'omnis',
	'iste',
	'natus',
	'error',
	'accusantium',
	'doloremque',
	'laudantium',
	'totam',
	'rem',
	'aperiam',
	'eaque',
	'ipsa',
	'quae',
	'ab',
	'illo',
	'inventore',
	'veritatis',
	'quasi',
	'architecto',
	'beatae',
	'vitae',
	'dicta',
	'explicabo',
	'nemo',
	'ipsam',
	'quia',
	'voluptas',
	'aspernatur',
	'odit',
	'fugit',
	'consequuntur',
	'magni',
	'dolores',
	'eos',
	'ratione',
	'sequi',
	'nesciunt',
	'neque',
	'porro',
	'quisquam',
	'dolorem',
	'adipisci',
	'numquam',
	'eius',
	'modi',
	'tempora',
	'incidunt',
	'magnam',
	'quaerat'
];

export type LoremUnit = 'words' | 'sentences' | 'paragraphs';

function pick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function sentence(): string {
	const length = randInt(6, 14);
	const words: string[] = [];
	for (let i = 0; i < length; i++) words.push(pick(WORDS));
	// Sprinkle in a comma on longer sentences for natural rhythm
	let text = capitalize(words.join(' '));
	if (length > 10) {
		const splitAt = randInt(3, length - 3);
		const parts = text.split(' ');
		parts[splitAt] = parts[splitAt] + ',';
		text = parts.join(' ');
	}
	return text + '.';
}

function paragraph(): string {
	const count = randInt(3, 6);
	return Array.from({ length: count }, sentence).join(' ');
}

export function generateLorem(unit: LoremUnit, count: number): string {
	const n = Math.max(1, Math.min(20, Math.floor(count) || 1));
	switch (unit) {
		case 'words': {
			const words = Array.from({ length: n }, () => pick(WORDS));
			return capitalize(words.join(' ')) + '.';
		}
		case 'sentences':
			return Array.from({ length: n }, sentence).join(' ');
		case 'paragraphs':
			return Array.from({ length: n }, paragraph).join('\n\n');
	}
}
