import { AmcatQuery } from "amcat4react";
import { useEffect, useRef, useState } from "react";
import { Form, Ref, TextArea } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectQuery, setQuery } from "./QuerySlice";

export default function QueryForm() {
  const query = useAppSelector(selectQuery);
  const [queryString, setQueryString] = useState<string>();
  const [queryRows, setQueryRows] = useState(1);
  const textAreaRef = useRef(null);
  const dispatch = useAppDispatch();
  const submit = () => {
    // TODO this can/should be moved to amcat4react
    // (maybe the whole 'flat' query can be?)
    const result: AmcatQuery = {};
    if (queryString !== undefined && queryString.trim() !== "") {
      result.queries = queryString.split("\n").filter((e) => e.trim() !== "");
    }
    dispatch(setQuery(result));
  };
  const handleQueryChange = (newval: string) => {
    setQueryString((state) => newval);
    const lines =
      newval.trim() == "" ? 1 : newval.trim().split("\n").length + 1;
    if (queryRows != lines) setQueryRows(lines);
  };
  const handleKeyPress = (e: any, d: any) => {
    // Enter to submit, shift+enter for new row
    if (e.charCode == 13 && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };
  const movecursor = queryString && !queryString.endsWith("\n");
  let textarea_value = "";
  if (queryString != null && queryString.trim() != "")
    textarea_value = queryString.trim() + "\n";
  useEffect(() => {
    // If we added an extra \n, set the cursor to before it
    if (movecursor && queryString && textAreaRef.current) {
      const ta = textAreaRef.current as any; //.getElementsByTagName("textarea");
      ta.selectionStart = queryString.length;
      ta.selectionEnd = queryString.length;
    }
  });
  return (
    <Form onSubmit={submit}>
      <Form.Group inline style={{ alignItems: "start" }}>
        <label style={{ paddingTop: "10px" }}>Query</label>
        <Ref innerRef={textAreaRef}>
          <TextArea
            style={{ alignItems: "start" }}
            width="14"
            placeholder="Query"
            onChange={(_e, d) => handleQueryChange(d.value as string)}
            value={textarea_value}
            onKeyPress={handleKeyPress}
            rows={queryRows}
            title="(press enter to search. Use
             shift+enter or the arrow keys to enter additional queries)"
          />
        </Ref>
        <Form.Button onClick={submit} icon="search" />
      </Form.Group>
    </Form>
  );
}
