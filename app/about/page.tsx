import Link from "next/link";
import Image from "next/image";


export default function About() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-slate-100">
      <div className="flex flex-col items-center space-y-8 max-w-5xl w-full">
        <div className="bg-orange-100 rounded-2xl shadow-lg p-10 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-400">À propos</h1>
          <p className="text-slate-600 mb-4">
            ⚠️Kiprenkoi est un outil en construction...⚠️
          </p>
          <p className="text-slate-400 text-sm">
            Revenez prochainement pour contempler le projet du M
          </p>
          <Link 
            href="/" 
            className="text-slate-700 hover:underline font-semibold">
          ← Page d'accueil
          </Link>
        </div>
        <div className="flex-shrink-0">
                    <Image
                      src="/LogoKiprenkoi.png"
                      alt="Kiprenkoi brand !"
                      width={500}
                      height={500}
                      className="object-cover shadow-md"
                    />
            </div>
      </div>
    </main>
  );
}