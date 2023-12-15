import {
  AmcatUser,
  AmcatField,
  AmcatFilter,
  AmcatIndexName,
} from "@/amcat/interfaces";
import { filterLabel, FilterPopup } from "./FilterPopups";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Delete, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterPickerProps {
  user: AmcatUser;
  index: AmcatIndexName;
  field: AmcatField | undefined;
  value: AmcatFilter | undefined;
  onChange: (value: AmcatFilter) => void;
  onDelete: () => void;
  className?: string;
}
export default function FilterPicker({
  user,
  index,
  field,
  value,
  onChange,
  onDelete,
  className,
}: FilterPickerProps) {
  if (field == null || value == null) return null;

  const asDialog = false;
  const Component = asDialog ? DialogStyle : PopoverStyle;

  return (
    <Component
      field={field}
      value={value}
      className={className}
      onDelete={onDelete}
    >
      <FilterPopup
        user={user}
        index={index}
        field={field}
        value={value}
        onChange={onChange}
      />
    </Component>
  );
}

interface StyleProps {
  children: React.ReactNode;
  field: AmcatField;
  value: AmcatFilter;
  className?: string;
  onDelete: () => void;
}

function DialogStyle({
  children,
  field,
  value,
  className,
  onDelete,
}: StyleProps) {
  return (
    <Dialog
      defaultOpen={value?.justAdded}
      onOpenChange={() => {
        if (value?.justAdded) value.justAdded = false;
      }}
    >
      <DialogTrigger asChild>
        <div className="flex flex-row-reverse bg-background border-[1px] rounded-md">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onDelete?.();
            }}
            className="bg-transparent pl-0 pr-2 peer hover:bg-destructive rounded-l-none"
          >
            <Delete />
          </Button>
          <Button
            className={cn(
              "rounded-r-none hover:bg-transparent peer-hover:bg-destructive bg-transparent first-letter:first-line:whitespace-nowrap flex gap-2 justify-between ",
              className
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

function PopoverStyle({
  children,
  field,
  value,
  className,
  onDelete,
}: StyleProps) {
  return (
    <Popover
      defaultOpen={value?.justAdded}
      onOpenChange={() => {
        if (value?.justAdded) value.justAdded = false;
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex flex-row-reverse bg-background border-[1px] rounded-md">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onDelete?.();
            }}
            className="bg-transparent pl-0 pr-2 peer hover:bg-destructive rounded-l-none"
          >
            <Delete />
          </Button>
          <Button
            className={cn(
              "rounded-r-none hover:bg-transparent peer-hover:bg-destructive bg-transparent first-letter:first-line:whitespace-nowrap flex gap-2 justify-between ",
              className
            )}
          >
            {filterLabel(field, value, true)}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={{ bottom: -9999 }}
        side="bottom"
        className="w-full max-h-[400px] overflow-auto"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
