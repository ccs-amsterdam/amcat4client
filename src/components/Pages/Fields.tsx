import {
  getField,
  getFieldTypeIcon,
  useFieldsWithRefresh,
} from "amcat4react/dist/Amcat";
import { Checkbox, Header, Icon, Table } from "semantic-ui-react";
import { setField } from "../../lib/login";
import { useIndex } from "../../lib/navigation";

export default function Fields() {
  const index = useIndex();
  const [fields, refresh] = useFieldsWithRefresh(index);
  if (index == null || fields == null) return null;

  const set_field_meta = (key: string, field: string, value?: boolean) => {
    const f = getField(fields, field);
    const type = {
      type: f.type,
      meta: { ...f.meta, [key]: value ? "1" : "0" },
    };
    console.log(type);
    setField(index, field, type)
      .then((e) => {
        console.log("OK, refreshing fields!");
        refresh();
      })
      .catch((e) => console.error(e));
  };
  console.log(fields);
  return (
    <>
      <Header>Fields used in {index.index}</Header>
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
                <Icon name={getFieldTypeIcon(f.type)} size="large" />
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
    </>
  );
}
