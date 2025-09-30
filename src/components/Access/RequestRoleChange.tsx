import { useAmcatConfig } from "@/api/config";
import { useSubmitRequest } from "@/api/requests";
import { AmcatIndex } from "@/interfaces";
import { amcatRequestRoleSchema } from "@/schemas";
import { ChevronDown, Loader, LogInIcon } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface Props {
  user: MiddlecatUser;
  roles: string[];
  currentRole: string;
  index?: AmcatIndex;
  onSend?: () => void;
}

export function RequestRoleChange({ user, roles, currentRole, index, onSend }: Props) {
  const { signIn } = useMiddlecat();
  const { data: serverConfig } = useAmcatConfig();
  const { mutateAsync: submitRequest } = useSubmitRequest(user);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function onSubmit(role: string | undefined) {
    if (!role) return;
    const request = amcatRequestRoleSchema.parse({
      request_type: "role",
      email: user.email,
      role: role,
      message,
    });
    if (index) request.index = index.id;
    setLoading(true);
    submitRequest(request)
      .then(() => {
        onSend?.();
      })
      .finally(() => setTimeout(() => setLoading(false), 500));
  }

  if (!user?.authenticated)
    return (
      <div className=" flex items-center rounded-md  bg-primary/10 p-3">
        <div className="flex flex-col">
          <div className="text-lg font-bold">Request role change</div>
          <div>Sign-in to requests a role on this index</div>
        </div>
        <Button className="ml-auto flex h-full items-center gap-2 pr-6" onClick={() => signIn()}>
          <LogInIcon className="mr-2 h-4 w-4" />
          Sign-in
        </Button>
      </div>
    );

  return (
    <div className=" flex flex-col gap-3 rounded-md  bg-primary/10 p-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Request role change</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className=" mt-1 w-40" id="role">
              {role || "Select role"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" align="end">
            <DropdownMenuRadioGroup
              value={role || currentRole}
              onSelect={(e) => e.preventDefault()}
              onValueChange={(value) => setRole(value)}
            >
              {roles.map((role) => {
                if (currentRole === "NONE" && role === "NONE") return null;
                return (
                  <DropdownMenuRadioItem
                    key={role}
                    value={role}
                    disabled={role === currentRole}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {role === "NONE" ? `delete role` : role}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <Label htmlFor="message">Message to administrator</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="You can add a message here to explain why you need this role."
          className="min-h-[80px]"
        />
      </div>

      <Button
        variant="outline"
        className="ml-auto w-36 bg-transparent"
        disabled={!role || role === currentRole}
        onClick={() => onSubmit(role)}
      >
        {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : "Send request"}
      </Button>
    </div>
  );
}
