/**
 * HTTP status code reference data for the status explorer tool.
 */

export type StatusClass = '1xx' | '2xx' | '3xx' | '4xx' | '5xx';

export interface HttpStatus {
	code: number;
	name: string;
	class: StatusClass;
	summary: string;
	detail: string;
	example: string;
}

export const HTTP_STATUSES: HttpStatus[] = [
	{
		code: 100,
		name: 'Continue',
		class: '1xx',
		summary: 'The server received the request headers; the client should send the body.',
		detail:
			'Used with the Expect: 100-continue header so large payloads are only transmitted if the server is willing to accept them. Common when uploading big files to APIs.',
		example: 'HTTP/1.1 100 Continue'
	},
	{
		code: 101,
		name: 'Switching Protocols',
		class: '1xx',
		summary: 'The server agrees to switch protocols as requested by the client.',
		detail:
			'Sent in response to an Upgrade header. This is the handshake that turns an HTTP connection into a WebSocket connection.',
		example: 'HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade'
	},
	{
		code: 102,
		name: 'Processing',
		class: '1xx',
		summary: 'The server has received and is working on the request, but has no response yet.',
		detail:
			'A WebDAV status that prevents client timeouts during long-running operations. Rarely seen outside DAV contexts.',
		example: 'HTTP/1.1 102 Processing'
	},
	{
		code: 103,
		name: 'Early Hints',
		class: '1xx',
		summary: 'Hints at headers the final response will include, sent before it is ready.',
		detail:
			'Mostly used with Link headers so browsers can preload critical CSS and fonts while the server still renders the page.',
		example: 'HTTP/1.1 103 Early Hints\nLink: </app.css>; rel=preload; as=style'
	},
	{
		code: 200,
		name: 'OK',
		class: '2xx',
		summary: 'The request succeeded. The workhorse status of the web.',
		detail:
			'GET returned the resource, POST/PUT/PATCH completed, DELETE removed the item. The response body carries the result for most methods.',
		example: 'HTTP/1.1 200 OK\nContent-Type: application/json'
	},
	{
		code: 201,
		name: 'Created',
		class: '2xx',
		summary: 'The request succeeded and a new resource was created.',
		detail:
			'The correct response to a POST that creates an entity. Should include a Location header pointing at the new resource.',
		example: 'HTTP/1.1 201 Created\nLocation: /api/users/42'
	},
	{
		code: 202,
		name: 'Accepted',
		class: '2xx',
		summary: 'The request was queued for processing but is not finished yet.',
		detail:
			'Ideal for async jobs: video transcodes, report generation, CI builds. Pair it with a status endpoint the client can poll.',
		example: 'HTTP/1.1 202 Accepted\nLocation: /api/jobs/9f3/status'
	},
	{
		code: 203,
		name: 'Non-Authoritative Information',
		class: '2xx',
		summary: 'A transforming proxy modified the metadata of a successful response.',
		detail:
			'Rare in practice. Indicates the headers came from a third-party copy rather than the origin server.',
		example: 'HTTP/1.1 203 Non-Authoritative Information'
	},
	{
		code: 204,
		name: 'No Content',
		class: '2xx',
		summary: 'The request succeeded but there is nothing to send back.',
		detail:
			'Perfect for DELETE endpoints or "save" actions where the client already has all the state it needs. The body must be empty.',
		example: 'HTTP/1.1 204 No Content'
	},
	{
		code: 205,
		name: 'Reset Content',
		class: '2xx',
		summary: 'Success — and the client should reset the view that sent the request.',
		detail: 'Used to tell a browser to clear a form after submission. Seldom used by modern apps.',
		example: 'HTTP/1.1 205 Reset Content'
	},
	{
		code: 206,
		name: 'Partial Content',
		class: '2xx',
		summary: 'The server is delivering only part of the resource, as requested by Range.',
		detail:
			'What makes video scrubbing and resumable downloads work. The Content-Range header describes which bytes are included.',
		example: 'HTTP/1.1 206 Partial Content\nContent-Range: bytes 0-1023/20480'
	},
	{
		code: 207,
		name: 'Multi-Status',
		class: '2xx',
		summary: 'Multiple independent operations completed; each has its own status inside.',
		detail:
			'WebDAV status where the XML body lists per-resource results. Useful conceptually for batch APIs that partially fail.',
		example: 'HTTP/1.1 207 Multi-Status\nContent-Type: application/xml'
	},
	{
		code: 226,
		name: 'IM Used',
		class: '2xx',
		summary: 'The response is a delta encoding of the resource, not the full resource.',
		detail:
			'An obscure delta-encoding status for bandwidth-efficient sync. Almost never implemented.',
		example: 'HTTP/1.1 226 IM Used'
	},
	{
		code: 300,
		name: 'Multiple Choices',
		class: '3xx',
		summary: 'Several representations exist; the client (or user) must pick one.',
		detail:
			'Historically for content negotiation. Modern APIs usually pick a representation server-side instead of returning this.',
		example: 'HTTP/1.1 300 Multiple Choices'
	},
	{
		code: 301,
		name: 'Moved Permanently',
		class: '3xx',
		summary: 'The resource has a new permanent URL; update your bookmarks and links.',
		detail:
			'Search engines transfer ranking to the new URL, and browsers cache this redirect aggressively. The classic choice for domain and slug migrations.',
		example: 'HTTP/1.1 301 Moved Permanently\nLocation: https://new.example.com/page'
	},
	{
		code: 302,
		name: 'Found',
		class: '3xx',
		summary: 'The resource lives elsewhere temporarily; keep requesting this URL.',
		detail:
			'Originally meant "temporary redirect with method preserved", but browsers historically rewrote POST to GET — which is why 303 and 307 exist.',
		example: 'HTTP/1.1 302 Found\nLocation: /login'
	},
	{
		code: 303,
		name: 'See Other',
		class: '3xx',
		summary: 'Fetch the result with a GET at another URL.',
		detail:
			'The correct response to a POST when you want to send the browser somewhere afterwards — the Post/Redirect/Get pattern that stops duplicate form submissions.',
		example: 'HTTP/1.1 303 See Other\nLocation: /orders/123/confirmation'
	},
	{
		code: 304,
		name: 'Not Modified',
		class: '3xx',
		summary: 'Your cached copy is still fresh; use it.',
		detail:
			'Sent when a conditional request (If-None-Match / If-Modified-Since) shows nothing changed. Saves bandwidth with zero body.',
		example: 'HTTP/1.1 304 Not Modified\nETag: "v1.2.3"'
	},
	{
		code: 307,
		name: 'Temporary Redirect',
		class: '3xx',
		summary: 'Redirect elsewhere for now, re-issuing the exact same method and body.',
		detail:
			'Unlike 302, a 307 guarantees the method is preserved — POST stays POST. Good for load-balancer failovers and temporary moves.',
		example: 'HTTP/1.1 307 Temporary Redirect\nLocation: https://cdn2.example.com/upload'
	},
	{
		code: 308,
		name: 'Permanent Redirect',
		class: '3xx',
		summary: 'Redirect forever, re-issuing the exact same method and body.',
		detail:
			'The method-preserving sibling of 301. Use it when an API endpoint moved permanently and clients must not drop their POST bodies.',
		example: 'HTTP/1.1 308 Permanent Redirect\nLocation: https://api.example.com/v2/users'
	},
	{
		code: 400,
		name: 'Bad Request',
		class: '4xx',
		summary: 'The server cannot parse or understand the request.',
		detail:
			'Malformed JSON, missing required fields, bad query parameters. The generic client-error fallback — include a helpful error body telling the caller what to fix.',
		example: 'HTTP/1.1 400 Bad Request\n{ "error": "email is required" }'
	},
	{
		code: 401,
		name: 'Unauthorized',
		class: '4xx',
		summary: 'Authentication is missing or invalid — you have not proven who you are.',
		detail:
			'Despite the name, this means "unauthenticated". Expired tokens and absent credentials belong here. A WWW-Authenticate header should describe how to authenticate.',
		example: 'HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer'
	},
	{
		code: 402,
		name: 'Payment Required',
		class: '4xx',
		summary: 'Reserved for future use — now used by APIs for billing walls.',
		detail:
			'Officially reserved since 1999, but pragmatically returned when a subscription lapses or a quota must be paid for before continuing.',
		example: 'HTTP/1.1 402 Payment Required'
	},
	{
		code: 403,
		name: 'Forbidden',
		class: '4xx',
		summary: 'The server knows who you are — and refuses anyway.',
		detail:
			'Authenticated but not allowed. Insufficient role, IP blocklist, or a resource the owner cannot share. Re-authenticating will not help.',
		example: 'HTTP/1.1 403 Forbidden\n{ "error": "requires admin role" }'
	},
	{
		code: 404,
		name: 'Not Found',
		class: '4xx',
		summary: 'No resource exists at this URL.',
		detail:
			'The most famous status code alive. APIs also use it (or 410) to avoid leaking whether a resource ever existed.',
		example: 'HTTP/1.1 404 Not Found'
	},
	{
		code: 405,
		name: 'Method Not Allowed',
		class: '4xx',
		summary: 'The URL exists, but not for this HTTP method.',
		detail:
			'DELETE on a read-only collection, for example. Must include an Allow header listing the supported methods.',
		example: 'HTTP/1.1 405 Method Not Allowed\nAllow: GET, HEAD'
	},
	{
		code: 406,
		name: 'Not Acceptable',
		class: '4xx',
		summary: 'No representation matches the client\u2019s Accept headers.',
		detail:
			'The client demanded application/xml and the API only speaks JSON. Modern APIs usually just default to JSON instead.',
		example: 'HTTP/1.1 406 Not Acceptable'
	},
	{
		code: 407,
		name: 'Proxy Authentication Required',
		class: '4xx',
		summary: 'The intermediate proxy — not the origin server — demands authentication.',
		detail:
			'Sent by corporate proxies with a Proxy-Authenticate header. End users rarely build this; it appears in network logs.',
		example: 'HTTP/1.1 407 Proxy Authentication Required\nProxy-Authenticate: Basic realm="corp"'
	},
	{
		code: 408,
		name: 'Request Timeout',
		class: '4xx',
		summary: 'The client took too long to send its request.',
		detail:
			'Servers close idle connections with this. On slow networks you will see it when a large upload stalls mid-body.',
		example: 'HTTP/1.1 408 Request Timeout\nConnection: close'
	},
	{
		code: 409,
		name: 'Conflict',
		class: '4xx',
		summary: 'The request clashes with the current state of the resource.',
		detail:
			'Duplicate email on signup, edit conflicts on stale versions, violating a unique constraint. The go-to status for optimistic-locking failures.',
		example: 'HTTP/1.1 409 Conflict\n{ "error": "email already registered" }'
	},
	{
		code: 410,
		name: 'Gone',
		class: '4xx',
		summary: 'The resource existed once and is permanently deleted.',
		detail:
			'A stronger 404 that also tells search engines to drop the URL from the index. Good for retired API versions and deleted profiles.',
		example: 'HTTP/1.1 410 Gone'
	},
	{
		code: 411,
		name: 'Length Required',
		class: '4xx',
		summary: 'The server refuses the request without a Content-Length header.',
		detail:
			'A guard against chunked-transfer ambiguity. Mostly handled automatically by HTTP clients.',
		example: 'HTTP/1.1 411 Length Required'
	},
	{
		code: 412,
		name: 'Precondition Failed',
		class: '4xx',
		summary: 'An If-Match / If-Unmodified-Since precondition evaluated to false.',
		detail:
			'Core of optimistic concurrency over HTTP: the client sends the ETag it based edits on, and the server rejects the write when it no longer matches.',
		example: 'HTTP/1.1 412 Precondition Failed'
	},
	{
		code: 413,
		name: 'Payload Too Large',
		class: '4xx',
		summary: 'The request body exceeds the server\u2019s configured limit.',
		detail:
			'nginx default is 1 MB, which bites when uploading images. Tune client_max_body_size or switch to direct-to-storage uploads.',
		example: 'HTTP/1.1 413 Payload Too Large'
	},
	{
		code: 414,
		name: 'URI Too Long',
		class: '4xx',
		summary: 'The request target is longer than the server will interpret.',
		detail:
			'Usually a sign a GET is being abused as a query bus. Move filters into a POST body when the URL grows past a few kilobytes.',
		example: 'HTTP/1.1 414 URI Too Long'
	},
	{
		code: 415,
		name: 'Unsupported Media Type',
		class: '4xx',
		summary: 'The Content-Type of the body is not one the endpoint accepts.',
		detail:
			'Posting XML to a JSON API, or uploading a .exe to an avatar endpoint. Return the accepted types in the error body.',
		example: 'HTTP/1.1 415 Unsupported Media Type'
	},
	{
		code: 418,
		name: "I'm a Teapot",
		class: '4xx',
		summary: 'The server refuses to brew coffee because it is, permanently, a teapot.',
		detail:
			'From the 1998 April Fools\u2019 HTCPCP spec. Survived removal attempts thanks to popular demand; Easter eggs in major frameworks keep it alive.',
		example: "HTTP/1.1 418 I'm a Teapot"
	},
	{
		code: 421,
		name: 'Misdirected Request',
		class: '4xx',
		summary: 'The request reached a server that cannot produce a response for it.',
		detail:
			'An HTTP/2 and connection-reuse edge case: a connection reused for a different origin than intended. Clients may retry on a fresh connection.',
		example: 'HTTP/1.1 421 Misdirected Request'
	},
	{
		code: 422,
		name: 'Unprocessable Content',
		class: '4xx',
		summary: 'The syntax is fine, but the semantics fail validation.',
		detail:
			'The modern standard for form/API validation errors (formerly "Unprocessable Entity"). Distinct from 400: the payload parsed perfectly.',
		example: 'HTTP/1.1 422 Unprocessable Content\n{ "errors": { "age": "must be ≥ 18" } }'
	},
	{
		code: 423,
		name: 'Locked',
		class: '4xx',
		summary: 'The resource is locked and cannot be modified.',
		detail: 'A WebDAV status indicating a write lock is held by another client.',
		example: 'HTTP/1.1 423 Locked'
	},
	{
		code: 425,
		name: 'Too Early',
		class: '4xx',
		summary: 'The server will not process a request that might be replayed.',
		detail:
			'Guards against replay attacks on TLS 1.3 early data (0-RTT). Tells the client to retry after the handshake completes.',
		example: 'HTTP/1.1 425 Too Early'
	},
	{
		code: 426,
		name: 'Upgrade Required',
		class: '4xx',
		summary: 'The server refuses this protocol version; upgrade and retry.',
		detail:
			'Used to nudge clients from HTTP/1.1 to TLS or newer protocols, with an Upgrade header describing the target.',
		example: 'HTTP/1.1 426 Upgrade Required\nUpgrade: TLS/1.3'
	},
	{
		code: 428,
		name: 'Precondition Required',
		class: '4xx',
		summary: 'The server demands a conditional request to stop lost updates.',
		detail:
			'Forces PUT/DELETE to include If-Match so two clients cannot silently overwrite each other. A polite way to enforce optimistic locking.',
		example: 'HTTP/1.1 428 Precondition Required'
	},
	{
		code: 429,
		name: 'Too Many Requests',
		class: '4xx',
		summary: 'You have exceeded the rate limit.',
		detail:
			'Should arrive with Retry-After (and ideally X-RateLimit-* headers). Clients should back off exponentially rather than hammer away.',
		example: 'HTTP/1.1 429 Too Many Requests\nRetry-After: 30'
	},
	{
		code: 431,
		name: 'Request Header Fields Too Large',
		class: '4xx',
		summary: 'The headers together (or one cookie) are too big to process.',
		detail:
			'Usually a cookie-jar that grew out of control. Clearing cookies for the domain resolves it.',
		example: 'HTTP/1.1 431 Request Header Fields Too Large'
	},
	{
		code: 451,
		name: 'Unavailable For Legal Reasons',
		class: '4xx',
		summary: 'Access is denied for legal demands — censorship made machine-readable.',
		detail:
			'Named after Fahrenheit 451. Used for GDPR blocks, court orders, and takedown notices. Should say which law demands the block.',
		example: 'HTTP/1.1 451 Unavailable For Legal Reasons'
	},
	{
		code: 500,
		name: 'Internal Server Error',
		class: '5xx',
		summary: 'Something broke inside the server; no further detail is safe to share.',
		detail:
			'Uncaught exceptions, null dereferences, failed assertions. The generic server-side failure — check logs, and never leak stack traces to clients in production.',
		example: 'HTTP/1.1 500 Internal Server Error'
	},
	{
		code: 501,
		name: 'Not Implemented',
		class: '5xx',
		summary: 'The server does not support the functionality required to fulfill the request.',
		detail:
			'Unrecognized HTTP methods or unfinished endpoints. The only 5xx where "try again later" will never help.',
		example: 'HTTP/1.1 501 Not Implemented'
	},
	{
		code: 502,
		name: 'Bad Gateway',
		class: '5xx',
		summary: 'A proxy or gateway received an invalid response from upstream.',
		detail:
			'Classic reverse-proxy symptom: nginx/Cloudflare is up, but the app server behind it crashed or answered garbage. Check upstream health first.',
		example: 'HTTP/1.1 502 Bad Gateway'
	},
	{
		code: 503,
		name: 'Service Unavailable',
		class: '5xx',
		summary: 'The server is temporarily overloaded or down for maintenance.',
		detail:
			'The honest "back later" status — ideal with a Retry-After header during deploys. Load balancers also emit it when every upstream is unhealthy.',
		example: 'HTTP/1.1 503 Service Unavailable\nRetry-After: 120'
	},
	{
		code: 504,
		name: 'Gateway Timeout',
		class: '5xx',
		summary: 'The gateway waited on an upstream that never answered in time.',
		detail:
			'502\u2019s patient sibling: the upstream exists but is too slow — usually a runaway query or a deadlocked worker. Look at upstream p99 latency.',
		example: 'HTTP/1.1 504 Gateway Timeout'
	},
	{
		code: 505,
		name: 'HTTP Version Not Supported',
		class: '5xx',
		summary: 'The server refuses the HTTP protocol version used in the request.',
		detail: 'Rarely seen today; a legacy artifact from the HTTP/1.0 to 1.1 transition era.',
		example: 'HTTP/1.1 505 HTTP Version Not Supported'
	},
	{
		code: 507,
		name: 'Insufficient Storage',
		class: '5xx',
		summary: 'The server cannot store the representation needed to complete the request.',
		detail:
			'WebDAV origin: the disk filled up mid-PUT. Monitoring disk headroom keeps this one away.',
		example: 'HTTP/1.1 507 Insufficient Storage'
	},
	{
		code: 508,
		name: 'Loop Detected',
		class: '5xx',
		summary: 'The server detected an infinite loop while processing the request.',
		detail:
			'A WebDAV guard for recursive operations with Depth: infinity that cycle back on themselves.',
		example: 'HTTP/1.1 508 Loop Detected'
	},
	{
		code: 511,
		name: 'Network Authentication Required',
		class: '5xx',
		summary: 'The network itself — usually a captive portal — demands a login first.',
		detail:
			'What hotel and airport Wi-Fi interception looks like in status-code form. Clients should open a browser to complete the portal flow.',
		example: 'HTTP/1.1 511 Network Authentication Required'
	}
];
