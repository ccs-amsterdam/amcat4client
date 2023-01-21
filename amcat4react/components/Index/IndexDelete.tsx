import { useState } from "react";
import { Header, Icon, Modal, Dimmer, Loader } from "semantic-ui-react";
import { deleteIndex } from "../../Amcat";
import { AmcatIndexName, AmcatUser } from "../../interfaces";
import { StyledButton } from "../../styled/StyledSemantic";

interface IndexDeleteProps {
  user: AmcatUser;
  index: AmcatIndexName;
  open: boolean;
  onClose: (deleted: boolean) => void;
}

export default function IndexDelete({
  user,
  index,
  open,
  onClose,
}: IndexDeleteProps) {
  const [status, setStatus] = useState("inactive");

  const onSubmit = () => {
    setStatus("pending");
    deleteIndex(user, index)
      .then((res) => {
        // maybe check for 201 before celebrating
        setStatus("inactive");
        onClose(true);
      })
      .catch((e) => {
        console.log(e);
        setStatus("error");
      });
  };

  return (
    <Modal
      closeIcon
      open={open}
      onClose={() => {
        onClose(false);
      }}
      onOpen={() => {
        setStatus("awaiting input");
      }}
    >
      <Header icon="trash" content={`Delete Index ${index}`} />
      <Modal.Content>
        <p>Do you really want to delete this Index?</p>
      </Modal.Content>
      <Modal.Actions>
        {status === "error" ? (
          <div>
            Could not delete index for a reason not yet covered in the error
            handling...
          </div>
        ) : null}
        {status === "pending" ? (
          <Dimmer active inverted>
            <Loader content="Creating Index" />
          </Dimmer>
        ) : (
          <>
            <StyledButton color="red" onClick={() => onClose(false)}>
              <Icon name="remove" /> No
            </StyledButton>
            <StyledButton color="green" onClick={onSubmit}>
              <Icon name="checkmark" /> Yes
            </StyledButton>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}
