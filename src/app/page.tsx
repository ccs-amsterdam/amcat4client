"use client";

import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";

import { useHasGlobalRole } from "@/api/userDetails";
import { useAmcatConfig } from "@/api/config";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import ReactMarkdown from "react-markdown";
import { useAmcatBranding } from "@/api/branding";

export default function Index() {
  const { user, loading, signIn } = useMiddlecat();
  const canCreate = useHasGlobalRole(user, "WRITER");
  const { data: serverConfig } = useAmcatConfig();
  const { data: serverBranding } = useAmcatBranding();
  const router = useRouter();

  if (loading || serverConfig == null || serverBranding == null || user == null) return <Loading />;
  const require_login =
    serverConfig.authorization === "allow_authenticated_guests" ||
    serverConfig.authorization === "authorized_users_only";
  return (
    <div className="flex h-full flex-auto flex-col items-center   p-5">
      <ReactMarkdown>{serverBranding.welcome_text}</ReactMarkdown>
      <div className="m-8 rounded border border-primary p-3">
        {user.authenticated ? (
          <Button onClick={() => router.push("/indices")}>View Indices</Button>
        ) : (
          <>
            <Button onClick={() => signIn()}>Log in</Button>
            &nbsp;
            {require_login ? null : <Button onClick={() => router.push("/indices")}>Continue as Guest</Button>}
          </>
        )}
      </div>
    </div>
  );
}
