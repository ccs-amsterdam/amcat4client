"use client";

import { useIndex, useMutateIndex } from "@/api/index";
import { ContactInfo } from "@/components/Index/ContactInfo";
import { UpdateIndex } from "@/components/Index/UpdateIndex";
import { Button } from "@/components/ui/button";
import { ErrorMsg } from "@/components/ui/error-message";
import { Loading } from "@/components/ui/loading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AmcatIndex } from "@/interfaces";
import { Edit, Trash2 } from "lucide-react";
import { MiddlecatUser, useMiddlecat } from "middlecat-react";
import { useState } from "react";

interface Props {
  params: { index: string };
}

export default function Index({ params }: Props) {
  const { user, loading } = useMiddlecat();
  const indexId = decodeURI(params.index);
  const { data: index, isLoading: loadingIndex } = useIndex(user, indexId);

  if (loading || loadingIndex) return <Loading />;
  if (!user || !index) return <ErrorMsg type="Not Allowed">Need to be logged in</ErrorMsg>;

  return (
    <div className="flex w-full  flex-col gap-10">
      <Settings user={user} index={index} />
    </div>
  );
}

function Settings({ user, index }: { user: MiddlecatUser; index: AmcatIndex }) {
  const { mutate } = useMutateIndex(user);
  const [archiveOpen, setArchiveOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 items-start justify-between gap-10 p-3">
      <div>
        <div className="mb-3 flex items-center gap-5 md:justify-between">
          <h2 className="mb-0 mt-0 break-all text-[clamp(1.2rem,5vw,2rem)]">{index.name}</h2>
          <div className="flex items-center gap-2">
            <Popover open={archiveOpen} onOpenChange={setArchiveOpen}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => setArchiveOpen(!archiveOpen)}
                  variant={!index.archived ? "outline" : "default"}
                  className="flex gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  {!!index.archived ? "Unarchive" : "Archive"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-3">
                <p>Are you sure you want to {!!index.archived ? "unarchive" : "archive"} this index?</p>
                <Button
                  onClick={() => {
                    if (mutate) {
                      mutate({ id: index.id, archive: !index.archived });
                    }
                    setArchiveOpen(false);
                  }}
                >
                  Yes
                </Button>
              </PopoverContent>
            </Popover>
            <UpdateIndex index={index}>
              <Button variant="ghost" className="flex gap-3">
                <Edit className="h-7 w-7" />
                <div className="hidden text-xl md:block">Edit</div>
              </Button>
            </UpdateIndex>
          </div>
        </div>
        <p className=" mt-0 break-all text-[clamp(0.8rem,3.5vw,1.4rem)]">
          {index.description || <i className="text-sm text-foreground/60">(No description)</i>}
        </p>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-x-6 text-lg   ">
        <div className="font-bold">Guest role</div>
        <div className="text-primary">{index.guest_role}</div>
        <div className="font-bold">Own role</div>
        <div className=" text-primary">{index.user_role}</div>
        <div className="font-bold">Folder</div>
        <div className=" text-primary">{index.folder}</div>
        <div className="font-bold">Image</div>
        <div className=" text-primary">{index.image_url}</div>
      </div>
      <div>
        <div className="prose w-max rounded-md bg-primary/10 px-6 py-2 dark:prose-invert">
          <h4 className="text-foreground/60">Contact information</h4>
          <ContactInfo contact={index.contact} />
        </div>
      </div>
      <div className={`${index.archived ? "" : "hidden"}`}>
        <p className="w-max rounded border border-destructive p-2 text-destructive">
          This project was archived on {index.archived?.split(".")[0]}
        </p>
      </div>
    </div>
  );
}
