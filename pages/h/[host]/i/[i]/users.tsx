import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { Button, ButtonGroup, Confirm, Table } from "semantic-ui-react";
import { AmcatUserInfo, useMiddlecatContext } from "../../../../../amcat4react";
import { getIndexUsers } from "../../../../../amcat4react/Amcat";

export default function Users() {
  const router = useRouter();
  const index = router.query.i as string;
  const { user } = useMiddlecatContext();
  const [deleteUser, setDeleteUser] = useState<AmcatUserInfo>();

  const users = useQuery(["index-users", index], async () => user && (await getIndexUsers(user, index)).data, {
    enabled: user != null,
    staleTime: 60000,
  });
  if (!users.data) return null;
  console.log(users);
  return (
    <>
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
                  <Button icon="trash" basic color="red" onClick={() => {}} />
                </ButtonGroup>
              </Table.Cell>
              <Table.Cell content={u.email} />
              <Table.Cell content={u.role} />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
