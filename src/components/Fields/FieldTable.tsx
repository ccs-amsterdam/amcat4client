"use client";

import { DataTable } from "@/components/ui/datatable";
import { AmcatField, AmcatFieldMeta, AmcatFieldType, AmcatMetareaderAccess } from "@/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import { Checkbox } from "../ui/checkbox";
import { DynamicIcon } from "../ui/dynamic-icon";
import MetareaderAccessForm from "./MetareaderAccessForm";
import {
  parseClientDisplay,
  parseMetareader,
  stringifyClientDisplay,
  stringifyMetareader,
} from "@/lib/serializeFieldMeta";

interface ChangeFieldParams {
  name: string;
  type?: AmcatFieldType;
  meta?: AmcatFieldMeta;
}

interface Row extends AmcatField {
  onChange?: ({ name, type, meta }: ChangeFieldParams) => void;
}

const tableColumns: ColumnDef<Row>[] = [
  {
    accessorKey: "name",
    header: "Field",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <DynamicIcon type={row.original.type} />
          <span>{row.original.type}</span>
        </div>
      );
    },
  },
  {
    header: "Default visibility",
    cell: ({ row }) => {
      const field = row.original;
      const client_display = parseClientDisplay(field.meta?.client_display || "");
      const inList = client_display.inList || false;
      const inDocument = client_display.inDocument || false;

      function onChange(inList: boolean, inDocument: boolean) {
        const client_display = stringifyClientDisplay({
          inList: inList,
          inDocument: inDocument,
        });
        field.onChange?.({ name: field.name, type: field.type, meta: { ...field.meta, client_display } });
      }

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id={"toggleInList" + field.name}
              checked={inList}
              onCheckedChange={(checked) => onChange(!!checked, inDocument)}
            />
            <label htmlFor={"toggleInList" + field.name} className="cursor-pointer">
              list
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={"toggleInDocument" + field.name}
              checked={inDocument}
              onCheckedChange={(checked) => onChange(inList, !!checked)}
            />
            <label htmlFor={"toggleInDocument" + field.name} className="cursor-pointer">
              document
            </label>
          </div>
        </div>
      );
    },
  },
  {
    header: "METAREADER access",
    cell: ({ row }) => {
      const field = row.original;
      const metareader_access = parseMetareader(field.meta?.metareader_access || "none");

      function onChange(metareader: AmcatMetareaderAccess) {
        const metareader_access = stringifyMetareader(metareader);
        field.onChange?.({ name: field.name, type: field.type, meta: { ...field.meta, metareader_access } });
      }

      function changeAccess(access: "none" | "snippet" | "read") {
        onChange({ ...metareader_access, access });
      }
      function changeSnippetParams(nomatch_chars: number, max_matches: number, match_chars: number) {
        onChange({ ...metareader_access, snippetParams: { nomatch_chars, max_matches, match_chars } });
      }

      return (
        <MetareaderAccessForm
          metareader_access={metareader_access}
          onChangeAccess={changeAccess}
          onChangeSnippetParams={changeSnippetParams}
        />
      );
    },
  },
];

interface Props {
  fields: AmcatField[];
  mutate: (fields: AmcatField[]) => void;
}

export default function FieldTable({ fields, mutate }: Props) {
  const onChange = useCallback(
    ({ name, type, meta }: ChangeFieldParams) => {
      const oldField = fields.find((field) => field.name === name);
      if (!oldField) return;
      const newField = {
        name,
        type: type || oldField.type,
        meta: meta || oldField.meta,
      };

      mutate([newField]);
    },
    [fields],
  );

  const data: Row[] =
    fields?.map((field) => {
      const row: Row = {
        ...field,
        onChange,
      };
      return row;
    }) || [];

  return <DataTable columns={tableColumns} data={data} />;
}
