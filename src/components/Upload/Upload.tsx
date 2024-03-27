import { useFields } from "@/api/fields";
import { AmcatField, AmcatFieldType, AmcatFieldTypeGroup, AmcatIndexId, UpdateAmcatField } from "@/interfaces";
import {
  AlertCircleIcon,
  CheckSquare,
  ChevronDown,
  Edit,
  HelpCircle,
  Key,
  List,
  Loader,
  Minus,
  Plus,
  Square,
  X,
} from "lucide-react";
import { MiddlecatUser } from "middlecat-react";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Button } from "../ui/button";
import { autoTypeColumn, prepareUploadData, validateColumns } from "./typeValidation";

import { useMutateArticles } from "@/api/articles";
import { splitIntoBatches } from "@/api/util";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DynamicIcon } from "../ui/dynamic-icon";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
}

export type jsType = string | number | boolean;
export type Status = "Validating" | "Ready" | "Not used" | "Type not set" | "Type mismatch";
interface UploadStatus {
  operation: "create" | "index" | "update";
  status: "idle" | "uploading" | "success" | "error";
  error: string | null;
  batch_index: number;
  batches: { documents: Record<string, any>[]; fields?: Record<string, UpdateAmcatField> }[];
  successes: number;
  failures: number;
}

export interface Column {
  name: string;
  field: string | null;
  typeGroup: AmcatFieldTypeGroup | null;
  type: AmcatFieldType | null;
  status: Status;
  exists: boolean;
  typeWarning?: string;
  identifier?: boolean;
}

// TODO: Operation is currently not working (always uses index)

