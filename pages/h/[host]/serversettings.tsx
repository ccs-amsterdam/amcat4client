import { useState } from "react";
import { useQuery } from "react-query";
import { Button, ButtonGroup, Confirm, Table } from "semantic-ui-react";
import { AmcatUserInfo, useMiddlecatContext } from "../../../amcat4react";
import { addGlobalUser, changeGlobalUser, deleteGlobalUser, listGlobalUsers } from "../../../amcat4react/Amcat";
import ModalForm from "../../../amcat4react/components/User/ModalForm";
import UserForm from "../../../amcat4react/components/User/UserForm";
import { useServerConfig } from "../../../amcat4react/hooks/useServerConfig";

const NEW_USER = { role: "READER", email: "" } as AmcatUserInfo;

export default function ServerSettings() {
  const { user } = useMiddlecatContext();
  const server = useServerConfig(user);
  const [deleteUserOpen, setDeleteUserOpen] = useState<AmcatUserInfo | undefined>(undefined);
  const [newUser, setNewUser] = useState<AmcatUserInfo | undefined>();
  const [editUser, setEditUser] = useState<AmcatUserInfo | undefined>();
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

  return (
    <>
      <h3>Server details</h3>
      Amcat API resource: {server.data.resource} <br />
      Authorization mode: {server.data.authorization} <br />
      Middlecat URL: {server.data.middlecat_url}
      <h3>Global users</h3>
      <Button primary content="Add user" onClick={() => setNewUser(NEW_USER)} />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1} />
            <Table.HeaderCell content="Email" />
            <Table.HeaderCell content="Role" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.data.map((u) => (
            <Table.Row key={u.email}>
              <Table.Cell>
                <ButtonGroup>
                  <Button icon="trash" basic color="red" onClick={() => setDeleteUserOpen(u)} />
                  <Button icon="pencil" basic color="blue" onClick={() => setEditUser(u)} />
                </ButtonGroup>
              </Table.Cell>
              <Table.Cell content={u.email} />
              <Table.Cell content={u.role} />
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
      <ModalForm
        header="Edit User"
        open={editUser != null}
        onClose={() => setEditUser(undefined)}
        onSubmit={() => editUser && changeGlobalUser(user, editUser)}
        onSuccess={() => users.refetch()}
        submitDisabled={editUser?.email == null || editUser.email.length === 0 || !/\S+@\S+\.\S+/.test(editUser.email)}
      >
        <UserForm user={editUser} onChange={setEditUser} disableEmail />
      </ModalForm>
      <ModalForm
        header="Add User"
        open={newUser != null}
        onSubmit={() => newUser && addGlobalUser(user, newUser)}
        onSuccess={() => users.refetch()}
        onClose={() => setNewUser(undefined)}
        submitDisabled={newUser?.email == null || newUser.email.length === 0 || !/\S+@\S+\.\S+/.test(newUser.email)}
      >
        <UserForm user={newUser} onChange={setNewUser} />
      </ModalForm>
    </>
  );
}
