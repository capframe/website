import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
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
    default: "Capframe — Capability security for AI agents",
    template: "%s · Capframe",
  },
  description:
    "Find what your agents touch. Bind their authority. Guard every call. Three MCP-native modules — discovery and capability tokens in Rust, runtime policy in Python — for securing MCP-using AI agents.",
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
    "Python",
  ],
  openGraph: {
    type: "website",
    url: "https://capframe.ai",
    siteName: "Capframe",
    title: "Capframe — Capability security for AI agents",
    description:
      "Find. Bind. Guard. — Three modules for AI-agent discovery, capability tokens, and runtime enforcement, audit-mapped to OWASP / NIST / ATLAS.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capframe — Capability security for AI agents",
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
      className={`${geist.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg text-fg selection:bg-accent/30 selection:text-fg">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
