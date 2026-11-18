# Phase 06 — Production readiness

Date: 17 November 2026  
Scope: Integration design for enquiry delivery, email, domain, hosting, CMS, and security.  
Status: ready for review. Nothing in this phase was published, connected, or deployed.

The enquiry form is still disabled. No email address, CRM, API endpoint, or domain was chosen. No accounts were created and no DNS was changed. Approved page copy and the visual design were not edited.

Prices below are public list prices checked on 17 November 2026. Confirm them on the vendor page before anyone buys a plan.

## Current architecture

The site is a Next.js 16.4.6 App Router application. React 19 and TypeScript strict mode. Seven routes are static pages. Content lives in `src/content/site.ts`. There is no database, no CMS, no middleware, and no analytics script.

The enquiry form is rendered on `/` and `/contact` by `EnquiryForm`. Both pages set `configured` from `process.env.ENQUIRY_ENDPOINT`. That variable is unset, so `configured` is false, every field and the submit button are disabled, and the status says the form is not connected.

`submitEnquiry` in `src/app/actions.ts` is a server action:

1. If `ENQUIRY_ENDPOINT` is missing, it returns `{ status: "unconfigured" }` and does not send anything.
2. It checks full name, email, interest, and message.
3. It `POST`s JSON to that endpoint.
4. It returns `{ status: "accepted" }` only when the HTTP response is successful and the JSON body has `accepted: true`.
5. Any other result, including a network failure, returns `{ status: "rejected" }`.

The success sentence “Your enquiry was accepted.” is shown only for `accepted`. The client does not invent that state.

`ENQUIRY_ENDPOINT` is read on the server. It is not a `NEXT_PUBLIC_` variable, so the URL is not shipped to the browser. The browser only receives the boolean `configured`.

`.gitignore` ignores `.env*`. No `.env` file is part of the site. `npm audit` on 17 November 2026 reported 0 vulnerabilities across 400 installed packages. There is no third-party script in `src`. Fonts are self-hosted through `next/font`. `next.config.ts` sets strict mode and the tracing root. It does not set security headers.

## 1. Enquiry system

### Fields

| Field | Required now | Sent |
| --- | --- | --- |
| Full name | Yes | Trimmed string |
| Organisation | No | Trimmed string, may be empty |
| Email | Yes | Trimmed string. This is the sender’s address, not a company address. |
| Phone | No | Trimmed string, may be empty |
| Interest | Yes | `Building Contracting`, `Road Contracting`, or `General` |
| Message | Yes | Trimmed string |

The company telephone on the page stays `+971 58 6524993`. The form does not publish a company email.

### Validation today

Server-side, and only after an endpoint exists:

- Full name must contain a non-space character.
- Email must match a single `@` and a dot in the domain. This is a format check, not proof that the mailbox exists.
- Interest must be one of the three values.
- Message must contain a non-space character.
- Organisation and phone are not checked.

The form uses `noValidate`, so the browser does not add its own errors. Invalid results return `{ status: "invalid", fields: [...] }` and the matching fields are marked.

Not present yet, and required before the form is enabled:

- Maximum lengths. Suggested caps for the future handler: name 120, organisation 160, email 254, phone 40, message 5,000.
- Phone format, if a phone number is supplied. Empty stays valid.
- Rejection of strings that are only punctuation.
- A fixed allowlist for the destination. The action currently `fetch`es whatever URL is in `ENQUIRY_ENDPOINT`. That must not be an open URL when it is turned on.

### Response contract

The handler that eventually receives the POST must follow the contract the site already implements.

| Result | HTTP | Body | What the page shows |
| --- | --- | --- | --- |
| Accepted | 2xx | `{ "accepted": true }` | “Your enquiry was accepted.” |
| Not accepted | anything else, or 2xx without `accepted: true` | optional | “Your enquiry was not accepted…” |
| Invalid input | handled inside the server action, before the POST | `{ status: "invalid", fields }` | “Check the highlighted fields…” |
| Endpoint missing | no request | `{ status: "unconfigured" }` | The form stays disabled |

