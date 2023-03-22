import { useRouter } from "next/router";
import { Dropdown, Menu } from "semantic-ui-react";
import { useMiddlecatContext } from "../../amcat4react";

export default function AccountMenu() {
  const router = useRouter();
  const { user } = useMiddlecatContext();
  return (
    <>
      {user != null ? (
        <Dropdown item text={`${user.name}@${new URL(user.resource).hostname}`}>
          <Dropdown.Menu>
            <Menu.Item disabled>
              Signed in as <br />
              <b>{user.email}</b>
            </Menu.Item>
            <Menu.Item onClick={() => router.push("/logout")}>Sign out</Menu.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
}
