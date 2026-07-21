import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashton Medina | AI Engineering Projects",
  description:
    "Live AI engineering portfolio projects covering LLM apps, RAG, agentic workflows, computer vision, NLP classification, and AI deployment analytics.",
  openGraph: {
    title: "Ashton Medina | AI Engineering Projects",
    description:
      "Live AI engineering portfolio projects covering LLM apps, RAG, agentic workflows, computer vision, NLP classification, and AI deployment analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Ashton Medina AI Engineering Projects">
          <span className="brand-mark">AM</span>
          <span>AI Engineering</span>
        </Link>
        <div className="nav-links">
          <Link href="/#projects">Projects</Link>
          <Link href="/live">Live Apps</Link>
          <Link href="/#evidence">Evidence</Link>
          <a href="https://github.com/AshtonMedina22/my-projects">GitHub</a>
        </div>
      </nav>
    </header>
  );
}
