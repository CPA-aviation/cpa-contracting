import path from "path";
import type { NextConfig } from "next";

// Routes live in src/app. The site is a fully static export (`out/`), served directly by Nginx
// on the VPS — there is no Node server in production.
//
// Static exports cannot send response headers, so the security headers (CSP, HSTS,
// X-Frame-Options, ...) live in deploy/nginx/cpacontractingllc.com.conf. Keep the two in sync.
// The enquiry form posts from the browser to the leads API (NEXT_PUBLIC_LEADS_API_URL), which
// must be allowed in the CSP `connect-src` there.

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  // The default image optimizer needs a server; images are served as-is from /public.
  images: { unoptimized: true },
};

export default nextConfig;
