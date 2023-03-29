import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMiddlecatContext } from "../amcat4react";

export default function LogoutPage() {
  const router = useRouter();
  const { user } = useMiddlecatContext();

  useEffect(() => {
    console.log(user);
    if (user) user.killSession(true).then(() => router.push("/"));
  }, [user, router]);

  return <></>;
}
