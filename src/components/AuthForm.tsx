"use client";

import React from "react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { Button } from "./ui/button";
import { Loading } from "./ui/loading";
import { useAmcatConfig } from "@/amcat/api/config";
import { useUrlHost } from "@/lib/urlHost";

export default function AuthForm() {
  const { user, loading: loadingUser, signIn, signOut, fixedResource } = useMiddlecat();
  const host = useUrlHost();
  const { data: config, isLoading: loadingConfig } = useAmcatConfig(host);

  const signInButton = <Button onClick={() => signIn(fixedResource || "")}>Sign in</Button>;
  const signOutButton = <Button onClick={() => signOut(true)}>Sign out</Button>;

  function render() {
    if (loadingUser || loadingConfig) return <Loading />;

    if (config?.authorization === "no_auth") {
      return <p>Authorization is disabled on this server. Anyone can do anything</p>;
    }

    if (config?.authorization === "authorized_users_only") {
      if (!user?.authenticated)
        return (
          <div>
            <p>You need to be signed-in to use this server</p>
            {signInButton}
          </div>
        );
    }

    if (config?.authorization === "allow_guests") {
      if (!user?.authenticated)
        return (
          <div>
            <p>You can sign in to use this server</p>
            {signInButton}
          </div>
        );
    }

    if (user?.authenticated) {
      return (
        <div className="flex flex-col gap-3">
          <div className="fill-background-inversed-fixed flex items-center gap-3">
            <img src={user.image} alt="profile" className="h-7 w-7 rounded" referrerPolicy="no-referrer" />
            {user.name || user.email}
          </div>
          {signOutButton}
        </div>
      );
    }
  }

  return <div className="flex flex-col gap-3">{render()}</div>;

  return <Button onClick={() => signIn(fixedResource || "")}>Sign in</Button>;
}
