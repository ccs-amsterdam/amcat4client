import { AmcatFieldElasticType, UpdateAmcatField } from "@/interfaces";
import { Column, jsType } from "./Upload";
import { is } from "date-fns/locale";

export function prepareUploadData(data: Record<string, jsType>[], columns: Column[]) {
  const documents = data.map((row) => {
    const newRow: Record<string, jsType> = {};
    for (const column of columns) {
      if (!column.field) continue;
      if (column.status !== "Ready" && column.status !== "Type mismatch") continue;
      if (column.field === null) continue;

      if (column.type === "date") setCoercedValueOrSkip(newRow, row[column.name], column.field, coerceDate);
      else if (column.type === "number") setCoercedValueOrSkip(newRow, row[column.name], column.field, coerceNumeric);
      else if (column.type === "boolean") setCoercedValueOrSkip(newRow, row[column.name], column.field, coerceBoolean);
      else newRow[column.field] = row[column.name];
    }
    return newRow;
  });

  const hasNewFields = columns.some((c) => c.field && !c.exists);
  if (!hasNewFields) return { documents };

  const new_fields: Record<string, UpdateAmcatField> = {};
  columns.forEach((c) => {
    if (c.field && !c.exists && c.elasticType) {
      new_fields[c.field] = {
        elastic_type: c.elasticType,
        identifier: !!c.identifier,
      };
    }
  });
  return { documents: documents, new_fields };
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

    if (column.type === "keyword") {
      const maxRecommendedLength = 256;
      const tooLong = data.some((d) => String(d[column.name]).length > maxRecommendedLength);
      if (tooLong) {
        return {
          ...column,
          status: "Type mismatch",
          typeWarning: "Contains long strings. Are you sure this isn't a text type?",
        };
      }
    }

    if (column.type === "text" || column.type === "keyword") {
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

    if (column.type === "id") {
      const uniquevalues = new Set(data.map((d) => d[column.name]));
      if (uniquevalues.size !== data.length) {
        return { ...column, status: "Type mismatch", typeWarning: "Duplicate values" };
      }
    }

    if (column.type === "date") {
      const invalidDates = countInvalid(data, column.name, coerceDate);
      if (invalidDates > 0) {
        return { ...column, status: "Type mismatch", typeWarning: `${invalidDates} invalid dates` };
      }
    }

    if (column.type === "number") {
      if (signedIntegerType(column.elasticType)) {
        const invalidIntegers = countInvalid(data, column.name, coerceInteger);
        if (invalidIntegers > 0) {
          return { ...column, status: "Type mismatch", typeWarning: `${invalidIntegers} invalid integers` };
        }
      } else if (unsignedIntegerType(column.elasticType)) {
        const invalidIntegers = countInvalid(data, column.name, coerceUnsignedInteger);
        if (invalidIntegers > 0) {
          return { ...column, status: "Type mismatch", typeWarning: `${invalidIntegers} invalid unsigned integers` };
        }
      } else {
        const invalidFloats = countInvalid(data, column.name, coerceNumeric);
        if (invalidFloats > 0) {
          return { ...column, status: "Type mismatch", typeWarning: `${invalidFloats} invalid numbers` };
        }
      }
    }

    if (column.type === "boolean") {
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
    const num = Number(value);
    if (!isNaN(num)) return num;
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

function signedIntegerType(elasticType: AmcatFieldElasticType | null) {
  return elasticType && ["long", "integer", "short", "byte"].includes(elasticType);
}
function unsignedIntegerType(elasticType: AmcatFieldElasticType | null) {
  return elasticType && ["unsigned_long"].includes(elasticType);
}

function countInvalid(data: Record<string, jsType>[], column: string, validator: (value: jsType) => jsType | null) {
  return data.filter((d) => validator(d[column]) === null).length;
}

function countEmpty(data: Record<string, jsType>[], column: string) {
  return data.filter((d) => d[column] === "").length;
}
