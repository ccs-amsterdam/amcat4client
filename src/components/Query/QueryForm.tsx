import { AmcatFilters, AmcatQuery, Filter } from "amcat4react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Form, FormGroup, Grid, Ref, TextArea } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectIndex } from "../Menu/LoginSlice";
import { selectQuery, setQuery } from "./QuerySlice";

export default function QueryForm() {
  // Use separate state from redux so we only dispatch when button pressed
  //TODO set state from redux
  const index = useAppSelector(selectIndex);
  const [filters, setFilters] = useState<AmcatFilters>({});
  const [queryString, setQueryString] = useState<string>("");
  const [queryRows, setQueryRows] = useState(1);
  const textAreaRef = useRef(null);
  const dispatch = useAppDispatch();
  const submit = () => {
    // TODO this can/should be moved to amcat4react
    // (maybe the whole 'flat' query can be?)
    const result: AmcatQuery = { filters };
    if (queryString !== undefined && queryString.trim() !== "") {
      result.queries = queryString.split("\n").filter((e) => e.trim() !== "");
    }
    dispatch(setQuery(result));
  };
  const handleKeyPress = (e: any, d: any) => {
    // Enter to submit, shift+enter for new row
    if (e.charCode === 13 && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  useEffect(() => {
    const qlines =
      queryString.trim() === "" ? 1 : queryString.trim().split("\n").length + 1;
    const nfilters = Object.keys(filters).length;
    const lines = Math.max(qlines, nfilters);
    if (queryRows !== lines) setQueryRows(lines);
  }, [queryString, filters]);

  const movecursor = queryString && !queryString.endsWith("\n");
  let textarea_value = "";
  if (queryString != null && queryString.trim() !== "")
    textarea_value = queryString.trim() + "\n";
  useEffect(() => {
    // If we added an extra \n, set the cursor to before it
    if (movecursor && queryString && textAreaRef.current) {
      const ta = textAreaRef.current as any; //.getElementsByTagName("textarea");
      ta.selectionStart = queryString.length;
      ta.selectionEnd = queryString.length;
    }
  });
  console.log(queryRows);
  return (
    <Form onSubmit={submit}>
      <Grid>
        <Grid.Column width={10} stretched>
          <Ref innerRef={textAreaRef}>
            <TextArea
              style={{
                height: "100%",
              }}
              rows={queryRows}
              width="14"
              placeholder="Query"
              onChange={(_e, d) => setQueryString(d.value as string)}
              value={textarea_value}
              onKeyPress={handleKeyPress}
              title="(press enter to search. Use
             shift+enter or the arrow keys to enter additional queries)"
            />
          </Ref>
        </Grid.Column>
        <Grid.Column width={5}>
          {index == null ? null : (
            <Filter index={index} value={filters} onChange={setFilters} />
          )}
        </Grid.Column>
        <Grid.Column width={1}>
          <Form.Button onClick={submit} icon="search" />
        </Grid.Column>
      </Grid>
    </Form>
  );
}
