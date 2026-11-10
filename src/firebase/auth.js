import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config";

// Convert username to internal identity
const INTERNAL_DOMAIN = "@uin.ai";

export function usernameToAuthId(username) {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
  if (!clean || clean.length < 3) {
    throw new Error("Username minimal 3 karakter (huruf, angka, strip, atau garis bawah).");
  }
  return `${clean}${INTERNAL_DOMAIN}`;
}

export async function loginWithUsername(username, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase belum siap.");
  }
  const email = usernameToAuthId(username);
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithUsername(username, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase belum siap.");
  }
  const cleanName = username.trim();
  const email = usernameToAuthId(cleanName);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (cred.user) {
    await updateProfile(cred.user, { displayName: cleanName });
  }
  return cred;
}

export async function logoutUser() {
  if (!auth) return;
  return await signOut(auth);
}

export function onAuthChange(callback) {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
