import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-400">À propos</h1>
        <p className="text-slate-600 mb-4">
          ⚠️Kiprenkoi est un outil en construction...⚠️
        </p>
        <p className="text-slate-400 text-sm">
          Revenez prochainement pour contempler le projet du M
        </p>
        <Link 
          href="/" 
          className="text-blue-600 hover:underline font-semibold">
         ← Page d'accueil
        </Link>
      </div>
    </main>
  );
}