export default function Upload({ user, indexId }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const [data, setData] = useState<Record<string, jsType>[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const { mutateAsync: mutateArticles } = useMutateArticles(user, indexId);
  const unusedFields = useMemo(() => {
    if (!fields) return [];
    return fields.filter((f) => !columns.find((c) => c.field === f.name));
  }, [fields, columns]);
  const [validating, setValidating] = useState(false);
  const [operation, setOperation] = useState<"create" | "update" | "index">("create");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    operation,
    status: "idle",
    error: null,
    batch_index: 0,
    batches: [],
    successes: 0,
    failures: 0,
  });
  const [noIdentifierWarning, setNoIdentifierWarning] = useState(false);

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

  useEffect(() => {
    // upload batches
    if (uploadStatus.status !== "uploading") return;
    const batch = uploadStatus.batches[uploadStatus.batch_index];
    mutateArticles(batch)
      .then((result) => {
        if (uploadStatus.batch_index === uploadStatus.batches.length - 1) {
          setUploadStatus((uploadStatus) => ({ ...uploadStatus, status: "success" }));
          let operationMessage = operation === "index" ? "created or updated" : "created";
          toast.success(
            `Upload complete: ${operationMessage} ${uploadStatus.successes + result.successes} / ${
              uploadStatus.successes + result.successes + uploadStatus.failures + result.failures
            } documents. `,
          );
        } else {
          setUploadStatus((uploadStatus) => ({
            ...uploadStatus,
            batch_index: uploadStatus.batch_index + 1,
            successes: uploadStatus.successes + result.successes,
            failures: uploadStatus.failures + result.failures,
          }));
        }
      })
      .catch((e) => {
        setUploadStatus((uploadStatus) => ({ ...uploadStatus, status: "error", error: e.message }));
        // toast.error("Upload failed");
      });
  }, [uploadStatus]);

  const nonePending = columns.length > 0 && columns.every((c) => !["Validating", "Type not set"].includes(c.status));
  const ready = nonePending && columns.some((c) => c.status === "Ready");
  const warn = columns.some((c) => c.status === "Type mismatch");

  async function startUpload() {
    if (!ready) return;
    const batches = splitIntoBatches(data, 100);
    setUploadStatus({
      operation,
      status: "uploading",
      error: null,
      batch_index: 0,
      batches: batches.map((batch) => prepareUploadData(batch, columns)),
      successes: 0,
      failures: 0,
    });
  }

  function setColumn(column: Column) {
    let newColumn = { ...column };
    if (column.field !== null) {
      let suffix = "";
      let i = 2;
      while (columns.some((c) => c.field === `${column.field}${suffix}` && c.name !== column.name)) {
        suffix = suffix + String(i++);
      }
      newColumn.field = `${column.field}${suffix}`;
    }
    setColumns(columns.map((c) => (c.name === newColumn.name ? newColumn : c)));
  }

  function onUpload() {
    if (!fields) return;
    const allNew = columns.every((c) => !c.exists);
    const noIdentifiers = columns.every((c) => !c.identifier);
    if (allNew && noIdentifiers) {
      setNoIdentifierWarning(true);
    } else {
      startUpload();
    }
  }

  function onIgnoreNoIdentifierWarning() {
    setNoIdentifierWarning(false);
    startUpload();
  }

  if (fieldsLoading) return <div>Loading...</div>;
  if (!fields) return null;

  if (uploadStatus.status === "uploading")
    return (
      <div className="mx-auto flex flex-col gap-4">
        <h3 className="prose-xl w-full">Uploading documents</h3>
        <div className="flex gap-4">
          <Loader className="h-8 w-8 animate-spin" />
          <div>
            batch {uploadStatus.batch_index + 1}/{uploadStatus.batches.length}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setUploadStatus({ ...uploadStatus, status: "idle" });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <CSVUploader fields={fields} setData={setData} setColumns={setColumns} />
      <div className={`flex flex-col gap-8 ${data.length === 0 ? "hidden" : ""}`}>
        <div className={`p-4 ${fields.length === 0 ? "hidden" : ""}`}>
          <h3 className="prose-xl w-full">Index fields</h3>
          <div className="flex flex-wrap gap-1">
            {fields.map((field) => {
              const used = columns.find((c) => c.field === field.name);
              return (
                <div
                  key={field.name}
                  className={`${
                    !!used ? "" : "bg-primary text-primary-foreground"
                  } flex gap-3 rounded-lg border  p-2  `}
                >
                  {field.identifier ? <Key className="h-6 w-6" /> : null}
                  <DynamicIcon type={field.type_group} />
                  <div className="flex w-full justify-between gap-3">
                    <div className="font-bold ">{field.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Table className="table-auto whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-semibold">Column</TableHead>
              <TableHead className="text-lg font-semibold">Index field</TableHead>
              <TableHead className="text-lg font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((column) => {
              return (
                <TableRow key={column.name} className="">
                  <TableCell>{column.name}</TableCell>
                  <TableCell>
                    <SelectAmcatField
                      data={data}
                      column={column}
                      fields={fields}
                      unusedFields={unusedFields}
                      setColumn={setColumn}
                      validating={validating}
                    />
                  </TableCell>
                  <TableCell>{getUploadStatus(column, data)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex items-center">
          <Button disabled={!ready} onClick={onUpload}>
            Upload {data.length || ""} documents
          </Button>
          <Dialog open={noIdentifierWarning} onOpenChange={() => setNoIdentifierWarning(false)}>
            <DialogContent>
              <DialogHeader className="text-lg font-bold">Are you sure you don't need identifiers?</DialogHeader>
              <p>
                If you select one or multiple identifiers, they will be used to uniquely identify documents. It can be a
                unique field like a <b>URL</b>, but also a combination of fields like <b>author + timestamp</b>.
                Identifiers prevent accidentally uploading duplicate documents, and you can use them to update existing
                documents.
              </p>
              <p>
                If no identifiers are specified, only documents that are entirely identical will be considered
                duplicates.
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setNoIdentifierWarning(false)}>
                  Cancel
                </Button>
                <Button onClick={onIgnoreNoIdentifierWarning}>Upload without identifiers</Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="ml-3 flex">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded p-2">
                  {operation === "create" ? "Create" : "Create or replace"}
                  <ChevronDown className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="max-w-md">
                  <DropdownMenuItem
                    onClick={() => setOperation("create")}
                    className="flex-col items-start justify-start"
                  >
                    <span className="">Create</span>
                    <div className=" text-foreground/60">
                      Only upload new documents. If identifier already exists, keep the original{" "}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setOperation("update")}
                    className="flex-col items-start justify-start"
                  >
                    <span className="">Create or update </span>
                    <span className="text-foreground/60"></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setOperation("index")}
                    className="flex-col items-start justify-start"
                  >
                    <span className="">Create or replace </span>
                    <span className="text-foreground/60">
                      Upload all documents. If identifier already exists, replace the original{" "}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {warn ? (
            <div className="ml-4 flex items-center gap-2">
              <AlertCircleIcon className="h-6 w-6 text-warn" />
              <div>Some fields have type mismatches. These will become missing values</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getUploadStatus(column: Column, data: Record<string, jsType>[]) {
  let icon: ReactNode;
  let text = String(column.status);

  switch (column.status) {
    case "Ready":
      icon = <CheckSquare className="h-6 w-6 text-check" />;
      break;
    case "Validating":
      icon = <Loader className="h-6 w-6 animate-spin" />;
      break;
    case "Type not set":
      icon = <Square className="h-6 w-6 text-warn" />;
      break;
    case "Type mismatch":
      icon = <AlertCircleIcon className="h-6 w-6 text-warn" />;
      text = column.typeWarning || "Type mismatch";
      break;
    default:
      icon = <Square className="h-6 w-6 text-secondary" />;
  }

  return (
    <div className="flex items-center gap-2">
      {icon}
      {text}
    </div>
  );
}

function SelectAmcatField({
  data,
  column,
  setColumn,
  fields,
  unusedFields,
  validating,
}: {
  data: Record<string, jsType>[];
  column: Column;
  setColumn: (column: Column) => void;
  fields: AmcatField[];
  unusedFields: AmcatField[];
  validating?: boolean;
}) {
  if (!column) return null;
  const [createField, setCreateField] = useState(false);

  function autoType(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setColumn(autoTypeColumn(data, column.name));
  }

  function toggleIdentifier() {
    setColumn({ ...column, identifier: !column.identifier });
  }

  const isNew = column.field && !column.exists;

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center gap-2 rounded p-2 `}>
          {isNew ? <div className="rounded bg-secondary px-1 py-0 text-secondary-foreground">NEW</div> : null}
          {column.field ? (
            <>
              <DynamicIcon type={column.typeGroup} />
              <span className="text-primary">{column.field}</span>
              <Key className={` h-4 w-4 text-primary ${column.identifier ? "" : "hidden"}`} />
              <span className="text-sm italic text-foreground/60">{column.type}</span>
            </>
          ) : (
            <>
              Select field
              <ChevronDown className={` h-5 w-5 ${!column.field ? "" : "hidden"}`} />
            </>
          )}
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
                        typeGroup: field.type_group,
                        type: field.type,
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
            onClick={() =>
              setColumn({
                ...column,
                field: null,
                typeGroup: null,
                type: null,
                exists: false,
                status: "Not used",
              })
            }
          >
            <X /> Remove field
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" onClick={autoType} className={`${column.field ? "hidden" : ""} ml-3 h-6 px-2 py-0`}>
        Auto type
      </Button>
      <Button
        variant="outline"
        onClick={toggleIdentifier}
        className={`${column.field && !column.exists ? "" : "hidden"} ml-3 h-6 px-2 py-0`}
      >
        {column.identifier ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />} <Key className="h-4 w-4" />
      </Button>
      <CreateFieldDialog
        open={createField}
        setOpen={setCreateField}
        column={column}
        setColumn={setColumn}
        disabled={validating}
      />
    </div>
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
  const [newColumn, setNewColumn] = useState(() => ({ ...column, field: column.field || column.name }));

  useEffect(() => {
    setNewColumn({ ...column, field: column.field || column.name });
  }, [column]);

  function Item({
    label,
    typeGroup,
    type,
  }: {
    typeGroup: AmcatFieldTypeGroup | null;
    type: AmcatFieldType | null;
    label?: string;
  }) {
    return (
      <DropdownMenuItem
        className="flex gap-2"
        onClick={() => setNewColumn({ ...newColumn, typeGroup, type, status: "Validating" })}
      >
        <DynamicIcon type={type} />
        {label || typeGroup}
      </DropdownMenuItem>
    );
  }

  const invalidFieldName = newColumn.field === "_id";

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
        <div className="flex flex-col gap-4 overflow-auto">
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr,10rem]">
            <Input
              placeholder="Field name"
              value={newColumn.field || ""}
              onChange={(e) => setNewColumn({ ...newColumn, field: e.target.value })}
            />
            <DropdownMenu>
              <DropdownMenuTrigger disabled={disabled} className="flex gap-2 rounded sm:ml-auto">
                {newColumn.type ? (
                  <div className="flex gap-3">
                    <DynamicIcon type={newColumn.type} /> {newColumn.type}
                  </div>
                ) : (
                  "Select type"
                )}
                <ChevronDown className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Item label="Text" typeGroup="text" type="text" />
                <Item label="Keyword" typeGroup="keyword" type="keyword" />
                <Item label="Date" typeGroup="date" type="date" />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex gap-2">
                    <DynamicIcon type="number" />
                    Number
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <Item label="Real number (double)" typeGroup="number" type="double" />
                    <Item label="Integer (long)" typeGroup="number" type="integer" />
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <Item label="Boolean" typeGroup="boolean" type="boolean" />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            className=" flex items-center gap-3 "
            onClick={() => {
              setNewColumn({ ...newColumn, identifier: !newColumn.identifier });
            }}
          >
            <Key className="h-6 w-6" />
            <label className="">Use as identifier</label>
            <Checkbox className="ml-[2px] h-5 w-5" checked={newColumn.identifier}>
              Field exists
            </Checkbox>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <HelpCircle className="cursor-pointer text-primary" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Creating a new index field</DialogHeader>
              <p className="text-sm">
                When creating a new index field, you need to pick a name and type. The type indicates how the data will
                be stored in Elasticsearch. Make sure to pick a suitable type, because you won't be able to change this
                after the data has been uploaded.
              </p>
              <p className="text-sm">
                If a field is marked as an <i>identifier</i>, it will be used to prevent duplicate documents (like a
                primary key in SQL). Use a unique identifier (e.g., URL) if available. Use multiple identifiers for
                unique combinations (e.g., author & timestamp). If no identifier is set, only documents that are
                entirely identical will be considered duplicates.
              </p>
            </DialogContent>
          </Dialog>

          {invalidFieldName ? <div className="ml-auto text-destructive">Invalid field name</div> : null}
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newColumn.field || !newColumn.typeGroup || !newColumn.type || invalidFieldName}
              onClick={() => {
                if (!invalidFieldName) setColumn(newColumn);
                setOpen(false);
              }}
            >
              Create
            </Button>
          </div>
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
    if (!field) return { name, field: null, typeGroup: null, type: null, status: "Not used", exists: false };
    return {
      name,
      field: name,
      typeGroup: field.type_group,
      type: field.type,
      status: "Validating",
      identifier: field.identifier,
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
