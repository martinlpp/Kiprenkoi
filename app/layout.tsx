// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KiprenKoi",
  description: "Organise tes soirées",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`
          min-h-screen
          bg-slate-50
          text-slate-900
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
        `}
      >
        {/* on met tout dans une colonne pleine largeur */}
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}

