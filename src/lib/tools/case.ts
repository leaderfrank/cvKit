/**
 * Text case conversions. Words are tokenized on spaces, underscores,
 * hyphens and camelCase / PascalCase boundaries.
 */

export type CaseKind =
	| 'camel'
	| 'pascal'
	| 'snake'
	| 'kebab'
	| 'screaming'
	| 'title'
	| 'lower'
	| 'upper';

export interface CaseConversion {
	id: CaseKind;
	label: string;
	convert: (input: string) => string;
}

/** Split free-form text into lowercase-comparable word tokens. */
export function splitWords(input: string): string[] {
	return input
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase boundary
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // HTMLParser → HTML Parser
		.split(/[^A-Za-z0-9]+/)
		.map((w) => w.trim())
		.filter(Boolean);
}

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const caseConversions: CaseConversion[] = [
	{
		id: 'camel',
		label: 'camelCase',
		convert: (input) =>
			splitWords(input)
				.map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w)))
				.join('')
	},
	{
		id: 'pascal',
		label: 'PascalCase',
		convert: (input) => splitWords(input).map(capitalize).join('')
	},
	{
		id: 'snake',
		label: 'snake_case',
		convert: (input) =>
			splitWords(input)
				.map((w) => w.toLowerCase())
				.join('_')
	},
	{
		id: 'kebab',
		label: 'kebab-case',
		convert: (input) =>
			splitWords(input)
				.map((w) => w.toLowerCase())
				.join('-')
	},
	{
		id: 'screaming',
		label: 'SCREAMING_SNAKE',
		convert: (input) =>
			splitWords(input)
				.map((w) => w.toUpperCase())
				.join('_')
	},
	{
		id: 'title',
		label: 'Title Case',
		convert: (input) => splitWords(input).map(capitalize).join(' ')
	},
	{
		id: 'lower',
		label: 'lowercase',
		convert: (input) =>
			splitWords(input)
				.map((w) => w.toLowerCase())
				.join(' ')
	},
	{
		id: 'upper',
		label: 'UPPERCASE',
		convert: (input) =>
			splitWords(input)
				.map((w) => w.toUpperCase())
				.join(' ')
	}
];

export function convertCase(input: string, kind: CaseKind): string {
	const found = caseConversions.find((c) => c.id === kind);
	return found ? found.convert(input) : input;
}
