"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="w-full bg-[#fef1e0] border-b border-orange-100">
      {/* ce conteneur peut être limité, mais le bg du header prend TOUT */}
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="/LogoKiprenkoi.png"
            alt="KiprenKoi"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="font-semibold text-slate-800 text-lg">
            KiprenKoi
          </span>
        </div>

        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/" className="hover:text-slate-900">
            Accueil
          </Link>
          <Link href="/about" className="hover:text-slate-900">
            À propos
          </Link>
          <Link href="/mon_createur" className="hover:text-slate-900">
            Mon créateur
          </Link>
        </nav>
      </div>
    </header>
  );
}
