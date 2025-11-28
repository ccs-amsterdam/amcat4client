"use client";
import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ErrorMsg } from "@/components/ui/error-message";
import { HelpCircle, LogInIcon } from "lucide-react";
import { useAmcatSession } from "@/components/Auth/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAmcatSession();
  const { data: config } = useAmcatConfig();
  const { data: userDetails } = useCurrentUserDetails(user);

  if (user && !user.authenticated && config?.authorization === "allow_authenticated_guests")
    return <AuthenticatedOnlyServer />;

  return (
    <>
      <div className="flex h-full w-full flex-auto flex-col pt-6 md:pt-6">
        <div className="flex h-full justify-center">
          <div className="flex w-full max-w-[1500px] flex-col px-5 py-5 sm:px-10">{children}</div>
        </div>
      </div>
    </>
  );
}

function AuthenticatedOnlyServer({}: {}) {
  const { signIn } = useAmcatSession();

  return (
    <ErrorMsg type="Sign-in required">
      <p className="w-[500px] max-w-[95vw] text-center">
        This server only allows authenticated users. Please sign-in to access the available indices.
      </p>
      <Button className="mx-auto flex items-center gap-2 pr-6" onClick={() => signIn()}>
        <LogInIcon className="mr-2 h-4 w-4" />
        Sign-in
      </Button>
    </ErrorMsg>
  );
}

function RoleInfoDialog({ text }: { text?: string }) {
  const { data: serverConfig } = useAmcatConfig();
  const has_reader = serverConfig?.authorization === "authorized_users_only";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 text-primary">
          {text || ""}
          <HelpCircle className="cursor-pointer text-primary" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[600px] max-w-[95vw]">
        <DialogTitle className="h-0 w-0 opacity-0">Server access roles</DialogTitle>
        <DialogDescription className="h-0 opacity-0">Description of three server access roles</DialogDescription>
        <div className="mb-2 font-bold text-primary">
          For this server, there are {has_reader ? "three" : "two"} access roles with increasing permissions:
        </div>
        <div className="grid grid-cols-[8rem,1fr] gap-1">
          {!has_reader ? null : (
            <>
              <b className="text-primary">READER</b>
              Has access to existing indices. Within an index the user can be given any role, so a server level READER
              can be a WRITER or ADMIN on a specific index. But they need to be given explicit access to each index.
            </>
          )}
          <b className="text-primary">WRITER</b>
          Can create new indices.
          <b className="text-primary">ADMIN</b>
          Can manage all indices and users.
        </div>
      </DialogContent>
    </Dialog>
  );
}
