import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://capframe.ai"),
  title: {
    default: "Capframe — Capability-based security for AI agents",
    template: "%s · Capframe",
  },
  description:
    "Find what your agents touch. Bind their authority. Guard every call. Three Rust modules for discovery, capability tokens, and runtime policy enforcement of MCP-using AI agents.",
  applicationName: "Capframe",
  authors: [{ name: "Euan Crosson" }],
  keywords: [
    "AI agent security",
    "MCP",
    "Model Context Protocol",
    "capability tokens",
    "tool call policy",
    "OWASP LLM",
    "NIST AI RMF",
    "MITRE ATLAS",
    "agent runtime",
    "Rust",
  ],
  openGraph: {
    type: "website",
    url: "https://capframe.ai",
    siteName: "Capframe",
    title: "Capframe — Capability-based security for AI agents",
    description:
      "Find. Bind. Guard. — Three modules for AI-agent discovery, capability tokens, and runtime enforcement, audit-mapped to OWASP / NIST / ATLAS.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capframe — Capability-based security for AI agents",
    description: "Find. Bind. Guard.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSerif.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-paper text-ink selection:bg-amber/30 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
