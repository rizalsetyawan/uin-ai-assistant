import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, loginWithGoogle, loginWithEmail, registerWithEmail, logoutUser } from "../firebase/auth";
import { isFirebaseConfigured, getFirebaseConfig } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(isFirebaseConfigured);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const reloadFirebaseConfig = () => {
    const cfg = getFirebaseConfig();
    const ready = Boolean(cfg.apiKey && cfg.projectId);
    setIsConfigured(ready);
    if (ready) {
      window.location.reload();
    }
  };

  const value = {
    user,
    loading,
    isConfigured,
    reloadFirebaseConfig,
    loginGoogle: loginWithGoogle,
    loginEmail: loginWithEmail,
    signupEmail: registerWithEmail,
    logout: logoutUser,
    showAuthModal,
    openAuthModal: () => setShowAuthModal(true),
    closeAuthModal: () => setShowAuthModal(false),
    showFirebaseModal,
    openFirebaseModal: () => setShowFirebaseModal(true),
    closeFirebaseModal: () => setShowFirebaseModal(false)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

