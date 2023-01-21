import Axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SemanticICONS } from "semantic-ui-react";
import { AggregationOptions, AmcatDocument, AmcatField, AmcatFilters } from ".";
import { AmcatUser, AmcatIndexName, AmcatQuery } from "./interfaces";

/** Get index details / check if an index exists */
export function getIndex(user: AmcatUser, index: string) {
  return user.api.get(`/index/${index}`);
}

/** Create an index */
export function createIndex(user: AmcatUser, name: string, guestRole = "NONE") {
  const body: any = { name: name };
  if (guestRole !== "NONE") body.guest_role = guestRole;
  return user.api.post(`/index/`, body);
}

/** Get the list of indices on this server */
export async function getIndices(user: AmcatUser) {
  return user.api.get(`/index/`);
}

export function createDocuments(
  user: AmcatUser,
  index: AmcatIndexName,
  documents: AmcatDocument[],
  columns = {}
) {
  // documentList should be an array of objects with at least the fields title, date and text
  return user.api.post(`index/${index}/documents`, { documents, columns });
}

/** DELETE this index */
export function deleteIndex(user: AmcatUser, index: AmcatIndexName) {
  // This is silly, but using api(index) with url "" doesn't work :(
  return user.api.delete(`/index/${index}`);
}

/** POST an AmcatQuery and fetch the resulting articles */
export function postQuery(
  user: AmcatUser,
  index: AmcatIndexName,
  query: AmcatQuery,
  params: any
) {
  return user.api.post(`index/${index}/query`, { ...query, ...params });
}

/** List all fields in this index */
export function getFields(user: AmcatUser, index: AmcatIndexName) {
  return user.api.get(`/index/${index}/fields`);
}

/** Add fields to this index */
export function addFields(
  user: AmcatUser,
  index: AmcatIndexName,
  fields: AmcatField[]
) {
  const body = Object.fromEntries(fields.map((f) => [f.name, f.type]));
  return user.api.post(`index/${index}/fields`, body);
}

/** Get the values for a field
 */
export function getFieldValues(
  user: AmcatUser,
  index: AmcatIndexName,
  field: string
) {
  return user.api.get(`index/${index}/fields/${field}/values`);
}

/** POST an aggregate query to AmCAT
 * @param index Index name
 * @param query A Query to determine which documents will be aggregated (e.g. SQL where)
 * @param axes The aggregation axes (e.g. SQL group by)
 * @param setData Callback function that will be called with the data after a succesful call
 * @param setError Callback function that will be called with an error message on failure
 */
export function postAggregate(
  user: AmcatUser,
  index: AmcatIndexName,
  query: AmcatQuery,
  options: AggregationOptions
) {
  const params: any = { ...query };
  if (options?.axes) params["axes"] = options.axes;
  if (options?.metrics) params["aggregations"] = options.metrics;
  return user.api.post(`index/${index}/aggregate`, params);
}

export function describeError(e: AxiosError): string {
  if (e.response) return `HTTP error ${e.response.status}`;
  if (e.request) return "No reply from server";
  return "Something went wrong trying to query the AmCAT backend";
}

export function addFilter(q: AmcatQuery, filters: AmcatFilters): AmcatQuery {
  if (q == null) q = {};
  return { queries: { ...q.queries }, filters: { ...q.filters, ...filters } };
}

/** Hook to get fields from amcat which allows for refreshing the cache
 * @param index Login information for this index
 * @returns a tuple [field objects, refresh callback]
 */
export function useFieldsWithRefresh(
  user: AmcatUser | undefined,
  index: AmcatIndexName | undefined
): [fields: AmcatField[], refresh: () => void] {
  function _getSetFields(
    index: AmcatIndexName | undefined,
    setFields: (fields: AmcatField[]) => void
  ): void {
    if (user == null || index == null) setFields([]);
    else
      getFields(user, index)
        .then((res: any) => {
          setFields(Object.values(res.data));
        })
        .catch((e: Error) => {
          console.error(e);
          setFields([]);
        });
  }

  const [fields, setFields] = useState<AmcatField[]>([]);
  useEffect(() => _getSetFields(index, setFields), [index]);
  const refresh = () => _getSetFields(index, setFields);

  return [Object.values(fields), refresh];
}

/** Hook to get fields from amcat
 * @param index Login information for this index
 * @returns a list of field objects
 */
export function useFields(
  user: AmcatUser,
  index: AmcatIndexName | undefined
): AmcatField[] {
  return useFieldsWithRefresh(user, index)[0];
}

/*** Hook to get field values from AmCAT
 * @param index Login information for this index
 * @param field Name of the field
 * @returns a list of values (strings)
 */

export function useFieldValues(
  user: AmcatUser,
  index: AmcatIndexName,
  field: string
): string[] {
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    getFieldValues(user, index, field)
      .then((d) => setValues(d.data))
      .catch(() => {
        setValues([]);
      });
  }, [index, field, setValues]);

  return values;
}

export function getField(
  fields: AmcatField[],
  fieldname: string
): AmcatField | undefined {
  const i = fields.map((f) => f.name).indexOf(fieldname);
  if (i === -1) return undefined;
  return fields[i];
}

const ICONS: { [field: string]: SemanticICONS } = {
  date: "calendar alternate outline",
  keyword: "list",
  long: "chart line",
  tag: "tags",
  text: "file text",
  url: "linkify",
  double: "sort numeric up",
  id: "id badge",
  object: "braille",
  geo_point: "location arrow",
};

export function getFieldTypeIcon(fieldtype: string) {
  return ICONS[fieldtype];
}

/** Update tags by query
 * @param index Index name
 * @param action add or remove
 * @param field Name of the tag field
 * @param tag Tag to add or remove
 * @param query A Query to determine which documents will be updated
 */
export function updateTags(
  user: AmcatUser,
  index: AmcatIndexName,
  action: "add" | "remove",
  field: string,
  tag: string,
  query: AmcatQuery
) {
  return user.api.post(`index/${index}/tags_update`, {
    action,
    field,
    tag,
    ...query,
  });
}

export function setField(
  user: AmcatUser,
  index: AmcatIndexName,
  field: string,
  type: any
) {
  const body = { [field]: type };
  return user.api.post(`index/${index}/fields`, body);
}
