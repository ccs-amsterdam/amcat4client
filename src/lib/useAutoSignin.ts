import { useMiddlecat } from "middlecat-react";
import { useEffect } from "react";

export default function useAutoSignin() {
  const { user, signInGuest, loading } = useMiddlecat();

  useEffect(() => {
    if (loading || user) return;
    signInGuest();
  }, [loading, user]);
}
