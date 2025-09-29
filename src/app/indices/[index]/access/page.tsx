"use client";

import { useIndex } from "@/api/index";
import { useMutateIndexUser } from "@/api/indexUsers";
import { useHasGlobalRole } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AmcatIndex } from "@/interfaces";
import { ChevronDown, Crown, HelpCircle, LockKeyholeOpen, Shield } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/components/Index/ContactInfo";
import { RequestRoleChange } from "@/components/Access/RequestRoleChange";

const roles = ["NONE", "METAREADER", "READER", "WRITER", "ADMIN"];

export default function IndexRole() {
  const { user, loading } = useMiddlecat();
  const params = useParams<{ index: string }>();
  const indexId = decodeURI(params?.index || "");
  const { data: index } = useIndex(user, indexId);
  if (loading || !user) return null;
  if (!index) return null;

  return <IndexRoleMenu user={user} index={index} />;
}

interface IndexRoleProps {
  user: MiddlecatUser;
  index: AmcatIndex;
}

function IndexRoleMenu({ user, index }: IndexRoleProps) {
  const [open, setOpen] = useState(false);
  const user_role = index?.user_role || "NONE";
  const isServerAdmin = useHasGlobalRole(user, "ADMIN");

  function myRole() {
    if (user_role === "NONE") return <span>you do not have access to this index</span>;
    return (
      <span>
        You have the <b>{user_role}</b> role on this index.
      </span>
    );
  }

  function serverAdminUpdate() {
    if (!isServerAdmin) return <div />;
    return (
      <div className="flex h-max items-center justify-start gap-3 rounded-md bg-secondary/20 px-3 py-1">
        <Crown className="text-secondary" />
        <span className="text-sm">Use server admin privilege</span>
        <div className="ml-auto text-nowrap">
          <IndexMenuServerAdmin user={user} index={index} />
        </div>
      </div>
    );
  }

  function requestRoleChange() {
    // if (index?.user_role === "ADMIN") return null;
    return (
      <RequestRoleChange
        user={user}
        roles={roles}
        currentRole={index?.user_role}
        index={index}
        onSend={() => setOpen(false)}
      />
    );
  }

  function pointsOfContact() {
    if (index?.contact)
      return (
        <div className=" mt-6  max-w-xl items-center gap-3 rounded-md">
          <div className="p-3">
            <div className="text-lg font-bold">Contact information</div>
            <div className="text-sm">
              For other questions or comments about the accessibility of data in this index, you can reach out to:
            </div>
          </div>
          <div className="items-center rounded-md  p-3 text-sm ">
            <ContactInfo contact={index?.contact} />
          </div>
        </div>
      );
  }

  return (
    <div className="mt-0 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 gap-y-[5vh] lg:grid-cols-2">
        <div className="mb-12 flex items-center gap-3 py-3">
          {myRole()}
          <RoleInfoDialog />
        </div>
        {serverAdminUpdate()}
        {requestRoleChange()}
        {pointsOfContact()}
      </div>
    </div>
  );
}

function IndexMenuServerAdmin({ user, index }: IndexRoleProps) {
  const { mutate: mutateUser } = useMutateIndexUser(user, index?.id);
  const isAdmin = useHasGlobalRole(user, "ADMIN");
  if (!isAdmin) return null;

  function onChangeRole(role: string | undefined) {
    if (!role) return;
    if (role === "NONE") {
      mutateUser({ email: user.email, role, action: "delete" });
    } else {
      mutateUser({ email: user.email, role, action: "update" });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={!index ? "hidden" : ""}>
        <Button variant="ghost" className="">
          Change role
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" align="end">
        <DropdownMenuRadioGroup
          value={index?.user_role}
          onSelect={(e) => e.preventDefault()}
          onValueChange={onChangeRole}
        >
          {roles.map((role) => {
            return (
              <DropdownMenuRadioItem
                key={role}
                value={role}
                onSelect={(e) => e.preventDefault()}
                disabled={!user.authenticated}
              >
                {role === "NONE" ? `GUEST` : role}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RoleInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <HelpCircle className="cursor-pointer text-primary" />
      </DialogTrigger>
      <DialogContent className="w-[600px] max-w-[95vw]">
        <DialogTitle className="">Index access roles</DialogTitle>
        <DialogDescription className="">There are four access roles with incremental permissions</DialogDescription>
        <RoleInfo />
      </DialogContent>
    </Dialog>
  );
}

export function RoleInfo() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="grid grid-cols-[7rem,1fr] gap-1">
        <b className="text-primary">METAREADER</b>
        Can search documents, but can only view a subset of the contents.
        <b className="text-primary">READER</b>
        Can view all document contents.
        <b className="text-primary">WRITER</b>
        Can upload and modify documents.
        <b className="text-primary">ADMIN</b>
        Can manage index settings and users, and delete data.
      </div>
    </div>
  );
}
