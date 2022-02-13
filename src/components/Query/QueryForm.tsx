import { AmcatQuery } from "amcat4react";
import { useState } from "react";
import { Form, Input } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectQuery, setQuery } from "./QuerySlice";

export default function QueryForm() {
  const query = useAppSelector(selectQuery);
  const [queryString, setQueryString] = useState<string>();
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

  return (
    <Form onSubmit={submit}>
      <Form.Group inline>
        <Form.Input
          width="14"
          label="Query"
          placeholder="Query"
          onChange={(_e, d) => setQueryString(d.value)}
        />
        <Form.Button onClick={submit} icon="search" />
      </Form.Group>
    </Form>
  );
}
