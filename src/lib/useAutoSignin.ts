import { useMiddlecat } from "middlecat-react";
import { useEffect } from "react";
import { useUrlHost } from "./urlHost";
import { useAmcatConfig } from "@/amcat/api/config";

export default function useAutoSignin() {
  const { user, signIn, signOut, signInGuest, loading } = useMiddlecat();
  const host = useUrlHost();
  const { data: config } = useAmcatConfig(host);

  useEffect(() => {
    // if there is a host (which means we're on a path that includes a host),
    // but no user, we need to sign in. In this case we always sign in as guest first.
    if (loading || !host || !config || user) return;
    const authDisabled = config.authorization === "no_auth";
    signInGuest(host, authDisabled);
  }, [loading, user, host, config]);

  useEffect(() => {
    // If user is signed in to a different host, we need to sign them out first.
    // In this case we will automatically trigger a middlecat sign in (not as guest)
    if (loading || !user?.authenticated || !config || !host) return;
    if (user.resource === host) return;
    if (config.authorization === "no_auth") return;

    // If this is on a different middlecat server, we sign them out of middlecat.
    // If it's on the same middlecat server, we only sign them out of the current host,
    // and immediately ask them to sign in to the new server.
    if (user.middlecat === config.middlecat_url) {
      signOut(false).then(() => signIn(host, config.middlecat_url));
    } else {
      signOut(true).then(() => signIn(host, config.middlecat_url));
    }
  }, [host, user, config, loading]);
}
