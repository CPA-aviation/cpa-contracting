# Phase 07 — Security hardening and pre-launch validation

Date: 17 November 2026.

Scope: security headers, a Next.js configuration review, and confirmation that the enquiry form stays disabled. No copy changes. No external services. No deployment. No hosting provider was selected.

The only application file changed is `next.config.ts`.

## Headers implemented

Headers are set in `next.config.ts` and applied to `/:path*`. Next.js writes that list into `.next/routes-manifest.json` when `next build` runs. A later change to the environment is picked up by the next build. `next start` serves the headers captured in that build.

`SECURITY_HTTPS` must be the string `true` in the environment of the production `next build`. That build is the HTTPS deployment build. The local HTTP build leaves the variable unset.

Always sent:

| Header | Value |
| --- | --- |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| X-Frame-Options | `DENY` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` |
| Content-Security-Policy | See below |
| X-Powered-By | Removed with `poweredByHeader: false` |

Sent only when the production build runs with `SECURITY_HTTPS=true`:

| Header | Value |
| --- | --- |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains` |

`preload` is omitted. No production domain is approved, so the site cannot be submitted to the HSTS preload list.

The same HTTPS build adds `upgrade-insecure-requests` to the CSP. The local HTTP build omits it. On an HTTP origin that directive would rewrite `http://localhost` to `https://localhost`.

## Exact configuration

```ts
import path from "path";
import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const httpsDeployment = process.env.SECURITY_HTTPS === "true";

function contentSecurityPolicy(): string {
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  if (!isProduction) scriptSrc.push("'unsafe-eval'");

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
  ];

  if (httpsDeployment) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy() },
];

if (httpsDeployment) {
  securityHeaders.unshift({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
```

