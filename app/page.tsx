import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-[90vh] flex flex-col justify-between bg-slate-100">
      <div className="flex justify-center mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-500">KiprenKoi ?</h1>
          <p className="text-slate-600 mb-6">
            Informe tes amis de ce que tu vas ramener à la soirée !
          </p>
          <p className="text-sm text-slate-400">
            (oui, tu n'y échapperas plus maintenant)
          </p>
        </div>
      </div>

      <div className="flex justify-center pb-4">
        <Link
          href="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          Créer ta soirée 🎉
        </Link>
      </div>
    </main>

  );
}