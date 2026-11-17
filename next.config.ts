import path from "path";
import type { NextConfig } from "next";

// Routes live in src/app. A Vercel build of the earlier upload has no app directory and cannot compile.

const isProduction = process.env.NODE_ENV === "production";
// Headers are captured when `next build` runs. Vercel builds over HTTPS.
const httpsDeployment =
  process.env.SECURITY_HTTPS === "true" || process.env.VERCEL === "1";

function contentSecurityPolicy(): string {
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  if (!isProduction) scriptSrc.push("'unsafe-eval'");

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' https://fonts.googleapis.com",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self' https://fonts.gstatic.com",
    "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
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
