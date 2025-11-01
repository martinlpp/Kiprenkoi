import Link from "next/link";
import Image from "next/image"; 


export default function mon_createur() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex items-center space-x-3">
            {/* On affiche le logo situé dans /public/logo.png */}
            <Link href="/">
                <Image
                    src="/Martin.jpg"        // chemin vers le fichier (toujours depuis /public)
                    alt="Martin !"     // description pour l'accessibilité
                    width={500}             // largeur de l'image
                    height={500}            // hauteur de l'image
                    className="rounded-full" // arrondit les bords (optionnel)
                />
            </Link>

        {/* Nom du site à côté du logo */}
        </div>
    </main>
  );
}