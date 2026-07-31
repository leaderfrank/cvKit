/**
 * Precomputed event-loop scenarios for the stepper demo.
 *
 * No real parsing happens here: every scenario is hand-modelled as a list of
 * {@link LoopStep}s describing the exact engine state after each beat —
 * call stack, microtask queue, macrotask (task) queue, and console output.
 *
 * Each scenario's resulting output was verified against real runtime
 * semantics (Node/bun): microtasks drain FULLY after every call-stack
 * emptying, before exactly ONE macrotask runs.
 */

export interface LoopStep {
	/** Human explanation of what just happened. */
	description: string;
	/** Call stack frames, bottom → top (last entry is executing). */
	stack: string[];
	/** Pending microtasks, FIFO (first entry runs next). */
	micro: string[];
	/** Pending macrotasks, FIFO (first entry runs next). */
	macro: string[];
	/** Everything printed to the console so far, in order. */
	output: string[];
	/** Code line to highlight (0-indexed into codeLines; -1 = none). */
	line: number;
}

export interface LoopScenario {
	id: string;
	title: string;
	summary: string;
	/** The console output the scenario must end with, joined by " → ". */
	expected: string;
	codeLines: string[];
	steps: LoopStep[];
}

export const GOLDEN_RULE = 'Call stack empties → ALL microtasks run → ONE macrotask → render.';

const timersVsPromises: LoopScenario = {
	id: 'timers-vs-promises',
	title: 'Timers vs. Promises',
	summary: 'A resolved promise always beats a 0 ms timer — microtasks run before macrotasks.',
	expected: 'A → D → C → B',
	codeLines: [
		"console.log('A');",
		'setTimeout(() => {',
		"  console.log('B');",
		'}, 0);',
		'Promise.resolve().then(() => {',
		"  console.log('C');",
		'});',
		"console.log('D');"
	],
	steps: [
		{
			description:
				'The entire script is the very first task. Everything synchronous in it runs before the engine even glances at a queue.',
			stack: [],
			micro: [],
			macro: [],
			output: [],
			line: -1
		},
		{
			description: "console.log('A') runs synchronously and prints.",
			stack: ['main script', "console.log('A')"],
			micro: [],
			macro: [],
			output: ['A'],
			line: 0
		},
		{
			description:
				'setTimeout registers its callback with a 0 ms Web-API timer. The call returns instantly — the script never waits on it.',
			stack: ['main script', 'setTimeout(cb, 0)'],
			micro: [],
			macro: [],
			output: ['A'],
			line: 1
		},
		{
			description:
				'The 0 ms timer fires and the callback drops into the MACROTASK queue — but the main script is still on the stack, so it must wait its turn.',
			stack: ['main script'],
			micro: [],
			macro: ["cb → log('B')"],
			output: ['A'],
			line: 3
		},
		{
			description:
				'Promise.resolve() creates an already-fulfilled promise, so its .then() reaction is queued as a MICROTASK immediately. Note it lands in a different queue than the timer callback.',
			stack: ['main script', '.then(cb)'],
			micro: ["cb → log('C')"],
			macro: ["cb → log('B')"],
			output: ['A'],
			line: 4
		},
		{
			description:
				"console.log('D') runs — still plain synchronous code. Queued work is never interleaved mid-script.",
			stack: ['main script', "console.log('D')"],
			micro: ["cb → log('C')"],
			macro: ["cb → log('B')"],
			output: ['A', 'D'],
			line: 7
		},
		{
			description:
				'The main script returns and the call stack empties. Checkpoint: drain ALL microtasks first — macrotasks wait.',
			stack: [],
			micro: ["cb → log('C')"],
			macro: ["cb → log('B')"],
			output: ['A', 'D'],
			line: -1
		},
		{
			description:
				"The microtask queue drains completely (FIFO). The 'C' callback runs now, even though its .then() was seen after the timer.",
			stack: ['cb C', "console.log('C')"],
			micro: [],
			macro: ["cb → log('B')"],
			output: ['A', 'D', 'C'],
			line: 5
		},
		{
			description:
				"Microtasks are empty, so exactly ONE macrotask runs: the timer callback prints 'B'. Final order: A → D → C → B.",
			stack: ['cb B', "console.log('B')"],
			micro: [],
			macro: [],
			output: ['A', 'D', 'C', 'B'],
			line: 2
		}
	]
};

