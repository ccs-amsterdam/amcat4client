import { Dropdown, Menu } from "semantic-ui-react";
import useUser from "../../hooks/useUser";

export default function AccountMenu() {
  const user = useUser();

  return (
    <>
      {user != null ? (
        <Dropdown item text={`${user.name}@${new URL(user.resource).hostname}`}>
          <Dropdown.Menu>
            <Menu.Item disabled>
              Signed in as <br />
              <b>{user.email}</b>
            </Menu.Item>
            <Menu.Item onClick={() => user.killSession(true)}>
              Sign out
            </Menu.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
}
