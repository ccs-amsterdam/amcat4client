import { useRouter } from "next/router";
import { AmcatUser, useMiddlecatContext } from "../amcat4react";

export default function useUser(): AmcatUser | undefined {
  const router = useRouter();
  const host = router.query.host as string;
  const { user } = useMiddlecatContext(host);
  return user;
}
