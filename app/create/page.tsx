"use client";

import { FormEvent, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

type QuotaItem = {
  id: string;
  label: string;
  percent: number;
};

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enableQuotas, setEnableQuotas] = useState(false);
  const [quotas, setQuotas] = useState<QuotaItem[]>([
    { id: "q1", label: "Alcool fort",    percent: 30 },
    { id: "q2", label: "Apéro",          percent: 20 },
    { id: "q3", label: "Soft", percent: 50 },
  ]);

  const router = useRouter();

  function genId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }

  function handleQuotaChange(
    id: string,
    field: "label" | "percent",
    value: string
  ) {
    setQuotas((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              [field]: field === "percent" ? Number(value) || 0 : value,
            }
          : q
      )
    );
  }

  function handleAddQuota() {
    setQuotas((prev) => [
      ...prev,
      {
        id: genId(),
        label: "",
        percent: 0,
      },
    ]);
  }

  function handleRemoveQuota(id: string) {
    setQuotas((prev) => prev.filter((q) => q.id !== id));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("[CREATE] submit start");

      let quotasToSave: QuotaItem[] | null = null;

      if (enableQuotas) {
        const cleaned = quotas
          .filter((q) => q.label.trim() !== "")
          .map((q) => ({ ...q, percent: Number(q.percent) || 0 }));

        if (cleaned.length > 0) {
          const total = cleaned.reduce((sum, q) => sum + q.percent, 0);
          console.log("[CREATE] quotas raw:", cleaned, "total:", total);

          if (total > 0) {
            quotasToSave = cleaned.map((q) => ({
              ...q,
              percent: Math.round((q.percent / total) * 100),
            }));
          }
        }
      }

      console.log("[CREATE] quotasToSave:", quotasToSave);

      const docRef = await addDoc(collection(db, "events"), {
        title,
        address,
        date,
        createdAt: serverTimestamp(),
        quotas: quotasToSave,
      });

      console.log("[CREATE] event created, id:", docRef.id);

      router.push(`/event/${docRef.id}`);
    } catch (err) {
      console.error("[CREATE] Erreur lors de la création :", err);
      setError("Oups, impossible de créer la soirée. Vérifie la console.");
    } finally {
      // même si on est redirigé, ça évite le bouton bloqué si la page event crash
      setLoading(false);
    }
  }

  const totalPercent = quotas.reduce(
    (sum, q) => sum + (Number(q.percent) || 0),
    0
  );

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
            className="mt-1 w-full rounded-lg text-slate-800 border border-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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

        {/* Quotas */}
        <div className="bg-orange-100 border border-orange-300 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Quotas par catégorie (optionnel)
              </p>
              <p className="text-xs text-slate-500">
                Exemple : <span className="underline">alcool fort</span>,{" "}
                <span className="underline">apéro</span>,{" "}
                <span className="underline">Soft</span>…
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEnableQuotas((v) => !v)}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition ${
                enableQuotas
                  ? "bg-orange-100 border-orange-300 text-orange-700"
                  : "bg-slate-100 border-slate-300 text-slate-600"
              }`}
            >
              {enableQuotas ? "Activés ✅" : "Désactivés"}
            </button>
          </div>

          {enableQuotas && (
            <div className="space-y-2">
              {quotas.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center gap-2 bg-slate-50/80 rounded-xl px-3 py-2"
                >
                  <input
                    type="text"
                    placeholder="Ex: alcool fort, apéro, gâteau…"
                    value={q.label}
                    onChange={(e) =>
                      handleQuotaChange(q.id, "label", e.target.value)
                    }
                    className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={q.percent}
                    onChange={(e) =>
                      handleQuotaChange(q.id, "percent", e.target.value)
                    }
                    className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs text-right text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <span className="text-xs text-slate-500">%</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuota(q.id)}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddQuota}
                className="text-xs text-orange-600 hover:underline"
              >
                + Ajouter une catégorie
              </button>

              <p className="text-xs text-slate-500">
                Total saisi : {totalPercent}%. (On ajustera pour faire 100%
                lors de la création.)
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-300 hover:bg-orange-400 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Création..." : "Créer la soirée"}
        </button>
      </form>
    </main>
  );
}
