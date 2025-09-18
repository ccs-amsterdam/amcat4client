import { useAmcatConfig } from "@/api/config";
import { Dialog, DialogContent } from "../ui/dialog";
import { useAmcatBranding } from "@/api/branding";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useState } from "react";
import { Info } from "lucide-react";
import { Loading } from "../ui/loading";

export function ServerInfoDropdownItem({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          setOpen(true);
        }}
      >
        <Info className="mr-2 h-4 w-4" />
        About
      </DropdownMenuItem>
    </>
  );
}

export function ServerInfo({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { data: config, isLoading: configLoading } = useAmcatConfig();
  const { data: branding, isLoading: brandingLoading } = useAmcatBranding();

  if (configLoading || brandingLoading) return <Loading />;

  function publicDataText() {
    const auth = config?.authorization || "none";
    if (auth === "no_auth") return <p>This server has not enabled authentication. All data is therefore public.</p>;

    if (auth === "allow_guests")
      return <p>This server allows guests (i.e. users that are not signed in) to access public data.</p>;

    if (auth === "allow_authenticated_guests")
      return <p>This server requires users to sign-in to access public data</p>;

    if (auth === "authorized_users_only")
      return (
        <p>
          This server does not have public data. Users need to sign-in with an email-address that has been given
          permission.
        </p>
      );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="prose w-[500px] max-w-[90vw] py-6 dark:prose-invert">
        <div className="flex flex-col">
          <h2 className="mt-0 text-lg font-semibold">{branding?.server_name || "Server configuration"}</h2>
          <div className="grid grid-cols-[8rem,1fr] gap-1">
            <div className="">Server URL</div>
            <a
              href={config?.resource}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-primary hover:underline"
            >
              {config?.resource}
            </a>
            {branding?.server_url && (
              <>
                <div className="">Project URL</div>
                <a
                  href={branding?.server_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary hover:underline"
                >
                  {branding?.server_url}
                </a>
              </>
            )}
          </div>
          <div>
            <h4>Public data access</h4>
            {publicDataText()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
