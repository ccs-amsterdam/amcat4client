import { AxiosResponse } from "axios";
import { ReactNode, useState } from "react";
import { Button, Message, Modal, ModalProps } from "semantic-ui-react";
import { errorToString } from "../../Amcat";

interface Props extends ModalProps {
  onSubmit?: () => Promise<AxiosResponse> | undefined;
  onSuccess?: () => void;
  onClose?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  header: string;
  children: ReactNode;
}

export default function ModalForm({
  onSubmit,
  onSuccess,
  submitLabel,
  submitDisabled,
  header,
  children,
  onClose,
  ...other
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Modal onClose={onClose} {...other}>
      <Modal.Header content={header} />
      <Modal.Content>
        {children} {error && <Message error content={error} />}
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={onClose} content="Cancel" />
        <Button
          positive
          onClick={() => {
            if (!onSubmit) return setOpen(false);
            setLoading(true);
            const result = onSubmit();
            if (result == null) return;
            result
              .then(() => {
                setLoading(false);
                setError("");
                if (onSuccess) onSuccess();
                if (onClose) onClose();
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
                setError(errorToString(err));
              });
          }}
          disabled={submitDisabled}
          loading={loading}
          content={submitLabel || "Submit"}
        />
      </Modal.Actions>
    </Modal>
  );
}
