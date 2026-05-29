import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import GSAPProvider from "@/components/providers/GSAPProvider";
import { ViewModeProvider } from "@/components/providers/ViewModeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myceliums.ai"),
  title: "Myceliums: Code Intelligence Infrastructure for AI Agents",
  description:
    "Understand any codebase in minutes. Myceliums builds a knowledge graph from code, documents, and notebooks across 20+ languages with impact detection, architectural intelligence, and 27 AI agent tools.",
  keywords: [
    "code intelligence",
    "code knowledge graph",
    "AI code understanding",
    "impact detection",
    "codebase onboarding",
    "MCP server for code",
    "architecture analysis",
    "open source code analysis",
    "MCP server for Claude Code",
    "local-first code intelligence",
  ],
  openGraph: {
    title: "Myceliums: Code Intelligence Infrastructure for AI Agents",
    description:
      "AI agents that actually understand your architecture. Impact detection, call graphs, 20+ languages. Open source.",
    url: "https://myceliums.ai",
    siteName: "Myceliums",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Myceliums — Code Intelligence Infrastructure for AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myceliums: Code Intelligence Infrastructure for AI Agents",
    description:
      "AI agents that actually understand your architecture. Impact detection, call graphs, 20+ languages. Open source.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground grain`}
      >
        <ViewModeProvider>
          <GSAPProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </GSAPProvider>
        </ViewModeProvider>
      </body>
    </html>
  );
}
