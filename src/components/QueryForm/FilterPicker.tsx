import { AmcatFilter, AmcatIndexName } from "@/interfaces";
import { filterLabel, FilterPopup } from "./FilterPopups";

import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MiddlecatUser } from "middlecat-react";
import { getField, useFields } from "@/api/fields";
import { useState } from "react";

interface FilterPickerProps {
  user: MiddlecatUser;
  indexName: AmcatIndexName;
  fieldName: string;
  value: AmcatFilter | undefined;
  onChange: (value: AmcatFilter) => void;
  onDelete: () => void;
  className?: string;
}
export default function FilterPicker({
  user,
  indexName,
  fieldName,
  value,
  onChange,
  onDelete,
  className,
}: FilterPickerProps) {
  const { data: fields } = useFields(user, indexName);
  const field = getField(fields, fieldName);
  const [open, setOpen] = useState(value?.justAdded);

  if (value == null) return null;

  return (
    <Popover
      defaultOpen={value?.justAdded}
      onOpenChange={(open) => {
        setOpen(open);
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
            {filterLabel(fieldName, field, value)}
          </Button>
        </div>
      </PopoverTrigger>
      {field != null ? (
        <PopoverContent
          collisionPadding={{ bottom: -9999 }}
          side="bottom"
          className="max-h-[450px] w-full overflow-auto"
        >
          <FilterPopup user={user} indexName={indexName} field={field} value={value} onChange={onChange} />
        </PopoverContent>
      ) : null}
    </Popover>
  );
}
