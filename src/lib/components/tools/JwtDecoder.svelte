<script lang="ts">
	import KeyRound from '@lucide/svelte/icons/key-round';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { cn } from '$lib/utils.js';

	const SAMPLE =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnaGFsZWIuZGV2IiwibmFtZSI6Ik1vaGFtbWVkIEdoYWxlYiIsInJvbGUiOiJmdWxsLXN0YWNrIiwiaWF0IjoxNzUyMDAwMDAwLCJleHAiOjE5MDAwMDAwMDAsImlzcyI6InRvb2xzLWRlbW8ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

	let input = $state('');

	type Decoded =
		| {
				ok: true;
				headerJson: string;
				payloadJson: string;
				payload: Record<string, unknown>;
		  }
		| { ok: false; message: string }
		| null;

	function decodePart(part: string): unknown {
		const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
		const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
		const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
		return JSON.parse(new TextDecoder().decode(bytes));
	}

	const decoded: Decoded = $derived.by(() => {
		const raw = input.trim();
		if (!raw) return null;
		const parts = raw.split('.');
		if (parts.length !== 3) {
			return {
				ok: false,
				message: 'A JWT has exactly 3 dot-separated segments (header.payload.signature).'
			};
		}
		try {
			const header = decodePart(parts[0]);
			const payload = decodePart(parts[1]) as Record<string, unknown>;
			return {
				ok: true,
				headerJson: JSON.stringify(header, null, 2),
				payloadJson: JSON.stringify(payload, null, 2),
				payload
			};
		} catch {
			return {
				ok: false,
				message: 'Could not decode — this does not look like a valid base64url-encoded JWT.'
			};
		}
	});

	const TIME_CLAIMS = ['iat', 'exp', 'nbf'] as const;
	const CLAIM_LABELS: Record<string, string> = {
		iss: 'Issuer',
		sub: 'Subject',
		aud: 'Audience',
		exp: 'Expires',
		iat: 'Issued at',
		nbf: 'Not before',
		jti: 'JWT ID'
	};

	const claims = $derived.by(() => {
		if (!decoded?.ok) return [];
		return Object.entries(decoded.payload)
			.filter(([k]) => k in CLAIM_LABELS)
			.map(([key, value]) => {
				const isTime =
					(TIME_CLAIMS as readonly string[]).includes(key) && typeof value === 'number';
				return {
					key,
					label: CLAIM_LABELS[key],
					raw: typeof value === 'object' ? JSON.stringify(value) : String(value),
					human: isTime ? new Date((value as number) * 1000).toLocaleString() : null
				};
			});
	});

	const expiry = $derived.by(() => {
		if (!decoded?.ok) return null;
		const exp = decoded.payload.exp;
		if (typeof exp !== 'number') return { state: 'na' as const };
		const ms = exp * 1000;
		const diff = ms - Date.now();
		if (diff <= 0) return { state: 'expired' as const, at: new Date(ms) };
		return { state: 'valid' as const, at: new Date(ms) };
	});
</script>

<div
	class="rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-shadow duration-300 hover:shadow-md"
>
	<header class="mb-4 flex items-start gap-3">
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
			<KeyRound class="size-4" />
		</span>
		<div class="min-w-0">
			<h3 class="font-display text-base font-semibold">JWT Decoder</h3>
			<p class="text-xs text-muted-foreground">
				Inspect the header and payload of a JSON Web Token.
			</p>
		</div>
	</header>

	<label for="jwt-input" class="sr-only">JWT token</label>
	<textarea
		id="jwt-input"
		bind:value={input}
		rows="3"
		spellcheck="false"
		placeholder="eyJhbGciOi…"
		class="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed break-all shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
	></textarea>

	<div class="mt-2 flex items-center justify-between gap-2">
		<p class="text-[11px] text-muted-foreground">Signature is not verified client-side.</p>
		<button
			type="button"
			onclick={() => (input = SAMPLE)}
			class="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
		>
			Try a sample
		</button>
	</div>

	<div aria-live="polite">
		{#if decoded && !decoded.ok}
			<p
				class="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive"
				role="alert"
			>
				{decoded.message}
			</p>
		{:else if decoded?.ok}
			<div class="mt-4 space-y-3">
				<div>
					<div class="mb-1 flex items-center justify-between">
						<span
							class="font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
							>Header</span
						>
						<CopyButton text={decoded.headerJson} label="JWT header" />
					</div>
					<pre
						class="max-h-36 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">{decoded.headerJson}</pre>
				</div>
				<div>
					<div class="mb-1 flex items-center justify-between">
						<span
							class="font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
							>Payload</span
						>
						<div class="flex items-center gap-2">
							{#if expiry}
								{#if expiry.state === 'valid'}
									<Badge class="border-success/40 bg-success/10 text-success" variant="outline"
										>Valid</Badge
									>
								{:else if expiry.state === 'expired'}
									<Badge variant="destructive">Expired</Badge>
								{:else}
									<Badge variant="secondary">No expiry</Badge>
								{/if}
							{/if}
							<CopyButton text={decoded.payloadJson} label="JWT payload" />
						</div>
					</div>
					<pre
						class="max-h-36 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">{decoded.payloadJson}</pre>
				</div>

				{#if claims.length}
					<table class="w-full text-left text-xs">
						<caption
							class="mb-1 text-left font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
						>
							Registered claims
						</caption>
						<tbody>
							{#each claims as claim (claim.key)}
								<tr class="border-b border-border/50 last:border-0">
									<th scope="row" class="py-1.5 pr-2 font-mono font-medium text-primary"
										>{claim.key}</th
									>
									<td class="py-1.5 pr-2 font-mono break-all text-foreground/90">{claim.raw}</td>
									<td
										class={cn(
											'py-1.5 text-right',
											claim.human ? 'text-foreground/80' : 'text-muted-foreground'
										)}
									>
										{claim.human ?? '—'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		{/if}
	</div>
</div>
