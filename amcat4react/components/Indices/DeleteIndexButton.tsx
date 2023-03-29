import React from "react";
import { Button, Icon, Modal } from "semantic-ui-react";
import { AmcatUser } from "../../interfaces";

interface Props {
  user: AmcatUser;
  index: string;
  onDelete?: (index: string) => void;
}

export default function DeleteIndexButton({ user, index, onDelete }: Props) {
  const [open, setOpen] = React.useState(false);
  const trigger = (
    <Button icon color="red">
      <Icon name="trash alternate outline" />
      Delete
    </Button>
  );
  return (
    <>
      <Modal
        size="small"
        basic
        open={open}
        trigger={trigger}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Modal.Header icon>
          <Icon name="archive" />
          Are you sure?
        </Modal.Header>
        <Modal.Content>
          This will delete «{index}». This action cannot be undone!
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button positive>Delete Index «{index}»</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
