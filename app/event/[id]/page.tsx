"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface EventData {
  title: string;
  address: string;
  date: string;
}

export default function EventPage() {
  // ✅ on récupère l'id depuis l'URL avec le hook
  const params = useParams();
  const id = params?.id as string; // l'URL : /event/123 → id = "123"

  const [event, setEvent] = useState<EventData | null>(null);
  const [copied, setCopied] = useState(false);

  // ⚠️ on attend d'avoir l'id avant de fetch
  useEffect(() => {
    if (!id) return;

    async function fetchEvent() {
      const ref = doc(db, "events", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setEvent(snap.data() as EventData);
      }
    }

    fetchEvent();
  }, [id]);

  // pendant le fetch ou si pas d'id
  if (!id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <p>Chargement de la soirée...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <p>Récupération des infos de la soirée...</p>
      </main>
    );
  }

  // ✅ bouton copier le lien
  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-slate-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">{event.title}</h1>
        <p className="text-slate-600">📍 {event.address}</p>
        <p className="text-slate-600">📅 {event.date}</p>

        <div className="mt-6 space-y-3">
          <button
            onClick={copyLink}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
          >
            {copied ? "Lien copié ✅" : "Copier le lien"}
          </button>

          <button
            disabled
            className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
          >
            + Ajouter ce que je ramène (bientôt)
          </button>
        </div>
      </div>
    </main>
  );
}
