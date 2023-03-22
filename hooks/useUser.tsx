import { useRouter } from "next/router";
import { AmcatUser, useMiddlecatContext } from "../amcat4react";

export default function useUser(): AmcatUser | undefined {
  const router = useRouter();
  const host = decodeHostname(router.query.host as string);
  const { user } = useMiddlecatContext(host);
  return user;
}

export function decodeHostname(host: string) {
  if (host && !/^https?:\/\//.test(host)) {
    const https = !/^localhost[:/]/.test(host);
    host = `http${https ? "s" : ""}://${host}`;
  }
  return host;
}
