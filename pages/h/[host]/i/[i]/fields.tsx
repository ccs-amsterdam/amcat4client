import { Amcat, AmcatField } from "../../../../../amcat4react";
import { useState } from "react";
import { Checkbox, Form, Header, Icon, Table } from "semantic-ui-react";
import { useRouter } from "next/router";
import useUser from "../../../../../hooks/useUser";

const FIELDS = [
  "date",
  "keyword",
  "long",
  "tag",
  "text",
  "url",
  "double",
  "id",
  "object",
  "geo_point",
];

export default function Fields() {
  const user = useUser();
  const router = useRouter();
  const index = router.query.i as string;

  const [fields, refresh] = Amcat.useFieldsWithRefresh(user, index);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("keyword");
  const [newFieldError, setNewFieldError] = useState<string>();

  if (!user || index == null || fields == null) return null;

  const fieldOptions = FIELDS.map((f) => ({
    value: f,
    key: f,
    text: f,
    icon: Amcat.getFieldTypeIcon(f),
  }));

  const set_field_meta = (key: string, field: string, value?: boolean) => {
    const f = Amcat.getField(fields, field);
    if (f == null) return;
    const type = {
      type: f.type,
      meta: { ...f.meta, [key]: value ? "1" : "0" },
    };
    Amcat.setField(user, index, field, type)
      .then((e) => {
        refresh();
      })
      .catch((e) => console.error(e));
  };

  function validateFieldName(name: string) {
    if (newFieldName.trim() === "") return "Please enter a field name";
    return null;
  }

  function addField() {
    if (user == null) return;

    const error = validateFieldName(newFieldName);
    if (error != null) {
      setNewFieldError(error);
      return;
    }
    setNewFieldError(undefined);
    if (index == null) return;
    const f = { name: newFieldName, type: newFieldType } as AmcatField;
    Amcat.addFields(user, index, [f]).then(() => {
      refresh();
    });
  }

  return (
    <>
      <Header>Fields used in {index}</Header>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Field</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Show in list</Table.HeaderCell>
            <Table.HeaderCell>Show in article</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((f) => (
            <Table.Row key={f.name}>
              <Table.Cell>
                <Icon name={Amcat.getFieldTypeIcon(f.type)} size="large" />
              </Table.Cell>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>
                <Checkbox
                  toggle
                  checked={f.meta?.amcat4_display_table === "1"}
                  onChange={(_, data) =>
                    set_field_meta("amcat4_display_table", f.name, data.checked)
                  }
                />
              </Table.Cell>

              <Table.Cell>
                <Checkbox
                  toggle
                  checked={f.meta?.amcat4_display_meta !== "0"}
                  onChange={(_, data) =>
                    set_field_meta("amcat4_display_meta", f.name, data.checked)
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            error={newFieldError}
            label="Field name"
            placeholder="Field name"
            value={newFieldName}
            onChange={(_, d) => setNewFieldName(d.value as string)}
          />
          <Form.Dropdown
            fluid
            selection
            label="Field type"
            value={newFieldType}
            options={fieldOptions}
            onChange={(_, d) => setNewFieldType(d.value as string)}
          />
          <Form.Button onClick={() => addField()} positive label="&nbsp;">
            <Icon name="add" />
            Add field
          </Form.Button>
        </Form.Group>
      </Form>
    </>
  );
}