const asyncAwait: LoopScenario = {
	id: 'async-await',
	title: 'async / await',
	summary:
		'await splits a function in two: everything before it runs synchronously, everything after it is a microtask.',
	expected: '1 → 3 → 2',
	codeLines: [
		'async function f() {',
		"  console.log('1');",
		'  await Promise.resolve();',
		"  console.log('2');",
		'}',
		'f();',
		"console.log('3');"
	],
	steps: [
		{
			description:
				"An async function is not backgrounded — it runs on the caller's stack like any function, until its FIRST await.",
			stack: [],
			micro: [],
			macro: [],
			output: [],
			line: -1
		},
		{
			description:
				'f() is invoked and pushed onto the call stack. Its body starts executing synchronously.',
			stack: ['main script', 'f()'],
			micro: [],
			macro: [],
			output: [],
			line: 5
		},
		{
			description: "'1' prints — straight-line code before the first await behaves normally.",
			stack: ['main script', 'f()', "console.log('1')"],
			micro: [],
			macro: [],
			output: ['1'],
			line: 1
		},
		{
			description:
				"await Promise.resolve(): the promise is already fulfilled, so f() SUSPENDS. The rest of its body — from console.log('2') on — is queued as a microtask continuation, f() returns a pending promise, and control goes back to the caller.",
			stack: ['main script'],
			micro: ["f() cnt → log('2')"],
			macro: [],
			output: ['1'],
			line: 2
		},
		{
			description:
				"console.log('3') runs on the still-alive main script. The suspended f() has no say until the stack empties — that's how '3' beats '2'.",
			stack: ['main script', "console.log('3')"],
			micro: ["f() cnt → log('2')"],
			macro: [],
			output: ['1', '3'],
			line: 6
		},
		{
			description:
				'The script ends; the call stack is empty. Microtask checkpoint: time to drain the queue.',
			stack: [],
			micro: ["f() cnt → log('2')"],
			macro: [],
			output: ['1', '3'],
			line: -1
		},
		{
			description:
				"The continuation resumes f() right after the await: '2' prints, f() completes and its promise resolves. Final order: 1 → 3 → 2.",
			stack: ['f()', "console.log('2')"],
			micro: [],
			macro: [],
			output: ['1', '3', '2'],
			line: 3
		}
	]
};

