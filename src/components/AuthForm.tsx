"use client";

import React from "react";
import { useMiddlecat } from "middlecat-react";
import { Button } from "./ui/button";

export default function AuthForm() {
  const { user, loading, signIn, signOut, fixedResource } = useMiddlecat();

  if (loading) return null;

  if (user?.email)
    return (
      <div className="flex flex-col gap-3">
        <div className="fill-background-inversed-fixed flex items-center gap-3">
          <img src={user.image} alt="profile" className="h-7 w-7 rounded" referrerPolicy="no-referrer" />
          {user.name || user.email}
        </div>
        <Button className="ml-auto mt-10" onClick={() => signOut(true)}>
          Sign out
        </Button>
      </div>
    );

  return <Button onClick={() => signIn(fixedResource || "")}>Sign in</Button>;
}
