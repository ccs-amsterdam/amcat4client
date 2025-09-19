import { Fragment, useState } from "react";
import { Control, ControllerRenderProps, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel } from "./form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Input } from "./input";
import { Plus, X } from "lucide-react";
import { Button } from "./button";

// Generic form for arrays of objects (with string values).
// Also allows one (and only one) key to have a nested array of objects.
// type TYPE = Record<string, string | Record<string, string>[]>[];

interface FormFieldProps<T extends FieldValues, Z extends z.ZodObject<any>> {
  control: Control<T, any>;
  name: Path<T>;
  label: string;
  schema: Z;
}

function flatHeaders(schema: z.ZodObject<any>) {
  const headers: string[] = [];
  console.log(schema);
  for (let [key, value] of Object.entries(schema.shape)) {
    if (value instanceof z.ZodArray) continue;
    headers.push(key);
  }
  for (let [key, value] of Object.entries(schema.shape)) {
    if (!(value instanceof z.ZodArray)) continue;
    headers.push(...Object.keys(value.element.shape));
  }
  return headers;
}

function flatForms<T extends FieldValues, Z extends z.ZodObject<any>>(
  schema: Z,
  control: Control<T, any>,
  field: ControllerRenderProps<T>,
  rows: z.infer<Z>[],
  i: number,
) {
  const formRows: JSX.Element[][] = [[]];

  for (let [key, value] of Object.entries(schema.shape)) {
    if (!(value instanceof z.ZodString)) continue;
    formRows[0].push(
      <Input
        key={key}
        className="rounded-none  focus-visible:ring-0"
        value={String(rows[i]?.[key] || "")}
        onChange={(v) => {
          if (rows.length < i) rows.push({});
          rows[i][key as keyof z.infer<Z>] = v.target.value as any;
          field.onChange(JSON.stringify(rows));
        }}
      />,
    );
  }

  const fixedFields = formRows[0].length;

  for (let [key, value] of Object.entries(schema.shape)) {
    if (!(value instanceof z.ZodArray)) continue;
    const nestedKeys = Object.keys(value.element.shape);
    const nestedRows = rows[i][key] as Record<string, any>[];
    console.log(nestedRows);

    for (let j = 0; j < nestedRows.length; j++) {
      if (j > 0) {
        formRows.push([]);
        for (let empty = 0; empty < fixedFields; empty++) {
          formRows[j].push(<div key={"empty" + empty} />);
        }
      }
      console.log(formRows, j);

      formRows[j].push(
        ...nestedKeys.map((nestedKey) => (
          <Input
            key={nestedKey}
            className="rounded-none  focus-visible:ring-0"
            value={String(rows[i]?.[key]?.[j]?.[nestedKey] || "")}
            onChange={(v) => {
              rows[i][key][j][nestedKey] = v.target.value;
              field.onChange(JSON.stringify(rows));
            }}
          />
        )),
      );
    }
  }

  console.log(formRows);
  return formRows;
}

