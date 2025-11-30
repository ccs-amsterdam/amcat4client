import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { Axios } from "axios";
import AxiosWithAuth from "./axiosWithAuth";
import { toast } from "sonner";

export interface AmcatSessionUser {
  email?: string;
  name?: string;
  image?: string;
  authenticated: boolean;
  api: Axios;
}

export interface SessionData {
  email: string;
  name: string;
  access_token: string;
  csrf_token: string;
  exp: number;
}

export interface AmcatSession {
  user: AmcatSessionUser | undefined;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const loadingSession: AmcatSession = {
  user: undefined,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
};

const SessionContext = createContext<AmcatSession>(loadingSession);

export function AuthSessionProvider({
  children,
  sessionData: initialSession,
}: {
  children: ReactNode;
  sessionData: SessionData | null;
}) {
  const { user, signIn, signOut } = useSessionManager(initialSession);

  const session = {
    user: user || undefined,
    loading: !user,
    signIn,
    signOut,
  };

  return <SessionContext.Provider value={session || loadingSession}>{children}</SessionContext.Provider>;
}

function useSessionManager(sessionData: SessionData | null) {
  const [session, setSession] = useState<SessionData | null>(sessionData);
  const router = useRouter();

  const signIn = useCallback(async () => {
    router.push("/auth/login");
  }, []);

  const signOut = useCallback(async () => {
    if (!session) return;
    axios
      .post("/auth/logout", {}, { headers: { "X-CSRF-TOKEN": session.csrf_token } })
      .then((res) => {
        if (res.data.logout_url) {
          window.location.href = res.data.logout_url;
        } else {
          setSession(null);
        }
      })
      .catch(() => {
        toast.error("Failed to log out properly.");
      });
  }, [session]);

  const user: AmcatSessionUser = useMemo(() => {
    const api = AxiosWithAuth(session, signOut);
    if (!session) return { authenticated: false, api };
    return {
      authenticated: true,
      email: session.email,
      name: session.name,
      api,
    };
  }, [session, signOut]);

  return { user, signIn, signOut };
}

export const useAmcatSession = () => useContext(SessionContext);
