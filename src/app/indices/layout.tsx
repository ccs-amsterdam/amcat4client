"use client";
import { useAmcatConfig } from "@/api/config";
import useAmcatIndices from "@/api/indices";
import { useCurrentUserDetails, useMyGlobalRole } from "@/api/userDetails";
import Navbar from "@/components/Menu/Navbar";
import { RequestRoleChange } from "@/components/Menu/RequestRoleChange";
import { RoleInfoDialog } from "@/components/Menu/ServerRole";
import { Button } from "@/components/ui/button";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { LogInIcon } from "lucide-react";
import { useMiddlecat } from "middlecat-react";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = useMiddlecat();
  const { data: config } = useAmcatConfig();
  const { data: userDetails } = useCurrentUserDetails(user);

  if (
    user &&
    !user.authenticated &&
    (config?.authorization === "allow_authenticated_guests" || config?.authorization === "authorized_users_only")
  )
    return <AuthenticatedOnlyServer />;
  if (userDetails && userDetails.role === "NONE" && config?.authorization === "authorized_users_only")
    return <AuthorizedOnlyServer />;

  return (
    <>
      <div className="flex h-full w-full flex-auto flex-col pt-6 md:pt-6">
        <div className="flex justify-center">
          <div className="flex w-full max-w-[1500px] flex-col px-5 py-5 sm:px-10">{children}</div>
        </div>
      </div>
    </>
  );
}

function AuthenticatedOnlyServer({}: {}) {
  const { signIn } = useMiddlecat();

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

function AuthorizedOnlyServer({}: {}) {
  const { user, signIn, loading: loadingUser } = useMiddlecat();
  const { data, isLoading: loadingIndices } = useAmcatIndices(user);
  const [requestSend, setRequestSend] = useState(false);

  const hasIndices = data && data.length > 0;

  function message() {
    if (!user) return;
    if (hasIndices)
      return `You (${user?.email}) have been given a role on an index on this server. However, this server is set up so that all users must first be authorized by a server administrator. Please submit a request to get a server role.`;
    return "All users of this server must be authorized by a server administrator. Please submit a request to get a server role.";
  }

  function requestForm() {
    if (requestSend) return <p className="text-center">Your request has been sent.</p>;
    return (
      <RequestRoleChange
        user={user!}
        roles={["READER", "WRITER", "ADMIN"]}
        currentRole="NONE"
        onSend={() => setRequestSend(true)}
      />
    );
  }

  if (loadingUser || loadingIndices) return <Loading />;

  return (
    <ErrorMsg type="Authorization required">
      <p className="w-[600px] max-w-[90vw] text-center">{message()}</p>
      <div className="mx-auto mt-3">
        <RoleInfoDialog text="Access roles" />
      </div>
      <div className="mt-12 text-primary">{requestForm()}</div>
    </ErrorMsg>
  );
}
