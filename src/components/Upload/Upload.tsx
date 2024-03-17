import { AmcatField, AmcatFieldElasticType, AmcatFieldType, AmcatIndexId } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Button } from "../ui/button";
import { AlertCircleIcon, CheckSquare, ChevronDown, Edit, Key, List, Loader, Plus, Square, X } from "lucide-react";
import { useFields } from "@/api/fields";
import { validateColumns } from "./typeValidation";

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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { set } from "date-fns";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
}

export type jsType = string | number | boolean;
export type Status = "Validating" | "Ready" | "Not used" | "Type not set" | "Type mismatch";

export interface Column {
  name: string;
  field: string | null;
  type: AmcatFieldType | null;
  elasticType: AmcatFieldElasticType | null;
  status: Status;
  exists: boolean;
  typeWarning?: string;
  identifier?: boolean;
}

export default function Upload({ user, indexId }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const [data, setData] = useState<Record<string, jsType>[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const unusedFields = useMemo(() => {
    if (!fields) return [];
    return fields.filter((f) => !columns.find((c) => c.field === f.name));
  }, [fields, columns]);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const needsValidation = columns.filter((c) => c.status === "Validating");
    if (needsValidation.length === 0) {
      setValidating(false);
      return;
    }
    setValidating(true);
    validateColumns(columns, data).then((newColumns) => {
      setColumns(newColumns);
    });
  }, [columns, data]);

  const ready = columns.every((c) => c.status !== "Validating" && c.status !== "Type not set");
  const warn = columns.some((c) => c.status === "Type mismatch");

  const setColumn = (column: Column) => setColumns(columns.map((c) => (c.name === column.name ? column : c)));

  if (fieldsLoading) return <div>Loading...</div>;
  if (!fields) return null;

  return (
    <div className="flex flex-col gap-16">
      <CSVUploader fields={fields} setData={setData} setColumns={setColumns} />
      <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-12">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-semibold">Column</TableHead>
              <TableHead className="text-lg font-semibold">Index field</TableHead>
              <TableHead className="text-lg font-semibold">Field settings</TableHead>
              <TableHead className="text-lg font-semibold">Upload status</TableHead>
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
                      fields={fields}
                      unusedFields={unusedFields}
                      setColumn={setColumn}
                      validating={validating}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex h-full items-center gap-2">
                      {column.type ? (
                        <>
                          <Key className={` h-6 w-6 text-secondary ${column.identifier ? "" : "opacity-0"}`} />
                          <DynamicIcon type={column.type} />
                          {column.elasticType}
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>{getUploadStatus(column, data)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="ml-auto flex flex-wrap gap-2 p-3 md:flex-col">
          <h3 className="w-full text-lg font-bold">Index fields</h3>
          {fields.map((field) => {
            const used = columns.find((c) => c.field === field.name);
            console.log(!!used);
            return (
              <div
                key={field.name}
                className={`${!!used ? "" : "bg-primary text-primary-foreground"} flex gap-3 rounded-lg border  p-2  `}
              >
                <DynamicIcon type={field.type} />
                <div className="flex w-full justify-between gap-3">
                  <div className="font-bold ">{field.name}</div>
                  {field.identifier ? <Key className="h-6 w-6" /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getUploadStatus(column: Column, data: Record<string, jsType>[]) {
  let icon: ReactNode;

  switch (column.status) {
    case "Ready":
      icon = <CheckSquare className="text-check h-6 w-6" />;
      break;
    case "Validating":
      icon = <Loader className="h-6 w-6 animate-spin" />;
      break;
    case "Type not set":
      icon = <Square className="text-warn h-6 w-6" />;
      break;
    case "Type mismatch":
      icon = <AlertCircleIcon className="text-warn h-6 w-6" />;
      break;
    default:
      icon = <Square className="h-6 w-6 text-secondary" />;
  }

  return (
    <div className="flex items-center gap-2">
      {icon}
      {column.status}
    </div>
  );
}

function SelectAmcatField({
  column,
  setColumn,
  fields,
  unusedFields,
  validating,
}: {
  column: Column;
  setColumn: (column: Column) => void;
  fields: AmcatField[];
  unusedFields: AmcatField[];
  validating?: boolean;
}) {
  if (!column) return null;
  const [createField, setCreateField] = useState(false);

  const isNew = column.field && !column.exists;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex w-full gap-2 rounded p-2 `}>
          {column.field ? column.field : "Select field"}
          <ChevronDown className="h-5 w-5" />
          {isNew ? <div className="rounded bg-secondary px-1 py-0 text-secondary-foreground">NEW</div> : null}
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
                        status: "Validating",
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

          <DropdownMenuItem className="flex gap-2" onClick={() => setCreateField(true)}>
            {isNew ? <Edit /> : <Plus />}
            {isNew ? "Edit new field" : "Create new field"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={column.field ? "flex gap-2" : "hidden"}
            onClick={() => setColumn({ ...column, field: null, type: null, elasticType: null, exists: false })}
          >
            <X /> Remove field
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateFieldDialog
        open={createField}
        setOpen={setCreateField}
        column={column}
        setColumn={setColumn}
        disabled={validating}
      />
    </>
  );
}

function CreateFieldDialog({
  open,
  setOpen,
  column,
  setColumn,
  disabled,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  column: Column;
  setColumn: (column: Column) => void;
  disabled?: boolean;
}) {
  const [newColumn, setNewColumn] = useState({ ...column, field: column.name });

  useEffect(() => {
    setNewColumn({ ...column, field: column.name });
  }, [column]);

  function Item({
    label,
    type,
    elasticType,
  }: {
    type: AmcatFieldType | null;
    elasticType: AmcatFieldElasticType | null;
    label?: string;
  }) {
    return (
      <DropdownMenuItem className="flex gap-2" onClick={() => setNewColumn({ ...newColumn, type, elasticType })}>
        <DynamicIcon type={elasticType} />
        {label || type}
      </DropdownMenuItem>
    );
  }

  return (
    <Dialog
      open={open && !disabled}
      onOpenChange={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="text-lg font-bold">Create new field</div>
          {/* <p className="text-sm">
            This creates a new index field. Make sure to pick a suitable field type, since you won't be able to change
            this after the data has been uploaded.
          </p> */}
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Field name"
            value={newColumn.field || ""}
            onChange={(e) => setNewColumn({ ...newColumn, field: e.target.value })}
          />
          <DropdownMenu>
            <DropdownMenuTrigger disabled={disabled} className="flex w-full gap-2 rounded">
              {newColumn.elasticType ? (
                <div className="flex gap-3">
                  <DynamicIcon type={newColumn.elasticType} /> {newColumn.elasticType}
                </div>
              ) : (
                "Select type"
              )}
              <ChevronDown className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Item label="Text" type="text" elasticType="text" />
              <Item label="Keyword" type="keyword" elasticType="keyword" />
              <Item label="Date" type="date" elasticType="date" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex gap-2">
                  <DynamicIcon type="number" />
                  Number
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <Item label="Real number (float)" type="number" elasticType="float" />
                  <Item label="Integer (long)" type="number" elasticType="integer" />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <Item label="Boolean" type="boolean" elasticType="boolean" />
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className=" flex items-center gap-3 "
            onClick={() => {
              setNewColumn({ ...newColumn, identifier: !newColumn.identifier });
            }}
          >
            <Key className="h-6 w-6" />
            <label className="">Use as identifier*</label>
            <Checkbox className="ml-[2px] h-5 w-5" checked={newColumn.identifier}>
              Field exists
            </Checkbox>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newColumn.field || !newColumn.type || !newColumn.elasticType}
              onClick={() => {
                setColumn(newColumn);
                setOpen(false);
              }}
            >
              Create
            </Button>
          </div>
          <p className="text-sm italic">
            * Identifier fields are used to prevent duplicate documents. Use unique identifier (e.g., URL) if available.
            Use multiple identifiers for unique combinations (e.g., author & timestamp)
          </p>
        </div>
      </DialogContent>
    </Dialog>
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
                <Button
                  className="px-1"
                  variant="ghost"
                  ref={fileRef}
                  {...getRemoveFileProps()}
                  onClick={(e) => {
                    setColumns([]);
                    setData([]);
                    getRemoveFileProps().onClick(e);
                  }}
                >
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
  const columns = importedData[0].map((column): Column => {
    const name = String(column);
    const field = fields.find((f) => f.name === name);
    if (!field) return { name, field: null, type: null, elasticType: null, status: "Not used", exists: false };
    return {
      name,
      field: name,
      type: field.type,
      elasticType: field.elastic_type,
      status: "Validating",
      exists: true,
    };
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
