"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

interface EventData {
  title: string;
  address: string;
  date: string;
}

interface ItemData {
  id: string;
  name: string;
  item: string;
}

export default function EventPage() {
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [copied, setCopied] = useState(false);

  // pour les éléments ramenés
  const [items, setItems] = useState<ItemData[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemName, setItemName] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [adding, setAdding] = useState(false);

  // 🟠 1. Récupérer la soirée
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

  // 🟠 2. Écouter en temps réel les items de cette soirée
  useEffect(() => {
    if (!id) return;

    const itemsRef = collection(db, "events", id, "items");
    const q = query(itemsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list: ItemData[] = [];
      snapshot.forEach((docu) => {
        list.push({
          id: docu.id,
          ...(docu.data() as Omit<ItemData, "id">),
        });
      });
      setItems(list);
      setLoadingItems(false);
    });

    return () => unsub();
  }, [id]);

  // 🟠 3. Ajouter un élément
  const handleAddItem = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!id) return;
  if (!itemValue.trim()) return;

  const finalName = itemName.trim() === "" ? "Anonyme" : itemName.trim();

  try {
    setAdding(true);

    // 🔹 1. Récupère l'adresse IP publique (API gratuite)
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    const userIp = data.ip || "inconnue";

    // 🔹 2. Envoie dans Firestore
    await addDoc(collection(db, "events", id, "items"), {
      name: finalName,
      item: itemValue.trim(),
      createdAt: serverTimestamp(),
      ip: userIp, // 🟠 on stocke l’IP ici
    });

    setItemValue("");
  } catch (err) {
    console.error("Erreur ajout d'item :", err);
  } finally {
    setAdding(false);
  }
};


  // 🟠 4. Supprimer un élément
  const handleDeleteItem = async (itemId: string, itemIp?: string) => {
  if (!id) return;

  // on récupère notre propre IP
  const res = await fetch("https://api.ipify.org?format=json");
  const { ip: myIp } = await res.json();

  if (myIp !== itemIp) {
    alert("Tu ne peux pas supprimer un élément ajouté par quelqu’un d’autre !");
    return;
  }

  const ok = confirm("Supprimer cet élément ?");
  if (!ok) return;

  await deleteDoc(doc(db, "events", id, "items", itemId));
};

// bouton copier le lien
  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }


  // affichages intermédiaires
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

  // ✅ rendu final
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-orange-50 to-slate-100 p-6">
      {/* carte principale */}
      <div className="bg-orange-100 rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-800">{event.title}</h1>
        <p className="text-slate-600">📍 {event.address}</p>
        <p className="text-slate-600">📅 {event.date}</p>

        <div className="mt-6 space-y-3">
          <button
            onClick={copyLink}
            className="w-full bg-orange-300 hover:bg-orange-400 text-white py-2 rounded-lg transition"
          >
            {copied ? "Lien copié ✅" : "Copier le lien"}
          </button>
        </div>
      </div>

      {/* bloc ajout d'élément */}
      <div className="w-full max-w-md bg-orange-100 backdrop-blur rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">
          Ajouter ce que je ramène 🧃
        </h2>
        <form onSubmit={handleAddItem} className="space-y-3">
          <input
            type="text"
            placeholder="Ton prénom (laisser vide = anonyme)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full border text-slate-800 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <input
            type="text"
            placeholder="Ex : chips, bouteille, dessert..."
            value={itemValue}
            onChange={(e) => setItemValue(e.target.value)}
            className="w-full border text-slate-800 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button
            type="submit"
            disabled={adding}
            className="w-full bg-orange-300 hover:bg-orange-400 text-white py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            {adding ? "Ajout..." : "Ajouter"}
          </button>
        </form>
      </div>

      {/* liste des éléments */}
      <div className="w-full max-w-md mt-5 bg-orange-100 rounded-2xl shadow-sm p-4">
        <h3 className="font-semibold text-slate-700 mb-3">
          Ce que les gens ramènent 🍻
        </h3>

        {loadingItems ? (
          <p className="text-slate-500 text-sm">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-slate-400 text-sm">
            Personne n&apos;a encore ajouté quelque chose.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">
                    {it.item}
                  </p>
                  <p className="text-xs text-slate-500">
                    par {it.name || "Anonyme"}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem(it.id)}
                  className="text-slate-400 hover:text-red-500 text-sm"
                  title="Supprimer"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

