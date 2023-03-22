import { Dropdown, Menu, Image } from "semantic-ui-react";
import { useHasGlobalRole } from "../../amcat4react/hooks/useCurrentUserDetails";
import { link_host } from "../../functions/links";
import useUser from "../../hooks/useUser";

export default function AccountMenu() {
  const user = useUser();
  const is_admin = useHasGlobalRole(user, "ADMIN");

  //text={`${user.name}@${new URL(user.resource).hostname}`}
  return (
    <>
      {user != null ? (
        <Dropdown
          item
          trigger={
            <Image
              avatar
              src={user.image || "https://upload.wikimedia.org/wikipedia/commons/6/63/Man_Silhouette2.jpg"}
            />
          }
        >
          <Dropdown.Menu>
            {!is_admin ? null : (
              <Menu.Item href={`${link_host(user.resource)}/serversettings`}>Server settings</Menu.Item>
            )}
            <Menu.Item disabled>
              Signed in as <br />
              <b>{user.email || "guest"}</b>
            </Menu.Item>
            <Menu.Item onClick={() => user.killSession(true)}>Sign out</Menu.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
}
