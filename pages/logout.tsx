import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMiddlecat } from "middlecat-react";

export default function LogoutPage() {
  const router = useRouter();
  const { user } = useMiddlecat();

  useEffect(() => {
    if (user) user.killSession(true).then(() => router.push("/"));
  }, [user, router]);

  return <></>;
}
