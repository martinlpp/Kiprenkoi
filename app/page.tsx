import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-slate-100 px-4 py-10">
      {/* Contenu centré */}
      <div className="bg-orange-100/80 rounded-2xl shadow-lg p-8 sm:p-10 text-center max-w-md w-full backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-4 text-slate-700">
          KiprenKoi? 🍾
        </h1>

        <p className="text-slate-600 mb-4">
          Informe tes amis de ce que tu vas ramener à la soirée !
        </p>

        <p className="text-sm text-slate-400 mb-8">
          (oui, tu n&apos;y échapperas plus maintenant)
        </p>

        <Link
          href="/create"
          className="bg-orange-300 hover:bg-orange-400 text-white font-medium px-6 py-3 rounded-xl shadow-md transition inline-block"
        >
          Créer ta soirée 🎉
        </Link>
      </div>
    </main>
  );
}
