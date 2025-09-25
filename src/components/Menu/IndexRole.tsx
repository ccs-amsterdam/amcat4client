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
import { ChevronDown, Crown, HelpCircle, Shield } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { ContactInfo } from "../Index/ContactInfo";
import { RequestRoleChange } from "./RequestRoleChange";

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
    if (!isServerAdmin) return null;
    return (
      <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-secondary/20 p-3">
        <Crown className="text-secondary" />
        <span className="text-sm">As server admin you can change your own role</span>
        <IndexMenuServerAdmin user={user} index={index} />
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
        <div className=" mt-6 grid grid-cols-1 items-center gap-3 rounded-md  md:grid-cols-[1fr,1fr]">
          <div className="p-3">
            <div className="text-lg font-bold">Contact information</div>
            <div className="text-sm">For other questions or comments about data access, please reach out to:</div>
          </div>
          <div className="items-center rounded-md  p-3 text-sm ">
            <ContactInfo contact={index?.contact} />
          </div>
        </div>
      );
  }

  const role = index?.user_role === "NONE" ? "ACCESS" : index?.user_role;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-full select-none items-center gap-3 border-primary px-1 outline-none hover:bg-foreground/10 lg:px-4">
        <Shield />
        <span className="hidden lg:inline">{role}</span>
      </DialogTrigger>
      <DialogContent className="prose max-h-[90vh] w-[700px] max-w-[95vw] items-start py-6 dark:prose-invert">
        <DialogHeader>
          <DialogTitle className="mt-0">Index access role</DialogTitle>
          <DialogDescription className="h-0 opacity-0">
            Your role for this index is <strong>{user_role}</strong>.{" "}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-0 flex flex-col gap-3">
          <div className="mb-6 text-lg">
            <div className="flex items-center gap-3">
              {myRole()}

              <RoleInfoDialog />
            </div>
          </div>

          {requestRoleChange()}
          {serverAdminUpdate()}

          {pointsOfContact()}
        </div>
      </DialogContent>
    </Dialog>
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
        <DialogTitle className="h-0 w-0 opacity-0">Index access roles</DialogTitle>
        <DialogDescription className="h-0 opacity-0">Description of four access roles</DialogDescription>
        <div className="mb-2 font-bold text-primary">There are four access roles with incremental permissions:</div>
        <div className="grid grid-cols-[8rem,1fr] gap-1">
          <b className="text-primary">METAREADER</b>
          Can search documents, but can only view a subset of the contents.
          <b className="text-primary">READER</b>
          Can view all document contents.
          <b className="text-primary">WRITER</b>
          Can upload and modify documents.
          <b className="text-primary">ADMIN</b>
          Can manage index settings and users, and delete data.
        </div>
      </DialogContent>
    </Dialog>
  );
}
