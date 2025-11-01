import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-[90vh] flex flex-col justify-between bg-gradient-to-b from-orange-50 to-slate-100">
      <div className="flex justify-center mt-10">
        <div className="bg-orange-100/70 rounded-2xl shadow-lg p-10 text-center max-w-md backdrop-blur-sm">
          <h1 className="text-3xl font-bold mb-4 text-slate-700">KiprenKoi? 🍾</h1>

          <p className="text-slate-500 mb-6">
            Informe tes amis de ce que tu vas ramener à la soirée !
          </p>

          <p className="text-sm text-slate-400 mb-8">
            (oui, tu n'y échapperas plus maintenant)
          </p>
          {/* Bouton vers la page /create */}
          <Link
            href="/create"
            className="bg-orange-400/90 hover:bg-orange-400 text-white px-6 py-3 rounded-xl shadow-md transition inline-block"
          >
            Créer ta soirée 🎉
          </Link>
        </div>
      </div>
    </main>
  );
}