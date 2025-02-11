"use client";

import { useCreateIndex } from "@/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { amcatIndexSchema } from "@/schemas";
import { useMiddlecat } from "middlecat-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CreateIndex({ children, folder }: { children?: React.ReactNode; folder?: string }) {
  const router = useRouter();
  const { user } = useMiddlecat();
  const { mutateAsync: createIndexAsync } = useCreateIndex(user);
  const [name, setName] = useState("");
  const [folderValue, setFolderValue] = useState(folder);
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    setFolderValue(folder);
  }, [folder]);

  function idFromName(name: string) {
    return name
      .replaceAll(" ", "-")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll(/[^a-z0-9_-]/g, "")
      .replace(/^[_-]+/, "");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createIndexAsync(amcatIndexSchema.parse({ id, name, description, folder }))
      .then(() => router.push(`/indices/${id}/data?tab=upload`))
      .catch(console.error);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children ?? <Button variant="outline">Create Index</Button>}</DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create Index</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setId(idFromName(e.target.value));
              }}
              id="name"
              name="name"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="ID">Index ID</label>
            <Input id="ID" name="ID" value={id} onChange={(e) => setId(idFromName(e.target.value))} />
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

          <div>
            <label htmlFor="name">Folder</label>
            <Input
              value={folderValue}
              onChange={(e) => {
                setFolderValue(e.target.value);
              }}
              id="name"
              name="name"
              autoComplete="off"
            />
          </div>
          <Button className="mt-2 w-full">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
