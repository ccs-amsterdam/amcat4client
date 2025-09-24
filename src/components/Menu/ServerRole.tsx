import { useCurrentUserDetails } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AmcatConfig, AmcatUserDetails } from "@/interfaces";
import { ChevronDown, Shield } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useSubmitRequest } from "@/api/requests";
import { amcatUserRoleSchema } from "@/schemas";
import { useAmcatConfig } from "@/api/config";

const roles = ["NONE", "READER", "WRITER", "ADMIN"];

export function ServerRoleDropdownItem({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          setOpen(true);
        }}
      >
        <Shield className="mr-2 h-4 w-4" />
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
        <ServerRoleModalContent user={user} userDetails={userDetails} config={config} />
      </DialogContent>
    </Dialog>
  );
}

interface ServerRoleProps {
  user: MiddlecatUser;
  userDetails: AmcatUserDetails;
  config: AmcatConfig;
}

function ServerRoleModalContent({ user, userDetails, config }: ServerRoleProps) {
  const user_role = userDetails.role;
  const isServerAdmin = user_role === "ADMIN";

  function myRole() {
    const guestRole = config.authorization === "authorized_users_only" ? "NONE" : "READER";
    const role = user_role || guestRole;
    if (role === "NONE") return <span>you are not have a server level access role</span>;
    return (
      <span>
        You have the <b>{role}</b> role on this server.
      </span>
    );
  }

  function requestRoleChange() {
    // if (user_role === "ADMIN") return null;
    return <RequestRoleChange user={user} userDetails={userDetails} config={config} />;
  }

  return (
    <div className="mt-0 flex flex-col">
      <div className="mb-6 text-lg">{myRole()}</div>

      <div className="rounded-md bg-primary/10 p-3">
        <div className="mb-2 font-bold text-primary">There are three access roles with increasing permissions:</div>
        <div className="grid grid-cols-[8rem,1fr]">
          <b className="text-primary">READER</b>
          Can use existing indices.
          <b className="text-primary">WRITER</b>
          Can create and own indices.
          <b className="text-primary">ADMIN</b>
          Can manage all indices and users.
        </div>
      </div>

      {requestRoleChange()}
    </div>
  );
}

function RequestRoleChange({ user, userDetails }: ServerRoleProps) {
  const { mutate: submitRequest } = useSubmitRequest(user);
  const [role, setRole] = useState<string | undefined>(undefined);

  function onSubmit(role: string | undefined) {
    if (!role) return;
    submitRequest({ role: amcatUserRoleSchema.parse(role) });
  }

  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-primary p-3 text-primary-foreground">
      <div className="font-bold">Request role</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="ml-auto">
            {role || "Select role"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="end">
          <DropdownMenuRadioGroup
            value={role || userDetails.role}
            onSelect={(e) => e.preventDefault()}
            onValueChange={(value) => setRole(value)}
          >
            {roles.map((role) => {
              if (userDetails.role === "NONE" && role === "NONE") return null;
              return (
                <DropdownMenuRadioItem
                  key={role}
                  value={role}
                  disabled={role === userDetails.role}
                  onSelect={(e) => e.preventDefault()}
                >
                  {role === "NONE" ? `delete role` : role}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        className="bg-transparent"
        disabled={!role || role === userDetails.role}
        onClick={() => onSubmit(role)}
      >
        Send request
      </Button>
    </div>
  );
}
