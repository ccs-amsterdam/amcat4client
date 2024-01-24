"use client";

import { DataTable } from "@/components/ui/datatable";
import { AmcatField, AmcatMetareaderAccess, UpdateAmcatField } from "@/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import { Checkbox } from "../ui/checkbox";
import { DynamicIcon } from "../ui/dynamic-icon";
import MetareaderAccessForm from "./MetareaderAccessForm";

interface Row extends AmcatField {
  onChange?: ({ name, type, metareader, client_display }: UpdateAmcatField) => void;
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
      const client_display = field.client_display;
      const inList = client_display.in_list || false;
      const inDocument = client_display.in_document || false;

      function onChange(inList: boolean, inDocument: boolean) {
        const client_display = {
          in_list: inList,
          in_document: inDocument,
        };
        field.onChange?.({ name: field.name, client_display });
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
      const metareader_access = field.metareader;

      function onChange(metareader: AmcatMetareaderAccess) {
        field.onChange?.({ name: field.name, metareader });
      }
      function changeAccess(access: "none" | "snippet" | "read") {
        onChange({ ...metareader_access, access });
      }
      function changeMaxSnippet(nomatch_chars: number, max_matches: number, match_chars: number) {
        onChange({ ...metareader_access, max_snippet: { nomatch_chars, max_matches, match_chars } });
      }

      return (
        <MetareaderAccessForm
          field={field}
          metareader_access={metareader_access}
          onChangeAccess={changeAccess}
          onChangeMaxSnippet={changeMaxSnippet}
        />
      );
    },
  },
];

interface Props {
  fields: AmcatField[];
  mutate: (action: "create" | "delete" | "update", fields: UpdateAmcatField[]) => void;
}

export default function FieldTable({ fields, mutate }: Props) {
  const onChange = useCallback(
    (newField: UpdateAmcatField) => {
      mutate("update", [newField]);
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
