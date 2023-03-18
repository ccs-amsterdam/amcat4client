import React, { ChangeEvent } from "react";
import { useQuery, UseQueryResult } from "react-query";
import {
  Button,
  Form,
  Icon,
  Input,
  Message,
  Modal,
  Popup,
} from "semantic-ui-react";
import { createIndex } from "../../Amcat";
import { AmcatUser } from "../../interfaces";

const GUESTROLES = [
  {
    key: "none",
    text: "None (only authorized users can use this index)",
    value: "none",
  },
  {
    key: "metareader",
    text: "Metareader (unauthorized users cannot read full text)",
    value: "metareader",
  },
  {
    key: "reader",
    text: "Reader (unauthorized users can read all data)",
    value: "reader",
  },
  {
    key: "writer",
    text: "Writer (unauthorized users can change all data)",
    value: "writer",
  },
  {
    key: "admin",
    text: "Admin (unauthorized have full control)",
    value: "admin",
  },
];

interface Props {
  user: AmcatUser;
  onCreate: () => void;
}
export default function CreateIndices({ user, onCreate }: Props) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [namePopupOpen, setNamePopupOpen] = React.useState(false);
  const [indexname, setIndexname] = React.useState("");
  const [guestrole, setGuestrole] = React.useState("none");
  const [canCreate, setCanCreate] = React.useState(false);

  const createIndexQuery = useQuery(
    ["create-index"],
    async () => {
      console.log(indexname);
      await createIndex(user, indexname, guestrole.toUpperCase());
    },
    {
      enabled: false,
      onSuccess: () => {
        setOpen(false);
        onCreate();
      },
      onError: (err: any) => setError(err.message),
      retry: false,
    }
  );

  const indexnameChange = (e: ChangeEvent<HTMLInputElement>, data: any) => {
    // Enforce index naming rules
    const original = data.value;
    let val = original.toLowerCase();
    val = val.replace(/^[_+-]/g, "");
    val = val.replace(/[\\/*?"|,#:<>]/g, "");
    setIndexname(val);
    // Open naming rule hints if changed, enable submit as appropriate
    if (val != original) setNamePopupOpen(true);
    setCanCreate(val.length > 0);

    // Not sure if this is the best way to preserve the cursor location?
    let newpos = (e.target.selectionEnd || 0) + val.length - original.length;
    setTimeout(() => {
      e.target.setSelectionRange(newpos, newpos);
    }, 0);
  };

  const handleSubmit = () => {
    createIndexQuery.refetch();
    console.log(createIndexQuery);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Create Index</Button>}
    >
      <Modal.Header>Create new Index</Modal.Header>
      <Modal.Content>
        <Form error={error.length > 0}>
          <Form.Field>
            <label>
              Index name
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
            </label>
            <Input
              placeholder="Index name"
              value={indexname}
              onChange={indexnameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>
              Guest role
              <Popup wide="very" trigger={<Icon name="info circle" />}>
                Role for users that are not explicitly added to the project.
                Values: <br />
                - None: Only authorized users can access this project <br />
                - Metareader: Unauthorized users can see metadata and conduct
                queries, but not access the full text of documents
                <br />
                - Reader: Unauthorized users can see all data in the project
                <br />
                - Writer: Unauthorized users can add or change data in the
                project <br />
                - Admin: Unauthorized users have full admin rights on the
                project
                <br />
              </Popup>
            </label>
            <Form.Dropdown
              selection
              options={GUESTROLES}
              value={guestrole}
              onChange={(event, data) => setGuestrole(data.value as string)}
            />
          </Form.Field>
          <Message error header="Error" content={error} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          positive
          onClick={handleSubmit}
          disabled={!canCreate || createIndexQuery.isLoading}
        >
          Create Index
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
