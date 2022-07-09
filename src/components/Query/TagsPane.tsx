import { Amcat, AmcatIndex, AmcatQuery } from "amcat4react";
import { useFields } from "amcat4react/dist/Amcat";
import { fieldOptions } from "amcat4react/dist/Query/SimpleQueryForm";
import { useEffect, useState } from "react";
import {
  Button,
  Confirm,
  Divider,
  Dropdown,
  Form,
  Header,
  Input,
  Label,
  Table,
} from "semantic-ui-react";
import { useAppDispatch } from "../app/hooks";
import { setQuery } from "./QuerySlice";
import { Metric } from "./Summary";

interface TagsPaneProps {
  index: AmcatIndex;
  query: AmcatQuery;
}

export default function TagsPane({ index, query }: TagsPaneProps) {
  const fields = useFields(index);
  const tags =
    fields == null
      ? []
      : fields.filter((f) => f.type === "tag").map((f) => f.name);
  const def = tags.length === 0 ? "" : tags.includes("tag") ? "tag" : tags[0];
  const [selectedField, setSelectedField] = useState(def);
  if (fields == null || tags.length === 0) return null;
  if (selectedField === "" && def !== "") setSelectedField(def);
  const tagFieldOptions = tags.map((f) => ({ value: f, key: f, text: f }));
  return (
    <>
      <Form.Dropdown
        inline
        label="Tag field: "
        selection
        fluid
        options={tagFieldOptions}
        value={selectedField}
      />
      {selectedField == null ? null : (
        <TagDetails index={index} query={query} field={selectedField} />
      )}
    </>
  );
}

interface TagDetailsProps extends TagsPaneProps {
  field: string;
}

function TagDetails({ index, query, field }: TagDetailsProps) {
  const [metrics, setMetrics] = useState<Metric>();
  const [usage, setUsage] = useState<Tag[]>();

  useEffect(() => {
    Amcat.postAggregate(index, query, {
      axes: [{ field: field }],
      limit: 20,
      display: "list",
    }).then((d) => {
      setUsage(d.data.data);
    });
    Amcat.postAggregate(index, query, {
      display: "linechart",
      metrics: [
        { field: "date", function: "min" },
        { field: "date", function: "max" },
      ],
      axes: [],
    }).then((d) => {
      console.log(d);
      setMetrics(d.data.data[0]);
    });
  }, [index, query, field, setMetrics, setUsage]);
  if (metrics == null || usage == null) return <div>Loading data...</div>;
  return (
    <>
      <br />
      <AddToTag
        field={field}
        query={query}
        index={index}
        metrics={metrics}
        usage={usage}
      />
      <TagTable
        field={field}
        query={query}
        index={index}
        metrics={metrics}
        usage={usage}
      />
    </>
  );
}

interface TagTableProps extends TagDetailsProps {
  metrics: Metric;
  usage: Tag[];
}

interface Tag {
  [field: string]: string | number;
  n: number;
}
function TagTable({ index, query, field, metrics, usage }: TagTableProps) {
  const [confirm, setConfirm] = useState<Tag | undefined>();
  const dispatch = useAppDispatch();

  function doRemove() {
    if (confirm == null) return;
    Amcat.updateTags(
      index,
      "remove",
      field,
      confirm[field] as string,
      query
    ).finally(() => setConfirm(undefined));
  }

  function doFilter(tag: Tag) {
    const q = { ...query };
    const value = tag[field] as string;
    if (q?.filters?.[field] != null) {
      let values = q.filters[field].values || [];
      values = Array.from(new Set([...values, value]));
      q.filters = {
        ...q.filters,
        [field]: {
          ...q.filters[field],
          values: values,
        },
      };
    } else {
      q.filters = { ...q.filters, [field]: { values: [value] } };
    }
    dispatch(setQuery(q));
  }

  if (usage == null) return null;
  return (
    <>
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {usage.length} Tag{usage.length > 1 ? "s" : ""} in {metrics.n}{" "}
              document{metrics.n > 1 ? "s" : ""}
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {usage.map((tag) => (
            <Table.Row>
              <Table.Cell collapsing>
                <Label>{tag[field]}</Label>
              </Table.Cell>
              <Table.Cell>{tag.n} Documents</Table.Cell>
              <Table.Cell collapsing>
                <Button
                  basic
                  primary
                  icon="filter"
                  onClick={() => doFilter(tag)}
                >
                  Filter
                </Button>
              </Table.Cell>
              <Table.Cell collapsing>
                <Button
                  basic
                  negative
                  icon="minus"
                  onClick={() => setConfirm(tag)}
                >
                  Remove tag
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Confirm
        open={confirm != null}
        header={
          confirm == null
            ? ""
            : `Remove tag '${confirm[field]}' from ${confirm.n} documents?`
        }
        content="Note: This cannot be undone"
        onConfirm={() => doRemove()}
        onCancel={() => setConfirm(undefined)}
      />
    </>
  );
}

function AddToTag({ index, query, field, metrics, usage }: TagTableProps) {
  const [tagname, setTagName] = useState("");
  const existing = usage.map((tag, i) => ({
    key: i,
    value: tag[field],
    text: tag[field],
  }));
  function submit() {
    Amcat.updateTags(index, "add", field, tagname, query);
    // TODO: refresh
    // TODO: existing tags, need to retrieve all values from DB somehow, probably instead of metrics
  }

  return (
    <>
      <Form>
        <Form.Group inline>
          Add selected {metrics.n} document{metrics.n > 1 ? "s" : ""} to: &nbsp;
          <Form.Dropdown
            placeholder="Select existing tag"
            selection
            options={existing}
          />
          (or)&nbsp;&nbsp;
          <Input
            value={tagname}
            placeholder="Add new tag"
            onChange={(_, d) => setTagName(d.value as string)}
          />
          &nbsp;&nbsp;
          <Button type="submit" icon="add" positive onClick={submit}>
            Add documents
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}
