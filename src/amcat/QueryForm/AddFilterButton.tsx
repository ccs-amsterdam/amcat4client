import { useState } from "react";
import { AmcatField, AmcatQuery } from "@/amcat/interfaces";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export function fieldOptions(fields: AmcatField[], query: AmcatQuery) {
  return fields
    .filter((f) => !Object.keys(query?.filters || {}).includes(f.name))
    .filter((f) => ["date", "keyword", "tag"].includes(f.type));
}

interface AddFilterProps {
  children: React.ReactNode;
  options: AmcatField[];
  value: AmcatQuery;
  onSubmit: (value: AmcatQuery) => void;
}

export default function AddFilterButton({
  children,
  options,
  value,
  onSubmit,
}: AddFilterProps) {
  const [open, setOpen] = useState(false);

  function addFilter(name: string) {
    const filters = value?.filters || {};
    onSubmit({
      ...value,
      filters: { ...filters, [name]: { justAdded: true } },
    });
  }

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        if (options.length > 0) {
          setOpen(!open);
        } else {
          setOpen(false);
        }
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-1 gap-1">
          {options.map((f) => (
            <Button
              className="bg-background border-2 flex items-center justify-start gap-2"
              key={f.name}
              onClick={() => {
                setOpen(false);
                addFilter(f.name);
              }}
            >
              <DynamicIcon type={f.type} />
              <div className="flex-auto text-center">{f.name}</div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
