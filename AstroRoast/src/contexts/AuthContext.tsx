import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { initializeIconManager } from "../lib/iconManager";
import { syncPushToken } from "../lib/notifications";

const isWeb =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  "serviceWorker" in navigator;

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
        // If a session exists, sync the push token with the backend
        if (session?.user) {
          syncPushToken(session.user.id);
          if (isWeb) {
            import("../lib/notificationsWeb")
              .then(({ registerForWebPush }) =>
                registerForWebPush(session.user.id),
              )
              .catch((err) => console.error("registerForWebPush failed:", err));
          }
        }
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setSession(null);
        setLoading(false);
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
        if (isWeb) {
          import("../lib/notificationsWeb")
            .then(({ registerForWebPush }) =>
              registerForWebPush(session.user.id),
            )
            .catch((err) => console.error("registerForWebPush failed:", err));
        }
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
    if (isWeb && session?.user) {
      try {
        const { cleanUpWebPushSubscriptions } =
          await import("../lib/notificationsWeb");
        await cleanUpWebPushSubscriptions();
      } catch (err) {
        console.error("cleanUpWebPushSubscriptions failed:", err);
      }
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
