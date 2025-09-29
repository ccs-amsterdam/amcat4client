import { useAmcatConfig } from "@/api/config";
import { useCurrentUserDetails } from "@/api/userDetails";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AmcatConfig, AmcatUserDetails } from "@/interfaces";
import { HelpCircle, LockKeyholeOpenIcon, Shield } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { RequestRoleChange } from "../Access/RequestRoleChange";

const roles = ["NONE", "READER", "WRITER", "ADMIN"];

export function ServerRoleDropdownItem({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          setOpen(true);
        }}
      >
        <LockKeyholeOpenIcon className="mr-2 h-4 w-4" />
        Access role
      </DropdownMenuItem>
    </>
  );
}

export function ServerRole({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const { data: userDetails, isLoading: userDetailsLoading } = useCurrentUserDetails(user);
  const { data: config, isLoading: configLoading } = useAmcatConfig();
  if (loading || !user || userDetailsLoading || configLoading) return null;
  console.log({ userDetails, user, config });
  if (!userDetails || !user || !config) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="prose max-h-[90vh] w-[700px] max-w-[95vw] items-start py-6 dark:prose-invert">
        <DialogHeader>
          <DialogTitle className="mt-0">Server access role</DialogTitle>
          <DialogDescription className="h-0 opacity-0">
            Your role for this index is <strong>{userDetails.role}</strong>.{" "}
          </DialogDescription>
        </DialogHeader>
        <ServerRoleModalContent user={user} userDetails={userDetails} config={config} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

interface ServerRoleProps {
  user: MiddlecatUser;
  userDetails: AmcatUserDetails;
  config: AmcatConfig;
  close: () => void;
}

function ServerRoleModalContent({ user, userDetails, config, close }: ServerRoleProps) {
  const role = userDetails.role;

  function myRole() {
    if (role === "NONE")
      return (
        <div className="flex items-center gap-2">
          You do not have a server level access role. <RoleInfoDialog />
        </div>
      );
    return (
      <div className="flex items-center gap-2">
        You have the <b>{role}</b> role on this server.
        <RoleInfoDialog />
      </div>
    );
  }

  function requestRoleChange() {
    return <RequestRoleChange user={user} roles={roles} currentRole={role} onSend={close} />;
  }

  return (
    <div className="mt-0 flex flex-col gap-3">
      <div className="mb-6 text-lg">{myRole()}</div>

      {requestRoleChange()}
    </div>
  );
}

export function RoleInfoDialog({ text }: { text?: string }) {
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
