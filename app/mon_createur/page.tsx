import Link from "next/link";
import Image from "next/image"; 


export default function mon_createur() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-slate-100">

      <div className="flex flex-col items-center space-y-6">
        <div className="text-3xl font-bold text-slate-700">Martin Loup</div>
        <div className="flex items-center space-x-8">
            {/* On affiche le logo situé dans /public/logo.png */}
            <div className="text-stone-700 space-y-2">
              <p className=" max-w-xs text-stone-700 text-lg">
                Étudiant à l'ENSAE depuis 2025, je me forme seul au développement web via le projet KiprenKoi.</p>
              <p className=" max-w-xs text-stone-700 text-lg">
                À terme, j'envisage d'utiliser mes compétences en data science et machine learning dans des projets utiles
                et innovants.  
              </p>
            </div>
            <Image
                src="/Martin.jpg"        // chemin vers le fichier (toujours depuis /public)
                alt="Martin !"     // description pour l'accessibilité
                width={500}             // largeur de l'image
                height={500}            // hauteur de l'image
                className="rounded-full" // arrondit les bords (optionnel)
            />
            <div className="text-stone-700 space-y-2">
            <p className="max-w-xs text-stone-700 text-lg">
          KiprenKoi facilite l’organisation des soirées sans prise de tête. </p> 
          <p className="max-w-xs text-stone-700 text-lg"> 
            À partir d'un simple lien, 
            les invités peuvent renseigner ce qu'ils choisissent d'apporter.</p> 
          <p className="max-w-xs text-stone-700 text-lg">
            Plusieurs fonctionnalités complémentaires permettrons aux organisateurs 
          d'imposer des ratios alcools/nourriture/..., ou de partager les 
          dépenses entre invités.</p>
        
            </div>
        </div>

        {/* Nom du site à côté du logo */}
      </div>
    </main>
  );
}