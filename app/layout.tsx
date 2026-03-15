import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wundervoll — German, made wonderful.",
  description: "82 vollständige Lektionen — A1 bis Muttersprache. Deutsch lernen nach neuester Spracherwerbsforschung.",
  keywords: "Deutsch lernen, German learning, A1, B2, C1, Muttersprache, CEFR",
  openGraph: {
    title: "Wundervoll — German, made wonderful.",
    description: "82 vollständige Lektionen — A1 bis Muttersprache.",
    url: "https://wundervolldeutsch.com",
    siteName: "Wundervoll",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;0,700;1,300;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body { -webkit-font-smoothing: antialiased; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
