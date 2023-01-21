import { useState } from "react";
import {
  Container,
  Message,
  Dimmer,
  Loader,
  Modal,
  Header,
} from "semantic-ui-react";
import { StyledButton } from "../../styled/StyledSemantic";
import { createDocuments } from "../../Amcat";

const REQUIRED_FIELDS = ["title", "date", "text"];

export default function SubmitButton({ index, data, columns, fields, reset }) {
  const [loading, setLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const notReady =
    !index || !columns || data.length <= 1 || columns.length !== data[0].length;
  if (notReady) return null;

  let newfields = new Set();
  //let hasDuplicates = false;
  for (let column of columns) {
    //if (field.has(column.field)) hasDuplicates = true
    newfields.add(column.field);
  }

  const missingRequired = [];
  for (let required of REQUIRED_FIELDS) {
    if (!newfields.has(required)) missingRequired.push(required);
  }

  const onSubmit = async () => {
    const [documents, missing] = prepareData(data, columns);

    setLoading(true);
    try {
      const columnMapping = columns.reduce((mapping, column) => {
        if (column.type === "auto") return mapping;
        if (fields[column.name]) return mapping;
        mapping[column.name] = column.type;
        return mapping;
      }, {});
      const res = await createDocuments(index, documents, columnMapping);

      setLoading(false);
      setSubmittedMessage({ missing, n: res.data.length });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const missingRequiredMessage = () => {
    if (missingRequired.length === 0) return null;
    return (
      <Message>
        Some required fields are not used: <b>{missingRequired.join(", ")}</b>
      </Message>
    );
  };

  return (
    <Container>
      <Dimmer>
        <Loader active={loading} />
      </Dimmer>
      {missingRequiredMessage()}

      <StyledButton
        disabled={notReady || missingRequired.length > 0}
        fluid
        onClick={onSubmit}
      >
        Upload Articles
      </StyledButton>
      <SubmittedMessage
        submittedMessage={submittedMessage}
        setSubmittedMessage={setSubmittedMessage}
        reset={reset}
      />
    </Container>
  );
}

const SubmittedMessage = ({ submittedMessage, setSubmittedMessage, reset }) => {
  if (!submittedMessage) return null;

  const ifMissingDate = () => {
    const n = submittedMessage.missing.date;
    if (n === 0) return;
    return (
      <p>
        Skipped <b>{n}</b> article{n === 1 ? "" : "s"} because <i>date</i> was
        missing
      </p>
    );
  };

  const ifMissingTitle = () => {
    const n = submittedMessage.missing.title;
    if (n === 0) return null;
    return (
      <p>
        Replaced <b>{n}</b> missing title{n === 1 ? "" : "s"} with "NA"
      </p>
    );
  };

  const ifMissingText = () => {
    const n = submittedMessage.missing.text;
    if (n === 0) return null;
    return (
      <p>
        Replaced <b>{n}</b> missing text{n === 1 ? "" : "s"} with "NA"
      </p>
    );
  };

  return (
    <Modal
      open
      onClose={() => {
        reset();
        setSubmittedMessage(null);
      }}
    >
      <Modal.Header>Uploaded articles</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            Created <b>{submittedMessage.n}</b> new articles
          </Header>
          {ifMissingDate()}
          {ifMissingTitle()}
          {ifMissingText()}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={"Cool, thanks"}
          labelPosition="right"
          icon="checkmark"
          positive
          onClick={() => {
            reset();
            setSubmittedMessage(null);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

const prepareData = (data, columns) => {
  const fieldIndex = columns.reduce((obj, column, i) => {
    if (column.field) obj[column.field] = i;
    return obj;
  }, {});

  let missing = {
    date: 0,
    title: 0,
    text: 0,
  };

  const rows = data.slice(1).reduce((rows, row, i) => {
    const datarow = Object.keys(fieldIndex).reduce((obj, field) => {
      obj[field] = row[fieldIndex[field]];
      return obj;
    }, {});

    if (!datarow["date"]) {
      missing.date += 1;
      return rows;
    }
    if (!datarow["title"]) {
      datarow["title"] = "NA";
      missing.title += 1;
    }
    if (!datarow["text"]) {
      datarow["text"] = "NA";
      missing.text += 1;
    }

    rows.push(datarow);
    return rows;
  }, []);

  return [rows, missing];
};
