import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { Axios } from "axios";
import AxiosWithAuth from "./axiosWithAuth";

export interface AmcatSessionUser {
  email: string;
  name?: string;
  image?: string;
  authenticated: boolean;
  api: Axios;
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

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const { user, startSession, startGuestSession, signIn, signOut } = useSessionManager();

  useEffect(() => {
    startSession().catch(startGuestSession);
  }, []);

  const session = {
    user: user || undefined,
    loading: !user,
    signIn,
    signOut,
  };

  return <SessionContext.Provider value={session || loadingSession}>{children}</SessionContext.Provider>;
}

function useSessionManager() {
  const router = useRouter();
  const [user, setUser] = useState<AmcatSessionUser | null>(null);

  const startGuestSession = useCallback(() => {
    setUser({
      authenticated: false,
      email: "",
      name: "",
      api: AxiosWithAuth(),
    });
  }, []);

  const signIn = useCallback(async () => {
    router.push("/auth/login");
  }, []);

  const signOut = useCallback(async () => {
    router.push("/auth/logout");
    startGuestSession();
  }, [startGuestSession]);

  const startSession = useCallback(async () => {
    const res = await axios.get("/auth/session");
    const data = await res.data;

    setUser({
      authenticated: data.userInfo?.sub ? true : false,
      email: data.userInfo?.email || "",
      name: data.userInfo?.name || "",
      api: AxiosWithAuth({ access_token: data.access_token, exp: data.exp }, signOut),
    });
  }, []);

  return { user, startGuestSession, startSession, signIn, signOut };
}

export const useAmcatSession = () => useContext(SessionContext);
