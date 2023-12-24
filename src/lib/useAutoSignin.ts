import { useAmcatConfig } from "@/api/config";
import { useMiddlecat } from "middlecat-react";
import { useEffect } from "react";

export default function useAutoSignin() {
  const { data: config } = useAmcatConfig();
  const { user, signInGuest, loading } = useMiddlecat();

  useEffect(() => {
    if (!config || loading || user) return;
    signInGuest(config.resource, config.middlecat_url);
  }, [config, loading, user]);
}
