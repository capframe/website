import type { NextConfig } from "next";

const RAW = "https://raw.githubusercontent.com/capframe/capframe/main";

/** Strict CSP for a static marketing site with no inline scripts of our own. */
const CSP = [
  "default-src 'self'",
  // Next.js 16 emits a small inline bootstrap script per page; the ImageResponse
  // OG image is a separate route. `unsafe-inline` is on style-src because Next
  // emits inline critical CSS; we keep script-src locked down to self.
  "script-src 'self' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Install script shortcuts — `curl capframe.ai/install | sh`
      { source: "/install",     destination: `${RAW}/install.sh`,   permanent: false },
      { source: "/install.ps1", destination: `${RAW}/install.ps1`,  permanent: false },

      // Marketing aliases
      { source: "/github",  destination: "https://github.com/capframe/capframe",         permanent: false },
      { source: "/docs",    destination: "https://github.com/capframe/capframe#readme",  permanent: false },
      { source: "/schema",  destination: `${RAW}/schemas/findings.v1.json`,              permanent: false },

      // Module repos (so `/find`, `/bind`, `/guard` work as memorable shortcuts).
      { source: "/find",  destination: "https://github.com/euanmcrosson-dotcom/mcp-recon", permanent: false },
      { source: "/bind",  destination: "https://github.com/euanmcrosson-dotcom/capnagent", permanent: false },
      { source: "/guard", destination: "https://github.com/euanmcrosson-dotcom/mcp-guard", permanent: false },
    ];
  },

  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      // .well-known files should be cacheable and CORS-readable.
      {
        source: "/.well-known/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
