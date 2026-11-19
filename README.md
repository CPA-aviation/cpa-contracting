# C P A CONTRACTING L.L.C

English homepage for the independent Dubai company. Building Contracting and Road Contracting only.

## Setup

```bash
npm install
npm run dev
```

Open the local address printed by Next.js.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Enquiry form

The site is a static export (`output: "export"`); there is no Node server in production. The enquiry form posts from the browser to the CPA leads API (`src/lib/leads.ts`) using `NEXT_PUBLIC_LEADS_API_URL` and `NEXT_PUBLIC_LEADS_SITE_KEY`, read from `.env.production` at build time (not committed). The site key is origin-bound, so the API only accepts it from the site's own domains. Only a `201` response shows the accepted message; if the key is missing, the form opens a prefilled email draft instead. See `deploy/README.md` for deployment.

## Company Details

- **Company**: C P A CONTRACTING L.L.C
- **Commercial License**: No. 1641004 (Dubai Department of Economy and Tourism)
- **Licensed Activities**: Building Contracting & Road Contracting
- **Promoters**: Mr. Karun Arora, Mr. Vansh Arora
- **Telephone**: +971 52 781 9949
- **Email**: cpacontractingllc@gmail.com
- **Office**: Office No. 707, Burlington Tower, Business Bay, Dubai, UAE

## Documentation

Project blueprints, brand guidelines, and phase specifications are organized in the [`docs/`](./docs) directory.
