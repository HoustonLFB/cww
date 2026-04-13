import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.nomPlateforme,
  description: "Annuaire interactif des diocèses, paroisses, prêtres et lieux de l'Église catholique en France",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-primary text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90">
              <span className="text-2xl">⛪</span>
              <div>
                <h1 className="text-lg font-bold leading-tight">{siteConfig.nomCourt}</h1>
                <p className="text-xs opacity-80">{siteConfig.nomPlateforme}</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:underline underline-offset-4">Carte</Link>
              <Link href="/dioceses" className="hover:underline underline-offset-4">Diocèses</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-foreground text-background text-center py-4 text-xs opacity-70">
          {siteConfig.nomPlateforme} — {siteConfig.footerTexte}
        </footer>
      </body>
    </html>
  );
}
