import { AmcatQuery } from "amcat4react";
import { useState } from "react";
import { Form, Input } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectQuery, setQuery } from "./QuerySlice";

export default function QueryForm() {
  const query = useAppSelector(selectQuery);
  const [queryString, setQueryString] = useState<string>();
  const [queryRows, setQueryRows] = useState(1);
  const dispatch = useAppDispatch();
  const submit = () => {
    // TODO this can/should be moved to amcat4react
    // (maybe the whole 'flat' query can be?)
    const result: AmcatQuery = {};
    if (queryString !== undefined && queryString.trim() !== "") {
      result.queries = queryString.split("\n").filter((e) => e.trim() !== "");
    }
    console.log({ queryString, result });
    dispatch(setQuery(result));
  };
  const handleQueryChange = (newval: string) => {
    setQueryString(newval);
    const lines =
      newval.trim() == "" ? 1 : newval.trim().split("\n").length + 1;
    if (queryRows != lines) setQueryRows(lines);
  };
  return (
    <Form onSubmit={submit}>
      <Form.Group inline>
        <Form.TextArea
          width="14"
          label="Query"
          placeholder="Query"
          onChange={(_e, d) => handleQueryChange(d.value as string)}
          rows={queryRows}
        />
        <Form.Button onClick={submit} icon="search" />
      </Form.Group>
    </Form>
  );
}
