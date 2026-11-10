import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Official Project Firebase Configuration
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: atob("QUl6YVN5REhVNm1zVDFBMTJzREh0MG8tODgzdGMzYWhWNGhCbzBB"),
  authDomain: "uin-ai-assistant.firebaseapp.com",
  projectId: "uin-ai-assistant",
  storageBucket: "uin-ai-assistant.firebasestorage.app",
  messagingSenderId: "695424369955",
  appId: "1:695424369955:web:b05df66104d20dee6cf896"
};

// Default / Env Configuration
export function getFirebaseConfig() {
  const localConfigStr = localStorage.getItem("uin_firebase_config");
  if (localConfigStr) {
    try {
      const parsed = JSON.parse(localConfigStr);
      if (parsed.apiKey && parsed.projectId) return parsed;
    } catch (_) {}
  }

  // Fallback to Vite environment variables or default project config
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId
  };
}

const config = getFirebaseConfig();
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.error("Firebase init error:", err);
  }
}

export { app, auth, db, googleProvider };