`accepted: true` means the approved transport accepted the message for delivery. A timeout, a provider error, or a queued retry that has not been accepted must not return `accepted: true`.

### Spam protection and rate limiting

Choose these when the form is built. They are not installed now.

- Honeypot: one hidden field. If it is filled, return `rejected` and do not send.
- Rate limit on the server action: 5 submissions per IP per hour, and 20 per hour for the whole site. Return `rejected` when the limit is hit. Do not return `accepted`.
- Length caps above, so a large body cannot be used to jam the mailbox.
- No CAPTCHA unless real spam appears. A CAPTCHA is a third-party script and a privacy decision.

This volume is a handful of enquiries, not a mailing list. The limits above are enough for launch.

### Data handling and retention

An enquiry contains personal data: name, email, optional phone, optional organisation, and a free-text message. The message may contain further personal details.

Recommended handling, once a destination is approved:

- Do not add a database for the first launch. Deliver the message to one approved mailbox and let that mailbox be the record.
- Do not log the message body, email address, or phone number. Log a timestamp, the interest value, the result (`accepted` or `rejected`), and a short request id.
- Do not put the enquiry in analytics.
- The company decides how long the mailbox keeps messages. This report does not set a legal retention period.

This is not a privacy-compliance opinion. A lawyer should review the notice and the retention choice before launch if the company wants that review. The current privacy line, shown only when the form is configured, says: “By sending this form you ask the company to receive this enquiry.”

### Errors and logging

| Failure | Page | Log |
| --- | --- | --- |
| Validation | Field errors, no send | No personal data |
| Rate limit or honeypot | Rejected | Request id and reason code |
| Provider refuses or times out | Rejected | Request id and provider status code |
| Provider accepts | Accepted | Request id only |

The visitor can still call `+971 58 6524993`. The rejected copy already says that.

## 2. Email providers

No provider is approved. No account should be opened from this report. All three can send a single enquiry message. They differ in how the site authenticates and what DNS the approved domain must publish later.

Volume assumption: under 100 enquiry messages a month. That is the load this website will actually produce.

| | Resend | Amazon SES | Hostinger SMTP |
| --- | --- | --- | --- |
| Fit | Transactional HTTP API. Closest match to the current server action. | Transactional API or SMTP. Strong fit, more account setup. | A mailbox. SMTP from the Node server is possible. It is not an application email API. |
| Appropriate here | Yes, if a provider is approved. | Yes, if the company wants AWS. | Only if the company already pays for a Hostinger mailbox on the approved domain and accepts a mailbox password as the credential. |
| Domain check | Verify the sending domain. Resend gives the DNS records. | Verify the sending domain in SES. New accounts start in the sandbox until AWS grants production access. | The mailbox domain must be on Hostinger Email. |
| DNS, after a domain exists | SPF, DKIM, and a DMARC record on the approved domain. | SPF, DKIM, and a custom MAIL FROM domain. DMARC is still worth adding. | SPF and DKIM for the Hostinger mailbox. DMARC is still worth adding. |
| How the app sends | HTTPS API with a sending-only API key. | AWS SDK or SES SMTP with IAM credentials. | Authenticated SMTP to `smtp.hostinger.com`, port 465, SSL. The secret is the mailbox password. |
| Deliverability | Good for this volume once the domain is verified. Shared sending reputation on the free plan. | Very reliable once out of the sandbox. Shared IPs unless a dedicated IP is bought. | Fine for a few messages a day. Reputation is the mailbox provider’s. A full mailbox password is a weaker control than a scoped API key. |
| Reliability | HTTP API, webhooks for bounces. Free plan data retention is 30 days in Resend’s dashboard. | Regional AWS service. Production access is a manual request. | Depends on the mailbox. No delivery webhook for the app to confirm `accepted`. |
| Cost at this volume | Free plan: USD 0. Includes 3,000 emails a month and 100 a day, sent and received combined. Pro starts at USD 20 a month for 50,000. Source: resend.com/pricing. | À la carte: USD 0.10 per 1,000 emails. Essentials, the default for newer accounts: USD 0.16 per 1,000 and no monthly fee. One hundred messages is a few cents. Source: aws.amazon.com/ses/pricing. | Business Email is priced per mailbox. The advertised 48-month rates on 17 November 2026 were USD 0.39, 0.99, and 1.99 per month, renewing higher. Daily send cap is 1,000 or 3,000 per mailbox depending on plan. Source: hostinger.com/business-email and Hostinger’s mailbox limits article. |
| Extra cost to watch | Overage on paid plans is about USD 0.46 to 0.90 per extra 1,000. The free plan stops at the cap. | Attachments USD 0.12 per GB. Dedicated IPs are a separate monthly fee and are unnecessary here. | Hosting the website at Hostinger is a separate product. PHP `mail()` on their web hosting is capped at 100 a day and is the wrong path. |

