import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./config";

export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase belum dikonfigurasi. Silakan masukkan Firebase Config di pengaturan.");
  }
  return await signInWithPopup(auth, googleProvider);
}

export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase belum dikonfigurasi.");
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password, displayName) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase belum dikonfigurasi.");
  }
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && cred.user) {
    await updateProfile(cred.user, { displayName });
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

