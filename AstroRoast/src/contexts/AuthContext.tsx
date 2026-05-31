import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { setAppIcon } from "../lib/iconManager";
import { initializeIconManager } from "../lib/iconManager";
import {
  registerForPushNotificationsAsync,
  syncPushToken,
} from "../lib/notifications";

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
    initializeIconManager();

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) {
          return;
        }

        setSession(session);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setSession(null);
        setLoading(false);
        // If a session exists, sync the push token with the backend
        if (session?.user) {
          syncPushToken(session.user.id);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);

      if (
        session?.user &&
        (_event === "SIGNED_IN" || _event === "TOKEN_REFRESHED")
      ) {
        syncPushToken(session.user.id);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // remove push token from the backend on signout to prevent sending notifications to signed-out users
    if (session?.user) {
      await supabase
        .from("profiles")
        .update({ expo_push_token: null })
        .eq("id", session.user.id);
    }
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
