import { useCreateIndex } from "@/api";
import { useSubmitRequest } from "@/api/requests";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { amcatIndexSchema } from "@/schemas";
import { useMiddlecat } from "middlecat-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { AmcatRequestProject } from "@/interfaces";
import { Loader } from "lucide-react";

export function CreateIndex({ folder, request }: { folder?: string; request?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useMiddlecat();
  const { mutateAsync: createIndexAsync } = useCreateIndex(user);
  const { mutateAsync: requestIndexAsync } = useSubmitRequest(user);
  const [name, setName] = useState("");
  const [folderValue, setFolderValue] = useState(folder);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
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

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    createIndexAsync(amcatIndexSchema.parse({ id, name, description, folder: folderValue }))
      .then(() => router.push(`/indices/${id}/data?tab=upload`))
      .catch(console.error)
      .finally(() => setTimeout(() => setLoading(false), 500));
  }

  function onRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const request: AmcatRequestProject = {
      request_type: "create_project",
      index: id,
      name: name,
      description: description,
      message: message,
      email: user.email,
    };

    setLoading(true);
    requestIndexAsync(request)
      .then(() => {
        setOpen(false);
      })
      .finally(() => setTimeout(() => setLoading(false), 500));
  }

  function requestInfo() {
    if (!request) return null;
    return (
      <div className="prose dark:prose-invert">
        You do not have permission to create a new index, but you can submit a request. If approved, the project will be
        created for you and you will be granted admin access to it.
      </div>
    );
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{request ? "Request new index" : "Create Index"}</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="w-[600px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Create Index</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={request ? onRequest : onCreate}>
          {requestInfo()}
          <div className="flex items-center justify-between gap-6">
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
                placeholder="My new index"
              />
            </div>

            <div>
              <label htmlFor="ID">Index ID</label>
              <Input id="ID" name="ID" value={id} onChange={(e) => setId(idFromName(e.target.value))} />
            </div>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
              placeholder="Optionally, A brief description of the index"
            />
          </div>

          <div>
            <label htmlFor="folder">Folder</label>
            <Input
              value={folderValue}
              onChange={(e) => {
                setFolderValue(e.target.value);
              }}
              id="folder"
              name="folder"
              placeholder="newspapers/national"
              autoComplete="off"
            />
          </div>

          <div className={`${request ? "" : "hidden"}`}>
            <label htmlFor="message">Index request Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="message"
              name="message"
              placeholder="You can add a message here to justify your request."
            />
          </div>
          <Button className="mt-2 w-full">
            {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : request ? "Submit request" : "Create index"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
