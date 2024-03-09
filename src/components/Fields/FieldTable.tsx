"use client";

import { DataTable } from "@/components/ui/datatable";
import { AmcatField, AmcatMetareaderAccess, UpdateAmcatField, AmcatClientSettings } from "@/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import { DynamicIcon } from "../ui/dynamic-icon";
import MetareaderAccessForm from "./MetareaderAccessForm";
import VisibilityForm from "./VisibilityForm";

interface Row extends AmcatField {
  onChange?: ({ name, type, metareader, client_settings }: UpdateAmcatField) => void;
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
          <div>
            <div>{row.original.type}</div>
            <div className="text-xs  leading-3 text-primary">{row.original.elastic_type}</div>
          </div>
        </div>
      );
    },
  },

  {
    header: "Display",
    cell: ({ row }) => {
      const field = row.original;

      function onChange(client_settings: AmcatClientSettings) {
        field.onChange?.({ name: field.name, client_settings });
      }

      return <VisibilityForm field={field} client_settings={field.client_settings} onChange={onChange} />;
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
