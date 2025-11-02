"use client";

import { FormEvent, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "events"), {
        title,
        address,
        date,
        createdAt: serverTimestamp(),
      });

      // redirige vers la page de la soirée
      router.push(`/event/${docRef.id}`);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-orange-100/80 rounded-2xl shadow-lg p-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-slate-700 text-center">
          Créer une soirée 🎉
        </h1>

        <label className="block">
          <span className="text-sm text-slate-600">Nom de la soirée</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Soirée chez Rachid"
            className="mt-1 w-full rounded-lg text-slate-800
                      text-slate-800 border border-slate-400 px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">Adresse</span>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="12 rue du kiff 🍾"
            className="mt-1 w-full rounded-lg border text-slate-800 border-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border text-slate-800 border-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-300 hover:bg-orange-400 text-white py-2 rounded-lg transition"
        >
          {loading ? "Création..." : "Créer la soirée"}
        </button>
      </form>
    </main>
  );
}