const mixedQueues: LoopScenario = {
	id: 'mixed-queues',
	title: 'Chained promises inside timers',
	summary:
		'Microtasks queued by a task drain BEFORE the next task — even freshly created ones. Promise chains queue one link at a time.',
	expected: 'S → P1 → P2 → T1 → P-in-T1 → T2',
	codeLines: [
		"console.log('S');",
		'setTimeout(() => {',
		"  console.log('T1');",
		'  Promise.resolve().then(() => {',
		"    console.log('P-in-T1');",
		'  });',
		'}, 0);',
		'Promise.resolve().then(() => {',
		"  console.log('P1');",
		'}).then(() => {',
		"  console.log('P2');",
		'});',
		'setTimeout(() => {',
		"  console.log('T2');",
		'}, 0);'
	],
	steps: [
		{
			description:
				'Three mechanisms — sync code, promise chains and two timers — are about to interleave. The script itself runs as the first task.',
			stack: [],
			micro: [],
			macro: [],
			output: [],
			line: -1
		},
		{
			description: "console.log('S') — plain synchronous line, prints immediately.",
			stack: ['main script', "console.log('S')"],
			micro: [],
			macro: [],
			output: ['S'],
			line: 0
		},
		{
			description:
				'setTimeout #1 hands its callback to a 0 ms timer and returns. The script keeps moving.',
			stack: ['main script', 'setTimeout(cb, 0)'],
			micro: [],
			macro: [],
			output: ['S'],
			line: 1
		},
		{
			description:
				"Timer #1 expires → the 'T1' callback parks as the first MACROTASK. The script is still running, though, so it waits.",
			stack: ['main script'],
			micro: [],
			macro: ['task T1'],
			output: ['S'],
			line: 6
		},
		{
			description:
				"Promise.resolve().then(cb): the promise is already fulfilled, so the 'P1' handler queues as a microtask right away.",
			stack: ['main script', '.then(cb)'],
			micro: ["cb → log('P1')"],
			macro: ['task T1'],
			output: ['S'],
			line: 7
		},
		{
			description:
				'The chained .then() only REGISTERS: the promise it waits on is still pending — it can only queue after the P1 handler actually runs. Nothing enters the queue for it yet.',
			stack: ['main script', '.then(cb)'],
			micro: ["cb → log('P1')"],
			macro: ['task T1'],
			output: ['S'],
			line: 9
		},
		{
			description: 'setTimeout #2 starts its 0 ms timer…',
			stack: ['main script', 'setTimeout(cb, 0)'],
			micro: ["cb → log('P1')"],
			macro: ['task T1'],
			output: ['S'],
			line: 12
		},
		{
			description: "…and expires: timer #2's callback queues BEHIND timer #1 (task queue is FIFO).",
			stack: ['main script'],
			micro: ["cb → log('P1')"],
			macro: ['task T1', 'task T2'],
			output: ['S'],
			line: 14
		},
		{
			description:
				'The script finishes; the call stack empties. Golden rule time: drain ALL microtasks before touching the next task.',
			stack: [],
			micro: ["cb → log('P1')"],
			macro: ['task T1', 'task T2'],
			output: ['S'],
			line: -1
		},
		{
			description:
				"Microtask #1 prints 'P1'. Its handler RETURNED, which resolves the promise the chain was waiting on — so the second .then() (line 10) now becomes a microtask itself, in the same drain.",
			stack: ['cb P1', "console.log('P1')"],
			micro: ["cb → log('P2')"],
			macro: ['task T1', 'task T2'],
			output: ['S', 'P1'],
			line: 8
		},
		{
			description:
				"'P2' prints. Newly-queued microtasks run in the SAME drain, not the next one — only now, with the queue empty, may one macrotask run.",
			stack: ['cb P2', "console.log('P2')"],
			micro: [],
			macro: ['task T1', 'task T2'],
			output: ['S', 'P1', 'P2'],
			line: 10
		},
		{
			description: "Task #1 pops off the task queue and 'T1' prints…",
			stack: ['task T1', "console.log('T1')"],
			micro: [],
			macro: ['task T2'],
			output: ['S', 'P1', 'P2', 'T1'],
			line: 2
		},
		{
			description:
				'…but inside that task, a resolved promise queues a FRESH microtask. Task T2 is NOT allowed to jump the line.',
			stack: ['task T1', '.then(cb)'],
			micro: ["cb → log('P-in-T1')"],
			macro: ['task T2'],
			output: ['S', 'P1', 'P2', 'T1'],
			line: 3
		},
		{
			description:
				"Task T1's callback returns — stack empty again → microtask checkpoint: 'P-in-T1' prints BEFORE the next task can start.",
			stack: ['cb P-in-T1', "console.log('P-in-T1')"],
			micro: [],
			macro: ['task T2'],
			output: ['S', 'P1', 'P2', 'T1', 'P-in-T1'],
			line: 4
		},
		{
			description:
				"Only now does task #2 run — 'T2' prints, everything is drained. Final order: S → P1 → P2 → T1 → P-in-T1 → T2.",
			stack: ['task T2', "console.log('T2')"],
			micro: [],
			macro: [],
			output: ['S', 'P1', 'P2', 'T1', 'P-in-T1', 'T2'],
			line: 13
		}
	]
};

export const SCENARIOS: LoopScenario[] = [timersVsPromises, asyncAwait, mixedQueues];