Recommendation, not an approval: if the company approves one provider, start with Resend. The free tier covers this site, the API key can be limited to sending, and the server action can treat a successful provider response as `accepted: true`. Use Amazon SES instead if the company already has, or wants, an AWS account and will wait for sandbox removal. Use Hostinger SMTP only as a fallback when a Hostinger mailbox on the approved domain already exists. Do not send with PHP `mail()`.

The recipient address is still unpublished. The provider sends to that address. The website still does not display it.

## 3. Domain and deployment

No domain is selected or configured. Canonical URLs stay off until one is approved.

### Checklist

1. Company chooses the official domain and whether the public host is the apex or `www`. One is canonical. The other redirects to it with a single hop.
2. Company chooses the host. The site needs a Node server because the enquiry action is a server action. A pure static file host cannot run it later. Any current Node host that runs `next build` and `next start` is enough. The host is not chosen here.
3. Create the production project. Do not set `ENQUIRY_ENDPOINT`. The form stays disabled on the first production deploy.
4. Set server-only environment variables in the host’s secret store, not in the repository. See the list below.
5. Confirm HTTPS is issued by the host and that HTTP redirects to HTTPS.
6. Deploy from a known git revision. The build command is `npx next build`. The start command is `npx next start`.
7. Open all seven routes on the production host. Confirm the form is still disabled and the status does not say the enquiry was accepted.
8. After the domain is approved and DNS points at the host, set `metadataBase` in `src/app/layout.tsx` to that exact origin, including `https`. That is the moment canonical URLs turn on. Do not set it before.
9. Add the redirect policy: one host name, HTTPS only, no redirect chain.
10. Rollback: promote the previous deployment in the host, or redeploy the previous git revision. Do not edit production content by hand.

### DNS, only after a domain exists

- The record the host documents for the apex or `www` (A, AAAA, or CNAME).
- The redirect from the other host name.
- CAA, if the company wants to limit which certificate authority can issue the certificate. Optional.
- SPF, DKIM, and DMARC only after an email provider is approved. These are email records. They are not required to serve the website.

### Environment variables

| Name | Where | Now | Later |
| --- | --- | --- | --- |
| `ENQUIRY_ENDPOINT` | Server only | Unset. Leave it unset. | Unset until the handler and the provider are approved. Prefer retiring this open URL in favour of a server-only provider call. |
| Provider API key or SMTP password | Server only | Do not create | Set only in the host secret store |
| Approved recipient address | Server only | Do not invent | The mailbox that receives enquiries. Never `NEXT_PUBLIC_`. |
| `metadataBase` origin | Code, after domain approval | Absent | The approved `https` origin |

Nothing secret may use a `NEXT_PUBLIC_` name. Those values are sent to the browser.

## 4. CMS

This is a seven-page site. The copy is fixed by the licence record: two activities, two managers, one telephone number, one registration year. Publishing a project, a biography, an address, or an email by mistake is the main content risk.

| Option | What it adds | Cost and complexity | Fit |
| --- | --- | --- | --- |
| No CMS. Keep `src/content/site.ts`. | A content change is a small code edit and a deploy. | Lowest. No login, no vendor, no extra personal data. | Matches the site. |
| Lightweight headless CMS | Editors change text without a deploy. | A vendor account, a read token, a preview, and a place where unapproved sentences can be published. | Useful later, if non-developers must edit often. |
| Full CMS | Pages, media, users, and plugins. | Highest. Most of it would be unused. | Does not match seven static pages. |

