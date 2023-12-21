import { AmcatField, AmcatFilter, AmcatIndexName } from "@/amcat/interfaces";
import { filterLabel, FilterPopup } from "./FilterPopups";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Delete, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MiddlecatUser } from "middlecat-react";

interface FilterPickerProps {
  user: MiddlecatUser;
  index: AmcatIndexName;
  field: AmcatField | undefined;
  value: AmcatFilter | undefined;
  onChange: (value: AmcatFilter) => void;
  onDelete: () => void;
  className?: string;
}
export default function FilterPicker({ user, index, field, value, onChange, onDelete, className }: FilterPickerProps) {
  if (field == null || value == null) return null;

  return (
    <Popover
      defaultOpen={value?.justAdded}
      onOpenChange={() => {
        if (value?.justAdded) value.justAdded = false;
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex flex-row-reverse rounded-md border-[1px] bg-background">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onDelete?.();
            }}
            className="peer rounded-l-none  pl-0 pr-2 hover:bg-destructive"
          >
            <Delete />
          </Button>
          <Button
            className={cn(
              "flex justify-between gap-2 rounded-r-none first-letter:first-line:whitespace-nowrap hover:bg-primary  peer-hover:bg-destructive ",
              className,
            )}
          >
            {filterLabel(field, value, true)}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent collisionPadding={{ bottom: -9999 }} side="bottom" className="max-h-[400px] w-full overflow-auto">
        <FilterPopup user={user} index={index} field={field} value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}

interface StyleProps {
  children: React.ReactNode;
  field: AmcatField;
  value: AmcatFilter;
  className?: string;
  onDelete: () => void;
}

function DialogStyle({ children, field, value, className, onDelete }: StyleProps) {
  return (
    <Dialog
      defaultOpen={value?.justAdded}
      onOpenChange={() => {
        if (value?.justAdded) value.justAdded = false;
      }}
    >
      <DialogTrigger asChild>
        <div className="flex flex-row-reverse rounded-md border-[1px] bg-background">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onDelete?.();
            }}
            className="peer rounded-l-none  pl-0 pr-2 hover:bg-destructive"
          >
            <Delete />
          </Button>
          <Button
            className={cn(
              "flex justify-between gap-2 rounded-r-none bg-black  first-letter:first-line:whitespace-nowrap hover:bg-primary peer-hover:bg-destructive ",
              className,
            )}
          >
            {filterLabel(field, value, true)}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="pr-6">{field.name}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function PopoverStyle({ children, field, value, className, onDelete }: StyleProps) {
  return (
    <Popover
      defaultOpen={value?.justAdded}
      onOpenChange={() => {
        if (value?.justAdded) value.justAdded = false;
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex flex-row-reverse rounded-md border-[1px] bg-background">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onDelete?.();
            }}
            className="peer rounded-l-none  pl-0 pr-2 hover:bg-destructive"
          >
            <Delete />
          </Button>
          <Button
            className={cn(
              "flex justify-between gap-2 rounded-r-none first-letter:first-line:whitespace-nowrap hover:bg-primary  peer-hover:bg-destructive ",
              className,
            )}
          >
            {filterLabel(field, value, true)}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent collisionPadding={{ bottom: -9999 }} side="bottom" className="max-h-[400px] w-full overflow-auto">
        {children}
      </PopoverContent>
    </Popover>
  );
}
