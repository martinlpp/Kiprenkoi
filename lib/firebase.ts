// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

console.log("[FIREBASE] env projectId =", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);


// Configuration Firebase (copie ce que Firebase t’a donné)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};



if (typeof window !== "undefined") {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn("❌ Firebase mal configuré :", firebaseConfig);
  }
}

// ✅ Ce bloc évite que Next.js réinitialise Firebase plusieurs fois
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ On récupère la base de données Firestore
export const db = getFirestore(app);
