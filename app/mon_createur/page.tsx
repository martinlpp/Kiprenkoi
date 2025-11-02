import Link from "next/link";
import Image from "next/image";

export default function MonCreateur() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-slate-100 px-4 py-10">
      <div className="flex flex-col items-center space-y-8 max-w-5xl w-full">
        {/* Nom */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-700 text-center">
          Martin Loup
        </h1>

        {/* Bloc principal : image + textes */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-8 sm:gap-12 w-full">
          {/* Texte gauche */}
          <div className="flex-1 text-stone-700 space-y-3 text-center sm:text-left mt-6 sm:mt-10">
            <p className="text-base sm:text-lg leading-relaxed max-w-xs mx-auto sm:mx-0">
              Étudiant à l&apos;ENSAE depuis 2025, je me forme seul au
              développement web via le projet <span className="font-semibold">KiprenKoi</span>.
            </p>
            <p className="text-base sm:text-lg leading-relaxed max-w-xs mx-auto sm:mx-0">
              À terme, j&apos;envisage d&apos;utiliser mes compétences en data
              science et machine learning dans des projets utiles et innovants.
            </p>
          </div>

          {/* Image (ne bouge pas) */}
          <div className="flex-shrink-0">
            <Image
              src="/Martin.jpg"
              alt="Martin !"
              width={300}
              height={200}
              className="object-cover rounded-[50%/30%] shadow-md border-4 border-white"
            />
          </div>

          {/* Texte droite */}
          <div className="flex-1 text-stone-700 space-y-3 text-center sm:text-left mt-6 sm:mt-10">
            <p className="text-base sm:text-lg leading-relaxed max-w-xs mx-auto sm:mx-0">
              <span className="font-semibold">KiprenKoi</span> facilite
              l’organisation des soirées sans prise de tête.
            </p>
            <p className="text-base sm:text-lg leading-relaxed max-w-xs mx-auto sm:mx-0">
              À partir d&apos;un simple lien, les invités peuvent renseigner ce
              qu&apos;ils choisissent d&apos;apporter.
            </p>
            <p className="text-base sm:text-lg leading-relaxed max-w-xs mx-auto sm:mx-0">
              Plusieurs fonctionnalités complémentaires permettront aux
              organisateurs d&apos;équilibrer les apports ou de partager les
              dépenses entre invités.
            </p>
          </div>
        </div>


        {/* Lien retour */}
        <Link
          href="/"
          className="text-slate-600 text-sm underline hover:text-slate-900"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
