import { AmcatFieldType, UpdateAmcatField } from "@/interfaces";
import { Column, jsType } from "./Upload";

export function prepareUploadData(data: Record<string, jsType>[], columns: Column[]) {
  const documents = data.map((row) => {
    const newRow: Record<string, jsType> = {};
    for (const column of columns) {
      if (!column.field) continue;
      if (column.status !== "Ready" && column.status !== "Type mismatch") continue;
      if (column.field === null) continue;

      if (column.typeGroup === "date") setCoercedValueOrSkip(newRow, row[column.name], column.field, coerceDate);
      else if (column.typeGroup === "number")
        setCoercedValueOrSkip(newRow, row[column.name], column.field, coerceNumeric);
      else if (column.typeGroup === "boolean")
        setCoercedValueOrSkip(newRow, row[column.name], column.field, coerceBoolean);
      else newRow[column.field] = row[column.name];
    }
    return newRow;
  });

  const hasNewFields = columns.some((c) => c.field && !c.exists);
  if (!hasNewFields) return { documents };

  const fields: Record<string, UpdateAmcatField> = {};
  columns.forEach((c) => {
    if (c.field && !c.exists && c.type) {
      fields[c.field] = {
        type: c.type,
        identifier: !!c.identifier,
      };
    }
  });
  return { documents: documents, fields };
}

export function autoTypeColumn(data: Record<string, jsType>[], name: string): Column {
  const field = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/^_/, "");

  const column: Column = { name, field, typeGroup: null, type: null, status: "Validating", exists: false };

  const isDate = countInvalid(data, name, coerceDate) / data.length < 0.2;
  if (isDate) return { ...column, typeGroup: "date", type: "date" };

  const isNumber = countInvalid(data, name, coerceNumeric) / data.length < 0.2;
  if (isNumber) {
    const isInt = countInvalid(data, name, coerceInteger) === 0;
    if (isInt) return { ...column, typeGroup: "number", type: "integer" };
    return { ...column, typeGroup: "number", type: "double" };
  }

  const isBoolean = countInvalid(data, name, coerceBoolean) === 0;
  if (isBoolean) return { ...column, typeGroup: "boolean", type: "boolean" };

  const pctUnique = percentUnique(data, name);
  if (pctUnique < 0.5 && !hasValueLongerThan(data, name, 256))
    return { ...column, typeGroup: "keyword", type: "keyword" };

  return { ...column, typeGroup: "text", type: "text" };
}
function setCoercedValueOrSkip(
  row: Record<string, jsType>,
  value: jsType,
  field: string,
  coercer: (value: jsType) => jsType | null,
) {
  const coerced = coercer(value);
  if (coerced === null) return;
  row[field] = coerced;
}

export async function validateColumns(columns: Column[], data: Record<string, jsType>[]): Promise<Column[]> {
  return columns.map((column) => {
    if (column.status !== "Validating") return column;

    if (column.typeGroup === "keyword") {
      if (hasValueLongerThan(data, column.name, 256)) {
        return {
          ...column,
          status: "Type mismatch",
          typeWarning: "Contains long strings. Are you sure this isn't a text type?",
        };
      }
    }

    if (column.typeGroup === "text" || column.typeGroup === "keyword") {
      const empty = countEmpty(data, column.name);
      if (empty > 0) {
        return { ...column, status: "Type mismatch", typeWarning: `${empty} empty values` };
      }
      if (countInvalid(data, column.name, coerceNumeric) === 0) {
        return {
          ...column,
          status: "Type mismatch",
          typeWarning: "Contains only numeric values. Are you sure this isn't a number type?",
        };
      }
    }

    if (column.typeGroup === "id") {
      const uniquevalues = new Set(data.map((d) => d[column.name]));
      if (uniquevalues.size !== data.length) {
        return { ...column, status: "Type mismatch", typeWarning: "Duplicate values" };
      }
    }

    if (column.typeGroup === "date") {
      const invalidDates = countInvalid(data, column.name, coerceDate);
      if (invalidDates > 0) {
        return { ...column, status: "Type mismatch", typeWarning: `${invalidDates} invalid dates` };
      }
    }

    if (column.typeGroup === "number") {
      if (signedIntegerType(column.type)) {
        const invalidIntegers = countInvalid(data, column.name, coerceInteger);
        if (invalidIntegers > 0) {
          return { ...column, status: "Type mismatch", typeWarning: `${invalidIntegers} invalid integers` };
        }
      } else if (unsignedIntegerType(column.type)) {
        const invalidIntegers = countInvalid(data, column.name, coerceUnsignedInteger);
        if (invalidIntegers > 0) {
          return { ...column, status: "Type mismatch", typeWarning: `${invalidIntegers} invalid unsigned integers` };
        }
      } else {
        const invalidDoubles = countInvalid(data, column.name, coerceNumeric);
        if (invalidDoubles > 0) {
          return { ...column, status: "Type mismatch", typeWarning: `${invalidDoubles} invalid numbers` };
        }
      }
    }

    if (column.typeGroup === "boolean") {
      const invalidBooleans = countInvalid(data, column.name, coerceBoolean);
      if (invalidBooleans > 0) {
        return { ...column, status: "Type mismatch", typeWarning: `${invalidBooleans} invalid booleans` };
      }
    }

    return { ...column, status: "Ready" };
  });
}

function coerceNumeric(value: jsType) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    // if a number doesn't start with a number > 0, it's not a number
    if (/^[1-9]/.test(value)) {
      const num = Number(value);
      if (!isNaN(num)) return num;
    }
  }
  return null;
}

function coerceInteger(value: jsType) {
  const num = coerceNumeric(value);
  if (num === null) return null;
  if (Number.isInteger(num)) return num;
  return null;
}

function coerceUnsignedInteger(value: jsType) {
  const num = coerceInteger(value);
  if (num === null) return null;
  if (num < 0) return null;
  return num;
}

function coerceDate(value: jsType) {
  if (typeof value !== "string") return null;

  if (!value.includes("Z")) value += "Z";
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  if (value.includes(":")) return date.toISOString();
  return date.toISOString().split("T")[0];
}

function coerceBoolean(value: jsType) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  if (typeof value === "number") {
    if (value === 0) return false;
    if (value === 1) return true;
  }
  return null;
}

function signedIntegerType(type: AmcatFieldType | null) {
  return type && ["long", "integer", "short", "byte"].includes(type);
}
function unsignedIntegerType(type: AmcatFieldType | null) {
  return type && ["unsigned_long"].includes(type);
}

function countInvalid(data: Record<string, jsType>[], column: string, validator: (value: jsType) => jsType | null) {
  return data.filter((d) => validator(d[column]) === null).length;
}

function countEmpty(data: Record<string, jsType>[], column: string) {
  return data.filter((d) => d[column] === "").length;
}

function percentUnique(data: Record<string, jsType>[], column: string) {
  const unique = new Set(data.map((d) => d[column])).size;
  return unique / data.length;
}

function hasValueLongerThan(data: Record<string, jsType>[], column: string, max: number) {
  return data.some((d) => String(d[column]).length > max);
}