export function JSONForm<T extends FieldValues, Z extends z.ZodObject<any>>({
  control,
  name,
  label,
  schema,
}: FormFieldProps<T, Z>) {
  function addRow(field: ControllerRenderProps<T>, values: Z[]) {
    const row: Partial<Z> = {};
    for (let [key, value] of Object.entries(schema.shape)) {
      if (value instanceof z.ZodString) {
        row[key as keyof z.infer<Z>] = "" as any;
      }
      if (value instanceof z.ZodArray) {
        const subkeys = Object.keys(value.element.shape);
        const subkeysObj = subkeys.reduce((acc: any, key) => {
          acc[key] = "";
          return acc;
        }, {});
        row[key as keyof z.infer<Z>] = [subkeysObj] as any;
      }
    }
    values.push(row as Z);
    field.onChange(JSON.stringify(values));
  }

  function addSubRow(field: ControllerRenderProps<T>, values: Z[], i: number) {
    for (let [key, value] of Object.entries(schema.shape)) {
      if (!(value instanceof z.ZodArray)) continue;
      const keys = Object.keys(value.element.shape);
      const subrow: Z = keys.reduce((acc: any, key) => {
        acc[key] = "";
        return acc;
      }, {});
      (values[i][key as keyof z.infer<Z>] as Z[]).push(subrow);
      field.onChange(JSON.stringify(values));
    }
  }

  function rmRow(field: ControllerRenderProps<T>, values: Z[], row: number, subrow: number) {
    if (subrow === 0) {
      values.splice(row, 1);
    } else {
      for (let [key, value] of Object.entries(values[row])) {
        if (Array.isArray(value)) {
          value.splice(subrow, 1);
        }
      }
    }
    field.onChange(JSON.stringify(values));
  }

  const tableHeadStyle = "h-8 px-3 py-1 text-foreground text-base font-thin ";

  return (
    <FormField
      control={control}
      key={name}
      name={name}
      render={({ field }) => {
        console.log(field.value);
        const rows = field.value ? JSON.parse(field.value) : ([] as Z[]);

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Table className="w-full flex-auto table-fixed">
                <TableHeader className="border-">
                  <TableRow className="border-none p-0">
                    {flatHeaders(schema).map((key) => (
                      <TableHead key={key} className={`${tableHeadStyle} pl-0`}>
                        {key}
                      </TableHead>
                    ))}
                    <TableHead className={tableHeadStyle}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {rows.map((row: Z, row_i: number) => (
                    <Fragment key={row_i}>
                      {flatForms(schema, control, field, rows, row_i).map((subRow, subrow_i) => (
                        <TableRow key={row_i + "." + subrow_i} className="border-none hover:bg-transparent">
                          {subRow.map((form, form_i) => (
                            <TableCell
                              key={"cell." + row_i + "." + subrow_i + "." + form_i}
                              className="rounded-none border-none px-0 py-0 pl-0 hover:bg-transparent"
                            >
                              {form}
                            </TableCell>
                          ))}
                          <TableCell key={"add"} className={"rounded-none px-1 py-1 hover:bg-transparent"}>
                            <X
                              className="h-5 w-5 cursor-pointer text-foreground/50 hover:text-destructive"
                              onClick={() => rmRow(field, rows, row_i, subrow_i)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow key={"add sub row" + row_i}>
                        <TableCell className="px-0 py-1 pr-1 hover:bg-transparent">
                          <Button
                            className="h-7 rounded py-2"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              addSubRow(field, rows, row_i);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                  <TableRow key="add row">
                    <TableCell className="px-0 py-1 pr-1 hover:bg-transparent">
                      <Button
                        className="h-7 rounded py-2"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          addRow(field, rows);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

function JSONFormRow<T extends FieldValues, Z extends Record<string, any>>({
  control,
  name,
  schema,
  field,
  rows,
  i,
}: FormFieldProps<T, Z> & {
  field: ControllerRenderProps<T>;
  rows: Z[];
  i: number;
}) {
  const row = rows[i];

  const cellStyle = "py-1 px-1 rounded-none hover:bg-transparent";

  function rmCode(field: ControllerRenderProps<T>, values: Z[], index: number) {
    values.splice(index, 1);
    field.onChange(values);
  }

  return (
    <TableRow key={i} className="border-none hover:bg-transparent">
      {Object.keys(schema.shape).map((key) => (
        <TableCell key={key} className={`${cellStyle} pl-0`}>
          <Input
            value={String(row[key]) || ""}
            onChange={(v) => {
              rows[i][key] = v.target.value;
              field.onChange(rows);
            }}
          />
        </TableCell>
      ))}

      <TableCell className={cellStyle}>
        <X
          className="h-5 w-5 cursor-pointer text-foreground/50 hover:text-destructive"
          onClick={() => rmCode(field, rows, i)}
        />
      </TableCell>
    </TableRow>
  );
}
