"use client";

import { useMiddlecat } from "middlecat-react";
import { Button } from "@/components/ui/button";
import { useMutateIndex } from "@/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { AmcatIndex } from "@/interfaces";

export function UpdateIndex({ index }: { index: AmcatIndex }) {
  const { user } = useMiddlecat();
  const { mutate } = useMutateIndex(user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!index) return;
    setName(index.name);
    setDescription(index.description);
  }, [index]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ id: index.id, name, description, action: "update" });
    setOpen(false);
  }

  if (!index) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger className="min-w-[12rem] text-lg">
        <Edit className="ml-1 h-7 w-7" />
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
          <Button className="mt-2 w-full">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
