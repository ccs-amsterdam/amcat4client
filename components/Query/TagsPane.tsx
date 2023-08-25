import {
  Amcat,
  AmcatIndexName,
  AmcatQuery,
  AmcatUser,
} from "../../amcat4react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Confirm, Form, Icon, Input, Label, Table } from "semantic-ui-react";
import { StyledButton } from "../../amcat4react/styled/StyledSemantic";
import { Metric } from "./Summary";

interface TagsPaneProps {
  user: AmcatUser;
  index: AmcatIndexName;
  query: AmcatQuery;
  setQuery: Dispatch<SetStateAction<AmcatQuery>>;
}

export default function TagsPane({
  user,
  index,
  query,
  setQuery,
}: TagsPaneProps) {
  const fields = Amcat.useFields(user, index);

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
        <TagDetails
          user={user}
          index={index}
          query={query}
          setQuery={setQuery}
          field={selectedField}
        />
      )}
    </>
  );
}

interface TagDetailsProps extends TagsPaneProps {
  field: string;
}

function retrieveData(
  user: AmcatUser,
  index: AmcatIndexName,
  query: AmcatQuery,
  field: string,
  setUsage: (usage: Tag[]) => void,
  setMetrics: (metrics: Metric) => void
) {
  console.log("Retrieving usage");
  Amcat.postAggregate(user, index, query, {
    axes: [{ name: "", field: field }],
    limit: 20,
  }).then((d) => {
    setUsage(d.data.data);
  });
  Amcat.postAggregate(user, index, query, {
    metrics: [
      { field: "date", function: "min" },
      { field: "date", function: "max" },
    ],
    axes: [],
  }).then((d) => {
    setMetrics(d.data.data[0]);
  });
}

function TagDetails({ user, index, query, setQuery, field }: TagDetailsProps) {
  const [metrics, setMetrics] = useState<Metric>();
  const [usage, setUsage] = useState<Tag[]>();

  useEffect(() => {
    retrieveData(user, index, query, field, setUsage, setMetrics);
  }, [user, index, query, field, setMetrics, setUsage]);

  function doRefresh() {
    // Amcat.refreshIndex(user, index).then(() => {
    //   retrieveData(index, query, field, setUsage, setMetrics);
    // });
    console.log("ask wouter where the hell refreshIndex is (and what it does)");
  }

  if (metrics == null || usage == null) return <div>Loading data...</div>;

  return (
    <>
      <br />
      <AddToTag
        user={user}
        field={field}
        query={query}
        setQuery={setQuery}
        index={index}
        metrics={metrics}
        usage={usage}
        onChange={doRefresh}
      />
      <TagTable
        user={user}
        index={index}
        query={query}
        setQuery={setQuery}
        field={field}
        metrics={metrics}
        usage={usage}
        onChange={doRefresh}
      />
    </>
  );
}

interface TagTableProps extends TagDetailsProps {
  metrics: Metric;
  usage: Tag[];
  onChange?: () => void;
}

interface Tag {
  [field: string]: string | number;
  n: number;
}
function TagTable({
  user,
  index,
  query,
  setQuery,
  field,
  metrics,
  usage,
  onChange,
}: TagTableProps) {
  const [confirm, setConfirm] = useState<Tag | undefined>();

  function doRemove() {
    if (confirm == null) return;
    Amcat.updateTags(
      user,
      index,
      "remove",
      field,
      confirm[field] as string,
      query
    ).finally(() => {
      setConfirm(undefined);
      if (onChange != null) onChange();
    });
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
    setQuery(q);
  }

  if (usage == null) return null;
  return (
    <>
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {usage.length} Tag{usage.length > 1 ? "s" : ""} in {metrics.n}{" "}
              selected document{metrics.n > 1 ? "s" : ""}
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {usage.map((tag, i) => (
            <Table.Row key={i}>
              <Table.Cell collapsing>
                <Label>{tag[field]}</Label>
              </Table.Cell>
              <Table.Cell>{tag.n} Documents</Table.Cell>
              <Table.Cell collapsing>
                <StyledButton
                  basic
                  primary
                  icon="filter"
                  onClick={() => doFilter(tag)}
                >
                  Filter
                </StyledButton>
              </Table.Cell>
              <Table.Cell collapsing>
                <StyledButton
                  basic
                  negative
                  icon="minus"
                  onClick={() => setConfirm(tag)}
                >
                  Remove from selection
                </StyledButton>
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

function AddToTag({
  user,
  index,
  query,
  setQuery,
  field,
  metrics,
  usage,
  onChange,
}: TagTableProps) {
  const [tagname, setTagName] = useState("");
  const existing = usage.map((tag, i) => ({
    key: i,
    value: tag[field],
    text: tag[field],
  }));
  function submit() {
    Amcat.updateTags(user, index, "add", field, tagname, query).then(() => {
      if (onChange != null) onChange();
    });
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
          <StyledButton type="submit" positive onClick={submit}>
            <Icon name="add" />
            Add documents
          </StyledButton>
        </Form.Group>
      </Form>
    </>
  );
}
