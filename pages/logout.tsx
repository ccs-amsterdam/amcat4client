import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useMiddlecatContext } from "../amcat4react";
import { MiddlecatContext } from "../amcat4react/context/middlecat";

export default function LogoutPage() {
  const router = useRouter();
  const { user } = useMiddlecatContext();

  useEffect(() => {
    console.log(user);
    if (user) user.killSession(true).then(() => router.push("/"));
  }, [user]);

  return <></>;
}
