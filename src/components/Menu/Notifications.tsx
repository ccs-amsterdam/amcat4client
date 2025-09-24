import { useRequests } from "@/api/requests";
import { useMiddlecat } from "middlecat-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Bell, Check, CheckIcon, X } from "lucide-react";
import { amcatRequestProjectSchema, amcatRequestRoleSchema, amcatRequestSchema } from "@/schemas";
import { z } from "zod";
import { Fragment, useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type Request = z.infer<typeof amcatRequestSchema>;
type RoleRequest = z.infer<typeof amcatRequestRoleSchema>;
type ProjectRequest = z.infer<typeof amcatRequestProjectSchema>;

type Tab = "Server role" | "Index role" | "Project";

interface Action {
  tab: Tab;
  decision: "approve" | "reject";
  request: Request;
}

export function Notifications() {
  const { user, loading: middlecatLoading } = useMiddlecat();
  const { data: requests, isLoading: requestsLoading } = useRequests(user);
  const [actions, setActions] = useState<Record<string, Action>>({});

  // if (middlecatLoading || requestsLoading) return null;

  // const dummyRequests: Request[] = [
  //   { index: "test", email: "user1@domain.com", role: "WRITER" },
  //   { index: "test", email: "user2@domain.com", role: "READER" },
  // ];
  const dummyRequests: Request[] = [];

  return <NotificationModal requests={requests || dummyRequests} actions={actions} setActions={setActions} />;
}

interface NotificationProps {
  requests: Request[];
  actions: Record<string, Action>;
  setActions: React.Dispatch<React.SetStateAction<Record<string, Action>>>;
}

export default function NotificationModal({ requests, actions, setActions }: NotificationProps) {
  const [open, setOpen] = useState(false);

  const done = Object.keys(actions).length;
  const n = requests.length;
  if (n === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-full select-none items-center gap-3 border-primary px-1 outline-none hover:bg-foreground/10 lg:px-4">
        <Bell />
        <span className="">{n}</span>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => (done ? e.preventDefault() : null)}
        className="prose flex h-[500px] max-h-[90vh] w-[700px] max-w-[95vw] flex-col  items-stretch  py-6 dark:prose-invert"
      >
        <DialogHeader>
          <DialogTitle className="mt-0">Notifications</DialogTitle>
          <DialogDescription className="h-0 opacity-0">Your have {n} notifications</DialogDescription>
        </DialogHeader>

        <NotificationTabs requests={requests} actions={actions} setActions={setActions} />
        <div className="mt-3 mt-auto flex items-center justify-end gap-3">
          <div>
            {done} / {n} requests evaluated
          </div>
          <Button className="" onClick={() => setActions({})} disabled={Object.keys(actions).length === 0}>
            Submit decisions
          </Button>
          <Button
            variant="outline"
            className="bg-foreground/10"
            onClick={() => {
              setActions({});
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NotificationTabs({ requests, actions: actions, setActions }: NotificationProps) {
  const serverRoleRequests = requests.filter((r) => r.type === "role" && r.index === "_global");
  const indexRoleRequests = requests.filter((r) => r.type === "role" && r.index !== "_global");
  const projectRequests = requests.filter((r) => r.type === "project");

  const done = Object.keys(actions).length;
  const n = requests.length;

  const defaultValue =
    serverRoleRequests.length > 0 ? "server-role" : indexRoleRequests.length > 0 ? "index-role" : "project";

  function setApproveHandler(tab: Tab, key: string, request: Request, action: Action["decision"]) {
    setActions((actions) => {
      const key = JSON.stringify(request);
      actions[key] = { tab, request, decision: action };
      return { ...actions };
    });
  }

  function renderRoleRequest(tab: Tab, roleRequest: Request) {
    if (roleRequest.type !== "role") return null;
    const key = JSON.stringify(roleRequest);
    return (
      <RoleRequest
        key={key}
        roleRequest={roleRequest}
        decision={actions[key]?.decision}
        setApprove={(action) => setApproveHandler(tab, key, roleRequest, action)}
      />
    );
  }

  function renderTrigger(tab: Tab, requests: Request[]) {
    const n = requests.length;
    const done = Object.values(actions).filter((a) => a.tab === tab).length;
    return (
      <TabsTrigger value={tab} className="text-sm data-[state=active]:text-sm">
        <NumberBadge text={tab} n={n} done={done} />
      </TabsTrigger>
    );
  }

  return (
    <Tabs className="m-0 " defaultValue={defaultValue}>
      <TabsList className="ml-auto flex-col md:flex-row">
        {renderTrigger("Server role", serverRoleRequests)}
        {renderTrigger("Index role", indexRoleRequests)}
      </TabsList>
      <div className="max-h-[500px] overflow-auto pt-3">
        <TabsContent value="Server role" className="">
          <div className="mt-0 flex flex-col gap-3">
            {serverRoleRequests.map((r) => renderRoleRequest("Server role", r))}
          </div>
        </TabsContent>
        <TabsContent value="Index role" className="">
          <div className="mt-0 flex flex-col gap-3">
            <div className="mt-0 flex flex-col gap-3">
              {indexRoleRequests.map((r) => renderRoleRequest("Index role", r))}
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

function NumberBadge({ text, n, done }: { text: string; n: number; done: number }) {
  return (
    <div className="flex items-center gap-3">
      {text}
      <div className=" flex h-5 w-5  items-center justify-center rounded-full  border border-primary bg-background/40 text-xs text-foreground">
        {done === n ? <CheckIcon className="h-3 w-3" /> : n - done}
      </div>
    </div>
  );
}

function RoleRequest({
  roleRequest,
  decision,
  setApprove: setDecision,
}: {
  roleRequest: RoleRequest;
  decision: Action["decision"] | undefined;
  setApprove: (action: Action["decision"]) => void;
}) {
  const { email, role, index } = roleRequest;

  const bg = decision === "approve" ? "bg-check/30" : decision === "reject" ? "bg-destructive/30" : "bg-foreground/10";

  return (
    <div className={`${bg} flex flex-col items-end  gap-3 rounded-sm p-3 md:flex-row`}>
      <div className="grid w-full grid-cols-[5rem,auto] text-sm">
        <div className="text-foreground/70">user</div>
        <div className="w-full break-words font-bold">{email}</div>
        <div className="text-foreground/70">requests</div>
        <div>{role} role</div>
        {roleRequest.index == null || roleRequest.index === "_global" ? null : (
          <>
            <div className="text-foreground/70">for index</div>
            <b>{index}</b>
          </>
        )}
      </div>
      <div className="flex flex-auto items-center gap-2">
        <Button
          size="sm"
          variant={decision === "approve" ? "positive" : "outline"}
          className={decision === "approve" ? "" : "opacity-50"}
          onClick={() => setDecision("approve")}
        >
          <Check />
        </Button>
        <Button
          size="sm"
          variant={decision === "reject" ? "destructive" : "outline"}
          className={decision === "reject" ? "" : "opacity-50"}
          onClick={() => setDecision("reject")}
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
