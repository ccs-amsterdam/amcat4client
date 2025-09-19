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

export function JSONForm<T extends FieldValues, Z extends z.ZodObject<any>>({
  control,
  name,
  label,
  schema,
}: FormFieldProps<T, Z>) {
  const tableHeadStyle = "h-8 px-3 py-1 text-foreground text-base font-thin ";

  return (
    <FormField
      control={control}
      key={name}
      name={name}
      render={({ field }) => {
        const rows = field.value ? JSON.parse(field.value) : ([] as Z[]);
        const rowIndices = rows.map((_: Z, i: number) => i);
        rowIndices.push(rows.length);

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Table className="w-full flex-auto table-fixed">
                <TableHeader className="border-">
                  <TableRow className="border-none p-0 hover:bg-transparent">
                    {flatHeaders(schema).map((key) => (
                      <TableHead key={key} className={`${tableHeadStyle} pl-0`}>
                        {key}
                      </TableHead>
                    ))}
                    <TableHead className={`${tableHeadStyle} w-4 `}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {rowIndices.map((row_i: number) => (
                    <Fragment key={row_i}>
                      {flatForms(schema, control, field, rows, row_i).map((subRow, subrow_i, arr) => (
                        <TableRow
                          key={row_i + "." + subrow_i}
                          className={`${rows.length <= row_i ? "opacity-50" : ""} border-none hover:bg-transparent `}
                        >
                          {subRow.map((form, form_i) => (
                            <TableCell
                              key={"cell." + row_i + "." + subrow_i + "." + form_i}
                              className={`${arr.length > 1 && subrow_i === arr.length - 1 ? "pb-3" : "pb-1"} rounded-none border-none px-0 pl-0 pr-1 pt-0 hover:bg-transparent`}
                            >
                              {form}
                            </TableCell>
                          ))}
                          <TableCell
                            key={"add"}
                            className={`${rows.length <= row_i ? "invisible" : ""} rounded-none px-1 py-1 hover:bg-transparent`}
                          >
                            <X
                              className="h-5 w-5 cursor-pointer text-foreground/50 hover:text-destructive"
                              onClick={() => {
                                const values = rmRow(rows, row_i, subrow_i);
                                field.onChange(JSON.stringify(values));
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

function addRow<Z extends z.ZodObject<any>>(schema: Z, values: Z[]) {
  const newValues = [...values];
  const row: Partial<Z> = {};

  for (let [key, value] of Object.entries(schema.shape)) {
    if (value instanceof z.ZodString) {
      row[key as keyof z.infer<Z>] = "" as any;
    }
    if (value instanceof z.ZodArray) {
      row[key as keyof z.infer<Z>] = [] as any;
      // const subkeys = Object.keys(value.element.shape);
      // const subkeysObj = subkeys.reduce((acc: any, key) => {
      //   acc[key] = "";
      //   return acc;
      // }, {});
      // row[key as keyof z.infer<Z>] = [subkeysObj] as any;
    }
  }
  newValues.push(row as Z);
  return newValues;
}

function addSubRow<Z extends z.ZodObject<any>>(schema: Z, values: Z[], i: number) {
  const newValues = [...values];
  for (let [key, value] of Object.entries(schema.shape)) {
    if (!(value instanceof z.ZodArray)) continue;
    const keys = Object.keys(value.element.shape);
    const subrow: Z = keys.reduce((acc: any, key) => {
      acc[key] = "";
      return acc;
    }, {});
    const addToRow = newValues[i][key as keyof z.infer<Z>] as Z[];
    addToRow.push(subrow);
  }
  return newValues;
}

function rmRow<Z extends z.ZodObject<any>>(values: Z[], row: number, subrow: number) {
  const newValues = [...values];
  if (subrow === 0) {
    newValues.splice(row, 1);
  } else {
    for (let [key, value] of Object.entries(newValues[row])) {
      if (Array.isArray(value)) {
        value.splice(subrow, 1);
      }
    }
  }
  return newValues;
}

function flatHeaders(schema: z.ZodObject<any>) {
  const headers: string[] = [];
  for (let [key, value] of Object.entries(schema.shape)) {
    if (value instanceof z.ZodString) headers.push(key);
  }
  for (let [key, value] of Object.entries(schema.shape)) {
    if (value instanceof z.ZodArray) headers.push(...Object.keys(value.element.shape));
  }

  return headers;
}

function flatForms<T extends FieldValues, Z extends z.ZodObject<any>>(
  schema: Z,
  control: Control<T, any>,
  field: ControllerRenderProps<T>,
  rows: Z[],
  i: number,
) {
  const formRows: JSX.Element[][] = [[]];
  let newRows: any = [...rows];

  const formStyle = "rounded-none border-none bg-gray-200 dark:bg-gray-600 focus-visible:ring-0";

  for (let [key, value] of Object.entries(schema.shape)) {
    if (!(value instanceof z.ZodString)) continue;
    formRows[0].push(
      <Input
        key={key}
        className={formStyle}
        value={String(newRows[i]?.[key] || "")}
        onChange={(v) => {
          if (newRows.length <= i) newRows = addRow(schema, newRows);
          newRows[i][key as keyof z.infer<Z>] = v.target.value as any;
          field.onChange(JSON.stringify(newRows));
        }}
      />,
    );
  }

  const fixedFields = formRows[0].length;

  for (let [key, value] of Object.entries(schema.shape)) {
    if (!(value instanceof z.ZodArray)) continue;
    const nestedKeys = Object.keys(value.element.shape);
    let nestedRows = newRows[i] ? newRows[i][key].length : 0;

    for (let j = 0; j < nestedRows + 1; j++) {
      if (j > 0) {
        formRows.push([]);
        for (let empty = 0; empty < fixedFields; empty++) {
          formRows[j].push(<div key={"empty" + empty} />);
        }
      }

      formRows[j].push(
        ...nestedKeys.map((nestedKey) => (
          <Input
            key={nestedKey}
            className={formStyle}
            value={String(newRows[i]?.[key]?.[j]?.[nestedKey] || "")}
            onChange={(v) => {
              if (newRows.length <= i) newRows = addRow(schema, newRows);
              if (newRows[i][key].length <= j) newRows = addSubRow(schema, newRows, i);
              newRows[i][key][j][nestedKey] = v.target.value;
              field.onChange(JSON.stringify(newRows));
            }}
          />
        )),
      );
    }
  }

  return formRows;
}
