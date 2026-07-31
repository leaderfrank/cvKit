/**
 * Bundled programming wisdom — no network involved on purpose.
 * The widget exists to show that not every card needs an HTTP call to be
 * honest about it: local data, random pick, zero API surface.
 */

export interface DevQuote {
	text: string;
	author: string;
	context?: string;
}

export const devQuotes: DevQuote[] = [
	{
		text: 'Premature optimization is the root of all evil.',
		author: 'Donald Knuth',
		context: 'The Art of Computer Programming'
	},
	{ text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
	{
		text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
		author: 'Martin Fowler',
		context: 'Refactoring'
	},
	{ text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
	{
		text: 'Simplicity is prerequisite for reliability.',
		author: 'Edsger W. Dijkstra'
	},
	{
		text: "The most dangerous phrase in the language is, 'We've always done it this way.'",
		author: 'Grace Hopper'
	},
	{ text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
	{
		text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
		author: 'Harold Abelson',
		context: 'SICP'
	},
	{
		text: 'Everyone knows that debugging is twice as hard as writing a program in the first place.',
		author: 'Brian Kernighan',
		context: 'The Elements of Programming Style'
	},
	{
		text: 'Code is like humor. When you have to explain it, it’s bad.',
		author: 'Cory House'
	},
	{
		text: 'Before software can be reusable it first has to be usable.',
		author: 'Ralph Johnson'
	},
	{
		text: 'Controlling complexity is the essence of computer programming.',
		author: 'Brian Kernighan'
	},
	{
		text: 'The function of good software is to make the complex appear to be simple.',
		author: 'Grady Booch'
	},
	{
		text: 'Simplicity is hard work. But there’s a huge payoff.',
		author: 'Rich Hickey',
		context: 'Simple Made Easy'
	},
	{
		text: 'Walking on water and developing software from a specification are easy if both are frozen.',
		author: 'Edward V. Berard'
	},
	{
		text: 'Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.',
		author: 'Martin Golding'
	}
];

/**
 * Random index into devQuotes, never repeating `excludeIndex`
 * (so a refresh always shows something new).
 */
export function pickQuoteIndex(excludeIndex = -1): number {
	if (devQuotes.length <= 1) return 0;
	let index = Math.floor(Math.random() * devQuotes.length);
	while (index === excludeIndex) {
		index = Math.floor(Math.random() * devQuotes.length);
	}
	return index;
}
