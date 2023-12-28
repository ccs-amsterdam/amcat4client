import { useMutateUser } from "@/api/users";
import { useMiddlecat } from "middlecat-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { useMemo, useState } from "react";
import { amcatUserRoles } from "@/schemas";
import { ChevronDown } from "lucide-react";

interface Props {
  ownRole: string;
  roles: string[];
}

export default function CreateUserForm({ ownRole, roles }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("READER");

  const { user, loading } = useMiddlecat();
  const { mutate } = useMutateUser(user);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !role) return;
    mutate({ email, role, action: "create" });
  }

  return (
    <form onSubmit={onSubmit} className="prose flex flex-col gap-1 p-2 dark:prose-invert">
      <h4 className="px-2">Create user</h4>

      <Input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" />
      <div className="grid grid-cols-[2fr,1fr] gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-full items-center justify-between gap-3 rounded border border-primary px-3 text-primary outline-none">
            {role}
            <ChevronDown className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
              {roles.map((role) => {
                if (ownRole !== "ADMIN" && ownRole !== "WRITER") return null;
                if (ownRole === "WRITER" && role === "ADMIN") return null;
                if (role === "NONE") return null;
                return (
                  <DropdownMenuRadioItem key={role} value={role}>
                    {role}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button disabled={!user}>Create</Button>
      </div>
    </form>
  );
}
