import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { Button, ButtonGroup, Confirm, Table } from "semantic-ui-react";
import { AmcatUserInfo, useMiddlecatContext } from "../../../../../amcat4react";
import { addIndexUser, changeIndexUser, deleteIndexUser, getIndexUsers } from "../../../../../amcat4react/Amcat";
import ModalForm from "../../../../../amcat4react/components/User/ModalForm";
import UserForm from "../../../../../amcat4react/components/User/UserForm";
const NEW_USER = { role: "READER", email: "" } as AmcatUserInfo;

export default function Users() {
  const router = useRouter();
  const index = router.query.i as string;
  const { user } = useMiddlecatContext();
  const [deleteUser, setDeleteUser] = useState<AmcatUserInfo>();
  const [newUser, setNewUser] = useState<AmcatUserInfo>();
  const [editUser, setEditUser] = useState<AmcatUserInfo>();

  const users = useQuery(["index-users", index], async () => user && (await getIndexUsers(user, index)).data, {
    enabled: user != null,
    staleTime: 60000,
  });
  if (user == null || !users.data) return null;

  const doDeleteUser = () =>
    deleteUser &&
    deleteIndexUser(user, index, deleteUser.email).then(() => {
      setDeleteUser(undefined);
      users.refetch();
    });

  return (
    <>
      <Button primary content="Add user" onClick={() => setNewUser(NEW_USER)} />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1} />
            <Table.HeaderCell content="Email" />
            <Table.HeaderCell content="Index role" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.data.map((u) => (
            <Table.Row key={u.email}>
              <Table.Cell>
                <ButtonGroup>
                  <Button
                    icon="trash"
                    basic
                    negative
                    onClick={() => {
                      setDeleteUser(u);
                    }}
                  />
                  <Button icon="pencil" basic primary onClick={() => setEditUser(u)} />
                </ButtonGroup>
              </Table.Cell>
              <Table.Cell content={u.email} />
              <Table.Cell content={u.role} />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <ModalForm
        header="Add User"
        open={newUser != null}
        onSubmit={() => newUser && addIndexUser(user, index, newUser)}
        onSuccess={() => users.refetch()}
        onClose={() => setNewUser(undefined)}
        submitDisabled={newUser?.email == null || newUser.email.length === 0 || !/\S+@\S+\.\S+/.test(newUser.email)}
      >
        <UserForm user={newUser} onChange={setNewUser} />
      </ModalForm>
      <Confirm
        open={deleteUser != null}
        onCancel={() => setDeleteUser(undefined)}
        onConfirm={doDeleteUser}
        header="Confirm user delete"
        content={`This will delete the global server role for user ${deleteUser?.email}`}
        confirmButton={`Delete ${deleteUser?.email}`}
      />
      <ModalForm
        header="Edit User"
        open={editUser != null}
        onClose={() => setEditUser(undefined)}
        onSubmit={() => editUser && changeIndexUser(user, index, editUser)}
        onSuccess={() => users.refetch()}
        submitDisabled={editUser?.email == null || editUser.email.length === 0 || !/\S+@\S+\.\S+/.test(editUser.email)}
      >
        <UserForm user={editUser} onChange={setEditUser} disableEmail />
      </ModalForm>
    </>
  );
}
