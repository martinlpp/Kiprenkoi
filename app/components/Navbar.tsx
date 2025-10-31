import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold text-slate-800">MonSite</h1>
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
