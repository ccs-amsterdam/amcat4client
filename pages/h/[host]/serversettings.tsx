import { AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { Button, ButtonGroup, Confirm, Form, Message, Modal, Segment, Table } from "semantic-ui-react";
import { AmcatRole, AmcatRoles, AmcatUserInfo, useMiddlecatContext } from "../../../amcat4react";
import {
  addGlobalUser,
  changeGlobalUser,
  deleteGlobalUser,
  errorToString,
  listGlobalUsers,
} from "../../../amcat4react/Amcat";
import { useServerConfig } from "../../../amcat4react/hooks/useServerConfig";

export default function ServerSettings() {
  const { user } = useMiddlecatContext();
  const server = useServerConfig(user);
  const [deleteUserOpen, setDeleteUserOpen] = useState<AmcatUserInfo | undefined>(undefined);
  const users = useQuery(["global-users"], async () => user && (await listGlobalUsers(user)).data, {
    enabled: user != null,
    staleTime: 60000,
  });
  if (user == null || !server.data || !users.data) return;

  const doDeleteUser = () => {
    if (deleteUserOpen == null) return;
    deleteGlobalUser(user, deleteUserOpen.email).then(() => {
      setDeleteUserOpen(undefined);
      users.refetch();
    });
  };

  // TODO: In retrospect, I don't think the userform like this is the best way to do it.
  // Possible, a single userform and a 'edit user' state or something might be better?
  return (
    <>
      <h3>Server details</h3>
      Amcat API resource: {server.data.resource} <br />
      Authorization mode: {server.data.authorization} <br />
      Middlecat URL: {server.data.middlecat_url}
      <h3>Global users</h3>
      <UserForm
        trigger={<Button primary content="Add user" />}
        label="Add user"
        onSubmit={(u: AmcatUserInfo) => addGlobalUser(user, u)}
        onSuccess={() => {
          users.refetch();
        }}
      />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1} />
            <Table.HeaderCell content="Email" />
            <Table.HeaderCell content="Global role" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.data.map((u) => (
            <Table.Row key={u.email}>
              <Table.Cell>
                <ButtonGroup>
                  <Button icon="trash" basic color="red" onClick={() => setDeleteUserOpen(u)} />
                  <UserForm
                    label="Modify user"
                    disableEmail
                    user={u}
                    trigger={<Button icon="pencil" basic color="blue" />}
                    onSubmit={(u: AmcatUserInfo) => changeGlobalUser(user, u)}
                    onSuccess={() => users.refetch()}
                  />
                </ButtonGroup>
              </Table.Cell>
              <Table.Cell content={u.email} />
              <Table.Cell content={u.global_role} />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Confirm
        open={deleteUserOpen != null}
        onCancel={() => setDeleteUserOpen(undefined)}
        onConfirm={doDeleteUser}
        header="Confirm user delete"
        content={`This will delete the global server role for user ${deleteUserOpen?.email}`}
        confirmButton={`Delete ${deleteUserOpen?.email}`}
      />
    </>
  );
}

const NEW_USER = { global_role: "READER", email: "" } as AmcatUserInfo;

interface Props {
  onSubmit?: (user: AmcatUserInfo) => Promise<AxiosResponse>;
  onSuccess?: () => void;
  user?: AmcatUserInfo;
  label: string;
  trigger: React.ReactNode;
  disableEmail?: boolean;
}

function UserForm({ label, user, onSubmit, onSuccess, trigger, disableEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userState, setUserState] = useState(user || NEW_USER);

  return (
    <Modal
      open={open}
      trigger={trigger}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Modal.Header content={label} />
      <Modal.Content>
        <Form error={error.length > 0}>
          <Form.Field disabled={disableEmail}>
            <label>E-mail address</label>
            <Form.Input
              value={userState.email}
              placeholder="user@example.com"
              onChange={(_, { value }) => setUserState({ ...userState, email: value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Server role</label>
            <Form.Dropdown
              value={userState.global_role}
              options={ROLES}
              onChange={(_, { value }) => setUserState({ ...userState, global_role: value as AmcatRole })}
            />
          </Form.Field>{" "}
          <Message error content={error} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          positive
          onClick={() => {
            if (!onSubmit) return setOpen(false);
            setLoading(true);
            onSubmit(userState)
              .then(() => {
                setLoading(false);
                setError("");
                setOpen(false);
                if (onSuccess) onSuccess();
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
                setError(errorToString(err));
              });
          }}
          disabled={userState.email == null || userState.email.length === 0 || !/\S+@\S+\.\S+/.test(userState.email)}
          loading={loading}
          content={label}
        />
      </Modal.Actions>
    </Modal>
  );
}

const ROLES = [
  { key: "READER", value: "READER", text: "Reader (user can see and open indexes, but not create indexes or users)" },
  { key: "WRITER", value: "WRITER", text: "Writer (user can create but not modify indexes and cannot create users)" },
  { key: "ADMIN", value: "ADMIN", text: "Admin (user has full rights to this server)" },
];
