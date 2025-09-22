import { useFields } from "@/api/fields";
import {
  AmcatElasticFieldType,
  AmcatField,
  AmcatFieldType,
  AmcatIndexId,
  UpdateAmcatField,
  UploadOperation,
} from "@/interfaces";
import { AlertCircleIcon, CheckSquare, ChevronDown, Edit, Key, List, Loader, Plus, Square, X } from "lucide-react";
import { MiddlecatUser } from "middlecat-react";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Button } from "../ui/button";
import { autoTypeColumn, prepareUploadData, validateColumns } from "./typeValidation";

import { useMutateArticles } from "@/api/articles";
import { useHasIndexRole } from "@/api/index";
import { useMultimediaConcatenatedList } from "@/api/multimedia";
import { splitIntoBatches } from "@/api/util";
import { toast } from "sonner";
import { CreateFieldInfoDialog, CreateFieldNameInput, CreateFieldSelectType } from "../Fields/CreateField";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import SimpleTooltip from "../ui/simple-tooltip";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
}

export type jsType = string | number | boolean;
export type Status = "Validating" | "Ready" | "Not used" | "Type not set" | "Type mismatch";
interface UploadStatus {
  operation: UploadOperation;
  status: "idle" | "uploading" | "success" | "error";
  error: string | null;
  batch_index: number;
  batches: {
    documents: Record<string, any>[];
    fields?: Record<string, UpdateAmcatField>;
    operation: UploadOperation;
  }[];
  successes: number;
  failures: number;
}

export interface Column {
  name: string;
  field: string | null;
  type: AmcatFieldType | null;
  elastic_type: AmcatElasticFieldType | null;
  status: Status;
  exists: boolean;
  typeWarning?: string;
  identifier?: boolean;
  invalidExamples?: string[];
}

// TODO: Operation is currently not working (always uses index)

