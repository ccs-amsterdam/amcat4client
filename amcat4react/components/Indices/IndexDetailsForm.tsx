import { ChangeEvent, useState } from "react";
import { Form, Icon, Input, Message, Popup, TextArea } from "semantic-ui-react";
import { AmcatIndex, AmcatRole } from "../../interfaces";

interface Props {
  index?: AmcatIndex;
  onChange?: (index: AmcatIndex) => void;
  error?: string;
  nameError?: string;
  disable_id?: boolean;
}

const GUESTROLES = [
  {
    key: "NONE",
    text: "None (only authorized users can use this index)",
    value: "NONE",
  },
  {
    key: "METAREADER",
    text: "Metareader (unauthorized users cannot read full text)",
    value: "METAREADER",
  },
  {
    key: "READER",
    text: "Reader (unauthorized users can read all data)",
    value: "READER",
  },
  {
    key: "WRITER",
    text: "Writer (unauthorized users can change all data)",
    value: "WRITER",
  },
  {
    key: "ADMIN",
    text: "Admin (unauthorized have full control)",
    value: "ADMIN",
  },
];

export default function IndexDetailsForm({ index, onChange, error, nameError, disable_id }: Props) {
  const [namePopupOpen, setNamePopupOpen] = useState(false);
  if (!index) return null;

  const indexidChange = (e: ChangeEvent<HTMLInputElement>, data: any) => {
    // Enforce index naming rules
    const original = data.value;
    let val = original.toLowerCase();
    val = val.replace(/^[_+-]/g, "");
    val = val.replace(/[\\/*?"|,#:<>]/g, "");
    onChange && onChange({ ...index, id: val });

    // Open naming rule hints if changed
    if (val != original) setNamePopupOpen(true);
    // Not sure if this is the best way to preserve the cursor location?
    let newpos = (e.target.selectionEnd || 0) + val.length - original.length;
    setTimeout(() => {
      e.target.setSelectionRange(newpos, newpos);
    }, 0);
  };

  return (
    <Form error={error != null && error.length > 0}>
      <Form.Field error={nameError} required={!disable_id} disabled={disable_id}>
        <label>
          Index name
          {disable_id ? null : (
            <Popup
              wide
              trigger={<Icon name="info circle" />}
              open={namePopupOpen}
              onOpen={() => setNamePopupOpen(true)}
              onClose={() => setNamePopupOpen(false)}
            >
              Index naming rules:
              <br />
              - Lowercase only
              <br />
              - Cannot start with _, - or +<br />
              - Cannot include spaces
              <br />- Cannot include any of: \ / * ? " | , # : &lt; &gt;
            </Popup>
          )}
        </label>
        <Input placeholder="Index name" value={index.id} onChange={indexidChange} />
      </Form.Field>
      <Form.Field>
        <label>
          Guest role
          <Popup wide="very" trigger={<Icon name="info circle" />}>
            Role for users that are not explicitly added to the project. Values: <br />
            - None: Only authorized users can access this project <br />
            - Metareader: Unauthorized users can see metadata and conduct queries, but not access the full text of
            documents
            <br />
            - Reader: Unauthorized users can see all data in the project
            <br />
            - Writer: Unauthorized users can add or change data in the project <br />
            - Admin: Unauthorized users have full admin rights on the project
            <br />
          </Popup>
        </label>
        <Form.Dropdown
          selection
          options={GUESTROLES}
          value={index.guest_role == null ? "NONE" : index.guest_role}
          onChange={(_, { value }) => onChange && onChange({ ...index, guest_role: value as AmcatRole })}
        />
      </Form.Field>
      <Form.Field>
        <label>
          Display Name
          <Popup wide="very" trigger={<Icon name="info circle" />}>
            An optional name for the index that will be displayed to users
          </Popup>
          <Input value={index.name} onChange={(_, { value }) => onChange && onChange({ ...index, name: value })} />{" "}
        </label>
      </Form.Field>
      <Form.Field>
        <label>
          Description
          <Popup wide="very" trigger={<Icon name="info circle" />}>
            An optional description for the index that can be displayed to users
          </Popup>
          <TextArea
            value={index.description || ""}
            onChange={(_, { value }) => onChange && onChange({ ...index, description: value as string })}
          ></TextArea>
        </label>
      </Form.Field>
      <Message error content={error} />
    </Form>
  );
}
