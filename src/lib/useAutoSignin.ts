import { useAmcatConfig } from "@/api/config";
import { useAmcatSession } from "@/components/Auth/AuthProvider";
import { useEffect } from "react";

export default function useAutoSignin() {
  const { data: config } = useAmcatConfig();
  const { user, signInGuest, loading } = useAmcatSession();

  useEffect(() => {
    if (!config || loading || user) return;
    signInGuest(config.resource, config.middlecat_url);
  }, [config, loading, user]);
}
