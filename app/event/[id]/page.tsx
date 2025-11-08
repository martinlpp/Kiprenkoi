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

const USER_ID_KEY = "kiprenkoi_user_id";

type QuotaItem = {
  id: string;
  label: string;
  percent: number;
};

interface EventData {
  title: string;
  address: string;
  date: string;
  quotas?: QuotaItem[];
}

interface ItemData {
  id: string;
  name: string;
  item: string;
  userId?: string; // identifiant persistant par navigateur
  quotaId?: string | null;
}

export default function EventPage() {
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [copied, setCopied] = useState(false);

  // items ramenés
  const [items, setItems] = useState<ItemData[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemName, setItemName] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [adding, setAdding] = useState(false);

  // catégorie pour l'item qu'on ajoute
  const [selectedQuotaId, setSelectedQuotaId] = useState<string>("other");

  // 🆔 identifiant localStorage de l'utilisateur
  const [userId, setUserId] = useState<string | null>(null);

  // 🟠 0. Générer / lire le userId localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    let stored = window.localStorage.getItem(USER_ID_KEY);
    if (!stored) {
      let newId: string;
      if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        newId = crypto.randomUUID();
      } else {
        newId = Math.random().toString(36).slice(2);
      }
      window.localStorage.setItem(USER_ID_KEY, newId);
      stored = newId;
    }
    setUserId(stored);
  }, []);

  // 🟠 1. Récupérer la soirée
  useEffect(() => {
    if (!id) return;

    async function fetchEvent() {
      try {
        console.log("[EVENT] fetching event", id);
        const ref = doc(db, "events", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as EventData;
          console.log("[EVENT] event data:", data);
          setEvent(data);

          if (data.quotas && data.quotas.length > 0 && selectedQuotaId === "other") {
            setSelectedQuotaId(data.quotas[0].id);
          }
        } else {
          console.warn("[EVENT] event not found");
          setEvent(null);
        }
      } catch (err) {
        console.error("[EVENT] Error fetching event:", err);
        setEvent({
          title: "Erreur de chargement",
          address: "—",
          date: "—",
          quotas: [],
        });
      }
    }

    fetchEvent();
  }, [id, selectedQuotaId]);

  // 🟠 2. Écouter en temps réel les items de cette soirée
  useEffect(() => {
    if (!id) return;

    const itemsRef = collection(db, "events", id, "items");
    const q = query(itemsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list: ItemData[] = [];
      snapshot.forEach((docu) => {
        const data = docu.data() as Omit<ItemData, "id">;
        list.push({
          id: docu.id,
          ...data,
        });
      });
      setItems(list);
      setLoadingItems(false);
    });

    return () => unsub();
  }, [id]);

  // 🔍 calcul de la suggestion "ce qu'il manque" (retourne soit un objet, soit null)
  const suggestion = event?.quotas
    ? computeSuggestion(event.quotas, items)
    : null;

  // 🟠 3. Ajouter un élément
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!itemValue.trim()) return;
    if (!userId) return;

    const finalName = itemName.trim() === "" ? "Anonyme" : itemName.trim();

    try {
      setAdding(true);

      const quotaIdToSave =
        !event?.quotas || event.quotas.length === 0
          ? null
          : selectedQuotaId === "other"
          ? null
          : selectedQuotaId;

      await addDoc(collection(db, "events", id, "items"), {
        name: finalName,
        item: itemValue.trim(),
        createdAt: serverTimestamp(),
        userId,
        quotaId: quotaIdToSave,
      });

      setItemValue("");
    } catch (err) {
      console.error("Erreur ajout d'item :", err);
    } finally {
      setAdding(false);
    }
  };

  // 🟠 4. Supprimer un élément (protégé par userId local)
  const handleDeleteItem = async (itemId: string, itemUserId?: string) => {
    if (!id) return;

    if (itemUserId && userId && itemUserId !== userId) {
      alert("Tu ne peux pas supprimer un élément ajouté par quelqu’un d’autre !");
      return;
    }

    const ok = confirm("Supprimer cet élément ?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "events", id, "items", itemId));
    } catch (err) {
      console.error("Erreur suppression item :", err);
    }
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
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-orange-50 to-slate-100 p-6 space-y-4">
      {/* carte principale */}
      <div className="bg-orange-100 rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-4">
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

      {/* bulle "ramène ce qu'il manque" */}
      {event.quotas && event.quotas.length > 0 && (
        <div className="w-full max-w-md rounded-2xl bg-orange-50 border border-orange-100 px-4 py-3 text-sm flex gap-3 shadow-sm">
          <span className="text-lg">💡</span>
          <div>
            <p className="font-medium text-slate-800">
              Ramène ce qu’il manque, on en a besoin !
            </p>
            {suggestion && (
              <p className="text-xs text-orange-800 mt-1">
                Pour l’instant il manque surtout :{" "}
                <span className="font-semibold">{suggestion.label}</span>{" "}
                (objectif {suggestion.quota}% • actuel {suggestion.current}%).
              </p>
            )}
          </div>
        </div>
      )}

      {/* barre de progression des quotas */}
      {event.quotas && event.quotas.length > 0 && (
        <QuotaProgress quotas={event.quotas} items={items} />
      )}

      {/* table visuelle */}
      <TableVisual quotas={event.quotas} items={items} />

      {/* bloc ajout d'élément */}
      <div className="w-full max-w-md bg-orange-100 backdrop-blur rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">
          Ajouter ce que je ramène 🧃
        </h2>

        {event.quotas && event.quotas.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">
              Catégorie
            </label>
            <select
              value={selectedQuotaId}
              onChange={(e) => setSelectedQuotaId(e.target.value)}
              className="w-full border text-slate-800 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              {event.quotas.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
              <option value="other">Autre</option>
            </select>
          </div>
        )}

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
            disabled={adding || !userId}
            className="w-full bg-orange-300 hover:bg-orange-400 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {adding ? "Ajout..." : "Ajouter"}
          </button>
        </form>
      </div>

      {/* liste des éléments */}
      <div className="w-full max-w-md mt-2 bg-orange-100 rounded-2xl shadow-sm p-4">
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
            {items.map((it) => {
              const quotaLabel =
                it.quotaId &&
                event.quotas &&
                event.quotas.find((q) => q.id === it.quotaId)?.label;

              return (
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
                      {quotaLabel && (
                        <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700">
                          {quotaLabel}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(it.id, it.userId)}
                    className="text-slate-400 hover:text-red-500 text-sm"
                    title="Supprimer"
                  >
                    ❌
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

/* ---------- logique quotas & UI ---------- */

// retourne soit un objet { label, quota, current }, soit null
function computeSuggestion(quotas: QuotaItem[], items: ItemData[]) {
  if (!quotas || quotas.length === 0) return null;

  const totalItems = items.length;

  // si aucun item, on propose la catégorie avec le plus gros quota
  if (totalItems === 0) {
    const sorted = [...quotas].sort((a, b) => b.percent - a.percent);
    const best = sorted[0];
    return {
      quotaId: best.id,
      label: best.label,
      quota: best.percent,
      current: 0,
      delta: best.percent,
    };
  }

  const counts: Record<string, number> = {};
  for (const q of quotas) counts[q.id] = 0;

  for (const it of items) {
    if (it.quotaId && counts[it.quotaId] !== undefined) {
      counts[it.quotaId] += 1;
    }
  }

  const currentPercentByQuota: Record<string, number> = {};
  for (const q of quotas) {
    const count = counts[q.id] || 0;
    currentPercentByQuota[q.id] = Math.round((count / totalItems) * 100);
  }

  const deltas = quotas.map((q) => {
    const current = currentPercentByQuota[q.id] || 0;
    return {
      quotaId: q.id,
      label: q.label,
      quota: q.percent,
      current,
      delta: q.percent - current,
    };
  });

  const missing = deltas.filter((d) => d.delta > 0);
  if (missing.length === 0) return null;

  missing.sort((a, b) => b.delta - a.delta);
  return missing[0];
}

/* Mapping texte -> icône */

function getIconForQuotaLabel(label: string): string {
  const lower = label.toLowerCase();

  if (lower.includes("soft") || lower.includes("Soft") || lower.includes("diluant")) {
    return "/icons/soft.png";
  }

  if (lower.includes("vin blanc") || lower.includes("vin")) {
    return "/icons/vin_blanc.png";
  }

  if (lower.includes("bière") || lower.includes("biere") || lower.includes("pack")) {
    return "/icons/pack_bieres.png";
  }

  if (lower.includes("vin rouge")) {
    return "/icons/vin_rouge.png";
  }

  if (lower.includes("alcool") || lower.includes("rhum") || lower.includes("gin") || lower.includes("vodka")) {
    return "/icons/alcool_fort.png";
  }

  if (lower.includes("apéro") || lower.includes("apero") || lower.includes("chips") || lower.includes("snack") || lower.includes("tapas")) {
    return "/icons/chips.png";
  }

  if (lower.includes("pizza") || lower.includes("pizz")) {
    return "/icons/pizza.png";
  }

  return "/icons/other.png";
}

/* Table visuelle : image de base + PNG par-dessus */

type TableVisualProps = {
  quotas?: QuotaItem[];
  items: ItemData[];
};

const TABLE_POSITIONS = [
  { x: 20, y: 30 },
  { x: 40, y: 25 },
  { x: 60, y: 30 },
  { x: 80, y: 35 },
  { x: 25, y: 55 },
  { x: 45, y: 50 },
  { x: 65, y: 55 },
  { x: 35, y: 75 },
  { x: 55, y: 75 },
  { x: 75, y: 65 },
];

function TableVisual({ quotas, items }: TableVisualProps) {
  const visualItems = items.map((item) => {
    let icon = "/icons/other.png";

    if (item.quotaId && quotas && quotas.length > 0) {
      const q = quotas.find((q) => q.id === item.quotaId);
      if (q) {
        icon = getIconForQuotaLabel(q.label);
      }
    }

    return { ...item, icon };
  });

  const hasItems = visualItems.length > 0;

  return (
    <section className="w-full max-w-md rounded-3xl bg-amber-50/70 border border-amber-200 shadow-inner p-4 space-y-3 mt-2">
      <h2 className="text-sm font-semibold text-slate-700">
        La table de la soirée (vue du dessus) 🍽️
      </h2>
      <p className="text-xs text-slate-500">
        Les éléments se placent sur la table au fur et à mesure que les invités ajoutent ce qu’ils ramènent.
      </p>

      <div
        className="relative w-full h-64 rounded-2xl overflow-hidden border border-orange-200 shadow-md bg-cover bg-center"
        style={{ backgroundImage: "url('/table.png')" }}
      >
        {!hasItems && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <p className="text-xs text-slate-200 bg-black/40 px-3 py-1 rounded-full">
              La table est encore vide… Ajoute un truc pour la remplir !
            </p>
          </div>
        )}

        {visualItems.map((item, index) => {
          const pos = TABLE_POSITIONS[index % TABLE_POSITIONS.length];

          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                src={item.icon}
                alt={item.item}
                className="h-10 w-10 object-contain drop-shadow-lg"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* Progression des quotas */

function QuotaProgress({
  quotas,
  items,
}: {
  quotas: QuotaItem[];
  items: ItemData[];
}) {
  const total = items.length || 1;

  const counts: Record<string, number> = {};
  for (const q of quotas) counts[q.id] = 0;
  for (const it of items) {
    if (it.quotaId && counts[it.quotaId] !== undefined) {
      counts[it.quotaId] += 1;
    }
  }

  return (
    <div className="w-full bg-orange-50 max-w-md rounded-2xl border text-orange-700 p-4 shadow-sm space-y-2">
      <h2 className="text-sm font-semibold text-slate-700 mb-1">
        Répartition prévue vs actuelle
      </h2>
      <div className="space-y-2 text-xs">
        {quotas.map((q) => {
          const count = counts[q.id] || 0;
          const currentPercent = Math.round((count / total) * 100);
          const ratio =
            q.percent > 0 ? Math.min(100, (currentPercent / q.percent) * 100) : 0;

          return (
            <div key={q.id} className="space-y-1">
              <div className="flex justify_between">
                <span className="text-slate-700">{q.label}</span>
                <span className="text-slate-500">
                  objectif {q.percent}% • actuel {currentPercent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-orange-400"
                  style={{ width: `${ratio}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