Recommendation: no CMS. The typed file is already the source of truth. Revisit a headless CMS only when someone who will not edit the repository needs to change copy more than a few times a year. Do not install one now. Pending decision P2 stays open.

## 5. Security and privacy

Reviewed against the current tree. This is not a legal compliance claim.

| Topic | Finding |
| --- | --- |
| Environment variables | Only `ENQUIRY_ENDPOINT`, server-side. `.env*` is gitignored. No `NEXT_PUBLIC_` secrets. |
| Public API | There is no public REST route. The server action is the only write. |
| Contact exposure | Public telephone only. Email, domain, and office address are not in the rendered pages. |
| Form | Disabled. When enabled, the open `fetch` URL is the main risk. Allowlist the destination or call the provider directly with a server-only key. Add length caps and a rate limit before enabling. |
| Third-party scripts | None. No analytics tag. Pending decision P3 stays deferred. |
| Dependencies | `npm audit` reported 0 vulnerabilities on 17 November 2026. Production dependencies are Next, React, GSAP, and `@gsap/react`. |
| Headers | `next.config.ts` does not send a content-security policy, `X-Content-Type-Options`, `Referrer-Policy`, or a frame policy. Add them at deploy time, before launch. A strict policy is realistic because the site loads no third-party script. |
| Privacy | Enquiry text is personal data once the form works. Keep it in the approved mailbox, not in logs or a new database. The privacy sentence is already written and stays hidden while the form is off. A formal privacy notice is a company and legal decision, not something this report can certify. |

## Required company decisions

| ID | Decision | Needed before |
| --- | --- | --- |
| C3 | Official domain, and apex or `www` | DNS, HTTPS hostname, canonical |
| C2 | Whether any company email address may exist, and the one mailbox that receives enquiries | Any provider |
| P4 | Which provider, if any: Resend, Amazon SES, or Hostinger SMTP | Form enablement |
| — | Who may hold the API key or mailbox password | First secret |
| — | How long the mailbox keeps enquiries | First real submission |
| P2 | Stay on file-based content, or revisit a CMS later | Not a launch blocker |
| P3 | Analytics stay off unless separately approved | Not a launch blocker |
| C11 | Office address stays unpublished | Not a launch blocker |

## Access and credentials

Nobody should create these until the matching decision is approved.

- Domain registrar login, or the person who already holds the name.
- Host account, with permission to set environment variables and roll back a deployment.
- Email provider account, with permission to read DNS records and create a sending-only key.
- The recipient mailbox, if it is not the same as the provider.
- AWS account and SES production-access approval, only if SES is chosen.

The website repository does not need those passwords. The host secret store does.

## Implementation sequence

1. Choose the domain and the host.
2. Deploy the current site with `ENQUIRY_ENDPOINT` unset. Confirm all seven routes and a disabled form.
3. Attach the domain, HTTPS, and the single redirect. Then set `metadataBase` and turn canonical URLs on.
4. Add the security headers on the host or in `next.config.ts`.
5. Company approves a provider and a recipient mailbox.
6. Publish the provider’s DNS records on the approved domain. Send one test message from the provider dashboard to that mailbox. Do not point the website at it yet.
7. Replace the open `ENQUIRY_ENDPOINT` fetch with a server-only call to that provider. Keep the rule: the page shows success only when the provider accepts the message and the action returns `accepted: true`. Add length caps, a honeypot, and the rate limit.
8. Set the secret in production. Submit one real test. Confirm the mailbox received it and the page showed the accepted sentence only after that.
9. Leave the CMS and analytics off.

## Launch blockers

- No approved domain, so no canonical URL and no production hostname.
- No approved recipient mailbox and no approved email provider, so the form must stay disabled.
- `ENQUIRY_ENDPOINT` must remain unset until step 8.
- Security headers are not set yet.
- The open endpoint URL, the missing length caps, and the missing rate limit have to be closed in the same change that enables the form.

The site can be deployed as a read-only brochure before those items, provided the form stays disabled and no canonical tag is added early.

Phase 07 has not been started.
