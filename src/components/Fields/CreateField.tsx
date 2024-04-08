import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { amcatFieldTypeSchema } from "@/schemas";
import { DynamicIcon } from "../ui/dynamic-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { z } from "zod";
import { useFields } from "@/api/fields";
import { AmcatField, UpdateAmcatField } from "@/interfaces";

interface Props {
  fields: AmcatField[];
  onCreate: (field: UpdateAmcatField) => void;
  children?: React.ReactNode;
}

export default function CreateField({ children, fields, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const doCreateField = async (field: UpdateAmcatField) => {
    onCreate(field);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
        </DialogHeader>
        <CreateFieldForm fields={fields} createField={doCreateField} />
      </DialogContent>
    </Dialog>
  );
}
interface CreateFieldProps {
  fields: AmcatField[];
  createField: (field: UpdateAmcatField) => void;
  children?: React.ReactNode;
}

type FieldType = z.infer<typeof amcatFieldTypeSchema>;

function CreateFieldForm({ fields, createField }: CreateFieldProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState<FieldType>("keyword");
  const types = new Map<FieldType, string>([
    ["keyword", "A keyword field is useful for shorter labels or categories that should not be analysed"],
    ["id", "???"],
    ["text", "Text fields are used for longer texts; They are analysed so individual words can be searched"],
    ["date", "Field for date or date/time values"],
    ["boolean", "For boolean (true or false) values"],
    ["number", "For numeric values"],
    ["object", "General objects that will not be parsed"],
    ["vector", "Dense vectors, i.e. document embeddings"],
    ["geo", "Geolocations, i.e. longitude and lattitude"],
    ["integer", "For integer values, i.e. numbers without decimals"],
    ["tag", "Tag fields can contain multiple tags for each document"],
  ]);
  const existingFields = fields.map((f) => f.name);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createField({ name, type });
  }

  const validateFieldName = (value: string) => {
    // see https://github.com/elastic/elasticsearch/issues/9059 (why is this not properly documented?)
    // Field names should not start with underscore, and should not contain dots or backslashes
    // (and should probably not contain spaces?)
    let error = "";
    value = value.replace(/[ \\.\\]/, "");
    value = value.replace(/^_+/, "");
    if (existingFields.includes(value)) error = `Field ${value} already exists`;
    return [value, error];
  };

  const doSetField = (e: React.FormEvent<HTMLInputElement>) => {
    const [value, error] = validateFieldName((e.target as any).value);
    setError(error);
    setName(value);
  };

  return (
    <form onSubmit={onSubmit} className="prose flex max-w-none flex-col gap-3 dark:prose-invert">
      <Input required value={name} onChange={doSetField} placeholder="Field name" />
      <span className="text-red-600">{error}</span>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-full items-center justify-between gap-3 rounded border border-primary px-3 text-primary outline-none">
          <DynamicIcon type={type} />
          {type}
          <ChevronDown className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={type} onValueChange={(value) => setType(value as FieldType)}>
            {Array.from(types.entries()).map(([x, help]) => {
              return (
                <Tooltip key={x}>
                  <TooltipTrigger asChild>
                    <DropdownMenuRadioItem value={x}>
                      <DynamicIcon type={x} /> &nbsp;{x}
                    </DropdownMenuRadioItem>
                  </TooltipTrigger>{" "}
                  <TooltipContent side="right" className="bg-white">
                    {help}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button disabled={!name || error !== ""}>Create</Button>
    </form>
  );
}
