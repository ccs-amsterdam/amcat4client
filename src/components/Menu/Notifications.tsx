import { useRoleRequests } from "@/api/roleRequests";
import { useMiddlecat } from "middlecat-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Bell, Check, X } from "lucide-react";
import { amcatRoleRequestSchema } from "@/schemas";
import { z } from "zod";
import { Fragment, useState } from "react";
import { Button } from "../ui/button";

type RoleRequest = z.infer<typeof amcatRoleRequestSchema>;

export function Notifications() {
  const { user, loading: middlecatLoading } = useMiddlecat();
  const { data: roleRequests, isLoading: roleRequestsLoading } = useRoleRequests(user);

  // if (middlecatLoading || roleRequestsLoading) return null;

  // const dummyRequests: RoleRequest[] = [
  //   { index: "test", email: "user1@domain.com", role: "WRITER" },
  //   { index: "test", email: "user2@domain.com", role: "READER" },
  // ];
  const dummyRequests: RoleRequest[] = [];

  return <NotificationModal roleRequests={roleRequests || dummyRequests} />;
}

interface NotificationModalProps {
  roleRequests: RoleRequest[];
}

export default function NotificationModal({ roleRequests }: NotificationModalProps) {
  const n = roleRequests.length;
  if (n === 0) return null;

  return (
    <Dialog>
      <DialogTrigger className="flex h-full select-none items-center gap-3 border-primary px-1 outline-none hover:bg-foreground/10 lg:px-4">
        <Bell />
        <span className="">{n}</span>
      </DialogTrigger>
      <DialogContent className="prose max-h-[90vh] w-[700px] max-w-[95vw] items-start py-6 dark:prose-invert">
        <DialogHeader>
          <DialogTitle className="mt-0">Notifications</DialogTitle>
          <DialogDescription className="h-0 opacity-0">Your have {n} notifications</DialogDescription>
        </DialogHeader>

        <div className="mt-0 flex flex-col gap-3">
          {roleRequests.map((roleRequest, i) => (
            <RoleRequest key={JSON.stringify(roleRequest)} roleRequest={roleRequest} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RoleRequest({ roleRequest }: { roleRequest: RoleRequest }) {
  const { email, role, index } = roleRequest;

  return (
    <div className="flex rounded-sm bg-foreground/10 p-3">
      <div className="grid w-full grid-cols-[6rem,1fr]">
        <div className="text-foreground/70">user</div>
        <b>{email}</b>
        <div className="text-foreground/70">requests</div>
        <b>{role} role</b>
        <div className="text-foreground/70">for index</div>
        <b>{index}</b>
      </div>
      <div className="flex items-center">
        <Button size="sm" variant="outline">
          <Check />
        </Button>
        <Button size="sm" variant="outline" className="ml-2">
          <X />
        </Button>
      </div>
    </div>
  );
}
