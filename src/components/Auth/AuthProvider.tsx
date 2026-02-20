import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  access_token: string | null;
  csrf_token: string;
  exp: number;
}

export interface AmcatSession {
  user: AmcatSessionUser;
  amcat_url: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<AmcatSession | null>(null);

export function AuthSessionProvider({
  children,
  sessionData,
  amcat_url,
}: {
  children: ReactNode;
  sessionData: SessionData | null;
  amcat_url: string;
}) {
  const [session, setSession] = useState<SessionData | null>(sessionData);
  const csrf_token = useRef<string | null>(sessionData?.csrf_token ?? null);
  const router = useRouter();

  const signIn = useCallback(async () => {
    router.push("/auth/login");
  }, []);

  const signOut = useCallback(async () => {
    try {
      const res = await axios.post("/auth/logout", {}, { headers: { "X-CSRF-TOKEN": csrf_token.current } });
      if (res.data.logout_url) router.push(res.data.logout_url); // OIDC logout
      setSession(null);
    } catch (e) {
      toast.error("An error occurred during logout.");
    }
  }, [router, csrf_token]);

  const user: AmcatSessionUser = useMemo(() => {
    const updateCSRF = (csrf: string) => {
      csrf_token.current = csrf;
    };
    const api = AxiosWithAuth(session, signOut, updateCSRF, amcat_url);
    if (!session) return { authenticated: false, api };
    return {
      authenticated: true,
      email: session.email,
      name: session.name,
      api,
    };
  }, [amcat_url, session, signOut]);

  return (
    <SessionContext.Provider value={{ user, amcat_url: amcat_url, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useAmcatSession = (): AmcatSession => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useAmcatSession must be used within an AuthSessionProvider");
  }
  return context;
};
