import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAmcatIndex, setAmcatIndices } from "../actions";
import { Button, Header, Icon, Modal, Dimmer, Loader } from "semantic-ui-react";

const DeleteAmcatIndex = ({ amcatIndex }) => {
  const amcat = useSelector((state) => state.amcat);
  const dispatch = useDispatch();

  const [status, setStatus] = useState("inactive");

  const onSubmit = (event) => {
    setStatus("pending");
    amcat
      .deleteIndex(amcatIndex.name)
      .then((res) => {
        // maybe check for 201 before celebrating

        if (amcat) {
          amcat.getIndices().then((res) => {
            dispatch(selectAmcatIndex(null));
            dispatch(setAmcatIndices(res.data));
          });
        }
        setStatus("inactive");
      })
      .catch((e) => {
        console.log(e.message);
        console.log(e);
        setStatus("error");
      });
  };

  return (
    <Modal
      closeIcon
      open={status !== "inactive"}
      trigger={
        <Button disabled={!amcatIndex} name="delete index">
          <Icon name="minus" /> Delete Index
        </Button>
      }
      onClose={() => {
        setStatus("inactive");
      }}
      onOpen={() => {
        setStatus("awaiting input");
      }}
    >
      <Header
        icon="trash"
        content={`Delete Index ${amcatIndex ? amcatIndex.name : null}`}
      />
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
            <Button color="red" onClick={onSubmit}>
              <Icon name="remove" /> No
            </Button>
            <Button color="green" onClick={onSubmit}>
              <Icon name="checkmark" /> Yes
            </Button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteAmcatIndex;