Production CSP, `SECURITY_HTTPS` unset, as served by `next start`:

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src 'none'; frame-ancestors 'none'; manifest-src 'self'
```

Development CSP, measured from the running `pnpm dev` server on port 3000:

```
default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src 'none'; frame-ancestors 'none'; manifest-src 'self'
```

HTTPS production CSP adds `; upgrade-insecure-requests` and the response also sends `Strict-Transport-Security: max-age=63072000; includeSubDomains`.

## CSP resource decisions

The policy was taken from the production HTML of this site.

| Directive | Value | Reason |
| --- | --- | --- |
| default-src | `'self'` | Every document, script, stylesheet, font, and icon observed is same-origin. |
| script-src | `'self' 'unsafe-inline'` | Pages load scripts from `/_next/static/chunks/`. Each production document also contains three inline scripts with no `src`. One is the Next.js bootstrap (`id="_R_"`). The others carry the flight payload. No nonce is present (`nonce` is undefined in that payload). `'unsafe-inline'` is required for those scripts. A nonce middleware was not added. |
| script-src in development | adds `'unsafe-eval'` | The dev server uses Turbopack and hot reload, which evaluate strings. `'unsafe-eval'` is appended only when `NODE_ENV` is not `production`. The production response does not include it. |
| style-src | `'self'` | The working pages have no `<style>` elements. The stylesheet is `/_next/static/chunks/*.css`. |
| style-src-attr | `'unsafe-inline'` | GSAP and ScrollTrigger write transforms through element style attributes. The homepage and `/approach` create a pin spacer when motion is allowed. Attribute styles are limited to this directive so a `<style>` element is still refused on the working pages. |
| img-src | `'self'` | The only image resource is `/favicon.svg`. Drawings are inline SVG. |
| font-src | `'self'` | IBM Plex is self-hosted by `next/font`. Production HTML preloads three `.woff2` files from `/_next/static/media/`. |
| connect-src | `'self'` | Navigation and the disabled form stay on the same origin. No analytics or third-party endpoints are loaded. |
| object-src | `'none'` | No plugins. |
| base-uri | `'self'` | Blocks a rewritten document base. |
| form-action | `'self'` | The form does not submit while it is disabled. A future same-origin server action remains the only allowed target. |
| frame-src | `'none'` | The site embeds no frames. |
| frame-ancestors | `'none'` | The site must not be framed. `X-Frame-Options: DENY` covers older browsers. |
| manifest-src | `'self'` | No third-party web manifest. |

`includeSubDomains` is present on the HTTPS build because the header is meant for the real HTTPS deployment. It will apply to every subdomain of whatever hostname is used later. Preload stays off until a domain is approved.

The default Next.js 404 renders one inline `<style>` element. `style-src 'self'` blocks that element. On `http://127.0.0.1:3457/not-a-page` the headings “404” and “This page could not be found.” still render, and the page background remains the site paper colour. The hairline from that blocked style element does not appear. The seven public routes do not use that element. `style-src` was left as `'self'`.

## Security review findings

`next.config.ts` now contains the headers above. `reactStrictMode` remains true. There is no production source-map flag and no debug flag.

There is no `middleware.ts` and no `proxy.ts`. There are no route handlers. The only server write path is the existing server action `submitEnquiry` in `src/app/actions.ts`. It returns `unconfigured` when `ENQUIRY_ENDPOINT` is unset, and it accepts a response only when `response.ok` and `body.accepted === true`.

`ENQUIRY_ENDPOINT` is read on the server in `src/app/page.tsx`, `src/app/contact/page.tsx`, and `src/app/actions.ts`. The client receives a boolean `configured` prop. A search of `.next/static` found no `ENQUIRY_ENDPOINT` string. The server bundle contains the `process.env.ENQUIRY_ENDPOINT` lookup. No `NEXT_PUBLIC_` variables exist. `.gitignore` ignores `.env*`.

No third-party scripts, analytics, or remote images are loaded. Fonts and the favicon are same-origin.

`npm audit` on 17 November 2026 reported `found 0 vulnerabilities` and exited 0. That is the npm advisory check. No external security scan was performed.

## Enquiry form

`ENQUIRY_ENDPOINT` is unset. Submission was not enabled. No mailbox and no form service was connected.

On the production contact page the fields and the Send enquiry button are disabled. The status text is:

`The enquiry form is not connected yet. It cannot confirm receipt. Call +971 58 6524993.`

The same status is on the homepage form. The production flight payload for `/contact` includes `"configured":false`.

## Production configuration

### Environment

| Variable | Where it is read | Launch rule |
| --- | --- | --- |
| `ENQUIRY_ENDPOINT` | Server only | Leave unset for this read-only launch. Never prefix it with `NEXT_PUBLIC_`. |
| `SECURITY_HTTPS` | `next build`, through `next.config.ts` | Set to `true` only for the build that will be served over HTTPS. Leave unset for local HTTP. |
| `NODE_ENV` | Next.js and the CSP script policy | Next.js sets `production` for `next build` and `next start`. A production process must stay on that value so `'unsafe-eval'` is absent. |

No other environment variables are required to build or run the site.

These must stay off the client and out of git: `ENQUIRY_ENDPOINT`, and any future mailbox password, API key, or SMTP secret. None of those secrets exist in this project today.

### Commands

```
npx next build
npx next start
```

`package.json` exposes the same commands as `pnpm build` and `pnpm start`. Development is `pnpm dev`.

### Host and HTTPS

The host must run the Node production build and serve it over HTTPS. The host was not chosen. DNS was not created. The site was not deployed.

On the HTTPS host:

1. Set `SECURITY_HTTPS=true` for the build.
2. Leave `ENQUIRY_ENDPOINT` unset.
3. Run `npx next build`, then `npx next start` behind HTTPS.
4. Confirm the response includes HSTS, `upgrade-insecure-requests`, and no `X-Powered-By`.

A local check of that build over plain HTTP will make a browser upgrade the origin. Use `curl -I` for that build, or browse it only through HTTPS.

### Header behaviour

- Local and development responses include the always-on headers and the CSP. They do not include HSTS.
- Development CSP includes `'unsafe-eval'`. Production CSP does not.
- The HTTPS production build adds HSTS and `upgrade-insecure-requests`.
- `frame-ancestors 'none'` and `X-Frame-Options: DENY` are both sent.

### Deployment and rollback

1. Build on the host with the environment in the table above.
2. Start the new build.
3. Request each of the seven routes over HTTPS and read the response headers.
4. Confirm the enquiry status still says the form is not connected.

Rollback is the previous build artifact, started the same way. There is no database migration and no external service to undo. If a bad HTTPS build was served with HSTS, browsers that already stored the policy will keep using HTTPS until `max-age` expires. Build the corrected site with `SECURITY_HTTPS=true` so those browsers can still reach it.

A canonical URL and `metadataBase` stay unpublished until a domain is approved.

## Files changed

- `next.config.ts` — security headers, CSP, and `poweredByHeader: false`.
- `PHASE-07-SECURITY-HARDENING.md` — this report.

No page, copy, style, or motion file was changed.

## Test results

All commands were run in this workspace on 17 November 2026.

| Check | Result |
| --- | --- |
| `npx next build` | Exit 0. Next.js 16.4.6. Nine static pages: `/`, `/_not-found`, `/about`, `/approach`, `/building-contracting`, `/contact`, `/leadership`, `/road-contracting`. |
| `npx tsc --noEmit` | Exit 0. |
| `npx eslint src next.config.ts` | Exit 0. This includes the requested `npx eslint src`. |
| `npm audit` | Exit 0. `found 0 vulnerabilities`. |

Header checks against `npx next start` on port 3457, with `SECURITY_HTTPS` unset:

- `/`, `/about`, and `/contact` returned the production CSP above.
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy` were present.
- `Strict-Transport-Security` was absent.
- `X-Powered-By` was absent.
- Curl status for all seven routes was HTTP 200.

A separate production build with `SECURITY_HTTPS=true` was started on port 3458 and checked with `curl -I` only. That response included:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains
```

and a CSP ending in `upgrade-insecure-requests`. That build was not opened in a browser. The workspace was then rebuilt with `SECURITY_HTTPS` unset. The restored `routes-manifest.json` and a fresh `curl -I` of `/contact` had no HSTS and no `upgrade-insecure-requests`. The temporary servers were stopped. `pnpm dev` on port 3000 was left running. Its CSP includes `'unsafe-eval'` and does not include HSTS.

Browser check of `http://127.0.0.1:3457`, desktop width 1280, after the CSP tightening:

- Homepage computed background `rgb(243, 241, 236)` and text `rgb(28, 26, 23)`. Heading font is IBM Plex Sans. One same-origin stylesheet loaded. Resource entries showed no failed transfers.
- Client navigation reached `/about`, `/building-contracting`, `/road-contracting`, `/approach`, `/leadership`, `/contact`, and `/`. Each showed its own heading.
- With motion allowed, the homepage and `/approach` each had one ScrollTrigger pin spacer. The other routes had none. Heading opacity stayed `1`.
- With `prefers-reduced-motion: reduce`, `matchMedia` was true, pin spacers were `0` on `/` and `/approach`, and heading opacity stayed `1`.
- A listener attached for the client navigations recorded no `securitypolicyviolation` events and no `console.error` calls. The first document parse was judged from the rendered page: styles, fonts, hydration, and the pin all ran.
- Homepage and contact forms: 7 of 7 controls disabled on the homepage; Send enquiry disabled on `/contact`; both show the unconfigured status.

No Mozilla Observatory, securityheaders.com, or other external scan was run.

## Remaining risks

- Production `script-src` still allows `'unsafe-inline'` because the Next.js bootstrap scripts have no nonce. A nonce or hash policy would need middleware and a fresh production test. That was not added.
- `style-src-attr` allows inline style attributes so GSAP can set transforms. A browser that ignores `style-src-attr` will apply `style-src 'self'` to those attributes, so transforms would not run. The text stays visible because the pages do not hide content with opacity. The Chromium browser used for this test applied the pin, so it honours the directive.
- The default Next.js 404 inline `<style>` is blocked. The 404 message remains readable.
- HSTS `includeSubDomains` will cover every future subdomain once a hostname is used. Preload is intentionally absent.
- `submitEnquiry` is still a public server action. With `ENQUIRY_ENDPOINT` unset it returns `unconfigured` and does not fetch. There is no rate limit, because the form does not submit.
- Headers were verified on local `next start`, including one curl of an HTTPS-flagged build. They were not verified on a public HTTPS host.
- `npm audit` is a dependency advisory check. It is not a penetration test.

## Production deployment prerequisites

- An HTTPS host that can run `npx next build` and `npx next start`. Provider not selected.
- `SECURITY_HTTPS=true` on that build, and unset for any HTTP build.
- `ENQUIRY_ENDPOINT` unset.
- No canonical URL until a domain is approved.
- After deploy, check the seven routes, the response headers, and the disabled enquiry status.
- Rollback by starting the previous build.

Stop here for review.
