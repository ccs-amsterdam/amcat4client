"use client";

import { useApiKeys } from "@/api/api_keys";
import useLocalStorage from "@/lib/useLocalStorage";
import { useMiddlecat } from "middlecat-react";

export default function Page() {
  const { user } = useMiddlecat();
  const { data } = useApiKeys(user);

  return <div className="mx-auto mt-12 w-full max-w-7xl px-6 py-6"></div>;
}
