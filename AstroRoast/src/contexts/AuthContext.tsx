import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { setAppIcon } from "../lib/iconManager";
import { initializeIconManager } from "../lib/iconManager";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialiser le gestionnaire d'icônes au démarrage
    initializeIconManager();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  },// Réinitialiser l'icône à celle par défaut
    await setAppIcon(null);
     []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
