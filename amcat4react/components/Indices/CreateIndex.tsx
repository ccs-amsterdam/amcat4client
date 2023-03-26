import React from "react";
import { Button, Modal } from "semantic-ui-react";
import { createIndex, errorToString } from "../../Amcat";
import { AmcatIndex, AmcatUser } from "../../interfaces";
import IndexDetailsForm from "./IndexDetailsForm";

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
  const [loading, setLoading] = React.useState(false);
  const [index, setIndex] = React.useState({} as AmcatIndex);

  const handleSubmit = () => {
    if (!index) return;
    setLoading(true);
    createIndex(user, index)
      .then(() => {
        setOpen(false);
        setLoading(false);
        setError("");
        onCreate();
      })
      .catch((err) => {
        console.log(err);
        const detail = err.response.data.detail;
        if (detail.message == "resource_already_exists_exception") {
          setError("An index with this name already exists");
        } else {
          setError(errorToString(err));
        }
        setLoading(false);
      });
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button positive>Create New Index</Button>}
    >
      <Modal.Header>Create new Index</Modal.Header>
      <Modal.Content>
        <IndexDetailsForm index={index} error={error} onChange={setIndex} />
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button positive onClick={handleSubmit} disabled={index?.id == null || index.id.length === 0} loading={loading}>
          Create Index
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
