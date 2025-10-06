import { Button } from "@/components/ui/button";
import { Folder, FolderOpen } from "lucide-react";
import { Fragment } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "../ui/breadcrumb";

export function FolderBreadcrumbs({
  currentPath,
  toFolder,
}: {
  currentPath: string | null;
  toFolder: (folder: string | null) => void;
}) {
  const pathArray = currentPath ? currentPath.split("/").filter((p) => p) : [];

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-0 pl-0  sm:gap-0">
        <BreadcrumbItem>
          <Button
            disabled={pathArray.length === 0}
            className="h-7 px-1 text-base"
            variant="ghost"
            onClick={() => toFolder(null)}
          >
            {/*<Folder className="mr-1 inline h-4 w-4" />*/}
            {pathArray.length === 0 ? (
              <div className="flex items-center gap-2">
                <Folder className="inline h-5 w-5" />
                Select folder
              </div>
            ) : (
              <FolderOpen className="inline h-5 w-5" />
            )}
          </Button>
        </BreadcrumbItem>
        {pathArray.map((folder, i) => (
          <Fragment key={i + folder}>
            <div className="mx-1 text-foreground/20">/</div>
            <BreadcrumbItem>
              <Button
                className="h-7 px-1 text-base"
                variant="ghost"
                onClick={() => toFolder(pathArray.slice(0, i + 1).join("/"))}
              >
                {folder || "Root"}
              </Button>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
