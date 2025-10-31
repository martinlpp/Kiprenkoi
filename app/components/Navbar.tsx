import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
      {/* Bloc gauche : logo + titre du site */}
      <div className="flex items-center space-x-3">
        {/* On affiche le logo situé dans /public/logo.png */}
        <Link href="/">
          <Image
            src="/logoKiprenkoi.png"        // chemin vers le fichier (toujours depuis /public)
            alt="Logo du site"     // description pour l'accessibilité
            width={80}             // largeur de l'image
            height={80}            // hauteur de l'image
            className="rounded-full" // arrondit les bords (optionnel)
          />
        </Link>

        {/* Nom du site à côté du logo */}
      <h1 className="text-xl font-bold text-slate-800">KiprenKoi</h1>
      </div>

      <div className="space-x-6">
        <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium">
          Accueil
        </Link>
        <Link href="/about" className="text-slate-600 hover:text-blue-600 font-medium">
          À propos
        </Link>
      </div>
    </nav>
  );
}
