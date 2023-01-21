import { useEffect, useState } from "react";
import { Form } from "semantic-ui-react";
import { useFields, getField } from "../../Amcat";
import FilterPicker from "./FilterPicker";
import { QueryFormProps } from "./QueryForm";
import AddFilterButton, { fieldOptions } from "./AddFilterButton";
import { queryFromString, queryToString } from "./libQuery";
import styled from "styled-components";
import { StyledButton } from "../../styled/StyledSemantic";

const MultiLineForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  .querycol {
    flex-grow: 3;
    padding-right: 1em;
  }
  .filtercol {
    width: 30em;
  }
  textarea {
    width: 100%;
    border-radius: var(--rounding) !important;
    border-color: rgba(34, 36, 38, 0.15);
  }
  .submit {
    position: absolute;
    bottom: 0;
    right: 1em;
  }
`;

const FilterList = styled.div`
  .filter {
    vertical-align: middle;
    display: flex;
    padding-bottom: 2px;
  }
  .filterlabel {
    width: 8em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .filterdelete {
    padding-left: 0.5em;
  }
  .filter .filterpicker {
    width: 20em;
  }
  .valuepicker {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100% !important;
  }
`;

export default function MultilineQueryForm({
  user,
  index,
  value,
  onSubmit,
}: QueryFormProps) {
  const fields = useFields(user, index);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (value?.queries) setQ(queryToString(value.queries));
    else setQ("");
  }, [value?.queries]);

  if (!index || !fields) return null;

  function addFilter(name: string) {
    const filters = value?.filters || {};
    onSubmit({ ...value, filters: { ...filters, [name]: {} } });
  }

  function deleteFilter(name: string) {
    const f = { ...value.filters };
    delete f[name];
    console.log(f);
    onSubmit({ ...value, filters: f });
  }

  function handleKeyDown(event: any) {
    if (event.key === "Enter" && event.ctrlKey) {
      console.log({ q, queries: queryFromString(q) });
      onSubmit({ ...value, queries: queryFromString(q) });
    }
  }

  const hint = "(use control+Enter to submit; label queries with label=query)";
  return (
    <MultiLineForm>
      <Form className="querycol">
        <b>Query:</b> {hint}
        <br />
        <Form.TextArea
          rows={8}
          style={{ BorderRadius: "15px" }}
          placeholder={hint}
          onChange={(_, { value }) => setQ(value as string)}
          onKeyDown={handleKeyDown}
          value={q || ""}
        />
        <StyledButton
          fluid
          primary
          content="Submit Query"
          onClick={() => onSubmit({ ...value, queries: queryFromString(q) })}
        />
      </Form>

      <FilterList>
        <b>Filters:</b>
        <br />
        <div className="filterlist">
          {Object.keys(value?.filters || {}).map((f, i) => (
            <div className="filter" key={i}>
              <div className="filterlabel">{f}:</div>
              <div className="filterpicker">
                <FilterPicker
                  circular
                  basic
                  fluid
                  key={i}
                  user={user}
                  index={index}
                  field={getField(fields, f)}
                  value={value?.filters?.[f]}
                  onChange={(newval) =>
                    onSubmit({
                      ...value,
                      filters: { ...value?.filters, [f]: newval },
                    })
                  }
                />
              </div>
              <div className="filterdelete">
                <StyledButton
                  icon="delete"
                  circular
                  onClick={() => deleteFilter(f)}
                />
              </div>
            </div>
          ))}
          <div className="filter">
            <div className="filterlabel"></div>
            <div className="filterpicker">
              <AddFilterButton
                options={fieldOptions(fields, value)}
                onClick={(field) => {
                  addFilter(field);
                }}
              />
            </div>
          </div>
        </div>

        <br />
      </FilterList>
    </MultiLineForm>
  );
}