export default function Upload({ user, indexId }: Props) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const isAdmin = useHasIndexRole(user, indexId, "ADMIN");
  const [data, setData] = useState<Record<string, jsType>[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const { mutateAsync: mutateArticles } = useMutateArticles(user, indexId);
  const unusedFields = useMemo(() => {
    if (!fields) return [];
    return fields.filter((f) => !columns.find((c) => c.field === f.name));
  }, [fields, columns]);
  const [validating, setValidating] = useState(false);
  const [operation, setOperation] = useState<UploadOperation>("create");
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

  const multimediaPrefixes = useMemo(() => {
    // If there are multimedia columns, grab all prefixes from the keys
    // (not external urls). This is used to fetch the list of existing
    // multimedia items, but only within the specified prefixes (aka directories)
    const prefixes = new Set<string>();
    for (const column of columns) {
      if (column.type === "image" || column.type === "video") {
        for (const row of data) {
          const value = String(row[column.name]);
          if (/^https?:\/\//.test(value)) continue;
          const prefix = value?.replace(/\/[^/]*$/, "/");
          prefixes.add(prefix);
        }
      }
    }
    return Array.from(prefixes);
  }, [data, columns]);
  const multimedia = useMultimediaConcatenatedList(user, indexId, multimediaPrefixes);

  useEffect(() => {
    const needsValidation = columns.filter((c) => c.status === "Validating");
    if (needsValidation.length === 0) {
      setValidating(false);
      return;
    }
    setValidating(true);

    // need to wait until multimedia is collected to perform validation
    if (multimediaPrefixes.length > 0 && !multimedia) return;

    validateColumns(columns, data, multimedia).then((newColumns) => {
      setColumns(newColumns);
    });
  }, [columns, data, multimedia, multimediaPrefixes]);

  useEffect(() => {
    // upload batches
    if (uploadStatus.status !== "uploading") return;
    const batch = uploadStatus.batches[uploadStatus.batch_index];
    mutateArticles(batch)
      .then((result) => {
        if (uploadStatus.batch_index === uploadStatus.batches.length - 1) {
          setUploadStatus((uploadStatus) => ({ ...uploadStatus, status: "success" }));
          let operationMessage = operation === "index" ? "created or updated" : "created";
          setData([]);
          setColumns([]);
          toast.success(
            `Upload complete: ${operationMessage} ${uploadStatus.successes + result.successes} / ${
              uploadStatus.successes + result.successes + uploadStatus.failures + result.failures.length
            } documents. `,
          );
        } else {
          setUploadStatus((uploadStatus) => ({
            ...uploadStatus,
            batch_index: uploadStatus.batch_index + 1,
            successes: uploadStatus.successes + result.successes,
            failures: uploadStatus.failures + result.failures.length,
          }));
        }
      })
      .catch((e) => {
        setUploadStatus((uploadStatus) => ({ ...uploadStatus, status: "error", error: e.message }));
        // toast.error("Upload failed");
      });
  }, [uploadStatus]);

  const duplicates = useMemo(() => hasDuplicates(data, columns), [data, columns]);
  const nonePending = columns.length > 0 && columns.every((c) => !["Validating", "Type not set"].includes(c.status));
  const ready = !duplicates && nonePending && columns.some((c) => c.status === "Ready" || c.status === "Type mismatch");
  const warn = columns.some((c) => c.status === "Type mismatch");

  async function startUpload() {
    if (!ready) return;
    const batches = splitIntoBatches(data, 100);
    setUploadStatus({
      operation,
      status: "uploading",
      error: null,
      batch_index: 0,
      batches: batches.map((batch) => prepareUploadData(batch, columns, operation, multimedia)),
      successes: 0,
      failures: 0,
    });
  }

  function setColumn(column: Column) {
    let newColumn = { ...column };

    if (!column.exists && column.field !== null) {
      const uniqueFields = new Set(columns.filter((c) => c.field !== newColumn.field).map((c) => c.field));
      fields?.forEach((f) => uniqueFields.add(f.name));
      let suffix = "";
      let i = 2;
      while (uniqueFields.has(`${column.field}${suffix}`)) {
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

  function renderOperationLabel(operation: UploadOperation) {
    switch (operation) {
      case "create":
        return "Create";
      case "update":
        return "Create or update";
      case "index":
        return "Create or replace";
    }
  }

  function renderExistingField(fields: AmcatField[] | Column[], identifier = false, newField = false) {
    let anyNotUsed = false;
    return (
      <div className="flex flex-wrap gap-3">
        {fields.map((field) => {
          const used = columns.find((c) => c.field === field.name);
          if (!used && !newField) anyNotUsed = true;
          return (
            <div
              key={field.name}
              className={`${
                newField || !!used ? "" : "bg-destructive text-destructive-foreground"
              } flex gap-3 rounded-lg border  p-2  `}
            >
              <DynamicIcon type={field.type} />
              <div className="flex w-full justify-between gap-3">
                <div className="font-bold ">{field.name}</div>
              </div>
            </div>
          );
        })}
        {anyNotUsed ? (
          <div className="flex items-center gap-3">
            <AlertCircleIcon className="h-6 w-6 text-warn" />
            <div>Some {identifier ? "identifiers" : "fields"} are not used</div>
          </div>
        ) : null}
      </div>
    );
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

  const identifiers = fields.filter((f) => f.identifier);
  const otherFields = fields.filter((f) => !f.identifier);
  const newIdentifiers = columns.filter((c) => c.identifier && !c.exists && c.field);
  const newFields = columns.filter((c) => !c.identifier && !c.exists && c.field);

  return (
    <div className="flex flex-col gap-4">
      <CSVUploader fields={fields} setData={setData} setColumns={setColumns} />
      <div className={`flex flex-col gap-8 ${data.length === 0 ? "hidden" : ""}`}>
        <div>
          <div className="md: grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            <div className={` ${identifiers.length === 0 ? "hidden" : ""}`}>
              <h3 className="prose-xl w-full">Existing index identifiers</h3>
              {renderExistingField(identifiers, true)}
            </div>
            <div className={` ${otherFields.length === 0 ? "hidden" : ""}`}>
              <h3 className="prose-xl w-full">Existing index fields</h3>
              {renderExistingField(otherFields, false)}
            </div>
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
        <div className="md: grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <div className={` ${newIdentifiers.length === 0 ? "hidden" : ""}`}>
            <h3 className="prose-xl w-full">Creating Index identifiers</h3>
            {renderExistingField(newIdentifiers, true, true)}
          </div>
          <div className={` ${newFields.length === 0 ? "hidden" : ""}`}>
            <h3 className="prose-xl w-full">Creating Index fields</h3>
            {renderExistingField(newFields, false, true)}
          </div>
        </div>
        <div className="flex items-center">
          <Button disabled={!ready} onClick={onUpload}>
            Upload {data.length || ""} documents
          </Button>
          <Dialog open={noIdentifierWarning} onOpenChange={() => setNoIdentifierWarning(false)}>
            <DialogContent>
              <DialogHeader className="text-lg font-bold">Are you sure you don't need identifiers?</DialogHeader>
              <p>
                If you select one or multiple identifiers (by clicking on the key button), they will be used to uniquely
                identify documents. It can be a unique field like a <b>URL</b>, but also a combination of fields like{" "}
                <b>author + timestamp</b>. Identifiers prevent accidentally uploading duplicate documents, and you can
                use them to update existing documents.
              </p>
              <p>
                If no identifiers are specified before uploading the first data, you will not be able to add them later.
                Each document will then get a unique ID, and you will only be able to update documents by this internal
                ID.
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
                  {renderOperationLabel(operation)}
                  <ChevronDown className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="max-w-md">
                  <DropdownMenuItem
                    onClick={() => setOperation("create")}
                    className="flex-col items-start justify-start"
                  >
                    <span className="">Create</span>
                    <div className=" text-foreground/60">
                      If document (identifier) already exists, skip the document
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!isAdmin}
                    onClick={() => setOperation("update")}
                    className="flex-col items-start justify-start"
                  >
                    <span className="">
                      Create or update{" "}
                      {isAdmin ? "" : <span className="rounded bg-warn px-1 text-warn-foreground">admin only</span>}
                    </span>
                    <span className="text-foreground/60">
                      If document (identifier) already exists, add or overwrite the uploaded fields. (existing fields
                      that are not in the uploaded data will not not be removed)
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {warn ? (
              <div className="ml-4 flex items-center gap-2">
                <AlertCircleIcon className="h-6 w-6 text-secondary" />
                <div>Some fields have type mismatches. These will become missing values</div>
              </div>
            ) : null}
            {duplicates ? (
              <div className="ml-4 flex items-center gap-2">
                <AlertCircleIcon className="h-6 w-6 text-warn" />
                <div>Some documents have duplicate identifiers</div>
              </div>
            ) : null}
          </div>
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

  let examples: ReactNode = null;
  if (column.invalidExamples) {
    examples = (
      <TooltipContent className="bg-background">
        <div className="flex max-h-56 flex-col gap-2 overflow-auto">
          <div className="font-bold">Examples of invalid values</div>
          <div className="flex flex-col gap-1 ">
            {column.invalidExamples.map((ex) => (
              <div key={ex} className="max-w-[80vw] overflow-hidden text-ellipsis text-foreground/60">
                {ex}
              </div>
            ))}
          </div>
        </div>
      </TooltipContent>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {icon}
      <Tooltip>
        <TooltipTrigger>{text}</TooltipTrigger>
        {examples}
      </Tooltip>
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

  const isNew = column.field && !column.exists;

  return (
    <div className="flex items-center gap-2">
      {/* {isNew ? <div className="h-6 rounded bg-secondary px-1 py-[2px] text-secondary-foreground">NEW</div> : null} */}
      <SimpleTooltip text={column.exists ? "This is an identifier field" : "Should new column be used as identifier?"}>
        <Button
          variant="ghost"
          className={` mr-2 h-min rounded-full p-0 ${
            !column.type || (column.exists && !column.identifier) ? "hidden" : ""
          }`}
        >
          <Key
            onClick={(e) => {
              if (!column.exists) setColumn({ ...column, identifier: !column.identifier });
            }}
            className={` cursor-target text-secondary-foregroundf h-7 w-7  rounded-full p-1 ${
              column.identifier ? "bg-secondary" : "border bg-gray-100 text-transparent"
            }`}
          />
        </Button>
      </SimpleTooltip>
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center gap-2 rounded p-2 pl-0 `}>
          {column.field ? (
            <>
              <DynamicIcon type={column.type} className="h-7 w-7" />
              <div className="text-left leading-3">
                <div className="font-bold text-primary">{column.field}</div>
                <div className="text-sm italic text-foreground/60">{column.type}</div>
              </div>
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
                        type: field.type,
                        elastic_type: field.elastic_type,
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
                type: null,
                elastic_type: null,
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
        automate
      </Button>

      <CreateFieldDialog
        open={createField}
        setOpen={setCreateField}
        column={column}
        setColumn={setColumn}
        disabled={validating}
        fields={fields}
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
  fields,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  column: Column;
  setColumn: (column: Column) => void;
  disabled?: boolean;
  fields: AmcatField[];
}) {
  const [newColumn, setNewColumn] = useState(() => ({ ...column, field: column.field || column.name }));
  const [error, setError] = useState("");
  useEffect(() => {
    setNewColumn({ ...column, field: column.field || column.name, exists: false });
  }, [column]);

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
        <div className="flex flex-col gap-4 overflow-auto p-1">
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr,10rem]">
            <CreateFieldNameInput
              name={newColumn.field}
              setName={(name) => setNewColumn({ ...newColumn, field: name })}
              setError={setError}
              fields={fields}
            />
            <CreateFieldSelectType
              type={newColumn.type}
              setType={(type) => setNewColumn({ ...newColumn, status: "Validating", type })}
            />
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
          <CreateFieldInfoDialog />
          {error ? <div className="ml-auto text-destructive">{error}</div> : null}
          <div className="ml-auto flex gap-2">
            <Button
              disabled={!newColumn.field || !newColumn.type || !!error}
              onClick={() => {
                if (!error) setColumn(newColumn);
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
        skipEmptyLines
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
    if (!field) return { name, field: null, type: null, elastic_type: null, status: "Not used", exists: false };
    return {
      name,
      field: name,
      type: field.type,
      elastic_type: field.elastic_type,
      status: "Validating",
      identifier: field.identifier,
      exists: true,
    };
  });

  const data = importedData
    .slice(1)
    .map((row) => {
      const obj: Record<string, jsType> = {};
      row.forEach((cell, i) => {
        obj[columns[i].name] = cell;
      });
      return obj;
    })
    .filter((row) => {
      // remove row if all cells are empty (because papaparse  sometimes fails to remove them)
      return Object.values(row).some((cell) => cell !== null && cell !== undefined && cell !== "");
    });

  setData(data);
  setColumns(columns);
}

function hasDuplicates(data: Record<string, jsType>[], columns: Column[]) {
  let identifiers = columns.filter((c) => c.identifier).map((c) => c.name);
  if (identifiers.length === 0) identifiers = columns.map((c) => c.name);
  const ids = data.map((doc) => {
    const idCols = identifiers.map((id) => doc[id]);
    return JSON.stringify(idCols);
  });
  const uniqueIds = new Set(ids);
  return ids.length !== uniqueIds.size;
}
