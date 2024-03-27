"use client";

import { useMiddlecat } from "middlecat-react";
import { Button } from "@/components/ui/button";
import { useMutateIndex } from "@/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { AmcatIndex, AmcatUserRole } from "@/interfaces";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";

export function UpdateIndex({ index, children }: { index: AmcatIndex; children?: React.ReactNode }) {
  const { user } = useMiddlecat();
  const { mutate } = useMutateIndex(user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [guestRole, setGuestRole] = useState<AmcatUserRole>("METAREADER");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!index) return;
    setName(index.name);
    setDescription(index.description);
    setGuestRole(index.guest_role);
  }, [index]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ id: index.id, name, description, guest_role: guestRole, action: "update" });
    setOpen(false);
  }
  async function onArchive(archive: boolean) {
    mutate({ id: index.id, archive, action: "update" });
  }

  if (!index) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild className="text-lg">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Index</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              id="name"
              name="name"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
            />
          </div>

          <div className="flex flex-col">
            <label>Guest role</label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex gap-3">
                  <div>{guestRole}</div>
                  <Edit className="h-5 w-5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex flex-col gap-2">
                  {["NONE", "METAREADER", "READER", "WRITER", "ADMIN"].map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => {
                        setGuestRole(role as AmcatUserRole);
                      }}
                    >
                      {role}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button className="mt-2 w-full">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
