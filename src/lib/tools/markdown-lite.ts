/**
 * A deliberately small markdown renderer for the live-preview tool.
 * Security model: ALL input text is HTML-escaped first, then the escape
 * output is decorated with safe, hard-coded markup — user markup can
 * never reach the DOM.
 */

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

const INLINE_CODE_CLASS =
	'rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-primary border border-border/60';
const LINK_CLASS =
	'text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary transition-colors';

/** Apply inline styles to already-HTML-escaped text. */
function inline(escaped: string): string {
	let s = escaped;

	// Inline code first: stash spans so emphasis rules never touch them
	const codes: string[] = [];
	s = s.replace(/`([^`\n]+)`/g, (_m, code: string) => {
		codes.push(code);
		return `\u0000${codes.length - 1}\u0000`;
	});

	// Links [text](https://…)
	s = s.replace(
		/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g,
		`<a href="$2" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">$1</a>`
	);

	// Bold, then italic (single-star rule avoids eating bold markers)
	s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
	s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

	// Strikethrough
	s = s.replace(/~~([^~\n]+)~~/g, '<del class="text-muted-foreground">$1</del>');

	// Restore code spans
	s = s.replace(
		/\u0000(\d+)\u0000/g,
		(_m, idx: string) => `<code class="${INLINE_CODE_CLASS}">${codes[Number(idx)]}</code>`
	);

	return s;
}

const HEADING_CLASSES: Record<number, string> = {
	1: 'font-display text-2xl font-bold tracking-tight mt-4 mb-2',
	2: 'font-display text-xl font-semibold tracking-tight mt-4 mb-2',
	3: 'font-display text-lg font-semibold tracking-tight mt-3 mb-1.5',
	4: 'font-display text-base font-semibold mt-3 mb-1'
};

function isBlockStart(line: string): boolean {
	return (
		/^#{1,4}\s/.test(line) ||
		/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line) ||
		/^\s*>/.test(line) ||
		/^\s*[-*]\s+/.test(line) ||
		/^\s*\d+[.)]\s+/.test(line) ||
		/^```/.test(line)
	);
}

/** Render a small markdown subset to a sanitized HTML string. */
export function renderMarkdown(md: string): string {
	const lines = md.replace(/\r\n?/g, '\n').split('\n');
	const html: string[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		if (line.trim() === '') {
			i++;
			continue;
		}

		// Fenced code block
		if (/^```/.test(line)) {
			const buf: string[] = [];
			i++;
			while (i < lines.length && !/^```\s*$/.test(lines[i])) {
				buf.push(lines[i]);
				i++;
			}
			i++; // skip closing fence (or end of input)
			html.push(
				`<pre class="my-3 overflow-auto rounded-lg border border-border/60 bg-muted p-3 font-mono text-xs leading-relaxed"><code>${escapeHtml(
					buf.join('\n')
				)}</code></pre>`
			);
			continue;
		}

		// Heading
		const h = line.match(/^(#{1,4})\s+(.*)$/);
		if (h) {
			const level = h[1].length;
			html.push(
				`<h${level} class="${HEADING_CLASSES[level]}">${inline(escapeHtml(h[2]))}</h${level}>`
			);
			i++;
			continue;
		}

		// Horizontal rule
		if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
			html.push('<hr class="my-4 border-border" />');
			i++;
			continue;
		}

		// Blockquote
		if (/^\s*>/.test(line)) {
			const buf: string[] = [];
			while (i < lines.length && /^\s*>/.test(lines[i])) {
				buf.push(lines[i].replace(/^\s*>\s?/, ''));
				i++;
			}
			html.push(
				`<blockquote class="my-3 border-l-2 border-primary/50 pl-4 italic text-muted-foreground">${buf
					.map((l) => inline(escapeHtml(l)))
					.join('<br />')}</blockquote>`
			);
			continue;
		}

		// Unordered list
		if (/^\s*[-*]\s+/.test(line)) {
			const items: string[] = [];
			while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
				items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
				i++;
			}
			html.push(
				`<ul class="my-2 list-disc space-y-1 pl-6 marker:text-muted-foreground">${items
					.map((it) => `<li>${inline(escapeHtml(it))}</li>`)
					.join('')}</ul>`
			);
			continue;
		}

		// Ordered list
		if (/^\s*\d+[.)]\s+/.test(line)) {
			const items: string[] = [];
			while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
				items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''));
				i++;
			}
			html.push(
				`<ol class="my-2 list-decimal space-y-1 pl-6 marker:text-muted-foreground">${items
					.map((it) => `<li>${inline(escapeHtml(it))}</li>`)
					.join('')}</ol>`
			);
			continue;
		}

		// Paragraph (gather lines until a blank line or a new block)
		const buf: string[] = [];
		while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
			buf.push(lines[i]);
			i++;
		}
		html.push(
			`<p class="leading-relaxed text-foreground/90">${buf.map((l) => inline(escapeHtml(l))).join('<br />')}</p>`
		);
	}

	return html.join('\n');
}
