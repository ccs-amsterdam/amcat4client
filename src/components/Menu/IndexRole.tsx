"use client";

import { useIndex } from "@/api/index";
import { useMutateIndexUser } from "@/api/indexUsers";
import { useHasGlobalRole } from "@/api/userDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AmcatIndex } from "@/interfaces";
import { ChevronDown, Lock, Shield, User } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";

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

function IndexRoleMenu({ user, index }: { user: MiddlecatUser; index?: AmcatIndex }) {
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

  function upgradeRole() {
    if (isServerAdmin)
      return (
        <div className="flex flex-col gap-3 rounded-md bg-secondary/20 p-3">
          <span className="font-bold">As a server admin, you are allowed to change your own index role:</span>
          <IndexMenuServerAdmin user={user} index={index} />
        </div>
      );

    return (
      <div>
        <p>If you want to request a different role, please contact the index administrator.</p>
      </div>
    );
  }

  // MAKE THIS A MODAL WITH INFORMATION ABOUT ROLES
  // Make the role the menu bar label
  // add request form
  // add server admin action

  return (
    <Dialog>
      <DialogTrigger className="flex h-full select-none items-center gap-3 border-primary px-2 outline-none hover:bg-foreground/10 lg:px-4">
        <Shield />
        <span className="hidden lg:inline">{index?.user_role}</span>
      </DialogTrigger>
      <DialogContent className="prose max-h-[90vh] w-[700px] max-w-[90vw] items-start py-6 dark:prose-invert">
        <DialogHeader>
          <DialogTitle className="mt-0">Index access role</DialogTitle>
          <DialogDescription className="h-0 opacity-0">
            Your role for this index is <strong>{user_role}</strong>.{" "}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-0 flex flex-col">
          <div className="mb-6 text-lg">{myRole()}</div>

          <div className="rounded-md bg-primary/10 p-3">
            <div className="mb-2 font-bold text-primary">There are four access roles with incremental permissions:</div>
            <div className="grid grid-cols-[8rem,1fr]">
              <b className="text-primary">METAREADER</b>
              Can search documents and view a subset of the contents.
              <b className="text-primary">READER</b>
              Can view all document contents.
              <b className="text-primary">WRITER</b>
              Can upload and modify documents.
              <b className="text-primary">ADMIN</b>
              Can manage index settings and users, and delete data.
            </div>
          </div>

          <div>
            <h4>Upgrade my role</h4>
            {upgradeRole()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ChangeRoleProps {
  user: MiddlecatUser;
  index?: AmcatIndex;
}

function IndexMenuServerAdmin({ user, index }: ChangeRoleProps) {
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
          <span>Change my index role</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
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
