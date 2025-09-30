"use client";

import { useIndex } from "@/api/index";
import { useMyGlobalRole } from "@/api/userDetails";
import { HelpCircle } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RequestRoleChange } from "@/components/Access/RequestRoleChange";

const roles = ["NONE", "WRITER", "ADMIN"];

export default function ServerRole() {
  const { user, loading } = useMiddlecat();
  if (loading || !user) return null;

  const user_role = useMyGlobalRole(user) || "NONE";

  function myRole() {
    if (user_role === "NONE") return <span>you do not have a role on this server</span>;
    return (
      <span>
        You have the <b>{user_role}</b> role on this server.
      </span>
    );
  }

  function requestRoleChange() {
    if (!user) return null;
    // if (index?.user_role === "ADMIN") return null;
    return <RequestRoleChange user={user} roles={roles} currentRole={user_role} />;
  }

  // TODO: Add contact info on server client_data, then uncomment this
  //
  // function pointsOfContact() {
  //   if (index?.contact)
  //     return (
  //       <div className=" mt-6  max-w-xl items-center gap-3 rounded-md">
  //         <div className="p-3">
  //           <div className="text-lg font-bold">Contact information</div>
  //           <div className="text-sm">
  //             For other questions or comments about the accessibility of data in this index, you can reach out to:
  //           </div>
  //         </div>
  //         <div className="items-center rounded-md  p-3 text-sm ">
  //           <ContactInfo contact={index?.contact} />
  //         </div>
  //       </div>
  //     );
  // }

  return (
    <div className="mt-12 flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-6  lg:grid-cols-2">
        <div className=" flex items-center gap-3 py-3">
          {myRole()}
          <RoleInfoDialog />
        </div>
        {requestRoleChange()}
      </div>
    </div>
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
        <DialogDescription className="">There are two server roles with incremental permissions</DialogDescription>
        <RoleInfo />
      </DialogContent>
    </Dialog>
  );
}

export function RoleInfo() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="grid grid-cols-[7rem,1fr] gap-1">
        <b className="text-primary">WRITER</b>
        Can create new indices.
        <b className="text-primary">ADMIN</b>
        Can manage all indices and users.
      </div>
    </div>
  );
}
