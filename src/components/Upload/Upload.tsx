import { AmcatField, AmcatFieldElasticType, AmcatFieldType, AmcatIndexId } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Button } from "../ui/button";
import { ChevronDown, List, Plus, X } from "lucide-react";
import { useFields } from "@/api/fields";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DynamicIcon } from "../ui/dynamic-icon";
import { Input } from "../ui/input";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
}

type jsType = string | number | boolean;

interface Column {
  name: string;
  field: string | null;
  type: AmcatFieldType | null;
  elasticType: AmcatFieldElasticType | null;
  exists: boolean;
  skip?: boolean;
}

export default function Upload({ user, indexId }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const [data, setData] = useState<Record<string, jsType>[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const unusedFields = useMemo(() => {
    if (!fields) return [];
    return fields.filter((f) => !columns.find((c) => c.field === f.name));
  }, [fields, columns]);

  // const tableColumns: ColumnDef<Record<string, jsType>>[] = useMemo(() => {
  //   return columns.map((c) => ({
  //     header: c.name,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="max-w-[5rem] overflow-hidden text-ellipsis whitespace-nowrap">
  //           <span title={String(row.original[c.name])}>{row.original[c.name]}</span>
  //         </div>
  //       );
  //     },
  //   }));
  // }, [columns]);

  const setColumn = (column: Column) => setColumns(columns.map((c) => (c.name === column.name ? column : c)));

  if (fieldsLoading) return <div>Loading...</div>;
  if (!fields) return null;

  return (
    <div className="flex flex-col gap-12">
      <CSVUploader fields={fields} setData={setData} setColumns={setColumns} />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-semibold">Column</TableHead>
              <TableHead className="text-lg font-semibold">Index field</TableHead>
              <TableHead className="text-lg font-semibold">Field type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((column) => {
              return (
                <TableRow key={column.name} className="">
                  <TableCell>{column.name}</TableCell>
                  <TableCell>
                    <SelectAmcatField
                      column={column}
                      unusedFields={unusedFields}
                      fields={fields}
                      setColumn={setColumn}
                    />
                  </TableCell>
                  <TableCell>
                    <SelectFieldType column={column} fields={fields} setColumn={setColumn} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="ml-auto flex flex-col gap-2">
          <h3 className="text-lg font-bold">Unused Index fields</h3>
          {unusedFields.map((field) => {
            return (
              <div key={field.name} className="flex gap-3 rounded-lg border bg-primary p-2 text-primary-foreground">
                <DynamicIcon type={field.type} />
                <div className="flex w-full justify-between gap-3">
                  <div className="font-bold ">{field.name}</div>
                  <div className="italic">{field.elastic_type}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SelectAmcatField({
  column,
  setColumn,
  fields,
  unusedFields,
}: {
  column: Column;
  setColumn: (column: Column) => void;
  fields: AmcatField[];
  unusedFields: AmcatField[];
}) {
  if (!column) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2">
        {column.field ? column.field : "Select field"}
        <ChevronDown className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={unusedFields.length > 0 ? "flex gap-2" : "hidden"}>
            <List /> Select field
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {unusedFields.map((field) => {
              return (
                <DropdownMenuItem
                  key={field.name}
                  onClick={() =>
                    setColumn({
                      ...column,
                      field: field.name,
                      type: field.type,
                      elasticType: field.elastic_type,
                      exists: true,
                    })
                  }
                >
                  {field.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem className="flex gap-2">
          <Plus />
          Create new field
        </DropdownMenuItem>
        <DropdownMenuItem
          className={column.field ? "flex gap-2" : "hidden"}
          onClick={() => setColumn({ ...column, field: null, type: null, elasticType: null, exists: false })}
        >
          <X /> Remove field
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectFieldType({
  name,
  column,
  setColumn,
  fields,
}: {
  name: string;
  column: Column;
  setColumn: (column: Column) => void;
  fields: AmcatField[];
}) {
  console.log(column);
  if (!column.field) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={column.exists} className="flex items-center gap-2">
        {column.elasticType ? (
          <>
            <DynamicIcon type={column.type} />
            {column.elasticType}
          </>
        ) : (
          "Select type"
        )}
        {column.exists ? null : <ChevronDown className="h-5 w-5" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setColumn({ ...column, elasticType: "text" })}>Text</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColumn({ ...column, elasticType: "keyword" })}>Keyword</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColumn({ ...column, elasticType: "date" })}>Date</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColumn({ ...column, elasticType: "integer" })}>Integer</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColumn({ ...column, elasticType: "float" })}>Float</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColumn({ ...column, elasticType: "boolean" })}>Boolean</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CSVUploader({
  fields,
  setData,
  setColumns,
}: {
  fields: AmcatField[];
  setData: Dispatch<SetStateAction<Record<string, jsType>[]>>;
  setColumns: Dispatch<SetStateAction<Column[]>>;
}) {
  const { CSVReader } = useCSVReader();
  const fileRef = useRef();
  const [zoneHover, setZoneHover] = useState(false);

  console.log("wtffff");
  return (
    <div className="flex">
      <CSVReader
        dynamicTyping
        onUploadAccepted={(res: any) => {
          setZoneHover(false);
          prepareData({ importedData: res.data, fields, setData, setColumns });
        }}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setZoneHover(true);
        }}
        onDragLeave={(e: DragEvent) => {
          e.preventDefault();
          setZoneHover(false);
        }}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any) => {
          if (acceptedFile)
            return (
              <div className="flex w-full items-center justify-end gap-2">
                {/* <div className="ml-auto rounded-lg bg-secondary px-3 py-2 text-center text-secondary-foreground">
                  {acceptedFile && acceptedFile.name}
                </div> */}
                <Button className="px-1" variant="ghost" ref={fileRef} {...getRemoveFileProps()}>
                  <X className="h-8 w-8" />
                </Button>
              </div>
            );

          return (
            <div className="w-full">
              <Button
                variant="outline"
                className={`${zoneHover ? "bg-secondary/30" : ""} text-md w-full flex-auto border-dotted px-10 py-14 `}
                {...getRootProps()}
              >
                Click to upload a CSV file, or drag and drop it here
              </Button>
              <ProgressBar />
            </div>
          );
        }}
      </CSVReader>
    </div>
  );
}

function prepareData({
  importedData,
  fields,
  setData,
  setColumns,
}: {
  importedData: jsType[][];
  fields: AmcatField[];
  setData: Dispatch<SetStateAction<Record<string, jsType>[]>>;
  setColumns: Dispatch<SetStateAction<Column[]>>;
}) {
  const columns = importedData[0].map((column) => {
    const name = String(column);
    const field = fields.find((f) => f.name === name);
    if (!field) return { name, field: null, type: null, elasticType: null, exists: false };
    return { name, field: name, type: field.type, elasticType: field.elastic_type, exists: true };
  });

  const data = importedData.slice(1).map((row) => {
    const obj: Record<string, jsType> = {};
    row.forEach((cell, i) => {
      obj[columns[i].name] = cell;
    });
    return obj;
  });

  setData(data);
  setColumns(columns);
}
