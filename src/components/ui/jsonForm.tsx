import { useState } from "react";
import { Control, ControllerRenderProps, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel } from "./form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Input } from "./input";
import { X } from "lucide-react";
import { Button } from "./button";

// THIS COMPONENT IS EXPERIMENTAL AND MAY CHANGE OR BE REMOVED IN FUTURE RELEASES.
// It tries to standardize a way to have a form field for json data.
// however, it would only work for non-nested data anyway, and I just saw we have
// nested jsons too, so maybe this is not the best approach.
// maybe use YAML instead

interface FormFieldProps<T extends FieldValues, Z extends Record<string, any>> {
  control: Control<T, any>;
  name: Path<T>;
  schema: z.ZodObject<Z>;
}

export function JSONForm<T extends FieldValues, Z extends Record<string, any>>({
  control,
  name,
  schema,
}: FormFieldProps<T, Z>) {
  function addRow(field: ControllerRenderProps<T>, values: Z[]) {
    const keys = Object.keys(schema.shape);
    const row: Z = keys.reduce((acc: any, key) => {
      acc[key] = undefined;
      return acc;
    }, {});
    values.push(row);
    field.onChange(JSON.stringify(values));
  }

  const tableHeadStyle = "h-8 px-3 py-1 text-foreground text-base font-thin ";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const rows = field.value ? JSON.parse(field.value) : ([] as Z[]);

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{name}</FormLabel>
            <FormControl>
              <Table className="">
                <TableHeader className="border-">
                  <TableRow className="border-none p-0">
                    {Object.keys(schema.shape).map((key) => (
                      <TableHead key={key} className={`${tableHeadStyle} pl-0`}>
                        {key}
                      </TableHead>
                    ))}
                    <TableHead className={tableHeadStyle}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {rows.map((row, i) => {
                    return <JSONFormRow key={i} {...{ control, name, field, schema, rows, i }} />;
                  })}

                  <TableRow>
                    <TableCell className="px-0 py-1 pr-1 hover:bg-transparent">
                      <Button
                        className="h-7 w-full justify-start rounded px-3 py-2"
                        onClick={(e) => {
                          e.preventDefault();
                          addRow(field, rows);
                        }}
                      >
                        Add Code
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
